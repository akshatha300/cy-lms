import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@cy-lms.com" });
    if (existingAdmin) {
      console.log("❌ Admin account already exists!");
      process.exit(0);
    }

    // Get next user ID
    const Counter = mongoose.model("Counter");
    const counter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const admin = new User({
      name: "System Administrator",
      email: "admin@cy-lms.com",
      password: hashedPassword,
      role: "admin",
      userId: counter.seq,
      avatarUrl: "",
      bio: "System administrator for CY-LMS platform",
    });

    await admin.save();
    console.log("✅ Admin account created successfully!");
    console.log("📧 Email: admin@cy-lms.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
