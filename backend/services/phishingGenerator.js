import { GoogleGenerativeAI } from "@google/generative-ai";

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
let model = null;

if (hasGeminiKey) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

const fallbackSimulation = (scenario) => ({
  subject: `Potential phishing attempt about: ${scenario}`,
  body:
    "Hello, we noticed unusual activity and need you to verify your account immediately. Please click the link and enter your credentials to avoid suspension.",
  redFlags: [
    "Urgent tone pressuring immediate action",
    "Unexpected request to click a link and log in",
    "Generic greeting instead of your real name",
  ],
});

export const generatePhishingEmail = async (scenario) => {
  if (!hasGeminiKey || !model) {
    return fallbackSimulation(scenario);
  }

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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Gemini did not return valid JSON.");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("phishingGenerator fallback:", err.message);
    return fallbackSimulation(scenario);
  }
};
