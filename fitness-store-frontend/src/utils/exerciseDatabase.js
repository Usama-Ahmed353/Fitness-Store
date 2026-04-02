/**
 * Exercise Database
 * Comprehensive exercise library with muscle groups, equipment, and properties
 */

export const EXERCISE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility'
};

export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  FOREARMS: 'forearms',
  LEGS: 'legs',
  QUADS: 'quads',
  HAMSTRINGS: 'hamstrings',
  GLUTES: 'glutes',
  CALVES: 'calves',
  ABS: 'abs',
  FULL_BODY: 'full_body',
  CARDIO: 'cardio'
};

export const CARDIO_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Rowing',
  'Elliptical',
  'Treadmill',
  'Stair Climber',
  'Jump Rope',
  'Walking',
  'HIIT',
  'CrossTraining',
  'Hiking'
];

export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Resistance Band',
  'Medicine Ball',
  'TRX',
  'Plate'
];

// Comprehensive strength exercise library
export const STRENGTH_EXERCISES = [
  // Chest
  { id: 'bench_press', name: 'Barbell Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'dumbbell_bench', name: 'Dumbbell Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'incline_bench', name: 'Incline Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'decline_bench', name: 'Decline Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'machine_chest', name: 'Chest Press Machine', category: 'strength', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner' },
  { id: 'cable_fly', name: 'Cable Fly', category: 'strength', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate' },
  { id: 'dumbbell_fly', name: 'Dumbbell Fly', category: 'strength', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'push_ups', name: 'Push Ups', category: 'strength', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },

  // Back
  { id: 'deadlift', name: 'Deadlift', category: 'strength', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
  { id: 'barbell_row', name: 'Barbell Bent Row', category: 'strength', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'dumbbell_row', name: 'Dumbbell Row', category: 'strength', muscleGroup: 'back', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'pull_ups', name: 'Pull Ups', category: 'strength', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', category: 'strength', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { id: 'cable_row', name: 'Cable Row', category: 'strength', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { id: 'machine_row', name: 'Machine Row', category: 'strength', muscleGroup: 'back', equipment: 'machine', difficulty: 'beginner' },

  // Shoulders
  { id: 'shoulder_press', name: 'Barbell Shoulder Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'dumbbell_press', name: 'Dumbbell Shoulder Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'lateral_raise', name: 'Lateral Raise', category: 'strength', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'machine_shoulder', name: 'Shoulder Press Machine', category: 'strength', muscleGroup: 'shoulders', equipment: 'machine', difficulty: 'beginner' },
  { id: 'upright_row', name: 'Upright Row', category: 'strength', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },

  // Arms - Biceps
  { id: 'barbell_curl', name: 'Barbell Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'beginner' },
  { id: 'dumbbell_curl', name: 'Dumbbell Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'cable_curl', name: 'Cable Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'beginner' },
  { id: 'hammer_curl', name: 'Hammer Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner' },

  // Arms - Triceps
  { id: 'tricep_dips', name: 'Tricep Dips', category: 'strength', muscleGroup: 'triceps', equipment: 'bodyweight', difficulty: 'intermediate' },
  { id: 'rope_pushdown', name: 'Rope Pushdown', category: 'strength', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner' },
  { id: 'close_grip_bench', name: 'Close Grip Bench Press', category: 'strength', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'tricep_extension', name: 'Tricep Extension', category: 'strength', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'beginner' },

  // Legs
  { id: 'squat', name: 'Barbell Squat', category: 'strength', muscleGroup: 'quads', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'leg_press', name: 'Leg Press', category: 'strength', muscleGroup: 'quads', equipment: 'machine', difficulty: 'beginner' },
  { id: 'leg_extension', name: 'Leg Extension', category: 'strength', muscleGroup: 'quads', equipment: 'machine', difficulty: 'beginner' },
  { id: 'leg_curl', name: 'Leg Curl', category: 'strength', muscleGroup: 'hamstrings', equipment: 'machine', difficulty: 'beginner' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', category: 'strength', muscleGroup: 'hamstrings', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'dumbbell_squat', name: 'Dumbbell Goblet Squat', category: 'strength', muscleGroup: 'quads', equipment: 'dumbbell', difficulty: 'beginner' },

  // Glutes
  { id: 'hip_thrust', name: 'Barbell Hip Thrust', category: 'strength', muscleGroup: 'glutes', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'glute_bridge', name: 'Glute Bridge', category: 'strength', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'leg_press_glute', name: 'Leg Press (Glute Focus)', category: 'strength', muscleGroup: 'glutes', equipment: 'machine', difficulty: 'beginner' },

  // Abs/Core
  { id: 'barbell_ab_wheel', name: 'Ab Wheel Rollout', category: 'strength', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'advanced' },
  { id: 'cable_crunch', name: 'Cable Crunch', category: 'strength', muscleGroup: 'abs', equipment: 'cable', difficulty: 'beginner' },
  { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', category: 'strength', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate' },
  { id: 'plank', name: 'Plank', category: 'strength', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner' },

  // Calves
  { id: 'calf_raise', name: 'Standing Calf Raise', category: 'strength', muscleGroup: 'calves', equipment: 'barbell', difficulty: 'beginner' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', category: 'strength', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner' },
];

// Get all exercises with optional filter
export const getExercises = (filter = {}) => {
  let exercises = [...STRENGTH_EXERCISES];

  if (filter.muscleGroup) {
    exercises = exercises.filter(e => e.muscleGroup === filter.muscleGroup);
  }

  if (filter.equipment) {
    exercises = exercises.filter(e => e.equipment === filter.equipment);
  }

  if (filter.difficulty) {
    exercises = exercises.filter(e => e.difficulty === filter.difficulty);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    exercises = exercises.filter(e =>
      e.name.toLowerCase().includes(searchLower) ||
      e.muscleGroup.toLowerCase().includes(searchLower)
    );
  }

  return exercises;
};

// Get exercise by ID
export const getExerciseById = (id) => {
  return STRENGTH_EXERCISES.find(e => e.id === id);
};

// Get exercises by muscle group
export const getExercisesByMuscleGroup = (muscleGroup) => {
  return STRENGTH_EXERCISES.filter(e => e.muscleGroup === muscleGroup);
};

// Calculate tonnage (total weight moved)
export const calculateTonnage = (sets, reps, weight) => {
  // tonnage = sets × reps × weight (lbs/kg)
  if (!sets || !reps || !weight) return 0;
  return sets * reps * weight;
};

// Calculate total volume (sets × reps)
export const calculateVolume = (sets, reps) => {
  if (!sets || !reps) return 0;
  return sets * reps;
};

// Get recommended rep ranges by goal
export const getRepRangeByGoal = (goal) => {
  const ranges = {
    strength: { min: 1, max: 6, label: '1-6 reps (Strength)' },
    hypertrophy: { min: 6, max: 12, label: '6-12 reps (Hypertrophy)' },
    endurance: { min: 12, max: 20, label: '12-20+ reps (Endurance)' }
  };
  return ranges[goal] || ranges.hypertrophy;
};

// Get progression strategy suggestions
export const getProgressionSuggestions = (previousSet, currentSet) => {
  const suggestions = [];

  if (!previousSet) return ['Start tracking sets and reps for this exercise'];

  if (currentSet.reps > previousSet.reps) {
    suggestions.push('✓ Increased reps - consider increasing weight');
  } else if (currentSet.weight > previousSet.weight) {
    suggestions.push('✓ Increased weight - good progression');
  }

  return suggestions.length > 0 ? suggestions : ['Match or beat your previous set'];
};

// Sample cardio exercises
export const getCardioTypes = () => {
  return CARDIO_TYPES;
};

// Get daily calorie burn estimate for cardio
export const estimateCalorieBurn = (type, duration, intensity = 'moderate') => {
  // Rough estimates based on 150-200 lb person
  const burnRates = {
    running: { light: 8, moderate: 12, intense: 15 },
    cycling: { light: 6, moderate: 10, intense: 14 },
    swimming: { light: 7, moderate: 11, intense: 15 },
    rowing: { light: 7, moderate: 12, intense: 16 },
    elliptical: { light: 5, moderate: 8, intense: 12 },
    treadmill: { light: 5, moderate: 10, intense: 14 },
    'stair climber': { light: 7, moderate: 11, intense: 15 },
    'jump rope': { light: 10, moderate: 14, intense: 18 },
    walking: { light: 3, moderate: 4, intense: 6 },
    hiit: { light: 12, moderate: 15, intense: 18 },
    crosstraining: { light: 7, moderate: 11, intense: 14 },
    hiking: { light: 5, moderate: 8, intense: 12 }
  };

  const rate = burnRates[type.toLowerCase()]?.[intensity] || 8;
  return Math.round(rate * duration); // kcal = rate per minute × duration
};
