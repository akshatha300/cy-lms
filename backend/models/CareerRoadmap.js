import mongoose from "mongoose";

const careerRoadmapSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredModules: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    moduleName: String,
    order: Number,
    isOptional: {
      type: Boolean,
      default: false
    }
  }],
  requiredLabs: [{
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true
    },
    labName: String,
    order: Number,
    minAccuracy: {
      type: Number,
      default: 70
    },
    isOptional: {
      type: Boolean,
      default: false
    }
  }],
  requiredSkills: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true
    },
    skillName: String,
    minCompetency: {
      type: Number,
      default: 75
    },
    weight: {
      type: Number,
      default: 1.0
    }
  }],
  minQuizScore: {
    type: Number,
    default: 75,
    min: 0,
    max: 100
  },
  estimatedDuration: {
    type: Number, // in weeks
    required: true
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "intermediate"
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "USD"
    }
  },
  prerequisites: [{
    type: String
  }],
  careerOutlook: {
    growth: String,
    demand: String,
    description: String
  },
  scoreWeights: {
    moduleCompletion: {
      type: Number,
      default: 0.3
    },
    labCompletion: {
      type: Number,
      default: 0.3
    },
    quizAverage: {
      type: Number,
      default: 0.2
    },
    skillCompetency: {
      type: Number,
      default: 0.2
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: String,
  color: {
    type: String,
    default: "#3b82f6"
  }
}, {
  timestamps: true
});

// Index for faster queries
careerRoadmapSchema.index({ roleName: 1 });
careerRoadmapSchema.index({ isActive: 1 });

export default mongoose.model("CareerRoadmap", careerRoadmapSchema);
