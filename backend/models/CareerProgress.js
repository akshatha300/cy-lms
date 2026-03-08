import mongoose from "mongoose";

const careerProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  roadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareerRoadmap",
    required: true
  },
  moduleProgress: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    quizScore: Number,
    timeSpent: Number // in minutes
  }],
  labProgress: [{
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    accuracy: Number,
    attempts: {
      type: Number,
      default: 0
    },
    bestScore: Number,
    timeSpent: Number
  }],
  skillProgress: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true
    },
    competency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: Date
  }],
  overallMetrics: {
    moduleCompletion: {
      type: Number,
      default: 0
    },
    labCompletion: {
      type: Number,
      default: 0
    },
    quizAverage: {
      type: Number,
      default: 0
    },
    skillCompetency: {
      type: Number,
      default: 0
    },
    readinessScore: {
      type: Number,
      default: 0
    }
  },
  readinessLevel: {
    type: String,
    enum: ["beginner", "intermediate", "job-ready"],
    default: "beginner"
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  estimatedCompletionTime: Number, // in weeks
  actualTimeSpent: Number, // in hours
  milestones: [{
    type: {
      type: String,
      enum: ["module_completed", "lab_completed", "quiz_passed", "skill_mastered"]
    },
    description: String,
    achievedAt: Date,
    score: Number
  }]
}, {
  timestamps: true
});

// Compound index for user-roadmap combinations
careerProgressSchema.index({ user: 1, roadmap: 1 }, { unique: true });

export default mongoose.model("CareerProgress", careerProgressSchema);
