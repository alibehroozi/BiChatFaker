const TelegramBot = require("node-telegram-bot-api");
const EventEmitter = require("events");

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
  async ({ chat: { id: chatId }, message_id: requestId }, match) => {
    const startID = match[1];
    if (myID === startID) {
      sendingReadyIDs[chatId] = true;
      await bot.sendMessage(chatId, afterStartMsg);
    } else {
      await bot.sendMessage(chatId, OKMsg);
    }
    endRequest(requestId);
  }
);

bot.on(
  "message",
  async ({ chat: { id: chatId, username }, message_id: requestId, text }) => {
    if (text.includes("/start")) return;
    console.log(text, "hi");
    if (sendingReadyIDs[chatId]) {
      sendingReadyIDs[chatId] = false;
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
  connect();
  const requestId = body.message.message_id;
  setTimeout(() => bot.processUpdate(body), 0);
  await listenToCallback(requestId);
  return {
    statusCode: 200,
    body: "",
  };
};
