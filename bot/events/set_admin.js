const { endRequest } = require("../../helpers");
const AdminModelGen = require("../../store/models/Admin");

const onSetAdmin = async (
  {
    eventEmitter,
    message_id: requestId,
    chat: { id: chatId },
    mongoConnection,
    bot,
  },
  match
) => {
  const matches = match[1].split(" ");
  if (matches.length !== 3) return endRequest(eventEmitter, requestId);
  const givenPassword = matches[0];
  const givenKey = matches[1];
  const adminName = matches[2];
  const password = process.env.ADMIN_PASSWORD || "XXX";
  if (givenPassword === password) {
    const AdminModel = AdminModelGen(mongoConnection);
    await AdminModel.deleteMany({ chatId });
    const admin = new AdminModel();
    admin.chatId = chatId;
    admin.key = givenKey;
    admin.name = adminName;
    await admin.save();
    await bot.sendMessage(chatId, "set");
  } else {
    await bot.sendMessage(chatId, "what?");
  }
};

module.exports = onSetAdmin;
