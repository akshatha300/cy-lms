import { answerWithEnhancedRAG } from "./enhancedRagService.js";

/**
<<<<<<< Updated upstream
 * AIML tutor powered by Enhanced RAG with Groq LLM.
 * Uses RAG to get context from AIML documents, then applies your prompt structure.
=======
 * AIML tutor powered by Groq LLM (no RAG).
>>>>>>> Stashed changes
 * @param {Object} options
 * @param {string|null} options.userId
 * @param {string} options.message
 * @param {string[]} options.history - array of prior messages
 */
export const chatWithTutor = async ({ userId, message, history = [] }) => {
  const trimmed = (message || "").trim();

  if (!trimmed) {
    return {
      reply:
        "Ask me anything about AIML: Machine learning, deep learning, data science, or topics from your AIML modules.",
      difficulty: "medium",
      sources: [],
    };
  }

  // Debug: Check if API key is loaded
  console.log("=== DEBUG INFO ===");
  console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
  console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length);
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("==================");

  // If Groq API key is not configured, return a simple built-in response.
  if (!process.env.GROQ_API_KEY) {
    console.log("GROQ_API_KEY is missing, returning fallback response");
    return {
      reply:
        "I'm your AIML tutor. I currently don't have access to the full AI model, but I can still give you general guidance about machine learning, deep learning, and data science concepts.",
      difficulty: "medium",
      sources: [],
    };
  }

  try {
    // Use RAG to get context from AIML documents
    const ragResponse = await answerWithEnhancedRAG(trimmed, history, {
      userId,
      maxTokens: 1500,
      temperature: 0.3,
    });

<<<<<<< Updated upstream
    // Build your custom prompt with RAG context
    const conversationText = Array.isArray(history)
      ? history.join("\n")
      : String(history || "");

    const enhancedPrompt = `
You are a friendly AIML tutor in an online learning platform.
You explain concepts clearly for beginners, using simple language and short paragraphs.
Use the following context from AIML course materials to answer the student's question:

CONTEXT FROM COURSE MATERIALS:
${ragResponse.context || "No specific context found."}
=======
  const prompt = `
You are a friendly AIML tutor in an online learning platform.
You explain concepts clearly for beginners, using simple language and short paragraphs.
If the student asks about AIML concepts (like machine learning, neural networks, or data science), you:
- Explain what it is
- Give 1–2 concrete real-world examples
- Give 2–3 practical learning tips
>>>>>>> Stashed changes

CONVERSATION SO FAR:
${conversationText}

STUDENT QUESTION:
${trimmed}

RESPONSE GUIDELINES:
- Use the context materials to provide accurate, specific answers about AIML concepts
- If context doesn't contain the answer, clearly state that and suggest relevant AIML topics to study
- Provide practical examples and real-world AIML applications when possible
- Keep explanations clear and appropriate for learners new to AIML concepts
- If you're uncertain about something, admit it rather than guessing
- Structure your response with clear headings and bullet points when helpful
- Explain mathematical concepts in an accessible way when relevant
- Provide code examples or algorithms when helpful for understanding
- Cover both theoretical foundations and practical implementations
- Discuss ethical considerations in AI/ML when relevant

Please provide a comprehensive yet accessible answer:`;

<<<<<<< Updated upstream
    // Call Groq API with enhanced prompt
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful AIML tutor specializing in Artificial Intelligence and Machine Learning. Use course materials to answer student questions about AI concepts, neural networks, NLP, computer vision, and ethics. Always prioritize accuracy and clarity in your responses.",
          },
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });
=======
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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
              content:
                "You are a friendly AIML tutor for an online learning platform.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
        }),
      }
    );
>>>>>>> Stashed changes

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    const finalAnswer = (text || "").trim() || 
      "Based on the available course materials, I can provide some general AIML guidance. For more specific information, please try asking about particular AI concepts, neural networks, NLP, computer vision, or check your course modules.";

    return {
      reply: finalAnswer,
      difficulty: "medium",
      sources: ragResponse.sources || [],
    };

  } catch (error) {
    console.error("Enhanced RAG service error:", error);
    
    // Fallback to simple AIML response
    return {
      reply: "I'm your AIML tutor. I can help you with artificial intelligence concepts, machine learning algorithms, neural networks, natural language processing, computer vision, and ethical AI considerations. What would you like to learn about?",
      difficulty: "medium",
      sources: [],
    };
  }
};
