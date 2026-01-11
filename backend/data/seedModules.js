import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const modules = [
  // Existing modules
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
  },

  // New modules for comprehensive coverage
  {
    title: "SIEM Fundamentals",
    description: "Learn Security Information and Event Management systems, log analysis, and alert correlation.",
    difficulty: 3,
    tags: ["siem", "log-analysis", "soc"]
  },
  {
    title: "Incident Response Procedures",
    description: "Master the incident response lifecycle, containment, eradication, and recovery procedures.",
    difficulty: 3,
    tags: ["incident-response", "soc", "procedures"]
  },
  {
    title: "Threat Intelligence Basics",
    description: "Understand threat actor profiling, IOC analysis, and strategic threat intelligence.",
    difficulty: 3,
    tags: ["threat-intelligence", "ioc", "analysis"]
  },
  {
    title: "Web Application Security",
    description: "Learn OWASP Top 10, web vulnerabilities, and secure web development practices.",
    difficulty: 3,
    tags: ["web-security", "owasp", "development"]
  },
  {
    title: "Network Penetration Testing",
    description: "Master network reconnaissance, scanning, exploitation, and post-exploitation techniques.",
    difficulty: 4,
    tags: ["penetration-testing", "network", "exploitation"]
  },
  {
    title: "Exploit Development Basics",
    description: "Understand buffer overflows, memory corruption, and basic exploit writing techniques.",
    difficulty: 4,
    tags: ["exploit-development", "offensive", "memory"]
  },
  {
    title: "Cloud Security Fundamentals",
    description: "Learn cloud security models, shared responsibility, and basic cloud security controls.",
    difficulty: 2,
    tags: ["cloud-security", "aws", "azure"]
  },
  {
    title: "AWS Security Essentials",
    description: "Master AWS security services, IAM, VPC, and security best practices in AWS.",
    difficulty: 3,
    tags: ["aws", "cloud-security", "iam"]
  },
  {
    title: "Container Security",
    description: "Learn Docker, Kubernetes security, and container runtime protection.",
    difficulty: 3,
    tags: ["containers", "docker", "kubernetes", "devsecops"]
  },
  {
    title: "Security Compliance Frameworks",
    description: "Understand ISO 27001, NIST, SOC 2, and regulatory compliance requirements.",
    difficulty: 3,
    tags: ["compliance", "frameworks", "audit"]
  },
  {
    title: "Risk Management",
    description: "Learn risk assessment methodologies, risk treatment, and enterprise risk management.",
    difficulty: 3,
    tags: ["risk-management", "assessment", "enterprise"]
  },
  {
    title: "Security Auditing",
    description: "Master security audit procedures, control testing, and audit reporting.",
    difficulty: 3,
    tags: ["auditing", "compliance", "testing"]
  },
  {
    title: "Secure Coding Practices",
    description: "Learn secure software development, input validation, and code security reviews.",
    difficulty: 3,
    tags: ["secure-coding", "development", "review"]
  },
  {
    title: "DevSecOps Fundamentals",
    description: "Understand integrating security into CI/CD pipelines and DevSecOps culture.",
    difficulty: 3,
    tags: ["devsecops", "cicd", "automation"]
  }
  
];
async function seed() {
  try {
    // Don't delete existing modules, just add new ones
    const existingModules = await Module.find();
    console.log(`Found ${existingModules.length} existing modules.`);

    const existingTitles = existingModules.map(m => m.title);
    const newModules = modules.filter(m => !existingTitles.includes(m.title));
    
    if (newModules.length > 0) {
      await Module.insertMany(newModules);
      console.log(`Added ${newModules.length} new modules.`);
    } else {
      console.log("All modules already exist.");
    }

    console.log(`Total modules: ${existingModules.length + newModules.length}`);
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();