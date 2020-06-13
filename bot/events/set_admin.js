const { endRequest } = require("../../helpers");
const AdminModelGen = require("../../store/models/Admin");

const onSetAdmin = async (
  { chat: { id: chatId }, mongoConnection, bot },
  match
) => {
  const givenPassword = match[1];
  const givenKey = match[2];
  const adminName = match[3];
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
