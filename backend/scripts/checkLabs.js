import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";

dotenv.config();
await connectDB();

try {
  console.log("Connected to MongoDB");
  
  const labs = await Lab.find({});
  console.log("All labs in database:");
  labs.forEach((lab, index) => {
    console.log(`${index + 1}. ${lab.name} (${lab._id})`);
  });
  
  process.exit(0);
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
