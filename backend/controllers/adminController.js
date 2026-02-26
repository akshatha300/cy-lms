import {
  getPlatformSummary,
  getModuleMetrics,
  getLeaderboard,
  getAttemptsTimeSeries
} from "../services/adminServices.js";

/**
 * All endpoints require admin role. Ensure protect middleware has attached req.user
 */
const ensureAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }
  return null;
};

export const platformSummary = async (req, res) => {
  if (ensureAdmin(req, res)) return;
  try {
    const data = await getPlatformSummary();
    return res.json(data);
  } catch (err) {
    console.error("platformSummary err:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const modulesMetrics = async (req, res) => {
  if (ensureAdmin(req, res)) return;
  try {
    const data = await getModuleMetrics();
    return res.json(data);
  } catch (err) {
    console.error("modulesMetrics err:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const leaderboard = async (req, res) => {
  if (ensureAdmin(req, res)) return;
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await getLeaderboard(limit);
    return res.json({ leaderboard: data });
  } catch (err) {
    console.error("leaderboard err:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const attemptsTimeSeries = async (req, res) => {
  if (ensureAdmin(req, res)) return;
  try {
    const days = parseInt(req.query.days, 10) || 14;
    const data = await getAttemptsTimeSeries(days);
    return res.json({ timeseries: data });
  } catch (err) {
    console.error("attemptsTimeSeries err:", err);
    return res.status(500).json({ message: err.message });
  }
};
