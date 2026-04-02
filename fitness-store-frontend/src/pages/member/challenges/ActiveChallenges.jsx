import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Clock, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { calculateChallengeProgress, getChallengeTimeRemaining, getChallengeBadge, generateLeaderboard } from '@/utils/challengeCalculator';

export default function ActiveChallenges({
  challenges,
  userChallenges,
  onSelectChallenge,
  onJoinChallenge,
  onLeaveChallenge
}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const difficultyColors = {
    EASY: 'from-green-500/20 to-green-600/20 border-green-500/30',
    MEDIUM: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    HARD: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    ELITE: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  };

  const difficultyTextColors = {
    EASY: 'text-green-400',
    MEDIUM: 'text-blue-400',
    HARD: 'text-orange-400',
    ELITE: 'text-purple-400'
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {challenges.length === 0 ? (
        <div className={`p-8 rounded-lg border ${borderColor} text-center`}>
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className={mutedColor}>No active challenges available right now.</p>
        </div>
      ) : (
        challenges.map(challenge => {
          const isJoined = userChallenges.some(uc => uc.id === challenge.id);
          const progress = calculateChallengeProgress(challenge.currentValue, challenge.targetValue);
          const timeRemaining = getChallengeTimeRemaining(challenge.endDate);
          const leaderboard = generateLeaderboard(challenge.participants);

          return (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              className={`bg-gradient-to-r ${
                difficultyColors[challenge.difficulty]
              } rounded-lg p-6 border-2 transition hover:shadow-lg cursor-pointer`}
              onClick={() => onSelectChallenge(challenge)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-bold ${textColor}`}>{challenge.name}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                      difficultyTextColors[challenge.difficulty]
                    } bg-black/20`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className={`${mutedColor} text-sm`}>{challenge.description}</p>
                </div>

                <div className="text-right font-bold">
                  <p className={`${difficultyTextColors[challenge.difficulty]} text-2xl`}>
                    {getChallengeBadge(challenge.difficulty)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${textColor}`}>
                    {challenge.currentValue} / {challenge.targetValue}
                  </span>
                  <span className={`text-sm font-bold ${
                    progress === 100 ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {progress}%
                  </span>
                </div>

                <div className={`w-full h-3 rounded-full overflow-hidden ${cardBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full transition-all ${
                      progress === 100
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className={`${cardBg} p-3 rounded-lg text-center`}>
                  <Clock className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className={`text-sm font-bold ${textColor}`}>
                    {timeRemaining.days}d {timeRemaining.hours}h
                  </p>
                  <p className={`text-xs ${mutedColor}`}>Time Left</p>
                </div>

                <div className={`${cardBg} p-3 rounded-lg text-center`}>
                  <Users className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className={`text-sm font-bold ${textColor}`}>{leaderboard.length}</p>
                  <p className={`text-xs ${mutedColor}`}>Participants</p>
                </div>

                <div className={`${cardBg} p-3 rounded-lg text-center`}>
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className={`text-sm font-bold text-yellow-400`}>+{challenge.rewards}</p>
                  <p className={`text-xs ${mutedColor}`}>Points</p>
                </div>
              </div>

              {/* Leaderboard Preview */}
              {expandedId === challenge.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 pt-4 border-t border-gray-600 space-y-2`}
                >
                  <p className={`text-sm font-medium ${textColor} mb-3`}>Top Performers</p>
                  {leaderboard.slice(0, 3).map((participant, idx) => (
                    <div key={idx} className={`flex items-center justify-between ${cardBg} p-2 rounded`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : 'text-orange-600'
                        }`}>
                          #{participant.rank}
                        </span>
                        <span className={`text-sm ${textColor}`}>{participant.username}</span>
                      </div>
                      <span className={`text-sm font-bold text-blue-400`}>
                        {calculateChallengeProgress(participant.currentValue, participant.targetValue)}%
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expandedId === challenge.id ? null : challenge.id);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition ${
                    expandedId === challenge.id
                      ? 'bg-blue-500 text-white'
                      : `${cardBg} ${textColor} hover:bg-gray-600`
                  }`}
                >
                  {expandedId === challenge.id ? 'Hide' : 'Leaderboard'}
                </button>

                {!isJoined ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinChallenge(challenge.id);
                    }}
                    className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Join
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaveChallenge(challenge.id);
                    }}
                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium text-sm transition"
                  >
                    Leave
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}
