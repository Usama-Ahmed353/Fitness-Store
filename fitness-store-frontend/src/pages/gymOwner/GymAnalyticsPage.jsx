import React, { useState, useContext, useMemo } from 'react';
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
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
} from 'recharts';
import {
  Download,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Target,
  AlertCircle,
  Clock,
  Activity,
  Eye,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock analytics data
const mockRevenueData = [
  { month: 'Jan', mRR: 18500, recurring: 15200, oneTime: 3300 },
  { month: 'Feb', mRR: 19200, recurring: 15800, oneTime: 3400 },
  { month: 'Mar', mRR: 21500, recurring: 17300, oneTime: 4200 },
  { month: 'Apr', mRR: 23100, recurring: 18900, oneTime: 4200 },
  { month: 'May', mRR: 24800, recurring: 20200, oneTime: 4600 },
  { month: 'Jun', mRR: 26300, recurring: 21500, oneTime: 4800 },
];

const mockDailyRevenueData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  revenue: Math.floor(Math.random() * 1500) + 700,
  sessions: Math.floor(Math.random() * 25) + 10,
}));

const mockRevenueBreakdown = [
  { name: 'Premium Members', value: 45, color: '#3b82f6' },
  { name: 'Standard Members', value: 35, color: '#60a5fa' },
  { name: 'Class Packages', value: 15, color: '#93c5fd' },
  { name: 'PT Sessions', value: 5, color: '#dbeafe' },
];

const mockMemberGrowthData = [
  { month: 'Jan', cumulative: 420, netNew: 12, churn: 8 },
  { month: 'Feb', cumulative: 456, netNew: 36, churn: 12 },
  { month: 'Mar', cumulative: 512, netNew: 56, churn: 15 },
  { month: 'Apr', cumulative: 598, netNew: 86, churn: 18 },
  { month: 'May', cumulative: 713, netNew: 115, churn: 22 },
  { month: 'Jun', cumulative: 847, netNew: 134, churn: 25 },
];

const mockRetentionCohort = [
  { cohort: 'Jan 2026', m1: 92, m3: 78, m6: 65, m12: null },
  { cohort: 'Feb 2026', m1: 94, m3: 81, m6: 68, m12: null },
  { cohort: 'Mar 2026', m1: 96, m3: 85, m6: null, m12: null },
  { cohort: 'Apr 2026', m1: 93, m3: null, m6: null, m12: null },
];

const mockClassAnalyticsData = [
  { class: 'Morning Cardio', attendance: 94, capacity: 30, popular: 1 },
  { class: 'Strength Training', attendance: 90, capacity: 20, popular: 2 },
  { class: 'Evening Yoga', attendance: 68, capacity: 25, popular: 5 },
  { class: 'Pilates', attendance: 85, capacity: 24, popular: 3 },
  { class: 'Swimming', attendance: 72, capacity: 18, popular: 4 },
];

const mockPeakHoursData = [
  { hour: '6AM', mon: 18, tue: 15, wed: 22, thu: 16, fri: 28, sat: 25, sun: 12 },
  { hour: '9AM', mon: 12, tue: 14, wed: 11, thu: 13, fri: 15, sat: 32, sun: 28 },
  { hour: '12PM', mon: 8, tue: 7, wed: 9, thu: 8, fri: 10, sat: 18, sun: 15 },
  { hour: '3PM', mon: 6, tue: 8, wed: 7, thu: 9, fri: 8, sat: 12, sun: 10 },
  { hour: '5PM', mon: 35, tue: 32, wed: 38, thu: 36, fri: 41, sat: 15, sun: 12 },
  { hour: '8PM', mon: 22, tue: 24, wed: 20, thu: 25, fri: 28, sat: 8, sun: 6 },
];

const mockAgeDistribution = [
  { range: '18-25', count: 124, percentage: 15 },
  { range: '26-35', count: 285, percentage: 34 },
  { range: '36-45', count: 256, percentage: 30 },
  { range: '46-55', count: 145, percentage: 17 },
  { range: '55+', count: 37, percentage: 4 },
];

const mockInstructorPerformance = [
  { name: 'Sarah Johnson', avgAttendance: 94, rating: 4.8, sessions: 52, satisfaction: 96 },
  { name: 'Mike Chen', avgAttendance: 90, rating: 4.7, sessions: 48, satisfaction: 94 },
  { name: 'Emma Wilson', avgAttendance: 75, rating: 4.5, sessions: 35, satisfaction: 88 },
];

const mockAtRiskMembers = [
  { id: 1, name: 'John Smith', lastVisit: '2026-03-10', daysSince: 14, isPremium: true },
  { id: 2, name: 'Sarah Lee', lastVisit: '2026-03-09', daysSince: 15, isPremium: false },
  { id: 3, name: 'Mike Johnson', lastVisit: '2026-03-05', daysSince: 19, isPremium: true },
  { id: 4, name: 'Emily Davis', lastVisit: '2026-03-02', daysSince: 22, isPremium: false },
];

const GymAnalyticsPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [dateRange, setDateRange] = useState('thisMonth');
  const [customDateStart, setCustomDateStart] = useState('2026-03-01');
  const [customDateEnd, setCustomDateEnd] = useState('2026-03-24');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    revenue: true,
    members: true,
    classes: true,
    operations: true,
  });

  const dateRangePresets = {
    thisMonth: { label: 'This Month', days: 24 },
    lastMonth: { label: 'Last Month', days: 29 },
    thisQuarter: { label: 'This Quarter', days: 84 },
    lastQuarter: { label: 'Last Quarter', days: 92 },
    ytd: { label: 'Year-to-Date', days: 84 },
    lastYear: { label: 'Last Year', days: 365 },
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExportCSV = (sectionName) => {
    console.log(`Exporting ${sectionName} as CSV`);
    alert(`CSV export started for ${sectionName} section`);
  };

  const handleGenerateFullReport = () => {
    console.log('Generating full PDF report');
    alert('PDF report generation started. Download will begin shortly.');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics</h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Revenue, membership, class performance & facility insights
              </p>
            </div>
            <button
              onClick={handleGenerateFullReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <FileText size={20} />
              Generate Report
            </button>
          </div>

          {/* Date Range Selector */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold">Date Range:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dateRangePresets).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setDateRange(key)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      dateRange === key
                        ? 'bg-blue-600 text-white'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Custom Date */}
              {dateRange === 'custom' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className={`px-3 py-1 rounded-lg text-xs border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                    }`}
                  />
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className={`px-3 py-1 rounded-lg text-xs border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                    }`}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 ml-auto text-sm">
                <input
                  type="checkbox"
                  checked={compareEnabled}
                  onChange={(e) => setCompareEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Compare to previous period</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Revenue Analytics Section */}
        <AnalyticsSection
          title="Revenue Analytics"
          section="revenue"
          expanded={expandedSections.revenue}
          onToggle={toggleSection}
          isDark={isDark}
          onExport={() => handleExportCSV('Revenue')}
        >
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard
                label="MRR"
                value="$26,300"
                change="+6.0%"
                positive
                isDark={isDark}
                icon={<DollarSign size={24} />}
              />
              <KPICard
                label="ARPU"
                value="$126.45"
                change="+3.2%"
                positive
                isDark={isDark}
                icon={<TrendingUp size={24} />}
              />
              <KPICard
                label="Payment Failures"
                value="2.3%"
                change="-0.5%"
                positive
                isDark={isDark}
                icon={<AlertCircle size={24} />}
              />
              <KPICard
                label="Avg Renewal Amt"
                value="$89.50"
                change="+2.1%"
                positive
                isDark={isDark}
                icon={<Calendar size={24} />}
              />
            </div>

            {/* MRR Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Monthly Recurring Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#666'} />
                  <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="recurring" fill="#3b82f6" stroke="#3b82f6" />
                  <Bar dataKey="oneTime" fill="#60a5fa" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue Breakdown & Daily Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Revenue Breakdown by Membership Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockRevenueBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {mockRevenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  {mockRevenueBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Daily Revenue Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Daily Revenue (Last 30 Days)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#666'} hide />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Upcoming Renewals Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Upcoming Renewals (Next 30 Days)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Member</th>
                      <th className="px-6 py-3 text-left font-bold">Plan</th>
                      <th className="px-6 py-3 text-left font-bold">Renewal Date</th>
                      <th className="px-6 py-3 text-right font-bold">Amount</th>
                      <th className="px-6 py-3 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { member: 'Alice Cooper', plan: 'Premium', date: '2026-03-28', amount: 99.99, status: 'Confirmed' },
                      {
                        member: 'Bob Johnson',
                        plan: 'Standard',
                        date: '2026-03-29',
                        amount: 49.99,
                        status: 'Confirmed',
                      },
                      { member: 'Carol Davis', plan: 'Premium', date: '2026-04-01', amount: 99.99, status: 'At Risk' },
                      {
                        member: 'David Miller',
                        plan: 'Standard',
                        date: '2026-04-05',
                        amount: 49.99,
                        status: 'Confirmed',
                      },
                    ].map((renewal, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4">{renewal.member}</td>
                        <td className="px-6 py-4">{renewal.plan}</td>
                        <td className="px-6 py-4">{renewal.date}</td>
                        <td className="px-6 py-4 text-right font-semibold">${renewal.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              renewal.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {renewal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </AnalyticsSection>

        {/* Member Analytics Section */}
        <AnalyticsSection
          title="Member Analytics"
          section="members"
          expanded={expandedSections.members}
          onToggle={toggleSection}
          isDark={isDark}
          onExport={() => handleExportCSV('Members')}
        >
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard
                label="Total Members"
                value="847"
                change="+15.8%"
                positive
                isDark={isDark}
                icon={<Users size={24} />}
              />
              <KPICard
                label="Churn Rate"
                value="3.2%"
                change="-1.1%"
                positive
                isDark={isDark}
                icon={<TrendingUp size={24} />}
              />
              <KPICard
                label="Avg. Retention"
                value="88.2%"
                change="+2.3%"
                positive
                isDark={isDark}
                icon={<Target size={24} />}
              />
              <KPICard
                label="NPS"
                value="72"
                change="+8 pts"
                positive
                isDark={isDark}
                icon={<Activity size={24} />}
              />
            </div>

            {/* Member Growth & Churn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Member Growth (Cumulative + Net New)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={mockMemberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#666'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} yAxisId="left" />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Bar yAxisId="right" dataKey="netNew" fill="#10b981" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Churn Rate */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Churn Waterfall</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockMemberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#666'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="netNew" fill="#10b981" name="New Members" />
                    <Bar dataKey="churn" fill="#ef4444" name="Churned Members" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Retention Cohort Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Member Retention Cohort (%)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Cohort</th>
                      <th className="px-6 py-3 text-center font-bold">Month 1</th>
                      <th className="px-6 py-3 text-center font-bold">Month 3</th>
                      <th className="px-6 py-3 text-center font-bold">Month 6</th>
                      <th className="px-6 py-3 text-center font-bold">Month 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRetentionCohort.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold">{row.cohort}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            {row.m1}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.m3 ? (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                              {row.m3}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.m6 ? (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                              {row.m6}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.m12 ? (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                              {row.m12}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Age Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-sm font-bold mb-4">Age Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockAgeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="range" stroke={isDark ? '#9ca3af' : '#666'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Gender Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-sm font-bold mb-4">Gender Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Female', value: 45, color: '#ec4899' },
                        { name: 'Male', value: 52, color: '#3b82f6' },
                        { name: 'Other', value: 3, color: '#10b981' },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Female', value: 45, color: '#ec4899' },
                        { name: 'Male', value: 52, color: '#3b82f6' },
                        { name: 'Other', value: 3, color: '#10b981' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Goals Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-sm font-bold mb-4">Fitness Goals</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { goal: 'Weight Loss', percent: 35, color: 'bg-red-500' },
                    { goal: 'Build Muscle', percent: 32, color: 'bg-blue-500' },
                    { goal: 'Endurance', percent: 18, color: 'bg-green-500' },
                    { goal: 'Flexibility', percent: 15, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.goal}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{item.goal}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Fitness Level */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-sm font-bold mb-4">Fitness Level</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { level: 'Beginner', percent: 28, color: 'bg-green-500' },
                    { level: 'Intermediate', percent: 48, color: 'bg-blue-500' },
                    { level: 'Advanced', percent: 20, color: 'bg-purple-500' },
                    { level: 'Elite', percent: 4, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{item.level}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </AnalyticsSection>

        {/* Class Analytics Section */}
        <AnalyticsSection
          title="Class Analytics"
          section="classes"
          expanded={expandedSections.classes}
          onToggle={toggleSection}
          isDark={isDark}
          onExport={() => handleExportCSV('Classes')}
        >
          <div className="space-y-6">
            {/* Class Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Most Popular Classes</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Rank</th>
                      <th className="px-6 py-3 text-left font-bold">Class</th>
                      <th className="px-6 py-3 text-center font-bold">Attendance Rate</th>
                      <th className="px-6 py-3 text-center font-bold">Capacity</th>
                      <th className="px-6 py-3 text-center font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClassAnalyticsData.map((cls, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-bold">#{cls.popular}</td>
                        <td className="px-6 py-4">{cls.class}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className={`h-2 w-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                              <div
                                className={`h-full rounded-full ${
                                  cls.attendance >= 90
                                    ? 'bg-green-500'
                                    : cls.attendance >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${cls.attendance}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold">{cls.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">{cls.capacity}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              cls.attendance >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {cls.attendance >= 80 ? 'Hot' : 'Warm'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Busiest Time Slots Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Peak Hours Heatmap (Members by Hour × Day)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left font-bold">Hour</th>
                      <th className="px-4 py-2 text-center font-bold">Mon</th>
                      <th className="px-4 py-2 text-center font-bold">Tue</th>
                      <th className="px-4 py-2 text-center font-bold">Wed</th>
                      <th className="px-4 py-2 text-center font-bold">Thu</th>
                      <th className="px-4 py-2 text-center font-bold">Fri</th>
                      <th className="px-4 py-2 text-center font-bold">Sat</th>
                      <th className="px-4 py-2 text-center font-bold">Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPeakHoursData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 font-semibold">{row.hour}</td>
                        {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat, row.sun].map((val, i) => {
                          const maxVal = 41;
                          const intensity = val / maxVal;
                          return (
                            <td
                              key={i}
                              className="px-4 py-2 text-center font-bold text-white rounded"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                              }}
                            >
                              {val}
                            </td>
                          );
                        })}
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
              transition={{ delay: 0.2 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <h4 className="text-lg font-bold mb-4">Instructor Performance</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Instructor</th>
                      <th className="px-6 py-3 text-center font-bold">Avg Attendance</th>
                      <th className="px-6 py-3 text-center font-bold">Rating</th>
                      <th className="px-6 py-3 text-center font-bold">Sessions</th>
                      <th className="px-6 py-3 text-center font-bold">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInstructorPerformance.map((instructor, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold">{instructor.name}</td>
                        <td className="px-6 py-4 text-center">{instructor.avgAttendance}%</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                            ⭐ {instructor.rating}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">{instructor.sessions}</td>
                        <td className="px-6 py-4 text-center">
                          <div className={`h-2 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} mx-auto`}>
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{ width: `${instructor.satisfaction}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </AnalyticsSection>

        {/* Operational Analytics Section */}
        <AnalyticsSection
          title="Operational Analytics"
          section="operations"
          expanded={expandedSections.operations}
          onToggle={toggleSection}
          isDark={isDark}
          onExport={() => handleExportCSV('Operations')}
        >
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard
                label="Avg Visits/Week"
                value="2.4"
                change="+0.3"
                positive
                isDark={isDark}
                icon={<Activity size={24} />}
              />
              <KPICard
                label="Check-in Frequency"
                value="68%"
                change="+5%"
                positive
                isDark={isDark}
                icon={<Clock size={24} />}
              />
              <KPICard
                label="Peak Hour Capacity"
                value="87%"
                change="-2%"
                positive={false}
                isDark={isDark}
                icon={<Eye size={24} />}
              />
              <KPICard
                label="At-Risk Members"
                value="12"
                change="+2"
                positive={false}
                isDark={isDark}
                icon={<AlertCircle size={24} />}
              />
            </div>

            {/* Check-in Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Check-in Frequency Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { range: '0-1x', count: 45 },
                      { range: '2-3x', count: 125 },
                      { range: '4-5x', count: 310 },
                      { range: '6-7x', count: 278 },
                      { range: '8+x', count: 89 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="range" stroke={isDark ? '#9ca3af' : '#666'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Facility Utilization */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } p-6`}
              >
                <h4 className="text-lg font-bold mb-4">Facility Utilization by Time Slot</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockPeakHoursData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="hour" stroke={isDark ? '#9ca3af' : '#666'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="fri" fill="#10b981" name="Peak Day (Fri)" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* At-Risk Members */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">Members at Risk (No check-in 14+ days)</h4>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                  Launch Campaign
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left font-bold">Member</th>
                      <th className="px-6 py-3 text-left font-bold">Last Visit</th>
                      <th className="px-6 py-3 text-center font-bold">Days Inactive</th>
                      <th className="px-6 py-3 text-center font-bold">Membership</th>
                      <th className="px-6 py-3 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAtRiskMembers.map((member, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold">{member.name}</td>
                        <td className="px-6 py-4">{member.lastVisit}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              member.daysSince >= 21
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {member.daysSince}d
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-xs font-bold ${
                              member.isPremium ? 'text-blue-600' : 'text-gray-600'
                            }`}
                          >
                            {member.isPremium ? 'Premium' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700">
                            Send Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </AnalyticsSection>
      </div>
    </div>
  );
};

// Helper Components
const AnalyticsSection = ({
  title,
  section,
  expanded,
  onToggle,
  isDark,
  onExport,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border mb-6`}
    >
      {/* Header */}
      <button
        onClick={() => onToggle(section)}
        className={`w-full px-6 py-4 flex items-center justify-between hover:${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        } transition-colors`}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
            }`}
            title="Export as CSV"
          >
            <Download size={18} className="text-blue-600" />
          </button>
          {expanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-6`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KPICard = ({ label, value, change, positive, isDark, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } p-4`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </span>
        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className={positive ? 'text-green-600' : 'text-red-600'}>{icon}</div>
        </div>
      </div>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p
        className={`text-xs font-semibold ${
          positive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {positive ? '↑' : '↓'} {change} vs last period
      </p>
    </motion.div>
  );
};

export default GymAnalyticsPage;
