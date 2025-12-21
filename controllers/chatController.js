// NOTE: folder name currently includes a trailing space: "chat "
// so the import path must match exactly.
import { chatWithTutor as chatWithTutorService } from "../services/chatService.js";



import ChatMessage from "../models/ChatMessage.js";

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
        console.error("Failed to persist chat messages:", err);
      }
    }

    // Debug: log what we're sending to frontend
    console.log("=== CONTROLLER: Sending response ===");
    console.log("Reply type:", typeof reply);
    console.log("Reply length:", reply?.length);
    console.log("Reply preview:", reply?.substring(0, 200));

    return res.status(200).json({
      reply,
      difficulty,
      sources,
    });
  } catch (error) {
    console.error("chatWithTutor error:", error);
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
    console.error("getChatHistory error:", error);
    return res.status(500).json({ error: "Failed to load chat history" });
  }
};
