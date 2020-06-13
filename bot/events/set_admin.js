const { endRequest } = require("../../helpers");
const AdminModelGen = require("../../store/models/Admin");

const onSetAdmin = async (
  {
    chat: { id: chatId },
    message_id: requestId,
    mongoConnection,
    bot,
    eventEmitter,
  },
  match
) => {
  const givenPassword = match[1];
  const givenKey = match[2];
  const password = process.env.ADMIN_PASSWORD || "111";
  if (givenPassword === password) {
    const AdminModel = AdminModelGen(mongoConnection);
    await AdminModel.deleteMany({ chatId });
    const admin = new AdminModel();
    admin.chatId = chatId;
    admin.key = givenKey;
    await admin.save();
    await bot.sendMessage(chatId, "set");
  } else {
    await bot.sendMessage(chatId, "what?");
  }
  endRequest(eventEmitter, requestId);
};

module.exports = onSetAdmin;
