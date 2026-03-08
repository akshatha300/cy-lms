import mongoose from "mongoose";

const labSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "python",
      enum: ["python", "javascript", "r", "java"],
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed", "error"],
      default: "pending",
    },
    executionResults: {
      output: String,
      error: String,
      executionTime: Number, // in milliseconds
      memoryUsage: Number, // in MB
      stdout: String,
      stderr: String,
    },
    metrics: {
      accuracy: Number,
      precision: Number,
      recall: Number,
      f1Score: Number,
      customMetrics: Map, // For lab-specific metrics
    },
    testResults: [{
      testName: String,
      passed: Boolean,
      actualOutput: String,
      expectedOutput: String,
      errorMessage: String,
      executionTime: Number,
    }],
    comparison: {
      previousAttempts: [{
        attemptId: mongoose.Schema.Types.ObjectId,
        accuracy: Number,
        precision: Number,
        recall: Number,
        f1Score: Number,
        timestamp: Date,
        improvement: String, // "better", "worse", "same"
      }],
      bestScore: {
        accuracy: Number,
        precision: Number,
        recall: Number,
        f1Score: Number,
        attemptId: mongoose.Schema.Types.ObjectId,
      },
      averageScore: {
        accuracy: Number,
        precision: Number,
        recall: Number,
        f1Score: Number,
      },
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      suggestions: [String],
      score: Number, // 0-100
      automatedComments: String,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    hints: [{
      hint: String,
      timestamp: Date,
      used: Boolean,
    }],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Index for efficient queries
labSubmissionSchema.index({ user: 1, lab: 1 });
labSubmissionSchema.index({ user: 1, status: 1 });
labSubmissionSchema.index({ lab: 1, isCompleted: 1 });

export default mongoose.model("LabSubmission", labSubmissionSchema);
