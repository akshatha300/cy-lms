import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["module", "lab", "career_path", "resource", "remedial"],
    required: true
  },
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  reasons: [{
    type: String,
    enum: [
      "weak_subject",
      "past_performance",
      "learning_behavior",
      "skill_gap",
      "career_alignment",
      "peer_success",
      "difficulty_match",
      "time_availability",
      "interest_based"
    ]
  }],
  metadata: {
    difficulty: Number,
    estimatedTime: Number,
    tags: [String],
    prerequisites: [String],
    learningObjectives: [String],
    successRate: Number,
    averageRating: Number,
    completionTime: Number,
    relatedSkills: [String]
  },
  status: {
    type: String,
    enum: ["pending", "viewed", "started", "completed", "dismissed"],
    default: "pending"
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
recommendationSchema.index({ user: 1, status: 1, priority: -1 });
recommendationSchema.index({ user: 1, type: 1, score: -1 });
recommendationSchema.index({ user: 1, expiresAt: 1 });

// Virtual for recommendation strength
recommendationSchema.virtual('strength').get(function() {
  return {
    score: this.score,
    priority: this.priority,
    combined: (this.score * 0.7) + (this.priority / 100 * 0.3)
  };
});

export default mongoose.model("Recommendation", recommendationSchema);
