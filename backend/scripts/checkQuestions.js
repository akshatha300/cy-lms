import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Question from "../models/Questions.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const checkQuestions = async () => {
  try {
    console.log("=== CHECKING QUESTIONS IN DATABASE ===");
    
    // Check all questions
    const questions = await Question.find();
    console.log(`Total questions in database: ${questions.length}`);
    
    if (questions.length === 0) {
      console.log("❌ No questions found in database");
      return;
    }
    
    // Group questions by module
    const questionsByModule = {};
    questions.forEach(question => {
      const moduleId = question.moduleId?.toString();
      if (moduleId) {
        if (!questionsByModule[moduleId]) {
          questionsByModule[moduleId] = [];
        }
        questionsByModule[moduleId].push(question);
      }
    });
    
    console.log("\n📊 Questions by Module:");
    for (const [moduleId, moduleQuestions] of Object.entries(questionsByModule)) {
      console.log(`Module ${moduleId}: ${moduleQuestions.length} questions`);
      moduleQuestions.forEach((q, index) => {
        console.log(`  ${index + 1}. ${q.questionText?.substring(0, 50)}...`);
        console.log(`     Options: ${q.options ? q.options.join(', ') : 'None'}`);
        console.log(`     Correct: ${q.correctAnswer}`);
        console.log(`     Difficulty: ${q.difficulty}`);
      });
    }
    
    // Check modules
    const modules = await Module.find();
    console.log(`\n📚 Available Modules (${modules.length}):`);
    modules.forEach((module, index) => {
      const moduleId = module._id.toString();
      const questionCount = questionsByModule[moduleId]?.length || 0;
      console.log(`${index + 1}. ${module.title} (${module._id}) - ${questionCount} questions`);
    });
    
    // Check for modules without questions
    console.log("\n⚠️ Modules without questions:");
    modules.forEach(module => {
      const moduleId = module._id.toString();
      if (!questionsByModule[moduleId] || questionsByModule[moduleId].length === 0) {
        console.log(`- ${module.title} (${module._id})`);
      }
    });
    
  } catch (error) {
    console.error("❌ Error checking questions:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkQuestions();
