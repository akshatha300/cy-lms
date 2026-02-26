import { chatWithTutor } from "../services/chatService.js";
import dotenv from "dotenv";

dotenv.config();

const testRAGChat = async () => {
  try {
    console.log("🧪 Testing RAG-enhanced chat service...");
    
    // Test AIML questions
    const questions = [
      "What is machine learning?",
      "How do neural networks work?",
      "What is computer vision?"
    ];
    
    for (const question of questions) {
      console.log(`\n❓ Question: ${question}`);
      const result = await chatWithTutor({ 
        message: question, 
        userId: "test-user",
        history: []
      });
      console.log(`✅ Answer: ${result.reply.slice(0, 200)}...`);
      console.log(`📚 Sources: ${result.sources.length} found`);
      console.log(`🎯 Difficulty: ${result.difficulty}`);
    }
    
  } catch (error) {
    console.error("❌ RAG chat test failed:", error);
  }
};

testRAGChat();
