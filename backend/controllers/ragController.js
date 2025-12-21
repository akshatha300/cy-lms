import { answerWithRAG } from "../services/ragService.js";

export const ragQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return res.status(400).json({ message: "Query is required" });

    const response = await answerWithRAG(query);
    res.json(response);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
