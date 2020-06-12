const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

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

const bot = new TelegramBot(token, { polling: true });

const sendingReadyIDs = {};

bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const startID = match[1];
  if (myID === startID) {
    sendingReadyIDs[chatId] = true;
    bot.sendMessage(chatId, afterStartMsg);
  } else {
    bot.sendMessage(chatId, OKMsg);
  }
  return false;
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const text = msg.text;
  if (text.includes("/start")) return;
  if (sendingReadyIDs[chatId]) {
    fs.appendFileSync("msgs.txt", `${username}: ${text}\r\n`);
    sendingReadyIDs[chatId] = false;
    bot.sendMessage(chatId, sendOK);
  } else {
    bot.sendMessage(chatId, nothingToDoMsg);
  }
});

exports.handler = async (event) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return { statusCode: 200, body: "" };
};
