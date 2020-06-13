const TelegramBot = require("node-telegram-bot-api");

const onStart = require("./events/start");
const onSetAdmin = require("./events/set_admin");
const onNewMessage = require("./events/new_message");

const initBot = (token) => {
  const bot = new TelegramBot(token);
  bot.onText(/\/start (.+)/, onStart);
  bot.onText(/\/setadmin (.+) (.+) (.+)/, onSetAdmin);
  bot.on("message", onNewMessage);
  return bot;
};

module.exports = initBot;
