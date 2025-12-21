import { calculateNewDifficulty, getNextDifficulty } from "../services/adaptiveEngine.js";
import Progress from "../models/Progress.js";

export const updateDifficulty = async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        currentDifficulty: 1
      });
    }

    const newDifficulty = calculateNewDifficulty(progress.currentDifficulty, isCorrect);

    progress.currentDifficulty = newDifficulty;
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
