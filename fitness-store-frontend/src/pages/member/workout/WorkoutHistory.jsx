import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, List, BarChart3, TrendingUp, Dumbbell, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { analyzeMuscleGroupTrend } from '@/utils/workoutCalculator';

export default function WorkoutHistory({ workoutHistory }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('list');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  // Group workouts by date
  const workoutsByDate = useMemo(() => {
    const grouped = {};
    workoutHistory.forEach(workout => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(workout);
    });
    return grouped;
  }, [workoutHistory]);

  // Get all unique muscle groups
  const allMuscleGroups = useMemo(() => {
    const groups = new Set();
    workoutHistory.forEach(w => {
      w.exercises.forEach(e => {
        if (e.muscleGroup !== 'cardio') groups.add(e.muscleGroup);
      });
    });
    return Array.from(groups);
  }, [workoutHistory]);

  // Muscle group trends
  const muscleGroupTrends = useMemo(() => {
    const trends = {};
    allMuscleGroups.forEach(group => {
      trends[group] = analyzeMuscleGroupTrend(workoutHistory, group);
    });
    return trends;
  }, [allMuscleGroups, workoutHistory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Generate calendar
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : `border ${borderColor} ${mutedColor} hover:text-gray-300`
          }`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'calendar'
              ? 'bg-blue-500 text-white'
              : `border ${borderColor} ${mutedColor} hover:text-gray-300`
          }`}
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'analytics'
              ? 'bg-blue-500 text-white'
              : `border ${borderColor} ${mutedColor} hover:text-gray-300`
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
      </motion.div>

      {/* List View */}
      {viewMode === 'list' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {Object.entries(workoutsByDate)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, workouts]) => (
              <motion.div key={date} variants={itemVariants} className="space-y-3">
                <h3 className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
                  <Calendar className="w-5 h-5 text-blue-500" />
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>

                {workouts.map((workout, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${bgColor} p-4 rounded-lg border ${borderColor} space-y-3`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-lg font-semibold ${textColor}`}>
                          {workout.exercises.length} Exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        {workout.tonnage && (
                          <p className={`${textColor} font-semibold`}>{workout.tonnage.toLocaleString()} lbs</p>
                        )}
                        {workout.duration && (
                          <p className={`${mutedColor} text-sm`}>{workout.duration} min</p>
                        )}
                      </div>
                    </div>

                    {/* Exercises in this workout */}
                    <div className="grid gap-2">
                      {workout.exercises.map((exercise, eIdx) => (
                        <div key={eIdx} className={`p-3 rounded ${cardBg} flex items-center justify-between`}>
                          <div className="flex-1">
                            <p className={`font-medium ${textColor}`}>{exercise.name}</p>
                            <p className={`text-sm ${mutedColor}`}>
                              {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''} •{' '}
                              {exercise.sets.map(s => s.reps).join(', ')} reps
                              {exercise.sets[0]?.weight && ` • ${exercise.sets[0]?.weight} lbs`}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400`}>
                            {exercise.muscleGroup}
                          </span>
                        </div>
                      ))}
                    </div>

                    {workout.notes && (
                      <div className={`p-2 rounded border-l-2 border-orange-500 ${cardBg} text-sm`}>
                        <p className={mutedColor}>{workout.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ))}
        </motion.div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${bgColor} p-6 rounded-lg border ${borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${textColor}`}>
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                className={`px-3 py-1 rounded border ${borderColor} ${mutedColor} hover:text-gray-300`}
              >
                ←
              </button>
              <button
                onClick={() => setSelectedMonth(new Date())}
                className={`px-3 py-1 rounded border ${borderColor} ${mutedColor} hover:text-gray-300`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                className={`px-3 py-1 rounded border ${borderColor} ${mutedColor} hover:text-gray-300`}
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={`text-center text-sm font-medium ${mutedColor}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {Array(getFirstDayOfMonth(selectedMonth))
                .fill(null)
                .map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}

              {Array(getDaysInMonth(selectedMonth))
                .fill(null)
                .map((_, idx) => {
                  const day = idx + 1;
                  const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasWorkout = dateStr in workoutsByDate;

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-lg border ${
                        hasWorkout
                          ? 'bg-green-500/20 border-green-500 cursor-pointer'
                          : `${cardBg} border ${borderColor}`
                      } flex items-center justify-center relative group`}
                    >
                      <p className={`text-sm font-medium ${textColor}`}>{day}</p>
                      {hasWorkout && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Dumbbell className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Muscle Group Trends */}
          <div className={`${bgColor} p-6 rounded-lg border ${borderColor}`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Muscle Group Trends (30 Days)
            </h3>

            <div className="space-y-4">
              {allMuscleGroups.map(group => {
                const trend = muscleGroupTrends[group];
                const trendColor =
                  trend.trend === 'increasing'
                    ? 'text-green-400'
                    : trend.trend === 'decreasing'
                    ? 'text-red-400'
                    : 'text-yellow-400';

                return (
                  <motion.div
                    key={group}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg ${cardBg} flex items-center justify-between`}
                  >
                    <div className="flex-1">
                      <p className={`font-medium ${textColor} capitalize`}>{group}</p>
                      <p className={`text-sm ${mutedColor}`}>
                        {trend.sessionsPerWeek} sessions/week • {trend.totalVolume} total reps
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold capitalize ${trendColor}`}>{trend.trend}</p>
                      <p className={`text-sm ${mutedColor}`}>Avg: {trend.avgVolumePerSession} reps/session</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Total Workouts (30d)', value: Object.keys(workoutsByDate).length, color: 'text-blue-500' },
              {
                label: 'Total Volume',
                value: workoutHistory.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + (set.reps || 0), 0), 0), 0),
                color: 'text-purple-500'
              },
              {
                label: 'Total Tonnage',
                value: `${workoutHistory.reduce((sum, w) => sum + (w.tonnage || 0), 0).toLocaleString()} lbs`,
                color: 'text-red-500'
              },
              {
                label: 'Avg Workout Duration',
                value: `${Math.round(workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0) / workoutHistory.length)} min`,
                color: 'text-green-500'
              }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${bgColor} p-4 rounded-lg border ${borderColor}`}>
                <p className={mutedColor}>{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {workoutHistory.length === 0 && (
        <div className={`p-8 rounded-lg border ${borderColor} text-center`}>
          <p className={mutedColor}>No workouts logged yet. Start logging to see your history!</p>
        </div>
      )}
    </div>
  );
}
