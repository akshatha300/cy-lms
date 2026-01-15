import express from "express";
import Lab from "../models/Lab.js"; // Add this import
import {
  getLabs,
  getLabDetail,
  createLabEndpoint,
  createLabAttemptEndpoint,
  completeLabAttemptEndpoint,
  getMyLabAttempts,
} from "../controllers/labController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin routes (must come before parameterized routes)
router.get("/admin/labs", protect, isAdmin, async (req, res) => {
  try {
    const labs = await Lab.find().populate('skillId');
    res.json({
      message: "Admin labs retrieved",
      labs,
      count: labs.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve labs", error: error.message });
  }
});

router.put("/:labId", protect, isAdmin, async (req, res) => {
  try {
    const { name, description, difficulty, scenario, timeLimit, requiredTools, tags, skillId, objectiveText, environment } = req.body;
    
    const lab = await Lab.findByIdAndUpdate(
      req.params.labId,
      { name, description, difficulty, scenario, timeLimit, requiredTools, tags, skillId, objectiveText, environment },
      { new: true, runValidators: true }
    );

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.json({
      message: "Lab updated successfully",
      lab
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update lab", error: error.message });
  }
});

router.delete("/:labId", protect, isAdmin, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.labId);

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.json({
      message: "Lab deleted successfully",
      lab
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lab", error: error.message });
  }
});

// Regular user routes
router.get("/", protect, getLabs);
router.post("/", protect, isAdmin, createLabEndpoint);
router.get("/:labId", protect, getLabDetail);
router.post("/:labId/attempts", protect, createLabAttemptEndpoint);
router.get("/attempts/me", protect, getMyLabAttempts);
router.post("/attempts/:attemptId/complete", protect, completeLabAttemptEndpoint);

export default router;