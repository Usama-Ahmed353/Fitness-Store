import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  Edit2,
  ExternalLink,
  Flag,
  Lock,
  LogIn,
  Mail,
  MapPin,
  MessageSquare,
  MoreVertical,
  Pause,
  Phone,
  Play,
  Settings,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock gym detail data
const mockGymDetail = {
  id: 'GYM-001',
  name: 'NYC Downtown Fitness',
  owner: 'John Smith',
  ownerEmail: 'john@nycdowntown.com',
  ownerPhone: '+1 (555) 123-4567',
  location: '123 Fitness Ave, New York, NY 10001',
  city: 'New York',
  state: 'NY',
  plan: 'enterprise',
  status: 'active',
  members: 245,
  joinDate: '2023-06-15',
  verificationDate: '2023-06-20',
  description: 'Premium fitness center with state-of-the-art equipment and expert trainers.',

  // Subscription info
  currentPlan: 'enterprise',
  planPrice: 299.99,
  billingCycle: 'monthly',
  billingStartDate: '2026-03-01',
  billingEndDate: '2026-03-31',
  nextBillingDate: '2026-04-01',
  stripeSubscriptionId: 'sub_1K8x9Z2eZvKYlo2C0000000000',
  paymentMethod: 'visa_4242',
  
  // Classes
  classesOffered: 45,
  classBookings: 186,
  averageClassAttendance: 4.1,
};

// Mock members for gym
const mockGymMembers = [
  { id: 'MEM-101', name: 'Alice Johnson', email: 'alice@email.com', joinDate: '2024-01-15', status: 'active', lastVisit: '2026-03-24' },
  { id: 'MEM-102', name: 'Bob Wilson', email: 'bob@email.com', joinDate: '2024-02-10', status: 'active', lastVisit: '2026-03-23' },
  { id: 'MEM-103', name: 'Carol Davis', email: 'carol@email.com', joinDate: '2024-03-05', status: 'frozen', lastVisit: '2026-03-10' },
  { id: 'MEM-104', name: 'David Brown', email: 'david@email.com', joinDate: '2023-12-20', status: 'active', lastVisit: '2026-03-24' },
  { id: 'MEM-105', name: 'Emma Martinez', email: 'emma@email.com', joinDate: '2024-01-20', status: 'active', lastVisit: '2026-03-22' },
];

// Mock classes for gym
const mockClasses = [
  { id: 'CLS-1', name: 'Morning HIIT', trainer: 'Mike Davis', time: '06:00 AM', days: 'Mon, Wed, Fri', capacity: 20, enrolled: 18 },
  { id: 'CLS-2', name: 'Yoga Flow', trainer: 'Emma Wilson', time: '07:00 AM', days: 'Tue, Thu, Sat', capacity: 15, enrolled: 14 },
  { id: 'CLS-3', name: 'CrossFit', trainer: 'Alex Rodriguez', time: '07:00 AM', days: 'Mon, Wed, Fri', capacity: 25, enrolled: 22 },
  { id: 'CLS-4', name: 'Spin Class', trainer: 'Lisa Chen', time: '05:30 PM', days: 'Tue, Thu', capacity: 30, enrolled: 28 },
  { id: 'CLS-5', name: 'Boxing', trainer: 'John Smith', time: '06:00 PM', days: 'Wed, Fri', capacity: 20, enrolled: 15 },
];

// Mock payments for gym
const mockGymPayments = [
  { id: 'PAY-1', date: '2026-03-01', description: 'March Enterprise Subscription', amount: 299.99, status: 'paid', stripeId: 'ch_5555555555' },
  { id: 'PAY-2', date: '2026-02-01', description: 'February Enterprise Subscription', amount: 299.99, status: 'paid', stripeId: 'ch_4444444444' },
  { id: 'PAY-3', date: '2026-01-01', description: 'January Enterprise Subscription', amount: 299.99, status: 'paid', stripeId: 'ch_3333333333' },
  { id: 'PAY-4', date: '2025-12-01', description: 'December Enterprise Subscription', amount: 299.99, status: 'paid', stripeId: 'ch_2222222222' },
  { id: 'PAY-5', date: '2025-11-01', description: 'November Enterprise Subscription', amount: 299.99, status: 'paid', stripeId: 'ch_1111111111' },
];

// Mock analytics data
const memberCountData = [
  { month: 'Jan', count: 145 },
  { month: 'Feb', count: 172 },
  { month: 'Mar', count: 198 },
  { month: 'Apr', count: 215 },
  { month: 'May', count: 235 },
  { month: 'Jun', count: 245 },
];

const attendanceData = [
  { week: 'Week 1', rate: 72 },
  { week: 'Week 2', rate: 75 },
  { week: 'Week 3', rate: 68 },
  { week: 'Week 4', rate: 81 },
];

const revenueData = [
  { source: 'Memberships', value: 35, fill: '#3b82f6' },
  { source: 'Classes', value: 20, fill: '#10b981' },
  { source: 'PT Sessions', value: 30, fill: '#f59e0b' },
  { source: 'Shop Sales', value: 15, fill: '#8b5cf6' },
];

// Mock retention rates
const retentionData = [
  { cohort: 'Jan 2025', day30: 87, day60: 78, day90: 69 },
  { cohort: 'Feb 2025', day30: 91, day60: 82, day90: 74 },
  { cohort: 'Mar 2025', day30: 89, day60: 80, day90: 72 },
];

// Mock peak hours heatmap data
const peakHoursData = [
  { time: '05:00-06:00', monday: 45, tuesday: 52, wednesday: 48, thursday: 55, friday: 62, saturday: 38, sunday: 22 },
  { time: '06:00-07:00', monday: 78, tuesday: 82, wednesday: 85, thursday: 80, friday: 88, saturday: 65, sunday: 42 },
  { time: '07:00-08:00', monday: 92, tuesday: 95, wednesday: 93, thursday: 96, friday: 98, saturday: 78, sunday: 55 },
  { time: '08:00-09:00', monday: 68, tuesday: 72, wednesday: 70, thursday: 75, friday: 78, saturday: 55, sunday: 40 },
  { time: '17:00-18:00', monday: 85, tuesday: 88, wednesday: 90, thursday: 87, friday: 92, saturday: 68, sunday: 48 },
  { time: '18:00-19:00', monday: 95, tuesday: 98, wednesday: 96, thursday: 99, friday: 100, saturday: 75, sunday: 52 },
  { time: '19:00-20:00', monday: 82, tuesday: 85, wednesday: 88, thursday: 86, friday: 91, saturday: 70, sunday: 45 },
];

// Mock revenue breakdown by plan
const revenueByPlan = [
  { month: 'Jan', starter: 2400, professional: 5600, enterprise: 8900 },
  { month: 'Feb', starter: 2600, professional: 6100, enterprise: 9200 },
  { month: 'Mar', starter: 2800, professional: 6400, enterprise: 9800 },
  { month: 'Apr', starter: 3000, professional: 6800, enterprise: 10200 },
  { month: 'May', starter: 3200, professional: 7200, enterprise: 10800 },
  { month: 'Jun', starter: 3400, professional: 7600, enterprise: 11300 },
];

// Mock audit log
const mockAuditLog = [
  { id: 1, action: 'Plan upgraded', details: 'Professional → Enterprise', adminId: 'ADM-001', adminName: 'Sarah Chen', timestamp: '2026-03-24 14:30:00', status: 'success' },
  { id: 2, action: 'Class added', details: 'Added "HIIT Advanced" class', adminId: 'ADM-002', adminName: 'Mike Johnson', timestamp: '2026-03-24 11:15:00', status: 'success' },
  { id: 3, action: 'Member banned', details: 'Banned member MEM-045 for code of conduct violation', adminId: 'ADM-001', adminName: 'Sarah Chen', timestamp: '2026-03-23 16:45:00', status: 'success' },
  { id: 4, action: 'Gym suspended', details: 'Suspended temporarily due to non-payment', adminId: 'ADM-003', adminName: 'Robert Williams', timestamp: '2026-03-23 09:20:00', status: 'success' },
  { id: 5, action: 'Trainer added', details: 'Added trainer "Lisa Chen"', adminId: 'ADM-002', adminName: 'Mike Johnson', timestamp: '2026-03-22 13:00:00', status: 'success' },
  { id: 6, action: 'Bulk refund issued', details: 'Refunded 5 members - Technical issue', adminId: 'ADM-001', adminName: 'Sarah Chen', timestamp: '2026-03-22 10:30:00', status: 'success' },
  { id: 7, action: 'Settings updated', details: 'Updated gym operating hours', adminId: 'ADM-002', adminName: 'Mike Johnson', timestamp: '2026-03-21 15:45:00', status: 'success' },
  { id: 8, action: 'Failed login attempt', details: 'Multiple failed password attempts blocked', adminId: 'SYSTEM', adminName: 'System', timestamp: '2026-03-21 14:12:00', status: 'warning' },
];

const GymDetailPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [gym, setGym] = useState(mockGymDetail);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState(gym.plan);
  const [isSuspended, setIsSuspended] = useState(false);

  const tabs = ['overview', 'members', 'classes', 'payments', 'analytics', 'auditlog'];
  const tabLabels = {
    overview: 'Overview',
    members: 'Members',
    classes: 'Classes',
    payments: 'Payments',
    analytics: 'Analytics',
    auditlog: 'Audit Log',
  };

  const handleChangePlan = () => {
    if (selectedNewPlan !== gym.plan) {
      setGym({ ...gym, plan: selectedNewPlan, currentPlan: selectedNewPlan });
      setShowPlanModal(false);
    }
  };

  const handleSuspendGym = () => {
    setIsSuspended(!isSuspended);
    setShowSuspendModal(false);
  };

  const planColors = {
    starter: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    frozen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{gym.name}</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                  <MapPin size={14} />
                  {gym.city}, {gym.state}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${planColors[gym.plan]} px-3 py-1 rounded-full text-sm font-medium`}>
                {gym.plan.charAt(0).toUpperCase() + gym.plan.slice(1)}
              </span>
              <span className={`${statusColors[isSuspended ? 'suspended' : 'active']} px-3 py-1 rounded-full text-sm font-medium`}>
                {isSuspended ? 'Suspended' : 'Active'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border mb-6`}
            >
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab
                        ? `border-blue-500 text-blue-600 dark:text-blue-400`
                        : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Gym Info */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Gym Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Owner</p>
                            <p className="font-medium">{gym.owner}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{gym.ownerEmail}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                            <p className="font-medium">{gym.ownerPhone}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
                            <p className="font-medium">{new Date(gym.joinDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Members</p>
                            <p className="font-medium flex items-center gap-2">
                              <Users size={16} />
                              {gym.members}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Classes Offered</p>
                            <p className="font-medium">{gym.classesOffered}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verified Date</p>
                            <p className="font-medium">{new Date(gym.verificationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                        <p>{gym.description}</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg border ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>Total Members</p>
                          <p className="text-2xl font-bold mt-2">{gym.members}</p>
                        </div>
                        <div className={`${isDark ? 'bg-green-900' : 'bg-green-50'} p-4 rounded-lg border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-green-200' : 'text-green-600'}`}>Classes This Week</p>
                          <p className="text-2xl font-bold mt-2">12</p>
                        </div>
                        <div className={`${isDark ? 'bg-orange-900' : 'bg-orange-50'} p-4 rounded-lg border ${isDark ? 'border-orange-800' : 'border-orange-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-orange-200' : 'text-orange-600'}`}>Avg Attendance</p>
                          <p className="text-2xl font-bold mt-2">{gym.averageClassAttendance.toFixed(1)}</p>
                        </div>
                        <div className={`${isDark ? 'bg-purple-900' : 'bg-purple-50'} p-4 rounded-lg border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-purple-200' : 'text-purple-600'}`}>Monthly Revenue</p>
                          <p className="text-2xl font-bold mt-2">$18.2K</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'members' && (
                    <motion.div
                      key="members"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Joined</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Visit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockGymMembers.map((member) => (
                              <tr key={member.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-3 px-4 text-sm font-medium">{member.name}</td>
                                <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{member.email}</td>
                                <td className="py-3 px-4 text-sm">{new Date(member.joinDate).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-sm">
                                  <span className={`${statusColors[member.status]} px-2 py-1 rounded-full text-xs font-medium`}>
                                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                  </span>
                                </td>
                                <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(member.lastVisit).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'classes' && (
                    <motion.div
                      key="classes"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {mockClasses.map((cls) => (
                        <motion.div
                          key={cls.id}
                          whileHover={{ x: 4 }}
                          className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{cls.name}</p>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cls.trainer}</p>
                            </div>
                            <span className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-xs font-medium`}>
                              {cls.enrolled}/{cls.capacity}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {cls.time}
                            </span>
                            <span>{cls.days}</span>
                          </div>
                          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'payments' && (
                    <motion.div
                      key="payments"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Description</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stripe ID</th>
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockGymPayments.map((payment) => (
                              <tr key={payment.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-3 px-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-sm">{payment.description}</td>
                                <td className="py-3 px-4 text-sm font-semibold">${payment.amount.toFixed(2)}</td>
                                <td className={`py-3 px-4 text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {payment.stripeId.slice(0, 12)}...
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <span className={`${payment.status === 'paid' ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')} px-2 py-1 rounded text-xs font-medium`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Member Growth */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp size={18} />
                          Member Count Trend
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={memberCountData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                            <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#fff',
                                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                                borderRadius: '8px',
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Members" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Attendance Rate */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 size={18} />
                          Class Attendance Rate (%)
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                            <XAxis dataKey="week" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#fff',
                                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                                borderRadius: '8px',
                              }}
                            />
                            <Legend />
                            <Bar dataKey="rate" fill="#10b981" name="Attendance Rate" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Revenue Contribution */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <DollarSign size={18} />
                          Revenue Contribution
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie data={revenueData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                              {revenueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Retention Rate */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingDown size={18} />
                          Member Retention Rate (%)
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={retentionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                            <XAxis dataKey="cohort" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} domain={[0, 100]} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#fff',
                                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                                borderRadius: '8px',
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="day30" stroke="#10b981" strokeWidth={2} name="30-Day" />
                            <Line type="monotone" dataKey="day60" stroke="#f59e0b" strokeWidth={2} name="60-Day" />
                            <Line type="monotone" dataKey="day90" stroke="#ef4444" strokeWidth={2} name="90-Day" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Revenue by Plan */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 size={18} />
                          Revenue by Plan Type
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={revenueByPlan}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                            <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#fff',
                                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                                borderRadius: '8px',
                              }}
                            />
                            <Legend />
                            <Bar dataKey="starter" fill="#9ca3af" name="Starter" />
                            <Bar dataKey="professional" fill="#3b82f6" name="Professional" />
                            <Bar dataKey="enterprise" fill="#8b5cf6" name="Enterprise" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Peak Hours Heatmap */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Clock size={18} />
                          Peak Hours Heatmap (Gym Capacity %)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th className={`text-left p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Mon</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tue</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Wed</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Thu</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fri</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sat</th>
                                <th className={`text-center p-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sun</th>
                              </tr>
                            </thead>
                            <tbody>
                              {peakHoursData.map((row, idx) => (
                                <tr key={idx} className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                  <td className="p-2 font-medium text-xs">{row.time}</td>
                                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                    const value = row[day];
                                    let bgColor = '#e5e7eb';
                                    if (value > 80) bgColor = isDark ? '#7f1d1d' : '#fecaca';
                                    else if (value > 60) bgColor = isDark ? '#7c2d12' : '#fed7aa';
                                    else if (value > 40) bgColor = isDark ? '#3b82f6' : '#bfdbfe';
                                    else bgColor = isDark ? '#374151' : '#f3f4f6';
                                    return (
                                      <td key={day} className="p-2 text-center">
                                        <div
                                          className="px-2 py-1 rounded text-xs font-medium text-white"
                                          style={{ backgroundColor: bgColor, color: value > 50 ? '#fff' : '#000' }}
                                        >
                                          {value}%
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 flex gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}></div>
                            <span>0-40%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${isDark ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                            <span>40-60%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${isDark ? 'bg-orange-700' : 'bg-orange-200'}`}></div>
                            <span>60-80%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${isDark ? 'bg-red-900' : 'bg-red-200'}`}></div>
                            <span>80%+</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'auditlog' && (
                    <motion.div
                      key="auditlog"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {mockAuditLog.map((log, idx) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${log.status === 'warning' ? (isDark ? 'bg-yellow-900' : 'bg-yellow-100') : (isDark ? 'bg-green-900' : 'bg-green-100')}`}>
                                  {log.status === 'warning' ? (
                                    <AlertCircle size={18} className={isDark ? 'text-yellow-200' : 'text-yellow-700'} />
                                  ) : (
                                    <Check size={18} className={isDark ? 'text-green-200' : 'text-green-700'} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold">{log.action}</p>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{log.details}</p>
                                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2 flex items-center gap-1`}>
                                    <User size={12} />
                                    {log.adminName} ({log.adminId}) • {log.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <badge className={`flex-shrink-0 ${log.status === 'warning' ? (isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800') : (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')} px-3 py-1 rounded-full text-xs font-medium`}>
                              {log.status === 'warning' ? 'Warning' : 'Success'}
                            </badge>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Admin Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 hidden lg:block space-y-4"
          >
            {/* Subscription Management */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={18} />
                Subscription
              </h3>

              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg mb-4`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Plan</p>
                <p className="font-bold text-lg capitalize mb-2">{gym.currentPlan}</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>${gym.planPrice}/month</p>

                <div className="mt-3 space-y-1 text-xs">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Billing Period: {new Date(gym.billingStartDate).toLocaleDateString()} - {new Date(gym.billingEndDate).toLocaleDateString()}
                  </p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Next Billing: {new Date(gym.nextBillingDate).toLocaleDateString()}</p>
                  <p className={`text-xs font-mono mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>ID: {gym.stripeSubscriptionId.slice(0, 20)}...</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowPlanModal(true)}
                  className={`w-full ${isDark ? 'bg-blue-900 hover:bg-blue-800 text-blue-200' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between text-sm`}
                >
                  <span>Change Plan</span>
                  <Edit2 size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  className={`w-full ${isDark ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-50 hover:bg-green-100 text-green-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between text-sm`}
                >
                  <span>Force Renewal</span>
                  <Zap size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowSuspendModal(true)}
                  className={`w-full ${isDark ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-50 hover:bg-red-100 text-red-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between text-sm`}
                >
                  <span>{isSuspended ? 'Reinstate' : 'Suspend'}</span>
                  {isSuspended ? <Play size={14} /> : <Pause size={14} />}
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  className={`w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between text-sm`}
                >
                  <span>View in Stripe</span>
                  <ExternalLink size={14} />
                </motion.button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings size={18} />
                Admin Actions
              </h3>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-between ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <span>Send Email</span>
                  <Mail size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-between ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <span>Add Note</span>
                  <MessageSquare size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-between ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <span>View Analytics</span>
                  <BarChart3 size={14} />
                </motion.button>
              </div>
            </div>

            {/* Owner Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
              <h4 className="font-semibold mb-3 text-sm">Owner Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{gym.owner}</p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Mail size={14} />
                  {gym.ownerEmail}
                </p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Phone size={14} />
                  {gym.ownerPhone}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Change Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Change Gym Plan</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="starter"
                    checked={selectedNewPlan === 'starter'}
                    onChange={(e) => setSelectedNewPlan(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Starter - $99/mo</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="professional"
                    checked={selectedNewPlan === 'professional'}
                    onChange={(e) => setSelectedNewPlan(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Professional - $199/mo</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="enterprise"
                    checked={selectedNewPlan === 'enterprise'}
                    onChange={(e) => setSelectedNewPlan(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Enterprise - $299/mo</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePlan}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Update Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">{isSuspended ? 'Reinstate Gym' : 'Suspend Gym'}</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isSuspended
                  ? 'This will reactivate the gym. Members can resume bookings.'
                  : 'This will suspend the gym. Members cannot book classes or access the facility.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendGym}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${isSuspended ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {isSuspended ? 'Reinstate' : 'Suspend'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default GymDetailPage;
