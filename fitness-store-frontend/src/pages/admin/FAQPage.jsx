import React, { useState, useContext } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Search,
  Filter,
  GripVertical,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock FAQ data
const mockFAQs = [
  {
    id: '1',
    category: 'getting-started',
    categoryLabel: 'Getting Started',
    question: 'How do I sign up for CrunchFit Pro?',
    answer: 'Visit our website and click "Sign Up". Choose your plan and follow the registration process. You can start with a free trial!',
    order: 1,
    published: true,
  },
  {
    id: '2',
    category: 'getting-started',
    categoryLabel: 'Getting Started',
    question: 'Can I change my membership plan later?',
    answer: 'Yes! You can upgrade, downgrade, or switch plans anytime from your account settings. Changes take effect on your next billing cycle.',
    order: 2,
    published: true,
  },
  {
    id: '3',
    category: 'billing',
    categoryLabel: 'Billing & Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and digital wallets via Stripe.',
    order: 1,
    published: true,
  },
  {
    id: '4',
    category: 'billing',
    categoryLabel: 'Billing & Payments',
    question: 'How do I cancel my membership?',
    answer: 'You can cancel anytime from your account. Your access continues until the end of your billing period. No penalties or extra fees.',
    order: 2,
    published: true,
  },
  {
    id: '5',
    category: 'classes',
    categoryLabel: 'Classes & Training',
    question: 'Can I book multiple classes at once?',
    answer: 'Yes! You can book classes in advance. Use the calendar view to schedule multiple classes for the week or month.',
    order: 1,
    published: true,
  },
  {
    id: '6',
    category: 'classes',
    categoryLabel: 'Classes & Training',
    question: 'What is your cancellation policy for classes?',
    answer: 'You can cancel class bookings up to 2 hours before the class starts without any penalties.',
    order: 2,
    published: false,
  },
];

const FAQ_CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'billing', label: 'Billing & Payments' },
  { id: 'classes', label: 'Classes & Training' },
  { id: 'account', label: 'Account & Profile' },
  { id: 'technical', label: 'Technical Support' },
];

const FAQPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [faqs, setFaqs] = useState(mockFAQs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'getting-started',
    published: true,
  });

  // Filter FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    const category = faq.categoryLabel;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        published: faq.published,
      });
    } else {
      setEditingFAQ(null);
      setFormData({
        question: '',
        answer: '',
        category: 'getting-started',
        published: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingFAQ) {
      setFaqs(
        faqs.map((f) =>
          f.id === editingFAQ.id
            ? {
                ...f,
                ...formData,
                categoryLabel: FAQ_CATEGORIES.find((c) => c.id === formData.category)?.label,
              }
            : f
        )
      );
    } else {
      const newFAQ = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        categoryLabel: FAQ_CATEGORIES.find((c) => c.id === formData.category)?.label,
        order: (faqs.filter((f) => f.category === formData.category).length || 0) + 1,
      };
      setFaqs([...faqs, newFAQ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    setEditingFAQ(null);
  };

  const handleReorder = (categoryLabel, newOrder) => {
    const updatedFAQs = faqs.map((faq) => {
      if (faq.categoryLabel === categoryLabel) {
        const index = newOrder.findIndex((f) => f.id === faq.id);
        return { ...faq, order: index + 1 };
      }
      return faq;
    });
    setFaqs(updatedFAQs);
  };

  const handleTogglePublished = (id) => {
    setFaqs(
      faqs.map((f) =>
        f.id === id ? { ...f, published: !f.published } : f
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
                <HelpCircle size={28} className="text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold">FAQ Management</h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage frequently asked questions
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add FAQ
              </motion.button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search FAQs..."
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
                className={`px-4 py-2 rounded-lg border font-medium transition-colors flex items-center gap-2 ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Categories</option>
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total FAQs</p>
                <p className="font-bold">{faqs.length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Published</p>
                <p className="font-bold text-green-600">{faqs.filter((f) => f.published).length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} px-3 py-2 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Drafts</p>
                <p className="font-bold text-orange-600">{faqs.filter((f) => !f.published).length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6">
          {Object.entries(groupedFAQs).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-12 text-center`}
            >
              <HelpCircle size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No FAQs found
              </p>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Create your first FAQ to get started
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create FAQ
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedFAQs).map(([categoryLabel, categoryFAQs]) => (
                <motion.div
                  key={categoryLabel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-500 rounded"></div>
                      {categoryLabel}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {categoryFAQs.length} item{categoryFAQs.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <Reorder.Group
                    axis="y"
                    values={categoryFAQs}
                    onReorder={(newOrder) => handleReorder(categoryLabel, newOrder)}
                    className="space-y-3"
                  >
                    {categoryFAQs.map((faq) => (
                      <Reorder.Item
                        key={faq.id}
                        value={faq}
                        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border cursor-grab active:cursor-grabbing transition-shadow`}
                      >
                        <motion.div
                          initial={false}
                          animate={{ backgroundColor: isDark ? (expandedFAQ === faq.id ? '#374151' : '#1f2937') : (expandedFAQ === faq.id ? '#f3f4f6' : '#ffffff') }}
                        >
                          <div
                            onClick={() =>
                              setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                            }
                            className="p-4 flex items-start gap-3 cursor-pointer"
                          >
                            <GripVertical
                              size={20}
                              className={`mt-1 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-semibold">{faq.question}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {!faq.published && (
                                      <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                                        Draft
                                      </span>
                                    )}
                                    {faq.published && (
                                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                                        Published
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenModal(faq);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    <Edit size={18} className="text-blue-500" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(faq.id);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    <Trash2 size={18} className="text-red-500" />
                                  </button>
                                  {expandedFAQ === faq.id ? (
                                    <ChevronUp size={20} />
                                  ) : (
                                    <ChevronDown size={20} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedFAQ === faq.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}
                              >
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {faq.answer}
                                </p>
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() =>
                                      handleTogglePublished(faq.id)
                                    }
                                    className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                                      faq.published
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                    }`}
                                  >
                                    {faq.published ? 'Published' : 'Draft'} - Click to toggle
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
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
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Question</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    placeholder="Enter the FAQ question..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Answer</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData({ ...formData, answer: e.target.value })
                    }
                    placeholder="Enter the FAQ answer..."
                    rows="6"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

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
                  {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default FAQPage;
