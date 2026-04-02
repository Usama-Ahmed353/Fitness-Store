import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  MoreVertical,
  TrendingDown,
  TrendingUp,
  X,
  DollarSign,
  Users,
  Activity,
  BarChart3,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock MRR Data
const mockMRRData = [
  { month: 'Jan', amount: 45000, previous: 42000 },
  { month: 'Feb', amount: 48500, previous: 45000 },
  { month: 'Mar', amount: 52000, previous: 48500 },
  { month: 'Apr', amount: 55200, previous: 52000 },
  { month: 'May', amount: 58900, previous: 55200 },
  { month: 'Jun', amount: 62400, previous: 58900 },
];

// Mock Revenue by Gym
const revenueByGym = [
  { gym: 'NYC Downtown', revenue: 18500, percentage: 30 },
  { gym: 'Brooklyn Elite', revenue: 15200, percentage: 24 },
  { gym: 'Manhattan CrossFit', revenue: 16800, percentage: 27 },
  { gym: 'Queens Fitness', revenue: 10900, percentage: 17 },
];

// Mock Revenue by Plan
const revenueByPlan = [
  { plan: 'Starter', revenue: 14200, color: '#9ca3af' },
  { plan: 'Professional', revenue: 28500, color: '#3b82f6' },
  { plan: 'Enterprise', revenue: 19700, color: '#8b5cf6' },
];

// Mock New Subscriptions Trend
const newSubscriptionsTrend = [
  { week: 'Week 1', subscriptions: 45, trials: 32, conversions: 14 },
  { week: 'Week 2', subscriptions: 52, trials: 38, conversions: 18 },
  { week: 'Week 3', subscriptions: 48, trials: 35, conversions: 16 },
  { week: 'Week 4', subscriptions: 61, trials: 42, conversions: 22 },
  { week: 'Week 5', subscriptions: 58, trials: 40, conversions: 20 },
  { week: 'Week 6', subscriptions: 67, trials: 46, conversions: 25 },
];

// Mock Churn Rate
const churnRateData = [
  { month: 'Jan', churnRate: 4.2, subscribers: 2450 },
  { month: 'Feb', churnRate: 3.8, subscribers: 2480 },
  { month: 'Mar', churnRate: 3.5, subscribers: 2520 },
  { month: 'Apr', churnRate: 3.2, subscribers: 2580 },
  { month: 'May', churnRate: 3.1, subscribers: 2650 },
  { month: 'Jun', churnRate: 2.9, subscribers: 2730 },
];

// Mock Most Attended Classes
const mostAttendedClasses = [
  { name: 'Morning HIIT', attended: 245, capacity: 270, rate: 91 },
  { name: 'Yoga Flow', attended: 198, capacity: 210, rate: 94 },
  { name: 'Spin Class', attended: 287, capacity: 320, rate: 90 },
  { name: 'CrossFit WOD', attended: 156, capacity: 180, rate: 87 },
  { name: 'Boxing Fundamentals', attended: 102, capacity: 120, rate: 85 },
];

// Mock Instructor Performance
const instructorPerformance = [
  { name: 'Mike Davis', avgAttendance: 92, classes: 32, rating: 4.8 },
  { name: 'Emma Wilson', avgAttendance: 94, classes: 28, rating: 4.9 },
  { name: 'Lisa Chen', avgAttendance: 90, classes: 35, rating: 4.7 },
  { name: 'Alex Rodriguez', avgAttendance: 87, classes: 40, rating: 4.6 },
  { name: 'John Smith', avgAttendance: 85, classes: 25, rating: 4.5 },
];

// Mock Attendance by Day
const attendanceByDay = [
  { day: 'Monday', classes: 18, attended: 156, capacity: 180, rate: 87 },
  { day: 'Tuesday', classes: 17, attended: 148, capacity: 170, rate: 87 },
  { day: 'Wednesday', classes: 19, attended: 178, capacity: 200, rate: 89 },
  { day: 'Thursday', classes: 17, attended: 142, capacity: 165, rate: 86 },
  { day: 'Friday', classes: 20, attended: 192, capacity: 220, rate: 87 },
  { day: 'Saturday', classes: 15, attended: 165, capacity: 180, rate: 92 },
  { day: 'Sunday', classes: 12, attended: 108, capacity: 120, rate: 90 },
];

// Mock Daily Class Data
const dailyClassData = [
  { day: 'Mon', classes: 18, attendees: 156 },
  { day: 'Tue', classes: 17, attendees: 148 },
  { day: 'Wed', classes: 19, attendees: 178 },
  { day: 'Thu', classes: 17, attendees: 142 },
  { day: 'Fri', classes: 20, attendees: 192 },
  { day: 'Sat', classes: 15, attendees: 165 },
  { day: 'Sun', classes: 12, attendees: 108 },
];

// Mock Peak Hours
const peakHours = [
  { time: '6-7 AM', count: 245 },
  { time: '7-8 AM', count: 321 },
  { time: '12-1 PM', count: 189 },
  { time: '5-6 PM', count: 387 },
  { time: '6-7 PM', count: 412 },
  { time: '7-8 PM', count: 356 },
];

// Mock Gym Performance
const gymPerformance = [
  { gym: 'NYC Downtown', revenue: 18500, members: 580, classes: 85, avgRating: 4.6 },
  { gym: 'Brooklyn Elite', revenue: 15200, members: 420, classes: 62, avgRating: 4.5 },
  { gym: 'Manhattan CrossFit', revenue: 16800, members: 520, classes: 78, avgRating: 4.7 },
  { gym: 'Queens Fitness', revenue: 10900, members: 310, classes: 45, avgRating: 4.3 },
];

const ReportsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('financial');
  const [dateRange, setDateRange] = useState('this-month');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [compareToggle, setCompareToggle] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2024-03-01');
  const [customEndDate, setCustomEndDate] = useState('2024-03-31');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportEmail, setExportEmail] = useState('');

  const datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last Quarter', value: 'last-quarter' },
    { label: 'YTD', value: 'ytd' },
    { label: 'Custom', value: 'custom' },
  ];

  const currentDateLabel = datePresets.find((p) => p.value === dateRange)?.label || 'Custom';

  // Mock KPI Data
  const financialKPIs = [
    {
      label: 'MRR',
      value: '$62,400',
      change: '+8.2%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'ARR',
      value: '$748,800',
      change: '+12.5%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'ARPU',
      value: '$229',
      change: '+4.1%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Payment Success Rate',
      value: '98.7%',
      change: '+0.3%',
      isPositive: true,
      icon: BarChart3,
    },
  ];

  const membershipKPIs = [
    {
      label: 'Total Members',
      value: '2,730',
      change: '+3.1%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Trial to Paid Conversion',
      value: '52.3%',
      change: '+5.2%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'LTV',
      value: '$1,240',
      change: '-1.8%',
      isPositive: false,
      icon: DollarSign,
    },
    {
      label: 'Churn Rate',
      value: '2.9%',
      change: '-0.2%',
      isPositive: true,
      icon: TrendingDown,
    },
  ];

  const attendanceKPIs = [
    {
      label: 'Total Classes',
      value: '118',
      change: '+8.1%',
      isPositive: true,
      icon: Activity,
    },
    {
      label: 'Avg Attendance',
      value: '1,092',
      change: '+6.4%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Capacity Utilization',
      value: '88.3%',
      change: '+2.1%',
      isPositive: true,
      icon: BarChart3,
    },
    {
      label: 'Peak Hour Bookings',
      value: '412',
      change: '+12.3%',
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  const gymKPIs = [
    {
      label: 'Total Revenue',
      value: '$61,400',
      change: '+9.2%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Avg Gym Rating',
      value: '4.5',
      change: '+0.2',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'Total Members',
      value: '1,830',
      change: '+5.3%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Classes Offered',
      value: '270',
      change: '+7.5%',
      isPositive: true,
      icon: Activity,
    },
  ];

  const getKPIs = () => {
    switch (activeTab) {
      case 'financial':
        return financialKPIs;
      case 'membership':
        return membershipKPIs;
      case 'attendance':
        return attendanceKPIs;
      case 'gym':
        return gymKPIs;
      default:
        return financialKPIs;
    }
  };

  const handleApplyCustomDate = () => {
    setDateRange('custom');
    setShowCustomDateModal(false);
  };

  const generateCSVData = () => {
    let csvContent = 'Report Name,Period,Value,Unit\n';

    if (activeTab === 'financial') {
      csvContent += 'MRR,Current,$62400,USD\n';
      csvContent += 'ARR,Current,$748800,USD\n';
      csvContent += 'ARPU,Current,$229,USD\n';
      csvContent += 'Payment Success Rate,Current,98.7,%\n';
      csvContent += '\nRevenue by Gym,,,\n';
      revenueByGym.forEach((item) => {
        csvContent += `${item.gym},$${item.revenue},${item.percentage}%\n`;
      });
    } else if (activeTab === 'membership') {
      csvContent += 'Total Members,Current,2730,Count\n';
      csvContent += 'Trial to Paid Conversion,Current,52.3,%\n';
      csvContent += 'LTV,Current,$1240,USD\n';
      csvContent += 'Churn Rate,Current,2.9,%\n';
      csvContent += '\nSubscription Trend,,,\n';
      newSubscriptionsTrend.forEach((item) => {
        csvContent += `${item.week},${item.subscriptions},${item.conversions}\n`;
      });
    } else if (activeTab === 'attendance') {
      csvContent += 'Total Classes,Current,118,Count\n';
      csvContent += 'Avg Attendance,Current,1092,Count\n';
      csvContent += 'Capacity Utilization,Current,88.3,%\n';
      csvContent += '\nDaily Attendance,,,\n';
      dailyClassData.forEach((item) => {
        csvContent += `${item.day},${item.classes},${item.attendees}\n`;
      });
    } else if (activeTab === 'gym') {
      csvContent += 'Total Revenue,Current,$61400,USD\n';
      csvContent += 'Avg Gym Rating,Current,4.5,Stars\n';
      csvContent += '\nGym Performance,,,\n';
      gymPerformance.forEach((item) => {
        csvContent += `${item.gym},$${item.revenue},${item.members},${item.classes}\n`;
      });
    }

    return csvContent;
  };

  const handleExportCSV = () => {
    const csvData = generateCSVData();
    const element = document.createElement('a');
    const file = new Blob([csvData], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `Report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowExportModal(false);
  };

  const handleExportPDF = () => {
    // PDF export would require jsPDF or pdfkit
    // For now, showing a placeholder notification
    alert('PDF export with embedded charts - Feature ready for jsPDF/html2pdf library integration');
    setShowExportModal(false);
  };

  const handleEmailExport = () => {
    if (!exportEmail || !exportEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address');
      return;
    }
    // Send email functionality - would integrate with backend email service
    alert(`Report scheduled to be emailed to ${exportEmail}`);
    setShowExportModal(false);
    setExportEmail('');
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
              <h1 className="text-2xl font-bold">Reports & Analytics</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowExportModal(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isDark ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Download size={18} />
                Export Report
              </motion.button>
            </div>

            {/* Date Range & Compare Toggle */}
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Calendar size={18} />
                  {currentDateLabel}
                  <ChevronDown size={16} />
                </button>

                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-full left-0 mt-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg z-50 min-w-max`}
                  >
                    {datePresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          if (preset.value === 'custom') {
                            setShowCustomDateModal(true);
                          } else {
                            setDateRange(preset.value);
                          }
                          setShowDatePicker(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${
                          dateRange === preset.value ? 'font-semibold text-blue-500' : ''
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareToggle}
                  onChange={(e) => setCompareToggle(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Compare to Previous Period</span>
              </label>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getKPIs().map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50'} p-3 rounded-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {kpi.label}
                        </p>
                        <p className="text-lg font-bold mt-1">{kpi.value}</p>
                        <p
                          className={`text-xs font-semibold mt-1 ${
                            kpi.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {kpi.isPositive ? '↑' : '↓'} {kpi.change}
                        </p>
                      </div>
                      <Icon
                        size={20}
                        className={kpi.isPositive ? 'text-green-500' : 'text-red-500'}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-700 overflow-x-auto">
          {[
            { id: 'financial', label: 'Financial', icon: DollarSign },
            { id: 'membership', label: 'Membership', icon: Users },
            { id: 'attendance', label: 'Attendance', icon: Activity },
            { id: 'gym', label: 'Gym Performance', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'financial' && (
              <motion.div key="financial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* MRR Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">Monthly Recurring Revenue (MRR)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockMRRData}>
                      <defs>
                        <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMRR)" name="Current MRR" />
                      {compareToggle && <Area type="monotone" dataKey="previous" stroke="#10b981" strokeDasharray="5 5" name="Previous Period" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Revenue by Gym & Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by Gym */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                  >
                    <h3 className="font-semibold mb-4">Revenue by Gym</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueByGym}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                        <XAxis dataKey="gym" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#1f2937' : '#fff',
                            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          }}
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Revenue by Plan */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                  >
                    <h3 className="font-semibold mb-4">Revenue by Plan Tier</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={revenueByPlan}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ plan, percentage }) => `${plan} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {revenueByPlan.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Payment Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Payment Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Payment Success Rate', value: '98.7%', color: 'green' },
                      { label: 'Failed Payment Recovery', value: '87.3%', color: 'blue' },
                      { label: 'Refunds Issued (This Month)', value: '$2,450', color: 'orange' },
                      { label: 'Failed Transactions', value: '324', color: 'red' },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}
                      >
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                          {metric.label}
                        </p>
                        <p className="text-xl font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'membership' && (
              <motion.div key="membership" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* New Subscriptions Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">New Subscriptions & Conversions</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={newSubscriptionsTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="week" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="subscriptions" fill="#3b82f6" name="Paid Subscriptions" />
                      <Bar dataKey="trials" fill="#10b981" name="Trials Started" />
                      <Bar dataKey="conversions" fill="#f59e0b" name="Trial Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Churn Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">Churn Rate Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={churnRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                        formatter={(value) => `${value}%`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="churnRate" stroke="#ef4444" strokeWidth={2} name="Churn Rate %" />
                      <Line type="monotone" dataKey="subscribers" stroke="#3b82f6" yAxisId="right" strokeWidth={2} name="Total Subscribers" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Plan Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Member Distribution by Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { plan: 'Starter', members: 890, percentage: 33, color: '#9ca3af' },
                      { plan: 'Professional', members: 1240, percentage: 45, color: '#3b82f6' },
                      { plan: 'Enterprise', members: 600, percentage: 22, color: '#8b5cf6' },
                    ].map((item, idx) => (
                      <div key={idx} className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.plan}</h4>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                        <p className="text-lg font-bold">{item.members.toLocaleString()} members</p>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Member Metrics Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Key Membership Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Avg LTV', value: '$1,240', delta: '-1.8%' },
                      { label: 'Acquisition Cost', value: '$245', delta: '+3.2%' },
                      { label: 'CAC Payback', value: '5.1 months', delta: '-0.3' },
                      { label: 'Lifetime LTV:CAC', value: '5.1x', delta: '+0.2x' },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}
                      >
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                          {metric.label}
                        </p>
                        <p className="text-xl font-bold">{metric.value}</p>
                        <p className="text-xs text-green-600 mt-1">↑ {metric.delta}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Daily Class Attendance */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">Classes & Attendance by Day</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyClassData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} yAxisId="left" />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="classes" fill="#3b82f6" yAxisId="left" name="Classes" />
                      <Bar dataKey="attendees" fill="#10b981" yAxisId="right" name="Attendees" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Peak Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">Peak Hours by Time of Day</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                      />
                      <Bar dataKey="count" fill="#f59e0b" name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Most Attended Classes */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Most Attended Classes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="text-left py-2 font-semibold">Class Name</th>
                          <th className="text-left py-2 font-semibold">Attended</th>
                          <th className="text-left py-2 font-semibold">Capacity</th>
                          <th className="text-left py-2 font-semibold">Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mostAttendedClasses.map((cls) => (
                          <tr key={cls.name} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-3">{cls.name}</td>
                            <td className="py-3">{cls.attended}</td>
                            <td className="py-3">{cls.capacity}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${cls.rate}%` }}
                                  />
                                </div>
                                <span className="font-semibold">{cls.rate}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Instructor Performance */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Instructor Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="text-left py-2 font-semibold">Instructor</th>
                          <th className="text-left py-2 font-semibold">Avg Attendance %</th>
                          <th className="text-left py-2 font-semibold">Classes</th>
                          <th className="text-left py-2 font-semibold">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructorPerformance.map((instructor) => (
                          <tr key={instructor.name} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-3">{instructor.name}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${instructor.avgAttendance}%` }}
                                  />
                                </div>
                                <span className="font-semibold">{instructor.avgAttendance}%</span>
                              </div>
                            </td>
                            <td className="py-3">{instructor.classes}</td>
                            <td className="py-3">
                              <span className="font-semibold text-yellow-500">{instructor.rating}★</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'gym' && (
              <motion.div key="gym" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Gym Performance Table */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 text-lg">Gym Performance Overview</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                          <th className="text-left py-3 px-4 font-semibold">Gym Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                          <th className="text-left py-3 px-4 font-semibold">Members</th>
                          <th className="text-left py-3 px-4 font-semibold">Classes</th>
                          <th className="text-left py-3 px-4 font-semibold">Avg Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gymPerformance.map((gym, idx) => (
                          <tr key={idx} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-3 px-4 font-semibold">{gym.gym}</td>
                            <td className="py-3 px-4">${gym.revenue.toLocaleString()}</td>
                            <td className="py-3 px-4">{gym.members}</td>
                            <td className="py-3 px-4">{gym.classes}</td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-yellow-500">{gym.avgRating}★</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Gym Comparison Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4">Revenue Comparison by Gym</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gymPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="gym" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Member & Class Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                  >
                    <h3 className="font-semibold mb-4">Members by Gym</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={gymPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ gym, members }) => `${gym.split(' ')[0]} (${members})`}
                          outerRadius={80}
                          dataKey="members"
                        >
                          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                  >
                    <h3 className="font-semibold mb-4">Classes by Gym</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={gymPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ gym, classes }) => `${gym.split(' ')[0]} (${classes})`}
                          outerRadius={80}
                          dataKey="classes"
                        >
                          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      <AnimatePresence>
        {showCustomDateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-sm w-full p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Custom Date Range</h3>
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomDate}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Report Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-sm w-full p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Export {activeTab} Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Export Format Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Export Format</label>
                  <div className="space-y-2">
                    {[
                      { id: 'csv', label: 'CSV File', description: 'Download as CSV spreadsheet' },
                      { id: 'pdf', label: 'PDF Report', description: 'Formatted PDF with charts' },
                      { id: 'email', label: 'Email Report', description: 'Send report via email' },
                    ].map((option) => (
                      <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors" style={{
                        backgroundColor: exportFormat === option.id ? (isDark ? '#374151' : '#eff6ff') : '',
                        borderColor: exportFormat === option.id ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                      }}>
                        <input
                          type="radio"
                          name="format"
                          value={option.id}
                          checked={exportFormat === option.id}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Email Field - Only show when email format selected */}
                {exportFormat === 'email' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={exportEmail}
                      onChange={(e) => setExportEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'}`}
                    />
                  </div>
                )}

                {/* Date Range Info */}
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>
                  <p className="text-sm font-medium mb-1">Report Details</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Date Range: {currentDateLabel}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Report Type: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (exportFormat === 'csv') {
                      handleExportCSV();
                    } else if (exportFormat === 'pdf') {
                      handleExportPDF();
                    } else if (exportFormat === 'email') {
                      handleEmailExport();
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ReportsPage;
