import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Reply
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { CATEGORY_INFO } from '../../../utils/forumCalculator';

const ForumPostDetail = ({ post, userId, onClose, onLike, isLiked }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [replyToId, setReplyToId] = useState(null);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      authorId: userId,
      author: {
        name: 'Current User',
        avatar: '👤'
      },
      content: newComment,
      createdAt: new Date(),
      likes: 0
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(c =>
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-lg my-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Discussion
          </h2>
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto max-h-[calc(100vh-400px)] ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Original Post */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Author Info */}
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{post.author.avatar}</span>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.author.name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.author.level}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  CATEGORY_INFO[post.category]?.color || 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {CATEGORY_INFO[post.category]?.icon || '💬'} {CATEGORY_INFO[post.category]?.label}
              </span>
            </div>

            {/* Title and Content */}
            <h1 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </h1>
            <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {post.content}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-3 py-1 rounded ${
                      isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Engagement Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={() => onLike()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 transition-colors"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isLiked
                        ? 'fill-red-500 text-red-500'
                        : isDark
                        ? 'text-gray-400 hover:text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.likes}
                  </span>
                </motion.button>

                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {comments.length}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <Share2 size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.shares || 0}
                  </span>
                </motion.button>
              </div>

              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {post.views} views
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>

            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                >
                  {/* Comment Author */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">{comment.author.avatar}</span>
                    <div className="flex-1">
                      <div>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {comment.author.name}
                        </span>
                        <span className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => handleLikeComment(comment.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 text-sm transition-colors"
                    >
                      <Heart
                        size={16}
                        className={`transition-colors ${
                          isDark
                            ? 'text-gray-400 hover:text-red-500'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {comment.likes}
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setReplyToId(comment.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                      }`}
                    >
                      <Reply size={16} />
                      Reply
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Comment Footer */}
        <div className={`p-6 border-t sticky bottom-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('forum.addComment') || 'Add a comment'}
            </label>
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('forum.enterComment') || 'Share your thoughts...'}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors resize-none ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
                } focus:outline-none focus:ring-1 focus:ring-orange-400`}
                rows="3"
              />
            </div>
            <motion.button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {t('forum.postComment') || 'Post Comment'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForumPostDetail;
