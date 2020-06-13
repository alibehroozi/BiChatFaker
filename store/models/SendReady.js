const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SendReadySchema = new Schema({
  chatId: { type: String },
  admin: { type: String },
});

const SendReady = (connection) =>
  connection.model("SendReady", SendReadySchema);

module.exports = SendReady;
