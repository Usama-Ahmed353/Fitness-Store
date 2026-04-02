import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Database,
  Wifi,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AdminLayout from '../layouts/AdminLayout';

const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [revenueMetric, setRevenueMetric] = useState('mrr'); // mrr, subscriptions, churn

  // Mock Data
  const kpiData = [
    { label: t('admin.totalMembers') || 'Total Members', value: '2,458', trend: '+12%', icon: Users, color: 'blue' },
    { label: t('admin.totalGyms') || 'Total Gyms', value: '145', trend: '+3%', icon: Building2, color: 'green' },
    { label: t('admin.monthlyRevenue') || 'Monthly Revenue', value: '$82,450', trend: '+8.5%', icon: DollarSign, color: 'orange' },
    { label: t('admin.newSignupsWeek') || 'New Signups This Week', value: '234', trend: '+18%', icon: TrendingUp, color: 'purple' }
  ];

  const chartData = [
    { month: 'Jan', mrr: 65000, subscriptions: 1240, churn: 8 },
    { month: 'Feb', mrr: 69000, subscriptions: 1410, churn: 12 },
    { month: 'Mar', mrr: 71000, subscriptions: 1520, churn: 9 },
    { month: 'Apr', mrr: 75000, subscriptions: 1680, churn: 7 },
    { month: 'May', mrr: 72000, subscriptions: 1590, churn: 11 },
    { month: 'Jun', mrr: 78000, subscriptions: 1750, churn: 6 },
    { month: 'Jul', mrr: 82000, subscriptions: 1920, churn: 5 },
    { month: 'Aug', mrr: 79000, subscriptions: 1840, churn: 8 },
    { month: 'Sep', mrr: 84000, subscriptions: 2010, churn: 4 },
    { month: 'Oct', mrr: 81000, subscriptions: 1950, churn: 7 },
    { month: 'Nov', mrr: 86000, subscriptions: 2150, churn: 3 },
    { month: 'Dec', mrr: 82450, subscriptions: 2280, churn: 5 }
  ];

  const gymSubscriptionData = [
    { name: 'Starter', value: 85, subscribers: 428, color: '#3B82F6' },
    { name: 'Professional', value: 185, subscribers: 925, color: '#F59E0B' },
    { name: 'Enterprise', value: 310, subscribers: 1105, color: '#10B981' }
  ];

  const recentActivity = [
    { id: 1, type: 'member_joined', message: 'New member joined', detail: 'Sarah Johnson registered', time: '5 min ago', icon: Users },
    { id: 2, type: 'subscription_upgraded', message: 'Subscription upgraded', detail: 'FitZone Pro → Enterprise', time: '15 min ago', icon: TrendingUp },
    { id: 3, type: 'class_booked', message: 'Class booked', detail: '32 members booked CrossFit 101', time: '23 min ago', icon: CheckCircle },
    { id: 4, type: 'payment_failed', message: 'Payment failed', detail: 'Stripe transaction declined', time: '1 hour ago', icon: AlertCircle },
    { id: 5, type: 'trainer_verified', message: 'Trainer verified', detail: 'Coach Marcus approved', time: '2 hours ago', icon: CheckCircle }
  ];

  const pendingActions = [
    { id: 1, title: 'Gym Verification Pending', count: 8, severity: 'warning', icon: Building2, color: 'yellow' },
    { id: 2, title: 'Trainer Applications', count: 12, severity: 'info', icon: Users, color: 'blue' },
    { id: 3, title: 'Reported Reviews', count: 3, severity: 'error', icon: AlertCircle, color: 'red' },
    { id: 4, title: 'Failed Payments', count: 24, severity: 'error', icon: DollarSign, color: 'red' }
  ];

  const systemHealth = [
    { name: 'API Response Time', value: 145, unit: 'ms', target: 200, status: 'healthy', icon: Wifi },
    { name: 'Database Connections', value: 42, unit: '/100', target: 100, status: 'healthy', icon: Database },
    { name: 'Stripe Webhooks', value: '2.4h ago', unit: '', target: '', status: 'warning', icon: Activity },
    { name: 'Email Delivery Rate', value: 99.8, unit: '%', target: 99, status: 'healthy', icon: Mail }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return isDark ? 'text-green-400' : 'text-green-600';
      case 'warning': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'error': return isDark ? 'text-red-400' : 'text-red-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'healthy': return isDark ? 'bg-green-500/20' : 'bg-green-50';
      case 'warning': return isDark ? 'bg-yellow-500/20' : 'bg-yellow-50';
      case 'error': return isDark ? 'bg-red-500/20' : 'bg-red-50';
      default: return isDark ? 'bg-gray-700/30' : 'bg-gray-100';
    }
  };

  const KPICard = ({ item }) => {
    const Icon = item.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`p-6 rounded-lg border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${
            item.color === 'blue' ? (isDark ? 'bg-blue-500/20' : 'bg-blue-50') :
            item.color === 'green' ? (isDark ? 'bg-green-500/20' : 'bg-green-50') :
            item.color === 'orange' ? (isDark ? 'bg-orange-500/20' : 'bg-orange-50') :
            (isDark ? 'bg-purple-500/20' : 'bg-purple-50')
          }`}>
            <Icon size={24} className={
              item.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
              item.color === 'green' ? (isDark ? 'text-green-400' : 'text-green-600') :
              item.color === 'orange' ? (isDark ? 'text-orange-400' : 'text-orange-600') :
              (isDark ? 'text-purple-400' : 'text-purple-600')
            } />
          </div>
          <span className={`text-sm font-semibold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            {item.trend}
          </span>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          {item.label}
        </p>
        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.value}
        </p>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Page Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('admin.dashboard') || 'Dashboard'}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('admin.dashboardWelcome') || 'Welcome back to your admin panel'}
          </p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <KPICard item={item} />
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`lg:col-span-2 p-6 rounded-lg border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('admin.revenueChart') || 'Revenue Trend'}
              </h2>
              <div className="flex gap-2">
                {[
                  { id: 'mrr', label: 'MRR' },
                  { id: 'subscriptions', label: 'Subs' },
                  { id: 'churn', label: 'Churn' }
                ].map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => setRevenueMetric(item.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      revenueMetric === item.id
                        ? 'bg-orange-500 text-white'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: isDark ? '#F3F4F6' : '#111827' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={
                    revenueMetric === 'mrr' ? 'mrr' :
                    revenueMetric === 'subscriptions' ? 'subscriptions' :
                    'churn'
                  }
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Gym Subscription Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-lg border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('admin.subscriptionBreakdown') || 'Subscription Plans'}
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gymSubscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gymSubscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {gymSubscriptionData.map((plan, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {plan.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {plan.subscribers}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {((plan.subscribers / 2458) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity and Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`lg:col-span-2 p-6 rounded-lg border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('admin.recentActivity') || 'Recent Activity'}
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    className={`p-4 rounded-lg flex items-center gap-4 ${
                      isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors cursor-pointer`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      activity.type === 'payment_failed'
                        ? isDark ? 'bg-red-500/20' : 'bg-red-50'
                        : isDark ? 'bg-green-500/20' : 'bg-green-50'
                    }`}>
                      <Icon size={20} className={
                        activity.type === 'payment_failed'
                          ? isDark ? 'text-red-400' : 'text-red-600'
                          : isDark ? 'text-green-400' : 'text-green-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {activity.message}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.detail}
                      </p>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {activity.time}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Pending Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-lg border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('admin.pendingActions') || 'Pending Actions'}
            </h2>

            <div className="space-y-3">
              {pendingActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    className={`p-4 rounded-lg flex items-center justify-between cursor-pointer ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } transition-colors border ${
                      action.severity === 'error'
                        ? isDark ? 'border-red-500/30' : 'border-red-200'
                        : action.severity === 'warning'
                        ? isDark ? 'border-yellow-500/30' : 'border-yellow-200'
                        : isDark ? 'border-blue-500/30' : 'border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        action.severity === 'error'
                          ? isDark ? 'bg-red-500/20' : 'bg-red-50'
                          : action.severity === 'warning'
                          ? isDark ? 'bg-yellow-500/20' : 'bg-yellow-50'
                          : isDark ? 'bg-blue-500/20' : 'bg-blue-50'
                      }`}>
                        <Icon size={18} className={
                          action.severity === 'error'
                            ? isDark ? 'text-red-400' : 'text-red-600'
                            : action.severity === 'warning'
                            ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                            : isDark ? 'text-blue-400' : 'text-blue-600'
                        } />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {action.title}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {action.count} items
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('admin.systemHealth') || 'System Health'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemHealth.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  className={`p-4 rounded-lg ${getStatusBgColor(item.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.name}
                    </p>
                    <Icon size={18} className={getStatusColor(item.status)} />
                  </div>

                  <div className="space-y-2">
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.value}
                      <span className="text-sm ml-1">{item.unit}</span>
                    </p>

                    {item.target && (
                      <div className="w-full bg-gray-300/30 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                          transition={{ delay: 0.8 + idx * 0.1 + 0.2, duration: 0.8 }}
                          className={`h-full rounded-full ${
                            item.status === 'healthy'
                              ? 'bg-green-500'
                              : item.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    )}

                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status: <span className={`font-semibold capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
