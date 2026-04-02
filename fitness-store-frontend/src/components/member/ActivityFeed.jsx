import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  CheckCircle,
  Award,
  Users,
  Zap,
} from 'lucide-react';

/**
 * ActivityItem - Individual activity in feed
 */
const ActivityItem = ({ type, title, description, timestamp, icon: Icon }) => {
  const { isDark } = useTheme();

  const getIconColor = (type) => {
    switch (type) {
      case 'checkin':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'milestone':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'trainer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'activity':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 p-4 rounded-lg ${
        isDark
          ? 'bg-gray-700/30 hover:bg-gray-700/50'
          : 'bg-gray-50 hover:bg-gray-100'
      } transition-colors`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(type)}`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {formatTime(timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Format timestamp relative to now
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

/**
 * ActivityFeed - Recent activities (last 5)
 */
export const ActivityFeed = ({ activities = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Sample data if no activities provided
  const defaultActivities = activities.length > 0 ? activities : [
    {
      type: 'checkin',
      title: t('member.activity.classAttended'),
      description: 'Attended Spin Class with Sarah at Downtown Gym',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: CheckCircle,
    },
    {
      type: 'milestone',
      title: t('member.activity.milestoneAchieved'),
      description: 'Reached 10 classes attended this month!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: Award,
    },
    {
      type: 'trainer',
      title: t('member.activity.sessionCompleted'),
      description: 'Personal Training Session with John (45 min)',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: Users,
    },
    {
      type: 'activity',
      title: t('member.activity.pointsEarned'),
      description: 'Earned 50 points from today activities',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: Zap,
    },
    {
      type: 'checkin',
      title: t('member.activity.classAttended'),
      description: 'Attended Yoga Class with Maria',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: CheckCircle,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className={`rounded-lg p-6 ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('member.activity.recentActivity')}
      </h2>

      <div className="space-y-2">
        {defaultActivities.slice(0, 5).map((activity, idx) => (
          <ActivityItem key={idx} {...activity} />
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
