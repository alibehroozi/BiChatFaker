const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  chatId: { type: String, unique: true },
  key: String,
  name: String,
});

const Admin = (connection) => connection.model("Admin", AdminSchema);

module.exports = Admin;
