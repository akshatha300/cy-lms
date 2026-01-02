export const getAIQuestion = async (_req, res) => {
  return res
    .status(501)
    .json({ message: "AI question generation is disabled (Gemini removed)." });
};
