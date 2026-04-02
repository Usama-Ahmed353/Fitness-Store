import React from 'react';
import { motion } from 'framer-motion';
import { X, LogIn, LogOut, Clock, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import {
  calculateChallengeProgress,
  getChallengeTimeRemaining,
  generateLeaderboard
} from '@/utils/challengeCalculator';

export default function ChallengeDetail({
  challenge,
  isJoined,
  onJoin,
  onLeave,
  onClose
}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';

  const progress = calculateChallengeProgress(challenge.currentValue, challenge.targetValue);
  const timeRemaining = getChallengeTimeRemaining(challenge.endDate);
  const leaderboard = generateLeaderboard(challenge.participants);

  const difficultyColors = {
    EASY: 'text-green-400',
    MEDIUM: 'text-blue-400',
    HARD: 'text-orange-400',
    ELITE: 'text-purple-400'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 p-2 hover:${cardBg} rounded-lg transition`}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="space-y-4">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${textColor}`}>{challenge.name}</h2>
              <p className={`${mutedColor} mt-1`}>{challenge.description}</p>
            </div>
            <span className={`text-4xl ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty === 'EASY' && '🥉'}
              {challenge.difficulty === 'MEDIUM' && '🥈'}
              {challenge.difficulty === 'HARD' && '🥇'}
              {challenge.difficulty === 'ELITE' && '💎'}
            </span>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`${cardBg} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <p className={`text-sm font-medium ${mutedColor}`}>Time Left</p>
            </div>
            <p className={`text-xl font-bold ${textColor}`}>
              {timeRemaining.days}d {timeRemaining.hours}h
            </p>
          </div>

          <div className={`${cardBg} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              <p className={`text-sm font-medium ${mutedColor}`}>Participants</p>
            </div>
            <p className={`text-xl font-bold ${textColor}`}>{leaderboard.length}</p>
          </div>

          <div className={`${cardBg} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              <p className={`text-sm font-medium ${mutedColor}`}>Reward Points</p>
            </div>
            <p className={`text-xl font-bold text-yellow-400`}>+{challenge.rewards}</p>
          </div>
        </div>
      </div>

      {/* Your Progress (if joined) */}
      {isJoined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} p-4 rounded-lg border-2 border-green-500/50 space-y-3`}
        >
          <p className={`font-medium ${textColor}`}>Your Progress</p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${textColor}`}>
                {challenge.currentValue} / {challenge.targetValue}
              </span>
              <span className={`font-bold text-green-400`}>{progress}%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-600 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-green-500 to-green-600"
              />
            </div>
          </div>

          {progress === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm text-center font-medium"
            >
              ✓ Challenge Completed! Check back for next month's challenges.
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Leaderboard */}
      <div className="space-y-3">
        <h3 className={`text-lg font-semibold ${textColor}`}>Leaderboard</h3>

        <div className="space-y-2">
          {leaderboard.map((participant, idx) => {
            const participantProgress = calculateChallengeProgress(
              participant.currentValue,
              participant.targetValue
            );

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${cardBg} p-4 rounded-lg flex items-center justify-between`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-lg font-bold w-8 text-center ${
                    idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : textColor
                  }`}>
                    #{participant.rank}
                  </span>

                  <div className="flex-1">
                    <p className={`font-medium ${textColor}`}>{participant.username}</p>
                    <div className="w-32 h-2 rounded-full bg-gray-600 mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${participantProgress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-bold text-blue-400`}>{participantProgress}%</p>
                  <p className={`text-xs ${mutedColor}`}>
                    {participant.currentValue} / {participant.targetValue}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Challenge Details */}
      <div className={`${cardBg} p-4 rounded-lg space-y-2`}>
        <h3 className={`font-medium ${textColor}`}>Challenge Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className={mutedColor}>Type</p>
            <p className={`font-medium ${textColor} capitalize`}>{challenge.type}</p>
          </div>
          <div>
            <p className={mutedColor}>Difficulty</p>
            <p className={`font-medium ${textColor}`}>{challenge.difficulty}</p>
          </div>
          <div>
            <p className={mutedColor}>Duration</p>
            <p className={`font-medium ${textColor}`}>
              {new Date(challenge.startDate).toLocaleDateString()} to{' '}
              {new Date(challenge.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={mutedColor}>Muscle Groups</p>
            <p className={`font-medium ${textColor} capitalize`}>
              {challenge.muscleGroup?.join(', ') || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-600">
        {!isJoined ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Join Challenge
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLeave}
            className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Leave Challenge
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className={`px-4 py-3 rounded-lg font-medium transition border ${borderColor} ${textColor}`}
        >
          Close
        </motion.button>
      </div>
    </motion.div>
  );
}
