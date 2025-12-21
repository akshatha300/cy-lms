import Question from "../models/Questions.js";
import { recordAttempt } from "./../controllers/progressController.js";

// Evaluate a user's attempt at a question.
// Delegates persistence and progress updates to recordAttempt.
export const evaluateQuestionAttempt = async (req, res) => {
  try {
    const { questionId, userAnswer, timeTakenSeconds } = req.body;

    if (!questionId || !userAnswer) {
      return res
        .status(400)
        .json({ message: "questionId and userAnswer required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let isCorrect = false;

    // 1. If MCQ → directly compare correct answer (case-insensitive)
    if (question.type === "mcq") {
      isCorrect =
        question.correctAnswer.trim().toLowerCase() ===
        userAnswer.trim().toLowerCase();
    }

    // TODO: For "short" or "ai_generated" types, you can later plug in AI evaluation.

    // 2. Call progress system to record the attempt
    req.body.isCorrect = isCorrect;
    req.body.moduleId = question.moduleId;
    req.body.difficultyAtAttempt = question.difficulty;
    req.body.timeTakenSeconds = timeTakenSeconds ?? null;

    return recordAttempt(req, res);
  } catch (error) {
    console.error("evaluateQuestionAttempt ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
