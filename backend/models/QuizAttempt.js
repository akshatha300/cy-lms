import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  answers: [{
    questionId: {
      type: String,
      required: true,
    },
    selectedAnswer: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    }
  }],
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  timeSpent: {
    type: Number, // total time in seconds
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
quizAttemptSchema.index({ user: 1, moduleId: 1 });
quizAttemptSchema.index({ user: 1, completedAt: -1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
