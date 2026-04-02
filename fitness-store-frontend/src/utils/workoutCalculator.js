/**
 * Workout Calculator Utilities
 * Functions for volume calculation, tonnage, PRs, and workout analytics
 */

import { calculateTonnage, calculateVolume } from './exerciseDatabase';

// Calculate total tonnage for a workout
export const calculateWorkoutTonnage = (exercises) => {
  return exercises.reduce((total, exercise) => {
    const exerciseTonnage = exercise.sets.reduce((setTotal, set) => {
      return setTotal + calculateTonnage(1, set.reps, set.weight);
    }, 0);
    return total + exerciseTonnage;
  }, 0);
};

// Calculate total volume for a workout
export const calculateWorkoutVolume = (exercises) => {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + calculateVolume(1, set.reps);
    }, 0);
    return total + exerciseVolume;
  }, 0);
};

// Calculate workout duration in minutes
export const calculateWorkoutDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / (1000 * 60)); // minutes
};

// Calculate average rep max (1RM) estimation using Epley formula
export const estimateOneRepMax = (weight, reps) => {
  if (reps === 1) return weight;
  // 1RM = weight × (1 + reps / 30)
  return weight * (1 + reps / 30);
};

// Calculate rest time recommendation based on exercise type and weight
export const recommendRestTime = (exerciseType, intensity = 'moderate') => {
  const restTimes = {
    strength: { light: 60, moderate: 90, intense: 180 }, // seconds
    hypertrophy: { light: 45, moderate: 60, intense: 90 },
    endurance: { light: 30, moderate: 45, intense: 60 }
  };
  return restTimes[exerciseType]?.[intensity] || 60;
};

// Get workout intensity level based on metrics
export const getWorkoutIntensity = (tonnage, volume, avgReps) => {
  if (tonnage > 10000) return 'very-high';
  if (tonnage > 7000) return 'high';
  if (tonnage > 4000) return 'moderate';
  return 'light';
};

// Calculate Personal Record (PR)
export const calculatePR = (weight, reps, previousPRs = []) => {
  const currentOneRM = estimateOneRepMax(weight, reps);

  if (previousPRs.length === 0) {
    return { isPR: true, prType: '1RM', value: currentOneRM, improvement: currentOneRM };
  }

  const previousBest = Math.max(...previousPRs.map(pr => pr.oneRM || 0));

  if (currentOneRM > previousBest) {
    return {
      isPR: true,
      prType: '1RM',
      value: currentOneRM,
      improvement: (currentOneRM - previousBest).toFixed(2),
      percentImprovement: (((currentOneRM - previousBest) / previousBest) * 100).toFixed(2)
    };
  }

  return { isPR: false };
};

// Analyze workout trends for a muscle group
export const analyzeMuscleGroupTrend = (workoutHistory, muscleGroup, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const relevantWorkouts = workoutHistory.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= cutoffDate && w.exercises.some(e => e.muscleGroup === muscleGroup);
  });

  if (relevantWorkouts.length === 0) {
    return { trend: 'no-data', sessionsPerWeek: 0, totalVolume: 0 };
  }

  const totalVolume = relevantWorkouts.reduce((sum, w) => {
    const muscleGroupVolume = w.exercises
      .filter(e => e.muscleGroup === muscleGroup)
      .reduce((total, e) => {
        return total + e.sets.reduce((st, s) => st + s.reps, 0);
      }, 0);
    return sum + muscleGroupVolume;
  }, 0);

  const avgVolumePerSession = totalVolume / relevantWorkouts.length;
  const sessionsPerWeek = (relevantWorkouts.length / days) * 7;

  // Simple trend analysis: compare first week to last week
  const firstWeekWorkouts = relevantWorkouts.slice(0, Math.ceil(relevantWorkouts.length / 2));
  const lastWeekWorkouts = relevantWorkouts.slice(Math.ceil(relevantWorkouts.length / 2));

  const firstWeekVolume = firstWeekWorkouts.reduce((sum, w) => {
    return sum + w.exercises
      .filter(e => e.muscleGroup === muscleGroup)
      .reduce((total, e) => total + e.sets.reduce((st, s) => st + s.reps, 0), 0);
  }, 0);

  const lastWeekVolume = lastWeekWorkouts.reduce((sum, w) => {
    return sum + w.exercises
      .filter(e => e.muscleGroup === muscleGroup)
      .reduce((total, e) => total + e.sets.reduce((st, s) => st + s.reps, 0), 0);
  }, 0);

  let trend = 'stable';
  if (lastWeekVolume > firstWeekVolume * 1.1) trend = 'increasing';
  if (lastWeekVolume < firstWeekVolume * 0.9) trend = 'decreasing';

  return {
    trend,
    sessionsPerWeek: sessionsPerWeek.toFixed(1),
    totalVolume,
    avgVolumePerSession: avgVolumePerSession.toFixed(0),
    weekCount: (days / 7).toFixed(1)
  };
};

// Generate workout split recommendations
export const recommendWorkoutSplit = (fitnessLevel, daysPerWeek) => {
  const splits = {
    beginner: {
      3: ['Full Body A', 'Full Body B', 'Full Body C'],
      4: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
      5: ['Chest/Triceps', 'Back/Biceps', 'Legs', 'Shoulders', 'Full Body']
    },
    intermediate: {
      3: ['Push', 'Pull', 'Legs'],
      4: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
      5: ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms'],
      6: ['Push A', 'Pull A', 'Legs A', 'Push B', 'Pull B', 'Legs B']
    },
    advanced: {
      4: ['Upper Power', 'Lower Power', 'Upper Hypertrophy', 'Lower Hypertrophy'],
      5: ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms'],
      6: ['Push A', 'Pull A', 'Legs A', 'Push B', 'Pull B', 'Legs B'],
      7: ['PPL x2 + Rest']
    }
  };

  return splits[fitnessLevel]?.[daysPerWeek] || ['Custom Split'];
};

// Calculate progressive overload suggestions
export const getProgressiveOverloadSuggestions = (exerciseHistory) => {
  if (exerciseHistory.length < 2) {
    return ['Start tracking weights to get progression suggestions'];
  }

  const suggestions = [];
  const currentWorkout = exerciseHistory[exerciseHistory.length - 1];
  const previousWorkout = exerciseHistory[exerciseHistory.length - 2];

  if (!currentWorkout.sets[0] || !previousWorkout.sets[0]) {
    return suggestions;
  }

  const weightIncrease = currentWorkout.sets[0].weight - previousWorkout.sets[0].weight;
  const repIncrease = currentWorkout.sets[0].reps - previousWorkout.sets[0].reps;

  if (weightIncrease > 0) {
    suggestions.push(`✓ Weight increased by ${weightIncrease} lbs/kg`);
  } else if (repIncrease > 0) {
    suggestions.push(`✓ Reps increased by ${repIncrease}`);
    suggestions.push('Next time: try increasing weight while maintaining reps');
  } else {
    suggestions.push('Maintain current weight and focus on form');
    suggestions.push('Next session: aim to add 1-2 reps or 2.5-5 lbs');
  }

  return suggestions;
};

// Format workout duration display
export const formatWorkoutDuration = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Calculate estimated daily calorie burn from workout
export const calculateWorkoutCaloriesBurned = (tonnage, duration, intensity = 'moderate') => {
  // Rough estimate: ~1 calorie per 10 lbs of tonnage + cardio component
  const tonnageCalories = Math.round(tonnage / 10);

  // Add duration-based cardio estimate
  const durationMultiplier = {
    light: 3,
    moderate: 5,
    intense: 8
  };

  const durationCalories = (duration / 60) * (durationMultiplier[intensity] || 5) * 60; // kcal/hour

  return Math.round(tonnageCalories + durationCalories);
};

// Generate streak statistics
export const calculateStreak = (workoutDates) => {
  if (workoutDates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = workoutDates.map(d => new Date(d)).sort((a, b) => a - b);

  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const dayDifference = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (dayDifference === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (dayDifference > 1) {
      currentStreak = 1;
    }
  }

  // Check if today is part of current streak
  const today = new Date();
  const lastWorkout = new Date(sortedDates[sortedDates.length - 1]);
  const daysSinceLastWorkout = (today - lastWorkout) / (1000 * 60 * 60 * 24);

  if (daysSinceLastWorkout > 1) {
    currentStreak = 0;
  }

  return { current: currentStreak, longest: longestStreak };
};
