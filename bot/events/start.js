const AdminModelGen = require("../../store/models/Admin");
const SendReadyGen = require("../../store/models/SendReady");
const { afterStartMsg, okMsg } = require("../../constants/messages");
const { endRequest } = require("../../helpers");

const onStart = async (
  {
    eventEmitter,
    message_id: requestId,
    chat: { id: chatId },
    mongoConnection,
    bot,
  },
  match
) => {
  const startID = match[1].trim();
  if (!startID.length) {
    await bot.sendMessage(chatId, okMsg);
    return endRequest(eventEmitter, requestId);
  }
  const AdminModel = AdminModelGen(mongoConnection);
  const targetAdmin = await AdminModel.find({ key: startID });
  if (targetAdmin.length) {
    const SendReadyModel = SendReadyGen(mongoConnection);
    await SendReadyModel.deleteMany({ chatId });
    const sendReady = new SendReadyModel();
    sendReady.chatId = chatId;
    sendReady.admin = targetAdmin[0].chatId;
    await sendReady.save();
    await bot.sendMessage(chatId, afterStartMsg(targetAdmin[0].name));
  } else {
    await bot.sendMessage(chatId, okMsg);
  }
  endRequest(eventEmitter, requestId);
};

module.exports = onStart;
