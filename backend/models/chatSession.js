import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  mode: { type: String, enum: ["tutor", "answer"], default: "tutor" },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },

  summaryMemory: {
    type: String,
    default: ""
  },

  lastMistake: {
    question: { type: String, default: "" },
    userAnswer: { type: String, default: "" },
    correctAnswer: { type: String, default: "" },
    explanation: { type: String, default: "" }
  },

}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);
