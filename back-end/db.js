import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MongoDB_URI;
    
    if (!mongoURI) {
      console.error("❌ MongoDB_URI is not set in environment variables");
      return;
    }
    
    // Handle connection string - if it has query params, append DB name before them
    let connectionString;
    if (mongoURI.includes('?')) {
      // Connection string already has query params, insert DB name before the ?
      // Remove trailing slash if present, then add DB name
      const baseURI = mongoURI.split('?')[0].replace(/\/$/, '');
      const queryParams = mongoURI.split('?')[1];
      connectionString = `${baseURI}/${DB_NAME}?${queryParams}`;
    } else {
      // No query params, just append DB name (remove trailing slash if present)
      connectionString = `${mongoURI.replace(/\/$/, '')}/${DB_NAME}`;
    }
    
    console.log("🔗 Connecting to MongoDB...");
    console.log("Connection string:", connectionString.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(connectionString);
    console.log("📦 MongoDB Connected");
  } catch (err) {
    console.log("Connection failed:", err.message);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("Mongoose Disconnected Successfully!");
};

export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};