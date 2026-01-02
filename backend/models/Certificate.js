import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		recipientName: { type: String, required: true, trim: true },
		courseTitle: { type: String, required: true, trim: true },
		filePath: { type: String, required: true },
		issuedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
