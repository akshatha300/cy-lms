import mongoose from "mongoose";
import CareerRoadmap from "../models/CareerRoadmap.js";

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
  .then(async () => {
    console.log("🔗 Connected to MongoDB");
    
    const roadmaps = await CareerRoadmap.find({});
    console.log(`📊 Career Roadmaps in database: ${roadmaps.length}`);
    
    if (roadmaps.length === 0) {
      console.log("❌ No career roadmaps found. Running seeder...");
      
      // Run the seeder
      const { seedCareerRoadmaps } = await import("./seedCareerRoadmaps.js");
      await seedCareerRoadmaps();
      
      // Check again
      const newRoadmaps = await CareerRoadmap.find({});
      console.log(`✅ After seeding: ${newRoadmaps.length} career roadmaps`);
    } else {
      console.log("✅ Career Roadmaps found:");
      roadmaps.forEach((roadmap, index) => {
        console.log(`${index + 1}. ${roadmap.roleName} - ${roadmap.estimatedDuration} weeks`);
        console.log(`   Difficulty: ${roadmap.difficulty}`);
        console.log(`   Salary: $${roadmap.salaryRange?.min || 0} - $${roadmap.salaryRange?.max || 0}`);
        console.log("");
      });
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
