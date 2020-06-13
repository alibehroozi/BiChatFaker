const SendReadyGen = require("../../store/models/SendReady");
const { nothingToDoMsg, sendOK } = require("../../constants/messages");
const commands = require("../../constants/commands");
const { endRequest } = require("../../helpers");

const onNewMessage = async ({
  chat: { id: chatId },
  message_id: requestId,
  text,
  mongoConnection,
  bot,
  eventEmitter,
}) => {
  if (text && commands.filter((command) => text.includes(command)).length)
    return;
  const SendReadyModel = SendReadyGen(mongoConnection);
  const userSendReady = await SendReadyModel.find({ chatId });
  if (userSendReady.length) {
    await SendReadyModel.deleteMany({ chatId });
    await bot.sendMessage(chatId, sendOK);
    const adminChatId = userSendReady[0].admin;
    await bot.forwardMessage(adminChatId, chatId, requestId);
  } else {
    await bot.sendMessage(chatId, nothingToDoMsg);
  }
  endRequest(eventEmitter, requestId);
};

module.exports = onNewMessage;
