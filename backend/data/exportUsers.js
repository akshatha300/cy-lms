// backend/data/exportUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

// Connect to LOCAL MongoDB to export users
const localConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/cy-lms");

const exportUsers = async () => {
  try {
    console.log("🔍 Connecting to local MongoDB...");
    
    const UserModel = localConnection.model("User", User.schema);
    const users = await UserModel.find({});
    
    console.log(`📤 Found ${users.length} users in local database`);
    
    // Save users to JSON file
    const fs = await import('fs/promises');
    await fs.writeFile('./users-export.json', JSON.stringify(users, null, 2));
    
    console.log("✅ Users exported to users-export.json");
    console.log("\n📋 Exported Users:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.primaryRole?.name || 'Not assigned'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Export error:", error);
    process.exit(1);
  }
};

exportUsers();