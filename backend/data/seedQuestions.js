import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Module from "../models/Module.js";
import Question from "../models/Questions.js";

dotenv.config();
await connectDB();

// Map module title -> questions for that module
const questionSeed = {
  "Phishing Awareness": [
    {
      questionText:
        "Which of the following is a common sign of a phishing email?",
      options: [
        "Unexpected request for sensitive info with a sense of urgency",
        "Email from your known contact with correct spelling and grammar",
        "Corporate newsletter sent from the official domain",
        "System-generated password reset you requested",
      ],
      correctAnswer: "Unexpected request for sensitive info with a sense of urgency",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Phishing often uses urgency and asks for sensitive info; verify sender and links before acting.",
    },
    {
      questionText:
        "A link in an email looks like https://secure-bank.com but actually points to http://secure-bank.fake-domain.com. What should you do?",
      options: [
        "Click it since it starts with https",
        "Hover to inspect the real URL and avoid clicking if suspicious",
        "Forward to colleagues to check",
        "Reply asking if it is safe",
      ],
      correctAnswer: "Hover to inspect the real URL and avoid clicking if suspicious",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Always hover and inspect the real destination; mismatched or odd domains are a red flag.",
    },
    {
      questionText:
        "You receive an email claiming your account will be suspended unless you immediately click a link to verify your identity. What is the best course of action?",
      options: [
        "Click the link immediately to prevent suspension",
        "Contact the company directly through official channels",
        "Reply to the email with your personal information",
        "Forward the email to all your contacts",
      ],
      correctAnswer: "Contact the company directly through official channels",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Always verify through official channels rather than clicking suspicious links in urgent emails.",
    },
    {
      questionText:
        "Which of the following email characteristics should make you suspicious?",
      options: [
        "Personalized greeting with your correct name",
        "Generic greeting like 'Dear Customer' from your bank",
        "Email from your company's internal newsletter system",
        "Message with proper company branding and logo",
      ],
      correctAnswer: "Generic greeting like 'Dear Customer' from your bank",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Legitimate companies typically use personalized greetings; generic salutations can indicate phishing attempts.",
    },
    {
      questionText:
        "What should you do if you accidentally clicked on a suspicious link in a phishing email?",
      options: [
        "Nothing, since it's too late",
        "Immediately change your passwords and scan for malware",
        "Delete the email and forget about it",
        "Send an apology email to the attacker",
      ],
      correctAnswer: "Immediately change your passwords and scan for malware",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Quick action can prevent further damage; change passwords and run security scans immediately.",
    },
  ],
  "Password Security": [
    {
      questionText: "What is the best practice for creating a strong password?",
      options: [
        "Use a mix of upper/lowercase, numbers, symbols, 12+ chars",
        "Use your pet's name and birth year",
        "Reuse one strong password everywhere",
        "Use only lowercase letters for simplicity",
      ],
      correctAnswer:
        "Use a mix of upper/lowercase, numbers, symbols, 12+ chars",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Long, unique passwords with character variety reduce guessability and cracking risk.",
    },
    {
      questionText:
        "Why is reusing passwords across sites risky even if the password is strong?",
      options: [
        "It is only risky on social media",
        "If one site is breached, attackers try the same password elsewhere",
        "Strong passwords are never at risk",
        "Sites never get breached",
      ],
      correctAnswer:
        "If one site is breached, attackers try the same password elsewhere",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Credential stuffing uses leaked credentials on other sites; unique passwords limit blast radius.",
    },
    {
      questionText:
        "What is multi-factor authentication (MFA) and why is it important?",
      options: [
        "Using multiple passwords for one account",
        "Requiring two or more verification methods to access an account",
        "Having multiple email addresses for recovery",
        "Using different devices to log in",
      ],
      correctAnswer: "Requiring two or more verification methods to access an account",
      difficulty: 1,
      type: "mcq",
      explanation:
        "MFA adds an extra layer of security, making it harder for attackers even if they have your password.",
    },
    {
      questionText:
        "Which of the following is a secure way to store passwords?",
      options: [
        "In a text file on your desktop",
        "Written on a sticky note attached to your monitor",
        "Using a reputable password manager",
        "In your browser's autofill without encryption",
      ],
      correctAnswer: "Using a reputable password manager",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Password managers encrypt and securely store your passwords, making them accessible only to you.",
    },
    {
      questionText:
        "How often should you typically change your passwords for sensitive accounts?",
      options: [
        "Never, unless there's a security breach",
        "Every 30 days regardless of circumstances",
        "Only when you suspect compromise or after a breach",
        "Daily for maximum security",
      ],
      correctAnswer: "Only when you suspect compromise or after a breach",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Modern security guidance emphasizes changing passwords when needed rather than on a fixed schedule.",
    },
  ],
  "Malware Basics": [
    {
      questionText: "Which action helps prevent ransomware infection?",
      options: [
        "Opening all email attachments",
        "Running as admin daily",
        "Regularly updating software and avoiding suspicious downloads",
        "Disabling antivirus to speed up your PC",
      ],
      correctAnswer:
        "Regularly updating software and avoiding suspicious downloads",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Patching closes vulnerabilities; avoiding untrusted downloads reduces malware risk.",
    },
    {
      questionText:
        "What is the primary purpose of antivirus software?",
      options: [
        "To speed up your computer",
        "To detect and remove malicious software",
        "To organize your files",
        "To improve internet connection speed",
      ],
      correctAnswer: "To detect and remove malicious software",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Antivirus software scans for, detects, and removes malware to protect your system.",
    },
    {
      questionText:
        "Which file type is most commonly used to distribute malware?",
      options: [
        ".txt files",
        ".jpg images",
        ".exe executables and .pdf documents",
        ".mp3 audio files",
      ],
      correctAnswer: ".exe executables and .pdf documents",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Executables can run malicious code, and PDFs can contain embedded scripts; always scan before opening.",
    },
    {
      questionText:
        "What is a key indicator that your computer might be infected with malware?",
      options: [
        "Your computer runs faster than usual",
        "Unusual pop-ups, slow performance, or unexpected network activity",
        "Your desktop background changes automatically",
        "All of the above",
      ],
      correctAnswer: "Unusual pop-ups, slow performance, or unexpected network activity",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Malware often causes system slowdowns, strange behavior, and unusual network activity.",
    },
    {
      questionText:
        "What should you do if you suspect your computer is infected with malware?",
      options: [
        "Ignore it and continue working",
        "Immediately disconnect from network and run security scans",
        "Send an email to all your contacts about the infection",
        "Format your hard drive without backup",
      ],
      correctAnswer: "Immediately disconnect from network and run security scans",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Isolating the system prevents spread to other devices while you identify and remove the threat.",
    },
  ],
  "Social Engineering": [
    {
      questionText:
        "What is social engineering in cybersecurity?",
      options: [
        "Programming social media applications",
        "Manipulating people into revealing confidential information",
        "Building secure social networks",
        "Engineering solutions for social problems",
      ],
      correctAnswer: "Manipulating people into revealing confidential information",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Social engineering exploits human psychology to bypass security controls.",
    },
    {
      questionText:
        "A caller claims to be from IT support and asks for your password to 'fix your account'. What should you do?",
      options: [
        "Provide the password immediately",
        "Ask for their employee ID and then give the password",
        "Refuse and contact IT through official channels",
        "Give them a temporary password",
      ],
      correctAnswer: "Refuse and contact IT through official channels",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Legitimate IT support will never ask for your password; always verify through official channels.",
    },
    {
      questionText:
        "Which technique involves creating a fake scenario to manipulate someone into taking action?",
      options: [
        "Phishing",
        "Pretexting",
        "Baiting",
        "Tailgating",
      ],
      correctAnswer: "Pretexting",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Pretexting involves creating a fabricated scenario to gain trust and manipulate targets.",
    },
    {
      questionText:
        "What is 'tailgating' in social engineering?",
      options: [
        "Following someone through a secure door without authorization",
        "Leaving malicious USB drives in public places",
        "Sending fake emails to employees",
        "Creating fake social media profiles",
      ],
      correctAnswer: "Following someone through a secure door without authorization",
      difficulty: 1,
      type: "mcq",
      explanation:
        "Tailgating exploits politeness by following authorized personnel into restricted areas.",
    },
    {
      questionText:
        "How can organizations best defend against social engineering attacks?",
      options: [
        "Only technical solutions like firewalls",
        "Employee training and establishing verification procedures",
        "Hiring more security guards",
        "Blocking all external communications",
      ],
      correctAnswer: "Employee training and establishing verification procedures",
      difficulty: 2,
      type: "mcq",
      explanation:
        "Human awareness and proper procedures are the best defense against manipulation tactics.",
    },
  ],
    "Data Protection & Privacy": [
    {
      questionText: "What does GDPR primarily regulate?",
      options: [
        "Only financial data protection",
        "Personal data processing and privacy rights",
        "Corporate intellectual property",
        "Government surveillance programs"
      ],
      correctAnswer: "Personal data processing and privacy rights",
      difficulty: 2,
      type: "mcq",
      explanation: "GDPR protects personal data and gives individuals control over how their data is processed."
    },
    {
      questionText: "Which of the following is considered personal data under GDPR?",
      options: [
        "Only government ID numbers",
        "Any information that can identify a person directly or indirectly",
        "Only financial information",
        "Only medical records"
      ],
      correctAnswer: "Any information that can identify a person directly or indirectly",
      difficulty: 1,
      type: "mcq",
      explanation: "GDPR has a broad definition of personal data including names, emails, IP addresses, and more."
    },
    {
      questionText: "What is the principle of 'data minimization'?",
      options: [
        "Delete all data after 30 days",
        "Collect only the minimum data necessary for the stated purpose",
        "Store data in the smallest possible format",
        "Minimize the number of people who can access data"
      ],
      correctAnswer: "Collect only the minimum data necessary for the stated purpose",
      difficulty: 2,
      type: "mcq",
      explanation: "Data minimization means collecting and processing only what's necessary for your specific purpose."
    }
  ],

  "Network Security Fundamentals": [
    {
      questionText: "What is the primary purpose of a firewall?",
      options: [
        "To speed up internet connection",
        "To filter and control network traffic based on security rules",
        "To store network data",
        "To create network connections"
      ],
      correctAnswer: "To filter and control network traffic based on security rules",
      difficulty: 1,
      type: "mcq",
      explanation: "Firewalls act as security barriers that monitor and filter incoming and outgoing network traffic."
    },
    {
      questionText: "What does a VPN (Virtual Private Network) primarily provide?",
      options: [
        "Faster internet speeds",
        "Encrypted connection and IP address masking",
        "Free access to all websites",
        "Better Wi-Fi signal"
      ],
      correctAnswer: "Encrypted connection and IP address masking",
      difficulty: 1,
      type: "mcq",
      explanation: "VPNs create encrypted tunnels and hide your real IP address, providing privacy and security."
    },
    {
      questionText: "What is the difference between TCP and UDP?",
      options: [
        "TCP is faster, UDP is more reliable",
        "TCP is connection-oriented and reliable, UDP is connectionless and faster",
        "Only TCP works on the internet",
        "Only UDP supports video streaming"
      ],
      correctAnswer: "TCP is connection-oriented and reliable, UDP is connectionless and faster",
      difficulty: 2,
      type: "mcq",
      explanation: "TCP ensures reliable delivery with error checking, while UDP prioritizes speed over reliability."
    }
  ],

  "SIEM Fundamentals": [
    {
      questionText: "What does SIEM stand for?",
      options: [
        "Security Information and Event Management",
        "System Integration and Emergency Management",
        "Software Installation and Error Management",
        "Security Intelligence and Email Management"
      ],
      correctAnswer: "Security Information and Event Management",
      difficulty: 1,
      type: "mcq",
      explanation: "SIEM systems collect and analyze security data from across an organization's IT infrastructure."
    },
    {
      questionText: "What is the primary benefit of log correlation in SIEM?",
      options: [
        "To reduce log storage requirements",
        "To identify patterns by connecting related events across different sources",
        "To speed up log processing",
        "To delete old logs automatically"
      ],
      correctAnswer: "To identify patterns by connecting related events across different sources",
      difficulty: 2,
      type: "mcq",
      explanation: "Log correlation helps identify attack patterns that might be missed when looking at individual logs."
    },
    {
      questionText: "What type of alerts are typically generated by SIEM systems?",
      options: [
        "Only high-severity alerts",
        "Alerts based on predefined rules and anomaly detection",
        "Only manual alerts from security analysts",
        "Only network-related alerts"
      ],
      correctAnswer: "Alerts based on predefined rules and anomaly detection",
      difficulty: 2,
      type: "mcq",
      explanation: "SIEM systems generate alerts based on rule-based detection and behavioral analysis."
    }
    
  ],
    "Incident Response Procedures": [
    {
      questionText: "What is the first phase of the incident response lifecycle?",
      options: [
        "Containment",
        "Eradication",
        "Preparation",
        "Recovery"
      ],
      correctAnswer: "Preparation",
      difficulty: 1,
      type: "mcq",
      explanation: "Preparation involves having the right tools, training, and procedures in place before incidents occur."
    },
    {
      questionText: "What is the primary goal of incident containment?",
      options: [
        "To punish the attacker",
        "To prevent further damage and spread of the incident",
        "To recover all lost data",
        "To document the incident"
      ],
      correctAnswer: "To prevent further damage and spread of the incident",
      difficulty: 1,
      type: "mcq",
      explanation: "Containment focuses on limiting the scope and impact of a security incident."
    },
    {
      questionText: "What is an 'incident response plan'?",
      options: [
        "A list of all possible security incidents",
        "A documented set of procedures for responding to security incidents",
        "Contact information for all employees",
        "Software for detecting incidents"
      ],
      correctAnswer: "A documented set of procedures for responding to security incidents",
      difficulty: 1,
      type: "mcq",
      explanation: "An incident response plan provides step-by-step guidance for handling security incidents."
    }
  ],

  "Threat Intelligence Basics": [
    {
      questionText: "What is an IOC (Indicator of Compromise)?",
      options: [
        "A measure of system performance",
        "Evidence that a system has been compromised",
        "A type of antivirus software",
        "A network configuration setting"
      ],
      correctAnswer: "Evidence that a system has been compromised",
      difficulty: 1,
      type: "mcq",
      explanation: "IOCs are artifacts that indicate a potential intrusion, such as IP addresses, file hashes, or domain names."
    },
    {
      questionText: "What is the difference between strategic and tactical threat intelligence?",
      options: [
        "Strategic is for executives, tactical is for technical staff",
        "Strategic focuses on long-term trends, tactical on immediate threats",
        "Strategic is more accurate than tactical",
        "Tactical is classified, strategic is public"
      ],
      correctAnswer: "Strategic focuses on long-term trends, tactical on immediate threats",
      difficulty: 2,
      type: "mcq",
      explanation: "Strategic intelligence informs long-term security planning, while tactical intelligence helps with immediate defense."
    },
    {
      questionText: "What is a 'threat actor' in cybersecurity?",
      options: [
        "A security software program",
        "An individual or group that conducts malicious activities",
        "A network security device",
        "A security policy document"
      ],
      correctAnswer: "An individual or group that conducts malicious activities",
      difficulty: 1,
      type: "mcq",
      explanation: "Threat actors are the entities behind cyber attacks, ranging from individuals to nation-states."
    }
  ],

  "Web Application Security": [
    {
      questionText: "What is OWASP Top 10?",
      options: [
        "A list of the 10 most popular web applications",
        "A list of the 10 most critical web application security risks",
        "A ranking of the 10 best security tools",
        "A certification for web developers"
      ],
      correctAnswer: "A list of the 10 most critical web application security risks",
      difficulty: 1,
      type: "mcq",
      explanation: "OWASP Top 10 identifies the most critical web application security risks to help prioritize defenses."
    },
    {
      questionText: "What is SQL injection?",
      options: [
        "A way to speed up SQL queries",
        "An attack that inserts malicious SQL code into input fields",
        "A database backup method",
        "A type of SQL optimization"
      ],
      correctAnswer: "An attack that inserts malicious SQL code into input fields",
      difficulty: 2,
      type: "mcq",
      explanation: "SQL injection exploits input validation flaws to execute malicious database commands."
    },
    {
      questionText: "What is Cross-Site Scripting (XSS)?",
      options: [
        "A way to share scripts between websites",
        "An attack that injects malicious scripts into trusted websites",
        "A method for secure script execution",
        "A browser security feature"
      ],
      correctAnswer: "An attack that injects malicious scripts into trusted websites",
      difficulty: 2,
      type: "mcq",
      explanation: "XSS attacks inject malicious scripts that execute in victims' browsers when they visit compromised sites."
    }
  ],

  "Network Penetration Testing": [
    {
      questionText: "What is the primary goal of penetration testing?",
      options: [
        "To cause damage to systems",
        "To identify vulnerabilities before attackers do",
        "To steal sensitive data",
        "To demonstrate hacking skills"
      ],
      correctAnswer: "To identify vulnerabilities before attackers do",
      difficulty: 1,
      type: "mcq",
      explanation: "Penetration testing is authorized security testing to find and fix vulnerabilities."
    },
    {
      questionText: "What is 'reconnaissance' in penetration testing?",
      options: [
        "The final report writing phase",
        "The information gathering phase about the target",
        "The exploitation phase",
        "The cleanup phase"
      ],
      correctAnswer: "The information gathering phase about the target",
      difficulty: 1,
      type: "mcq",
      explanation: "Reconnaissance involves collecting information about the target to identify potential attack vectors."
    },
    {
      questionText: "What is the difference between 'white box' and 'black box' testing?",
      options: [
        "White box is faster, black box is slower",
        "White box has full system knowledge, black box has no prior knowledge",
        "White box is legal, black box is illegal",
        "White box uses automated tools, black box is manual"
      ],
      correctAnswer: "White box has full system knowledge, black box has no prior knowledge",
      difficulty: 2,
      type: "mcq",
      explanation: "White box testing provides full system information, while black box testing simulates external attacks."
    }
    
  ],
    "Exploit Development Basics": [
    {
      questionText: "What is a 'buffer overflow'?",
      options: [
        "When network buffers get too full",
        "Writing more data to a buffer than it can hold",
        "A type of network attack",
        "A memory optimization technique"
      ],
      correctAnswer: "Writing more data to a buffer than it can hold",
      difficulty: 2,
      type: "mcq",
      explanation: "Buffer overflows occur when programs write beyond allocated memory boundaries, potentially allowing code execution."
    },
    {
      questionText: "What is 'shellcode'?",
      options: [
        "A command line interface",
        "A type of shell script",
        "Small code snippets that start a command shell",
        "A security policy document"
      ],
      correctAnswer: "Small code snippets that start a command shell",
      difficulty: 2,
      type: "mcq",
      explanation: "Shellcode is payload code that, when executed, provides the attacker with system access."
    },
    {
      questionText: "What is the purpose of a 'NOP sled' in exploits?",
      options: [
        "To make the exploit run faster",
        "To increase the chances of jumping to the right code location",
        "To hide the exploit from detection",
        "To clean up after exploitation"
      ],
      correctAnswer: "To increase the chances of jumping to the right code location",
      difficulty: 3,
      type: "mcq",
      explanation: "NOP sleds are sequences of no-operation instructions that help land execution on shellcode."
    }
  ],

  "Cloud Security Fundamentals": [
    {
      questionText: "What is the 'shared responsibility model' in cloud security?",
      options: [
        "The cloud provider handles all security",
        "The customer handles all security",
        "Security responsibilities are divided between provider and customer",
        "Security is shared among all cloud users"
      ],
      correctAnswer: "Security responsibilities are divided between provider and customer",
      difficulty: 1,
      type: "mcq",
      explanation: "Cloud providers secure the infrastructure, while customers secure their data and applications."
    },
    {
      questionText: "What is 'IaaS' in cloud computing?",
      options: [
        "Identity as a Service",
        "Infrastructure as a Service",
        "Information as a Service",
        "Integration as a Service"
      ],
      correctAnswer: "Infrastructure as a Service",
      difficulty: 1,
      type: "mcq",
      explanation: "IaaS provides virtual computing resources over the internet, giving customers control over operating systems and applications."
    },
    {
      questionText: "What is a 'cloud security posture'?",
      options: [
        "The physical security of data centers",
        "The overall security status of cloud resources and configurations",
        "The number of security tools deployed",
        "The cost of security services"
      ],
      correctAnswer: "The overall security status of cloud resources and configurations",
      difficulty: 2,
      type: "mcq",
      explanation: "Cloud security posture refers to the security state of cloud environments and configurations."
    }
  ],

  "AWS Security Essentials": [
    {
      questionText: "What is AWS IAM primarily used for?",
      options: [
        "To manage AWS billing",
        "To control access to AWS services and resources",
        "To monitor AWS performance",
        "To store data in AWS"
      ],
      correctAnswer: "To control access to AWS services and resources",
      difficulty: 1,
      type: "mcq",
      explanation: "AWS IAM (Identity and Access Management) controls who can access what AWS resources."
    },
    {
      questionText: "What is the principle of 'least privilege' in AWS IAM?",
      options: [
        "Give users the minimum permissions they need",
        "Give all users admin access",
        "Only use root account",
        "Share credentials among users"
      ],
      correctAnswer: "Give users the minimum permissions they need",
      difficulty: 1,
      type: "mcq",
      explanation: "Least privilege means providing only the minimum permissions necessary for users to do their jobs."
    },
    {
      questionText: "What is a VPC in AWS?",
      options: [
        "Virtual Personal Computer",
        "Virtual Private Cloud - isolated network environment",
        "Video Processing Center",
        "Vendor Performance Certificate"
      ],
      correctAnswer: "Virtual Private Cloud - isolated network environment",
      difficulty: 1,
      type: "mcq",
      explanation: "VPC provides an isolated network environment in AWS where you can launch AWS resources."
    }
  ],

  "Container Security": [
    {
      questionText: "What is the primary security concern with container images?",
      options: [
        "Image size too large",
        "Vulnerabilities in base images and dependencies",
        "Image download speed",
        "Image compatibility"
      ],
      correctAnswer: "Vulnerabilities in base images and dependencies",
      difficulty: 2,
      type: "mcq",
      explanation: "Container images often inherit vulnerabilities from their base images and included software packages."
    },
    {
      questionText: "What is 'container escape'?",
      options: [
        "When containers stop running",
        "Breaking out of container isolation to access the host system",
        "Deleting containers",
        "Moving containers between hosts"
      ],
      correctAnswer: "Breaking out of container isolation to access the host system",
      difficulty: 2,
      type: "mcq",
      explanation: "Container escape exploits vulnerabilities to break out of container isolation and access the host."
    },
    {
      questionText: "What is the purpose of container runtime security?",
      options: [
        "To speed up container startup",
        "To protect containers during execution",
        "To backup container data",
        "To optimize container images"
      ],
      correctAnswer: "To protect containers during execution",
      difficulty: 1,
      type: "mcq",
      explanation: "Container runtime security monitors and protects running containers from threats."
    }
  ],
    "Security Compliance Frameworks": [
    {
      questionText: "What is ISO 27001?",
      options: [
        "A network security standard",
        "An international standard for information security management",
        "A US government regulation",
        "A cloud security certification"
      ],
      correctAnswer: "An international standard for information security management",
      difficulty: 1,
      type: "mcq",
      explanation: "ISO 27001 provides a framework for establishing, implementing, and improving information security management systems."
    },
    {
      questionText: "What is the primary goal of NIST Cybersecurity Framework?",
      options: [
        "To punish non-compliant organizations",
        "To provide voluntary guidelines for managing cybersecurity risks",
        "To replace all security standards",
        "To certify security products"
      ],
      correctAnswer: "To provide voluntary guidelines for managing cybersecurity risks",
      difficulty: 1,
      type: "mcq",
      explanation: "NIST CSF provides a framework for organizations to manage and reduce cybersecurity risks."
    },
    {
      questionText: "What is 'SOC 2' compliance?",
      options: [
        "Social media compliance",
        "Security and compliance controls for service organizations",
        "System operations certification",
        "Software quality standard"
      ],
      correctAnswer: "Security and compliance controls for service organizations",
      difficulty: 2,
      type: "mcq",
      explanation: "SOC 2 reports on controls at service organizations relevant to security, availability, processing, and confidentiality."
    }
  ],

  "Risk Management": [
    {
      questionText: "What is 'risk' in cybersecurity?",
      options: [
        "A type of malware",
        "The likelihood and impact of a threat exploiting a vulnerability",
        "A security policy violation",
        "A network configuration error"
      ],
      correctAnswer: "The likelihood and impact of a threat exploiting a vulnerability",
      difficulty: 1,
      type: "mcq",
      explanation: "Risk combines the probability of a threat with the potential damage it could cause."
    },
    {
      questionText: "What is 'risk assessment'?",
      options: [
        "Punishing risky behavior",
        "Identifying and evaluating potential risks",
        "Eliminating all risks",
        "Buying insurance for all risks"
      ],
      correctAnswer: "Identifying and evaluating potential risks",
      difficulty: 1,
      type: "mcq",
      explanation: "Risk assessment identifies potential threats and evaluates their likelihood and potential impact."
    },
    {
      questionText: "What are the four main risk treatment options?",
      options: [
        "Accept, transfer, mitigate, ignore",
        "Accept, transfer, mitigate, avoid",
        "Transfer, mitigate, avoid, deny",
        "Accept, transfer, eliminate, avoid"
      ],
      correctAnswer: "Accept, transfer, mitigate, avoid",
      difficulty: 2,
      type: "mcq",
      explanation: "Risk can be accepted, transferred (insurance), mitigated (controls), or avoided (not performing the activity)."
    }
  ],

  "Security Auditing": [
    {
      questionText: "What is the primary purpose of a security audit?",
      options: [
        "To punish employees",
        "To assess security controls and compliance",
        "To sell security products",
        "To replace security teams"
      ],
      correctAnswer: "To assess security controls and compliance",
      difficulty: 1,
      type: "mcq",
      explanation: "Security audits evaluate the effectiveness of security controls and compliance with standards."
    },
    {
      questionText: "What is 'evidence' in security auditing?",
      options: [
        "Legal proof of crimes",
        "Documentation that proves controls are working",
        "Witness testimony",
        "Security tool outputs"
      ],
      correctAnswer: "Documentation that proves controls are working",
      difficulty: 1,
      type: "mcq",
      explanation: "Audit evidence demonstrates that security controls are implemented and functioning properly."
    },
    {
      questionText: "What is the difference between internal and external audits?",
      options: [
        "Internal audits are more expensive",
        "Internal audits are done by the organization, external by independent parties",
        "External audits are always better",
        "Internal audits are illegal"
      ],
      correctAnswer: "Internal audits are done by the organization, external by independent parties",
      difficulty: 1,
      type: "mcq",
      explanation: "Internal audits are conducted by staff within the organization, while external audits use independent auditors."
    }
  ],

  "Secure Coding Practices": [
    {
      questionText: "What is 'input validation' in secure coding?",
      options: [
        "Validating user credentials",
        "Checking that input data meets expected criteria",
        "Validating code syntax",
        "Testing input fields"
      ],
      correctAnswer: "Checking that input data meets expected criteria",
      difficulty: 1,
      type: "mcq",
      explanation: "Input validation ensures data conforms to expected formats before processing, preventing injection attacks."
    },
    {
      questionText: "What is the principle of 'defense in depth'?",
      options: [
        "Having only one strong security layer",
        "Multiple layers of security controls",
        "Deep packet inspection",
        "Defensive programming only"
      ],
      correctAnswer: "Multiple layers of security controls",
      difficulty: 1,
      type: "mcq",
      explanation: "Defense in depth uses multiple security layers so if one fails, others still provide protection."
    },
    {
      questionText: "What is 'secure by default'?",
      options: [
        "Default security settings are secure",
        "All software is secure by default",
        "Default passwords are secure",
        "Default configurations are insecure"
      ],
      correctAnswer: "Default security settings are secure",
      difficulty: 2,
      type: "mcq",
      explanation: "Secure by default means software ships with secure configurations rather than requiring users to enable security."
    }
  ]
  
  
};


async function seed() {
  try {
    const modules = await Module.find().lean();
    const titleToId = new Map(modules.map((m) => [m.title, m._id]));

    // Remove old questions
    await Question.deleteMany({});
    console.log("Old questions removed.");

    const payload = [];
    for (const [title, qs] of Object.entries(questionSeed)) {
      const moduleId = titleToId.get(title);
      if (!moduleId) {
        console.warn(`Skipping questions for "${title}" because module not found.`);
        continue;
      }
      qs.forEach((q) => payload.push({ ...q, moduleId }));
    }

    if (payload.length === 0) {
      console.warn("No questions to insert (no modules matched).");
    } else {
      await Question.insertMany(payload);
      console.log(`Inserted ${payload.length} questions.`);
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();


