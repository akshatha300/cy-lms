import express from "express";
import { body, validationResult } from "express-validator";

import { createQuestion, getQuestionsByModule } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin: create a question for a module
router.post(
  "/",
  protect,
  isAdmin,
  [
    body("moduleId").notEmpty().withMessage("moduleId required"),
    body("questionText").notEmpty().withMessage("questionText required"),
    body("options").isArray().withMessage("options must be array"),
    body("correctAnswer").notEmpty().withMessage("correctAnswer required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createQuestion
);

// Learner: get all questions for a specific module
router.get("/:moduleId", protect, getQuestionsByModule);

export default router;
