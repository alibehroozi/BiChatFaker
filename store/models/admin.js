const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  chatId: String,
  key: String,
});

const Admin = (connection) => connection.model("Admin", AdminSchema);

module.exports = Admin;
