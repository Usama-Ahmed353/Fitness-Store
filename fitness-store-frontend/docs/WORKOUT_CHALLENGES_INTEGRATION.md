/**
 * INTEGRATION GUIDE - Adding Workout & Challenges Modules to CrunchFit Pro
 */

// 1. UPDATE ROUTING (in your main App.jsx or Routes.jsx)
// =========================================================

import WorkoutLogPage from '@/pages/member/WorkoutLogPage';
import ChallengesPage from '@/pages/member/ChallengesPage';

// Add to your route configuration:
const memberRoutes = [
  // ... existing routes
  {
    path: '/member/workouts',
    element: <WorkoutLogPage />,
    // name: 'Workout Logger',
    // icon: <Activity className="w-5 h-5" />
  },
  {
    path: '/member/challenges',
    element: <ChallengesPage />,
    // name: 'Fitness Challenges',
    // icon: <Trophy className="w-5 h-5" />
  },
];

// 2. UPDATE MEMBER SIDEBAR/NAVIGATION
// ====================================

import { Activity, Trophy } from 'lucide-react';

const navigationItems = [
  // ... existing items
  {
    name: 'Workout Logger',
    path: '/member/workouts',
    icon: <Activity className="w-5 h-5" />,
    category: 'training'
  },
  {
    name: 'Challenges',
    path: '/member/challenges',
    icon: <Trophy className="w-5 h-5" />,
    category: 'motivation'
  },
];

// 3. API SERVICE LAYER (Create src/services/workoutService.js)
// =============================================================

import api from '@/utils/api';

export const workoutService = {
  // Log workout
  logWorkout: async (userId, workoutData) => {
    const response = await api.post('/workouts/log', {
      userId,
      ...workoutData
    });
    return response.data;
  },

  // Get workout history
  getWorkoutHistory: async (userId, days = 30) => {
    const response = await api.get('/workouts/history', {
      params: { userId, days }
    });
    return response.data;
  },

  // Get single workout
  getWorkout: async (userId, workoutId) => {
    const response = await api.get(`/workouts/${workoutId}`, {
      params: { userId }
    });
    return response.data;
  },

  // Update workout
  updateWorkout: async (userId, workoutId, updates) => {
    const response = await api.put(`/workouts/${workoutId}`, {
      userId,
      ...updates
    });
    return response.data;
  },

  // Delete workout
  deleteWorkout: async (userId, workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`, {
      params: { userId }
    });
    return response.data;
  },

  // Workout templates
  saveTemplate: async (userId, templateData) => {
    const response = await api.post('/workout-templates', {
      userId,
      ...templateData
    });
    return response.data;
  },

  getTemplates: async (userId) => {
    const response = await api.get('/workout-templates', {
      params: { userId }
    });
    return response.data;
  },

  deleteTemplate: async (userId, templateId) => {
    const response = await api.delete(`/workout-templates/${templateId}`, {
      params: { userId }
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (userId, muscleGroup, days = 30) => {
    const response = await api.get('/workouts/analytics/muscle-group', {
      params: { userId, muscleGroup, days }
    });
    return response.data;
  },

  getStreak: async (userId) => {
    const response = await api.get('/workouts/streak', {
      params: { userId }
    });
    return response.data;
  }
};

// 4. CHALLENGE SERVICE (Create src/services/challengeService.js)
// ==============================================================

export const challengeService = {
  // Get active challenges for gym
  getActiveChallenges: async (gymId) => {
    const response = await api.get(`/gyms/${gymId}/challenges/active`);
    return response.data;
  },

  // Get completed challenges for user
  getCompletedChallenges: async (userId) => {
    const response = await api.get('/challenges/completed', {
      params: { userId }
    });
    return response.data;
  },

  // Get challenge details with leaderboard
  getChallengeDetails: async (challengeId) => {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  },

  // Get leaderboard for challenge
  getLeaderboard: async (challengeId, limit = 10) => {
    const response = await api.get(`/challenges/${challengeId}/leaderboard`, {
      params: { limit }
    });
    return response.data;
  },

  // Join challenge
  joinChallenge: async (userId, challengeId) => {
    const response = await api.post(`/challenges/${challengeId}/join`, {
      userId
    });
    return response.data;
  },

  // Leave challenge
  leaveChallenge: async (userId, challengeId) => {
    const response = await api.post(`/challenges/${challengeId}/leave`, {
      userId
    });
    return response.data;
  },

  // Update challenge progress
  updateProgress: async (userId, challengeId, currentValue) => {
    const response = await api.put(`/challenges/${challengeId}/progress`, {
      userId,
      currentValue
    });
    return response.data;
  },

  // Get user stats
  getUserStats: async (userId, gymId) => {
    const response = await api.get('/user/challenge-stats', {
      params: { userId, gymId }
    });
    return response.data;
  },

  // Get season leaderboard
  getSeasonLeaderboard: async (gymId, limit = 20) => {
    const response = await api.get(`/gyms/${gymId}/challenges/season-leaderboard`, {
      params: { limit }
    });
    return response.data;
  }
};

// 5. USING SERVICES IN COMPONENTS
// ================================

// Example: In WorkoutLogPage or parent container

import { useEffect, useState } from 'react';
import { workoutService } from '@/services/workoutService';
import { useAuth } from '@/context/AuthContext';

const WorkoutPageContainer = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await workoutService.getWorkoutHistory(user.id);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  const handleSaveWorkout = async (workoutData) => {
    try {
      const result = await workoutService.logWorkout(user.id, workoutData);
      setHistory(prev => [result, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error saving workout:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <WorkoutLogPage
      workoutHistory={history}
      loading={loading}
      onSaveWorkout={handleSaveWorkout}
    />
  );
};

// 6. BACKEND SCHEMA EXAMPLES (Node.js/MongoDB)
// ============================================

// Workout document
const workoutSchema = {
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  startTime: String,      // HH:MM
  endTime: String,        // HH:MM
  exercises: [
    {
      name: String,
      muscleGroup: String,
      sets: [
        {
          reps: Number,
          weight: Number,    // lbs/kg
          rpe: Number,       // 1-10 rating of perceived exertion
          notes: String
        }
      ],
      notes: String
    }
  ],
  tonnage: Number,        // Total weight × reps
  volume: Number,         // Total reps
  duration: Number,       // Minutes
  notes: String,
  template: { type: ObjectId, ref: 'WorkoutTemplate' },
  caloriesBurned: Number,
  createdAt: Date,
  updatedAt: Date
};

// Workout template
const workoutTemplateSchema = {
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  exercises: [
    {
      name: String,
      muscleGroup: String,
      target: {
        sets: Number,
        reps: Number,
        weight: Number
      }
    }
  ],
  createdAt: Date,
  updatedAt: Date
};

// Challenge document
const challengeSchema = {
  _id: ObjectId,
  gymId: ObjectId,           // Which gym
  name: String,
  description: String,
  type: String,              // tonnage, reps, sessions, etc
  difficulty: String,        // EASY, MEDIUM, HARD, ELITE
  muscleGroup: [String],     // [chest, back, etc]
  targetValue: Number,
  startDate: Date,
  endDate: Date,
  rewards: Number,           // Points available
  badge: String,
  participants: [
    {
      userId: ObjectId,
      username: String,
      currentValue: Number,
      joinedAt: Date,
      status: String         // active, completed
    }
  ],
  createdAt: Date,
  updatedAt: Date
};

// User challenge progress
const challengeProgressSchema = {
  _id: ObjectId,
  userId: ObjectId,
  challengeId: ObjectId,
  currentValue: Number,
  updates: [
    {
      timestamp: Date,
      value: Number,
      source: String         // 'manual', 'auto-sync', 'import'
    }
  ],
  completedAt: Date,        // When user completed challenge
  pointsEarned: Number       // Points awarded
};

// 7. REQUIRED BACKEND ENDPOINTS
// ==============================

/*
WORKOUT ENDPOINTS:
POST   /api/workouts/log              Log new workout
GET    /api/workouts/history          Get user's workout history
GET    /api/workouts/:id              Get single workout
PUT    /api/workouts/:id              Update workout
DELETE /api/workouts/:id              Delete workout
GET    /api/workouts/analytics/muscle-group
GET    /api/workouts/streak           Get current streak

TEMPLATE ENDPOINTS:
POST   /api/workout-templates         Create template
GET    /api/workout-templates         Get user's templates
DELETE /api/workout-templates/:id     Delete template

CHALLENGE ENDPOINTS:
GET    /api/gyms/:gymId/challenges/active
GET    /api/challenges/:id            Get challenge details
GET    /api/challenges/:id/leaderboard
POST   /api/challenges/:id/join       Join challenge
POST   /api/challenges/:id/leave      Leave challenge
PUT    /api/challenges/:id/progress   Update progress
GET    /api/user/challenge-stats      User's stats
GET    /api/gyms/:gymId/challenges/season-leaderboard
*/

// 8. ENVIRONMENT VARIABLES
// ========================

// Add to .env.local
VITE_API_BASE_URL=http://localhost:3000

// 9. TESTING SETUP
// ================

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutLogPage from '@/pages/member/WorkoutLogPage';

describe('Workout Logger', () => {
  it('should log a workout', async () => {
    render(<WorkoutLogPage />);

    // Add exercise
    // Add sets
    // Save workout
    // Verify in history
  });

  it('should save and load templates', async () => {
    render(<WorkoutLogPage />);
    // Create workout
    // Save as template
    // Load template
    // Verify exercises loaded
  });
});

describe('Challenges', () => {
  it('should join and track challenge progress', () => {
    render(<ChallengesPage />);
    // Find active challenge
    // Click join
    // Verify in "your challenges"
    // Update progress
    // Verify leaderboard rank
  });
});

// 10. PROGRESS SYNCHRONIZATION
// ============================

// Auto-sync workout logs to challenges
const syncWorkoutToChallenge = (workout, activeChallenge) => {
  // Extract relevant metric based on challenge type
  switch (activeChallenge.type) {
    case 'tonnage':
      return { metric: 'tonnage', value: workout.tonnage };
    case 'reps':
      return { metric: 'reps', value: workout.volume };
    case 'sessions':
      return { metric: 'sessions', value: 1 };
    case 'duration':
      return { metric: 'duration', value: workout.duration };
    default:
      return null;
  }
};

// Called when workout is logged
useEffect(() => {
  if (newWorkout && userChallenges.length > 0) {
    userChallenges.forEach(challenge => {
      const update = syncWorkoutToChallenge(newWorkout, challenge);
      if (update) {
        challengeService.updateProgress(user.id, challenge.id, update.value);
      }
    });
  }
}, [newWorkout]);

// 11. MONITORING & ANALYTICS
// ==========================

const trackWorkoutEvent = (event, data) => {
  analytics.track(`Workout: ${event}`, {
    userId: user.id,
    tonnage: data.tonnage,
    duration: data.duration,
    exerciseCount: data.exercises.length,
    timestamp: new Date()
  });
};

const trackChallengeEvent = (event, data) => {
  analytics.track(`Challenge: ${event}`, {
    userId: user.id,
    challengeId: data.challengeId,
    progress: data.progress,
    timestamp: new Date()
  });
};

// 12. PERFORMANCE OPTIMIZATION
// ============================

// Cache workout history (SWR pattern)
import useSWR from 'swr';

const useWorkoutHistory = (userId) => {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/workouts/history/${userId}` : null,
    workoutService.getWorkoutHistory,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  return { data, error, isLoading };
};

// 13. ERROR HANDLING
// =================

const handleWorkoutError = (error) => {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 422) {
    // Validation error
    return { success: false, message: 'Invalid workout data' };
  } else if (error.response?.status === 500) {
    // Server error
    return { success: false, message: 'Server error, please try again' };
  }
};

// 14. REAL-TIME LEADERBOARD UPDATES (Optional)
// =============================================

// Using WebSocket for live leaderboard
const socket = io(process.env.VITE_WS_URL);

socket.on('challenge-progress-update', (data) => {
  // Update leaderboard state
  updateLeaderboard(data);
});

socket.emit('join-challenge', { challengeId, userId });
