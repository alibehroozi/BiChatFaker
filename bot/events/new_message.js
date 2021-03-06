const SendReadyGen = require("../../store/models/SendReady");
const AdminModelGen = require("../../store/models/Admin");
const { nothingToDoMsg, sendOK } = require("../../constants/messages");
const commands = require("../../constants/commands");
const { endRequest } = require("../../helpers");

const sendReply = async ({
  eventEmitter,
  requestId,
  username,
  mongoConnection,
  bot,
  chatId,
  text,
  reply_to_message,
}) => {
  const AdminModel = AdminModelGen(mongoConnection);
  const admin = await AdminModel.find({ chatId });
  if (admin.length && text) {
    const [chatIdOrigin, messageIdOrigin] = reply_to_message.text.split(" ");
    await bot.sendMessage(chatIdOrigin, `${chatId}\r\n${text}`, {
      reply_to_message_id: messageIdOrigin,
    });
    await bot.sendMessage(chatId, sendOK);
  } else {
    const adminChatId = reply_to_message.text.split(" ")[0];
    const { message_id } = await bot.forwardMessage(
      adminChatId,
      chatId,
      requestId
    );
    await bot.sendMessage(adminChatId, `${chatId} ${requestId} @${username}`, {
      reply_to_message_id: message_id,
    });
    await bot.sendMessage(chatId, sendOK);
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
    return;
  try {
    if (reply_to_message)
      return await sendReply({
        eventEmitter,
        requestId,
        username,
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
      await bot.sendMessage(
        adminChatId,
        `${chatId} ${requestId} @${username}`,
        {
          reply_to_message_id: message_id,
        }
      );
    } else {
      await bot.sendMessage(chatId, nothingToDoMsg);
    }
  } catch (error) {
    console.log(error);
  } finally {
    endRequest(eventEmitter, requestId);
  }
};

module.exports = onNewMessage;
