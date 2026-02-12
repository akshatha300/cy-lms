import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: Number,
      required: true,
    },
    cellCodes: [
      {
        cellIndex: Number,
        code: String,
      },
    ],
    combinedCode: {
      type: String,
      required: true,
    },
    evaluation: {
      selected_features: [String],
      r2_score: Number,
      passes_feature_selection: Boolean,
      meets_score_threshold: Boolean,
      total_marks: Number,
      feedback: String,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
