// backend/data/seedSkills.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Skill from "../models/Skill.js";

dotenv.config();
await connectDB();

const seedSkills = async () => {
  try {
    console.log("🎯 Starting skills seed...\n");

    const skillsData = [
      // Core SOC Skills
      { name: "Log Analysis", description: "Analyzing system and security logs for threats" },
      { name: "Network Traffic Analysis", description: "Examining network packets and traffic patterns" },
      { name: "Incident Response", description: "Responding to security incidents and breaches" },
      { name: "Threat Intelligence", description: "Gathering and analyzing threat information" },
      
      // Core Pentesting Skills
      { name: "Vulnerability Assessment", description: "Identifying and evaluating security vulnerabilities" },
      { name: "Privilege Escalation", description: "Gaining higher-level system access" },
      { name: "Exploit Development", description: "Creating and modifying exploits" },
      
      // Security Operations Skills
      { name: "IAM (Identity & Access Management)", description: "Managing user identities and access rights" },
      { name: "Malware Analysis", description: "Analyzing malicious software and code" },
      
      // Additional Skills
      { name: "SIEM Operations", description: "Security Information and Event Management" },
      { name: "Digital Forensics", description: "Investigating digital evidence and artifacts" },
      { name: "Penetration Testing", description: "Authorized security testing of systems" },
      { name: "Security Monitoring", description: "Continuous surveillance of security systems" },
      { name: "Risk Assessment", description: "Evaluating and prioritizing security risks" }
    ];

    console.log(`📚 Creating ${skillsData.length} skills...`);

    for (const skillData of skillsData) {
      const existing = await Skill.findOne({ name: skillData.name });
      if (!existing) {
        await Skill.create(skillData);
        console.log(`✅ Created skill: ${skillData.name}`);
      } else {
        console.log(`⏭️  Skill already exists: ${skillData.name}`);
      }
    }

    console.log("\n✨ Skills seed complete!\n");
    console.log(`Summary:`);
    console.log(`  - Created ${skillsData.length} cybersecurity skills`);
    console.log(`  - Ready for lab assignment\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedSkills();