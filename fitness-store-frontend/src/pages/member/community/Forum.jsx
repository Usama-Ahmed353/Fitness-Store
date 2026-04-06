import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  MessageCircle,
  Clock,
  Plus,
  Search,
  Share2
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CATEGORY_INFO,
  filterPostsByCategory,
  searchPosts,
  sortPosts
} from '../../../utils/forumCalculator';
import ForumPostDetail from './ForumPostDetail';
import CreatePostModal from './CreatePostModal';

const Forum = ({ userId, searchQuery: initialSearch = '' }) => {
  const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { accessToken } = useSelector((s) => s.auth);

  const [activeCategory, setActiveCategory] = useState('general');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userLikedPosts, setUserLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapPost = (p) => {
    const content = String(p.content || '');
    return {
      id: p._id,
      _id: p._id,
      title: content.length > 64 ? `${content.slice(0, 64)}...` : content,
      content,
      category: (p.tags || []).includes('nutrition')
        ? 'nutrition'
        : (p.tags || []).includes('workouts') || (p.tags || []).includes('strength')
        ? 'workouts'
        : (p.tags || []).includes('progress') || (p.tags || []).includes('transformation')
        ? 'progress'
        : 'general',
      authorId: p.authorId?._id,
      author: {
        name: `${p.authorId?.firstName || ''} ${p.authorId?.lastName || ''}`.trim() || 'Member',
        avatar: '👤',
        level: 'Member',
      },
      tags: p.tags || [],
      likes: (p.likes || []).length,
      comments: (p.comments || []).map((c, idx) => ({
        id: c._id || idx + 1,
        authorId: c.userId?._id,
        author: {
          name: `${c.userId?.firstName || ''} ${c.userId?.lastName || ''}`.trim() || 'Member',
          avatar: '👤',
        },
        content: c.content,
        createdAt: c.createdAt,
        likes: 0,
      })),
      createdAt: p.createdAt,
      views: 0,
      shares: p.shareCount || 0,
    };
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/community/posts`, {
        params: { page: 1, limit: 100 },
      });
      setPosts((data.data || []).map(mapPost));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let nextPosts = filterPostsByCategory(posts, activeCategory);
    nextPosts = searchPosts(nextPosts, searchQuery);
    nextPosts = sortPosts(nextPosts, sortBy);
    return nextPosts;
  }, [posts, activeCategory, searchQuery, sortBy]);

  const handleLikePost = async (postId) => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    await axios.post(`${API}/community/posts/${postId}/like`, {}, { headers });
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const liked = userLikedPosts.has(postId);
        return { ...post, likes: liked ? Math.max(0, post.likes - 1) : post.likes + 1 };
      })
    );

    setUserLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCreatePost = async (formData) => {
    if (!accessToken) throw new Error('Please login to create a post');
    const headers = { Authorization: `Bearer ${accessToken}` };
    await axios.post(
      `${API}/community/posts`,
      {
        content: formData.content,
        tags: [...(formData.tags || []), formData.category],
      },
      { headers }
    );
    await loadPosts();
    setShowCreatePost(false);
  };

  const handleSharePost = async (e, postId) => {
    e.stopPropagation();
    try {
      await axios.post(`${API}/community/posts/${postId}/share`);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p)));
    } catch {
      // Ignore non-critical share counter errors.
    }
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
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading community posts...</p>
            </motion.div>
          ) : (
            filteredPosts.length > 0 ? (
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

                    <motion.button
                      onClick={(e) => handleSharePost(e, post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 transition-colors"
                    >
                      <Share2 size={16} className={isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{post.shares || 0}</span>
                    </motion.button>
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
            )
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
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forum;
