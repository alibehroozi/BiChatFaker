const mongoose = require("mongoose");

let mongoCache;

module.exports.connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    user: process.env.MONGO_USER || "XXX",
    pass: process.env.MONGO_PASS || "XXX",
  };
  const mongoURI = process.env.MONGO_URI || "mongodb+srv://XXX.mongodb.net/XXX";
  const connection =
    mongoCache || (await mongoose.createConnection(mongoURI, options));
  mongoCache = connection;
  return connection;
};
