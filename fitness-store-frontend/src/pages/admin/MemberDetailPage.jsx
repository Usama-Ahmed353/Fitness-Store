import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Edit2,
  ExternalLink,
  Flag,
  Lock,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X,
  ZoomIn,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock member detail data
const mockMemberDetail = {
  id: 'MEM-001',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1992-05-15',
  joinDate: '2023-08-20',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  status: 'active',
  plan: 'professional',
  membershipStartDate: '2023-08-20',
  membershipEndDate: '2026-08-20',
  renewalDate: '2026-08-20',
  billingPeriod: 'monthly',
  monthlyAmount: 49.99,
  nextBillingDate: '2026-04-20',
  paymentMethod: 'Visa •••• 4242',
  address: '123 Fitness Ave, New York, NY 10001',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States',
  emergencyContact: 'Michael Johnson',
  emergencyPhone: '+1 (555) 987-6543',
  fitnessGoals: ['Build Muscle', 'Improve Cardio', 'Increase Strength'],
  medicalNotes: 'No known allergies. Recovering from minor shoulder injury.',
  badges: [
    { id: 1, name: '30-Day Streak', icon: '🔥', earnedDate: '2025-03-20' },
    { id: 2, name: 'Gym Pioneer', icon: '⭐', earnedDate: '2023-09-01' },
    { id: 3, name: 'Class Master', icon: '🏆', earnedDate: '2024-01-15' },
    { id: 4, name: 'Trainer Trust', icon: '💪', earnedDate: '2024-06-10' },
  ],
  isFrozen: false,
  internalNotes: [
    { id: 1, content: 'VIP member - prefers morning classes', author: 'Admin John', date: '2025-03-15' },
    { id: 2, content: 'Recently increased plan from Starter to Professional', author: 'Admin Sarah', date: '2025-03-10' },
  ],
};

// Mock bookings
const mockBookings = [
  { id: 1, class: 'HIIT Training', trainer: 'Mike Davis', date: '2026-03-25', time: '06:00 AM', gym: 'NYC Downtown', status: 'confirmed', type: 'class' },
  { id: 2, class: 'Personal Training - Back Focus', trainer: 'Lisa Chen', date: '2026-03-23', time: '05:00 PM', gym: 'NYC Downtown', status: 'confirmed', type: 'trainer' },
  { id: 3, class: 'Yoga Flow', trainer: 'Emma Wilson', date: '2026-03-22', time: '07:00 AM', gym: 'NYC Midtown', status: 'completed', type: 'class' },
  { id: 4, class: 'Personal Training - Cardio', trainer: 'Mike Davis', date: '2026-03-20', time: '06:30 PM', gym: 'NYC Downtown', status: 'completed', type: 'trainer' },
  { id: 5, class: 'CrossFit', trainer: 'Alex Rodriguez', date: '2026-03-18', time: '07:00 AM', gym: 'NYC Downtown', status: 'completed', type: 'class' },
];

// Mock payments
const mockPayments = [
  { id: 'CH-001', date: '2026-03-20', description: 'March 2026 Subscription - Professional', amount: 49.99, status: 'paid', stripeId: 'ch_1234567890', invoice: 'INV-001234' },
  { id: 'CH-002', date: '2026-02-20', description: 'February 2026 Subscription - Professional', amount: 49.99, status: 'paid', stripeId: 'ch_0987654321', invoice: 'INV-001233' },
  { id: 'CH-003', date: '2026-01-20', description: 'January 2026 Subscription - Professional', amount: 49.99, status: 'paid', stripeId: 'ch_1111111111', invoice: 'INV-001232' },
  { id: 'CH-004', date: '2025-12-20', description: 'December 2025 Subscription - Professional', amount: 49.99, status: 'paid', stripeId: 'ch_2222222222', invoice: 'INV-001231' },
  { id: 'CH-005', date: '2025-11-20', description: 'November 2025 Subscription - Professional', amount: 49.99, status: 'paid', stripeId: 'ch_3333333333', invoice: 'INV-001230' },
  { id: 'CH-006', date: '2025-10-20', description: 'Plan Upgrade (Starter → Professional)', amount: 25.00, status: 'paid', stripeId: 'ch_4444444444', invoice: 'INV-001229' },
];

// Mock activity
const mockActivity = [
  { id: 1, type: 'checkin', date: '2026-03-24 06:15 AM', gym: 'NYC Downtown', duration: '45 mins' },
  { id: 2, type: 'class', date: '2026-03-22 07:00 AM', detail: 'Yoga Flow class with Emma Wilson', duration: '60 mins' },
  { id: 3, type: 'trainer', date: '2026-03-20 06:30 PM', detail: 'Personal Training - Cardio with Mike Davis', duration: '50 mins' },
  { id: 4, type: 'login', date: '2026-03-24 06:00 AM', device: 'iPhone 14 Pro', ip: '192.168.1.100' },
  { id: 5, type: 'checkin', date: '2026-03-21 05:30 PM', gym: 'NYC Midtown', duration: '90 mins' },
  { id: 6, type: 'login', date: '2026-03-21 05:15 PM', device: 'Safari on MacOS', ip: '192.168.1.100' },
  { id: 7, type: 'class', date: '2026-03-18 07:00 AM', detail: 'CrossFit with Alex Rodriguez', duration: '55 mins' },
  { id: 8, type: 'checkin', date: '2026-03-17 06:45 AM', gym: 'NYC Downtown', duration: '60 mins' },
];

const MemberDetailPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [member, setMember] = useState(mockMemberDetail);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedNewPlan, setSelectedNewPlan] = useState('enterprise');
  const [refundingPaymentId, setRefundingPaymentId] = useState(null);

  const tabs = ['overview', 'bookings', 'payments', 'activity', 'notes'];
  const tabLabels = {
    overview: 'Overview',
    bookings: 'Bookings',
    payments: 'Payments',
    activity: 'Activity',
    notes: 'Notes',
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: member.internalNotes.length + 1,
        content: newNote,
        author: 'Current Admin',
        date: new Date().toISOString().split('T')[0],
      };
      setMember({
        ...member,
        internalNotes: [...member.internalNotes, note],
      });
      setNewNote('');
      setShowNoteModal(false);
    }
  };

  const handleFreezeMember = () => {
    setMember({ ...member, isFrozen: true });
    setShowFreezeModal(false);
  };

  const handleUnfreezeMember = () => {
    setMember({ ...member, isFrozen: false });
    setShowFreezeModal(false);
  };

  const handleCancelMembership = () => {
    if (cancelReason.trim()) {
      setMember({ ...member, status: 'canceled' });
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailBody.trim()) {
      console.log('Email sent to', member.email, emailSubject, emailBody);
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailBody('');
    }
  };

  const handleRefund = (paymentId) => {
    setRefundingPaymentId(paymentId);
    setTimeout(() => {
      setRefundingPaymentId(null);
      console.log('Refund issued for payment', paymentId);
    }, 1500);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    frozen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const planColors = {
    starter: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
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
                <h1 className="text-2xl font-bold">{member.firstName} {member.lastName}</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <badge className={`${statusColors[member.status]} px-3 py-1 rounded-full text-sm font-medium`}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </badge>
              {member.isFrozen && (
                <badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  Frozen
                </badge>
              )}
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
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 font-medium transition-colors border-b-2 ${
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
                      {/* Profile Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User size={20} /> Profile Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                            <p className="font-medium">{member.phone}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth</p>
                            <p className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
                            <p className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                            <p className="font-medium">{member.city}, {member.state}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Contact</p>
                            <p className="font-medium">{member.emergencyContact}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Phone</p>
                            <p className="font-medium">{member.emergencyPhone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Membership Status */}
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-6 rounded-lg border ${isDark ? 'border-gray-600' : 'border-blue-200'}`}>
                        <h4 className="font-semibold mb-4">Membership Status</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Plan</p>
                            <p className="font-medium">{member.plan.charAt(0).toUpperCase() + member.plan.slice(1)}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Billing Period</p>
                            <p className="font-medium">{member.billingPeriod.charAt(0).toUpperCase() + member.billingPeriod.slice(1)}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</p>
                            <p className="font-medium">${member.monthlyAmount}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Billing</p>
                            <p className="font-medium">{new Date(member.nextBillingDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Payment Method</p>
                            <p className="font-medium">{member.paymentMethod}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Membership Valid Until</p>
                            <p className="font-medium">{new Date(member.membershipEndDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                            <badge className={`${statusColors[member.status]} px-2 py-1 rounded text-xs font-medium inline-block`}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </badge>
                          </div>
                          {member.isFrozen && (
                            <div>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</p>
                              <badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium inline-block">
                                Frozen
                              </badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fitness Goals */}
                      <div>
                        <h4 className="font-semibold mb-3">Fitness Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.fitnessGoals.map((goal, idx) => (
                            <badge key={idx} className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm`}>
                              {goal}
                            </badge>
                          ))}
                        </div>
                      </div>

                      {/* Badges Earned */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Award size={18} /> Badges Earned
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {member.badges.map((badge) => (
                            <motion.div
                              key={badge.id}
                              whileHover={{ scale: 1.05 }}
                              className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border text-center`}
                            >
                              <div className="text-3xl mb-2">{badge.icon}</div>
                              <p className="font-medium text-sm">{badge.name}</p>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(badge.earnedDate).toLocaleDateString()}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Medical Notes */}
                      {member.medicalNotes && (
                        <div className={`${isDark ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} p-4 rounded-lg border flex gap-3`}>
                          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">Medical Notes</h4>
                            <p className="text-sm">{member.medicalNotes}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'bookings' && (
                    <motion.div
                      key="bookings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-3">
                        {mockBookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            whileHover={{ x: 4 }}
                            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border flex items-start justify-between`}
                          >
                            <div className="flex gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                                {booking.type === 'trainer' ? (
                                  <User size={20} className={isDark ? 'text-blue-200' : 'text-blue-600'} />
                                ) : (
                                  <Calendar size={20} className={isDark ? 'text-blue-200' : 'text-blue-600'} />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{booking.class}</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {booking.trainer} • {booking.gym}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                </p>
                              </div>
                            </div>
                            <badge className={`${booking.status === 'confirmed' ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')} px-3 py-1 rounded-full text-xs font-medium flex-shrink-0`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </badge>
                          </motion.div>
                        ))}
                      </div>
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
                              <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockPayments.map((payment) => (
                              <tr key={payment.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                <td className="py-3 px-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-sm">{payment.description}</td>
                                <td className="py-3 px-4 text-sm font-semibold">${payment.amount.toFixed(2)}</td>
                                <td className={`py-3 px-4 text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {payment.stripeId.slice(0, 15)}...
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <badge className={`${payment.status === 'paid' ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')} px-2 py-1 rounded text-xs font-medium`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </badge>
                                </td>
                                <td className="py-3 px-4 text-sm flex gap-2">
                                  <button
                                    className={`p-1 rounded hover:${isDark ? 'bg-gray-600' : 'bg-gray-200'} transition-colors`}
                                    title="Download Invoice"
                                  >
                                    <Download size={16} />
                                  </button>
                                  {payment.status === 'paid' && (
                                    <motion.button
                                      onClick={() => handleRefund(payment.id)}
                                      disabled={refundingPaymentId === payment.id}
                                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                        refundingPaymentId === payment.id
                                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                          : 'bg-red-500 text-white hover:bg-red-600'
                                      }`}
                                    >
                                      {refundingPaymentId === payment.id ? (
                                        <>
                                          <RefreshCw size={12} className="inline mr-1 animate-spin" />
                                          Refunding...
                                        </>
                                      ) : (
                                        'Refund'
                                      )}
                                    </motion.button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'activity' && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {mockActivity.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ x: 4 }}
                          className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}
                        >
                          <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                              {item.type === 'checkin' && <BadgeCheck size={18} />}
                              {item.type === 'class' && <Calendar size={18} />}
                              {item.type === 'trainer' && <User size={18} />}
                              {item.type === 'login' && <Lock size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm capitalize">
                                {item.type === 'checkin' && `Check-in at ${item.gym}`}
                                {item.type === 'class' && 'Class Attended'}
                                {item.type === 'trainer' && 'Training Session'}
                                {item.type === 'login' && 'Login'}
                              </p>
                              {item.detail && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.detail}</p>}
                              {item.device && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.device} • {item.ip}</p>}
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{item.date}</p>
                            </div>
                            {item.duration && (
                              <div className={`text-sm font-medium whitespace-nowrap flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Clock size={14} />
                                {item.duration}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'notes' && (
                    <motion.div
                      key="notes"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => setShowNoteModal(true)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Internal Note
                      </button>

                      <div className="space-y-3">
                        {member.internalNotes.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}
                          >
                            <p className="font-medium mb-2">{note.content}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {note.author} • {new Date(note.date).toLocaleDateString()}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Admin Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-80 hidden lg:block space-y-4`}
          >
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings size={18} />
                Admin Actions
              </h3>

              <div className="space-y-3">
                {/* Plan Actions */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowUpgradeModal(true)}
                  className={`w-full ${isDark ? 'bg-blue-900 hover:bg-blue-800 text-blue-200' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>Plan Actions</span>
                  <TrendingUp size={16} />
                </motion.button>

                {/* Freeze/Unfreeze */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowFreezeModal(true)}
                  className={`w-full ${isDark ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200' : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>{member.isFrozen ? 'Unfreeze' : 'Freeze'} Account</span>
                  <Flag size={16} />
                </motion.button>

                {/* Cancel Membership */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowCancelModal(true)}
                  disabled={member.status === 'canceled'}
                  className={`w-full ${member.status === 'canceled' ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-500 cursor-not-allowed') : (isDark ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-50 hover:bg-red-100 text-red-700')} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>Cancel Membership</span>
                  <X size={16} />
                </motion.button>

                {/* Reset Password */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowResetPasswordModal(true)}
                  className={`w-full ${isDark ? 'bg-purple-900 hover:bg-purple-800 text-purple-200' : 'bg-purple-50 hover:bg-purple-100 text-purple-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>Reset Password</span>
                  <Lock size={16} />
                </motion.button>

                {/* Send Email */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowEmailModal(true)}
                  className={`w-full ${isDark ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-50 hover:bg-green-100 text-green-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>Send Email</span>
                  <Mail size={16} />
                </motion.button>

                {/* Add Internal Note */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setShowNoteModal(true)}
                  className={`w-full ${isDark ? 'bg-indigo-900 hover:bg-indigo-800 text-indigo-200' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>Add Note</span>
                  <MessageSquare size={16} />
                </motion.button>

                {/* View in Stripe */}
                <motion.button
                  whileHover={{ x: 4 }}
                  className={`w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-between`}
                >
                  <span>View in Stripe</span>
                  <ExternalLink size={16} />
                </motion.button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
              <h4 className="font-semibold mb-3 text-sm">Quick Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Visits</p>
                  <p className="text-2xl font-bold">128</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Classes Attended</p>
                  <p className="text-2xl font-bold">32</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Training Sessions</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Lifetime Revenue</p>
                  <p className="text-2xl font-bold">$1,299</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Upgrade/Downgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Change Plan</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="starter"
                    onChange={(e) => setSelectedNewPlan(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Starter - $29/mo</span>
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
                  <span className="font-medium">Professional - $49/mo</span>
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
                  <span className="font-medium">Enterprise - $79/mo</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMember({ ...member, plan: selectedNewPlan });
                    setShowUpgradeModal(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Freeze Modal */}
        {showFreezeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">
                {member.isFrozen ? 'Unfreeze Account?' : 'Freeze Account?'}
              </h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {member.isFrozen
                  ? 'This will reactivate the member account. They can resume using the platform.'
                  : 'This will temporarily suspend the member account. They cannot access the gym or classes.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={member.isFrozen ? handleUnfreezeMember : handleFreezeMember}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${member.isFrozen ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                >
                  {member.isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Cancel Membership Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-2">Cancel Membership</h3>
              <p className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This action is irreversible. Please provide a reason.</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-6 text-sm`}
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Keep Member
                </button>
                <button
                  onClick={handleCancelMembership}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Reset Password</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                A password reset link will be sent to {member.email}. The member will need to click the link to set a new password.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Reset password email sent');
                    setShowResetPasswordModal(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Send Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Send Email</h3>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Subject..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-4 text-sm`}
              />
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Message..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-6 text-sm`}
                rows="6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!emailSubject.trim() || !emailBody.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Email
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Add Internal Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Internal note (only visible to admins)..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-6 text-sm`}
                rows="4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default MemberDetailPage;
