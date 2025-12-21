import Progress from "../models/Progress.js";
import Attempt from "../models/Attempt.js";
import { calculateNewDifficulty } from "../services/adaptiveEngine.js";
import User from "../models/User.js";

/**
 * Record an attempt:
 * - create Attempt doc
 * - update Progress totals, streaks, accuracy, lastActiveAt, currentDifficulty
 */
export const recordAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      questionId,
      moduleId = null,
      isCorrect,
      userAnswer = "",
      difficultyAtAttempt = 1,
      timeTakenSeconds = null
    } = req.body;

    if (!questionId || typeof isCorrect !== "boolean") {
      return res.status(400).json({ message: "questionId and isCorrect(boolean) required" });
    }

    // create attempt doc
    const attempt = await Attempt.create({
      userId,
      questionId,
      moduleId,
      isCorrect,
      userAnswer,
      difficultyAtAttempt,
      timeTakenSeconds
    });

    // find or create progress doc
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        currentDifficulty: difficultyAtAttempt || 1,
        totalCorrect: 0,
        totalWrong: 0,
        streak: 0,
        attemptsCount: 0,
        accuracy: 0
      });
    }

    // update totals
    progress.attemptsCount = (progress.attemptsCount || 0) + 1;
    if (isCorrect) {
      progress.totalCorrect = (progress.totalCorrect || 0) + 1;
      progress.streak = (progress.streak || 0) + 1;
    } else {
      progress.totalWrong = (progress.totalWrong || 0) + 1;
      progress.streak = 0; // reset streak on wrong answer
    }

    // recompute accuracy
    const total = progress.totalCorrect + progress.totalWrong;
    progress.accuracy = total > 0 ? Math.round((progress.totalCorrect / total) * 100) : 0;

    // adjust difficulty using adaptive engine
    const newDifficulty = calculateNewDifficulty(progress.currentDifficulty || difficultyAtAttempt || 1, isCorrect);
    progress.currentDifficulty = newDifficulty;

    progress.lastActiveAt = new Date();

    await progress.save();

    return res.status(201).json({
      attempt,
      progress: {
        currentDifficulty: progress.currentDifficulty,
        totalCorrect: progress.totalCorrect,
        totalWrong: progress.totalWrong,
        streak: progress.streak,
        attemptsCount: progress.attemptsCount,
        accuracy: progress.accuracy,
        lastActiveAt: progress.lastActiveAt
      }
    });
  } catch (error) {
    console.error("recordAttempt error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user's progress summary
 */
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    let progress = await Progress.findOne({ userId }).lean();
    if (!progress) {
      // return defaults if not found
      return res.json({
        userId,
        currentDifficulty: 1,
        totalCorrect: 0,
        totalWrong: 0,
        streak: 0,
        attemptsCount: 0,
        accuracy: 0,
        lastActiveAt: null
      });
    }

    return res.json(progress);
  } catch (error) {
    console.error("getUserProgress error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get leaderboard (top N users by accuracy or totalCorrect)
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    // Rank by accuracy then totalCorrect
    const top = await Progress.find()
      .sort({ accuracy: -1, totalCorrect: -1 })
      .limit(limit)
      .lean();

    // join user names (minimally)
    const userIds = top.map((p) => p.userId);
    const users = await User.find({ _id: { $in: userIds } }).select("_id name email").lean();

    const usersMap = new Map(users.map(u => [String(u._id), u]));

    const leaderboard = top.map(p => ({
      userId: p.userId,
      name: usersMap.get(String(p.userId))?.name || "Unknown",
      email: usersMap.get(String(p.userId))?.email || "",
      accuracy: p.accuracy,
      totalCorrect: p.totalCorrect,
      streak: p.streak,
      lastActiveAt: p.lastActiveAt
    }));

    return res.json({ leaderboard });
  } catch (error) {
    console.error("getLeaderboard error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Reset user's progress (admin or user)
 */
export const resetProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    // admin only can reset other users' progress
    if (req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Progress.findOneAndDelete({ userId });
    // Optionally delete attempts:
    await Attempt.deleteMany({ userId });

    return res.json({ message: "Progress reset" });
  } catch (error) {
    console.error("resetProgress error:", error);
    return res.status(500).json({ message: error.message });
  }
};
