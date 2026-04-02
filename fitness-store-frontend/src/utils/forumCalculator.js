/**
 * Forum & Discussion Utilities
 * Post management, comments, engagement metrics
 */

// Forum categories
export const FORUM_CATEGORIES = {
  NUTRITION: 'nutrition',
  WORKOUTS: 'workouts',
  PROGRESS: 'progress',
  GENERAL: 'general',
  ANNOUNCEMENTS: 'announcements',
  TIPS_TRICKS: 'tips-tricks'
};

// Category info (labels, colors, icons)
export const CATEGORY_INFO = {
  nutrition: {
    label: 'Nutrition',
    icon: '🥗',
    color: 'bg-green-500/20 text-green-400',
    borderColor: 'border-green-500/30'
  },
  workouts: {
    label: 'Workouts',
    icon: '💪',
    color: 'bg-blue-500/20 text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  progress: {
    label: 'Progress',
    icon: '📈',
    color: 'bg-purple-500/20 text-purple-400',
    borderColor: 'border-purple-500/30'
  },
  general: {
    label: 'General',
    icon: '💬',
    color: 'bg-gray-500/20 text-gray-400',
    borderColor: 'border-gray-500/30'
  },
  announcements: {
    label: 'Announcements',
    icon: '📢',
    color: 'bg-orange-500/20 text-orange-400',
    borderColor: 'border-orange-500/30'
  },
  'tips-tricks': {
    label: 'Tips & Tricks',
    icon: '💡',
    color: 'bg-yellow-500/20 text-yellow-400',
    borderColor: 'border-yellow-500/30'
  }
};

/**
 * Calculate engagement score for a post
 */
export const calculatePostEngagement = (post) => {
  const likes = post.likes || 0;
  const comments = post.comments?.length || 0;
  const views = post.views || 0;
  const shares = post.shares || 0;

  // Weighted engagement score
  const engagementScore = (likes * 1) + (comments * 3) + (views * 0.1) + (shares * 5);

  return {
    score: Math.round(engagementScore),
    likes,
    comments,
    views,
    shares
  };
};

/**
 * Sort posts by different criteria
 */
export const sortPosts = (posts, sortBy = 'recent') => {
  const sorted = [...posts];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case 'popular':
      return sorted.sort((a, b) => {
        const scoreB = calculatePostEngagement(b).score;
        const scoreA = calculatePostEngagement(a).score;
        return scoreB - scoreA;
      });

    case 'most-commented':
      return sorted.sort((a, b) => {
        const commentsB = b.comments?.length || 0;
        const commentsA = a.comments?.length || 0;
        return commentsB - commentsA;
      });

    case 'most-liked':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    case 'trending':
      return sorted
        .map(post => ({
          ...post,
          trend: calculateTrendingScore(post)
        }))
        .sort((a, b) => b.trend - a.trend)
        .map(({ trend, ...post }) => post);

    default:
      return sorted;
  }
};

/**
 * Calculate trending score (recent engagement boost)
 */
export const calculateTrendingScore = (post) => {
  const engagementScore = calculatePostEngagement(post).score;
  const hoursOld = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

  // Recent posts get boosted, older posts decay
  const recencyBoost = Math.max(0, 24 - hoursOld) / 24; // Decays over 24 hours
  const trendScore = engagementScore * (1 + recencyBoost);

  return trendScore;
};

/**
 * Filter posts by category
 */
export const filterPostsByCategory = (posts, category) => {
  if (!category || category === 'all') return posts;
  return posts.filter(post => post.category === category);
};

/**
 * Filter posts by search query
 */
export const searchPosts = (posts, query) => {
  if (!query.trim()) return posts;

  const lowerQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title?.toLowerCase().includes(lowerQuery) ||
    post.content?.toLowerCase().includes(lowerQuery) ||
    post.author?.name?.toLowerCase().includes(lowerQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Format post content (markdown, mentions, hashtags)
 */
export const formatPostContent = (content) => {
  let formatted = content;

  // Convert mentions (@username)
  formatted = formatted.replace(
    /@(\w+)/g,
    '<span class="text-blue-400 hover:underline">@$1</span>'
  );

  // Convert hashtags (#hashtag)
  formatted = formatted.replace(
    /#(\w+)/g,
    '<span class="text-purple-400 hover:underline">#$1</span>'
  );

  // Convert URLs
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="text-blue-400 hover:underline">Link</a>'
  );

  return formatted;
};

/**
 * Extract tags/mentions from content
 */
export const extractMetadata = (content) => {
  const mentions = (content.match(/@\w+/g) || []).map(m => m.substring(1));
  const tags = (content.match(/#\w+/g) || []).map(t => t.substring(1));
  const urls = content.match(/(https?:\/\/[^\s]+)/g) || [];

  return { mentions, tags, urls };
};

/**
 * Check if user has permission to edit/delete post
 */
export const canEditPost = (userId, post) => {
  return userId === post.authorId || post.isAdmin;
};

/**
 * Get post statistics over time
 */
export const getPostStats = (posts) => {
  const totalPosts = posts.length;
  const totalEngagement = posts.reduce(
    (sum, post) => sum + calculatePostEngagement(post).score,
    0
  );
  const avgEngagementPerPost = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0;

  const categoryBreakdown = {};
  posts.forEach(post => {
    const cat = post.category || 'general';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  const topContributors = posts.reduce((acc, post) => {
    const existing = acc.find(c => c.id === post.authorId);
    if (existing) {
      existing.posts += 1;
    } else {
      acc.push({
        id: post.authorId,
        name: post.author?.name,
        avatar: post.author?.avatar,
        posts: 1
      });
    }
    return acc;
  }, []).sort((a, b) => b.posts - a.posts);

  return {
    totalPosts,
    totalEngagement,
    avgEngagementPerPost,
    categoryBreakdown,
    topContributors: topContributors.slice(0, 5)
  };
};

/**
 * Get related posts
 */
export const getRelatedPosts = (currentPost, allPosts, limit = 3) => {
  const current = currentPost;
  const currentTags = current.tags || [];
  const currentCategory = current.category;

  const scored = allPosts
    .filter(post => post.id !== current.id)
    .map(post => {
      let score = 0;

      // Category match (high priority)
      if (post.category === currentCategory) score += 10;

      // Tag matches
      const commonTags = (post.tags || []).filter(tag => currentTags.includes(tag));
      score += commonTags.length * 3;

      // Title keyword overlap
      const titleKeywords = current.title.split(' ');
      const postTitleMatches = titleKeywords.filter(keyword =>
        post.title.toLowerCase().includes(keyword.toLowerCase())
      );
      score += postTitleMatches.length;

      return { ...post, relevanceScore: score };
    })
    .filter(post => post.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return scored.map(({ relevanceScore, ...post }) => post);
};

/**
 * Get trending tags
 */
export const getTrendingTags = (posts, limit = 10) => {
  const tagCounts = {};
  const tagPosts = {};

  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      if (!tagPosts[tag]) tagPosts[tag] = [];
      tagPosts[tag].push(post);
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({
      tag,
      count,
      posts: tagPosts[tag].length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Moderate content (flag inappropriate)
 */
export const reportPost = (postId, reason, details = '') => {
  return {
    postId,
    reportedAt: new Date(),
    reason,
    details,
    status: 'pending'
  };
};

/**
 * Get moderation stats
 */
export const getModerationStats = (reports) => {
  const byReason = {};
  const byStatus = {};

  reports.forEach(report => {
    byReason[report.reason] = (byReason[report.reason] || 0) + 1;
    byStatus[report.status] = (byStatus[report.status] || 0) + 1;
  });

  return {
    totalReports: reports.length,
    byReason,
    byStatus,
    pendingReviewCount: byStatus['pending'] || 0,
    resolvedCount: byStatus['resolved'] || 0
  };
};
