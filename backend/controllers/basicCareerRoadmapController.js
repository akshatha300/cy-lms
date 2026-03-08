import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// Create a simple model for basic career roadmaps
const basicCareerRoadmapSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  minQuizScore: {
    type: Number,
    default: 75
  },
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  icon: {
    type: String,
    default: "🎯"
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  prerequisites: [{
    type: String
  }],
  careerOutlook: {
    growth: String,
    demand: String,
    description: String
  },
  scoreWeights: {
    moduleCompletion: { type: Number, default: 0.3 },
    labCompletion: { type: Number, default: 0.3 },
    quizAverage: { type: Number, default: 0.2 },
    skillCompetency: { type: Number, default: 0.2 }
  },
  requiredModules: [{
    name: String,
    description: String
  }],
  requiredLabs: [{
    name: String,
    description: String
  }],
  requiredSkills: [{
    name: String,
    description: String
  }]
}, { timestamps: true });

const BasicCareerRoadmap = mongoose.model("BasicCareerRoadmap", basicCareerRoadmapSchema);

// @desc    Get all career roadmaps
// @route   GET /api/career-roadmap
// @access  Public
export const getCareerRoadmaps = asyncHandler(async (req, res) => {
  try {
    const roadmaps = await BasicCareerRoadmap.find({}).sort({ roleName: 1 });
    
    res.json({
      success: true,
      count: roadmaps.length,
      roadmaps: roadmaps
    });
  } catch (error) {
    console.error("Error fetching career roadmaps:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching career roadmaps",
      error: error.message
    });
  }
});

// @desc    Get career roadmap by ID
// @route   GET /api/career-roadmap/:id
// @access  Public
export const getCareerRoadmapById = asyncHandler(async (req, res) => {
  try {
    const roadmap = await BasicCareerRoadmap.findById(req.params.id);
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }
    
    res.json({
      success: true,
      roadmap: roadmap
    });
  } catch (error) {
    console.error("Error fetching career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching career roadmap",
      error: error.message
    });
  }
});

// @desc    Get user progress for a career roadmap
// @route   GET /api/career-roadmap/:id/progress/:userId
// @access  Private
export const getCareerRoadmapProgress = asyncHandler(async (req, res) => {
  try {
    const { id, userId } = req.params;
    
    // Get the roadmap
    const roadmap = await BasicCareerRoadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }
    
    // Mock progress data (in a real app, this would come from user's actual progress)
    const mockProgress = {
      roadmapId: id,
      userId: userId,
      roleName: roadmap.roleName,
      readinessScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      level: "intermediate",
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastActivity: new Date(),
      
      // Module progress
      moduleProgress: roadmap.requiredModules.map(module => ({
        name: module.name,
        description: module.description,
        completed: Math.random() > 0.5,
        completionPercentage: Math.floor(Math.random() * 100)
      })),
      
      // Lab progress
      labProgress: roadmap.requiredLabs.map(lab => ({
        name: lab.name,
        description: lab.description,
        completed: Math.random() > 0.6,
        completionPercentage: Math.floor(Math.random() * 100),
        lastAttempt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      })),
      
      // Skill progress
      skillProgress: roadmap.requiredSkills.map(skill => ({
        name: skill.name,
        description: skill.description,
        competencyLevel: Math.floor(Math.random() * 5) + 1, // 1-5 scale
        completed: Math.random() > 0.4
      })),
      
      // Overall stats
      stats: {
        totalModules: roadmap.requiredModules.length,
        completedModules: Math.floor(Math.random() * roadmap.requiredModules.length),
        totalLabs: roadmap.requiredLabs.length,
        completedLabs: Math.floor(Math.random() * roadmap.requiredLabs.length),
        totalSkills: roadmap.requiredSkills.length,
        masteredSkills: Math.floor(Math.random() * roadmap.requiredSkills.length),
        studyTime: Math.floor(Math.random() * 100) + 20, // hours
        quizAverage: Math.floor(Math.random() * 30) + 70 // percentage
      },
      
      // Recommendations
      recommendations: [
        "Focus on completing the remaining supervised learning modules",
        "Practice more with the K-Means clustering lab to improve your understanding",
        "Review Python fundamentals to strengthen your programming skills",
        "Consider taking the advanced deep learning modules next"
      ],
      
      // Next steps
      nextSteps: [
        "Complete the 'Linear Regression Lab' to strengthen regression concepts",
        "Study 'Data Preprocessing & Feature Engineering' module",
        "Practice with more classification problems",
        "Review mathematical foundations for better understanding"
      ]
    };
    
    res.json({
      success: true,
      progress: mockProgress
    });
  } catch (error) {
    console.error("Error fetching career roadmap progress:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching career roadmap progress",
      error: error.message
    });
  }
});

// @desc    Update user progress for a career roadmap
// @route   PUT /api/career-roadmap/:id/progress/:userId
// @access  Private
export const updateCareerRoadmapProgress = asyncHandler(async (req, res) => {
  try {
    const { id, userId } = req.params;
    const progressData = req.body;
    
    // In a real app, this would update the user's progress in the database
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: "Career roadmap progress updated successfully",
      progress: progressData
    });
  } catch (error) {
    console.error("Error updating career roadmap progress:", error);
    res.status(500).json({
      success: false,
      message: "Error updating career roadmap progress",
      error: error.message
    });
  }
});

// @desc    Create a new career roadmap (Admin only)
// @route   POST /api/career-roadmap
// @access  Private/Admin
export const createCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const roadmap = new BasicCareerRoadmap(req.body);
    await roadmap.save();
    
    res.status(201).json({
      success: true,
      message: "Career roadmap created successfully",
      roadmap: roadmap
    });
  } catch (error) {
    console.error("Error creating career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error creating career roadmap",
      error: error.message
    });
  }
});

// @desc    Update a career roadmap (Admin only)
// @route   PUT /api/career-roadmap/:id
// @access  Private/Admin
export const updateCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const roadmap = await BasicCareerRoadmap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }
    
    res.json({
      success: true,
      message: "Career roadmap updated successfully",
      roadmap: roadmap
    });
  } catch (error) {
    console.error("Error updating career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error updating career roadmap",
      error: error.message
    });
  }
});

// @desc    Delete a career roadmap (Admin only)
// @route   DELETE /api/career-roadmap/:id
// @access  Private/Admin
export const deleteCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const roadmap = await BasicCareerRoadmap.findByIdAndDelete(req.params.id);
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }
    
    res.json({
      success: true,
      message: "Career roadmap deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting career roadmap",
      error: error.message
    });
  }
});
