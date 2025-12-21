import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module"
    },

    isCorrect: {
      type: Boolean,
      required: true
    },

    userAnswer: {
      type: String
    },

    difficultyAtAttempt: {
      type: Number,
      default: 1
    },

    timeTakenSeconds: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
