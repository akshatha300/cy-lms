import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";

dotenv.config();
await connectDB();

try {
  console.log("🗑️  Clearing all labs...");
  const result = await Lab.deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} labs`);
  process.exit(0);
} catch (error) {
  console.error("❌ Error clearing labs:", error);
  process.exit(1);
}
