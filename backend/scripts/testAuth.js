import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const testAuth = async () => {
  try {
    console.log("🧪 Testing authentication...");
    
    // 1. Find admin user
    const admin = await User.findOne({ email: "admin@cy-lms.com" });
    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }
    
    console.log("✅ Admin found:", admin.email, admin.role);
    
    // 2. Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    console.log("✅ Token generated:", token.substring(0, 50) + "...");
    
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, user ID:", decoded.id);
    
    // 4. Find user by decoded ID
    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ User found by token:", user?.email, user?.role);
    
  } catch (error) {
    console.error("❌ Auth test failed:", error.message);
  }
};

testAuth();
