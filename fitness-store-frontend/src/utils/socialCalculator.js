/**
 * Social Features Utilities
 * Kudos system, follow/unfollow, member profiles, relationships
 */

/**
 * Kudos types and their details
 */
export const KUDOS_TYPES = {
  FIRST_PRE: 'first_pr',
  WEIGHT_LOSS: 'weight_loss',
  STREAK: 'streak',
  CHALLENGE_WIN: 'challenge_win',
  HELPFUL_POST: 'helpful_post',
  MOTIVATION: 'motivation',
  GYM_BUDDY: 'gym_buddy',
  CONSISTENCY: 'consistency',
  PERSONAL_BEST: 'personal_best',
  COMEBACK: 'comeback'
};

export const KUDOS_INFO = {
  first_pr: {
    emoji: '🏅',
    label: 'First PR',
    description: 'Hit a new personal record',
    icon: 'Trophy',
    color: 'text-yellow-400'
  },
  weight_loss: {
    emoji: '⬇️',
    label: 'Weight Loss Win',
    description: 'Reached weight loss goal',
    icon: 'TrendingDown',
    color: 'text-green-400'
  },
  streak: {
    emoji: '🔥',
    label: 'On Fire',
    description: 'Amazing workout streak',
    icon: 'Flame',
    color: 'text-orange-400'
  },
  challenge_win: {
    emoji: '🎯',
    label: 'Challenge Champion',
    description: 'Won a gym challenge',
    icon: 'Target',
    color: 'text-purple-400'
  },
  helpful_post: {
    emoji: '💡',
    label: 'Helpful',
    description: 'Posted helpful advice',
    icon: 'Lightbulb',
    color: 'text-blue-400'
  },
  motivation: {
    emoji: '⭐',
    label: 'Motivator',
    description: 'Inspiring others daily',
    icon: 'Star',
    color: 'text-pink-400'
  },
  gym_buddy: {
    emoji: '👯',
    label: 'Gym Buddy',
    description: 'Great workout partner',
    icon: 'Users',
    color: 'text-teal-400'
  },
  consistency: {
    emoji: '📅',
    label: 'Consistent',
    description: '100-day streak',
    icon: 'Calendar',
    color: 'text-indigo-400'
  },
  personal_best: {
    emoji: '🚀',
    label: 'Personal Best',
    description: 'Achieved major milestone',
    icon: 'Zap',
    color: 'text-red-400'
  },
  comeback: {
    emoji: '💪',
    label: 'Comeback King',
    description: 'Returned after break',
    icon: 'Heart',
    color: 'text-rose-400'
  }
};

/**
 * Send a kudos to another member
 */
export const sendKudos = (senderId, recipientId, kudosType, message = '') => {
  if (!KUDOS_TYPES[kudosType]) {
    throw new Error(`Invalid kudos type: ${kudosType}`);
  }

  if (senderId === recipientId) {
    throw new Error('Cannot send kudos to yourself');
  }

  return {
    id: `kudos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderId,
    recipientId,
    type: kudosType,
    message,
    sentAt: new Date(),
    read: false
  };
};

/**
 * Get kudos for a member
 */
export const getMemberKudos = (memberId, allKudos) => {
  return allKudos.filter(kudos => kudos.recipientId === memberId);
};

/**
 * Get member kudos count by type
 */
export const getKudosBreakdown = (memberId, allKudos) => {
  const memberKudos = getMemberKudos(memberId, allKudos);
  const breakdown = {};

  memberKudos.forEach(kudos => {
    breakdown[kudos.type] = (breakdown[kudos.type] || 0) + 1;
  });

  return breakdown;
};

/**
 * Get total kudos count for a member
 */
export const getTotalKudos = (memberId, allKudos) => {
  return getMemberKudos(memberId, allKudos).length;
};

/**
 * Follow a member
 */
export const followMember = (userId, memberId, userFollowing = []) => {
  if (userId === memberId) {
    throw new Error('Cannot follow yourself');
  }

  // Check if already following
  if (userFollowing.includes(memberId)) {
    return userFollowing;
  }

  return [...userFollowing, memberId];
};

/**
 * Unfollow a member
 */
export const unfollowMember = (memberId, userFollowing = []) => {
  return userFollowing.filter(id => id !== memberId);
};

/**
 * Check if user is following another member
 */
export const isFollowing = (memberId, userFollowing = []) => {
  return userFollowing.includes(memberId);
};

/**
 * Get mutual follows (follow each other)
 */
export const getMutualFollows = (userId, userFollowing = [], graph = {}) => {
  return userFollowing.filter(followId => {
    const theirFollowing = graph[followId] || [];
    return theirFollowing.includes(userId);
  });
};

/**
 * Get suggested members to follow
 */
export const getSuggestedMembers = (userId, allMembers, userFollowing = [], graph = {}) => {
  // Exclude self and already following
  const notFollowing = allMembers.filter(
    member => member.id !== userId && !userFollowing.includes(member.id)
  );

  // Score by mutual follows and activity
  const scored = notFollowing.map(member => {
    let score = 0;

    // Mutual connection bonus
    const mutuals = getMutualFollows(userId, userFollowing, graph);
    if (mutuals.includes(member.id)) score += 10;

    // Similar interest tags
    const myTags = allMembers.find(m => m.id === userId)?.interests || [];
    const theirTags = member.interests || [];
    const commonTags = myTags.filter(tag => theirTags.includes(tag));
    score += commonTags.length * 3;

    // Active members priority
    if (member.lastActivityAt) {
      const daysSinceActive = (Date.now() - new Date(member.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActive < 7) score += 5;
      if (daysSinceActive < 1) score += 10;
    }

    // Follower count (popular = good suggestion)
    score += (member.followersCount || 0) * 0.1;

    return { ...member, suggestionScore: score };
  });

  return scored
    .filter(member => member.suggestionScore > 0)
    .sort((a, b) => b.suggestionScore - a.suggestionScore)
    .slice(0, 5)
    .map(({ suggestionScore, ...member }) => member);
};

/**
 * Get member profile stats
 */
export const getMemberProfileStats = (member, allKudos, allPosts) => {
  const kudos = getMemberKudos(member.id, allKudos);
  const posts = allPosts.filter(post => post.authorId === member.id);

  const postEngagement = posts.reduce((sum, post) => {
    return sum + (post.likes || 0) + (post.comments?.length || 0);
  }, 0);

  return {
    kudosReceived: kudos.length,
    kudosGiven: 0, // Would need full data
    postsCreated: posts.length,
    postEngagement,
    followersCount: member.followersCount || 0,
    followingCount: member.followingCount || 0,
    joinDate: member.joinDate,
    lastActivityAt: member.lastActivityAt,
    memberLevel: calculateMemberLevel(member, allKudos, allPosts)
  };
};

/**
 * Calculate member level based on engagement
 */
export const calculateMemberLevel = (member, allKudos, allPosts) => {
  const kudos = getMemberKudos(member.id, allKudos);
  const posts = allPosts.filter(post => post.authorId === member.id);

  let exp = 0;
  exp += kudos.length * 10;
  exp += posts.length * 5;
  exp += (member.followersCount || 0) * 2;

  const workoutDays = member.workoutDays || 0;
  exp += workoutDays * 1;

  // Level brackets
  if (exp >= 1000) return { level: 'Elite', exp, nextLevelExp: 1500, expToNext: Math.max(0, 1500 - exp) };
  if (exp >= 500) return { level: 'Legend', exp, nextLevelExp: 1000, expToNext: Math.max(0, 1000 - exp) };
  if (exp >= 250) return { level: 'Advanced', exp, nextLevelExp: 500, expToNext: Math.max(0, 500 - exp) };
  if (exp >= 100) return { level: 'Intermediate', exp, nextLevelExp: 250, expToNext: Math.max(0, 250 - exp) };
  if (exp >= 25) return { level: 'Active', exp, nextLevelExp: 100, expToNext: Math.max(0, 100 - exp) };
  return { level: 'Beginner', exp, nextLevelExp: 25, expToNext: Math.max(0, 25 - exp) };
};

/**
 * Get community highlights (featured members)
 */
export const getCommunityHighlights = (allMembers, allKudos, allPosts) => {
  const featured = allMembers
    .map(member => {
      const kudos = getMemberKudos(member.id, allKudos).length;
      const posts = allPosts.filter(post => post.authorId === member.id).length;
      const followers = member.followersCount || 0;
      const engagement = kudos * 10 + posts * 5 + followers * 2;

      return { ...member, engagement };
    })
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 6);

  return {
    topEngaged: featured,
    hottest: featured.slice(0, 3),
    rising: featured.slice(3, 6)
  };
};

/**
 * Send direct message
 */
export const sendMessage = (senderId, recipientId, content) => {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderId,
    recipientId,
    content,
    sentAt: new Date(),
    read: false
  };
};

/**
 * Get conversation history
 */
export const getConversation = (userId, otherUserId, messages = []) => {
  return messages.filter(
    msg =>
      (msg.senderId === userId && msg.recipientId === otherUserId) ||
      (msg.senderId === otherUserId && msg.recipientId === userId)
  )
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = (userId, otherUserId, messages = []) => {
  return messages.map(msg =>
    msg.recipientId === userId && msg.senderId === otherUserId
      ? { ...msg, read: true }
      : msg
  );
};

/**
 * Get unread message count
 */
export const getUnreadCount = (userId, messages = []) => {
  return messages.filter(msg => msg.recipientId === userId && !msg.read).length;
};

/**
 * Block/unblock member
 */
export const blockMember = (userId, blockedUserId, blockedList = []) => {
  if (!blockedList.includes(blockedUserId)) {
    return [...blockedList, blockedUserId];
  }
  return blockedList;
};

export const unblockMember = (blockedUserId, blockedList = []) => {
  return blockedList.filter(id => id !== blockedUserId);
};

export const isBlocked = (userId, blockedList = []) => {
  return blockedList.includes(userId);
};
