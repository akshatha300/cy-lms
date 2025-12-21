import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Module from "../models/Module.js";
import Question from "../models/Questions.js";
import Attempt from "../models/Attempt.js";
import Simulation from "../models/simulation.js";
import PhishAttempt from "../models/PhishAttempt.js";

/**
 * Returns basic platform-wide summary stats.
 */
export const getPlatformSummary = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalModulesPromise = Module.countDocuments();
  const totalQuestionsPromise = Question.countDocuments();
  const totalAttemptsPromise = Attempt.countDocuments();
  const totalSimulationsPromise = Simulation.countDocuments();

  const [totalUsers, totalModules, totalQuestions, totalAttempts, totalSimulations] =
    await Promise.all([
      totalUsersPromise,
      totalModulesPromise,
      totalQuestionsPromise,
      totalAttemptsPromise,
      totalSimulationsPromise
    ]);

  // Average accuracy across users
  const avgAccuracyAgg = await Progress.aggregate([
    { $match: { accuracy: { $exists: true } } },
    { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
  ]);
  const avgAccuracy = avgAccuracyAgg[0]?.avgAccuracy ?? 0;

  return { totalUsers, totalModules, totalQuestions, totalAttempts, totalSimulations, avgAccuracy: Math.round(avgAccuracy * 100) / 100 };
};

/**
 * Per-module metrics: attempts, avg accuracy, completion count (optional)
 */
export const getModuleMetrics = async () => {
  // Join Attempts (by moduleId) and compute metrics
  const agg = await Attempt.aggregate([
    {
      $group: {
        _id: "$moduleId",
        attempts: { $sum: 1 },
        correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }
      }
    },
    {
      $project: {
        moduleId: "$_id",
        attempts: 1,
        correct: 1,
        accuracy: { $cond: [{ $eq: ["$attempts", 0] }, 0, { $multiply: [{ $divide: ["$correct", "$attempts"] }, 100] }] }
      }
    },
    {
      $lookup: {
        from: "modules",
        localField: "moduleId",
        foreignField: "_id",
        as: "module"
      }
    },
    { $unwind: { path: "$module", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        moduleId: 1,
        attempts: 1,
        correct: 1,
        accuracy: { $round: ["$accuracy", 2] },
        title: "$module.title",
        difficulty: "$module.difficulty",
        tags: "$module.tags"
      }
    },
    { $sort: { attempts: -1 } }
  ]);

  return agg;
};

/**
 * Phishing-specific metrics: clicks vs reports vs ignored
 */
export const getPhishingMetrics = async () => {
  const agg = await PhishAttempt.aggregate([
    {
      $group: {
        _id: "$simulationId",
        total: { $sum: 1 },
        clicked: { $sum: { $cond: [{ $eq: ["$action", "clicked"] }, 1, 0] } },
        reported: { $sum: { $cond: [{ $eq: ["$action", "reported"] }, 1, 0] } },
        ignored: { $sum: { $cond: [{ $eq: ["$action", "ignored"] }, 1, 0] } }
      }
    },
    {
      $lookup: {
        from: "simulations",
        localField: "_id",
        foreignField: "_id",
        as: "simulation"
      }
    },
    { $unwind: { path: "$simulation", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        simulationId: "$_id",
        title: "$simulation.title",
        total: 1,
        clicked: 1,
        reported: 1,
        ignored: 1,
        clickRate: { $cond: [{ $eq: ["$total", 0] }, 0, { $round: [{ $multiply: [{ $divide: ["$clicked", "$total"] }, 100] }, 2] }] },
        reportRate: { $cond: [{ $eq: ["$total", 0] }, 0, { $round: [{ $multiply: [{ $divide: ["$reported", "$total"] }, 100] }, 2] }] }
      }
    },
    { $sort: { total: -1 } }
  ]);

  return agg;
};

/**
 * Leaderboard (top users by accuracy or totalCorrect)
 */
export const getLeaderboard = async (limit = 10) => {
  const top = await Progress.find().sort({ accuracy: -1, totalCorrect: -1 }).limit(limit).lean();
  const userIds = top.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }).select("_id name email").lean();
  const usersMap = new Map(users.map(u => [String(u._id), u]));
  return top.map(p => ({
    userId: p.userId,
    name: usersMap.get(String(p.userId))?.name ?? "Unknown",
    email: usersMap.get(String(p.userId))?.email ?? "",
    accuracy: p.accuracy,
    totalCorrect: p.totalCorrect,
    streak: p.streak,
    lastActiveAt: p.lastActiveAt
  }));
};

/**
 * Time-series attempts (last N days) for charts
 */
export const getAttemptsTimeSeries = async (days = 14) => {
  const from = new Date();
  from.setDate(from.getDate() - days);

  const agg = await Attempt.aggregate([
    { $match: { createdAt: { $gte: from } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        attempts: { $sum: 1 },
        correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }
      }
    },
    { $sort: { "_id": 1 } },
    {
      $project: {
        date: "$_id",
        attempts: 1,
        correct: 1,
        accuracy: { $cond: [{ $eq: ["$attempts", 0] }, 0, { $round: [{ $multiply: [{ $divide: ["$correct", "$attempts"] }, 100] }, 2] }] }
      }
    }
  ]);

  return agg;
};
