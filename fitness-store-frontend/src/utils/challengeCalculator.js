/**
 * Challenge Calculator Utilities
 * Functions for challenge progress, leaderboards, and reward calculations
 */

// Challenge types and their requirements
export const CHALLENGE_TYPES = {
  TONNAGE: 'tonnage',
  REPS: 'reps',
  SESSIONS: 'sessions',
  DISTANCE: 'distance',
  DURATION: 'duration',
  WEIGHT_LOSS: 'weight_loss',
  STRENGTH: 'strength',
  STREAK: 'streak'
};

// Challenge difficulty levels and rewards
export const CHALLENGE_DIFFICULTY = {
  EASY: { level: 'easy', multiplier: 1, points: 10, badge: '🥉 Bronze' },
  MEDIUM: { level: 'medium', multiplier: 1.5, points: 25, badge: '🥈 Silver' },
  HARD: { level: 'hard', multiplier: 2, points: 50, badge: '🥇 Gold' },
  ELITE: { level: 'elite', multiplier: 3, points: 100, badge: '💎 Diamond' }
};

// Calculate challenge progress percentage
export const calculateChallengeProgress = (currentValue, targetValue) => {
  if (targetValue === 0) return 0;
  const percentage = Math.min((currentValue / targetValue) * 100, 100);
  return Math.round(percentage);
};

// Check if challenge is completed
export const isChallengeCompleted = (currentValue, targetValue) => {
  return currentValue >= targetValue;
};

// Generate leaderboard from participants
export const generateLeaderboard = (participants, metric = 'progress') => {
  const leaderboard = participants
    .map((p, index) => ({
      rank: index + 1,
      ...p,
      progress: calculateChallengeProgress(p.currentValue, p.targetValue)
    }))
    .sort((a, b) => b.progress - a.progress)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  return leaderboard;
};

// Calculate remaining time for challenge
export const getChallengeTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;

  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, isExpired: true };

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days: diffDays, hours: diffHours, minutes: diffMinutes, isExpired: false };
};

// Calculate reward points for challenge completion
export const calculateRewardPoints = (challenge, completionTime) => {
  const difficultyMultiplier = CHALLENGE_DIFFICULTY[challenge.difficulty]?.multiplier || 1;
  const basePoints = CHALLENGE_DIFFICULTY[challenge.difficulty]?.points || 10;

  // Bonus points for early completion
  let earlyBonusMultiplier = 1;
  if (completionTime) {
    const totalDays = (new Date(challenge.endDate) - new Date(challenge.startDate)) / (1000 * 60 * 60 * 24);
    const daysUsed = (completionTime - new Date(challenge.startDate)) / (1000 * 60 * 60 * 24);
    const timeRemaining = ((totalDays - daysUsed) / totalDays) * 100;

    if (timeRemaining > 50) earlyBonusMultiplier = 1.5; // 50% time remaining = 1.5x
    if (timeRemaining > 75) earlyBonusMultiplier = 2; // 75% time remaining = 2x
  }

  return Math.round(basePoints * difficultyMultiplier * earlyBonusMultiplier);
};

// Get challenge medal/badge
export const getChallengeBadge = (difficulty) => {
  return CHALLENGE_DIFFICULTY[difficulty]?.badge || '🏆';
};

// Calculate personal best in challenge
export const calculatePersonalBest = (userHistory) => {
  if (userHistory.length === 0) return null;

  return userHistory.reduce((best, entry) => {
    const entryValue = entry.currentValue;
    return entryValue > best.value ? { value: entryValue, date: entry.date } : best;
  }, { value: 0, date: null });
};

// Get matching challenges for user profile
export const getRecommendedChallenges = (userProfile, allChallenges) => {
  const recommendations = allChallenges
    .map(challenge => ({
      ...challenge,
      match: calculateChallengeMatch(userProfile, challenge)
    }))
    .filter(c => c.match > 0.3)
    .sort((a, b) => b.match - a.match);

  return recommendations;
};

// Calculate challenge difficulty match with user profile
export const calculateChallengeMatch = (userProfile, challenge) => {
  let matchScore = 0;

  // Match by muscle group/exercise type
  if (userProfile.favoriteExercises && challenge.muscleGroup) {
    const matchedExercises = challenge.muscleGroup.filter(mg =>
      userProfile.favoriteExercises.includes(mg)
    );
    matchScore += (matchedExercises.length / challenge.muscleGroup.length) * 50;
  }

  // Match by difficulty level
  if (userProfile.fitnessLevel === challenge.difficulty) {
    matchScore += 30;
  } else if (
    (userProfile.fitnessLevel === 'advanced' && challenge.difficulty === 'hard') ||
    (userProfile.fitnessLevel === 'intermediate' && challenge.difficulty === 'medium')
  ) {
    matchScore += 15;
  }

  // Match by challenge type preference
  if (userProfile.preferredChallengeType === challenge.type) {
    matchScore += 20;
  }

  return Math.min(matchScore, 100) / 100; // normalize to 0-1
};

// Format reward display
export const formatReward = (points, badge) => {
  return {
    display: `${badge} +${points}pts`,
    points,
    badge
  };
};

// Generate challenge suggestions for next challenge
export const suggestNextChallenge = (completedChallenges, userStats) => {
  if (completedChallenges.length === 0) {
    return { suggestion: 'Start with an easy challenge to build momentum', difficulty: 'easy' };
  }

  const lastChallenge = completedChallenges[completedChallenges.length - 1];
  const completedCount = completedChallenges.length;

  // Suggest progressive difficulty
  const difficultyProgression = {
    easy: completedCount >= 3 ? 'medium' : 'easy',
    medium: completedCount >= 6 ? 'hard' : 'medium',
    hard: completedCount >= 9 ? 'elite' : 'hard',
    elite: 'elite'
  };

  const nextDifficulty = difficultyProgression[lastChallenge.difficulty];

  return {
    suggestion: `You've completed ${completedCount} challenges! Try a ${nextDifficulty} challenge next.`,
    difficulty: nextDifficulty
  };
};

// Calculate cumulative leaderboard across multiple challenges
export const generateSeasonLeaderboard = (challenges) => {
  const participantPoints = {};

  challenges.forEach(challenge => {
    challenge.participants?.forEach(participant => {
      if (!participantPoints[participant.userId]) {
        participantPoints[participant.userId] = {
          userId: participant.userId,
          username: participant.username,
          totalPoints: 0,
          completedChallenges: 0,
          totalChallengesEntered: 0
        };
      }

      participantPoints[participant.userId].totalChallengesEntered++;

      if (isChallengeCompleted(participant.currentValue, participant.targetValue)) {
        const points = calculateRewardPoints(challenge, new Date());
        participantPoints[participant.userId].totalPoints += points;
        participantPoints[participant.userId].completedChallenges++;
      }
    });
  });

  const leaderboard = Object.values(participantPoints)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((p, index) => ({ rank: index + 1, ...p }));

  return leaderboard;
};

// Get challenge streak (consecutive completed challenges)
export const calculateChallengeStreak = (completedChallenges) => {
  if (completedChallenges.length === 0) return 0;

  const sortedByDate = completedChallenges
    .map(c => new Date(c.completedDate))
    .sort((a, b) => a - b);

  let streak = 1;
  for (let i = 1; i < sortedByDate.length; i++) {
    const dayDifference = (sortedByDate[i] - sortedByDate[i - 1]) / (1000 * 60 * 60 * 24);
    if (dayDifference <= 30) {
      // within 30 days
      streak++;
    } else {
      break; // streak broken
    }
  }

  return streak;
};

// Check for achievement badges
export const checkAchievements = (userStats) => {
  const achievements = [];

  if (userStats.workoutStreak >= 7) achievements.push({ id: 'week-warrior', title: 'Week Warrior' });
  if (userStats.workoutStreak >= 30) achievements.push({ id: 'month-master', title: 'Month Master' });
  if (userStats.completedChallenges >= 5) achievements.push({ id: 'challenge-chaser', title: 'Challenge Chaser' });
  if (userStats.totalPoints >= 500) achievements.push({ id: 'point-collector', title: 'Point Collector' });
  if (userStats.personalRecords >= 10) achievements.push({ id: 'pr-king', title: 'PR King' });

  return achievements;
};
