const mongoose = require("mongoose");

module.exports.connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const conn = mongoose.createConnection(
    "mongodb+srv://bichat:4Kziq9UHiv3RPgDm@cluster0-wrr6v.mongodb.net/bichat",
    options
  );
  console.log("connected");
  const AdminSchema = new Schema({
    chatId: String,
  });
  const Admin = conn.model("Admin", AdminSchema);
  const admin = new Admin();
  admin.chatId = "hi";
  admin.save();
};
