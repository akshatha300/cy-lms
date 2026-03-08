import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createSingleUser } from "./seedUsers.js";

// Command line user creation
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log("Usage: node addUser.js <name> <email> <password> [role]");
  console.log("Example: node addUser.js \"John Doe\" john@example.com mypassword student");
  console.log("Roles: admin, student, instructor");
  process.exit(1);
}

const [name, email, password, role = "student"] = args;

const userData = {
  name,
  email,
  password,
  role,
  profile: {
    firstName: name.split(' ')[0] || name,
    lastName: name.split(' ').slice(1).join(' ') || '',
    bio: `User account for ${name}`,
    avatar: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: ""
  },
  preferences: {
    theme: "dark",
    notifications: true,
    emailUpdates: true,
    language: "english"
  },
  skills: [],
  experience: {
    years: 0,
    level: "beginner",
    currentRole: role
  }
};

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
  .then(() => {
    console.log("🔗 Connected to MongoDB");
    createSingleUser(userData)
      .then((success) => {
        if (success) {
          console.log(`\n✅ User created successfully!`);
          console.log(`📧 Email: ${email}`);
          console.log(`🔑 Password: ${password}`);
          console.log(`👤 Role: ${role}`);
        }
        process.exit(0);
      })
      .catch(() => process.exit(1));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
