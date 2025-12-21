import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    currentDifficulty: {
      type: Number,
      default: 1
    },

    totalCorrect: {
      type: Number,
      default: 0
    },

    totalWrong: {
      type: Number,
      default: 0
    },

    streak: {
      type: Number,
      default: 0
    },

    attemptsCount: {
      type: Number,
      default: 0
    },

    accuracy: {
      type: Number,
      default: 0 // percentage 0-100
    },

    lastActiveAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
