import { searchLocalRag } from "./localRagIndex.js";
import { getEmbedding } from "./embeddingService.js";
import fetch from "node-fetch";

const RAG_TOP_K = parseInt(process.env.RAG_TOP_K) || 6;
const RAG_MAX_CONTEXT_CHARS = parseInt(process.env.RAG_MAX_CONTEXT_CHARS) || 8000;

const truncateText = (text, maxChars) => {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "...";
};

export const answerWithEnhancedRAG = async (query, history = [], options = {}) => {
  const trimmed = (query || "").trim();
  
  if (!trimmed) {
    return {
      answer: "I'm your AI/ML tutor. Ask me about artificial intelligence, machine learning, neural networks, NLP, computer vision, or anything from your AI/ML modules.",
      sources: [],
    };
  }

  try {
    // 1. Get query embedding
    const queryEmbedding = await getEmbedding(trimmed);
    
    // 2. Search local RAG index
    const ragResults = await searchLocalRag(queryEmbedding, RAG_TOP_K);
    
    // 3. Build context from RAG results
    const contextString = ragResults
      .map((doc, idx) => `[Source ${idx + 1}]: ${doc.document}`)
      .join("\n\n");
    
    const truncatedContext = truncateText(contextString, RAG_MAX_CONTEXT_CHARS);

    // 4. Build enhanced RAG prompt
    const conversation = Array.isArray(history)
      ? history.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join("\n")
      : String(history || "");

    const prompt = `You are an expert AI/ML tutor specializing in Artificial Intelligence and Machine Learning for a learning management system.
Your role is to help students understand AI/ML concepts including neural networks, natural language processing, computer vision, and advanced AI technologies.

CONTEXT FROM COURSE MATERIALS:
${truncatedContext}

RECENT CONVERSATION:
${conversation}

STUDENT QUESTION:
${trimmed}

RESPONSE GUIDELINES:
- Use the context materials to provide accurate, specific answers about AI/ML concepts
- If context doesn't contain the answer, clearly state that and suggest relevant AI/ML topics to study
- Provide practical examples and real-world AI/ML applications when possible
- Keep explanations clear and appropriate for learners new to AI/ML concepts
- If you're uncertain about something, admit it rather than guessing
- Structure your response with clear headings and bullet points when helpful
- Explain mathematical concepts in an accessible way when relevant
- Provide code examples or algorithms when helpful for understanding
- Cover both theoretical foundations and practical implementations
- Discuss ethical considerations in AI/ML when relevant

Please provide a comprehensive yet accessible answer:`;

    // 5. Call Groq API
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI/ML tutor specializing in Artificial Intelligence and Machine Learning. Use course materials to answer student questions about AI concepts, neural networks, NLP, computer vision, and ethics. Always prioritize accuracy and clarity in your responses. Explain AI/ML concepts in an accessible way for learners.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: options.maxTokens || 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    const finalAnswer = (text || "").trim() || 
      "Based on the available course materials, I can provide some general AI/ML guidance. For more specific information, please try asking about particular AI concepts, neural networks, NLP, computer vision, or check your course modules.";

    return {
      answer: finalAnswer,
      sources: ragResults.map(doc => ({
        title: doc.metadata.title,
        filename: doc.metadata.filename,
        chunkIndex: doc.metadata.chunkIndex,
        score: doc.score,
      })),
      context: truncatedContext,
    };

  } catch (error) {
    console.error("Enhanced RAG error:", error);
    
    // Fallback response
    return {
      answer: "I'm your AI/ML tutor and I'm here to help you learn about artificial intelligence and machine learning. While I'm having trouble accessing my full knowledge base right now, I can still help with general AI/ML concepts. What specific topic would you like to explore?",
      sources: [],
    };
  }
};
