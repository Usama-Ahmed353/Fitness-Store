import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import Leaderboard from './Leaderboard';
import Forum from './Forum';
import Members from './Members';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getTotalKudos, getMemberLevel } from '../../../utils/socialCalculator';
import { getUserStats } from '../../../utils/leaderboardCalculator';

const CommunityPage = ({ userId, currentUser }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - would come from backend
  const mockMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩‍🦰',
      rank: 1,
      points: 2850,
      level: 'Elite',
      followersCount: 342,
      followingCount: 128,
      workoutDays: 156,
      joinDate: '2022-01-15',
      lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      interests: ['strength', 'nutrition', 'challenges']
    },
    {
      id: 2,
      name: 'Marcus Chen',
      avatar: '👨‍💼',
      rank: 2,
      points: 2620,
      level: 'Legend',
      followersCount: 287,
      followingCount: 156,
      workoutDays: 142,
      joinDate: '2022-03-10',
      lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      interests: ['cardio', 'nutrition', 'community']
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar: '👩‍🦱',
      rank: 3,
      points: 2445,
      level: 'Advanced',
      followersCount: 256,
      followingCount: 189,
      workoutDays: 138,
      joinDate: '2022-05-22',
      lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      interests: ['strength', 'weight-loss', 'challenges']
    },
    {
      id: 4,
      name: 'James Wilson',
      avatar: '👨‍🦲',
      rank: 4,
      points: 2180,
      level: 'Advanced',
      followersCount: 198,
      followingCount: 112,
      workoutDays: 125,
      joinDate: '2022-07-08',
      lastActivityAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      interests: ['strength', 'training']
    },
    {
      id: 5,
      name: 'Lisa Park',
      avatar: '👩‍🦯',
      rank: 5,
      points: 1956,
      level: 'Intermediate',
      followersCount: 167,
      followingCount: 94,
      workoutDays: 98,
      joinDate: '2022-09-15',
      lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      interests: ['cardio', 'flexibility', 'nutrition']
    }
  ];

  const mockKudos = [
    { id: 1, recipientId: 1, type: 'first_pr', senderId: 2, sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), message: 'Amazing lift!' },
    { id: 2, recipientId: 1, type: 'consistency', senderId: 3, sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000), message: '' },
    { id: 3, recipientId: 1, type: 'motivation', senderId: 4, sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), message: 'Your posts inspire me' },
    { id: 4, recipientId: 2, type: 'challenge_win', senderId: 1, sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), message: '' },
    { id: 5, recipientId: 2, type: 'weight_loss', senderId: 3, sentAt: new Date(Date.now() - 8 * 60 * 60 * 1000), message: 'You crushed it!' }
  ];

  // User stats
  const userStats = useMemo(() => {
    const userRank = mockMembers.find(m => m.id === userId);
    if (!userRank) return null;

    const userKudos = getTotalKudos(userId, mockKudos);
    const userLevel = getMemberLevel(userRank, mockKudos, []);

    return {
      rank: userRank.rank,
      points: userRank.points,
      kudos: userKudos,
      level: userLevel.level,
      followers: userRank.followersCount,
      trend: '+12%'
    };
  }, [userId]);

  const tabs = [
    { id: 'leaderboard', label: t('community.leaderboard') || 'Leaderboard', icon: Trophy },
    { id: 'forum', label: t('community.forum') || 'Forum', icon: MessageSquare },
    { id: 'members', label: t('community.members') || 'Members', icon: Users }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header with user stats */}
      <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} border-b border-gray-700 sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('community.title') || 'Community Hub'}
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('community.subtitle') || 'Connect, compete, and grow with your gym community'}
              </p>
            </div>
          </div>

          {/* User stats cards */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('common.rank') || 'Rank'}
                </div>
                <div className="text-xl font-bold text-yellow-400 mt-1">#{userStats.rank}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Points</div>
                <div className="text-xl font-bold text-orange-400 mt-1">{userStats.points}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Kudos</div>
                <div className="text-xl font-bold text-pink-400 mt-1">{userStats.kudos}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Level</div>
                <div className="text-lg font-bold text-purple-400 mt-1">{userStats.level}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trend</div>
                <div className="text-lg font-bold text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={16} /> {userStats.trend}
                </div>
              </motion.div>
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('common.search') || 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
              } focus:outline-none focus:ring-1 focus:ring-orange-400`}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border-b border-gray-700 sticky top-20 z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? `border-orange-400 text-orange-400`
                      : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard members={mockMembers} userId={userId} searchQuery={searchQuery} />
            </motion.div>
          )}

          {activeTab === 'forum' && (
            <motion.div
              key="forum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Forum userId={userId} searchQuery={searchQuery} />
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Members
                members={mockMembers}
                userId={userId}
                searchQuery={searchQuery}
                allKudos={mockKudos}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityPage;
