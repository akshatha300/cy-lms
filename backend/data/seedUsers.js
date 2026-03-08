import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import logger from "../utils/logger.js";

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@aiml.com",
    password: "admin123",
    role: "admin",
    profile: {
      firstName: "Admin",
      lastName: "User",
      bio: "System administrator for AIML Learning Platform",
      avatar: "",
      phone: "+1234567890",
      location: "San Francisco, CA",
      website: "https://aiml-platform.com",
      github: "https://github.com/admin",
      linkedin: "https://linkedin.com/in/admin",
      twitter: "https://twitter.com/admin"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["System Administration", "Database Management", "Security"],
    experience: {
      years: 5,
      level: "expert",
      currentRole: "System Administrator"
    }
  },
  {
    name: "John Smith",
    email: "john.smith@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "John",
      lastName: "Smith",
      bio: "Passionate machine learning enthusiast with a focus on computer vision and natural language processing. Currently working on building intelligent systems for real-world applications.",
      avatar: "",
      phone: "+1234567891",
      location: "New York, NY",
      website: "https://johnsmith-portfolio.com",
      github: "https://github.com/johnsmith",
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["Python", "TensorFlow", "PyTorch", "Computer Vision", "NLP", "Machine Learning"],
    experience: {
      years: 3,
      level: "intermediate",
      currentRole: "ML Engineer"
    }
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "Sarah",
      lastName: "Johnson",
      bio: "Data scientist specializing in predictive analytics and deep learning. Love working with large datasets and building models that solve real business problems.",
      avatar: "",
      phone: "+1234567892",
      location: "Austin, TX",
      website: "https://sarahjohnson-data.com",
      github: "https://github.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson"
    },
    preferences: {
      theme: "light",
      notifications: true,
      emailUpdates: false,
      language: "english"
    },
    skills: ["Python", "R", "Scikit-learn", "Data Analysis", "Statistics", "SQL", "Tableau"],
    experience: {
      years: 4,
      level: "intermediate",
      currentRole: "Data Scientist"
    }
  },
  {
    name: "Michael Chen",
    email: "michael.chen@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "Michael",
      lastName: "Chen",
      bio: "AI researcher exploring the frontiers of deep learning and reinforcement learning. Currently working on autonomous systems and robotics.",
      avatar: "",
      phone: "+1234567893",
      location: "Seattle, WA",
      website: "https://michaelchen-ai.com",
      github: "https://github.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["Deep Learning", "Reinforcement Learning", "Computer Vision", "Robotics", "PyTorch", "C++"],
    experience: {
      years: 6,
      level: "expert",
      currentRole: "AI Researcher"
    }
  },
  {
    name: "Emily Davis",
    email: "emily.davis@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "Emily",
      lastName: "Davis",
      bio: "MLOps engineer focused on deploying and maintaining machine learning systems at scale. Passionate about DevOps, cloud infrastructure, and automated ML pipelines.",
      avatar: "",
      phone: "+1234567894",
      location: "Boston, MA",
      website: "https://emilydavis-mlops.com",
      github: "https://github.com/emilydavis",
      linkedin: "https://linkedin.com/in/emilydavis",
      twitter: "https://twitter.com/emilydavis"
    },
    preferences: {
      theme: "dark",
      notifications: false,
      emailUpdates: true,
      language: "english"
    },
    skills: ["MLOps", "Docker", "Kubernetes", "AWS", "CI/CD", "Python", "TensorFlow"],
    experience: {
      years: 5,
      level: "advanced",
      currentRole: "MLOps Engineer"
    }
  },
  {
    name: "David Wilson",
    email: "david.wilson@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "David",
      lastName: "Wilson",
      bio: "Beginner in machine learning, eager to learn and explore the fascinating world of AI. Currently focusing on fundamentals and hands-on projects.",
      avatar: "",
      phone: "+1234567895",
      location: "Chicago, IL",
      website: "",
      github: "https://github.com/davidwilson",
      linkedin: "",
      twitter: ""
    },
    preferences: {
      theme: "light",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["Python", "Basic ML", "Statistics", "Jupyter Notebooks"],
    experience: {
      years: 1,
      level: "beginner",
      currentRole: "Student"
    }
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "Lisa",
      lastName: "Anderson",
      bio: "NLP specialist working on cutting-edge language models and text understanding. Passionate about making AI more accessible and useful for everyone.",
      avatar: "",
      phone: "+1234567896",
      location: "San Diego, CA",
      website: "https://lisaanderson-nlp.com",
      github: "https://github.com/lisaanderson",
      linkedin: "https://linkedin.com/in/lisaanderson",
      twitter: "https://twitter.com/lisaanderson"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["NLP", "Transformers", "BERT", "GPT", "Python", "Hugging Face", "SpaCy"],
    experience: {
      years: 4,
      level: "intermediate",
      currentRole: "NLP Engineer"
    }
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@aiml.com",
    password: "student123",
    role: "student",
    profile: {
      firstName: "Robert",
      lastName: "Taylor",
      bio: "Computer vision expert developing innovative solutions for image recognition, object detection, and visual understanding systems.",
      avatar: "",
      phone: "+1234567897",
      location: "Portland, OR",
      website: "https://roberttaylor-cv.com",
      github: "https://github.com/roberttaylor",
      linkedin: "https://linkedin.com/in/roberttaylor",
      twitter: "https://twitter.com/roberttaylor"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      emailUpdates: false,
      language: "english"
    },
    skills: ["Computer Vision", "OpenCV", "CNN", "YOLO", "PyTorch", "Image Processing", "Deep Learning"],
    experience: {
      years: 5,
      level: "advanced",
      currentRole: "Computer Vision Engineer"
    }
  },
  {
    name: "Jennifer Martinez",
    email: "jennifer.martinez@aiml.com",
    password: "student123",
    role: "instructor",
    profile: {
      firstName: "Jennifer",
      lastName: "Martinez",
      bio: "Machine learning instructor with 10+ years of experience teaching complex concepts in simple, understandable ways. Passionate about mentoring the next generation of AI professionals.",
      avatar: "",
      phone: "+1234567898",
      location: "Denver, CO",
      website: "https://jennifermartinez-ml.com",
      github: "https://github.com/jennifermartinez",
      linkedin: "https://linkedin.com/in/jennifermartinez",
      twitter: "https://twitter.com/jennifermartinez"
    },
    preferences: {
      theme: "light",
      notifications: true,
      emailUpdates: true,
      language: "english"
    },
    skills: ["Machine Learning", "Teaching", "Curriculum Design", "Python", "TensorFlow", "Mentoring"],
    experience: {
      years: 10,
      level: "expert",
      currentRole: "ML Instructor"
    }
  }
];

export const seedUsers = async () => {
  try {
    console.log("👥 Starting user seeding...");

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log("🗑️ Cleared existing users");

    let createdCount = 0;

    for (const userData of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      createdCount++;
      
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log(`🎉 User seeding completed! Created ${createdCount} users.`);
    
    // Display login credentials for testing
    console.log("\n🔑 Login Credentials for Testing:");
    console.log("================================");
    sampleUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.role.toUpperCase()}: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.name}`);
      console.log("");
    });
    console.log("================================");
    
    return true;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    return false;
  }
};

// Function to create a single user
export const createSingleUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`⚠️ User with email ${userData.email} already exists`);
      return false;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();
    console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    return true;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return false;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
    .then(() => {
      console.log("🔗 Connected to MongoDB");
      seedUsers()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    });
}
