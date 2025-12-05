import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MONGO_URL is missing in .env");
  //return; isma illegal return , mil le5ir ma t7otha ken ki tibda l clause wist fct
  process.exit(1);
}
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
    // ta3rfou 3leh hetha , 5atir ken t7otou ken return juste tsop l db connection w lbe9i yo93od ydour
    //which is not we want n7ibou ki fama problem lkolha tshuti down thats why
  }
};

export default connectDB;
