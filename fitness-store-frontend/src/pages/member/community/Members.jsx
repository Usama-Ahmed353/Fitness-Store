import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  UserPlus,
  UserCheck,
  Trophy,
  Zap,
  MessageSquare,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  KUDOS_INFO,
  sendKudos,
  getTotalKudos,
  getMemberKudos,
  getMemberLevel,
  followMember,
  unfollowMember,
  isFollowing
} from '../../../utils/socialCalculator';

const Members = ({ members = [], userId, searchQuery = '', allKudos = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('followers');
  const [filterLevel, setFilterLevel] = useState('all');
  const [userFollowing, setUserFollowing] = useState(new Set([2, 3, 5])); // Mock following data
  const [selectedMemberForKudos, setSelectedMemberForKudos] = useState(null);
  const [selectedKudosType, setSelectedKudosType] = useState(null);
  const [kudosMessage, setKudosMessage] = useState('');

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let data = [...members];

    // Filter by search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      data = data.filter(member =>
        member.name?.toLowerCase().includes(query) ||
        member.level?.toLowerCase().includes(query)
      );
    }

    // Filter by level
    if (filterLevel !== 'all') {
      data = data.filter(member =>
        member.level?.toLowerCase() === filterLevel.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case 'followers':
        return data.sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));
      case 'active':
        return data.sort((a, b) => {
          const aTime = new Date(a.lastActivityAt).getTime();
          const bTime = new Date(b.lastActivityAt).getTime();
          return bTime - aTime;
        });
      case 'kudos':
        return data.sort((a, b) => {
          const aKudos = getTotalKudos(a.id, allKudos);
          const bKudos = getTotalKudos(b.id, allKudos);
          return bKudos - aKudos;
        });
      case 'recent':
        return data.sort((a, b) => {
          const aTime = new Date(a.joinDate).getTime();
          const bTime = new Date(b.joinDate).getTime();
          return bTime - aTime;
        });
      default:
        return data;
    }
  }, [members, localSearchQuery, sortBy, filterLevel, allKudos]);

  const handleFollowToggle = (memberId) => {
    if (isFollowing(memberId, Array.from(userFollowing))) {
      setUserFollowing(unfollowMember(memberId, Array.from(userFollowing)));
    } else {
      setUserFollowing(new Set([
        ...Array.from(userFollowing),
        ...followMember(userId, memberId, Array.from(userFollowing))
      ]));
    }
  };

  const handleSendKudos = (memberId, kudosType, message = '') => {
    // In real app, would send to backend
    console.log(`Sent ${kudosType} kudos to member ${memberId}: ${message}`);
    setSelectedMemberForKudos(null);
    setSelectedKudosType(null);
    setKudosMessage('');
  };

  const isFollowingUser = (memberId) => {
    return userFollowing.has(memberId);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const sortOptions = [
    { value: 'followers', label: 'Most Followers' },
    { value: 'active', label: 'Most Active' },
    { value: 'kudos', label: 'Most Kudos' },
    { value: 'recent', label: 'Recently Joined' }
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'elite', label: 'Elite' },
    { value: 'legend', label: 'Legend' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'intermediate', label: 'Intermediate' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('members.title') || 'Community Members'}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          {/* Level Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.level') || 'Level'}
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isDark
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.sortBy') || 'Sort By'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isDark
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.searchMembers') || 'Search members...'}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-lg transition-colors text-sm ${
              isDark
                ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
            } focus:outline-none focus:ring-1 focus:ring-orange-400`}
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </motion.div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers.map((member, index) => {
            const memberKudos = getTotalKudos(member.id, allKudos);
            const memberLevel = getMemberLevel(member, allKudos, []);
            const isCurrentUser = member.id === userId;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg border overflow-hidden transition-all hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Header with rank and level badge */}
                <div className={`p-4 ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy size={18} className="text-yellow-400" />
                      <span className="font-bold text-yellow-400">
                        #{member.rank}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getLevelColor(
                        member.level
                      )}`}
                    >
                      {member.level}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6 text-center">
                  <div className="text-5xl mb-2">{member.avatar}</div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                    {isCurrentUser && <span className="text-xs text-orange-400 ml-2">(You)</span>}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Active {formatDate(member.lastActivityAt)}
                  </p>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-2 px-6 py-4 ${isDark ? 'bg-gray-700/20 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart size={14} className="text-red-400" />
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {memberKudos}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Kudos</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={14} className="text-blue-400" />
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {member.followersCount}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Followers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap size={14} className="text-orange-400" />
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {member.workoutDays}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Workouts</p>
                  </div>
                </div>

                {/* Interests/Tags */}
                {member.interests && member.interests.length > 0 && (
                  <div className="px-6 py-3 flex flex-wrap gap-2 gap-y-1">
                    {member.interests.slice(0, 2).map((interest) => (
                      <span
                        key={interest}
                        className={`text-xs px-2 py-1 rounded ${
                          isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {interest}
                      </span>
                    ))}
                    {member.interests.length > 2 && (
                      <span className={`text-xs px-2 py-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        +{member.interests.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                {!isCurrentUser && (
                  <div className="p-4 border-t border-gray-700 space-y-2">
                    {/* Follow/Unfollow Button */}
                    <motion.button
                      onClick={() => handleFollowToggle(member.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFollowingUser(member.id)
                          ? `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'} hover:${isDark ? 'bg-gray-600' : 'bg-gray-300'}`
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isFollowingUser(member.id) ? (
                        <>
                          <UserCheck size={16} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          Follow
                        </>
                      )}
                    </motion.button>

                    {/* Send Kudos Button */}
                    <motion.button
                      onClick={() => setSelectedMemberForKudos(member.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-pink-400'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:text-pink-600'
                      }`}
                    >
                      <Heart size={16} />
                      Send Kudos
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('common.noResults') || 'No members found'}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Try adjusting your filters
          </p>
        </motion.div>
      )}

      {/* Kudos Selection Modal */}
      <AnimatePresence>
        {selectedMemberForKudos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemberForKudos(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Send Kudos
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(KUDOS_INFO).map(([key, info]) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedKudosType(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg text-center transition-all border-2 ${
                      selectedKudosType === key
                        ? `${isDark ? 'bg-orange-500/20 border-orange-400' : 'bg-orange-50 border-orange-400'}`
                        : `${isDark ? 'bg-gray-700 border-gray-600 hover:border-orange-400' : 'bg-gray-100 border-gray-300 hover:border-orange-400'}`
                    }`}
                  >
                    <div className="text-2xl mb-1">{info.emoji}</div>
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {info.label}
                    </p>
                  </motion.button>
                ))}
              </div>

              {selectedKudosType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Add a message (optional)
                  </label>
                  <textarea
                    value={kudosMessage}
                    onChange={(e) => setKudosMessage(e.target.value)}
                    placeholder="Say something nice..."
                    className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none rows-3 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-400'
                    } focus:outline-none focus:ring-1 focus:ring-orange-400`}
                    rows="3"
                  />
                </motion.div>
              )}

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSelectedMemberForKudos(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (selectedKudosType) {
                      handleSendKudos(selectedMemberForKudos, selectedKudosType, kudosMessage);
                    }
                  }}
                  disabled={!selectedKudosType}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Send Kudos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to get level color
const getLevelColor = (level) => {
  const colors = {
    'Elite': 'bg-yellow-500/20 text-yellow-400',
    'Legend': 'bg-purple-500/20 text-purple-400',
    'Advanced': 'bg-blue-500/20 text-blue-400',
    'Intermediate': 'bg-green-500/20 text-green-400',
    'Active': 'bg-gray-500/20 text-gray-400',
    'Beginner': 'bg-gray-400/20 text-gray-400'
  };
  return colors[level] || 'bg-gray-500/20 text-gray-400';
};

export default Members;
