const mongoose = require("mongoose");

async function connectDb(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
}

module.exports = { connectDb };
