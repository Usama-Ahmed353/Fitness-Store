/**
 * INTEGRATION GUIDE - Adding Nutrition Module to CrunchFit Pro
 */

// 1. UPDATE ROUTING (in your main App.jsx or Routes.jsx)
// =========================================================

import NutritionPage from '@/pages/member/NutritionPage';

// Add to your route configuration:
const memberRoutes = [
  // ... existing routes
  {
    path: '/member/nutrition',
    element: <NutritionPage />,
    // name: 'Nutrition Tracker',
    // icon: <Utensils className="w-5 h-5" />
  },
];

// 2. UPDATE MEMBER SIDEBAR/NAVIGATION
// ====================================

import { Utensils } from 'lucide-react';

const navigationItems = [
  // ... existing items
  {
    name: 'Nutrition',
    path: '/member/nutrition',
    icon: <Utensils className="w-5 h-5" />,
    category: 'health'
  },
];

// 3. API INTEGRATION EXAMPLE
// ==========================

// Create src/services/nutritionService.js

import api from '@/utils/api'; // Your axios instance

export const nutritionService = {
  // Get user's macro goals
  getMacroGoals: async (userId) => {
    const response = await api.get(`/nutrition/macro-goals/${userId}`);
    return response.data;
  },

  // Update macro goals
  updateMacroGoals: async (userId, goals) => {
    const response = await api.put(`/nutrition/macro-goals/${userId}`, goals);
    return response.data;
  },

  // Get daily log
  getDailyLog: async (userId, date) => {
    const response = await api.get(`/nutrition/daily-log/${date}`, {
      params: { userId }
    });
    return response.data;
  },

  // Add food to log
  addFoodToLog: async (userId, food) => {
    const response = await api.post(`/nutrition/daily-log/add-food`, {
      userId,
      ...food
    });
    return response.data;
  },

  // Get meal plan
  getMealPlan: async (userId) => {
    const response = await api.get(`/nutrition/meal-plan/${userId}`);
    return response.data;
  },

  // Save meal plan
  saveMealPlan: async (userId, mealPlan) => {
    const response = await api.put(`/nutrition/meal-plan/${userId}`, {
      mealPlan
    });
    return response.data;
  },

  // Get weight history
  getWeightHistory: async (userId, days = 30) => {
    const response = await api.get(`/nutrition/weight-history`, {
      params: { userId, days }
    });
    return response.data;
  },

  // Add weight entry
  addWeightEntry: async (userId, date, weight) => {
    const response = await api.post(`/nutrition/weight-entry`, {
      userId,
      date,
      weight
    });
    return response.data;
  },

  // Get nutrition progress (last 30/90 days)
  getNutritionProgress: async (userId, days = 30) => {
    const response = await api.get(`/nutrition/progress`, {
      params: { userId, days }
    });
    return response.data;
  }
};

// 4. USE IN COMPONENTS
// ====================

// Example: In NutritionPage.jsx or a parent container

import { useEffect, useState } from 'react';
import { nutritionService } from '@/services/nutritionService';
import { useAuth } from '@/context/AuthContext'; // or your auth hook

const NutritionContainer = () => {
  const { user } = useAuth();
  const [macroGoals, setMacroGoals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMacros = async () => {
      try {
        const response = await nutritionService.getMacroGoals(user.id);
        setMacroGoals(response);
      } catch (error) {
        console.error('Error fetching macro goals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMacros();
    }
  }, [user?.id]);

  return (
    <NutritionPage
      macroGoals={macroGoals}
      loading={loading}
      onSaveMealPlan={(plan) => 
        nutritionService.saveMealPlan(user.id, plan)
      }
    />
  );
};

// 5. USING MACRO CALCULATOR
// ==========================

import { 
  calculateTDEE, 
  calculateMacros, 
  activityLevels 
} from '@/utils/macroCalculator';

// Example calculation flow
const userProfile = {
  weight: 75,
  height: 180,
  age: 25,
  gender: 'male',
  goal: 'cut',
  activityLevel: 1.55,
  trainingType: 'strength'
};

// Step 1: Calculate TDEE
const tdee = calculateTDEE(
  userProfile.weight,
  userProfile.height,
  userProfile.age,
  userProfile.gender,
  userProfile.activityLevel
);

// Step 2: Calculate macros based on goal
const macros = calculateMacros(
  tdee,
  userProfile.goal,
  userProfile.weight,
  userProfile.trainingType
);

// Result: { calories: 1870, protein: 180, carbs: 180, fat: 67 }

// 6. BACKEND SCHEMA EXAMPLES (Node.js/MongoDB)
// ============================================

// User Nutrition Profile
const nutritionProfileSchema = {
  userId: ObjectId,
  weight: Number,           // kg
  height: Number,           // cm
  age: Number,
  gender: String,           // male, female
  activityLevel: Number,    // 1.2-1.9
  goal: String,             // cut, bulk, maintain
  trainingType: String,     // strength, endurance, mixed
  tdee: Number,
  macroGoals: {
    calories: Number,
    protein: Number,        // grams
    carbs: Number,          // grams
    fat: Number             // grams
  },
  customMacroOverride: {
    enabled: Boolean,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
};

// Daily nutrition log
const dailyNutritionLogSchema = {
  userId: ObjectId,
  date: Date,
  meals: {
    breakfast: [
      {
        foodId: String,
        foodName: String,
        quantity: Number,      // grams
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        timestamp: Date
      }
    ],
    lunch: [...],
    dinner: [...],
    snacks: [...]
  },
  dailyTotals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
};

// Meal plan
const mealPlanSchema = {
  userId: ObjectId,
  startDate: Date,
  endDate: Date,
  meals: {
    Monday: {
      breakfast: { mealId: ObjectId, name: String, calories: Number, ... },
      lunch: {...},
      dinner: {...}
    },
    // ... repeat for each day
  },
  weeklyTotals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
};

// Weight history
const weightHistorySchema = {
  userId: ObjectId,
  entries: [
    {
      date: Date,
      weight: Number,        // kg
      notes: String
    }
  ]
};

// 7. ENVIRONMENT VARIABLES (if using Food API key)
// ================================================

// Add to .env.local
VITE_FOOD_API_URL=https://world.openfoodfacts.org
// VITE_USDA_API_KEY=your_api_key_here  // Optional for USDA API

// 8. THEME COLORS FOR NUTRITION METRICS
// ======================================

const macroColors = {
  calories: '#FF6B35',  // Accent/Orange
  protein: '#3B82F6',   // Blue
  carbs: '#EAB308',     // Yellow
  fat: '#F97316'        // Orange
};

// 9. TESTING THE INTEGRATION
// ==========================

// Test in Jest/Vitest
import { render, screen, waitFor } from '@testing-library/react';
import NutritionPage from '@/pages/member/NutritionPage';

describe('Nutrition Module', () => {
  it('should display macro goals', () => {
    render(
      <NutritionPage
        macroGoals={{
          tdee: 2200,
          protein: 180,
          carbs: 220,
          fat: 73
        }}
      />
    );
    expect(screen.getByText('2200')).toBeInTheDocument();
  });

  it('should add food to daily log', async () => {
    render(<NutritionPage />);
    // ... test implementation
  });
});

// 10. MONITORING & ANALYTICS
// ==========================

// Track user nutrition behaviors
import { analytics } from '@/utils/analytics';

const trackNutritionEvent = (event, properties) => {
  analytics.track(`Nutrition: ${event}`, {
    userId: user.id,
    timestamp: new Date(),
    ...properties
  });
};

// Example events to track:
// - "Food Searched" - user searched for a food
// - "Food Added" - user added food to daily log
// - "Meal Planned" - user created meal plan
// - "Progress Viewed" - user viewed progress
// - "Weight Logged" - user added weight entry
// - "Macro Goal Changed" - user updated macro goals
