import JobReadinessScore from "../models/JobReadinessScore.js";
import SkillProgress from "../models/SkillProgress.js";
import SecurityRole from "../models/SecurityRole.js";
import LabAttempt from "../models/LabAttempt.js";

/**
 * Calculate overall job readiness score for a user in a role
 * Formula:
 *   overallScore = (skillsCompletionAvg * 0.4) + (labSuccessRate * 0.35) + (assessmentAvg * 0.25)
 */
export const calculateJobReadiness = async (userId, roleId) => {
  try {
    const role = await SecurityRole.findById(roleId);
    if (!role) throw new Error("Role not found");

    // Get all skill progress for this role
    const skillProgresses = await SkillProgress.find({
      userId,
      roleId,
    }).populate("skillId");

    if (skillProgresses.length === 0) {
      // No skills tracked yet
      return {
        userId,
        roleId,
        skillsCompletionPercent: 0,
        labSuccessRate: 0,
        assessmentScore: 0,
        overallReadinessScore: 0,
        readinessLevel: "not-started",
        missingSkills: role.requiredSkills,
        estimatedWeeksToReady: Math.ceil(role.estimatedHoursToComplete / 40),
        trend: "stable",
        lastCalculatedAt: new Date(),
      };
    }

    // Component 1: Skills completion average
    const skillsCompletionPercent = Math.round(
      skillProgresses.reduce((sum, sp) => sum + sp.completionPercentage, 0) /
        skillProgresses.length
    );

    // Component 2: Lab success rate
    let totalLabsRequired = 0;
    let totalLabsPassed = 0;
    skillProgresses.forEach((sp) => {
      totalLabsRequired += sp.skillId?.requiredLabCount || 0;
      totalLabsPassed += sp.labsPassed;
    });
    const labSuccessRate = totalLabsRequired > 0
      ? Math.round((totalLabsPassed / totalLabsRequired) * 100)
      : 0;

    // Component 3: Assessment score average
    const assessmentScores = skillProgresses
      .map((sp) => sp.bestQuizScore)
      .filter((score) => score > 0);
    const assessmentScore = assessmentScores.length > 0
      ? Math.round(assessmentScores.reduce((a, b) => a + b, 0) / assessmentScores.length)
      : 0;

    // Overall weighted score
    const overallReadinessScore = Math.round(
      skillsCompletionPercent * 0.4 + labSuccessRate * 0.35 + assessmentScore * 0.25
    );

    // Determine readiness level
    const readinessLevel = getReadinessLevel(overallReadinessScore);

    // Identify missing skills
    const completedSkillIds = new Set(
      skillProgresses
        .filter((sp) => sp.status === "completed")
        .map((sp) => sp.skillId._id.toString())
    );
    const missingSkills = role.requiredSkills.filter(
      (skillId) => !completedSkillIds.has(skillId.toString())
    );

    // Estimate weeks to ready (based on completion pace)
    const estimatedWeeksToReady = estimateWeeksToCompletion(
      overallReadinessScore,
      skillProgresses
    );

    // Create or update score record
    const scoreRecord = await JobReadinessScore.findOneAndUpdate(
      { userId, roleId },
      {
        skillsCompletionPercent,
        labSuccessRate,
        assessmentScore,
        overallReadinessScore,
        readinessLevel,
        missingSkills,
        estimatedWeeksToReady,
        lastCalculatedAt: new Date(),
        $push: {
          scoreHistory: {
            date: new Date(),
            score: overallReadinessScore,
          },
        },
      },
      { new: true, upsert: true }
    );

    // Calculate trend
    const trend = calculateTrend(scoreRecord.scoreHistory);
    scoreRecord.trend = trend;
    await scoreRecord.save();

    return scoreRecord;
  } catch (error) {
    console.error("calculateJobReadiness error:", error);
    throw error;
  }
};

/**
 * Get the current job readiness score for a user-role pair
 */
export const getJobReadinessScore = async (userId, roleId) => {
  try {
    const score = await JobReadinessScore.findOne({
      userId,
      roleId,
    }).populate("missingSkills");

    if (!score) {
      // First time - calculate it
      return calculateJobReadiness(userId, roleId);
    }

    return score;
  } catch (error) {
    console.error("getJobReadinessScore error:", error);
    throw error;
  }
};

/**
 * Force recalculation of job readiness (e.g., after lab completion)
 */
export const updateJobReadinessScore = async (userId, roleId) => {
  try {
    return calculateJobReadiness(userId, roleId);
  } catch (error) {
    console.error("updateJobReadinessScore error:", error);
    throw error;
  }
};

/**
 * Get historical job readiness scores for a time period
 */
export const getReadinessTimeline = async (userId, roleId, days = 90) => {
  try {
    const scoreRecord = await JobReadinessScore.findOne({ userId, roleId });

    if (!scoreRecord) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const history = scoreRecord.scoreHistory.filter((entry) => entry.date >= cutoffDate);

    return history.map((entry) => ({
      date: entry.date,
      score: entry.score,
    }));
  } catch (error) {
    console.error("getReadinessTimeline error:", error);
    throw error;
  }
};

/**
 * Determine readiness level based on score
 */
function getReadinessLevel(score) {
  if (score < 15) return "not-started";
  if (score < 40) return "basic";
  if (score < 75) return "in-progress";
  if (score < 95) return "advanced";
  return "ready";
}

/**
 * Estimate weeks to completion based on current pace
 */
function estimateWeeksToCompletion(score, skillProgresses) {
  if (score >= 95) return 0; // Already ready

  // Average time per skill
  const avgHoursPerSkill = skillProgresses.length > 0
    ? skillProgresses.reduce((sum, sp) => sum + (sp.skillId?.estimatedHours || 8), 0) / skillProgresses.length
    : 8;

  const remainingScore = 100 - score;
  const estimatedHours = (remainingScore / 100) * avgHoursPerSkill * skillProgresses.length;

  // Assume 5 hours per week
  return Math.ceil(estimatedHours / 5);
}

/**
 * Calculate trend from historical scores
 */
function calculateTrend(scoreHistory) {
  if (scoreHistory.length < 2) return "stable";

  const recent = scoreHistory.slice(-5); // Last 5 data points
  if (recent.length < 2) return "stable";

  const oldAvg =
    recent.slice(0, Math.floor(recent.length / 2)).reduce((sum, entry) => sum + entry.score, 0) /
    Math.floor(recent.length / 2);
  const newAvg =
    recent.slice(Math.floor(recent.length / 2)).reduce((sum, entry) => sum + entry.score, 0) /
    Math.ceil(recent.length / 2);

  const difference = newAvg - oldAvg;

  if (difference > 2) return "improving";
  if (difference < -2) return "declining";
  return "stable";
}
