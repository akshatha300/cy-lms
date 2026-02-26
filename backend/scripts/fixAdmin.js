import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const fixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find and update admin with properly hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    
    const admin = await User.findOneAndUpdate(
      { email: "admin@cy-lms.com" },
      { 
        password: hashedPassword,
        $set: { password: hashedPassword } // Force update without pre-save hook
      },
      { new: true, runValidators: false }
    );
    
    if (admin) {
      console.log("✅ Admin password fixed!");
      
      // Test password comparison
      const isMatch = await admin.matchPassword("admin123");
      console.log("🔍 Password match test:", isMatch);
      
      console.log("📧 Email: admin@cy-lms.com");
      console.log("🔑 Password: admin123");
      console.log("✅ Try logging in now!");
      
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

fixAdmin();
