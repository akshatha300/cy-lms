import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find admin user
    const admin = await User.findOne({ email: "admin@cy-lms.com" });
    
    if (admin) {
      console.log("✅ Admin found:");
      console.log("📧 Email:", admin.email);
      console.log("👤 Name:", admin.name);
      console.log("🔑 Role:", admin.role);
      console.log("🆔 User ID:", admin.userId);
      console.log("🔐 Password exists:", !!admin.password);
      
      // Test password comparison
      const isMatch = await admin.matchPassword("admin123");
      console.log("🔍 Password match test:", isMatch);
      
    } else {
      console.log("❌ Admin account not found!");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmin();
