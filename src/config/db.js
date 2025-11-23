const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://eyamo:ZB3Y9Kz732RrnNM9@backenddb.gbwra9c.mongodb.net/Node-API?appName=BackendDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
