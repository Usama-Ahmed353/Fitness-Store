import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Target, Medal, Flame, Sparkles, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import ActiveChallenges from './challenges/ActiveChallenges';
import ChallengeDetail from './challenges/ChallengeDetail';
import CompletedChallenges from './challenges/CompletedChallenges';
import {
  fetchChallenges,
  fetchMyChallenges,
  joinChallenge,
  leaveChallenge,
} from '@/app/slices/challengeSlice';
import {
  generateLeaderboard,
  calculateChallengeProgress,
  getChallengeTimeRemaining,
  getChallengeBadge,
  CHALLENGE_DIFFICULTY
} from '@/utils/challengeCalculator';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list, myChallenges, loading } = useSelector((s) => s.challenges);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('active');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [fallbackChallenges] = useState([
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

  const [fallbackCompletedChallenges] = useState([
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

  React.useEffect(() => {
    dispatch(fetchChallenges({ active: true }));
    dispatch(fetchMyChallenges());
  }, [dispatch]);

  const mappedChallenges = useMemo(() => {
    const source = list.length > 0 ? list : fallbackChallenges;
    return source.map((c) => {
      const currentUserEntry = (c.participants || []).find(
        (p) => p.memberId?.userId?.toString?.() === user?.id || p.memberId?.toString?.() === user?.id
      );

      return {
        id: c._id || c.id,
        _id: c._id,
        name: c.title || c.name,
        description: c.description,
        difficulty: c.difficulty || 'MEDIUM',
        type: c.type,
        targetValue: c.goal || c.targetValue || 100,
        currentValue: currentUserEntry?.progress || c.currentValue || 0,
        startDate: c.startDate,
        endDate: c.endDate,
        participants: (c.participants || c.participants || []).map((p, i) => ({
          userId: p.memberId?.userId || p.memberId || i + 1,
          username: p.memberId?.userId?.firstName || `Member ${i + 1}`,
          currentValue: p.progress || 0,
          targetValue: c.goal || 100,
          rank: i + 1,
        })),
        rewards: c.reward ? Number(c.reward) || 50 : 50,
        badge: c.badge || '🏆',
        isCompleted: currentUserEntry?.isCompleted || false,
      };
    });
  }, [list, fallbackChallenges, user?.id]);

  const userChallenges = useMemo(
    () =>
      (myChallenges || []).map((c) => {
        const me = (c.participants || []).find((p) => !p.isCompleted) || c.participants?.[0];
        return {
          id: c._id,
          joined: true,
          currentValue: me?.progress || 0,
        };
      }),
    [myChallenges]
  );

  const completedChallenges = useMemo(() => {
    const liveCompleted = (myChallenges || [])
      .filter((c) => (c.participants || []).some((p) => p.isCompleted))
      .map((c) => ({
        id: c._id,
        name: c.title,
        difficulty: 'MEDIUM',
        completedDate: c.updatedAt || c.endDate,
        badge: '🏅',
        pointsEarned: Number(c.reward) || 25,
        timeToComplete: 0,
      }));
    return liveCompleted.length > 0 ? liveCompleted : fallbackCompletedChallenges;
  }, [myChallenges, fallbackCompletedChallenges]);

  const activeChallenges = mappedChallenges.filter(c => !completedChallenges.some(cc => cc.id === c.id));
  const userTotalPoints = completedChallenges.reduce((sum, c) => sum + c.pointsEarned, 0);
  const userRank = useMemo(() => {
    const scoreByUser = new Map();
    mappedChallenges.forEach((challenge) => {
      (challenge.participants || []).forEach((p) => {
        const id = p.userId?.toString?.() || String(p.userId);
        scoreByUser.set(id, (scoreByUser.get(id) || 0) + Number(p.currentValue || 0));
      });
    });

    const myId = String(user?.id || '');
    if (!myId || !scoreByUser.has(myId)) return '-';

    const sorted = [...scoreByUser.entries()].sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([id]) => id === myId);
    return idx >= 0 ? `#${idx + 1}` : '-';
  }, [mappedChallenges, user?.id]);

  const handleJoinChallenge = (challengeId) => {
    dispatch(joinChallenge(challengeId)).then(() => dispatch(fetchMyChallenges()));
  };

  const handleLeaveChallenge = (challengeId) => {
    dispatch(leaveChallenge(challengeId)).then(() => dispatch(fetchMyChallenges()));
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
        <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-7 mb-6 ${isDark ? 'border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900' : 'border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/20 blur-2xl" />
          <div className="absolute -left-10 -bottom-16 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`relative z-10 mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isDark
                ? 'border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="relative flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className={`text-3xl font-bold ${textColor}`}>
                {t('challenges.title', 'Fitness Challenges')}
              </h1>
              <p className={`text-sm mt-1 ${mutedColor}`}>Compete with members, climb ranks, and unlock achievement badges.</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <Flame size={12} className="text-orange-500" /> Weekly streak challenges
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <Sparkles size={12} className="text-blue-500" /> Real-time leaderboard
                </span>
              </div>
            </div>
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
            { icon: Target, label: 'Rank in Gym', value: userRank, color: 'text-blue-500' },
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
                {loading ? (
                  <p className="text-sm text-gray-400">Loading challenges...</p>
                ) : (
                <ActiveChallenges
                  challenges={activeChallenges}
                  userChallenges={userChallenges}
                  onSelectChallenge={setSelectedChallenge}
                  onJoinChallenge={handleJoinChallenge}
                  onLeaveChallenge={handleLeaveChallenge}
                />
                )}
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
