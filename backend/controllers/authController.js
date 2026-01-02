import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js"
import { upsertUser } from "../models/userService.js";




// Register user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) { res.status(400); throw new Error("User exists"); }

  const user = new User({ name, email, password, role });
  await user.save();

  res.status(201).json({
    message: "User registered",
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    },
    token: generateToken(user._id),

  });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401); throw new Error("Invalid email or password");
  }
});

// Admin update/upsert user
export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, avatarUrl, bio, password } = req.body;

  let user = await User.findOne({ userId: Number(userId) });
  if (user) {
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (role !== undefined) user.role = role;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;
    if (password) user.password = password;
    await user.save();
  } else {
    if (!name || !email) {
      res.status(400);
      throw new Error("name and email are required for new users");
    }
    user = new User({ name, email, role, avatarUrl, bio, ...(password && { password }) });
    await user.save();
  }

  res.status(200).json({
    message: "User updated/created",
    user,
  });
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ userId: Number(userId) });
  if (!user) { res.status(404); throw new Error("User not found"); }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted" });
});
