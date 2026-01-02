import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// List all users (admin)
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("userId name email role avatarUrl bio createdAt")
    .sort({ createdAt: -1 });
  res.json(users);
});

// Get logged-in user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  if (!user) { res.status(404); throw new Error("User not found"); }

  res.status(200).json({
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  });
});

// Update logged-in user
export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  if (!user) { res.status(404); throw new Error("User not found"); }

  const { name, email, password, avatarUrl, bio } = req.body;
  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  if (avatarUrl) user.avatarUrl = avatarUrl;
  if (bio) user.bio = bio;
  if (password) user.password = password;

  await user.save();

  res.status(200).json({
    message: "Profile updated",
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    },
  });
});


// GET user by userId
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// UPDATE user by userId
export const updateUserById = asyncHandler(async (req, res) => {
  const updates = req.body;

  const user = await User.findOneAndUpdate(
    { userId: req.params.userId },
    updates,
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    message: "User updated",
    user
  });
});

// DELETE user by userId
export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({ userId: req.params.userId });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    message: "User deleted"
  });
});
