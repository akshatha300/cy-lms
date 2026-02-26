import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's current role (simplified version without SecurityRole dependency)
router.get("/me/role", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Return basic role info since we removed SecurityRole
    res.json({
      primaryRole: null, // No role selected since we removed SecurityRole
      roleFiltered: false,
      roleName: null,
      message: "Role system has been simplified for AIML platform"
    });
  } catch (error) {
    console.error("Get user role error:", error);
    res.status(500).json({ message: "Failed to get user role" });
  }
});

export default router;
