const mongoose = require("mongoose");

module.exports.connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: "bichat",
    pass: "4Kziq9UHiv3RPgDm",
  };
  const connection = await mongoose.createConnection(
    "mongodb+srv://cluster0-wrr6v.mongodb.net/bichat",
    options
  );
  return connection;
};
