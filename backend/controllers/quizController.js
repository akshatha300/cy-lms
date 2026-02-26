import { quizQuestions, moduleMetadata } from "../data/quizData.js";
import QuizAttempt from "../models/QuizAttempt.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/quiz/:moduleId/questions
 * Get quiz questions for a specific module
 */
export const getQuizQuestions = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user._id;

  // Check if module exists
  if (!quizQuestions[moduleId]) {
    res.status(404);
    throw new Error(`Quiz not found for module: ${moduleId}`);
  }

  // Get module metadata
  const metadata = moduleMetadata[moduleId];

  // Check if user has already attempted this quiz
  const previousAttempts = await QuizAttempt.find({ 
    user: userId, 
    moduleId 
  }).sort({ completedAt: -1 });

  // Return questions without correct answers
  const questionsWithoutAnswers = quizQuestions[moduleId].map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
  }));

  res.json({
    message: "Quiz questions retrieved",
    moduleId,
    metadata,
    questions: questionsWithoutAnswers,
    previousAttempts: previousAttempts.map(attempt => ({
      score: attempt.score,
      percentage: attempt.percentage,
      passed: attempt.passed,
      completedAt: attempt.completedAt,
      timeSpent: attempt.timeSpent,
    }))
  });
});

/**
 * POST /api/quiz/:moduleId/submit
 * Submit quiz answers
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const { answers, timeSpent } = req.body;
  const userId = req.user._id;

  // Validate module exists
  if (!quizQuestions[moduleId]) {
    res.status(404);
    throw new Error(`Quiz not found for module: ${moduleId}`);
  }

  // Get correct answers
  const correctAnswers = quizQuestions[moduleId];
  const metadata = moduleMetadata[moduleId];

  // Calculate results
  let correctCount = 0;
  const processedAnswers = answers.map(answer => {
    const question = correctAnswers.find(q => q.id === answer.questionId);
    const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
    
    if (isCorrect) {
      correctCount++;
    }

    return {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
      timeSpent: answer.timeSpent || 0,
    };
  });

  const percentage = Math.round((correctCount / correctAnswers.length) * 100);
  const passed = percentage >= metadata.passingScore;

  // Save attempt
  const quizAttempt = await QuizAttempt.create({
    user: userId,
    moduleId,
    answers: processedAnswers,
    score: correctCount,
    totalQuestions: correctAnswers.length,
    percentage,
    passed,
    timeSpent: timeSpent || 0,
  });

  // Get detailed results with explanations
  const detailedResults = answers.map(answer => {
    const question = correctAnswers.find(q => q.id === answer.questionId);
    return {
      question: question.question,
      userAnswer: question.options[answer.selectedAnswer],
      correctAnswer: question.options[question.correctAnswer],
      isCorrect: question.correctAnswer === answer.selectedAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
    };
  });

  res.status(201).json({
    message: "Quiz submitted successfully",
    results: {
      score: correctCount,
      totalQuestions: correctAnswers.length,
      percentage,
      passed,
      timeSpent,
      completedAt: quizAttempt.completedAt,
    },
    detailedResults,
    attemptId: quizAttempt._id,
  });
});

/**
 * GET /api/quiz/progress
 * Get user's overall quiz progress
 */
export const getQuizProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all attempts for the user
  const attempts = await QuizAttempt.find({ user: userId })
    .sort({ completedAt: -1 });

  // Calculate progress for each module
  const progress = {};
  
  Object.keys(moduleMetadata).forEach(moduleId => {
    const moduleAttempts = attempts.filter(a => a.moduleId === moduleId);
    const bestAttempt = moduleAttempts.reduce((best, current) => 
      (current.percentage > (best?.percentage || 0)) ? current : best, null);

    progress[moduleId] = {
      moduleId,
      metadata: moduleMetadata[moduleId],
      totalAttempts: moduleAttempts.length,
      bestScore: bestAttempt?.percentage || 0,
      bestAttemptDate: bestAttempt?.completedAt || null,
      passed: bestAttempt?.passed || false,
      lastAttempt: moduleAttempts[0] || null,
      averageTime: moduleAttempts.length > 0 
        ? Math.round(moduleAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / moduleAttempts.length)
        : 0,
    };
  });

  // Calculate overall statistics
  const totalModules = Object.keys(moduleMetadata).length;
  const passedModules = Object.values(progress).filter(p => p.passed).length;
  const overallProgress = Math.round((passedModules / totalModules) * 100);
  const averageScore = Math.round(
    Object.values(progress).reduce((sum, p) => sum + p.bestScore, 0) / totalModules
  );

  res.json({
    message: "Quiz progress retrieved",
    overallProgress,
    totalModules,
    passedModules,
    averageScore,
    moduleProgress: Object.values(progress),
    recentAttempts: attempts.slice(0, 10).map(attempt => ({
      moduleId: attempt.moduleId,
      moduleName: moduleMetadata[attempt.moduleId]?.title || attempt.moduleId,
      score: attempt.percentage,
      passed: attempt.passed,
      completedAt: attempt.completedAt,
      timeSpent: attempt.timeSpent,
    })),
  });
});

/**
 * GET /api/quiz/:moduleId/attempts
 * Get all attempts for a specific module
 */
export const getModuleAttempts = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user._id;

  const attempts = await QuizAttempt.find({ 
    user: userId, 
    moduleId 
  }).sort({ completedAt: -1 });

  res.json({
    message: "Module attempts retrieved",
    moduleId,
    attempts: attempts.map(attempt => ({
      id: attempt._id,
      score: attempt.score,
      percentage: attempt.percentage,
      passed: attempt.passed,
      timeSpent: attempt.timeSpent,
      completedAt: attempt.completedAt,
      answers: attempt.answers,
    })),
  });
});

/**
 * GET /api/quiz/leaderboard
 * Get quiz leaderboard (optional)
 */
export const getQuizLeaderboard = asyncHandler(async (req, res) => {
  const { moduleId } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  let matchStage = {};
  if (moduleId) {
    matchStage.moduleId = moduleId;
  }

  const leaderboard = await QuizAttempt.aggregate([
    { $match: matchStage },
    { $sort: { percentage: -1, completedAt: -1 } },
    {
      $group: {
        _id: { user: "$user", moduleId: "$moduleId" },
        bestPercentage: { $max: "$percentage" },
        bestScore: { $max: "$score" },
        totalQuestions: { $first: "$totalQuestions" },
        completedAt: { $first: "$completedAt" },
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id.user",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        user: {
          _id: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
        },
        moduleId: "$_id.moduleId",
        percentage: "$bestPercentage",
        score: "$bestScore",
        totalQuestions: "$totalQuestions",
        completedAt: "$completedAt",
      }
    },
    { $sort: { percentage: -1 } },
    { $limit: limit }
  ]);

  res.json({
    message: "Leaderboard retrieved",
    leaderboard,
  });
});
