/**
 * Leaderboard Calculations & Utilities
 * Ranking, scoring, trend analysis for gym members
 */

// Metric definitions
export const LEADERBOARD_METRICS = {
  CHECK_INS: 'check-ins',
  CLASSES_ATTENDED: 'classes-attended',
  CHALLENGES_COMPLETED: 'challenges-completed',
  POINTS: 'points',
  WORKOUTS: 'workouts',
  CONSISTENCY: 'consistency'
};

// Time ranges for leaderboard
export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  ALL_TIME: 'all-time'
};

/**
 * Calculate member score based on activities
 */
export const calculateMemberScore = (memberData) => {
  const {
    checkIns = 0,
    classesAttended = 0,
    challengesCompleted = 0,
    basePoints = 0
  } = memberData;

  // Weighted scoring system
  const checkInScore = checkIns * 5;           // 5 points per check-in
  const classScore = classesAttended * 10;     // 10 points per class
  const challengeScore = challengesCompleted * 25; // 25 points per challenge
  const totalPoints = basePoints;

  return {
    checkInScore,
    classScore,
    challengeScore,
    totalPoints,
    totalScore: checkInScore + classScore + challengeScore + totalPoints
  };
};

/**
 * Generate leaderboard rankings for given metric and time range
 */
export const generateLeaderboard = (members, metric = LEADERBOARD_METRICS.POINTS, timeRange = TIME_RANGES.MONTH) => {
  // Clone and sort members
  const sorted = [...members]
    .map((member, index) => {
      const value = member[metric] || calculateMemberScore(member).totalScore || 0;
      return {
        ...member,
        value,
        rank: 0,
        change: calculateTrend(member.previousValue, value)
      };
    })
    .sort((a, b) => b.value - a.value)
    .map((member, index) => ({
      ...member,
      rank: index + 1
    }));

  return sorted;
};

/**
 * Calculate trend (up/down/neutral) compared to previous period
 */
export const calculateTrend = (previous, current) => {
  if (!previous || previous === 0) return { direction: 'neutral', percentage: 0 };

  const diff = current - previous;
  const percentage = Math.round((diff / previous) * 100);

  if (diff > 0) return { direction: 'up', percentage };
  if (diff < 0) return { direction: 'down', percentage: Math.abs(percentage) };
  return { direction: 'neutral', percentage: 0 };
};

/**
 * Get rank medal/badge based on position
 */
export const getRankBadge = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (rank <= 10) return '⭐';
  return '';
};

/**
 * Get rank color based on position
 */
export const getRankColor = (rank) => {
  if (rank === 1) return 'text-yellow-400'; // Gold
  if (rank === 2) return 'text-gray-400';   // Silver
  if (rank === 3) return 'text-orange-600'; // Bronze
  if (rank <= 10) return 'text-blue-400';   // Top 10
  return 'text-gray-500';                   // Rest
};

/**
 * Get metric label and unit
 */
export const getMetricInfo = (metric) => {
  const metrics = {
    'points': { label: 'Points', unit: 'pts', icon: '⭐' },
    'check-ins': { label: 'Check-ins', unit: 'visits', icon: '📍' },
    'classes-attended': { label: 'Classes', unit: 'attended', icon: '💪' },
    'challenges-completed': { label: 'Challenges', unit: 'won', icon: '🏆' },
    'workouts': { label: 'Workouts', unit: 'logged', icon: '🏋️' },
    'consistency': { label: 'Consistency', unit: 'days', icon: '🔥' }
  };

  return metrics[metric] || metrics['points'];
};

/**
 * Filter leaderboard by name or username
 */
export const filterLeaderboard = (leaderboard, searchQuery) => {
  if (!searchQuery.trim()) return leaderboard;

  const query = searchQuery.toLowerCase();
  return leaderboard.filter(member =>
    member.name?.toLowerCase().includes(query) ||
    member.username?.toLowerCase().includes(query) ||
    member.email?.toLowerCase().includes(query)
  );
};

/**
 * Group members by tier (top 10%, top 25%, etc)
 */
export const groupMembersByTier = (leaderboard) => {
  const total = leaderboard.length;
  const top10Percent = Math.ceil(total * 0.1);
  const top25Percent = Math.ceil(total * 0.25);
  const top50Percent = Math.ceil(total * 0.5);

  return {
    elite: leaderboard.slice(0, top10Percent),
    advanced: leaderboard.slice(top10Percent, top25Percent),
    intermediate: leaderboard.slice(top25Percent, top50Percent),
    beginner: leaderboard.slice(top50Percent)
  };
};

/**
 * Calculate achievement level based on rank and score
 */
export const getAchievementLevel = (rank, totalMembers, score) => {
  const percentile = (rank / totalMembers) * 100;

  if (percentile <= 1) return { level: 'legend', icon: '👑', color: 'text-purple-400' };
  if (percentile <= 5) return { level: 'elite', icon: '🥇', color: 'text-yellow-400' };
  if (percentile <= 10) return { level: 'advanced', icon: '⭐', color: 'text-blue-400' };
  if (percentile <= 25) return { level: 'intermediate', icon: '📈', color: 'text-green-400' };
  return { level: 'beginner', icon: '🚀', color: 'text-gray-400' };
};

/**
 * Get leaderboard statistics
 */
export const getLeaderboardStats = (leaderboard, metric) => {
  if (leaderboard.length === 0) {
    return { average: 0, median: 0, highest: 0, lowest: 0 };
  }

  const values = leaderboard.map(m => m.value || 0);
  const sorted = [...values].sort((a, b) => a - b);

  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const highest = Math.max(...values);
  const lowest = Math.min(...values);

  return {
    average: Math.round(average),
    median: Math.round(median),
    highest,
    lowest,
    count: leaderboard.length
  };
};

/**
 * Calculate member's position relative to friends
 */
export const getRelativeRank = (memberId, leaderboard, friendIds) => {
  const memberRank = leaderboard.find(m => m.id === memberId)?.rank || 0;
  const friendRanks = leaderboard
    .filter(m => friendIds.includes(m.id))
    .map(m => ({ id: m.id, rank: m.rank, name: m.name }))
    .sort((a, b) => a.rank - b.rank);

  const betterFriends = friendRanks.filter(f => f.rank < memberRank);
  const worseFriends = friendRanks.filter(f => f.rank > memberRank);

  return {
    memberRank,
    friendCount: friendRanks.length,
    betterFriendsCount: betterFriends.length,
    worseFriendsCount: worseFriends.length,
    betterFriends,
    worseFriends
  };
};

/**
 * Get top members for featured display
 */
export const getTopMembers = (leaderboard, count = 3) => {
  return leaderboard.slice(0, count);
};

/**
 * Calculate streak (consecutive days with activity)
 */
export const calculateStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  const sortedDates = activities
    .map(a => new Date(a.date))
    .sort((a, b) => b - a)
    .map(d => d.toISOString().split('T')[0]);

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const activityDate = new Date(dateStr);
    const expectedDate = new Date(currentDate);

    if (activityDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (activityDate < expectedDate) {
      break;
    }
  }

  return streak;
};
