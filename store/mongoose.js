const mongoose = require("mongoose");

module.exports.connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(
    "mongodb+srv://bichat:4Kziq9UHiv3RPgDm@cluster0-wrr6v.mongodb.net/bichat",
    options
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
};
