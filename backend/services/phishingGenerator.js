import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generatePhishingEmail = async (scenario) => {
  const prompt = `
You are a cybersecurity simulation engine.
Generate a realistic phishing email for this scenario:

Scenario: "${scenario}"

Return ONLY this JSON:

{
  "subject": "...",
  "body": "...",
  "redFlags": ["...", "..."]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON safely
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Gemini did not return valid JSON.");
  }

  return JSON.parse(jsonMatch[0]);
};
