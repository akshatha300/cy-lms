import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import SecurityRole from "../models/SecurityRole.js";
import Lab from "../models/Lab.js";

dotenv.config();
await connectDB();

const fixRoleLabs = async () => {
  try {
    console.log("🔬 Fixing role-lab assignments...\n");

    // Get all roles and labs
    const roles = await SecurityRole.find();
    const labs = await Lab.find();

    console.log(`Found ${roles.length} roles and ${labs.length} labs\n`);

    // Define role-to-lab mappings (3-4 labs per role based on career focus)
    const roleLabMappings = {
      "SOC Analyst L1": [
        "Identify Phishing Indicators",
        "Brute Force Detection Lab", 
        "Port Scan Detection",
        "Ransomware Incident Response"
      ],
      "Penetration Tester": [
        "Web Application Vulnerability Scan",
        "Linux Privilege Escalation",
        "SQL Injection Exploit Chain",
        "Port Scan Detection"
      ],
      "Cloud Security Engineer": [
        "AWS IAM Privilege Escalation",
        "Create a Strong Password",
        "Brute Force Detection Lab",
        "Static Malware Analysis"
      ],
      "Malware Analyst": [
        "Static Malware Analysis",
        "Ransomware Incident Response",
        "Identify Phishing Indicators",
        "Brute Force Detection Lab"
      ],
      "Incident Response Lead": [
        "Ransomware Incident Response",
        "Brute Force Detection Lab",
        "Port Scan Detection",
        "Static Malware Analysis"
      ],
      "Security Auditor": [
        "Web Application Vulnerability Scan",
        "AWS IAM Privilege Escalation",
        "Create a Strong Password",
        "Brute Force Detection Lab"
      ],
      "Security Architect": [
        "AWS IAM Privilege Escalation",
        "Web Application Vulnerability Scan",
        "SQL Injection Exploit Chain",
        "Ransomware Incident Response"
      ],
      "Digital Forensics Analyst": [
        "Static Malware Analysis",
        "Ransomware Incident Response",
        "Brute Force Detection Lab",
        "Identify Phishing Indicators"
      ],
      "Application Security Engineer": [
        "Web Application Vulnerability Scan",
        "SQL Injection Exploit Chain",
        "Linux Privilege Escalation",
        "Create a Strong Password"
      ],
      "Threat Intelligence Analyst": [
        "Static Malware Analysis",
        "Port Scan Detection",
        "Brute Force Detection Lab",
        "Identify Phishing Indicators"
      ]
    };

    // First, add assignedLabs field to SecurityRole schema if not exists
    try {
      await SecurityRole.updateMany(
        { assignedLabs: { $exists: false } },
        { $set: { assignedLabs: [], labCount: 0 } }
      );
    } catch (err) {
      // Field might already exist
    }

    // Process each role
    for (const role of roles) {
      const roleName = role.name;
      const labNames = roleLabMappings[roleName];

      if (!labNames) {
        console.log(`⚠️  No lab mapping for role: ${roleName}`);
        continue;
      }

      // Find lab IDs
      const labIds = [];
      for (const labName of labNames) {
        const lab = labs.find(l => l.name === labName);
        if (lab) {
          labIds.push(lab._id);
        } else {
          console.log(`⚠️  Lab not found: ${labName}`);
        }
      }

      // Update role
      if (labIds.length > 0) {
        await SecurityRole.findByIdAndUpdate(role._id, {
          assignedLabs: labIds,
          labCount: labIds.length
        });

        console.log(`✅ Fixed ${roleName}: ${labIds.length} labs`);
      }
    }

    console.log("\n✨ Role-lab assignments fixed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix error:", error);
    process.exit(1);
  }
};

fixRoleLabs();