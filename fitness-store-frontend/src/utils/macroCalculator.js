/**
 * macroCalculator.js - Macro goal calculations based on IIFYM principles
 */

/**
 * Calculate TDEE (Total Daily Energy Expenditure) using Mifflin-St Jeor equation
 * @param {number} weight - Body weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @param {number} activityLevel - Activity multiplier (1.2-1.9)
 * @returns {number} TDEE in calories
 */
export const calculateTDEE = (weight, height, age, gender, activityLevel = 1.55) => {
  let bmr;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return Math.round(bmr * activityLevel);
};

/**
 * Calculate macro targets based on goal
 * @param {number} tdee - Total daily energy expenditure
 * @param {string} goal - 'cut' (deficit), 'bulk' (surplus), 'maintain' (maintenance)
 * @param {number} weight - Body weight in kg
 * @param {string} trainingType - 'strength', 'endurance', 'mixed'
 * @returns {object} {calories, protein, carbs, fat}
 */
export const calculateMacros = (tdee, goal, weight, trainingType = 'mixed') => {
  let calories = tdee;
  let proteinMultiplier = 2.2; // g per kg

  // Adjust calories based on goal
  switch (goal) {
    case 'cut':
      calories = Math.round(tdee * 0.85); // 15% deficit
      break;
    case 'bulk':
      calories = Math.round(tdee * 1.1); // 10% surplus
      break;
    case 'maintain':
    default:
      calories = tdee;
  }

  // Adjust protein based on training type
  if (trainingType === 'strength') {
    proteinMultiplier = 2.4; // Higher protein for strength training
  } else if (trainingType === 'endurance') {
    proteinMultiplier = 1.6; // Lower protein for endurance
  }

  // Calculate macros
  const protein = Math.round(weight * proteinMultiplier);
  const proteinCalories = protein * 4;

  // Fat: 0.8-1.0g per kg (important for hormones)
  const fat = Math.round(weight * 0.9);
  const fatCalories = fat * 9;

  // Remaining calories from carbs
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
  };
};

/**
 * Generate AI-powered meal plan based on goals
 * @param {number} targetCalories - Daily calorie target
 * @param {number} targetProtein - Daily protein target (g)
 * @param {string} dietType - 'omnivore', 'vegetarian', 'vegan'
 * @returns {array} Array of meal suggestions
 */
export const generateMealPlanSuggestions = (
  targetCalories,
  targetProtein,
  dietType = 'omnivore'
) => {
  const meals = [];
  const mealCalories = targetCalories / 3; // 3 meals per day

  // Breakfast options
  const breakfastOptions = {
    omnivore: [
      { name: 'Eggs & Oatmeal', calories: 450, protein: 25, carbs: 50, fat: 15 },
      { name: 'Greek Yogurt & Berries', calories: 400, protein: 20, carbs: 45, fat: 8 },
      { name: 'Pancakes with Protein', calories: 500, protein: 30, carbs: 60, fat: 10 },
    ],
    vegetarian: [
      { name: 'Oatmeal with Almonds', calories: 420, protein: 15, carbs: 55, fat: 18 },
      { name: 'Protein Pancakes', calories: 480, protein: 28, carbs: 58, fat: 8 },
    ],
    vegan: [
      { name: 'Tofu Scramble', calories: 380, protein: 20, carbs: 40, fat: 16 },
      { name: 'Chia Seed Pudding', calories: 400, protein: 12, carbs: 48, fat: 20 },
    ],
  };

  // Lunch options
  const lunchOptions = {
    omnivore: [
      { name: 'Grilled Chicken & Rice', calories: 600, protein: 45, carbs: 60, fat: 12 },
      { name: 'Salmon & Sweet Potato', calories: 650, protein: 40, carbs: 55, fat: 25 },
      { name: 'Turkey & Broccoli Bowl', calories: 550, protein: 50, carbs: 45, fat: 10 },
    ],
    vegetarian: [
      { name: 'Chickpea Curry & Rice', calories: 620, protein: 18, carbs: 85, fat: 14 },
      { name: 'Bean & Veggie Burrito', calories: 580, protein: 22, carbs: 75, fat: 12 },
    ],
    vegan: [
      { name: 'Tofu Stir-Fry', calories: 550, protein: 22, carbs: 65, fat: 16 },
      { name: 'Lentil Pasta Marinara', calories: 600, protein: 24, carbs: 80, fat: 10 },
    ],
  };

  // Dinner options
  const dinnerOptions = {
    omnivore: [
      { name: 'Lean Steak & Vegetables', calories: 550, protein: 50, carbs: 30, fat: 18 },
      { name: 'White Fish & Brown Rice', calories: 500, protein: 45, carbs: 50, fat: 8 },
      { name: 'Chicken Breast & Pasta', calories: 580, protein: 48, carbs: 60, fat: 10 },
    ],
    vegetarian: [
      { name: 'Vegetable Lasagna', calories: 520, protein: 20, carbs: 65, fat: 15 },
      { name: 'Portobello Mushroom Steak', calories: 450, protein: 15, carbs: 45, fat: 18 },
    ],
    vegan: [
      { name: 'Quinoa & Vegetable Bowl', calories: 520, protein: 18, carbs: 70, fat: 12 },
      { name: 'Seitan Tacos', calories: 480, protein: 36, carbs: 50, fat: 10 },
    ],
  };

  const diet = dietType || 'omnivore';
  const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    breakfast: selectRandom(breakfastOptions[diet]),
    lunch: selectRandom(lunchOptions[diet]),
    dinner: selectRandom(dinnerOptions[diet]),
  };
};

/**
 * Get activity level multiplier names
 */
export const activityLevels = {
  sedentary: { multiplier: 1.2, description: 'Sedentary (little or no exercise)' },
  light: { multiplier: 1.375, description: 'Light activity (exercise 1-3 days/week)' },
  moderate: { multiplier: 1.55, description: 'Moderate activity (exercise 3-5 days/week)' },
  active: { multiplier: 1.725, description: 'Active (exercise 6-7 days/week)' },
  veryActive: { multiplier: 1.9, description: 'Very active (intense exercise 6-7 days/week)' },
};

/**
 * Format nutrition label
 */
export const formatNutritionLabel = (calories, protein, carbs, fat) => {
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const total = proteinCals + carbsCals + fatCals;

  return {
    proteinPercent: ((proteinCals / total) * 100).toFixed(1),
    carbsPercent: ((carbsCals / total) * 100).toFixed(1),
    fatPercent: ((fatCals / total) * 100).toFixed(1),
  };
};
