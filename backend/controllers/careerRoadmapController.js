import asyncHandler from "express-async-handler";
import CareerRoadmap from "../models/CareerRoadmap.js";
import CareerProgress from "../models/CareerProgress.js";
import Module from "../models/Module.js";
import Lab from "../models/Lab.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

/**
 * Get all available career roadmaps
 */
export const getCareerRoadmaps = asyncHandler(async (req, res) => {
  try {
    const roadmaps = await CareerRoadmap.find({ isActive: true })
      .select('roleName description estimatedDuration difficulty salaryRange icon color')
      .sort({ roleName: 1 });

    res.json({
      success: true,
      count: roadmaps.length,
      roadmaps
    });
  } catch (error) {
    logger.error("Error fetching career roadmaps:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career roadmaps"
    });
  }
});

/**
 * Get detailed roadmap by ID
 */
export const getRoadmapById = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const roadmap = await CareerRoadmap.findById(roleId)
      .populate('requiredModules.moduleId', 'title description order')
      .populate('requiredLabs.labId', 'name description difficulty')
      .populate('requiredSkills.skillId', 'name description');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }

    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    logger.error("Error fetching roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap"
    });
  }
});

/**
 * Get user's progress for a specific roadmap
 */
export const getRoadmapProgress = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.params;
    const userId = req.user._id;

    // Get roadmap details
    const roadmap = await CareerRoadmap.findById(roleId)
      .populate('requiredModules.moduleId')
      .populate('requiredLabs.labId')
      .populate('requiredSkills.skillId');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }

    // Get or create user progress
    let progress = await CareerProgress.findOne({ user: userId, roadmap: roleId })
      .populate('moduleProgress.moduleId')
      .populate('labProgress.labId')
      .populate('skillProgress.skillId');

    if (!progress) {
      progress = await initializeProgress(userId, roadmap);
    }

    // Calculate current progress metrics
    const metrics = calculateProgressMetrics(progress, roadmap);

    // Update progress with latest metrics
    await CareerProgress.findByIdAndUpdate(progress._id, {
      'overallMetrics': metrics,
      'readinessLevel': determineReadinessLevel(metrics.readinessScore),
      'lastAccessedAt': new Date()
    });

    res.json({
      success: true,
      roadmap: {
        id: roadmap._id,
        roleName: roadmap.roleName,
        description: roadmap.description,
        estimatedDuration: roadmap.estimatedDuration,
        difficulty: roadmap.difficulty,
        scoreWeights: roadmap.scoreWeights
      },
      progress: {
        ...progress.toObject(),
        overallMetrics: metrics,
        readinessLevel: determineReadinessLevel(metrics.readinessScore)
      },
      recommendations: generateRecommendations(progress, roadmap, metrics)
    });
  } catch (error) {
    logger.error("Error fetching roadmap progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap progress"
    });
  }
});

/**
 * Initialize user progress for a roadmap
 */
const initializeProgress = async (userId, roadmap) => {
  const progress = new CareerProgress({
    user: userId,
    roadmap: roadmap._id,
    moduleProgress: roadmap.requiredModules.map(module => ({
      moduleId: module.moduleId._id,
      moduleName: module.moduleId.title,
      completed: false,
      quizScore: 0,
      timeSpent: 0
    })),
    labProgress: roadmap.requiredLabs.map(lab => ({
      labId: lab.labId._id,
      labName: lab.labId.name,
      completed: false,
      accuracy: 0,
      attempts: 0,
      bestScore: 0,
      timeSpent: 0
    })),
    skillProgress: roadmap.requiredSkills.map(skill => ({
      skillId: skill.skillId._id,
      skillName: skill.skillId.name,
      competency: 0,
      lastUpdated: new Date()
    }))
  });

  return await progress.save();
};

/**
 * Calculate progress metrics
 */
const calculateProgressMetrics = (progress, roadmap) => {
  const weights = roadmap.scoreWeights;

  // Module completion percentage
  const completedModules = progress.moduleProgress.filter(m => m.completed).length;
  const moduleCompletion = (completedModules / progress.moduleProgress.length) * 100;

  // Lab completion percentage
  const completedLabs = progress.labProgress.filter(l => l.completed).length;
  const labCompletion = (completedLabs / progress.labProgress.length) * 100;

  // Quiz average score
  const quizScores = progress.moduleProgress
    .filter(m => m.quizScore > 0)
    .map(m => m.quizScore);
  const quizAverage = quizScores.length > 0 
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length 
    : 0;

  // Skill competency average
  const skillCompetencies = progress.skillProgress.map(s => s.competency);
  const skillCompetency = skillCompetencies.length > 0
    ? skillCompetencies.reduce((a, b) => a + b, 0) / skillCompetencies.length
    : 0;

  // Calculate readiness score
  const readinessScore = (
    (moduleCompletion * weights.moduleCompletion) +
    (labCompletion * weights.labCompletion) +
    (quizAverage * weights.quizAverage) +
    (skillCompetency * weights.skillCompetency)
  );

  return {
    moduleCompletion: Math.round(moduleCompletion),
    labCompletion: Math.round(labCompletion),
    quizAverage: Math.round(quizAverage),
    skillCompetency: Math.round(skillCompetency),
    readinessScore: Math.round(readinessScore)
  };
};

/**
 * Determine readiness level based on score
 */
const determineReadinessLevel = (readinessScore) => {
  if (readinessScore < 60) return "beginner";
  if (readinessScore < 80) return "intermediate";
  return "job-ready";
};

/**
 * Generate intelligent recommendations
 */
const generateRecommendations = (progress, roadmap, metrics) => {
  const recommendations = [];

  // Check module completion
  const incompleteModules = progress.moduleProgress.filter(m => !m.completed);
  if (incompleteModules.length > 0) {
    recommendations.push({
      type: "module",
      priority: "high",
      title: "Complete Required Modules",
      description: `You have ${incompleteModules.length} modules remaining. Start with "${incompleteModules[0].moduleName}".`,
      action: "start_module",
      targetId: incompleteModules[0].moduleId
    });
  }

  // Check quiz scores
  const lowQuizScores = progress.moduleProgress.filter(m => 
    m.quizScore > 0 && m.quizScore < roadmap.minQuizScore
  );
  if (lowQuizScores.length > 0) {
    recommendations.push({
      type: "quiz",
      priority: "medium",
      title: "Improve Quiz Scores",
      description: `Retake quizzes for ${lowQuizScores.length} modules to reach the ${roadmap.minQuizScore}% requirement.`,
      action: "retake_quiz",
      targetId: lowQuizScores[0].moduleId
    });
  }

  // Check lab accuracy
  const lowLabAccuracy = progress.labProgress.filter(l => 
    l.completed && l.accuracy < 70
  );
  if (lowLabAccuracy.length > 0) {
    recommendations.push({
      type: "lab",
      priority: "medium",
      title: "Improve Lab Performance",
      description: `Practice ${lowLabAccuracy.length} labs again to achieve better accuracy.`,
      action: "retry_lab",
      targetId: lowLabAccuracy[0].labId
    });
  }

  // Check skill competency
  const lowSkills = progress.skillProgress.filter(s => 
    s.competency < 75
  );
  if (lowSkills.length > 0) {
    recommendations.push({
      type: "skill",
      priority: "low",
      title: "Develop Skills",
      description: `Focus on improving ${lowSkills.length} key skills for this career path.`,
      action: "practice_skill",
      targetId: lowSkills[0].skillId
    });
  }

  // Readiness level specific recommendations
  if (metrics.readinessScore >= 80) {
    recommendations.push({
      type: "career",
      priority: "info",
      title: "🎉 Job Ready!",
      description: "Congratulations! You're ready to start applying for jobs. Consider preparing your resume and portfolio.",
      action: "career_prep"
    });
  } else if (metrics.readinessScore >= 60) {
    recommendations.push({
      type: "motivation",
      priority: "info",
      title: "Almost There!",
      description: `You're ${80 - metrics.readinessScore}% away from being job ready. Keep going!`,
      action: "continue_learning"
    });
  } else {
    recommendations.push({
      type: "foundation",
      priority: "high",
      title: "Focus on Fundamentals",
      description: "Start with the basic modules and labs to build a strong foundation.",
      action: "start_foundation"
    });
  }

  return recommendations;
};

/**
 * Create new career roadmap (Admin only)
 */
export const createCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const roadmapData = req.body;
    
    // Validate required modules, labs, and skills exist
    if (roadmapData.requiredModules) {
      for (const module of roadmapData.requiredModules) {
        const moduleExists = await Module.findById(module.moduleId);
        if (!moduleExists) {
          return res.status(400).json({
            success: false,
            message: `Module ${module.moduleId} not found`
          });
        }
      }
    }

    if (roadmapData.requiredLabs) {
      for (const lab of roadmapData.requiredLabs) {
        const labExists = await Lab.findById(lab.labId);
        if (!labExists) {
          return res.status(400).json({
            success: false,
            message: `Lab ${lab.labId} not found`
          });
        }
      }
    }

    if (roadmapData.requiredSkills) {
      for (const skill of roadmapData.requiredSkills) {
        const skillExists = await Skill.findById(skill.skillId);
        if (!skillExists) {
          return res.status(400).json({
            success: false,
            message: `Skill ${skill.skillId} not found`
          });
        }
      }
    }

    const roadmap = new CareerRoadmap(roadmapData);
    await roadmap.save();

    res.status(201).json({
      success: true,
      message: "Career roadmap created successfully",
      roadmap
    });
  } catch (error) {
    logger.error("Error creating career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create career roadmap"
    });
  }
});

/**
 * Update career roadmap (Admin only)
 */
export const updateCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.params;
    const updateData = req.body;

    const roadmap = await CareerRoadmap.findByIdAndUpdate(
      roleId,
      updateData,
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
      roadmap
    });
  } catch (error) {
    logger.error("Error updating career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update career roadmap"
    });
  }
});

/**
 * Delete career roadmap (Admin only)
 */
export const deleteCareerRoadmap = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.params;

    const roadmap = await CareerRoadmap.findByIdAndDelete(roleId);
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found"
      });
    }

    // Also delete related progress records
    await CareerProgress.deleteMany({ roadmap: roleId });

    res.json({
      success: true,
      message: "Career roadmap deleted successfully"
    });
  } catch (error) {
    logger.error("Error deleting career roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete career roadmap"
    });
  }
});

/**
 * Update user progress (called when user completes modules/labs)
 */
export const updateProgress = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.params;
    const { type, itemId, score, accuracy, timeSpent } = req.body;
    const userId = req.user._id;

    let progress = await CareerProgress.findOne({ user: userId, roadmap: roleId });
    
    if (!progress) {
      const roadmap = await CareerRoadmap.findById(roleId);
      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Career roadmap not found"
        });
      }
      progress = await initializeProgress(userId, roadmap);
    }

    // Update appropriate progress based on type
    if (type === "module") {
      const moduleProgress = progress.moduleProgress.find(m => 
        m.moduleId.toString() === itemId
      );
      if (moduleProgress) {
        moduleProgress.completed = true;
        moduleProgress.completedAt = new Date();
        moduleProgress.quizScore = score || 0;
        moduleProgress.timeSpent = (moduleProgress.timeSpent || 0) + (timeSpent || 0);
        
        // Add milestone
        progress.milestones.push({
          type: "module_completed",
          description: `Completed module: ${moduleProgress.moduleName}`,
          achievedAt: new Date(),
          score: score || 0
        });
      }
    } else if (type === "lab") {
      const labProgress = progress.labProgress.find(l => 
        l.labId.toString() === itemId
      );
      if (labProgress) {
        labProgress.completed = true;
        labProgress.completedAt = new Date();
        labProgress.accuracy = accuracy || 0;
        labProgress.attempts += 1;
        labProgress.bestScore = Math.max(labProgress.bestScore, score || 0);
        labProgress.timeSpent = (labProgress.timeSpent || 0) + (timeSpent || 0);
        
        // Add milestone
        progress.milestones.push({
          type: "lab_completed",
          description: `Completed lab: ${labProgress.labName}`,
          achievedAt: new Date(),
          score: score || 0
        });
      }
    } else if (type === "skill") {
      const skillProgress = progress.skillProgress.find(s => 
        s.skillId.toString() === itemId
      );
      if (skillProgress) {
        skillProgress.competency = Math.min(100, (skillProgress.competency || 0) + (score || 5));
        skillProgress.lastUpdated = new Date();
        
        // Add milestone if competency reaches threshold
        if (skillProgress.competency >= 75) {
          progress.milestones.push({
            type: "skill_mastered",
            description: `Mastered skill: ${skillProgress.skillName}`,
            achievedAt: new Date(),
            score: skillProgress.competency
          });
        }
      }
    }

    await progress.save();

    res.json({
      success: true,
      message: "Progress updated successfully",
      progress
    });
  } catch (error) {
    logger.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress"
    });
  }
});
