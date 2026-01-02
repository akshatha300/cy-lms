import Log from "../models/Log.js";

// List recent logs (admin)
export const listLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await Log.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a log entry (admin helper)
export const createLog = async (req, res) => {
  try {
    const { level = "info", message, context = {} } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    const log = await Log.create({ level, message, context });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
