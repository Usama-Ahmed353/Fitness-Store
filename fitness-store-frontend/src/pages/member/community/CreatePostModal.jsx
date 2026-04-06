import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { CATEGORY_INFO } from '../../../utils/forumCalculator';

const CreatePostModal = ({ onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const categories = [
    { value: 'general', label: 'General Discussion' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'workouts', label: 'Workouts' },
    { value: 'progress', label: 'Progress Stories' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image must be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setSubmitError('');

    try {
      await onSubmit({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      setSubmitError(error?.message || 'Failed to publish post');
      setIsSubmitting(false);
    }
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
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('forum.createPost') || 'Create a New Post'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className={`p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-300px)] ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.title') || 'Title'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What's your post about?"
              maxLength="200"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.title
                  ? isDark
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-400 bg-red-50'
                  : isDark
                  ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                  : 'bg-white border-gray-300 focus:border-orange-400'
              } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
            />
            <div className="flex justify-between items-start mt-1">
              <p className={`text-sm ${errors.title ? (isDark ? 'text-red-400' : 'text-red-600') : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {errors.title || `${formData.title.length}/200`}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.category') || 'Category'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-orange-400'
                } focus:outline-none focus:ring-1 focus:ring-orange-400`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Tag size={16} className="inline mr-2" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="fitness, nutrition, training"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
                } focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.content') || 'Content'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your thoughts, experiences, or ask questions..."
              rows="8"
              className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                errors.content
                  ? isDark
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-400 bg-red-50'
                  : isDark
                  ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                  : 'bg-white border-gray-300 focus:border-orange-400'
              } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
            />
            <p className={`text-sm mt-1 ${errors.content ? (isDark ? 'text-red-400' : 'text-red-600') : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {errors.content || `${formData.content.length} characters`}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <ImageIcon size={16} className="inline mr-2" />
              Add Image (optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDark
                ? 'border-gray-600 hover:border-orange-400 hover:bg-gray-700/50'
                : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
            }`}>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Click to upload image
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
              {formData.image && (
                <div className="mt-3 text-sm text-green-400">
                  ✓ {formData.image.name}
                </div>
              )}
            </div>
            {errors.image && (
              <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {errors.image}
              </p>
            )}
          </div>

          {/* Info Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 p-4 rounded-lg ${
              isDark
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <AlertCircle size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              <p className="font-medium mb-1">Community Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be respectful and constructive</li>
                <li>Avoid spam and self-promotion</li>
                <li>Share factual information when possible</li>
                <li>Engage in healthy discussions</li>
              </ul>
            </div>
          </motion.div>

          {submitError && (
            <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {submitError}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${isDark ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {t('common.cancel') || 'Cancel'}
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Publishing...
              </span>
            ) : (
              t('forum.publishPost') || 'Publish Post'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
