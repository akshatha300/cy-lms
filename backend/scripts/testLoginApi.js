import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const testLoginApi = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find admin user
    const admin = await User.findOne({ email: "admin@cy-lms.com" });
    
    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }
    
    console.log("✅ Admin found:", admin.email, admin.role);
    
    // Test password
    const isMatch = await bcrypt.compare("admin123", admin.password);
    console.log("✅ Password match:", isMatch);
    
    if (isMatch) {
      // Generate token like authController does
      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      
      const response = {
        message: "Login successful",
        user: {
          userId: admin.userId,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatarUrl: admin.avatarUrl,
          bio: admin.bio,
        },
        token: token
      };
      
      console.log("✅ Login response structure:");
      console.log(JSON.stringify(response, null, 2));
      
      // Test token verification
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verification successful:", decoded.id);
      } catch (e) {
        console.log("❌ Token verification failed:", e.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testLoginApi();
