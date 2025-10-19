const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
