const TelegramBot = require("node-telegram-bot-api");
const EventEmitter = require("events");
const AdminModelGen = require("../store/models/Admin");
const SendReadyGen = require("../store/models/SendReady");

const password = "111";
const commands = ["/start", "/setadmin"];
const eventEmitter = new EventEmitter();

const { connect } = require("../store/mongoose");

const endRequest = (requestNumber) => {
  console.log(requestNumber);
  eventEmitter.emit(`end-${requestNumber}`);
};

const listenToCallback = (requestNumber) => {
  return new Promise((resolve) => {
    eventEmitter.once(`end-${requestNumber}`, () => {
      console.log(requestNumber, "ended");
      resolve();
    });
  });
};

const afterStartMsg = `در حال ارسال پیام ناشناس به ALI هستی.

می‌تونی هر حرف یا انتقادی که تو دلت هست رو بگی چون پیامت به صورت کاملا ناشناس ارسال می‌شه!`;

const OKMsg = `حله!

چه کاری برات انجام بدم؟`;

const sendOK = `پیام شما ارسال شد 😊

چه کاری برات انجام بدم؟`;

const nothingToDoMsg = `متوجه نشدم :/

چه کاری برات انجام بدم؟`;

const myID = "gp-32778-zP3UIoF";

const token = "1228585907:AAETl_zF5stTFebOLog4xkErZU7YfHCARMk";

const bot = new TelegramBot(token);

const sendingReadyIDs = {};

bot.onText(
  /\/start (.+)/,
  async (
    { chat: { id: chatId }, message_id: requestId, mongoConnection },
    match
  ) => {
    const startID = match[1];
    const AdminModel = AdminModelGen(mongoConnection);
    const targetAdmin = await AdminModel.find({ key: startID });
    if (targetAdmin.length) {
      const SendReadyModel = SendReadyGen(mongoConnection);
      await SendReadyModel.deleteMany({ chatId });
      const sendReady = new SendReadyModel();
      sendReady.chatId = chatId;
      sendReady.admin = targetAdmin[0].chatId;
      await sendReady.save();
      await bot.sendMessage(chatId, afterStartMsg);
    } else {
      await bot.sendMessage(chatId, OKMsg);
    }
    endRequest(requestId);
  }
);

bot.onText(
  /\/setadmin (.+) (.+)/,
  async (
    { chat: { id: chatId }, message_id: requestId, mongoConnection },
    match
  ) => {
    const givenPassword = match[1];
    const givenKey = match[2];
    if (givenPassword === password) {
      const AdminModel = AdminModelGen(mongoConnection);
      await AdminModel.deleteMany({ chatId });
      const admin = new AdminModel();
      admin.chatId = chatId;
      admin.key = givenKey;
      await admin.save();
      await bot.sendMessage(chatId, "set");
    } else {
      await bot.sendMessage(chatId, "what?");
    }
    endRequest(requestId);
  }
);

bot.on(
  "message",
  async ({
    chat: { id: chatId, username },
    message_id: requestId,
    text,
    mongoConnection,
  }) => {
    if (commands.filter((command) => text.includes(command)).length) return;
    const SendReadyModel = SendReadyGen(mongoConnection);
    const userSendReady = await SendReadyModel.find({ chatId });
    if (userSendReady.length) {
      await SendReadyModel.deleteMany({ chatId });
      await bot.sendMessage(chatId, sendOK);
    } else {
      await bot.sendMessage(chatId, nothingToDoMsg);
    }
    endRequest(requestId);
  }
);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body);
  const mongoConnection = await connect();
  body.message.mongoConnection = mongoConnection;
  const requestId = body.message.message_id;
  setTimeout(() => bot.processUpdate(body), 0);
  await listenToCallback(requestId);
  return {
    statusCode: 200,
    body: "",
  };
};
