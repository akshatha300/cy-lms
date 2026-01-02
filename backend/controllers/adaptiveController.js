import { calculateNewDifficulty, getNextDifficulty } from "../services/adaptiveEngine.js";
import Progress from "../models/Progress.js";

export const updateDifficulty = async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const userId = req.user._id;

    if (typeof isCorrect !== "boolean") {
      return res.status(400).json({ message: "isCorrect must be boolean" });
    }

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        currentDifficulty: 1
      });
    }

    const newDifficulty = calculateNewDifficulty(progress.currentDifficulty, isCorrect);
    progress.currentDifficulty = newDifficulty;
    progress.attemptsCount += 1;
    progress.totalCorrect += isCorrect ? 1 : 0;
    progress.totalWrong += isCorrect ? 0 : 1;
    progress.streak = isCorrect ? progress.streak + 1 : 0;
    progress.accuracy = progress.attemptsCount
      ? Math.round((progress.totalCorrect / progress.attemptsCount) * 100)
      : 0;
    progress.lastActiveAt = new Date();
    await progress.save();

    res.json({ newDifficulty });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDifficulty = async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await Progress.findOne({ userId });

    const difficulty = getNextDifficulty(progress);

    res.json({ difficulty });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
