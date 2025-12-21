
import { generateQuestion } from "../services/geminiService.js";

export const getAIQuestion = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic)
      return res.status(400).json({ message: "Topic is required" });

    const question = await generateQuestion(topic, difficulty || 1);

    res.json(question);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
