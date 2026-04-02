import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import SessionList from './SessionList';
import TrainersList from './TrainersList';
import ProgressPhotos from './ProgressPhotos';
import BookingManagement from './BookingManagement';

/**
 * MemberDashboard - Main dashboard for gym members
 * Displays overview, upcoming sessions, trainers, and progress tracking
 */
const MemberDashboard = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [member, setMember] = useState({
    name: 'John Doe',
    membershipExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalSessions: 48,
    completedSessions: 42,
  });

  const tabs = [
    { id: 'overview', label: t('member.tabs.overview') || 'Overview' },
    { id: 'sessions', label: t('member.tabs.sessions') || 'Sessions' },
    { id: 'trainers', label: t('member.tabs.trainers') || 'Trainers' },
    { id: 'progress', label: t('member.tabs.progress') || 'Progress' },
    { id: 'booking', label: t('member.tabs.booking') || 'Booking' },
  ];

  const statsCards = [
    {
      title: t('member.stats.activeMembership') || 'Active Membership',
      value: 'Premium',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
    },
    {
      title: t('member.stats.totalSessions') || 'Total Sessions',
      value: member.totalSessions.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'green',
    },
    {
      title: t('member.stats.completedSessions') || 'Completed',
      value: member.completedSessions.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple',
    },
    {
      title: t('member.stats.nextSession') || 'Next Session',
      value: member.nextSession.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      icon: <Clock className="w-6 h-6" />,
      color: 'orange',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: isDark
        ? 'bg-blue-900/30 border-blue-800'
        : 'bg-blue-50 border-blue-200',
      green: isDark
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-200',
      purple: isDark
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-200',
      orange: isDark
        ? 'bg-orange-900/30 border-orange-800'
        : 'bg-orange-50 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1
            className={`text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('member.dashboard.welcome', { name: member.name }) ||
              `Welcome, ${member.name}`}
          </h1>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('member.dashboard.subtitle') ||
              'Track your fitness journey and connect with trainers'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all"
        >
          {t('member.dashboard.editProfile') || 'Edit Profile'}
        </motion.button>
      </motion.div>

      {/* Membership Alert */}
      {member.membershipExpiry < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-lg flex items-start gap-3 border ${
            isDark
              ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              {t('member.dashboard.membershipExpiring') ||
                'Your membership is expiring soon!'}
            </p>
            <p className="text-sm mt-1">
              {t('member.dashboard.renewBefore', {
                date: member.membershipExpiry.toLocaleDateString('en-US'),
              }) ||
                `Renew before ${member.membershipExpiry.toLocaleDateString('en-US')} to maintain benefits`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${getColorClasses(stat.color)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
              <div className={getIconColor(stat.color)}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `bg-accent text-white ${isDark ? '' : ''}`
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={activeTab}
        className={`rounded-lg p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {activeTab === 'overview' && (
          <OverviewTab member={member} />
        )}
        {activeTab === 'sessions' && (
          <SessionList
            sessions={[
              // Mock data - replace with API
              {
                id: 1,
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                time: '10:00 AM',
                trainer: 'Alex Johnson',
                focus: 'Upper Body Strength',
                duration: 60,
                status: 'upcoming',
              },
              {
                id: 2,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                time: '4:00 PM',
                trainer: 'Sarah Smith',
                focus: 'Core & Stability',
                duration: 45,
                status: 'completed',
              },
            ]}
          />
        )}
        {activeTab === 'trainers' && (
          <TrainersList
            trainers={[
              // Mock data - replace with API
              {
                id: 1,
                name: 'Alex Johnson',
                specialty: 'Strength Training',
                rating: 4.8,
                reviewCount: 24,
                profileImage: '/trainer1.jpg',
              },
              {
                id: 2,
                name: 'Sarah Smith',
                specialty: 'Cardio & Flexibility',
                rating: 4.6,
                reviewCount: 18,
                profileImage: '/trainer2.jpg',
              },
            ]}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressPhotos
            photos={[
              // Mock data - replace with API
              {
                id: 1,
                imageUrl: '/progress1.jpg',
                dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            ]}
          />
        )}
        {activeTab === 'booking' && (
          <BookingManagement />
        )}
      </motion.div>
    </div>
  );
};

/**
 * OverviewTab - Quick overview of member activity
 */
const OverviewTab = ({ member }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Upcoming Sessions */}
      <div>
        <h3
          className={`text-lg font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('member.overview.upcomingSessions') || 'Upcoming Sessions'}
        </h3>
        <div
          className={`p-4 rounded-lg border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {member.nextSession.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : ''}`}>
                10:00 AM - 11:00 AM
              </p>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${isDark ? 'text-gray-600' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3
          className={`text-lg font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('member.overview.recentActivity') || 'Recent Activity'}
        </h3>
        <div
          className={`space-y-3 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          <p className="text-sm">
            ✓ {t('member.overview.completedSessionToday') ||
              'Completed session with Alex Johnson'}
          </p>
          <p className="text-sm">
            ✓ {t('member.overview.reviewedTrainer') ||
              'Left a review for Sarah Smith'}
          </p>
          <p className="text-sm">
            ✓ {t('member.overview.uploadedPhoto') ||
              'Uploaded progress photo'}
          </p>
        </div>
      </div>

      {/* Membership Info */}
      <div>
        <h3
          className={`text-lg font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('member.overview.membershipInfo') || 'Membership Info'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('member.overview.memberSince') || 'Member Since'}
            </p>
            <p
              className={`font-bold mt-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {member.joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('member.overview.expiresOn') || 'Expires On'}
            </p>
            <p
              className={`font-bold mt-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {member.membershipExpiry.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
