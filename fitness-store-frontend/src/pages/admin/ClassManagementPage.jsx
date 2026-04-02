import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  AlertCircle,
  Archive,
  Barbell,
  BookOpen,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Edit2,
  Filter,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock classes data
const mockClasses = [
  {
    id: 'CLS-001',
    name: 'Morning HIIT',
    category: 'HIIT',
    description: 'High-intensity interval training for cardio and strength',
    gym: 'GYM-001',
    instructor: 'Mike Davis',
    instructorId: 'T-001',
    duration: 45,
    capacity: 20,
    enrolled: 18,
    waitlist: 2,
    difficulty: 'advanced',
    status: 'active',
    schedule: { type: 'recurring', days: ['Mon', 'Wed', 'Fri'], time: '06:00 AM' },
    equipment: ['Dumbbells', 'Kettlebells', 'Resistance Bands'],
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop',
    bookingRate: 90,
    attendanceRate: 85,
    createdDate: '2024-01-15',
  },
  {
    id: 'CLS-002',
    name: 'Yoga Flow',
    category: 'Yoga',
    description: 'Gentle yoga for flexibility and mindfulness',
    gym: 'GYM-001',
    instructor: 'Emma Wilson',
    instructorId: 'T-002',
    duration: 60,
    capacity: 15,
    enrolled: 14,
    waitlist: 0,
    difficulty: 'beginner',
    status: 'active',
    schedule: { type: 'recurring', days: ['Tue', 'Thu', 'Sat'], time: '07:00 AM' },
    equipment: ['Yoga Mats', 'Blocks', 'Straps'],
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop',
    bookingRate: 93,
    attendanceRate: 88,
    createdDate: '2024-02-01',
  },
  {
    id: 'CLS-003',
    name: 'CrossFit WOD',
    category: 'CrossFit',
    description: 'Workout of the day - functional training',
    gym: 'GYM-003',
    instructor: 'Alex Rodriguez',
    instructorId: 'T-004',
    duration: 60,
    capacity: 25,
    enrolled: 22,
    waitlist: 3,
    difficulty: 'intermediate',
    status: 'active',
    schedule: { type: 'recurring', days: ['Mon', 'Wed', 'Fri'], time: '07:00 AM' },
    equipment: ['Barbells', 'Boxes', 'Ropes', 'Rings'],
    thumbnail: 'https://images.unsplash.com/photo-1570829460223-93fa6b8b2b3d?w=300&h=200&fit=crop',
    bookingRate: 88,
    attendanceRate: 82,
    createdDate: '2024-01-20',
  },
  {
    id: 'CLS-004',
    name: 'Spin Class',
    category: 'Cycling',
    description: 'High-energy indoor cycling workout',
    gym: 'GYM-002',
    instructor: 'Lisa Chen',
    instructorId: 'T-003',
    duration: 45,
    capacity: 30,
    enrolled: 28,
    waitlist: 1,
    difficulty: 'intermediate',
    status: 'active',
    schedule: { type: 'recurring', days: ['Tue', 'Thu'], time: '05:30 PM' },
    equipment: ['Spin Bikes'],
    thumbnail: 'https://images.unsplash.com/photo-1431902926235-e22b058c3fe9?w=300&h=200&fit=crop',
    bookingRate: 93,
    attendanceRate: 90,
    createdDate: '2024-01-25',
  },
  {
    id: 'CLS-005',
    name: 'Boxing Fundamentals',
    category: 'Boxing',
    description: 'Learn boxing techniques and conditioning',
    gym: 'GYM-001',
    instructor: 'John Smith',
    instructorId: 'T-005',
    duration: 50,
    capacity: 16,
    enrolled: 12,
    waitlist: 0,
    difficulty: 'intermediate',
    status: 'active',
    schedule: { type: 'recurring', days: ['Wed', 'Fri'], time: '06:00 PM' },
    equipment: ['Boxing Gloves', 'Heavy Bags', 'Speed Bags'],
    thumbnail: 'https://images.unsplash.com/photo-1549719386-74dfaf00b474?w=300&h=200&fit=crop',
    bookingRate: 75,
    attendanceRate: 78,
    createdDate: '2024-02-05',
  },
];

// Mock analytics data
const bookingRateData = [
  { className: 'Morning HIIT', rate: 90 },
  { className: 'Yoga Flow', rate: 93 },
  { className: 'CrossFit WOD', rate: 88 },
  { className: 'Spin Class', rate: 93 },
  { className: 'Boxing', rate: 75 },
];

const popularTimeSlots = [
  { timeSlot: '05:30 AM', bookings: 45 },
  { timeSlot: '06:00 AM', bookings: 78 },
  { timeSlot: '07:00 AM', bookings: 92 },
  { timeSlot: '05:30 PM', bookings: 85 },
  { timeSlot: '06:00 PM', bookings: 65 },
  { timeSlot: '06:30 PM', bookings: 72 },
];

const classDistribution = [
  { name: 'HIIT', value: 20, fill: '#3b82f6' },
  { name: 'Yoga', value: 18, fill: '#10b981' },
  { name: 'CrossFit', value: 22, fill: '#f59e0b' },
  { name: 'Cycling', value: 24, fill: '#8b5cf6' },
  { name: 'Boxing', value: 16, fill: '#ef4444' },
];

const attendanceComparison = [
  { className: 'Morning HIIT', booked: 18, attended: 15, noShow: 3 },
  { className: 'Yoga Flow', booked: 14, attended: 12, noShow: 2 },
  { className: 'CrossFit WOD', booked: 22, attended: 18, noShow: 4 },
  { className: 'Spin Class', booked: 28, attended: 25, noShow: 3 },
  { className: 'Boxing', booked: 12, attended: 9, noShow: 3 },
];

const gyms = [
  { id: 'GYM-001', name: 'NYC Downtown Fitness' },
  { id: 'GYM-002', name: 'Brooklyn Elite Gym' },
  { id: 'GYM-003', name: 'Manhattan CrossFit Hub' },
  { id: 'GYM-004', name: 'Queens Fitness Center' },
];

const instructors = [
  { id: 'T-001', name: 'Mike Davis' },
  { id: 'T-002', name: 'Emma Wilson' },
  { id: 'T-003', name: 'Lisa Chen' },
  { id: 'T-004', name: 'Alex Rodriguez' },
  { id: 'T-005', name: 'John Smith' },
];

const ClassManagementPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [classes, setClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('classes');
  const [selectedClasses, setSelectedClasses] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkCancelModal, setShowBulkCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [filters, setFilters] = useState({
    gym: [],
    category: [],
    instructor: [],
    status: [],
    difficulty: [],
  });

  const [newClass, setNewClass] = useState({
    name: '',
    category: 'HIIT',
    description: '',
    gym: 'GYM-001',
    instructor: 'T-001',
    duration: 45,
    capacity: 20,
    difficulty: 'intermediate',
    scheduleType: 'recurring',
    scheduleDays: ['Mon'],
    scheduleTime: '06:00 AM',
    scheduleOneTime: '',
    equipment: [],
  });

  const [equipmentInput, setEquipmentInput] = useState('');

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.category.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filters.gym.length && !filters.gym.includes(cls.gym)) return false;
      if (filters.category.length && !filters.category.includes(cls.category)) return false;
      if (filters.instructor.length && !filters.instructor.includes(cls.instructorId)) return false;
      if (filters.status.length && !filters.status.includes(cls.status)) return false;
      if (filters.difficulty.length && !filters.difficulty.includes(cls.difficulty)) return false;

      return true;
    });
  }, [classes, searchTerm, filters]);

  const handleSelectClass = (classId) => {
    const newSelected = new Set(selectedClasses);
    if (newSelected.has(classId)) {
      newSelected.delete(classId);
    } else {
      newSelected.add(classId);
    }
    setSelectedClasses(newSelected);
  };

  const handleSelectAllClasses = () => {
    if (selectedClasses.size === filteredClasses.length) {
      setSelectedClasses(new Set());
    } else {
      setSelectedClasses(new Set(filteredClasses.map((cls) => cls.id)));
    }
  };

  const handleCreateClass = () => {
    if (newClass.name.trim() && newClass.gym && newClass.instructor) {
      const createdClass = {
        id: `CLS-${classes.length + 1}`,
        ...newClass,
        schedule: {
          type: newClass.scheduleType,
          days: newClass.scheduleType === 'recurring' ? newClass.scheduleDays : [],
          time: newClass.scheduleTime,
          oneTime: newClass.scheduleType === 'one-time' ? newClass.scheduleOneTime : '',
        },
        enrolled: 0,
        waitlist: 0,
        status: 'active',
        bookingRate: 0,
        attendanceRate: 0,
        createdDate: new Date().toISOString().split('T')[0],
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop',
      };

      setClasses([...classes, createdClass]);
      setNewClass({
        name: '',
        category: 'HIIT',
        description: '',
        gym: 'GYM-001',
        instructor: 'T-001',
        duration: 45,
        capacity: 20,
        difficulty: 'intermediate',
        scheduleType: 'recurring',
        scheduleDays: ['Mon'],
        scheduleTime: '06:00 AM',
        scheduleOneTime: '',
        equipment: [],
      });
      setEquipmentInput('');
      setShowCreateModal(false);
    }
  };

  const handleBulkCancel = () => {
    if (cancelReason.trim() && selectedClasses.size > 0) {
      // Cancel selected classes
      const updatedClasses = classes.map((cls) =>
        selectedClasses.has(cls.id) ? { ...cls, status: 'cancelled' } : cls
      );
      setClasses(updatedClasses);
      setSelectedClasses(new Set());
      setCancelReason('');
      setShowBulkCancelModal(false);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const difficultyColors = {
    beginner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    intermediate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const stats = {
    totalClasses: classes.length,
    activeClasses: classes.filter((c) => c.status === 'active').length,
    avgBookingRate: Math.round(classes.reduce((sum, c) => sum + c.bookingRate, 0) / classes.length),
    avgAttendanceRate: Math.round(classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length),
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
              <h1 className="text-2xl font-bold">Class Management</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Class
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeClasses}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-purple-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Booking Rate</p>
                <p className="text-2xl font-bold">{stats.avgBookingRate}%</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Attendance</p>
                <p className="text-2xl font-bold">{stats.avgAttendanceRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'classes'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'classes' && (
              <motion.div key="classes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Search & Filters */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6`}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                      <input
                        type="text"
                        placeholder="Search classes, instructors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                            : 'bg-white border-gray-300 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Filter size={18} />
                      Filters
                    </button>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Gym</label>
                        <select
                          multiple
                          value={filters.gym}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              gym: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          {gyms.map((gym) => (
                            <option key={gym.id} value={gym.id}>
                              {gym.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          multiple
                          value={filters.category}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              category: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          <option value="HIIT">HIIT</option>
                          <option value="Yoga">Yoga</option>
                          <option value="CrossFit">CrossFit</option>
                          <option value="Cycling">Cycling</option>
                          <option value="Boxing">Boxing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <select
                          multiple
                          value={filters.difficulty}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              difficulty: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                          multiple
                          value={filters.status}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              status: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Instructor</label>
                        <select
                          multiple
                          value={filters.instructor}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              instructor: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          {instructors.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Bulk Actions */}
                {selectedClasses.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${isDark ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-200'} rounded-lg border p-4 mb-6 flex items-center justify-between`}
                  >
                    <p className={`font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                      {selectedClasses.size} class{selectedClasses.size !== 1 ? 'es' : ''} selected
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowBulkCancelModal(true)}
                      className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Archive size={16} />
                      Cancel Selected
                    </motion.button>
                  </motion.div>
                )}

                {/* Classes Table */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                          <th className="text-left py-3 px-4 font-semibold text-sm">
                            <input
                              type="checkbox"
                              checked={selectedClasses.size === filteredClasses.length && filteredClasses.length > 0}
                              onChange={handleSelectAllClasses}
                              className="w-4 h-4"
                            />
                          </th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Class Name</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gym</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Instructor</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Schedule</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Capacity</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Booking %</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClasses.map((cls) => (
                          <motion.tr
                            key={cls.id}
                            whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                            className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedClasses.has(cls.id)}
                                onChange={() => handleSelectClass(cls.id)}
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={cls.thumbnail}
                                  alt={cls.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-sm">{cls.name}</p>
                                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{cls.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {gyms.find((g) => g.id === cls.gym)?.name}
                            </td>
                            <td className="py-3 px-4 text-sm">{cls.instructor}</td>
                            <td className="py-3 px-4 text-xs">
                              {cls.schedule.type === 'recurring'
                                ? `${cls.schedule.days.join(', ')} @ ${cls.schedule.time}`
                                : cls.schedule.oneTime}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div>
                                <p className="font-medium">{cls.enrolled}/{cls.capacity}</p>
                                {cls.waitlist > 0 && (
                                  <p className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                    {cls.waitlist} waitlist
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex items-center gap-1">
                                <TrendingUp size={14} className="text-green-500" />
                                {cls.bookingRate}%
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`${statusColors[cls.status]} px-2 py-1 rounded-full text-xs font-medium`}>
                                {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                              >
                                <MoreVertical size={16} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredClasses.length === 0 && (
                    <div className="p-8 text-center">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No classes match your filters</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Booking Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Booking Rate by Class
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="className" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="rate" fill="#3b82f6" name="Booking Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Popular Time Slots */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock size={18} />
                    Most Popular Time Slots
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={popularTimeSlots}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="timeSlot" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} name="Bookings" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Class Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={18} />
                    Class Type Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={classDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {classDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Attendance Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Attendance Rate Comparison
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendanceComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="className" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="booked" fill="#3b82f6" name="Booked" />
                      <Bar dataKey="attended" fill="#10b981" name="Attended" />
                      <Bar dataKey="noShow" fill="#ef4444" name="No-Show" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Waitlist Frequency */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4">Classes with Waitlist</h4>
                  <div className="space-y-3">
                    {classes
                      .filter((cls) => cls.waitlist > 0)
                      .map((cls) => (
                        <motion.div
                          key={cls.id}
                          whileHover={{ x: 4 }}
                          className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg flex items-center justify-between`}
                        >
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {cls.enrolled}/{cls.capacity} enrolled
                            </p>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                            {cls.waitlist} waiting
                          </div>
                        </motion.div>
                      ))}
                    {classes.filter((cls) => cls.waitlist > 0).length === 0 && (
                      <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No classes have waitlist
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Create New Class</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">Class Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Morning HIIT"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gym *</label>
                    <select
                      value={newClass.gym}
                      onChange={(e) => setNewClass({ ...newClass, gym: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      {gyms.map((gym) => (
                        <option key={gym.id} value={gym.id}>
                          {gym.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newClass.category}
                      onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option>HIIT</option>
                      <option>Yoga</option>
                      <option>CrossFit</option>
                      <option>Cycling</option>
                      <option>Boxing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Class description..."
                    value={newClass.description}
                    onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    rows="3"
                  />
                </div>

                {/* Instructor & Duration */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructor *</label>
                    <select
                      value={newClass.instructor}
                      onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (min)</label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      value={newClass.duration}
                      onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={newClass.difficulty}
                      onChange={(e) => setNewClass({ ...newClass, difficulty: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium mb-2">Max Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium mb-2">Schedule Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="recurring"
                        checked={newClass.scheduleType === 'recurring'}
                        onChange={(e) => setNewClass({ ...newClass, scheduleType: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Recurring</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="one-time"
                        checked={newClass.scheduleType === 'one-time'}
                        onChange={(e) => setNewClass({ ...newClass, scheduleType: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">One-Time</span>
                    </label>
                  </div>
                </div>

                {newClass.scheduleType === 'recurring' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Days of Week</label>
                      <div className="space-y-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <label key={day} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newClass.scheduleDays.includes(day)}
                              onChange={(e) => {
                                const days = e.target.checked
                                  ? [...newClass.scheduleDays, day]
                                  : newClass.scheduleDays.filter((d) => d !== day);
                                setNewClass({ ...newClass, scheduleDays: days });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Time</label>
                      <input
                        type="time"
                        value={newClass.scheduleTime}
                        onChange={(e) => setNewClass({ ...newClass, scheduleTime: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newClass.scheduleOneTime}
                      onChange={(e) => setNewClass({ ...newClass, scheduleOneTime: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                )}

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium mb-2">Equipment</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add equipment..."
                      value={equipmentInput}
                      onChange={(e) => setEquipmentInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && equipmentInput.trim()) {
                          setNewClass({
                            ...newClass,
                            equipment: [...newClass.equipment, equipmentInput.trim()],
                          });
                          setEquipmentInput('');
                        }
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <button
                      onClick={() => {
                        if (equipmentInput.trim()) {
                          setNewClass({
                            ...newClass,
                            equipment: [...newClass.equipment, equipmentInput.trim()],
                          });
                          setEquipmentInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newClass.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm flex items-center gap-2`}
                      >
                        {item}
                        <button
                          onClick={() =>
                            setNewClass({
                              ...newClass,
                              equipment: newClass.equipment.filter((_, i) => i !== idx),
                            })
                          }
                          className="hover:opacity-70"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail (Upload to Cloudinary)</label>
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:opacity-80 transition-opacity`}>
                    <Camera size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Click to upload or drag & drop</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700 dark:border-gray-700">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  disabled={!newClass.name.trim() || !newClass.gym}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Class
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bulk Cancel Modal */}
        {showBulkCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-2">Cancel Selected Classes</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                All {selectedClasses.size} selected classes will be cancelled and all attending members will be notified automatically.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Cancellation Reason *</label>
                <textarea
                  placeholder="e.g., Instructor unavailable due to emergency"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  rows="4"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowBulkCancelModal(false);
                    setCancelReason('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Keep Classes
                </button>
                <button
                  onClick={handleBulkCancel}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel {selectedClasses.size} Classes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ClassManagementPage;
