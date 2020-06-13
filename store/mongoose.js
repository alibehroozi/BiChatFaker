const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: "bichat",
    pass: "4Kziq9UHiv3RPgDm",
  };
  const conn = await mongoose.createConnection(
    "mongodb+srv://cluster0-wrr6v.mongodb.net/bichat",
    options
  );
  console.log("connected");
  const AdminSchema = new Schema({
    chatId: String,
  });
  const Admin = conn.model("Admin", AdminSchema);
  const admin = new Admin();
  admin.chatId = "hi";
  await admin.save();
};
