import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },

  questionText: {
    type: String,
    required: true
  },

  options: {
    type: [String],
    required: true
  },

  correctAnswer: {
    type: String,
    required: true
  },

  // Optional explanation shown to the learner after answering
  explanation: {
    type: String,
    default: ""
  },

  difficulty: {
    type: Number,
    default: 1
  },

  type: {
    type: String,
    enum: ["mcq", "short", "ai_generated"],
    default: "mcq"
  }
});

const Questions = mongoose.model("Question", questionSchema);
export default Questions;
