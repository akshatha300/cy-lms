import mongoose from "mongoose";
import dotenv from "dotenv";
import Simulation from "../models/simulation.js";

dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected:", mongoose.connection.host);
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

const seedSimulations = async () => {
  await connectDB();

  try {
    // Remove old simulations
    await Simulation.deleteMany();
    console.log("Old phishing simulations removed.");

    const simulations = [
      {
        title: "Password Reset Scam",
        emailSubject: "Your Password Will Expire in 24 Hours",
        emailBody: `
Hello User,

Our system has detected unusual activity in your account.  
Your password will expire in 24 hours unless you verify your credentials.

Please click the link below to avoid account suspension:

https://example-simulated-reset.local/security-update

Thank you,  
Security Team
        `,
        landingUrl: "https://example-simulated-reset.local/security-update",
        metadata: {
          indicators: ["urgent-call-to-action", "fake-domain", "threat-language"],
          phishLikelihood: 0.95
        },
        difficulty: 1,
        generatedByAI: false
      },

      {
        title: "Banking Alert Phish",
        emailSubject: "Unusual Debit of ₹39,999 Detected",
        emailBody: `
Dear Customer,

We noticed a debit of ₹39,999 from your bank account.  
If this transaction was not made by you, please cancel immediately:

https://example-simulated-bank-alert.local/cancel-transaction

Regards,  
Bank Fraud Detection Team
        `,
        landingUrl: "https://example-simulated-bank-alert.local/cancel-transaction",
        metadata: {
          indicators: ["fake-banking-URL", "financial-threat", "typos"],
          phishLikelihood: 0.92
        },
        difficulty: 2,
        generatedByAI: false
      },

      {
        title: "HR Payroll Update Scam",
        emailSubject: "Salary Revision - Action Required",
        emailBody: `
Hello Employee,

Your salary revision for FY 2025-26 has been processed.  
Please update your employee details to avoid payout delays:

https://example-simulated-hr-update.local/payroll-update

Regards,  
HR Department
        `,
        landingUrl: "https://example-simulated-hr-update.local/payroll-update",
        metadata: {
          indicators: ["spoofed-HR-sender", "fake-update-page", "generic-greeting"],
          phishLikelihood: 0.88
        },
        difficulty: 3,
        generatedByAI: false
      },

      {
        title: "Office365 Login Phish",
        emailSubject: "Mailbox Storage Exceeded 98% Capacity",
        emailBody: `
Hello User,

Your Office365 mailbox has exceeded the storage limit.  
To continue sending and receiving emails, verify your login:

https://example-simulated-office365.local/verify-login

Thank you,  
Microsoft Support Team
        `,
        landingUrl: "https://example-simulated-office365.local/verify-login",
        metadata: {
          indicators: ["lookalike-domain", "storage-warning", "request-to-login"],
          phishLikelihood: 0.93
        },
        difficulty: 4,
        generatedByAI: false
      },

      {
        title: "CEO Urgent Request Scam (Business Email Compromise)",
        emailSubject: "Need You to Process an Urgent Vendor Payment",
        emailBody: `
Hi,

I'm currently in a meeting with the board and need a confidential favor.  
Please process an urgent payment of ₹85,000 to a vendor immediately:

https://example-simulated-ceorequest.local/vendor-payment

Do not share this with anyone until I confirm.

– CEO
        `,
        landingUrl: "https://example-simulated-ceorequest.local/vendor-payment",
        metadata: {
          indicators: ["urgency", "confidentiality", "authority-abuse"],
          phishLikelihood: 0.97
        },
        difficulty: 5,
        generatedByAI: false
      }
    ];

    await Simulation.insertMany(simulations);
    console.log("Sample phishing simulations added.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSimulations();
