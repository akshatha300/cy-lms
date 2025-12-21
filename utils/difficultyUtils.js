// Difficulty utilities (placeholder)
// Can be replaced with real adaptive logic later

export const calculateDifficulty = (currentLevel, performanceScore = 0) => {
  if (!currentLevel) return "beginner";

  return currentLevel;
};

export const normalizeDifficulty = (level) => {
  return level || "beginner";
};
