const mongoose = require("mongoose");
const env = require("./env");
const URI = env.MONGODB_URI;

const connectToDataBase = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Database is connect");
  } catch (error) {
    console.log("DataBase is  not Connect");
    process.exit(1);
  }
};

module.exports = connectToDataBase;
