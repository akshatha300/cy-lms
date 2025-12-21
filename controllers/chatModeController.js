import ChatSession from "../models/chatSession.js";

export const switchChatMode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mode } = req.body;

    if (!["tutor", "answer"].includes(mode)) {
      return res.status(400).json({
        error: "Invalid mode. Use: tutor or answer."
      });
    }

    // Find or create session
    let session = await ChatSession.findOne({ user: userId });
    if (!session) session = await ChatSession.create({ user: userId });

    session.mode = mode;
    await session.save();

    return res.json({
      message: `Mode switched to ${mode}.`,
      mode: session.mode
    });

  } catch (error) {
    console.error("Mode Switch Error:", error);
    res.status(500).json({ error: "Failed to switch mode." });
  }
};
