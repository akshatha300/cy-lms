import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Counter from "./Counter.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    userId: { type: Number, unique: true, index: true },
    // Role-based learning path (NEW - optional)
    primaryRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecurityRole",
      default: null,
    },
    selectedRoles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecurityRole",
      },
    ],
    preferredCareerPath: {
      type: String,
      default: null,
      // e.g., "soc", "pentest", "cloud", "governance"
    },
  },
  { timestamps: true }
);

// Auto-increment userId
userSchema.pre("save", async function (next) {
  if (this.isNew && !this.userId) {
    const counter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq;
  }
  next();
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
