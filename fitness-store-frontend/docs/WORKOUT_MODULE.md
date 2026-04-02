# Workout Logger Module Documentation

## Overview

The Workout Logger module provides a comprehensive system for tracking strength and cardio exercises, managing workout templates, analyzing progress, and visualizing workout history. It's designed to help members optimize their training and track long-term progress.

## Features

### 1. Workout Logging (`LogWorkout.jsx`)
- **Strength Exercises**: Log sets × reps × weight for each exercise
- **Cardio Activities**: Track duration, distance, and calories burned
- **Custom Notes**: Add observations about form, effort, or how you felt
- **Template Support**: Load saved workout routines or create new ones
- **1RM Estimation**: Automatic Epley formula calculation for estimated one-rep max
- **Real-time Validation**: Immediate feedback on forms and data entry

**Key Features**:
```javascript
// Strength exercise set:
{ reps: 10, weight: 225 }

// Cardio entry:
{ duration: 30, distance: 3.1, calories: 300 }

// 1RM Estimation (Epley Formula):
1RM = weight × (1 + reps / 30)
```

### 2. Exercise Library (`ExerciseLibrary.jsx`)
- **40+ Exercises**: Comprehensive database of common exercises
- **Categorized**: By muscle group (chest, back, shoulders, legs, etc.)
- **Equipment Filter**: Barbell, Dumbbell, Cable, Machine, Bodyweight
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Quick Search**: Real-time filtering across name and category
- **Add to Workout**: Click to add exercises

**Muscle Groups Available**:
```javascript
const MUSCLE_GROUPS = {
  CHEST, BACK, SHOULDERS, BICEPS, TRICEPS,
  FOREARMS, LEGS (QUADS, HAMSTRINGS, GLUTES, CALVES), ABS
};
```

### 3. Workout Templates (`WorkoutTemplates.jsx`)
- **Save Routines**: Store workout patterns for reuse
- **Quick Start**: Load template and adjust weights/reps
- **Default Templates**: "Upper Body A", "Lower Body A" included
- **Custom Creation**: Name templates with your split type
- **Manage Templates**: Delete unused templates

**Template Structure**:
```javascript
{
  id: 1,
  name: 'Upper Body A',
  exercises: [
    { name: 'Bench Press', muscleGroup: 'chest', target: { sets: 4, reps: 6 } }
  ]
}
```

### 4. Workout History (`WorkoutHistory.jsx`)

#### List View
- Chronological workout list (newest first)
- Exercise breakdown per session
- Tonnage and duration summary
- Session notes display

#### Calendar View
- Monthly calendar overlay
- Green highlights on training days
- Navigate between months
- Visual training frequency

#### Analytics View
**Muscle Group Trends (30-day)**:
- Sessions per week
- Trend direction (increasing/decreasing/stable)
- Total volume and average per session

**Overall Statistics**:
- Total workouts
- Total volume (all reps)
- Total tonnage (all weight × reps)
- Average workout duration

## Utility Functions

### `workoutCalculator.js`

**Tonnage & Volume**:
```javascript
calculateWorkoutTonnage(exercises)       // Sum of weight × reps
calculateWorkoutVolume(exercises)        // Sum of all reps
```

**Metrics**:
```javascript
calculateWorkoutDuration(startTime, endTime)   // Minutes
estimateOneRepMax(weight, reps)                 // 1RM estimate
recommendRestTime(exerciseType, intensity)     // Seconds
calculatePR(weight, reps, previousPRs)        // Compare to history
```

**Analysis**:
```javascript
analyzeMuscleGroupTrend(history, muscleGroup, days)
  // Returns: { trend, sessionsPerWeek, totalVolume, avgVolumePerSession }

getProgressiveOverloadSuggestions(exerciseHistory)
  // Returns array of progression recommendations

calculateStreak(workoutDates)
  // Returns: { current: days, longest: days }
```

**Recommendations**:
```javascript
getWorkoutIntensity(tonnage, volume, avgReps)  // light/moderate/high/very-high
recommendWorkoutSplit(fitnessLevel, daysPerWeek)  // Suggested split
getRepRangeByGoal(goal)  // Rep ranges for strength/hypertrophy/endurance
```

### `exerciseDatabase.js`

**Comprehensive Library**:
- 40+ exercises across all muscle groups
- Equipment and difficulty classification
- Muscle group categorization

**Lookup Functions**:
```javascript
getExercises(filter)                 // Filter by muscle/equipment/search
getExerciseById(id)                  // Get single exercise
getExercisesByMuscleGroup(muscleGroup)  // All exercises for muscle group
```

**Calculations**:
```javascript
calculateTonnage(sets, reps, weight)
calculateVolume(sets, reps)
estimateCalorieBurn(cardioType, duration, intensity)
  // Returns estimated calories burned (light/moderate/intense)
```

## Data Flow

```
WorkoutLogPage (main hub)
  ├── LogWorkout
  │   ├── handleAddExercise()         → Add from library
  │   ├── handleAddSet()              → Add set to exercise
  │   ├── handleSaveWorkout()         → Add to history
  │   └── handleSaveTemplate()        → Store as template
  ├── ExerciseLibrary
  │   ├── getExercises()              → Search/filter
  │   └── onSelectExercise()          → Return to log
  ├── WorkoutTemplates
  │   └── onLoadTemplate()            → Populate form
  └── WorkoutHistory
      ├── workoutsByDate              → Grouped data
      └── muscleGroupTrends           → Analytics
```

## API Integration (When Backend Ready)

**Required Endpoints**:
```javascript
// Workout operations
POST   /api/workouts/log
GET    /api/workouts/:date
PUT    /api/workouts/:id
DELETE /api/workouts/:id

// Templates
POST   /api/workout-templates
GET    /api/workout-templates
DELETE /api/workout-templates/:id

// History & Analytics
GET    /api/workouts/history?days=30
GET    /api/workouts/analytics/muscle-group/:group
GET    /api/workouts/analytics/trends
```

**Save Workout Payload**:
```javascript
{
  date: '2024-02-24',
  startTime: '19:00',
  endTime: '20:00',
  exercises: [
    {
      name: 'Bench Press',
      muscleGroup: 'chest',
      sets: [
        { reps: 8, weight: 225 },
        { reps: 6, weight: 235 }
      ]
    }
  ],
  notes: 'Great session'
}
```

## Theming & Localization

### Dark Mode Support
- All components respond to `useTheme()` hook
- Auto-adjusting colors: `isDark ? 'bg-gray-800' : 'bg-white'`
- Consistent dark/light contrast ratios

### Multi-Language
- All UI text using `useLanguage()` hook
- Translation keys: `t('workout.title', 'Workout Logger')`
- Muscle group names use `capitalize` filter for display

## Performance Optimizations

1. **useMemo for Calculations**: Exercise filtering, sorting
2. **AnimatePresence**: Smooth tab transitions
3. **Lazy Rendering**: Only active tab content renders
4. **Debounced Search**: 300ms delay on exercise search (can be tuned)

## Testing Guidance

### Unit Tests
- `calculateTonnage()` with various set/rep/weight combinations
- `estimateOneRepMax()` against known Epley formula results
- Exercise filtering with multiple filters
- Trend calculation on sample data

### Component Tests
- LogWorkout: Add/remove exercises, add sets
- ExerciseLibrary: Search filters, selection
- WorkoutHistory: Calendar navigation, analytics calculations
- Template loading and saving

### Integration Tests
- Full workout log session: Add exercises → Save → Verify in history
- Template workflow: Create workout → Save template → Load template
- Analytics: Log multiple workouts → Verify trends

## Future Enhancements

1. **REST Timer**: Audio/visual countdown between sets
2. **Form Video Library**: Video demonstrations per exercise
3. **Superset Support**: Group related exercises
4. **RPE/RIR Logging**: Rate perceived exertion or reps in reserve
5. **Barcode Scanning**: Quick weight plate lookup
6. **Social Features**: Share workouts, compare PRs with friends
7. **Training Programs**: Predefined periodized programs
8. **Custom Exercises**: User-created exercise database
9. **Overlay Analytics**: Graphs on history view
10. **Export Options**: PDF/CSV of workout data

## Troubleshooting

**Issue**: Exercises not saving to template
- Check `templateName` is not empty
- Verify at least 1 exercise is in workout

**Issue**: Tonnage calculation seems off
- Verify sets array structure: `{ reps: N, weight: W }`
- Tonnage = sum of (1 × reps × weight) per set

**Issue**: 1RM estimation showing 0
- Ensure `weight` and `reps` are both > 0
- Formula: weight × (1 + reps/30)

## File Structure

```
src/pages/member/
  ├── WorkoutLogPage.jsx          (main page)
  └── workout/
      ├── LogWorkout.jsx
      ├── ExerciseLibrary.jsx
      ├── WorkoutTemplates.jsx
      ├── WorkoutHistory.jsx
      └── index.js

src/utils/
  ├── workoutCalculator.js        (calculations & analysis)
  └── exerciseDatabase.js         (exercise library & cardio types)
```

## Dependencies

- **React**: State management (useState, useContext)
- **Framer Motion**: Animations (motion, AnimatePresence)
- **Lucide React**: Icons (all UI icons)
- **Tailwind CSS**: Styling
- **Context Hooks**: `useTheme()`, `useLanguage()`

## Size & Performance

- **Main Page**: ~300 lines
- **Sub-components**: ~250-350 lines each
- **Utilities**: ~400 lines total
- **Bundle Impact**: ~45KB minified (gzipped shared)
- **Render Performance**: O(n) for exercise list, O(1) for calculations

## Support

For integration questions or bugs:
1. Check data structure matches expected format
2. Verify imports from correct paths
3. Ensure theme/language hooks are available
4. Test with mock data first before API integration
