import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";
import LabAttempt from "../models/LabAttempt.js";
import Skill from "../models/Skill.js";
import Docembbeding from "../models/Docembbeding.js";
import fs from "fs";
import path from "path";

dotenv.config();
await connectDB();

const clearCyberSecurityContent = async () => {
  try {
    console.log("🗑️  Starting cybersecurity content removal...\n");

    // Clear all labs
    const labsDeleted = await Lab.deleteMany({});
    console.log(`🗑️  Deleted ${labsDeleted.deletedCount} labs`);

    // Clear all lab attempts
    const attemptsDeleted = await LabAttempt.deleteMany({});
    console.log(`🗑️  Deleted ${attemptsDeleted.deletedCount} lab attempts`);

    // Clear cybersecurity skills (keep only AIML-related ones)
    const cyberSecuritySkills = [
      "Log Analysis",
      "Network Traffic Analysis", 
      "Vulnerability Assessment",
      "Privilege Escalation",
      "Incident Response",
      "Malware Analysis",
      "IAM (Identity & Access Management)",
      "Security Role"
    ];

    const skillsDeleted = await Skill.deleteMany({ 
      name: { $in: cyberSecuritySkills } 
    });
    console.log(`🗑️  Deleted ${skillsDeleted.deletedCount} cybersecurity skills`);

    // Clear RAG documents (cybersecurity_docs)
    const ragDeleted = await Docembbeding.deleteMany({});
    console.log(`🗑️  Deleted ${ragDeleted.deletedCount} RAG documents`);

    // Remove cybersecurity docs directory
    const cyberDocsPath = path.join(process.cwd(), "data/cybersecurity_docs");
    if (fs.existsSync(cyberDocsPath)) {
      fs.rmSync(cyberDocsPath, { recursive: true, force: true });
      console.log(`🗑️  Removed cybersecurity_docs directory`);
    }

    console.log("\n✨ Cybersecurity content removal complete!\n");
    console.log("Summary:");
    console.log(`  - Deleted ${labsDeleted.deletedCount} labs`);
    console.log(`  - Deleted ${attemptsDeleted.deletedCount} lab attempts`);
    console.log(`  - Deleted ${skillsDeleted.deletedCount} cybersecurity skills`);
    console.log(`  - Deleted ${ragDeleted.deletedCount} RAG documents`);
    console.log(`  - Removed cybersecurity_docs directory`);
    console.log("\n🎯 Your platform is now focused on AIML content only!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing cybersecurity content:", error);
    process.exit(1);
  }
};

clearCyberSecurityContent();
