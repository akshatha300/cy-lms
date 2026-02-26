import { answerWithEnhancedRAG } from "../services/enhancedRagService.js";
import dotenv from "dotenv";

dotenv.config();

const testRAG = async () => {
  try {
    console.log("🧪 Testing RAG implementation...");
    
    // Test questions about AIML
    const questions = [
      "What is machine learning?",
      "How do neural networks work?",
      "What is computer vision?",
      "Explain natural language processing"
    ];
    
    for (const question of questions) {
      console.log(`\n❓ Question: ${question}`);
      const result = await answerWithEnhancedRAG(question);
      console.log(`✅ Answer: ${result.answer.slice(0, 200)}...`);
      console.log(`📚 Sources: ${result.sources.length} found`);
    }
    
  } catch (error) {
    console.error("❌ RAG test failed:", error);
  }
};

testRAG();
