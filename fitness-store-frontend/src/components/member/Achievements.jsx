import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Lock } from 'lucide-react';

/**
 * AchievementBadge - Individual achievement badge
 */
const AchievementBadge = ({ badge, unlocked, index }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={unlocked ? { scale: 1.1, y: -4 } : {}}
      className="flex flex-col items-center justify-center group cursor-pointer"
    >
      <div className="relative">
        {/* Badge Container */}
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all ${
            unlocked
              ? 'bg-gradient-to-br from-accent/30 to-accent/10 scale-100'
              : isDark
              ? 'bg-gray-700/50 scale-95 opacity-50'
              : 'bg-gray-200 scale-95 opacity-50'
          }`}
        >
          {unlocked ? badge.icon : <Lock size={28} className="text-gray-400" />}
        </div>

        {/* Glow effect for unlocked */}
        {unlocked && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-accent/20 blur-lg"
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center mt-2">
        <p className={`text-xs md:text-sm font-semibold line-clamp-2 ${
          unlocked
            ? isDark
              ? 'text-white'
              : 'text-gray-900'
            : isDark
            ? 'text-gray-400'
            : 'text-gray-600'
        }`}>
          {badge.name}
        </p>

        {/* Tooltip on hover */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded whitespace-nowrap text-xs z-10 pointer-events-none ${
            isDark
              ? 'bg-gray-900 text-gray-100'
              : 'bg-gray-800 text-white'
          }`}
        >
          {badge.description}
        </motion.div>
      </div>

      {/* Progress for partial achievements */}
      {!unlocked && badge.progress !== undefined && (
        <div className="mt-2 w-12 md:w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${badge.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

/**
 * Achievements - Badge grid
 */
export const Achievements = ({ achievements = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Sample badges if none provided
  const defaultBadges = achievements.length > 0 ? achievements : [
    {
      id: 'first-class',
      name: t('member.badges.firstClass'),
      description: t('member.badges.firstClassDesc'),
      icon: '🎯',
      unlocked: true,
      progress: 100,
    },
    {
      id: '7day-streak',
      name: t('member.badges.sevenDayStreak'),
      description: t('member.badges.sevenDayStreakDesc'),
      icon: '🔥',
      unlocked: true,
      progress: 100,
    },
    {
      id: '50-classes',
      name: t('member.badges.fiftyClasses'),
      description: t('member.badges.fiftyClassesDesc'),
      icon: '🏆',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'early-bird',
      name: t('member.badges.earlyBird'),
      description: t('member.badges.earlyBirdDesc'),
      icon: '🐔',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'night-owl',
      name: t('member.badges.nightOwl'),
      description: t('member.badges.nightOwlDesc'),
      icon: '🌙',
      unlocked: false,
      progress: 60,
    },
    {
      id: '100-classes',
      name: t('member.badges.hundredClasses'),
      description: t('member.badges.hundredClassesDesc'),
      icon: '💯',
      unlocked: false,
      progress: 35,
    },
  ];

  const unlockedCount = defaultBadges.filter((b) => b.unlocked).length;
  const totalCount = defaultBadges.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={`rounded-lg p-6 ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('member.achievements.title')}
        </h2>
        <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {unlockedCount} / {totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-accent rounded-full"
        />
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {defaultBadges.map((badge, idx) => (
          <AchievementBadge
            key={badge.id}
            badge={badge}
            unlocked={badge.unlocked}
            index={idx}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Achievements;
