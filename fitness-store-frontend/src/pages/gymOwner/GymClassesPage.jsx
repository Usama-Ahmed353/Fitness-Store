import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  X,
  Copy,
  Repeat2,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock class data
const mockClasses = [
  {
    id: 1,
    name: 'Morning Cardio',
    category: 'cardio',
    instructor: 'Sarah Johnson',
    date: '2026-03-24',
    time: '06:00',
    duration: 45,
    capacity: 30,
    booked: 28,
    waitlist: 2,
    room: 'Studio A',
    description: 'High-energy cardio kickboxing class',
    equipment: ['Punching Bag', 'Step Platform'],
    recurring: { type: 'weekly', endDate: null },
    attendance: 26,
    noShowRate: 7,
    bookingTrend: [65, 72, 78, 82, 88, 92, 93],
  },
  {
    id: 2,
    name: 'Strength Training',
    category: 'strength',
    instructor: 'Mike Chen',
    date: '2026-03-25',
    time: '17:00',
    duration: 60,
    capacity: 20,
    booked: 18,
    waitlist: 0,
    room: 'Weight Room',
    description: 'Full body strength training',
    equipment: ['Dumbbells', 'Barbells', 'Plates'],
    recurring: { type: 'weekly', endDate: null },
    attendance: 18,
    noShowRate: 0,
    bookingTrend: [75, 80, 85, 88, 90, 90, 90],
  },
  {
    id: 3,
    name: 'Evening Yoga',
    category: 'yoga',
    instructor: 'Emma Wilson',
    date: '2026-03-26',
    time: '18:00',
    duration: 90,
    capacity: 25,
    booked: 3,
    waitlist: 0,
    room: 'Studio B',
    description: 'Relaxing yoga & meditation',
    equipment: ['Yoga Mats', 'Blocks', 'Straps'],
    recurring: { type: 'weekly', endDate: null },
    attendance: 2,
    noShowRate: 33,
    bookingTrend: [45, 40, 35, 30, 20, 15, 12],
  },
];

const categoryColors = {
  cardio: { bg: 'from-red-500 to-red-600', text: 'text-red-600', light: 'bg-red-100' },
  strength: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', light: 'bg-blue-100' },
  yoga: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', light: 'bg-purple-100' },
  pilates: { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600', light: 'bg-pink-100' },
  swimming: { bg: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', light: 'bg-cyan-100' },
  crossfit: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', light: 'bg-orange-100' },
  dance: { bg: 'from-green-500 to-green-600', text: 'text-green-600', light: 'bg-green-100' },
};

const GymClassesPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-24'));
  const [classes, setClasses] = useState(mockClasses);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Month view calendar
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayClasses = classes.filter((c) => c.date === dateStr);

      days.push(
        <motion.div
          key={day}
          className={`p-2 rounded-lg border min-h-24 cursor-pointer transition-all ${
            isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
          }`}
          whileHover={{ y: -2 }}
        >
          <p className="font-bold text-sm mb-2">{day}</p>
          <div className="space-y-1">
            {dayClasses.slice(0, 2).map((cls) => (
              <div
                key={cls.id}
                className={`p-1 rounded text-xs font-semibold text-white truncate bg-gradient-to-r ${categoryColors[cls.category].bg} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => {
                  setSelectedClass(cls);
                  setShowDetailModal(true);
                }}
              >
                {cls.time} {cls.name}
              </div>
            ))}
            {dayClasses.length > 2 && (
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                +{dayClasses.length - 2} more
              </p>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDeleteClass = (id) => {
    if (confirm('Delete this class?')) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
      setShowDetailModal(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Classes</h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage class schedule, capacity, and bookings
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Create Class
            </button>
          </div>
        </motion.div>

        {/* View Mode Selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={handlePrevMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-bold min-w-40 text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        {viewMode === 'month' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Day headers */}
            <div className={`grid grid-cols-7 gap-2 mb-2 ${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <p key={day} className="font-bold text-center text-sm">
                  {day}
                </p>
              ))}
            </div>

            {/* Days grid */}
            <div
              className={`grid grid-cols-7 gap-2 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              {renderMonthView()}
            </div>
          </motion.div>
        )}

        {/* Week/Day View Placeholder */}
        {(viewMode === 'week' || viewMode === 'day') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center`}
          >
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced calendar views coming soon. Use month view for now.
            </p>
          </motion.div>
        )}

        {/* Classes List */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <h3 className="text-2xl font-bold mb-6">All Classes</h3>
          <div className="space-y-4">
            {classes.map((cls) => {
              const bookingPercent = (cls.booked / cls.capacity) * 100;

              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
                  onClick={() => {
                    setSelectedClass(cls);
                    setShowDetailModal(true);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-4">
                    {/* Color indicator */}
                    <div className={`w-1 h-full rounded ${categoryColors[cls.category].light}`}></div>

                    {/* Class info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold">{cls.name}</h4>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {cls.instructor}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${categoryColors[cls.category].light} ${categoryColors[cls.category].text}`}>
                          {cls.category}
                        </span>
                      </div>

                      {/* Class details */}
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{new Date(cls.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-gray-500" />
                          <span>{cls.time} · {cls.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle size={16} className="text-gray-500" />
                          <span>{cls.room}</span>
                        </div>
                        {cls.recurring && (
                          <div className="flex items-center gap-1">
                            <Repeat2 size={16} className="text-gray-500" />
                            <span className="capitalize">{cls.recurring.type}</span>
                          </div>
                        )}
                      </div>

                      {/* Capacity bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">Capacity</span>
                          <span className={`text-xs font-bold ${bookingPercent >= 90 ? 'text-red-600' : bookingPercent >= 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {cls.booked}/{cls.capacity}
                            {cls.waitlist > 0 && ` (+${cls.waitlist} waitlist)`}
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                          <motion.div
                            className={`h-full ${
                              bookingPercent >= 90 ? 'bg-red-600' : bookingPercent >= 70 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            animate={{ width: `${Math.min(bookingPercent, 100)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Attendance stats */}
                      <div className="flex gap-6 text-xs">
                        <div>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
                          <p className="font-bold">{cls.attendance}/{cls.booked}</p>
                        </div>
                        <div>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No-show Rate</p>
                          <p className={`font-bold ${cls.noShowRate > 20 ? 'text-red-600' : 'text-green-600'}`}>
                            {cls.noShowRate}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClass(cls);
                          setShowCreateModal(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(cls.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedClass && (
            <ClassDetailModal
              classData={selectedClass}
              isDark={isDark}
              onClose={() => setShowDetailModal(false)}
              onEdit={() => {
                setShowCreateModal(true);
                setShowDetailModal(false);
              }}
              onDelete={() => handleDeleteClass(selectedClass.id)}
            />
          )}
        </AnimatePresence>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateClassModal
              isDark={isDark}
              onClose={() => {
                setShowCreateModal(false);
                setSelectedClass(null);
              }}
              existingClass={selectedClass}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Class Detail Modal Component
const ClassDetailModal = ({ classData, isDark, onClose, onEdit, onDelete }) => {
  const bookingPercent = (classData.booked / classData.capacity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">{classData.name}</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              with {classData.instructor}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Class Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date & Time</p>
            <p className="font-bold mt-1">{new Date(classData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-sm">{classData.time} · {classData.duration} min</p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
            <p className="font-bold mt-1">{classData.room}</p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Capacity</p>
            <p className="font-bold mt-1">{classData.booked}/{classData.capacity}</p>
            <p className={`text-xs mt-1 ${bookingPercent >= 90 ? 'text-red-600' : bookingPercent >= 70 ? 'text-yellow-600' : 'text-green-600'}`}>
              {Math.round(bookingPercent)}% booked
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
            <p className="font-bold mt-1">{classData.attendance}/{classData.booked}</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>({Math.round((classData.attendance / classData.booked) * 100)}%)</p>
          </div>
        </div>

        {/* Booking Trend Chart */}
        <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-sm font-bold mb-4">Booking Trend (Last 7 Days)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={classData.bookingTrend.map((value, idx) => ({ day: idx + 1, booking: value }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#666'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="booking" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Cancel Class
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Create Class Modal Component
const CreateClassModal = ({ isDark, onClose, existingClass }) => {
  const [formData, setFormData] = useState(
    existingClass || {
      name: '',
      category: 'cardio',
      instructor: 'Sarah Johnson',
      date: '',
      time: '09:00',
      duration: '60',
      capacity: '20',
      room: '',
      description: '',
      equipment: '',
      recurring: 'none',
      recurringType: 'weekly',
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Class name required';
    if (!formData.date) newErrors.date = 'Date required';
    if (!formData.room.trim()) newErrors.room = 'Room required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Creating/Updating class:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
      >
        <h3 className="text-2xl font-bold mb-6">{existingClass ? 'Edit Class' : 'Create Class'}</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Class Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Morning Yoga"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
              <option value="swimming">Swimming</option>
              <option value="crossfit">CrossFit</option>
              <option value="dance">Dance</option>
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-semibold mb-2">Instructor</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Chen">Mike Chen</option>
              <option value="Emma Wilson">Emma Wilson</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold mb-2">Max Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="20"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Room */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Room/Location *</label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Studio A"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
            {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Class description..."
              rows="2"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Equipment */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Equipment Needed</label>
            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="Dumbbells, Yoga mats (comma-separated)"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Recurring */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Recurring</label>
            <select
              name="recurring"
              value={formData.recurring}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            >
              <option value="none">One-time only</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {existingClass ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GymClassesPage;
