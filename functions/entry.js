const fs = require("fs");
const Telegraf = require("telegraf");

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

const bot = new Telegraf(token);

const sendingReadyIDs = {};

bot.command("start", ({ message: startID, reply }) => {
  const chatId = msg.chat.id;
  if (myID === startID) {
    sendingReadyIDs[chatId] = true;
    reply(afterStartMsg);
  } else {
    reply(OKMsg);
  }
});

bot.on("text", ({ message: text, reply, chat: { username } }) => {
  if (text.includes("/start")) return;
  if (sendingReadyIDs[chatId]) {
    fs.appendFileSync("msgs.txt", `${username}: ${text}\r\n`);
    sendingReadyIDs[chatId] = false;
    reply(sendOK);
  } else {
    reply(nothingToDoMsg);
  }
});

exports.handler = async (event) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return { statusCode: 200, body: "" };
};
