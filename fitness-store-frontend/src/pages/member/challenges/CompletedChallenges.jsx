import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function CompletedChallenges({ challenges }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();

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

  if (challenges.length === 0) {
    return (
      <div className={`p-8 rounded-lg border ${borderColor} text-center`}>
        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className={mutedColor}>No completed challenges yet. Join one and complete it to earn badges!</p>
      </div>
    );
  }

  const totalPoints = challenges.reduce((sum, c) => sum + c.pointsEarned, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className={`${bgColor} p-6 rounded-lg border ${borderColor} grid grid-cols-2 md:grid-cols-3 gap-4`}
      >
        <div>
          <p className={mutedColor}>Total Completed</p>
          <p className={`text-2xl font-bold ${textColor} mt-2`}>{challenges.length}</p>
        </div>

        <div>
          <p className={mutedColor}>Total Points Earned</p>
          <p className={`text-2xl font-bold text-yellow-400 mt-2`}>+{totalPoints}</p>
        </div>

        <div className="md:col-span-1 col-span-2">
          <p className={mutedColor}>Average Time</p>
          <p className={`text-2xl font-bold ${textColor} mt-2`}>
            {Math.round(
              challenges.reduce((sum, c) => sum + c.timeToComplete, 0) / challenges.length
            )}
            d
          </p>
        </div>
      </motion.div>

      {/* Completed Challenges Grid */}
      <div className="space-y-3">
        <p className={`text-sm ${mutedColor}`}>{challenges.length} Challenge{challenges.length !== 1 ? 's' : ''} Completed</p>

        <div className="grid gap-3">
          {challenges
            .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
            .map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                variants={itemVariants}
                className={`${bgColor} p-5 rounded-lg border ${borderColor} hover:border-gray-500 transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{challenge.badge}</span>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${textColor}`}>{challenge.name}</h3>
                        <p className={`text-sm ${mutedColor}`}>
                          {challenge.difficulty} Challenge
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className={mutedColor}>
                          {new Date(challenge.completedDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-yellow-400 font-medium">
                          +{challenge.pointsEarned} pts
                        </span>
                      </div>

                      <div className={`${cardBg} px-2 py-1 rounded text-xs`}>
                        Completed in {challenge.timeToComplete} days
                      </div>
                    </div>
                  </div>

                  {/* Completion Badge Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring' }}
                    className="text-3xl"
                  >
                    ✓
                  </motion.div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Badges Section */}
      <motion.div variants={itemVariants} className={`${bgColor} p-6 rounded-lg border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
          <Trophy className="w-5 h-5 text-yellow-500" />
          Earned Badges
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {challenges.map((challenge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`${cardBg} p-4 rounded-lg text-center hover:scale-105 transition`}
            >
              <p className="text-3xl mb-2">{challenge.badge}</p>
              <p className={`text-xs font-medium ${textColor}`}>{challenge.name}</p>
              <p className={`text-xs ${mutedColor} mt-1`}>
                {new Date(challenge.completedDate).toLocaleDateString()}
              </p>
              <p className={`text-xs text-yellow-400 font-bold mt-2`}>
                +{challenge.pointsEarned}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
