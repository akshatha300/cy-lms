import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import SecurityRole from "../models/SecurityRole.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const fixRoleModules = async () => {
  try {
    console.log("🔧 Fixing role-module assignments...\n");

    // Get all roles and modules
    const roles = await SecurityRole.find();
    const modules = await Module.find();

    console.log(`Found ${roles.length} roles and ${modules.length} modules\n`);

    // Define the role-module mappings (same as seeding script)
    const roleModuleMappings = {
  "SOC Analyst L1": [
    "Phishing Awareness",
    "Malware Basics", 
    "Social Engineering",
    "SIEM Fundamentals",
    "Incident Response Procedures"
  ],
  "Penetration Tester": [
    "Password Security",
    "Malware Basics",
    "Network Security Fundamentals",
    "Secure Coding Practices",
    "DevSecOps Fundamentals"
  ],
  "Cloud Security Engineer": [
    "Password Security",
    "Network Security Fundamentals",
    "Data Protection & Privacy",
    "Security Auditing",
    "DevSecOps Fundamentals"
  ],
  "Malware Analyst": [
    "Malware Basics",
    "Social Engineering",
    "Network Security Fundamentals",
    "Threat Intelligence Basics",
    "Incident Response Procedures"
  ],
  "Incident Response Lead": [
    "Phishing Awareness",
    "Malware Basics",
    "Social Engineering",
    "Incident Response Procedures",
    "Network Security Fundamentals"  // Using this instead of missing Risk Management
  ],
  "Security Auditor": [
    "Data Protection & Privacy",
    "Security Auditing",
    "Network Security Fundamentals",
    "Password Security",
    "Malware Basics"  // Using this instead of missing Risk Management
  ],
  "Security Architect": [
    "Network Security Fundamentals",
    "Data Protection & Privacy",
    "Security Auditing",
    "DevSecOps Fundamentals",
    "Password Security"  // Using this instead of missing Risk Management
  ],
  "Digital Forensics Analyst": [
    "Malware Basics",
    "Social Engineering",
    "Incident Response Procedures",
    "Data Protection & Privacy",
    "Threat Intelligence Basics"
  ],
  "Application Security Engineer": [
    "Password Security",
    "Secure Coding Practices",
    "DevSecOps Fundamentals",
    "Network Security Fundamentals",
    "Malware Basics"
  ],
  "Threat Intelligence Analyst": [
    "Threat Intelligence Basics",
    "Malware Basics",
    "Social Engineering",
    "Network Security Fundamentals",
    "Data Protection & Privacy"
  ]
};
    
      
      // ... add other roles as needed
    

    // Process each role
    for (const role of roles) {
      const roleName = role.name;
      const moduleTitles = roleModuleMappings[roleName];

      if (!moduleTitles) {
        console.log(`⚠️  No mapping for role: ${roleName}`);
        continue;
      }

      // Find module IDs
      const moduleIds = [];
      for (const moduleTitle of moduleTitles) {
        const module = modules.find(m => m.title === moduleTitle);
        if (module) {
          moduleIds.push(module._id);
        } else {
          console.log(`⚠️  Module not found: ${moduleTitle}`);
        }
      }

      // Update role
      if (moduleIds.length > 0) {
        await SecurityRole.findByIdAndUpdate(role._id, {
          assignedModules: moduleIds,
          moduleCount: moduleIds.length
        });

        console.log(`✅ Fixed ${roleName}: ${moduleIds.length} modules`);
      }
    }

    console.log("\n✨ Role-module assignments fixed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix error:", error);
    process.exit(1);
  }
};

fixRoleModules();