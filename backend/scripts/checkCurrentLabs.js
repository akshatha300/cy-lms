import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";

dotenv.config();
await connectDB();

const checkCurrentLabs = async () => {
  try {
    const labs = await Lab.find();
    console.log("=== CURRENT LABS IN DATABASE ===");
    
    if (labs.length === 0) {
      console.log("No labs found in database");
    } else {
      labs.forEach((lab, index) => {
        console.log(`${index + 1}. ${lab.name}`);
        console.log(`   Description: ${lab.description}`);
        console.log(`   Tags: ${lab.tags?.join(", ") || "None"}`);
        console.log(`   Difficulty: ${lab.difficulty}`);
        console.log("");
      });
    }
    
    console.log(`Total labs: ${labs.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error checking labs:", error);
    process.exit(1);
  }
};

checkCurrentLabs();
