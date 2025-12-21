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

