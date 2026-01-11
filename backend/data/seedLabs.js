import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";
import Skill from "../models/Skill.js";

dotenv.config();
await connectDB();

const seedLabs = async () => {
  try {
    console.log("🔬 Starting lab seed...\n");

    // Get existing skills to link labs
    const skills = await Skill.find();
    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

        const labsData = [
      // Essential Introductory Labs (2)
      {
        name: "Identify Phishing Indicators",
        description: "Review a sample email and spot phishing red flags",
        skillId: skillMap["Log Analysis"],
        difficulty: 1,
        scenario: "defense",
        objectiveText: "Identify at least 3 phishing indicators in the email",
        environment: "simulated",
        timeLimit: 10,
        requiredTools: ["Web Browser", "Email Client"],
        tags: ["phishing", "email", "basics"],
      },
      {
        name: "Create a Strong Password",
        description: "Generate and validate a strong password using best practices",
        skillId: skillMap["IAM (Identity & Access Management)"],
        difficulty: 1,
        scenario: "defense",
        objectiveText: "Create a password that meets all strength criteria",
        environment: "simulated",
        timeLimit: 8,
        requiredTools: ["Password Manager"],
        tags: ["password", "basics", "practice"],
      },

      // Core SOC Labs (3)
      {
        name: "Brute Force Detection Lab",
        description: "Analyze authentication logs to detect brute force attacks",
        skillId: skillMap["Log Analysis"],
        difficulty: 2,
        scenario: "defense",
        objectiveText: "Identify the source IP of the brute force attack and determine how many failed login attempts occurred within 5 minutes",
        environment: "simulated",
        timeLimit: 15,
        requiredTools: ["SIEM", "grep", "awk"],
        tags: ["log-analysis", "brute-force", "authentication"],
      },
      {
        name: "Port Scan Detection",
        description: "Analyze network traffic to detect port scanning activity",
        skillId: skillMap["Network Traffic Analysis"],
        difficulty: 2,
        scenario: "defense",
        objectiveText: "Identify the scanning IP, target ports scanned, and scan technique used",
        environment: "simulated",
        timeLimit: 15,
        requiredTools: ["Wireshark", "tcpdump"],
        tags: ["network", "reconnaissance", "port-scan"],
      },
      {
        name: "Ransomware Incident Response",
        description: "Respond to active ransomware attack",
        skillId: skillMap["Incident Response"],
        difficulty: 4,
        scenario: "defense",
        objectiveText: "Contain the attack, identify patient zero, determine scope, and create recovery plan",
        environment: "simulated",
        timeLimit: 60,
        requiredTools: ["EDR", "SIEM", "Forensics Tools"],
        tags: ["incident-response", "ransomware", "containment"],
      },

      // Core Pentesting Labs (3)
      {
        name: "Web Application Vulnerability Scan",
        description: "Perform comprehensive vulnerability assessment of a web application",
        skillId: skillMap["Vulnerability Assessment"],
        difficulty: 2,
        scenario: "attack",
        objectiveText: "Identify at least 5 vulnerabilities including OWASP Top 10 issues, categorize by severity",
        environment: "docker",
        timeLimit: 30,
        requiredTools: ["Burp Suite", "OWASP ZAP", "Nikto"],
        tags: ["vulnerability-assessment", "web-app", "owasp"],
      },
      {
        name: "Linux Privilege Escalation",
        description: "Escalate from low-privilege user to root on Linux system",
        skillId: skillMap["Privilege Escalation"],
        difficulty: 3,
        scenario: "attack",
        objectiveText: "Gain root access through misconfigurations, SUID binaries, or kernel exploits",
        environment: "vm",
        timeLimit: 40,
        requiredTools: ["LinPEAS", "pspy", "GTFOBins"],
        tags: ["privesc", "linux", "post-exploitation"],
      },
      {
        name: "SQL Injection Exploit Chain",
        description: "Chain SQL injection vulnerabilities to achieve remote code execution",
        skillId: skillMap["Exploit Development"],
        difficulty: 4,
        scenario: "attack",
        objectiveText: "Exploit SQL injection to read database, write webshell, and gain shell access",
        environment: "docker",
        timeLimit: 50,
        requiredTools: ["sqlmap", "Burp Suite", "curl"],
        tags: ["exploit-dev", "sql-injection", "web"],
      },

      // Cloud & Malware Labs (2)
      {
        name: "AWS IAM Privilege Escalation",
        description: "Identify and exploit AWS IAM misconfigurations",
        skillId: skillMap["IAM (Identity & Access Management)"],
        difficulty: 3,
        scenario: "attack",
        objectiveText: "Escalate from limited IAM user to full admin access",
        environment: "cloud",
        timeLimit: 40,
        requiredTools: ["AWS CLI", "Pacu", "ScoutSuite"],
        tags: ["iam", "aws", "cloud-security"],
      },
      {
        name: "Static Malware Analysis",
        description: "Perform static analysis on a malicious binary",
        skillId: skillMap["Malware Analysis"],
        difficulty: 3,
        scenario: "defense",
        objectiveText: "Identify malware family, IOCs, C2 domains, and persistence mechanisms without executing",
        environment: "vm",
        timeLimit: 35,
        requiredTools: ["IDA Pro", "Ghidra", "strings", "PEStudio"],
        tags: ["malware-analysis", "static-analysis", "reverse-engineering"],
      },
    ];

    // Filter out labs where skillId is undefined (skill not found)
    const validLabs = labsData.filter((lab) => {
      if (!lab.skillId) {
        console.warn(`⚠️  Skipping lab "${lab.name}" - skill not found`);
        return false;
      }
      return true;
    });

    console.log(`📚 Creating ${validLabs.length} labs...`);

    for (const labData of validLabs) {
      const existing = await Lab.findOne({ name: labData.name });
      if (!existing) {
        await Lab.create(labData);
        console.log(`✅ Created lab: ${labData.name}`);
      } else {
        console.log(`⏭️  Lab already exists: ${labData.name}`);
      }
    }

    console.log("\n✨ Lab seed complete!\n");
    console.log(`Summary:`);
    console.log(`  - Created ${validLabs.length} practical labs`);
    console.log(`  - Covering: SOC, Pentest, Malware Analysis, Cloud Security, IR\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedLabs();
