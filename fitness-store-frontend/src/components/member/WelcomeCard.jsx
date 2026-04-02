import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * WelcomeCard - Greeting with member info
 */
export const WelcomeCard = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { profile: memberProfile } = useSelector((state) => state.member);
  const { currentMembership } = useSelector((state) => state.member);

  const memberName = memberProfile?.name || 'Member';
  const gymName = memberProfile?.preferredGym?.name || 'Your Gym';

  // Calculate days until renewal
  const daysUntilRenewal = currentMembership
    ? Math.ceil(
        (new Date(currentMembership.renewalDate) - new Date()) /
        (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`rounded-xl p-6 md:p-8 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-800/50'
          : 'bg-gradient-to-br from-white to-gray-50'
      } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('member.greeting.welcome', { name: memberName })}
          </h1>
          <p className={`mt-2 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {gymName}
          </p>
        </div>

        {/* Membership Status Badge */}
        {currentMembership && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isDark
                ? 'bg-accent/20 text-accent'
                : 'bg-accent/10 text-accent'
            }`}
          >
            {currentMembership.plan?.name}
          </motion.div>
        )}
      </div>

      {/* Renewal Info */}
      {daysUntilRenewal !== null && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              daysUntilRenewal > 7 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {daysUntilRenewal > 0
              ? t('member.membership.renewsIn', { days: daysUntilRenewal })
              : t('member.membership.renewToday')}
          </span>
        </div>
      )}
    </motion.div>
  );
};

/**
 * StatCard - Individual stat card
 */
export const StatCard = ({ icon: Icon, label, value, trend, trendUp = true }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-lg p-4 md:p-6 ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isDark
                ? 'bg-accent/20 text-accent'
                : 'bg-accent/10 text-accent'
            }`}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`text-xs font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            vs last month
          </span>
        </div>
      )}
    </motion.div>
  );
};

/**
 * StatsRow - 4 stat cards in a row
 */
export const StatsRow = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default WelcomeCard;
