const EventEmitter = require("events");
const { connect } = require("../store/mongoose");
const { listenToCallback } = require("../helpers");
const initBot = require("../bot/init");

const eventEmitter = new EventEmitter();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const token =
    process.env.BOT_TOKEN || "1228585907:AAETl_zF5stTFebOLog4xkErZU7YfHCARMk";
  const bot = initBot(token);
  const mongoConnection = await connect();
  body.message.mongoConnection = mongoConnection;
  body.message.bot = bot;
  body.message.eventEmitter = eventEmitter;
  const requestId = body.message.message_id;
  setTimeout(() => bot.processUpdate(body), 0);
  await listenToCallback(eventEmitter, requestId);
  return {
    statusCode: 200,
    body: "",
  };
};
