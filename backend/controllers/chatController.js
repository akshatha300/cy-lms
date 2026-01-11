import { chatWithTutor as chatWithTutorService } from "../services/chatService.js";
import ChatMessage from "../models/ChatMessage.js";
import logger from "../utils/logger.js";

// Controller: chat with tutor
// Exposes POST /api/chat
// Frontend expects response: { reply: string, difficulty: "easy" | "medium" | "hard" }
export const chatWithTutor = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const { reply, sources, difficulty } = await chatWithTutorService({
      userId,
      message,
      history,
    });

    // Persist conversation if user is authenticated
    if (userId) {
      try {
        await ChatMessage.insertMany([
          { user: userId, role: "user", text: message },
          { user: userId, role: "assistant", text: reply },
        ]);
      } catch (err) {
        logger.error("Failed to persist chat messages", { err: err?.message });
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.info("chat response", {
        replyType: typeof reply,
        replyLength: reply?.length,
      });
    }

    return res.status(200).json({
      reply,
      difficulty,
      sources,
    });
  } catch (error) {
    logger.error("chatWithTutor error", { err: error?.message });
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Get recent chat history for the logged-in user
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const messages = await ChatMessage.find({ user: userId })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    // Shape for frontend: [{ role, text, createdAt }]
    const history = messages.map((m) => ({
      role: m.role,
      text: m.text,
      createdAt: m.createdAt,
    }));

    return res.json({ messages: history });
  } catch (error) {
    logger.error("getChatHistory error", { err: error?.message });
    return res.status(500).json({ error: "Failed to load chat history" });
  }
};
