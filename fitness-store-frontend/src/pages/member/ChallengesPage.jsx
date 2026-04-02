import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Users, TrendingUp, LogIn, Target, Medal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import ActiveChallenges from './challenges/ActiveChallenges';
import ChallengeDetail from './challenges/ChallengeDetail';
import CompletedChallenges from './challenges/CompletedChallenges';
import {
  generateLeaderboard,
  calculateChallengeProgress,
  getChallengeTimeRemaining,
  getChallengeBadge,
  CHALLENGE_DIFFICULTY
} from '@/utils/challengeCalculator';

export default function ChallengesPage() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('active');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userChallenges, setUserChallenges] = useState([
    { id: 1, joined: true, currentValue: 85 },
    { id: 2, joined: false, currentValue: 0 },
    { id: 3, joined: true, currentValue: 120 }
  ]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      name: 'Bench Press Master',
      description: 'Increase your bench press max by 25 lbs',
      type: 'strength',
      difficulty: 'HARD',
      muscleGroup: ['chest'],
      targetValue: 100,
      currentValue: 85,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      participants: [
        { userId: 1, username: 'You', currentValue: 85, targetValue: 100, rank: 1 },
        { userId: 2, username: 'John', currentValue: 75, targetValue: 100, rank: 2 },
        { userId: 3, username: 'Sarah', currentValue: 50, targetValue: 100, rank: 3 }
      ],
      rewards: 50,
      badge: '🥇 Bench King'
    },
    {
      id: 2,
      name: 'Squat Strength',
      description: 'Hit 405 lbs on squat',
      type: 'strength',
      difficulty: 'ELITE',
      muscleGroup: ['legs'],
      targetValue: 405,
      currentValue: 285,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      participants: [
        { userId: 2, username: 'John', currentValue: 350, targetValue: 405, rank: 1 },
        { userId: 1, username: 'You', currentValue: 285, targetValue: 405, rank: 2 },
        { userId: 4, username: 'Mike', currentValue: 225, targetValue: 405, rank: 3 }
      ],
      rewards: 100,
      badge: '💎 Squat Master'
    },
    {
      id: 3,
      name: 'Consistency Warrior',
      description: 'Log 12 workouts in 4 weeks',
      type: 'sessions',
      difficulty: 'MEDIUM',
      targetValue: 12,
      currentValue: 8,
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      participants: [
        { userId: 1, username: 'You', currentValue: 8, targetValue: 12, rank: 1 },
        { userId: 3, username: 'Sarah', currentValue: 7, targetValue: 12, rank: 2 },
        { userId: 5, username: 'Alex', currentValue: 5, targetValue: 12, rank: 3 }
      ],
      rewards: 25,
      badge: '🥈 Consistent'
    }
  ]);

  const [completedChallenges, setCompletedChallenges] = useState([
    {
      id: 101,
      name: 'Deadlift Confidence',
      difficulty: 'MEDIUM',
      completedDate: '2024-02-20',
      badge: '🥈 Deadlift Pro',
      pointsEarned: 25,
      timeToComplete: 18
    },
    {
      id: 102,
      name: 'January Warrior',
      difficulty: 'EASY',
      completedDate: '2024-02-05',
      badge: '🥉 Starter',
      pointsEarned: 10,
      timeToComplete: 25
    }
  ]);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';

  const activeChallenges = challenges.filter(c => !completedChallenges.some(cc => cc.id === c.id));
  const userTotalPoints = completedChallenges.reduce((sum, c) => sum + c.pointsEarned, 0);
  const userRank = Math.floor(Math.random() * 1000) + 1;

  const handleJoinChallenge = (challengeId) => {
    setUserChallenges(prev => [...prev, { id: challengeId, joined: true, currentValue: 0 }]);
  };

  const handleLeaveChallenge = (challengeId) => {
    setUserChallenges(prev => prev.filter(uc => uc.id !== challengeId));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const tabs = [
    { id: 'active', label: 'Active Challenges', icon: <Zap /> },
    { id: 'completed', label: 'Completed', icon: <Medal /> }
  ];

  return (
    <div className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className={`text-3xl font-bold ${textColor}`}>
              {t('challenges.title', 'Fitness Challenges')}
            </h1>
          </div>
        </div>

        {/* User Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { icon: Trophy, label: 'Total Points', value: userTotalPoints, color: 'text-yellow-500' },
            { icon: Target, label: 'Rank in Gym', value: `#${userRank}`, color: 'text-blue-500' },
            { icon: Medal, label: 'Challenges Won', value: completedChallenges.length, color: 'text-green-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className={`${cardBg} p-4 rounded-lg border ${borderColor}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={mutedColor}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${textColor} mt-2`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Selected Challenge Detail */}
      {selectedChallenge && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`${cardBg} rounded-xl border ${borderColor} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <ChallengeDetail
                challenge={selectedChallenge}
                isJoined={userChallenges.some(uc => uc.id === selectedChallenge.id)}
                onJoin={() => {
                  handleJoinChallenge(selectedChallenge.id);
                  setSelectedChallenge(null);
                }}
                onLeave={() => {
                  handleLeaveChallenge(selectedChallenge.id);
                  setSelectedChallenge(null);
                }}
                onClose={() => setSelectedChallenge(null)}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Tabs */}
      <div className={`${cardBg} rounded-lg border ${borderColor} mb-6`}>
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 md:px-6 md:py-4 flex items-center justify-center gap-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-500'
                  : `border-transparent ${mutedColor} hover:text-gray-300`
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'active' && (
              <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ActiveChallenges
                  challenges={activeChallenges}
                  userChallenges={userChallenges}
                  onSelectChallenge={setSelectedChallenge}
                  onJoinChallenge={handleJoinChallenge}
                  onLeaveChallenge={handleLeaveChallenge}
                />
              </motion.div>
            )}

            {activeTab === 'completed' && (
              <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CompletedChallenges challenges={completedChallenges} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
