import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const checkModules = async () => {
  try {
    const modules = await Module.find();
    console.log("=== CURRENT MODULES IN DATABASE ===");
    
    if (modules.length === 0) {
      console.log("No modules found in database");
    } else {
      modules.forEach((module, index) => {
        console.log(`${index + 1}. ${module.title}`);
        console.log(`   Description: ${module.description?.substring(0, 100)}...`);
        console.log(`   Difficulty: ${module.difficulty || "Not specified"}`);
        console.log(`   Tags: ${module.tags?.join(", ") || "None"}`);
        console.log("");
      });
    }
    
    console.log(`Total modules: ${modules.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error checking modules:", error);
    process.exit(1);
  }
};

checkModules();
