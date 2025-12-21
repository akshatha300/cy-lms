import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import { registerUser, loginUser, updateUser, deleteUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Logged-in user routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only routes
router.put("/:userId", protect, isAdmin, updateUser);
router.delete("/:userId", protect, isAdmin, deleteUser);

export default router;
import { getUserById, updateUserById, deleteUserById } from "../controllers/userController.js";


router.get("/:userId", getUserById);
router.put("/:userId", updateUserById);
router.delete("/:userId", deleteUserById);

