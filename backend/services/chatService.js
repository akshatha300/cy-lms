import fetch from "node-fetch";
/**
 * Cybersecurity tutor powered by Groq LLM (no RAG).
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
        "Ask me anything about cybersecurity: malware, phishing, passwords, network security, or topics from your modules.",
      difficulty: "medium",
      sources: [],
    };
  }

  // If Groq API key is not configured, return a simple built-in response.
  if (!process.env.GROQ_API_KEY) {
    return {
      reply:
        "I'm your cybersecurity tutor. I currently don't have access to the full AI model, but I can still give you general guidance about threats like malware, phishing, and weak passwords.",
      difficulty: "medium",
      sources: [],
    };
  }

  // Build a conversational prompt for Groq LLM.
  const conversationText = Array.isArray(history)
    ? history.join("\n")
    : String(history || "");

  const prompt = `
You are a friendly cybersecurity tutor in an online learning platform.
You explain concepts clearly for beginners, using simple language and short paragraphs.
If the student asks about attacks (like malware or phishing), you:
- Explain what it is
- Give 1–2 concrete real-world examples
- Give 2–3 practical safety tips

CONVERSATION SO FAR:
${conversationText}

STUDENT QUESTION:
${trimmed}

Respond directly to the student. Do not mention that you are an AI model.`;

  try {
    console.log("=== DEBUG: Environment Variables ===");
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length);
console.log("GROQ_API_KEY starts with gsk_:", process.env.GROQ_API_KEY?.startsWith("gsk_"));console.log("=== DEBUG: Environment Variables ===");
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length);
console.log("GROQ_API_KEY starts with gsk_:", process.env.GROQ_API_KEY?.startsWith("gsk_"));
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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
                "You are a friendly cybersecurity tutor for an online learning platform.",
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

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text =
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.text?.trim() ||
      "";

    const reply =
      text ||
      "I'm having trouble generating a detailed answer right now. Please try asking your question again, or try a slightly different wording.";

    // For now, return a static difficulty; you could later infer this from the question.
    return {
      reply,
      difficulty: "medium",
      sources: [],
    };
  } catch (err) {
    console.error("chatWithTutor (Groq) error:", err);
    return {
      reply:
        "Something went wrong while contacting the tutor model, so I'll give you a general cybersecurity tip: always be cautious with unexpected links and attachments, even if they appear to come from someone you know.",
      difficulty: "medium",
      sources: [],
    };
  }
};
