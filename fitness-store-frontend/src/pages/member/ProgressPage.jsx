import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Target,
  TrendingUp,
  Plus,
  Trash2,
  Award,
  Activity,
  Flame,
  Sparkles,
  ArrowLeft,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/**
 * ProgressPage - Member progress tracking and goal management
 */
const ProgressPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const tx = (key, fallback) => {
    const value = t(key);
    return !value || value === key ? fallback : value;
  };

  const { profile, bookings } = useSelector((state) => state.member);

  // State for goals and modal
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Weight Loss Goal',
      category: 'weight',
      target: 180,
      current: 195,
      unit: 'lbs',
      dueDate: '2026-06-30',
      progress: 75,
    },
    {
      id: 2,
      title: 'Weekly Classes Target',
      category: 'classes',
      target: 5,
      current: 3,
      unit: 'classes/week',
      dueDate: '2026-12-31',
      progress: 60,
    },
    {
      id: 3,
      title: 'Monthly Check-Ins',
      category: 'checkins',
      target: 20,
      current: 12,
      unit: 'check-ins/month',
      dueDate: '2026-05-31',
      progress: 60,
    },
  ]);

  const [measurements, setMeasurements] = useState([
    {
      id: 1,
      date: '2026-03-20',
      weight: 195,
      bodyFat: 28.5,
      chest: 42,
      waist: 36,
      hips: 40,
    },
    {
      id: 2,
      date: '2026-03-13',
      weight: 196,
      bodyFat: 29,
      chest: 42,
      waist: 36.5,
      hips: 40.2,
    },
    {
      id: 3,
      date: '2026-03-06',
      weight: 197,
      bodyFat: 29.5,
      chest: 41.5,
      waist: 37,
      hips: 40.5,
    },
  ]);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Mock data for charts
  const classesPerMonth = [
    { month: 'Oct', classes: 12, workouts: 18 },
    { month: 'Nov', classes: 15, workouts: 22 },
    { month: 'Dec', classes: 10, workouts: 15 },
    { month: 'Jan', classes: 18, workouts: 25 },
    { month: 'Feb', classes: 16, workouts: 23 },
    { month: 'Mar', classes: 14, workouts: 20 },
  ];

  const classTypeDistribution = [
    { name: 'Spin', value: 35, color: '#3b82f6' },
    { name: 'Yoga', value: 25, color: '#8b5cf6' },
    { name: 'HIIT', value: 20, color: '#ef4444' },
    { name: 'Strength', value: 15, color: '#10b981' },
    { name: 'Pilates', value: 5, color: '#f59e0b' },
  ];

  const workoutsByCategory = [
    { category: 'Cardio', count: 24 },
    { category: 'Strength', count: 18 },
    { category: 'Flexibility', count: 12 },
    { category: 'Mind & Body', count: 9 },
  ];

  // Milestones timeline
  const milestones = [
    {
      id: 1,
      title: 'First Check-In',
      date: '2025-10-15',
      description: 'Started your CrunchFit journey',
      completed: true,
      icon: Award,
    },
    {
      id: 2,
      title: '10 Classes Attended',
      date: '2025-11-02',
      description: 'Reached 10 classes milestone',
      completed: true,
      icon: Activity,
    },
    {
      id: 3,
      title: '1-Month Streak',
      date: '2025-11-15',
      description: 'Checked in for 30 consecutive days',
      completed: true,
      icon: TrendingUp,
    },
    {
      id: 4,
      title: '50 Classes Attended',
      date: '2026-02-08',
      description: 'Reached 50 classes milestone',
      completed: true,
      icon: Award,
    },
    {
      id: 5,
      title: '100 Classes Attended',
      date: '2026-06-30',
      description: 'Next milestone',
      completed: false,
      icon: Award,
    },
  ];

  // Delete goal
  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  // Add measurement
  const addMeasurement = () => {
    const newMeasurement = {
      id: measurements.length + 1,
      date: new Date().toISOString().split('T')[0],
      weight: 194,
      bodyFat: 28,
      chest: 42.2,
      waist: 35.8,
      hips: 39.9,
    };
    setMeasurements([newMeasurement, ...measurements]);
    setShowMeasurementForm(false);
  };

  const chartColor = isDark ? '#e5e7eb' : '#1f2937';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const cardVariant = isDark ? 'dark' : 'default';

  return (
    <>
      <SEO
        title="Progress & Goals - CrunchFit Pro"
        description="Track your fitness progress, manage goals, and view achievements"
        noIndex={true}
      />

      <MemberLayout>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${isDark ? 'border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900' : 'border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50'}`}>
                <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
                <div className="absolute -left-10 -bottom-14 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    isDark
                      ? 'border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tx('member.progress.title', 'Your Progress')}
                </h1>
                <p
                  className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {tx(
                    'member.progress.subtitle',
                    'Track your fitness journey and manage your goals'
                  )}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700'}`}>
                    <Flame className="h-3.5 w-3.5 text-orange-500" /> {bookings?.length || 0} total bookings
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700'}`}>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> {goals.length} active goals
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Goals Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tx('member.progress.goals', 'Your Goals')}
                </h2>
                <Button
                  onClick={() => setShowGoalModal(true)}
                  icon={Plus}
                  variant="secondary"
                >
                  {tx('member.progress.addGoal', 'Add Goal')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card variant={cardVariant}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {goal.title}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {goal.current} / {goal.target} {goal.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? 'hover:bg-red-900/20 text-red-400'
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className={`h-2 rounded-full overflow-hidden mb-3 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-accent"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs font-semibold ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {goal.progress}%
                        </span>
                        <span
                          className={`text-xs ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          Due {goal.dueDate}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                  {tx('member.progress.stats', 'Workout Statistics')}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Line Chart - Classes Over Time */}
                <Card variant={cardVariant}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tx(
                      'member.progress.classesPerMonth',
                      'Classes per Month'
                    )}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={classesPerMonth}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridColor}
                      />
                      <XAxis stroke={chartColor} />
                      <YAxis stroke={chartColor} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          border: `1px solid ${gridColor}`,
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: chartColor }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="classes"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="workouts"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Pie Chart - Class Types */}
                <Card variant={cardVariant}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tx(
                      'member.progress.classBreakdown',
                      'Class Types Breakdown'
                    )}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          border: `1px solid ${gridColor}`,
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: chartColor }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Bar Chart - Workouts by Category */}
              <Card variant={cardVariant}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tx(
                    'member.progress.workoutsByCategory',
                    'Workouts by Category'
                  )}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis stroke={chartColor} dataKey="category" />
                    <YAxis stroke={chartColor} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${gridColor}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: chartColor }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Measurements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tx('member.progress.measurements', 'Measurements')}
                </h2>
                <Button
                  onClick={() => setShowMeasurementForm(true)}
                  icon={Plus}
                  variant="secondary"
                >
                  {tx('member.progress.logToday', 'Log Today')}
                </Button>
              </div>

              <Card variant={cardVariant}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={`border-b ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.date', 'Date')}
                        </th>
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.weight', 'Weight')}
                        </th>
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.bodyFat', 'Body Fat')}
                        </th>
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.chest', 'Chest')}
                        </th>
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.waist', 'Waist')}
                        </th>
                        <th
                          className={`px-4 py-3 text-left font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {tx('member.progress.hips', 'Hips')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((m) => (
                        <motion.tr
                          key={m.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b ${
                            isDark
                              ? 'border-gray-700 hover:bg-gray-800/30'
                              : 'border-gray-200 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {m.date}
                          </td>
                          <td
                            className={`px-4 py-3 font-semibold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {m.weight} lbs
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {m.bodyFat}%
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {m.chest}"
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {m.waist}"
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {m.hips}"
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Milestones Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {tx('member.progress.milestones', 'Milestones')}
              </h2>

              <Card variant={cardVariant}>
                <div className="space-y-6">
                  {milestones.map((milestone, idx) => {
                    const Icon = milestone.icon;

                    return (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="flex gap-4">
                          {/* Timeline line */}
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                milestone.completed
                                  ? 'bg-accent text-white'
                                  : isDark
                                    ? 'bg-gray-700 text-gray-400'
                                    : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {milestone.completed ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </motion.div>
                            {idx < milestones.length - 1 && (
                              <div
                                className={`w-1 h-12 ${
                                  milestone.completed
                                    ? 'bg-accent'
                                    : isDark
                                      ? 'bg-gray-700'
                                      : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <button
                              onClick={() =>
                                setExpandedMilestone(
                                  expandedMilestone === milestone.id
                                    ? null
                                    : milestone.id
                                )
                              }
                              className="w-full text-left"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h3
                                  className={`font-semibold ${
                                    milestone.completed
                                      ? isDark
                                        ? 'text-accent'
                                        : 'text-accent'
                                      : isDark
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                  }`}
                                >
                                  {milestone.title}
                                </h3>
                                <motion.div
                                  animate={{
                                    rotate:
                                      expandedMilestone === milestone.id
                                        ? 180
                                        : 0,
                                  }}
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 ${
                                      milestone.completed
                                        ? 'text-accent'
                                        : isDark
                                          ? 'text-gray-500'
                                          : 'text-gray-400'
                                    }`}
                                  />
                                </motion.div>
                              </div>

                              <p
                                className={`text-xs ${
                                  isDark ? 'text-gray-500' : 'text-gray-500'
                                }`}
                              >
                                {milestone.date}
                              </p>
                            </button>

                            <AnimatePresence>
                              {expandedMilestone === milestone.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2"
                                >
                                  <p
                                    className={`text-sm ${
                                      isDark
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    {milestone.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </MemberLayout>
    </>
  );
};

export default ProgressPage;
