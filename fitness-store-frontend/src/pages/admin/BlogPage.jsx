import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Globe,
  Image as ImageIcon,
  Clock,
  Check,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock blog posts
const mockBlogPosts = [
  {
    id: '1',
    title: 'Getting the Most Out of Your Fitness Journey',
    slug: 'getting-most-out-fitness-journey',
    content: '<h2>Start Your Fitness Journey Today</h2><p>Whether you\'re a beginner or an experienced athlete...</p>',
    excerpt: 'Learn how to maximize your fitness results with these proven strategies and tips from our expert trainers.',
    category: 'fitness-tips',
    categoryLabel: 'Fitness Tips',
    coverImage: 'https://via.placeholder.com/800x400',
    author: 'John Doe',
    publishedDate: '2024-03-20',
    published: true,
    featured: true,
    seo: {
      metaTitle: 'Getting the Most Out of Your Fitness Journey | CrunchFit',
      metaDescription: 'Learn fitness tips and strategies from expert trainers.',
      metaKeywords: 'fitness, training, health, wellness',
      ogImage: 'https://via.placeholder.com/1200x630',
    },
    views: 1240,
    likes: 85,
  },
  {
    id: '2',
    title: 'Nutrition Guide for Peak Performance',
    slug: 'nutrition-guide-peak-performance',
    content: '<h2>Fuel Your Body Right</h2><p>Proper nutrition is the foundation of any fitness program...</p>',
    excerpt: 'Discover the nutrition principles that elite athletes use to fuel peak performance.',
    category: 'nutrition',
    categoryLabel: 'Nutrition',
    coverImage: 'https://via.placeholder.com/800x400',
    author: 'Jane Smith',
    publishedDate: '2024-03-18',
    published: true,
    featured: false,
    seo: {
      metaTitle: 'Nutrition Guide for Peak Performance | CrunchFit',
      metaDescription: 'Expert nutrition advice for athletes and fitness enthusiasts.',
      metaKeywords: 'nutrition, diet, fitness, performance',
      ogImage: 'https://via.placeholder.com/1200x630',
    },
    views: 856,
    likes: 62,
  },
  {
    id: '3',
    title: 'Building Muscle: The Complete Guide',
    slug: 'building-muscle-complete-guide',
    content: '<h2>Gain Lean Muscle Mass</h2><p>Building muscle requires a combination of proper training...</p>',
    excerpt: 'Step-by-step guide to building lean muscle mass through progressive overload and proper nutrition.',
    category: 'training',
    categoryLabel: 'Training',
    coverImage: 'https://via.placeholder.com/800x400',
    author: 'Mike Johnson',
    publishedDate: '2024-03-15',
    published: false,
    featured: false,
    seo: {
      metaTitle: 'Building Muscle: The Complete Guide | CrunchFit',
      metaDescription: 'Learn how to build lean muscle mass with our complete guide.',
      metaKeywords: 'muscle building, strength training, fitness',
      ogImage: 'https://via.placeholder.com/1200x630',
    },
    views: 0,
    likes: 0,
  },
];

const BLOG_CATEGORIES = [
  { id: 'fitness-tips', label: 'Fitness Tips' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'training', label: 'Training' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'community', label: 'Community' },
];

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const wrapTitleLines = (title = '', maxChars = 22, maxLines = 4) => {
  const words = String(title).trim().split(/\s+/);
  if (!words.length) return ['CrunchFit Article'];

  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxChars) {
      currentLine = candidate;
      return;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    const last = trimmed[maxLines - 1];
    trimmed[maxLines - 1] = last.length > maxChars - 1 ? `${last.slice(0, maxChars - 1)}...` : `${last}...`;
    return trimmed;
  }

  return lines;
};

const buildFallbackCover = (title = 'CrunchFit Article', category = 'Fitness') => {
  const safeCategory = escapeXml(category);
  const titleLines = wrapTitleLines(title)
    .map((line, index) => `<tspan x="90" dy="${index === 0 ? 0 : 56}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#0b3b54"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect x="50" y="50" width="1100" height="530" rx="24" fill="none" stroke="#1ecad3" stroke-opacity="0.35" stroke-width="2"/>
      <text x="90" y="140" fill="#1ecad3" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700">${safeCategory}</text>
      <text x="90" y="220" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="800">${titleLines}</text>
      <text x="90" y="560" fill="#94a3b8" font-family="Segoe UI, Arial, sans-serif" font-size="26">CrunchFit Pro Blog</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getPostCoverImage = (post) => post.coverImage || buildFallbackCover(post.title, post.categoryLabel);

const BlogPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [posts, setPosts] = useState(mockBlogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'fitness-tips',
    coverImage: '',
    author: '',
    publishedDate: new Date().toISOString().split('T')[0],
    published: false,
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogImage: '',
    },
  });

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesPublished =
      filterPublished === 'all' ||
      (filterPublished === 'published' && post.published) ||
      (filterPublished === 'draft' && !post.published);
    return matchesSearch && matchesCategory && matchesPublished;
  });

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        coverImage: post.coverImage,
        author: post.author,
        publishedDate: post.publishedDate,
        published: post.published,
        featured: post.featured,
        seo: { ...post.seo },
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'fitness-tips',
        coverImage: '',
        author: '',
        publishedDate: new Date().toISOString().split('T')[0],
        published: false,
        featured: false,
        seo: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          ogImage: '',
        },
      });
    }
    setShowModal(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        metaTitle: `${title} | CrunchFit`,
      },
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      );
    } else {
      const newPost = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        categoryLabel: BLOG_CATEGORIES.find((c) => c.id === formData.category)?.label,
        views: 0,
        likes: 0,
      };
      setPosts([newPost, ...posts]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handlePreview = (post) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  const handleTogglePublished = (id) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              published: !p.published,
              publishedDate: !p.published ? new Date().toISOString().split('T')[0] : p.publishedDate,
            }
          : p
      )
    );
  };

  const handleToggleFeatured = (id) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen size={28} className="text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold">Blog Management</h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create and manage blog articles
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Write Article
              </motion.button>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                      : 'bg-white border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Categories</option>
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Articles</p>
                <p className="font-bold">{posts.length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Published</p>
                <p className="font-bold text-green-600">{posts.filter((p) => p.published).length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Drafts</p>
                <p className="font-bold text-orange-600">{posts.filter((p) => !p.published).length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-purple-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Featured</p>
                <p className="font-bold text-purple-600">{posts.filter((p) => p.featured).length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-12 text-center`}
            >
              <BookOpen size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No articles found
              </p>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Start writing your first blog post
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Write Article
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Cover Image */}
                    <div className="flex-shrink-0 w-40 h-24 sm:w-44 sm:h-28 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700/70 border border-slate-300/50 dark:border-slate-600/60">
                      <img
                        src={getPostCoverImage(post)}
                        alt={post.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = buildFallbackCover(post.title, post.categoryLabel);
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {post.featured && (
                              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                                Featured
                              </span>
                            )}
                            {!post.published && (
                              <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                                Draft
                              </span>
                            )}
                            {post.published && (
                              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                                Published
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold mb-2 leading-snug break-words">{post.title}</h3>
                          <p className={`text-sm mb-3 line-clamp-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag size={14} />
                              {post.categoryLabel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(post.publishedDate).toLocaleDateString()}
                            </span>
                            {post.published && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Eye size={14} />
                                  {post.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Check size={14} />
                                  {post.likes} likes
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handlePreview(post)}
                            className={`p-2 rounded transition-colors ${
                              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                            title="Preview"
                          >
                            <Eye size={18} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(post)}
                            className={`p-2 rounded transition-colors ${
                              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                            title="Edit"
                          >
                            <Edit size={18} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(post.id)}
                            className={`p-2 rounded transition-colors ${
                              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            } ${post.featured ? 'text-purple-500' : 'text-gray-400'}`}
                            title="Toggle featured"
                          >
                            <BookOpen size={18} />
                          </button>
                          <button
                            onClick={() => handleTogglePublished(post.id)}
                            className={`p-2 rounded transition-colors ${
                              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            } ${post.published ? 'text-green-500' : 'text-gray-400'}`}
                            title="Toggle published"
                          >
                            {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className={`p-2 rounded transition-colors ${
                              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">
                  {editingPost ? 'Edit Article' : 'Create New Article'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Basic Info */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Article Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-slug"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Auto-generated from title. /blog/{formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Published Date</label>
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of the article..."
                    rows="2"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Article content (HTML supported)..."
                    rows="5"
                    className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rich text editor (HTML) - Ready for react-quill integration
                  </p>
                </div>

                {/* SEO Section */}
                <div className="col-span-2 border-t pt-4">
                  <h4 className="font-semibold mb-4 text-blue-500">SEO Settings</h4>

                  <div className="col-span-2 mb-4">
                    <label className="block text-sm font-semibold mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, metaTitle: e.target.value },
                        })
                      }
                      placeholder="Meta title..."
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${formData.seo.metaTitle.length > 60 ? 'text-orange-500' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.seo.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="col-span-2 mb-4">
                    <label className="block text-sm font-semibold mb-2">Meta Description</label>
                    <textarea
                      value={formData.seo.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, metaDescription: e.target.value },
                        })
                      }
                      placeholder="Meta description..."
                      rows="2"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${formData.seo.metaDescription.length > 160 ? 'text-orange-500' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.seo.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div className="col-span-2 mb-4">
                    <label className="block text-sm font-semibold mb-2">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.seo.metaKeywords}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, metaKeywords: e.target.value },
                        })
                      }
                      placeholder="keyword1, keyword2, keyword3"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Publishing Options */}
                <div className="col-span-2 space-y-3 border-t pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Publish immediately</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Mark as featured article</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingPost ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-3xl w-full p-8 my-8`}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                className={`absolute right-4 top-4 p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>

              <article className="space-y-6">
                <img
                  src={getPostCoverImage(previewPost)}
                  alt={previewPost.title}
                  className="w-full max-h-[420px] object-contain rounded-lg bg-slate-100 dark:bg-slate-900/60"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = buildFallbackCover(previewPost.title, previewPost.categoryLabel);
                  }}
                />

                <div>
                  <h1 className="text-3xl font-bold mb-2">{previewPost.title}</h1>
                  <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>{previewPost.author}</span>
                    <span>{new Date(previewPost.publishedDate).toLocaleDateString()}</span>
                    <span>{previewPost.categoryLabel}</span>
                  </div>
                </div>

                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {previewPost.excerpt}
                </p>

                <div
                  className={`prose dark:prose-invert max-w-none ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                />
              </article>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="mt-8 w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default BlogPage;
