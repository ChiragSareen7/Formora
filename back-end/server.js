import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, isConnected } from "./db.js";
import routes from "./routes/route.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use("/api", routes); 

const port = 8080;

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}/`);
  if (isConnected()) {
    console.log("📦 MongoDB Connected with Server, Successfully!");
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Server started successfully");
});
