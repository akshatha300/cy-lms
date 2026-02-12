import fs from "fs";
import path from "path";
import { exec } from "child_process";
import crypto from "crypto";
import Submission from "../models/Submission.js";
import { evaluateSubmission as evaluateWithAI } from "../services/aiEvaluationService.js";

// Helper to run python script
const executePython = (code, dir) => {
  return new Promise(async (resolve, reject) => {
    const fileId = crypto.randomBytes(4).toString("hex");
    const fileName = `temp_${fileId}.py`;
    const filePath = path.join(dir, fileName);

    try {
      await fs.promises.writeFile(filePath, code);
      
      // Run in the directory where CSV exists
      const child = exec(`python "${fileName}"`, { cwd: dir }, async (error, stdout, stderr) => {
        // Cleanup temp file
        try {
          await fs.promises.unlink(filePath);
        } catch (e) {
            // ignore cleanup error
        }

        resolve({ stdout, stderr, error: error ? error.message : null });
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const runCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    // We run nicely in backend/data where CSV should be
    const dataDir = path.join(process.cwd(), "backend", "data");
    
    // Ensure dir exists
    if (!fs.existsSync(dataDir)) {
        await fs.promises.mkdir(dataDir, { recursive: true });
    }

    const { stdout, stderr, error } = await executePython(code, dataDir);

    if (error) {
        // We return 200 with error property specifically for the Lab UI to display it in terminal
        return res.json({ stdout: stdout || "", stderr: stderr || error });
    }
    
    return res.json({ stdout, stderr });

  } catch (error) {
    console.error("runCode error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const evaluateCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const dataDir = path.join(process.cwd(), "backend", "data");
    // Ensure CSV exists
    const csvPath = path.join(dataDir, "StudentsPerformance.csv");
    if (!fs.existsSync(csvPath)) {
        console.warn("CSV not found at " + csvPath);
    }

    // 1. Execute Code
    const { stdout, stderr, error } = await executePython(code, dataDir);

    if (error) {
        return res.json({
            feedback: "Runtime Error Check Failed.",
            error: stderr || error,
            total_marks: 0,
            stdout: stdout,
            passes_feature_selection: false,
            meets_score_threshold: false,
            r2_score: 0,
            selected_features: []
        });
    }

    // 2. AI Evaluate
    const evaluation = await evaluateWithAI(code, stdout);

    return res.json(evaluation);

  } catch (error) {
    console.error("evaluateCode exception:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const submitLab = async (req, res) => {
  try {
    const userId = req.user?._id; // require auth middleware usage
    const { studentId, questionId, cellCodes, combinedCode, evaluation } = req.body;

    // Use logged in user if studentId not provided in body, or validate match
    const finalStudentId = userId || studentId;

    if (!finalStudentId) {
        // If strict auth is not enabled on this route yet, we might tolerate missing ID for demo
        // But Schema requires Ref to User. So we need a valid ID.
        // Assuming the ID passed from frontend "101" is likely INVALID ObjectId if it's just "101".
        // This will crash Mongoose validation.
        // Let's create a safeguard.
        // If we simply want to save the submission without a valid user for testing:
        if (studentId === "101") {
           // We can't save to 'studentId' as ObjectId if it is "101".
           // We will skip saving to DB or mock an ObjectId for demo if needed.
           // However, let's assuming there IS a user logged in on the frontend or we skip.
           console.warn("Skipping DB Save: Invalid Student ID or Auth missing.");
           return res.json({ message: "Submission processed (DB save skipped for demo)", submissionId: "mock-id" });
        }
        
        return res.status(401).json({ error: "Unauthorized or Invalid Student ID" });
    }

    const submission = new Submission({
        studentId: finalStudentId,
        questionId: questionId || 1, 
        cellCodes,
        combinedCode,
        evaluation
    });

    await submission.save();

    return res.json({ message: "Submission saved successfully", submissionId: submission._id });

  } catch (error) {
    console.error("submitLab error:", error);
    return res.status(500).json({ error: "Failed to save submission" });
  }
};
