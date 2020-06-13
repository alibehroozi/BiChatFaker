const SendReadyGen = require("../../store/models/SendReady");
const AdminModelGen = require("../../store/models/Admin");
const { nothingToDoMsg, sendOK } = require("../../constants/messages");
const commands = require("../../constants/commands");
const { endRequest } = require("../../helpers");

const onNewMessage = async ({
  chat: { id: chatId },
  from: { username },
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
    const { message_id } = await bot.forwardMessage(
      adminChatId,
      chatId,
      requestId
    );
    await bot.sendMessage(adminChatId, `@${username}`, {
      reply_to_message_id: message_id,
    });
  } else {
    await bot.sendMessage(chatId, nothingToDoMsg);
  }
  endRequest(eventEmitter, requestId);
};

module.exports = onNewMessage;
