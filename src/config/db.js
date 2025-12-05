import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MONGO_URL is missing in .env");
  return;
}
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
