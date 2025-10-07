import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MongoDB_URI}/${DB_NAME}`);
    console.log("📦 MongoDB Connected");
  } catch (err) {
    console.log("Connection failed:", err);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("Mongoose Disconnected Successfully!");
};

export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};