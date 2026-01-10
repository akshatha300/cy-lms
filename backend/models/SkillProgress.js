import mongoose from "mongoose";

const skillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecurityRole",
      // Optional: for context when tracking progress toward a specific role
    },

    // Module completion tracking
    requiredModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    modulesCompleted: {
      type: Number,
      default: 0,
    },

    // Lab tracking
    labsCompleted: {
      type: Number,
      default: 0,
    },
    labsPassed: {
      type: Number,
      default: 0,
    },
    labAttempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabAttempt",
      },
    ],

    // Quiz/Assessment tracking
    quizAttempts: {
      type: Number,
      default: 0,
    },
    bestQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastQuizDate: {
      type: Date,
    },
    allQuizScores: [
      {
        date: Date,
        score: Number,
      },
    ],

    // Overall completion
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // Calculated: (modulesCompleted / requiredModules.length + labsPassed / requiredLabCount + bestQuizScore) / 3
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    lastActivityAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Composite unique index: one record per user-skill pair
skillProgressSchema.index({ userId: 1, skillId: 1 }, { unique: true });

export default mongoose.model("SkillProgress", skillProgressSchema);
