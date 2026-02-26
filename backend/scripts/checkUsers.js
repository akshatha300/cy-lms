import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const checkUsers = async () => {
  try {
    const users = await User.find();
    console.log("=== USERS IN DATABASE ===");
    
    if (users.length === 0) {
      console.log("No users found in database");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Role: ${user.role || "Not specified"}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log("");
      });
    }
    
    console.log(`Total users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error checking users:", error);
    process.exit(1);
  }
};

checkUsers();
