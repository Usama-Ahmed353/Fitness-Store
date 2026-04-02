import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Calendar, ListChecks, TrendingUp, Plus, Heart,
  Trophy, Clock, Zap, BarChart3, Edit3
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import LogWorkout from './workout/LogWorkout';
import ExerciseLibrary from './workout/ExerciseLibrary';
import WorkoutTemplates from './workout/WorkoutTemplates';
import WorkoutHistory from './workout/WorkoutHistory';
import { calculateWorkoutTonnage, calculateWorkoutDuration } from '@/utils/workoutCalculator';

export default function WorkoutLogPage() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('log');
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: null,
    endTime: null,
    exercises: [],
    notes: '',
    template: null
  });

  const [workoutHistory, setWorkoutHistory] = useState([
    {
      id: 1,
      date: '2024-02-24',
      exercises: [
        { name: 'Bench Press', muscleGroup: 'chest', sets: [{ reps: 8, weight: 225 }, { reps: 6, weight: 235 }, { reps: 5, weight: 240 }] },
        { name: 'Incline Dumbbell Press', muscleGroup: 'chest', sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }] }
      ],
      duration: 45,
      tonnage: 5200,
      notes: 'Great strength session'
    },
    {
      id: 2,
      date: '2024-02-23',
      exercises: [
        { name: 'Deadlift', muscleGroup: 'back', sets: [{ reps: 5, weight: 315 }, { reps: 3, weight: 325 }] },
        { name: 'Barbell Row', muscleGroup: 'back', sets: [{ reps: 8, weight: 235 }, { reps: 6, weight: 245 }] }
      ],
      duration: 50,
      tonnage: 5890,
      notes: 'Good back day'
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Upper Body A',
      exercises: [
        { name: 'Bench Press', muscleGroup: 'chest', target: { sets: 4, reps: 6 } },
        { name: 'Barbell Row', muscleGroup: 'back', target: { sets: 4, reps: 6 } },
        { name: 'Shoulder Press', muscleGroup: 'shoulders', target: { sets: 3, reps: 8 } }
      ]
    },
    {
      id: 2,
      name: 'Lower Body A',
      exercises: [
        { name: 'Squat', muscleGroup: 'quads', target: { sets: 4, reps: 6 } },
        { name: 'Deadlift', muscleGroup: 'back', target: { sets: 3, reps: 3 } },
        { name: 'Leg Press', muscleGroup: 'quads', target: { sets: 3, reps: 10 } }
      ]
    }
  ]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);
  const [currentStats, setCurrentStats] = useState({
    totalWorkouts: workoutHistory.length,
    weeklyVolume: 12450,
    thisMonthTonnage: 45230,
    personalRecords: 8
  });

  const handleAddExercise = useCallback((exercise) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, sets: [{ reps: 8, weight: 0 }] }]
    }));
  }, []);

  const handleUpdateExercise = useCallback((index, updates) => {
    setWorkoutData(prev => {
      const newExercises = [...prev.exercises];
      newExercises[index] = { ...newExercises[index], ...updates };
      return { ...prev, exercises: newExercises };
    });
  }, []);

  const handleAddSet = useCallback((exerciseIndex) => {
    setWorkoutData(prev => {
      const newExercises = [...prev.exercises];
      const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
      newExercises[exerciseIndex].sets.push({ ...lastSet });
      return { ...prev, exercises: newExercises };
    });
  }, []);

  const handleRemoveExercise = useCallback((index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSaveWorkout = useCallback(() => {
    if (workoutData.exercises.length === 0) return;

    const tonnage = calculateWorkoutTonnage(workoutData.exercises);
    const duration = workoutData.startTime && workoutData.endTime
      ? calculateWorkoutDuration(workoutData.startTime, workoutData.endTime)
      : 0;

    const newSession = {
      id: workoutHistory.length + 1,
      date: workoutData.date,
      exercises: workoutData.exercises,
      tonnage,
      duration,
      notes: workoutData.notes
    };

    setWorkoutHistory(prev => [newSession, ...prev]);
    setWorkoutData({
      date: new Date().toISOString().split('T')[0],
      startTime: null,
      endTime: null,
      exercises: [],
      notes: '',
      template: null
    });

    setShowLogModal(false);
  }, [workoutData, workoutHistory.length]);

  const handleLoadTemplate = useCallback((template) => {
    const exercises = template.exercises.map(e => ({
      ...e,
      sets: [{ reps: e.target.reps, weight: 0 }]
    }));
    setWorkoutData(prev => ({ ...prev, exercises, template: template.id }));
    setActiveTab('log');
  }, []);

  const handleSaveTemplate = useCallback((name) => {
    const newTemplate = {
      id: templates.length + 1,
      name,
      exercises: workoutData.exercises.map(e => ({
        name: e.name,
        muscleGroup: e.muscleGroup,
        target: { sets: e.sets.length, reps: e.sets[0]?.reps || 8 }
      }))
    };
    setTemplates(prev => [...prev, newTemplate]);
  }, [workoutData.exercises, templates.length]);

  const tabs = [
    { id: 'log', label: 'Log Workout', icon: <Plus /> },
    { id: 'library', label: 'Exercise Library', icon: <ListChecks /> },
    { id: 'templates', label: 'Templates', icon: <Edit3 /> },
    { id: 'history', label: 'History', icon: <Calendar /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';

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
            <Activity className="w-8 h-8 text-orange-500" />
            <h1 className={`text-3xl font-bold ${textColor}`}>
              {t('workout.title', 'Workout Logger')}
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowLogModal(true);
              setActiveTab('log');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            New Workout
          </motion.button>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: Trophy, label: 'Total Workouts', value: currentStats.totalWorkouts, color: 'text-blue-500' },
            { icon: Zap, label: 'Weekly Volume', value: `${currentStats.weeklyVolume} reps`, color: 'text-green-500' },
            { icon: TrendingUp, label: 'This Month', value: `${currentStats.thisMonthTonnage} lbs`, color: 'text-purple-500' },
            { icon: Heart, label: 'Personal Records', value: currentStats.personalRecords, color: 'text-red-500' }
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

      {/* Tabs */}
      <div className={`${cardBg} rounded-lg border ${borderColor} mb-6`}>
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 md:px-6 md:py-4 flex items-center justify-center gap-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-500'
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
            {activeTab === 'log' && (
              <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LogWorkout
                  workoutData={workoutData}
                  onAddExercise={handleAddExercise}
                  onUpdateExercise={handleUpdateExercise}
                  onAddSet={handleAddSet}
                  onRemoveExercise={handleRemoveExercise}
                  onSave={handleSaveWorkout}
                  onSaveTemplate={handleSaveTemplate}
                />
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ExerciseLibrary onSelectExercise={handleAddExercise} />
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WorkoutTemplates templates={templates} onLoadTemplate={handleLoadTemplate} />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WorkoutHistory workoutHistory={workoutHistory} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
