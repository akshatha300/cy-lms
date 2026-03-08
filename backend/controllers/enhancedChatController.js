import { enhancedAIMLChat } from "../services/enhancedChatService.js";
import ChatMessage from "../models/ChatMessage.js";
import logger from "../utils/logger.js";

/**
 * Enhanced AIML Chat Controller with specialized features
 */
export const enhancedChatWithTutor = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const { message, history = [], category = "general" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get enhanced response
    const { reply, difficulty, sources, type } = await enhancedAIMLChat({
      userId,
      message,
      history,
      category,
    });

    // Persist conversation if user is authenticated
    if (userId) {
      try {
        await ChatMessage.insertMany([
          { user: userId, role: "user", text: message, category },
          { user: userId, role: "assistant", text: reply, category, metadata: { difficulty, sources, type } },
        ]);
      } catch (err) {
        logger.error("Failed to save chat messages:", err);
        // Continue even if saving fails
      }
    }

    return res.json({
      reply,
      difficulty: difficulty || "medium",
      sources: sources || [],
      type: type || "general",
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    logger.error("Enhanced chat error:", err);
    return res.status(500).json({ 
      error: "Failed to process chat request",
      message: "I'm having trouble processing your request. Please try again."
    });
  }
};

/**
 * Get chat history with enhanced metadata
 */
export const getEnhancedChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, category } = req.query;

    const filter = { user: userId };
    if (category && category !== "all") {
      filter.category = category;
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Group messages by conversation sessions
    const sessions = [];
    let currentSession = null;

    messages.reverse().forEach((message) => {
      const timeDiff = currentSession 
        ? message.createdAt - currentSession.messages[currentSession.messages.length - 1].createdAt
        : Infinity;

      // Start new session if more than 30 minutes have passed
      if (!currentSession || timeDiff > 30 * 60 * 1000) {
        currentSession = {
          id: message._id,
          date: message.createdAt.toDateString(),
          messages: [],
          category: message.category || "general"
        };
        sessions.push(currentSession);
      }

      currentSession.messages.push({
        id: message._id,
        role: message.role,
        content: message.text,
        timestamp: message.createdAt,
        metadata: message.metadata || {}
      });
    });

    return res.json({
      sessions: sessions.reverse(),
      total: messages.length,
      categories: await getChatCategories(userId)
    });

  } catch (err) {
    logger.error("Failed to get enhanced chat history:", err);
    return res.status(500).json({ error: "Failed to retrieve chat history" });
  }
};

/**
 * Get chat categories and statistics
 */
export const getChatCategories = async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await ChatMessage.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: "$category",
        count: { $sum: 1 },
        lastMessage: { $max: "$createdAt" }
      }},
      { $sort: { count: -1 } },
      { $project: {
        category: "$_id",
        messageCount: "$count",
        lastMessage: "$lastMessage",
        _id: 0
      }}
    ]);

    return res.json({
      categories: categories.length > 0 ? categories : [
        { category: "general", messageCount: 0, lastMessage: null }
      ]
    });

  } catch (err) {
    logger.error("Failed to get chat categories:", err);
    return res.status(500).json({ error: "Failed to retrieve categories" });
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category } = req.query;

    const filter = { user: userId };
    if (category && category !== "all") {
      filter.category = category;
    }

    const result = await ChatMessage.deleteMany(filter);

    return res.json({
      message: "Chat history cleared successfully",
      deletedCount: result.deletedCount
    });

  } catch (err) {
    logger.error("Failed to clear chat history:", err);
    return res.status(500).json({ error: "Failed to clear chat history" });
  }
};

/**
 * Get chat analytics
 */
export const getChatAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const analytics = await ChatMessage.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        userMessages: {
          $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] }
        },
        assistantMessages: {
          $sum: { $cond: [{ $eq: ["$role", "assistant"] }, 1, 0] }
        },
        categories: { $addToSet: "$category" },
        firstMessage: { $min: "$createdAt" },
        lastMessage: { $max: "$createdAt" },
        avgMessageLength: { $avg: { $strLenCP: "$text" } }
      }},
      { $project: {
        totalMessages: 1,
        userMessages: 1,
        assistantMessages: 1,
        categoryCount: { $size: "$categories" },
        categories: 1,
        firstMessage: 1,
        lastMessage: 1,
        avgMessageLength: { $round: ["$avgMessageLength", 0] },
        _id: 0
      }}
    ]);

    const data = analytics[0] || {
      totalMessages: 0,
      userMessages: 0,
      assistantMessages: 0,
      categoryCount: 0,
      categories: [],
      firstMessage: null,
      lastMessage: null,
      avgMessageLength: 0
    };

    // Calculate session statistics
    const sessions = await ChatMessage.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: 1 } },
      { $group: {
        _id: "$user",
        sessions: {
          $push: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$role", 0] }, "user"] },
              then: "$createdAt",
              else: null
            }
          }
        }
      }}
    ]);

    return res.json({
      ...data,
      sessionCount: sessions.length > 0 ? Math.ceil(data.totalMessages / 10) : 0,
      avgMessagesPerSession: data.totalMessages > 0 ? Math.round(data.totalMessages / Math.max(1, Math.ceil(data.totalMessages / 10))) : 0
    });

  } catch (err) {
    logger.error("Failed to get chat analytics:", err);
    return res.status(500).json({ error: "Failed to retrieve chat analytics" });
  }
};

/**
 * Export chat history
 */
export const exportChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { format = "json", category } = req.query;

    const filter = { user: userId };
    if (category && category !== "all") {
      filter.category = category;
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: 1 })
      .lean();

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader = "Timestamp,Role,Message,Category\n";
      const csvData = messages.map(msg => 
        `"${msg.createdAt}","${msg.role}","${msg.text.replace(/"/g, '""')}","${msg.category || 'general'}"`
      ).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="chat_history_${Date.now()}.csv"`);
      return res.send(csvHeader + csvData);
    }

    // Default JSON format
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="chat_history_${Date.now()}.json"`);
    return res.json({
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        timestamp: msg.createdAt,
        role: msg.role,
        content: msg.text,
        category: msg.category || "general",
        metadata: msg.metadata || {}
      }))
    });

  } catch (err) {
    logger.error("Failed to export chat history:", err);
    return res.status(500).json({ error: "Failed to export chat history" });
  }
};
