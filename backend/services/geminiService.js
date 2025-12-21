import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MODEL: Use gemini-1.5-flash (cheap, fast, strong JSON)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generates AI questions with Gemini and returns JSON.
 * 
 * @param {string} topic - The cybersecurity topic
 * @param {number} difficulty - difficulty level (1–5)
 */
export const generateQuestion = async (topic, difficulty = 1) => {
  const prompt = `
You are an adaptive cybersecurity tutor.

Generate ONE multiple-choice question about the topic: "${topic}".
Difficulty level: ${difficulty} (1 = easy, 5 = hard)

Return STRICT JSON in this EXACT format:

{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "..."
}

Make sure:
- JSON is valid
- Options are realistic
- Explanation is clear
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    // If Gemini returns non-JSON text, extract JSON using regex
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    throw new Error("Gemini failed to return valid JSON.");
  }
};

export const generateQuestionWithContext = async (topic, difficulty, context) => {
  const prompt = `
You are an adaptive cybersecurity tutor.
Use the CONTEXT below to generate ONE remediation multiple-choice question.

CONTEXT:
${context}

Topic: ${topic}
Difficulty: ${difficulty}

Return EXACT JSON:
{
 "questionText": "...",
 "type":"mcq" or "short",
 "options":["...","...","...","..."],
 "correctAnswer":"...",
 "explanation":"..."
}
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini returned non-JSON");
  return JSON.parse(jsonMatch[0]);
};

export const chatReplyWithContext = async (messages, context) => {
  const conversation = messages
    .map((m) => `${m.role || "user"}: ${m.content}`)
    .join("\n");

  const finalPrompt = `
Use this cybersecurity knowledge:
${context}

Format your response EXACTLY in valid JSON:

{
  "type": "answer | question | explanation | followup",
  "difficulty": "easy | medium | hard",
  "content": "string",
  "memoryUpdate": "optional updated summary",
  "lastMistake": {
    "question": "",
    "userAnswer": "",
    "correctAnswer": "",
    "explanation": ""
  }
}

Respond based on the conversation below:
${conversation}
`;

  const result = await model.generateContent(finalPrompt);
  return result.response.text(); // JSON string per the instructions above
};
