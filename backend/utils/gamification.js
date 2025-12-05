// Calculate level from total XP
const calculateLevel = (totalXP) => {
  let level = 1;
  let xpRequired = 100;
  let xpForLevel = 0;

  while (totalXP >= xpForLevel + xpRequired) {
    xpForLevel += xpRequired;
    level++;
    xpRequired = Math.floor(xpRequired * 1.5); // 50% increase per level
  }

  return {
    level,
    xpInLevel: totalXP - xpForLevel,
    xpForNextLevel: xpRequired,
    progress: (totalXP - xpForLevel) / xpRequired
  };
};

// Calculate XP for answering a question
const calculateXP = (question, isCorrect, timeTaken, streak) => {
  let baseXP = question.xp_reward || 10;

  // Bonus for correct answer
  if (isCorrect) {
    baseXP *= 1.5;
  }

  // Speed bonus (faster = more XP)
  const speedMultiplier = Math.max(0.5, 1 - (timeTaken / 30000)); // 30s max
  baseXP *= speedMultiplier;

  // Streak bonus
  const streakBonus = Math.min(streak * 0.1, 0.5); // Max 50% bonus
  baseXP *= (1 + streakBonus);

  return Math.round(baseXP);
};

// Calculate next review date for spaced repetition (SM-2 algorithm)
const calculateNextReview = (masteryLevel) => {
  const now = new Date();
  const days = [1, 3, 7, 14, 30, 30]; // Days until next review based on mastery level
  
  const daysToAdd = masteryLevel < days.length ? days[masteryLevel] : 30;
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + daysToAdd);
  
  return nextReview;
};

// Update mastery level based on answer
const updateMasteryLevel = (currentMastery, isCorrect) => {
  if (isCorrect) {
    return Math.min(currentMastery + 1, 5); // Max mastery level is 5
  } else {
    return Math.max(currentMastery - 1, 0); // Min mastery level is 0
  }
};

module.exports = {
  calculateLevel,
  calculateXP,
  calculateNextReview,
  updateMasteryLevel
};
