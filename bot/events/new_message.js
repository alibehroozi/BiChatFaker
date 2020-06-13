const SendReadyGen = require("../../store/models/SendReady");
const AdminModelGen = require("../../store/models/Admin");
const { nothingToDoMsg, sendOK } = require("../../constants/messages");
const commands = require("../../constants/commands");
const { endRequest } = require("../../helpers");

const sendReply = async ({
  eventEmitter,
  requestId,
  mongoConnection,
  bot,
  chatId,
  text,
  reply_to_message,
}) => {
  const AdminModel = AdminModelGen(mongoConnection);
  const admin = AdminModel.find({ chatId });
  if (admin.length) {
    await bot.sendMessage(reply_to_message.chat.id, text, {
      reply_to_message_id: reply_to_message.message.message_id,
    });
  }
  endRequest(eventEmitter, requestId);
};

const onNewMessage = async ({
  chat: { id: chatId },
  from: { username },
  reply_to_message,
  message_id: requestId,
  text,
  mongoConnection,
  bot,
  eventEmitter,
}) => {
  if (text && commands.filter((command) => text.includes(command)).length)
    return endRequest(eventEmitter, requestId);
  if (text && reply_to_message)
    return await sendReply({
      eventEmitter,
      requestId,
      mongoConnection,
      bot,
      chatId,
      text,
      reply_to_message,
    });
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
