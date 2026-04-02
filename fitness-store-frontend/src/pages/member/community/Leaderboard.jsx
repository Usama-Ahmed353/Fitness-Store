import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Search
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  generateLeaderboard,
  calculateTrend,
  getRankBadge,
  getRankColor,
  getMetricInfo
} from '../../../utils/leaderboardCalculator';

const Leaderboard = ({ members = [], userId, searchQuery = '' }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('week');
  const [sortMetric, setSortMetric] = useState('points');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Mock previous period data for trend calculation
  const mockPreviousData = {
    week: members.map(m => ({ ...m, points: Math.max(0, m.points - Math.random() * 200) })),
    month: members.map(m => ({ ...m, points: Math.max(0, m.points - Math.random() * 500) })),
    allTime: members.map(m => ({ ...m, points: Math.max(0, m.points * 0.85) }))
  };

  // Generate leaderboard based on selections
  const leaderboard = useMemo(() => {
    let data = generateLeaderboard(members, sortMetric, timeRange) || members;

    // Filter by search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      data = data.filter(
        member =>
          member.name?.toLowerCase().includes(query) ||
          member.level?.toLowerCase().includes(query)
      );
    }

    return data;
  }, [members, sortMetric, timeRange, localSearchQuery]);

  // Get top 3 for featured section
  const topThree = leaderboard.slice(0, 3);

  // Get user's position if not in top 3
  const userInLeaderboard = leaderboard.find(m => m.id === userId);
  const userPosition = leaderboard.findIndex(m => m.id === userId);

  const timeRangeOptions = [
    { value: 'week', label: t('common.thisWeek') || 'This Week' },
    { value: 'month', label: t('common.thisMonth') || 'This Month' },
    { value: 'allTime', label: t('common.allTime') || 'All Time' }
  ];

  const metricOptions = [
    { value: 'points', label: t('leaderboard.points') || 'Points' },
    { value: 'checkIns', label: t('leaderboard.checkIns') || 'Check-ins' },
    { value: 'classes', label: t('leaderboard.classes') || 'Classes' },
    { value: 'challenges', label: t('leaderboard.challenges') || 'Challenges Won' }
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Time Range Filter */}
          <div className="flex gap-2">
            {timeRangeOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  timeRange === option.value
                    ? 'bg-orange-500 text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>

          {/* Sort Metric Filter */}
          <select
            value={sortMetric}
            onChange={(e) => setSortMetric(e.target.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              isDark
                ? 'bg-gray-700 text-white border border-gray-600'
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search field */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.searchMembers') || 'Search members...'}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className={`px-4 py-2 pl-10 rounded-lg transition-colors text-sm ${
              isDark
                ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
            } focus:outline-none focus:ring-1 focus:ring-orange-400`}
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </motion.div>

      {/* Featured Top 3 */}
      {topThree.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {topThree.map((member, index) => {
            const prevMember = mockPreviousData[timeRange]?.find(m => m.id === member.id);
            const trend = prevMember ? calculateTrend(prevMember.points, member.points) : null;
            const badge = getRankBadge(index + 1);
            const color = getRankColor(index + 1);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 border-2 ${
                  isDark ? `bg-gray-800 border-gray-700` : `bg-white border-gray-200`
                } transform ${index === 0 ? 'md:scale-105' : ''}`}
              >
                {/* Rank Badge */}
                <div className={`text-4xl mb-4 text-center font-bold ${color}`}>{badge}</div>

                {/* Member Info */}
                <div className="text-center">
                  <div className="text-4xl mb-2">{member.avatar}</div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </h3>
                  <div
                    className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getMetricColor(
                      sortMetric,
                      isDark
                    )}`}
                  >
                    {member.level}
                  </div>
                </div>

                {/* Score */}
                <div className="mt-4 text-center">
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getMetricInfo(sortMetric)?.label || 'Points'}
                  </div>
                  <div className="text-3xl font-bold text-orange-400 mt-1">
                    {member[Object.keys(member).find(k => k === sortMetric) ? sortMetric : 'points']}
                  </div>
                </div>

                {/* Trend */}
                {trend && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {trend.direction === 'up' && (
                      <TrendingUp size={18} className="text-green-400" />
                    )}
                    {trend.direction === 'down' && (
                      <TrendingDown size={18} className="text-red-400" />
                    )}
                    {trend.direction === 'neutral' && (
                      <Minus size={18} className="text-gray-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        trend.direction === 'up'
                          ? 'text-green-400'
                          : trend.direction === 'down'
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {trend.percentage}%
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Full Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl overflow-hidden border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-6 py-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className={`col-span-2 text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('common.rank') || 'Rank'}
          </div>
          <div className={`col-span-4 text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('common.member') || 'Member'}
          </div>
          <div className={`col-span-2 text-sm font-bold text-right ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {getMetricInfo(sortMetric)?.label || 'Points'}
          </div>
          <div className={`col-span-2 text-sm font-bold text-right ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('common.trend') || 'Trend'}
          </div>
          <div className={`col-span-2 text-sm font-bold text-right ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('common.level') || 'Level'}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-700">
          {leaderboard.map((member, index) => {
            const prevMember = mockPreviousData[timeRange]?.find(m => m.id === member.id);
            const trend = prevMember ? calculateTrend(prevMember.points, member.points) : null;
            const isCurrentUser = member.id === userId;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${
                  isCurrentUser
                    ? isDark
                      ? 'bg-orange-500/10 border-l-2 border-orange-400'
                      : 'bg-orange-50 border-l-2 border-orange-400'
                    : isDark
                    ? 'hover:bg-gray-700/50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Rank */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-orange-400">#{member.rank}</span>
                    {[1, 2, 3].includes(member.rank) && (
                      <span className="text-lg">{getRankBadge(member.rank)}</span>
                    )}
                  </div>
                </div>

                {/* Member */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{member.avatar}</span>
                    <div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {member.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-orange-400 font-bold">(You)</span>
                        )}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {member.followersCount} followers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className={`col-span-2 text-right font-bold text-lg ${
                  member.id === topThree[0]?.id
                    ? 'text-yellow-400'
                    : member.id === topThree[1]?.id
                    ? 'text-gray-300'
                    : 'text-orange-400'
                }`}>
                  {member.points}
                </div>

                {/* Trend */}
                <div className="col-span-2 text-right">
                  {trend && (
                    <div className="flex items-center justify-end gap-1">
                      {trend.direction === 'up' && (
                        <TrendingUp size={16} className="text-green-400" />
                      )}
                      {trend.direction === 'down' && (
                        <TrendingDown size={16} className="text-red-400" />
                      )}
                      {trend.direction === 'neutral' && (
                        <Minus size={16} className="text-gray-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          trend.direction === 'up'
                            ? 'text-green-400'
                            : trend.direction === 'down'
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {trend.percentage}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Level */}
                <div className="col-span-2 text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-bold ${getMetricColor(
                      member.level.toLowerCase(),
                      isDark
                    )}`}
                  >
                    {member.level}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* User Position (if not in top 3) */}
      {userInLeaderboard && !topThree.find(m => m.id === userId) && userPosition !== -1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg ${isDark ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}
        >
          <div className={`text-center ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            <span className="font-semibold">{userInLeaderboard.name}</span> is currently ranked{' '}
            <span className="font-bold">#{userPosition + 1}</span> with{' '}
            <span className="font-bold">{userInLeaderboard.points}</span> points
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
          <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('common.noResults') || 'No results found'}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Adjust your filters and try again
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Helper function to get metric color based on level
const getMetricColor = (metric, isDark) => {
  const colors = {
    elite: 'bg-yellow-500/20 text-yellow-400',
    legend: 'bg-purple-500/20 text-purple-400',
    advanced: 'bg-blue-500/20 text-blue-400',
    intermediate: 'bg-green-500/20 text-green-400',
    beginner: 'bg-gray-500/20 text-gray-400',
    points: 'text-orange-400',
    checkins: 'text-green-400',
    classes: 'text-blue-400',
    challenges: 'text-purple-400'
  };
  return colors[metric.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
};

export default Leaderboard;
