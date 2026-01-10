import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const modules = [
  {
    title: "Phishing Awareness",
    description: "Learn to identify phishing attacks and suspicious emails.",
    difficulty: 1,
    tags: ["phishing"]
  },
  {
    title: "Password Security",
    description: "Understand strong passwords and multi-factor authentication.",
    difficulty: 1,
    tags: ["password-security"]
  },
  {
    title: "Malware Basics",
    description: "Recognize malware, spyware, ransomware, and prevention tips.",
    difficulty: 2,
    tags: ["malware"]
  },
  {
    title: "Social Engineering",
    description: "Detect human manipulation techniques used by attackers.",
    difficulty: 2,
    tags: ["social-engineering"]
  },
  {
    title: "Data Protection & Privacy",
    description: "Learn best practices for protecting sensitive data and understanding privacy regulations like GDPR.",
    difficulty: 2,
    tags: ["data-protection", "privacy", "gdpr"]
  },
  {
    title: "Network Security Fundamentals",
    description: "Explore firewalls, VPNs, encryption, and secure network architecture.",
    difficulty: 3,
    tags: ["network-security", "encryption", "vpn"]
  }
];

async function seed() {
  try {
    await Module.deleteMany();
    console.log("Old modules removed.");

    await Module.insertMany(modules);
    console.log("New modules added.");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
