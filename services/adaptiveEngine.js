// Simple numeric difficulty adapter for the LMS
// Difficulty scale: 1 (easiest) ... 5 (hardest)

export const calculateNewDifficulty = (currentDifficulty = 1, isCorrect) => {
  const minLevel = 1;
  const maxLevel = 5;

  let next = currentDifficulty;

  if (isCorrect) {
    // correct → gently increase difficulty
    next = Math.min(maxLevel, currentDifficulty + 1);
  } else {
    // incorrect → gently decrease difficulty
    next = Math.max(minLevel, currentDifficulty - 1);
  }

  return next;
};

// Given a Progress document (or null), decide the next difficulty level
export const getNextDifficulty = (progress) => {
  if (!progress) return 1;
  return progress.currentDifficulty || 1;
};
