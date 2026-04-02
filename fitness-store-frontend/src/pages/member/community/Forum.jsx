import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  MessageCircle,
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  FORUM_CATEGORIES,
  CATEGORY_INFO,
  filterPostsByCategory,
  searchPosts,
  sortPosts,
  calculatePostEngagement
} from '../../../utils/forumCalculator';
import ForumPostDetail from './ForumPostDetail';
import CreatePostModal from './CreatePostModal';

const Forum = ({ userId, searchQuery: initialSearch = '' }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState('general');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userLikedPosts, setUserLikedPosts] = useState(new Set());

  // Mock forum posts
  const mockPosts = [
    {
      id: 1,
      title: 'Best Pre-Workout Meals Before Morning Training',
      content: 'Looking for suggestions on what to eat before 6 AM workouts. Want something light but energizing.',
      category: 'nutrition',
      authorId: 2,
      author: {
        name: 'Marcus Chen',
        avatar: '👨‍💼',
        level: 'Legend'
      },
      tags: ['nutrition', 'pre-workout', 'timing'],
      likes: 42,
      comments: [
        {
          id: 1,
          authorId: 1,
          author: { name: 'Sarah Johnson', avatar: '👩‍🦰' },
          content: 'I usually have a banana with almond butter about 30 mins before.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 8
        },
        {
          id: 2,
          authorId: 3,
          author: { name: 'Emma Rodriguez', avatar: '👩‍🦱' },
          content: 'Oatmeal with berries works great for me!',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 5
        }
      ],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      views: 156,
      shares: 3
    },
    {
      id: 2,
      title: 'Progressive Overload Strategies for Plateau Breaking',
      content: 'I\'ve been stuck on the same weights for 4 weeks. What techniques work best for breaking through?',
      category: 'workouts',
      authorId: 4,
      author: {
        name: 'James Wilson',
        avatar: '👨‍🦲',
        level: 'Advanced'
      },
      tags: ['strength', 'progression', 'plateaus'],
      likes: 67,
      comments: [
        {
          id: 1,
          authorId: 1,
          author: { name: 'Sarah Johnson', avatar: '👩‍🦰' },
          content: 'Try adding 1-2 reps per set or increase volume. Also consider deloading.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 12
        }
      ],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      views: 289,
      shares: 8
    },
    {
      id: 3,
      title: 'Just Hit My Target Weight After 6 Months!',
      content: 'Sticking to consistent training and nutrition finally paid off. Feeling amazing!',
      category: 'progress',
      authorId: 5,
      author: {
        name: 'Lisa Park',
        avatar: '👩‍🦯',
        level: 'Intermediate'
      },
      tags: ['transformation', 'achievement', 'motivation'],
      likes: 89,
      comments: [
        {
          id: 1,
          authorId: 1,
          author: { name: 'Sarah Johnson', avatar: '👩‍🦰' },
          content: 'Congratulations! Your dedication is inspiring!',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          likes: 15
        },
        {
          id: 2,
          authorId: 2,
          author: { name: 'Marcus Chen', avatar: '👨‍💼' },
          content: 'Amazing work! Keep it up!',
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
          likes: 9
        }
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 412,
      shares: 23
    },
    {
      id: 4,
      title: 'Gym Etiquette - Let\'s Discuss',
      content: 'Wanted to start a discussion about gym etiquette. What bothers you most at the gym?',
      category: 'general',
      authorId: 3,
      author: {
        name: 'Emma Rodriguez',
        avatar: '👩‍🦱',
        level: 'Advanced'
      },
      tags: ['etiquette', 'community', 'discussion'],
      likes: 54,
      comments: [
        {
          id: 1,
          authorId: 2,
          author: { name: 'Marcus Chen', avatar: '👨‍💼' },
          content: 'Not re-racking weights! It\'s such a simple thing.',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          likes: 18
        }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      views: 234,
      shares: 5
    },
    {
      id: 5,
      title: '5 Nutrition Myths Debunked',
      content: 'Let\'s discuss some common fitness myths. Sharing scientific sources would be appreciated!',
      category: 'nutrition',
      authorId: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: '👩‍🦰',
        level: 'Elite'
      },
      tags: ['nutrition', 'science', 'myths'],
      likes: 123,
      comments: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 567,
      shares: 34
    }
  ];

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = filterPostsByCategory(mockPosts, activeCategory);
    posts = searchPosts(posts, searchQuery);
    posts = sortPosts(posts, sortBy);
    return posts;
  }, [mockPosts, activeCategory, searchQuery, sortBy]);

  const handleLikePost = (postId) => {
    setUserLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const categories = [
    { value: 'general', label: t('forum.general') || 'General' },
    { value: 'nutrition', label: t('forum.nutrition') || 'Nutrition' },
    { value: 'workouts', label: t('forum.workouts') || 'Workouts' },
    { value: 'progress', label: t('forum.progress') || 'Progress' }
  ];

  const sortOptions = [
    { value: 'recent', label: t('common.recent') || 'Recent' },
    { value: 'popular', label: t('common.popular') || 'Popular' },
    { value: 'trending', label: t('common.trending') || 'Trending' },
    { value: 'most-commented', label: t('common.mostCommented') || 'Most Commented' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Create Post Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('forum.title') || 'Community Forum'}
        </h2>
        <motion.button
          onClick={() => setShowCreatePost(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          {t('forum.createPost') || 'Create Post'}
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          {/* Category Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.category') || 'Category'}
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    activeCategory === cat.value
                      ? 'bg-orange-500 text-white'
                      : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.sortBy') || 'Sort By'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isDark
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.searchPosts') || 'Search posts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-lg transition-colors text-sm ${
              isDark
                ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
            } focus:outline-none focus:ring-1 focus:ring-orange-400`}
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{post.author.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {post.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                            CATEGORY_INFO[post.category]?.color ||
                            'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {CATEGORY_INFO[post.category]?.icon || '💬'} {CATEGORY_INFO[post.category]?.label}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        by <span className="font-medium">{post.author.name}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content preview */}
                <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className={`text-xs px-2 py-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer - Engagement metrics */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 transition-colors"
                    >
                      <Heart
                        size={16}
                        className={`transition-colors ${
                          userLikedPosts.has(post.id)
                            ? 'fill-red-500 text-red-500'
                            : isDark
                            ? 'text-gray-400 hover:text-red-500'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {post.likes}
                      </span>
                    </motion.button>

                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {post.comments?.length || 0}
                      </span>
                    </div>

                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock size={16} />
                      <span className="text-xs">
                        {Math.round((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60))}m ago
                      </span>
                    </div>
                  </div>

                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.views} views
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('common.noPosts') || 'No posts yet'}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('forum.beFirstToPost') || 'Be the first to start a discussion!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <ForumPostDetail
            post={selectedPost}
            userId={userId}
            onClose={() => setSelectedPost(null)}
            onLike={() => handleLikePost(selectedPost.id)}
            isLiked={userLikedPosts.has(selectedPost.id)}
          />
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            userId={userId}
            userName={t('common.you') || 'You'}
            onClose={() => setShowCreatePost(false)}
            onSubmit={(newPost) => {
              // In a real app, this would create the post
              setShowCreatePost(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forum;
