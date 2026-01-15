import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import SecurityRole from "../models/SecurityRole.js";
import Skill from "../models/Skill.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

/**
 * Seed script: Creates realistic security roles, skills, and mappings
 */

const seedData = async () => {
  try {
    console.log("🌱 Starting role-based learning system seed...\n");

    // Clear existing data (optional - comment out if you want to preserve)
    // await SecurityRole.deleteMany();
    // await Skill.deleteMany();

    // ===== SKILLS =====
    const skillsData = [
      {
        name: "Log Analysis",
        description: "Analyze and interpret security logs to detect threats",
        difficulty: 2,
        requiredLabCount: 2,
        assessmentType: "both",
        estimatedHours: 12,
        tags: ["soc", "logging", "detection"],
      },
      {
        name: "Network Traffic Analysis",
        description: "Analyze network packets and flows for security events",
        difficulty: 3,
        requiredLabCount: 2,
        assessmentType: "both",
        estimatedHours: 16,
        tags: ["soc", "network", "detection"],
      },
      {
        name: "Threat Hunting",
        description: "Proactively search for threats in network and system data",
        difficulty: 3,
        requiredLabCount: 3,
        assessmentType: "lab",
        estimatedHours: 20,
        tags: ["soc", "hunting"],
      },
      {
        name: "Vulnerability Assessment",
        description: "Identify and evaluate security vulnerabilities in systems",
        difficulty: 2,
        requiredLabCount: 3,
        assessmentType: "both",
        estimatedHours: 14,
        tags: ["pentest", "assessment"],
      },
      {
        name: "Exploit Development",
        description: "Develop working exploits for known vulnerabilities",
        difficulty: 4,
        requiredLabCount: 4,
        assessmentType: "lab",
        estimatedHours: 30,
        tags: ["pentest", "offensive"],
      },
      {
        name: "Privilege Escalation",
        description: "Techniques to gain higher privileges on compromised systems",
        difficulty: 3,
        requiredLabCount: 3,
        assessmentType: "lab",
        estimatedHours: 18,
        tags: ["pentest", "post-compromise"],
      },
      {
        name: "Cloud Security Architecture",
        description: "Design secure cloud infrastructure and deployments",
        difficulty: 3,
        requiredLabCount: 2,
        assessmentType: "both",
        estimatedHours: 20,
        tags: ["cloud", "architecture"],
      },
      {
        name: "IAM (Identity & Access Management)",
        description: "Manage identities and access controls in enterprise systems",
        difficulty: 2,
        requiredLabCount: 2,
        assessmentType: "both",
        estimatedHours: 12,
        tags: ["cloud", "governance", "access"],
      },
      {
        name: "Incident Response",
        description: "Respond to and contain security incidents effectively",
        difficulty: 3,
        requiredLabCount: 2,
        assessmentType: "both",
        estimatedHours: 16,
        tags: ["soc", "incident-response"],
      },
      {
        name: "Malware Analysis",
        description: "Analyze and understand malware behavior and tactics",
        difficulty: 4,
        requiredLabCount: 3,
        assessmentType: "lab",
        estimatedHours: 24,
        tags: ["soc", "analysis"],
      },
    ];

    
        console.log(`📚 Creating ${skillsData.length} skills...`);
    let createdSkills;
    try {
      createdSkills = await Skill.insertMany(skillsData, { ordered: false });
    } catch (err) {
      if (err.code === 11000) {
        console.warn("⚠️  Some skills already exist, fetching existing skills...");
        // Get all existing skills by name
        const skillNames = skillsData.map(s => s.name);
        createdSkills = await Skill.find({ name: { $in: skillNames } });
      } else {
        throw err;
      }
    }

    console.log(`✅ Created/found ${createdSkills.length} skills\n`);

    console.log(`✅ Created/found ${createdSkills.length} skills\n`);

    // ===== ROLES =====
    const rolesData = [
      {
        name: "SOC Analyst L1",
        description:
          "Monitor and analyze security events, detect threats, respond to alerts",
        seniority: "entry",
        requiredLabCount: 6,
        estimatedHoursToComplete: 60,
        tags: ["soc", "entry-level"],
        requiredSkills: createdSkills
          .filter((s) => ["Log Analysis", "Network Traffic Analysis", "Incident Response"].includes(s.name))
          .map((s) => s._id),
      },
      {
        name: "Penetration Tester",
        description:
          "Conduct authorized security testing, find vulnerabilities, develop exploits",
        seniority: "mid",
        requiredLabCount: 10,
        estimatedHoursToComplete: 100,
        tags: ["pentest", "offensive"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Vulnerability Assessment",
              "Exploit Development",
              "Privilege Escalation",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Cloud Security Engineer",
        description: "Design, implement, and maintain secure cloud infrastructure",
        seniority: "mid",
        requiredLabCount: 8,
        estimatedHoursToComplete: 80,
        tags: ["cloud", "infrastructure"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Cloud Security Architecture",
              "IAM (Identity & Access Management)",
              "Threat Hunting",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Malware Analyst",
        description: "Analyze malware samples, understand tactics, extract IOCs",
        seniority: "mid",
        requiredLabCount: 9,
        estimatedHoursToComplete: 90,
        tags: ["soc", "analysis"],
        requiredSkills: createdSkills
          .filter((s) =>
            ["Malware Analysis", "Threat Hunting", "Log Analysis"].includes(
              s.name
            )
          )
          .map((s) => s._id),
      },
      {
        name: "Incident Response Lead",
        description: "Lead incident response efforts, coordinate team, guide remediation",
        seniority: "senior",
        requiredLabCount: 8,
        estimatedHoursToComplete: 100,
        tags: ["soc", "incident-response", "leadership"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Incident Response",
              "Threat Hunting",
              "Malware Analysis",
              "Log Analysis",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
           {
        name: "Security Auditor",
        description: "Conduct comprehensive security assessments, ensure compliance, identify gaps",
        seniority: "mid",
        requiredLabCount: 12,
        estimatedHoursToComplete: 120,
        tags: ["governance", "compliance", "assessment"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Vulnerability Assessment",
              "Network Traffic Analysis",
              "Log Analysis",
              "IAM (Identity & Access Management)",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Security Architect",
        description: "Design secure systems, create security frameworks, lead security strategy",
        seniority: "senior",
        requiredLabCount: 15,
        estimatedHoursToComplete: 150,
        tags: ["architecture", "strategy", "leadership"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Cloud Security Architecture",
              "IAM (Identity & Access Management)",
              "Vulnerability Assessment",
              "Threat Hunting",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Digital Forensics Analyst",
        description: "Investigate security incidents, collect evidence, analyze digital artifacts",
        seniority: "mid",
        requiredLabCount: 10,
        estimatedHoursToComplete: 110,
        tags: ["forensics", "investigation", "incident-response"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Malware Analysis",
              "Log Analysis",
              "Network Traffic Analysis",
              "Incident Response",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Application Security Engineer",
        description: "Secure software development, code review, vulnerability management",
        seniority: "mid",
        requiredLabCount: 11,
        estimatedHoursToComplete: 100,
        tags: ["development", "secure-coding", "devsecops"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Vulnerability Assessment",
              "Exploit Development",
              "Threat Hunting",
            ].includes(s.name)
          )
          .map((s) => s._id),
      },
      {
        name: "Threat Intelligence Analyst",
        description: "Analyze threat actors, monitor emerging threats, provide strategic insights",
        seniority: "mid",
        requiredLabCount: 9,
        estimatedHoursToComplete: 95,
        tags: ["intelligence", "analysis", "strategy"],
        requiredSkills: createdSkills
          .filter((s) =>
            [
              "Threat Hunting",
              "Malware Analysis",
              "Network Traffic Analysis",
              "Log Analysis",
            ].includes(s.name)
          )
          .map((s) => s._id),
      }, 
    ];

    console.log(`🎯 Creating ${rolesData.length} security roles...`);
    const createdRoles = await SecurityRole.insertMany(rolesData, { ordered: false }).catch(
      (err) => {
        if (err.code === 11000) {
          console.warn("⚠️  Some roles already exist, continuing...");
          return rolesData.map((role) => new SecurityRole(role));
        }
        throw err;
      }
    );

    console.log(`✅ Created/found ${createdRoles.length} roles\n`);

    // ===== ROLE -> MODULE MAPPING =====
    console.log("🔗 Linking modules to skills...");

    // Get existing modules
    const modules = await Module.find();
    console.log(`Found ${modules.length} existing modules\n`);

    // Map modules to skills based on tags
    const moduleSkillMapping = {
      "Phishing Awareness": ["Log Analysis", "Threat Hunting"],
      "Password Security": ["IAM (Identity & Access Management)"],
      "Malware Basics": ["Malware Analysis", "Threat Hunting"],
      "Social Engineering": ["Incident Response"],
    };

        for (const [moduleName, skillNames] of Object.entries(moduleSkillMapping)) {
      const module = modules.find((m) => m.title === moduleName);
      if (!module) continue;

      for (const skillName of skillNames) {
        const skill = createdSkills.find((s) => s.name === skillName);
        if (!skill) continue;

        // Check if module is already linked
        if (!skill.requiredModules.includes(module._id)) {
          try {
            skill.requiredModules.push(module._id);
            await skill.save();
            console.log(`✅ Linked "${moduleName}" to "${skillName}"`);
          } catch (saveError) {
            if (saveError.code === 11000) {
              console.log(`ℹ️  "${moduleName}" already linked to "${skillName}"`);
            } else {
              console.warn(`⚠️  Could not link "${moduleName}" to "${skillName}":`, saveError.message);
            }
          }
        } else {
          console.log(`ℹ️  "${moduleName}" already linked to "${skillName}"`);
        }
      }
    }
        // ===== ROLE -> MODULE MAPPING =====
    console.log("🔗 Assigning modules to roles...");

    // Define role-to-module mappings (5 modules per role)
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
        "Risk Management Fundamentals"
      ],
      "Security Auditor": [
        "Data Protection & Privacy",
        "Security Auditing",
        "Risk Management Fundamentals",
        "Network Security Fundamentals",
        "Password Security"
      ],
      "Security Architect": [
        "Network Security Fundamentals",
        "Data Protection & Privacy",
        "Security Auditing",
        "Risk Management Fundamentals",
        "DevSecOps Fundamentals"
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

    // Process each role
    for (const role of createdRoles) {
      const roleName = role.name;
      const moduleTitles = roleModuleMappings[roleName];

      if (!moduleTitles) {
        console.warn(`⚠️  No module mapping found for role: ${roleName}`);
        continue;
      }

      // Find module IDs for this role
      const moduleIds = [];
      for (const moduleTitle of moduleTitles) {
        const module = modules.find(m => m.title === moduleTitle);
        if (module) {
          moduleIds.push(module._id);
        } else {
          console.warn(`⚠️  Module not found: ${moduleTitle}`);
        }
      }

      // Update role with assigned modules
      if (moduleIds.length > 0) {
        await SecurityRole.findByIdAndUpdate(role._id, {
          assignedModules: moduleIds,
          moduleCount: moduleIds.length
        });

        console.log(`✅ Assigned ${moduleIds.length} modules to "${roleName}":`);
        moduleTitles.forEach(title => {
          const module = modules.find(m => m.title === title);
          if (module) {
            console.log(`   - ${title}`);
          }
        });
        console.log("");
      }
    }

    console.log("✨ Role-to-module mapping complete!");

    console.log("\n✨ Seed complete!\n");
    console.log("Summary:");
    console.log(`  - Created ${createdSkills.length} skills`);
    console.log(`  - Created ${createdRoles.length} security roles`);
    console.log("\nYou can now:");
    console.log("  1. Visit /role-selector to choose a role");
    console.log("  2. Track your job readiness score");
    console.log("  3. Complete skills to improve your readiness level\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
