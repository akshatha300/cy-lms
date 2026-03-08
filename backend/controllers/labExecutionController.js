import LabSubmission from "../models/LabSubmission.js";
import Lab from "../models/Lab.js";
import mongoose from "mongoose";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

// Execute code in isolated environment
export const executeLabCode = async (req, res) => {
  try {
    const { labId, code, language = "python" } = req.body;
    const userId = req.user._id;

    // Validate lab exists
    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    // Create submission record
    const submission = new LabSubmission({
      user: userId,
      lab: labId,
      code,
      language,
      status: "pending",
      attempts: 1,
    });

    await submission.save();

    // Execute code asynchronously
    executeCodeAsync(submission._id, code, language, lab);

    res.status(202).json({
      message: "Code execution started",
      submissionId: submission._id,
      status: "pending",
    });
  } catch (error) {
    logger.error("Error starting code execution:", error);
    res.status(500).json({ error: "Failed to start code execution" });
  }
};

// Async code execution
const executeCodeAsync = async (submissionId, code, language, lab) => {
  try {
    const submission = await LabSubmission.findById(submissionId);
    if (!submission) return;

    // Update status to running
    submission.status = "running";
    await submission.save();

    const startTime = Date.now();
    const tempDir = path.join(process.cwd(), "temp", submissionId.toString());
    
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // Write code to file
    const codeFile = path.join(tempDir, `main.${getFileExtension(language)}`);
    await fs.writeFile(codeFile, code);

    // Execute code based on language
    const result = await runCode(codeFile, language, lab);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // Calculate metrics based on lab type
    const metrics = await calculateMetrics(lab, result, code);

    // Get previous attempts for comparison
    const comparison = await calculateComparison(submission.user, submission.lab, metrics);

    // Generate feedback
    const feedback = await generateFeedback(lab, code, result, metrics);

    // Update submission with results
    submission.executionResults = {
      output: result.output,
      error: result.error,
      executionTime,
      memoryUsage: result.memoryUsage || 0,
      stdout: result.stdout,
      stderr: result.stderr,
    };

    submission.metrics = metrics;
    submission.testResults = result.testResults || [];
    submission.comparison = comparison;
    submission.feedback = feedback;
    submission.status = result.error ? "failed" : "completed";
    submission.isCompleted = !result.error;
    submission.completedAt = new Date();

    await submission.save();

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

  } catch (error) {
    logger.error("Error in async code execution:", error);
    
    const submission = await LabSubmission.findById(submissionId);
    if (submission) {
      submission.status = "error";
      submission.executionResults = {
        error: error.message,
        executionTime: 0,
        memoryUsage: 0,
      };
      await submission.save();
    }
  }
};

// Run code based on language
const runCode = async (codeFile, language, lab) => {
  return new Promise((resolve) => {
    let command, args;
    
    switch (language) {
      case "python":
        command = "python";
        args = [codeFile];
        break;
      case "javascript":
        command = "node";
        args = [codeFile];
        break;
      default:
        command = "python";
        args = [codeFile];
    }

    const child = spawn(command, args);
    let stdout = "";
    let stderr = "";
    let output = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
      output += data.toString();
    });

    child.on("close", (code) => {
      resolve({
        output: stdout || stderr,
        stdout,
        stderr,
        error: code !== 0 ? stderr : null,
        exitCode: code,
        testResults: [], // Will be populated by lab-specific tests
      });
    });

    child.on("error", (error) => {
      resolve({
        output: error.message,
        stdout: "",
        stderr: error.message,
        error: error.message,
        exitCode: -1,
        testResults: [],
      });
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill();
      resolve({
        output: "Execution timeout (30s)",
        stdout: "",
        stderr: "Execution timeout",
        error: "Execution timeout",
        exitCode: -1,
        testResults: [],
      });
    }, 30000);
  });
};

// Calculate metrics based on lab type
const calculateMetrics = async (lab, result, code) => {
  const metrics = {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    customMetrics: new Map(),
  };

  // Extract metrics from output based on lab type
  const output = result.stdout || result.output || "";

  switch (lab.title) {
    case "Linear Regression for House Price Prediction":
      metrics.accuracy = extractMetric(output, "Accuracy:") || 0;
      metrics.customMetrics.set("mse", extractMetric(output, "MSE:"));
      metrics.customMetrics.set("r2", extractMetric(output, "R2:"));
      break;

    case "Logistic Regression Classification":
      metrics.accuracy = extractMetric(output, "Accuracy:") || 0;
      metrics.precision = extractMetric(output, "Precision:") || 0;
      metrics.recall = extractMetric(output, "Recall:") || 0;
      metrics.f1Score = extractMetric(output, "F1:") || 0;
      break;

    case "K-Nearest Neighbors (KNN) Algorithm":
      metrics.accuracy = extractMetric(output, "Accuracy:") || 0;
      metrics.customMetrics.set("optimal_k", extractMetric(output, "Optimal K:"));
      break;

    case "Hierarchical Clustering with Wholesale Customers":
      metrics.customMetrics.set("silhouette_score", extractMetric(output, "Silhouette Score:"));
      metrics.customMetrics.set("optimal_clusters", extractMetric(output, "Optimal clusters:"));
      break;

    case "K-Means Clustering with Wholesale Customers":
      metrics.customMetrics.set("silhouette_score", extractMetric(output, "Silhouette Score:"));
      metrics.customMetrics.set("optimal_k", extractMetric(output, "Optimal K:"));
      break;

    case "Gradient Boosting Implementation":
      metrics.accuracy = extractMetric(output, "Accuracy:") || 0;
      metrics.precision = extractMetric(output, "Precision:") || 0;
      metrics.recall = extractMetric(output, "Recall:") || 0;
      metrics.f1Score = extractMetric(output, "F1:") || 0;
      break;

    case "XGBoost Advanced Implementation":
      metrics.accuracy = extractMetric(output, "Accuracy:") || 0;
      metrics.precision = extractMetric(output, "Precision:") || 0;
      metrics.recall = extractMetric(output, "Recall:") || 0;
      metrics.f1Score = extractMetric(output, "F1:") || 0;
      break;

    default:
      // Generic metric extraction
      metrics.accuracy = extractMetric(output, "accuracy") || 0;
      metrics.precision = extractMetric(output, "precision") || 0;
      metrics.recall = extractMetric(output, "recall") || 0;
      metrics.f1Score = extractMetric(output, "f1") || 0;
  }

  return metrics;
};

// Extract metric from output
const extractMetric = (output, prefix) => {
  const regex = new RegExp(`${prefix}\\s*([0-9.]+)`, "i");
  const match = output.match(regex);
  return match ? parseFloat(match[1]) : null;
};

// Calculate comparison with previous attempts
const calculateComparison = async (userId, labId, currentMetrics) => {
  const previousSubmissions = await LabSubmission.find({
    user: userId,
    lab: labId,
    status: "completed",
    _id: { $ne: currentMetrics._id }
  }).sort({ createdAt: -1 }).limit(10);

  const comparison = {
    previousAttempts: [],
    bestScore: {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
    },
    averageScore: {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
    },
  };

  if (previousSubmissions.length === 0) {
    return comparison;
  }

  // Calculate best and average scores
  let totalAccuracy = 0, totalPrecision = 0, totalRecall = 0, totalF1 = 0;

  previousSubmissions.forEach(submission => {
    const metrics = submission.metrics;
    
    // Update best scores
    if (metrics.accuracy > comparison.bestScore.accuracy) {
      comparison.bestScore = {
        accuracy: metrics.accuracy,
        precision: metrics.precision,
        recall: metrics.recall,
        f1Score: metrics.f1Score,
        attemptId: submission._id,
      };
    }

    // Accumulate for average
    totalAccuracy += metrics.accuracy || 0;
    totalPrecision += metrics.precision || 0;
    totalRecall += metrics.recall || 0;
    totalF1 += metrics.f1Score || 0;

    // Compare with current
    const improvement = compareMetrics(currentMetrics, metrics);
    comparison.previousAttempts.push({
      attemptId: submission._id,
      accuracy: metrics.accuracy,
      precision: metrics.precision,
      recall: metrics.recall,
      f1Score: metrics.f1Score,
      timestamp: submission.createdAt,
      improvement,
    });
  });

  // Calculate averages
  const count = previousSubmissions.length;
  comparison.averageScore = {
    accuracy: totalAccuracy / count,
    precision: totalPrecision / count,
    recall: totalRecall / count,
    f1Score: totalF1 / count,
  };

  return comparison;
};

// Compare metrics
const compareMetrics = (current, previous) => {
  const currentScore = (current.accuracy || 0) + (current.precision || 0) + 
                     (current.recall || 0) + (current.f1Score || 0);
  const previousScore = (previous.accuracy || 0) + (previous.precision || 0) + 
                       (previous.recall || 0) + (previous.f1Score || 0);

  if (currentScore > previousScore + 0.1) return "better";
  if (currentScore < previousScore - 0.1) return "worse";
  return "same";
};

// Generate feedback
const generateFeedback = async (lab, code, result, metrics) => {
  const feedback = {
    strengths: [],
    improvements: [],
    suggestions: [],
    score: 0,
    automatedComments: "",
  };

  // Calculate overall score
  const accuracyScore = (metrics.accuracy || 0) * 25;
  const precisionScore = (metrics.precision || 0) * 25;
  const recallScore = (metrics.recall || 0) * 25;
  const f1Score = (metrics.f1Score || 0) * 25;
  feedback.score = Math.round(accuracyScore + precisionScore + recallScore + f1Score);

  // Generate comments based on performance
  if (feedback.score >= 80) {
    feedback.strengths.push("Excellent implementation with high accuracy");
    feedback.automatedComments = "Great work! Your implementation shows strong understanding of the concepts.";
  } else if (feedback.score >= 60) {
    feedback.strengths.push("Good implementation with room for improvement");
    feedback.improvements.push("Consider optimizing hyperparameters for better performance");
    feedback.automatedComments = "Good attempt! Try to improve the accuracy by tuning your model parameters.";
  } else {
    feedback.improvements.push("Review the implementation and fix errors");
    feedback.suggestions.push("Check the data preprocessing and model configuration");
    feedback.automatedComments = "Keep practicing! Review the concepts and try different approaches.";
  }

  // Specific suggestions based on lab type
  if (lab.title && lab.title.includes("Feature Selection")) {
    feedback.suggestions.push("Try different feature selection methods and compare results");
  } else if (lab.title && lab.title.includes("Clustering")) {
    feedback.suggestions.push("Experiment with different numbers of clusters and evaluation metrics");
  } else if (lab.title && lab.title.includes("Ensemble")) {
    feedback.suggestions.push("Tune hyperparameters like learning rate and number of estimators");
  }

  return feedback;
};

// Get submission status
export const getSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    const submission = await LabSubmission.findOne({
      _id: submissionId,
      user: userId,
    }).populate('lab', 'title description');

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json(submission);
  } catch (error) {
    logger.error("Error getting submission status:", error);
    res.status(500).json({ error: "Failed to get submission status" });
  }
};

// Get user's lab submissions
export const getUserLabSubmissions = async (req, res) => {
  try {
    const { labId } = req.params;
    const userId = req.user._id;

    const submissions = await LabSubmission.find({
      user: userId,
      lab: labId,
    }).populate('lab', 'title').sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    logger.error("Error getting user submissions:", error);
    res.status(500).json({ error: "Failed to get submissions" });
  }
};

// Get lab leaderboard
export const getLabLeaderboard = async (req, res) => {
  try {
    const { labId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await LabSubmission.aggregate([
      { $match: { lab: new mongoose.Types.ObjectId(labId), status: "completed" } },
      { $sort: { "feedback.score": -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.name": 1,
          "user.email": 1,
          "feedback.score": 1,
          "metrics.accuracy": 1,
          "metrics.f1Score": 1,
          "attempts": 1,
          "completedAt": 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    logger.error("Error getting lab leaderboard:", error);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
};

// Helper function to get file extension
const getFileExtension = (language) => {
  const extensions = {
    python: "py",
    javascript: "js",
    java: "java",
    r: "R",
  };
  return extensions[language] || "py";
};
