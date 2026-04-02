import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  Star,
  Clock,
  AlertTriangle,
  Zap,
  Plus,
  MessageSquare,
  Dumbbell,
  Mail,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  LogIn,
  BookOpen,
  XCircle,
  Bell,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const chartData = [
  { date: 'Mar 1', revenue: 1240, members: 8, classes: 12 },
  { date: 'Mar 2', revenue: 1320, members: 5, classes: 11 },
  { date: 'Mar 3', revenue: 980, members: 3, classes: 10 },
  { date: 'Mar 4', revenue: 2290, members: 12, classes: 14 },
  { date: 'Mar 5', revenue: 2000, members: 10, classes: 13 },
  { date: 'Mar 6', revenue: 2181, members: 9, classes: 12 },
  { date: 'Mar 7', revenue: 2500, members: 14, classes: 15 },
  { date: 'Mar 8', revenue: 2100, members: 11, classes: 13 },
  { date: 'Mar 9', revenue: 2200, members: 9, classes: 14 },
  { date: 'Mar 10', revenue: 2290, members: 13, classes: 16 },
];

const recentActivity = [
  {
    id: 1,
    member: 'Sarah Johnson',
    action: 'checked in',
    time: '2 hours ago',
    icon: LogIn,
    color: 'blue',
  },
  {
    id: 2,
    member: 'Mike Chen',
    action: 'joined',
    time: '4 hours ago',
    icon: Users,
    color: 'green',
  },
  {
    id: 3,
    member: 'Emma Wilson',
    action: 'booked class',
    time: '6 hours ago',
    icon: BookOpen,
    color: 'purple',
  },
  {
    id: 4,
    member: 'David Brown',
    action: 'canceled class',
    time: '8 hours ago',
    icon: XCircle,
    color: 'red',
  },
  {
    id: 5,
    member: 'Jessica Lee',
    action: 'left review',
    time: '1 day ago',
    icon: Star,
    color: 'yellow',
  },
  {
    id: 6,
    member: 'Chris Martinez',
    action: 'checked in',
    time: '1 day ago',
    icon: LogIn,
    color: 'blue',
  },
  {
    id: 7,
    member: 'Anna Taylor',
    action: 'booked class',
    time: '2 days ago',
    icon: BookOpen,
    color: 'purple',
  },
  {
    id: 8,
    member: 'Robert Wilson',
    action: 'left review',
    time: '2 days ago',
    icon: Star,
    color: 'yellow',
  },
  {
    id: 9,
    member: 'Lisa Anderson',
    action: 'joined',
    time: '3 days ago',
    icon: Users,
    color: 'green',
  },
  {
    id: 10,
    member: 'James Davis',
    action: 'checked in',
    time: '3 days ago',
    icon: LogIn,
    color: 'blue',
  },
];

const todaySchedule = [
  { time: '06:00', class: 'Morning Cardio', instructor: 'Sarah', booked: 28, capacity: 30 },
  { time: '08:00', class: 'Strength Training', instructor: 'Mike', booked: 18, capacity: 20 },
  { time: '10:00', class: 'Yoga Flow', instructor: 'Emma', booked: 22, capacity: 25 },
  { time: '14:00', class: 'HIIT Training', instructor: 'Alex', booked: 15, capacity: 25 },
  { time: '17:00', class: 'Evening Yoga', instructor: 'Sophie', booked: 3, capacity: 20 },
  { time: '18:00', class: 'Spinning', instructor: 'Tom', booked: 24, capacity: 24 },
];

const alerts = [
  {
    id: 1,
    type: 'invoice',
    message: 'Invoice due from John Smith ($49)',
    date: 'Today',
    priority: 'high',
  },
  {
    id: 2,
    type: 'trainer',
    message: '2 pending trainer applications',
    date: 'Today',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'class',
    message: 'Evening Yoga has low bookings (15% capacity)',
    date: 'Today',
    priority: 'low',
  },
  {
    id: 4,
    type: 'member',
    message: '3 members expire this week',
    date: 'Tomorrow',
    priority: 'high',
  },
];

const GymDashboardPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [chartMetric, setChartMetric] = useState('revenue');
  const [chartPeriod, setChartPeriod] = useState('30d');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const kpiCards = [
    {
      title: 'Active Members',
      value: '847',
      change: '+12 this month',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: '+8.2% vs last month',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Classes This Week',
      value: '42',
      change: '94% attendance',
      trend: 'up',
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'Training Hours',
      value: '128',
      change: '+5 hours vs last week',
      trend: 'up',
      icon: Dumbbell,
      color: 'orange',
    },
    {
      title: 'Check-in Rate',
      value: '78%',
      change: '+3% vs last week',
      trend: 'up',
      icon: LogIn,
      color: 'indigo',
    },
    {
      title: 'Member Retention',
      value: '92%',
      change: '+1% vs last month',
      trend: 'up',
      icon: Users,
      color: 'pink',
    },
    {
      title: 'Average Rating',
      value: '4.8/5',
      change: '142 reviews',
      trend: 'up',
      icon: Star,
      color: 'yellow',
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: 'Last 24 hours',
      trend: 'down',
      icon: MessageSquare,
      color: 'cyan',
    },
  ];

  const quickActions = [
    { title: 'Add Member', icon: Plus, color: 'blue', href: '/gym-owner/members/add' },
    { title: 'Create Class', icon: Calendar, color: 'purple', href: '/gym-owner/classes/create' },
    { title: 'Add Trainer', icon: Dumbbell, color: 'orange', href: '/gym-owner/trainers/add' },
    { title: 'Send Announcement', icon: Mail, color: 'green', href: '/gym-owner/marketing/announce' },
    { title: 'View Reports', icon: BarChart3, color: 'indigo', href: '/gym-owner/analytics' },
    { title: 'Manage Subscription', icon: Settings, color: 'red', href: '/gym-owner/subscription' },
  ];

  const colorMap = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    green: 'from-green-500 to-green-600 text-green-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100',
    orange: 'from-orange-500 to-orange-600 text-orange-100',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-100',
    pink: 'from-pink-500 to-pink-600 text-pink-100',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-100',
    cyan: 'from-cyan-500 to-cyan-600 text-cyan-100',
    red: 'from-red-500 to-red-600 text-red-100',
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Good morning, John! 👋
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's <span className="font-semibold">FitLife Gym</span> today • {today}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Today's Check-ins
              </p>
              <p className="text-3xl font-bold mt-2">324</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                ↓ 8% from yesterday
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Classes Running Today
              </p>
              <p className="text-3xl font-bold mt-2">6</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                All on schedule ✓
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Open Class Bookings
              </p>
              <p className="text-3xl font-bold mt-2">18</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Mostly evening slots
              </p>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colorMap[card.color]}`}>
                      <Icon size={20} />
                    </div>
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="text-green-500" size={18} />
                    ) : (
                      <ArrowDownRight className="text-blue-500" size={18} />
                    )}
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {card.change}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Revenue Overview</h3>
              <div className="flex gap-2">
                <select
                  value={chartMetric}
                  onChange={(e) => setChartMetric(e.target.value)}
                  className={`px-3 py-1 rounded text-sm border ${
                    isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300'
                  }`}
                >
                  <option value="revenue">Revenue</option>
                  <option value="members">New Members</option>
                  <option value="classes">Classes</option>
                </select>
                <select
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value)}
                  className={`px-3 py-1 rounded text-sm border ${
                    isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300'
                  }`}
                >
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="6m">Last 6 months</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#666'} />
                <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '8px',
                  }}
                />
                {chartMetric === 'revenue' && <Bar dataKey="revenue" fill="#3b82f6" />}
                {chartMetric === 'members' && <Bar dataKey="members" fill="#10b981" />}
                {chartMetric === 'classes' && <Bar dataKey="classes" fill="#8b5cf6" />}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((schedule, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{schedule.class}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {schedule.time} • {schedule.instructor}
                      </p>
                    </div>
                    <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Check-in
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(schedule.booked / schedule.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold">{schedule.booked}/{schedule.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity & Alerts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Recent Member Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const ActivityIcon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${colorMap[activity.color]}`}>
                      <ActivityIcon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{activity.member}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.action} • {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Alerts & Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Alerts & Tasks</h3>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const priorityColor =
                  alert.priority === 'high' ? 'red' : alert.priority === 'medium' ? 'yellow' : 'blue';
                const Icon = alert.priority === 'high' ? AlertTriangle : AlertCircle;

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === 'high'
                        ? isDark
                          ? 'bg-red-900/20 border-red-900 border-l-red-600'
                          : 'bg-red-50 border-red-200 border-l-red-600'
                        : alert.priority === 'medium'
                        ? isDark
                          ? 'bg-yellow-900/20 border-yellow-900 border-l-yellow-600'
                          : 'bg-yellow-50 border-yellow-200 border-l-yellow-600'
                        : isDark
                        ? 'bg-blue-900/20 border-blue-900 border-l-blue-600'
                        : 'bg-blue-50 border-blue-200 border-l-blue-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={18} className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{alert.message}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {alert.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={idx}
                  href={action.href}
                  whileHover={{ y: -5 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-lg border p-4 text-center transition-colors`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[action.color]} mx-auto mb-3 w-fit`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-sm font-semibold">{action.title}</p>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GymDashboardPage;
