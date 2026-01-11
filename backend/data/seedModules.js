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
    tags: ["phishing"],
    materials: [
      {
        title: "What is Phishing?",
        type: "article",
        content: "Phishing is a cyber attack where attackers disguise as trustworthy entities to steal sensitive information. Common tactics include fake emails, malicious websites, and social engineering techniques. Always verify sender identities and avoid clicking suspicious links."
      },
      {
        title: "Google Phishing Quiz",
        type: "link",
        url: "https://phishingquiz.withgoogle.com/"
      },
      {
        title: "Anti-Phishing Working Group",
        type: "link",
        url: "https://apwg.org/"
      }
    ]
  },

  {
    title: "Password Security", 
    description: "Understand strong passwords and multi-factor authentication.",
    difficulty: 1,
    tags: ["password-security"],
    materials: [
      {
        title: "Password Security Fundamentals",
        type: "article",
        content: "Strong passwords are your first line of defense. Use at least 12 characters with uppercase, lowercase, numbers, and symbols. Avoid personal information and common words. Enable two-factor authentication whenever possible."
      },
      {
        title: "Have I Been Pwned",
        type: "link", 
        url: "https://haveibeenpwned.com/"
      },
      {
        title: "NIST Password Guidelines",
        type: "link",
        url: "https://pages.nist.gov/800-63/SP/800-63B.html"
      }
    ]
  },

  {
    title: "Malware Basics",
    description: "Recognize malware, spyware, ransomware, and prevention tips.",
    difficulty: 2,
    tags: ["malware"],
    materials: [
      {
        title: "Understanding Malware Types",
        type: "article",
        content: "Malware includes viruses, worms, trojans, ransomware, spyware, and adware. Each type has unique characteristics and infection methods. Use antivirus software, keep systems updated, and practice safe browsing to prevent infections."
      },
      {
        title: "Malware Analysis Tools",
        type: "link",
        url: "https://www.virustotal.com/"
      },
      {
        title: "Ransomware Prevention Guide",
        type: "link",
        url: "https://www.cisa.gov/ransomware-guide"
      }
    ]
  },

  {
    title: "Social Engineering",
    description: "Detect human manipulation techniques used by attackers.",
    difficulty: 2,
    tags: ["social-engineering"],
    materials: [
      {
        title: "Social Engineering Tactics",
        type: "article",
        content: "Social engineering exploits human psychology to gain access to systems or information. Common tactics include pretexting, baiting, tailgating, and quid pro quo. Always verify requests for sensitive information and be skeptical of urgent requests."
      },
      {
        title: "Social Engineering Framework",
        type: "link",
        url: "https://www.social-engineer.org/framework/"
      },
      {
        title: "Kevin Mitnick on Social Engineering",
        type: "video",
        url: "https://www.youtube.com/embed/k2Iq9sJqHk"
      }
    ]
  },

  {
    title: "Data Protection & Privacy",
    description: "Learn best practices for protecting sensitive data and understanding privacy regulations like GDPR.",
    difficulty: 2,
    tags: ["data-protection", "privacy", "gdpr"],
    materials: [
      {
        title: "Data Privacy Fundamentals",
        type: "article",
        content: "Data protection involves safeguarding sensitive information from unauthorized access, use, or disclosure. Key regulations include GDPR, CCPA, and HIPAA. Implement encryption, access controls, and data minimization to protect privacy."
      },
      {
        title: "GDPR Official Documentation",
        type: "link",
        url: "https://gdpr.eu/"
      },
      {
        title: "Data Protection Impact Assessment",
        type: "pdf",
        url: "https://ico.org.uk/media/for-organisations/documents/1057/dpia-template.pdf"
      }
    ]
  },

  {
    title: "Network Security Fundamentals",
    description: "Explore firewalls, VPNs, encryption, and secure network architecture.",
    difficulty: 3,
    tags: ["network-security", "encryption", "vpn"],
    materials: [
      {
        title: "Network Security Principles",
        type: "article",
        content: "Network security protects the integrity and usability of network and data. Key components include firewalls, intrusion detection systems, VPNs, and encryption. Defense in depth provides multiple layers of security protection."
      },
      {
        title: "Cisco Networking Security",
        type: "link",
        url: "https://www.cisco.com/c/en/us/products/security/index.html"
      },
      {
        title: "Network Security Architecture",
        type: "video",
        url: "https://www.youtube.com/embed/3NjQ_ZcTnM"
      }
    ]
  },

  {
    title: "SIEM Fundamentals",
    description: "Learn Security Information and Event Management systems, log analysis, and alert correlation.",
    difficulty: 3,
    tags: ["siem", "log-analysis", "soc"],
    materials: [
      {
        title: "SIEM Systems Overview",
        type: "article",
        content: "SIEM systems collect, analyze, and correlate security event data from multiple sources. They provide real-time monitoring, alerting, and forensic capabilities. Key features include log management, threat detection, and compliance reporting."
      },
      {
        title: "Splunk SIEM Tutorial",
        type: "link",
        url: "https://www.splunk.com/en_us/learn/siem.html"
      },
      {
        title: "ELK Stack for Security",
        type: "link",
        url: "https://www.elastic.co/solutions/security"
      }
    ]
  },

  {
    title: "Incident Response Procedures",
    description: "Master the incident response lifecycle, containment, eradication, and recovery procedures.",
    difficulty: 3,
    tags: ["incident-response", "soc", "procedures"],
    materials: [
      {
        title: "Incident Response Framework",
        type: "article",
        content: "Incident response involves preparation, identification, containment, eradication, recovery, and lessons learned. Having a well-defined IR plan minimizes damage and ensures quick recovery from security incidents."
      },
      {
        title: "NIST Incident Response Guide",
        type: "link",
        url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
      },
      {
        title: "SANS Incident Response",
        type: "link",
        url: "https://www.sans.org/incident-response/"
      }
    ]
  },

  {
    title: "Threat Intelligence Basics",
    description: "Understand threat actor profiling, IOC analysis, and strategic threat intelligence.",
    difficulty: 3,
    tags: ["threat-intelligence", "ioc", "analysis"],
    materials: [
      {
        title: "Threat Intelligence Fundamentals",
        type: "article",
        content: "Threat intelligence provides information about current and potential threats. It includes strategic, tactical, and operational intelligence. Key components include IOCs (Indicators of Compromise), threat actor profiles, and attack patterns."
      },
      {
        title: "MITRE ATT&CK Framework",
        type: "link",
        url: "https://attack.mitre.org/"
      },
      {
        title: "Threat Intelligence Platforms",
        type: "link",
        url: "https://www.recordedfuture.com/"
      }
    ]
  },

  {
    title: "Web Application Security",
    description: "Learn OWASP Top 10, web vulnerabilities, and secure web development practices.",
    difficulty: 3,
    tags: ["web-security", "owasp", "development"],
    materials: [
      {
        title: "OWASP Top 10 Overview",
        type: "article",
        content: "The OWASP Top 10 lists the most critical web application security risks. These include injection flaws, broken authentication, sensitive data exposure, XML external entities, broken access control, security misconfigurations, XSS, insecure deserialization, and more."
      },
      {
        title: "OWASP Top 10 Project",
        type: "link",
        url: "https://owasp.org/www-project-top-ten/"
      },
      {
        title: "Web Security Testing Guide",
        type: "link",
        url: "https://owasp.org/www-project-web-security-testing-guide/"
      }
    ]
  },

  {
    title: "Network Penetration Testing",
    description: "Master network reconnaissance, scanning, exploitation, and post-exploitation techniques.",
    difficulty: 4,
    tags: ["penetration-testing", "network", "exploitation"],
    materials: [
      {
        title: "Penetration Testing Methodology",
        type: "article",
        content: "Penetration testing follows a systematic approach: reconnaissance, scanning, enumeration, exploitation, post-exploitation, and reporting. Ethical hackers use these techniques to identify and fix security vulnerabilities before malicious actors can exploit them."
      },
      {
        title: "Metasploit Framework",
        type: "link",
        url: "https://www.metasploit.com/"
      },
      {
        title: "Penetration Testing Tools",
        type: "link",
        url: "https://www.kali.org/tools/"
      }
    ]
  },

  {
    title: "Exploit Development Basics",
    description: "Understand buffer overflows, memory corruption, and basic exploit writing techniques.",
    difficulty: 4,
    tags: ["exploit-development", "offensive", "memory"],
    materials: [
      {
        title: "Exploit Development Fundamentals",
        type: "article",
        content: "Exploit development involves understanding software vulnerabilities and creating code to exploit them. Key concepts include buffer overflows, memory corruption, return-oriented programming, and shellcode development."
      },
      {
        title: "Exploit-Database",
        type: "link",
        url: "https://www.exploit-db.com/"
      },
      {
        title: "Buffer Overflow Tutorial",
        type: "video",
        url: "https://www.youtube.com/embed/k2Iq9sJqHk"
      }
    ]
  },

  {
    title: "Cloud Security Fundamentals",
    description: "Learn cloud security models, shared responsibility, and basic cloud security controls.",
    difficulty: 2,
    tags: ["cloud-security", "aws", "azure"],
    materials: [
      {
        title: "Cloud Security Principles",
        type: "article",
        content: "Cloud security follows the shared responsibility model where cloud providers secure the infrastructure while customers secure their data and applications. Key areas include identity management, data protection, network security, and compliance."
      },
      {
        title: "Cloud Security Alliance",
        type: "link",
        url: "https://cloudsecurityalliance.org/"
      },
      {
        title: "AWS Security Best Practices",
        type: "link",
        url: "https://aws.amazon.com/security/"
      }
    ]
  },

  {
    title: "AWS Security Essentials",
    description: "Master AWS security services, IAM, VPC, and security best practices in AWS.",
    difficulty: 3,
    tags: ["aws", "cloud-security", "iam"],
    materials: [
      {
        title: "AWS Security Services",
        type: "article",
        content: "AWS provides comprehensive security services including IAM for identity management, VPC for network isolation, CloudTrail for auditing, GuardDuty for threat detection, and Security Hub for centralized security management."
      },
      {
        title: "AWS Security Documentation",
        type: "link",
        url: "https://docs.aws.amazon.com/security/"
      },
      {
        title: "AWS IAM Best Practices",
        type: "link",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
      }
    ]
  },

  {
    title: "Container Security",
    description: "Learn Docker, Kubernetes security, and container runtime protection.",
    difficulty: 3,
    tags: ["containers", "docker", "kubernetes", "devsecops"],
    materials: [
      {
        title: "Container Security Fundamentals",
        type: "article",
        content: "Container security involves securing Docker images, runtime environments, and Kubernetes clusters. Key practices include using minimal base images, scanning for vulnerabilities, implementing network policies, and managing secrets properly."
      },
      {
        title: "Docker Security",
        type: "link",
        url: "https://docs.docker.com/engine/security/"
      },
      {
        title: "Kubernetes Security Guide",
        type: "link",
        url: "https://kubernetes.io/docs/concepts/security/"
      }
    ]
  },

  {
    title: "Security Compliance Frameworks",
    description: "Understand ISO 27001, NIST, SOC 2, and regulatory compliance requirements.",
    difficulty: 3,
    tags: ["compliance", "frameworks", "audit"],
    materials: [
      {
        title: "Compliance Frameworks Overview",
        type: "article",
        content: "Security compliance frameworks provide structured approaches to managing security risks. ISO 27001 focuses on information security management, NIST provides risk management guidelines, and SOC 2 assesses service organization controls."
      },
      {
        title: "ISO 27001 Standards",
        type: "link",
        url: "https://www.iso.org/isoiec-27001-information-security.html"
      },
      {
        title: "NIST Cybersecurity Framework",
        type: "link",
        url: "https://www.nist.gov/cyberframework"
      }
    ]
  },

  {
    title: "Risk Management",
    description: "Learn risk assessment methodologies, risk treatment, and enterprise risk management.",
    difficulty: 3,
    tags: ["risk-management", "assessment", "enterprise"],
    materials: [
      {
        title: "Risk Management Fundamentals",
        type: "article",
        content: "Risk management involves identifying, assessing, and treating risks to organizational assets. Key processes include risk identification, analysis, evaluation, treatment, and monitoring. The goal is to reduce risk to acceptable levels."
      },
      {
        title: "FAIR Risk Model",
        type: "link",
        url: "https://www.fairinstitute.org/"
      },
      {
        title: "Risk Assessment Framework",
        type: "link",
        url: "https://www.nist.gov/risk-management"
      }
    ]
  },

  {
    title: "Security Auditing",
    description: "Master security audit procedures, control testing, and audit reporting.",
    difficulty: 3,
    tags: ["auditing", "compliance", "testing"],
    materials: [
      {
        title: "Security Auditing Principles",
        type: "article",
        content: "Security audits systematically evaluate security controls and practices. They include planning, fieldwork, testing controls, identifying gaps, and reporting findings. Audits ensure compliance with policies and regulatory requirements."
      },
      {
        title: "ISACA Audit Standards",
        type: "link",
        url: "https://www.isaca.org/resources/news-and-trends/isaca-now-blog/2020/it-audit-standards-and-guidelines"
      },
      {
        title: "Security Audit Checklist",
        type: "link",
        url: "https://www.sans.org/security-resources/"
      }
    ]
  },

  {
    title: "Secure Coding Practices",
    description: "Learn secure software development, input validation, and code security reviews.",
    difficulty: 3,
    tags: ["secure-coding", "development", "review"],
    materials: [
      {
        title: "Secure Coding Principles",
        type: "article",
        content: "Secure coding involves writing code that prevents common vulnerabilities. Key practices include input validation, output encoding, authentication, authorization, cryptography, error handling, and logging. Follow the principle of least privilege."
      },
      {
        title: "OWASP Secure Coding Practices",
        type: "link",
        url: "https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/"
      },
      {
        title: "SANS Secure Coding",
        type: "link",
        url: "https://www.sans.org/information-security-training/"
      }
    ]
  },

  {
    title: "DevSecOps Fundamentals",
    description: "Understand integrating security into CI/CD pipelines and DevSecOps culture.",
    difficulty: 3,
    tags: ["devsecops", "cicd", "automation"],
    materials: [
      {
        title: "DevSecOps Principles",
        type: "article",
        content: "DevSecOps integrates security into every phase of the software development lifecycle. Key practices include security as code, automated testing, continuous monitoring, and shared responsibility. Security becomes everyone's job in the development process."
      },
      {
        title: "DevSecOps Tools",
        type: "link",
        url: "https://owasp.org/www-project-devsecops-guideline/"
      },
      {
        title: "CI/CD Security Pipeline",
        type: "link",
        url: "https://snyk.io/blog/what-is-a-ci-cd-pipeline-security/"
      }
    ]
  }
];
async function seed() {
  try {
    // Update existing modules with materials
    for (const moduleData of modules) {
      await Module.findOneAndUpdate(
        { title: moduleData.title },
        { 
          $set: { 
            materials: moduleData.materials || []
          }
        },
        { upsert: true }
      );
      console.log(`Updated materials for: ${moduleData.title}`);
    }
    
    console.log("All modules updated with learning materials!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();