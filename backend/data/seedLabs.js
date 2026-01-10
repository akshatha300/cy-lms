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
      // Log Analysis Labs
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
        name: "Malicious Process Detection",
        description: "Analyze system logs to identify malicious processes",
        skillId: skillMap["Log Analysis"],
        difficulty: 3,
        scenario: "defense",
        objectiveText: "Identify the malicious process name, PID, and parent process from system logs",
        environment: "simulated",
        timeLimit: 20,
        requiredTools: ["Splunk", "Linux CLI"],
        tags: ["log-analysis", "malware", "processes"],
      },

      // Network Traffic Analysis Labs
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
        name: "Data Exfiltration Detection",
        description: "Detect unusual data transfer patterns indicating exfiltration",
        skillId: skillMap["Network Traffic Analysis"],
        difficulty: 4,
        scenario: "defense",
        objectiveText: "Identify the destination IP, protocol used, and volume of data exfiltrated",
        environment: "simulated",
        timeLimit: 25,
        requiredTools: ["Wireshark", "NetworkMiner"],
        tags: ["network", "data-exfiltration", "traffic-analysis"],
      },

      // Threat Hunting Labs
      {
        name: "Advanced Persistent Threat Hunt",
        description: "Hunt for signs of APT activity across multiple data sources",
        skillId: skillMap["Threat Hunting"],
        difficulty: 4,
        scenario: "defense",
        objectiveText: "Identify indicators of compromise (IOCs) including suspicious domains, IPs, file hashes, and persistence mechanisms",
        environment: "simulated",
        timeLimit: 45,
        requiredTools: ["SIEM", "Threat Intelligence Platform", "EDR"],
        tags: ["threat-hunting", "apt", "ioc"],
      },
      {
        name: "Insider Threat Detection",
        description: "Detect potential insider threat activity from user behavior",
        skillId: skillMap["Threat Hunting"],
        difficulty: 3,
        scenario: "defense",
        objectiveText: "Identify suspicious user activity including unauthorized access, data copying, and after-hours access",
        environment: "simulated",
        timeLimit: 30,
        requiredTools: ["UEBA", "SIEM"],
        tags: ["threat-hunting", "insider-threat", "ueba"],
      },

      // Vulnerability Assessment Labs
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
        name: "Network Infrastructure Assessment",
        description: "Assess security of network devices and services",
        skillId: skillMap["Vulnerability Assessment"],
        difficulty: 3,
        scenario: "attack",
        objectiveText: "Scan network range, identify vulnerable services, and document exploitable weaknesses",
        environment: "vm",
        timeLimit: 45,
        requiredTools: ["Nmap", "Nessus", "OpenVAS"],
        tags: ["vulnerability-assessment", "network", "infrastructure"],
      },

      // Exploit Development Labs
      {
        name: "Buffer Overflow Exploitation",
        description: "Develop a working exploit for a buffer overflow vulnerability",
        skillId: skillMap["Exploit Development"],
        difficulty: 4,
        scenario: "attack",
        objectiveText: "Create a working exploit that achieves code execution and spawns a reverse shell",
        environment: "vm",
        timeLimit: 60,
        requiredTools: ["GDB", "Python", "pwntools"],
        tags: ["exploit-dev", "buffer-overflow", "binary"],
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

      // Privilege Escalation Labs
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
        name: "Windows Active Directory Privilege Escalation",
        description: "Escalate privileges in Windows AD environment",
        skillId: skillMap["Privilege Escalation"],
        difficulty: 4,
        scenario: "attack",
        objectiveText: "Escalate from domain user to domain admin using AD misconfigurations",
        environment: "vm",
        timeLimit: 50,
        requiredTools: ["BloodHound", "PowerView", "Mimikatz"],
        tags: ["privesc", "windows", "active-directory"],
      },

      // Malware Analysis Labs
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
      {
        name: "Dynamic Malware Analysis",
        description: "Execute and analyze malware behavior in isolated environment",
        skillId: skillMap["Malware Analysis"],
        difficulty: 4,
        scenario: "defense",
        objectiveText: "Document malware behavior including network connections, file modifications, registry changes",
        environment: "vm",
        timeLimit: 45,
        requiredTools: ["Cuckoo Sandbox", "Process Monitor", "Wireshark"],
        tags: ["malware-analysis", "dynamic-analysis", "sandbox"],
      },

      // Incident Response Labs
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
      {
        name: "Compromised Web Server Investigation",
        description: "Investigate and remediate compromised web server",
        skillId: skillMap["Incident Response"],
        difficulty: 3,
        scenario: "defense",
        objectiveText: "Identify breach vector, locate webshell, determine if data was stolen, and secure system",
        environment: "vm",
        timeLimit: 45,
        requiredTools: ["Linux CLI", "web logs", "file integrity tools"],
        tags: ["incident-response", "web-compromise", "forensics"],
      },

      // IAM Labs
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
