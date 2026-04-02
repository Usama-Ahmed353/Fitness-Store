import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { Zap, GripHorizontal, Trash2, RotateCcw } from 'lucide-react';

/**
 * MealPlanner - Weekly meal planning with drag-and-drop
 */
const MealPlanner = ({ macroGoals }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [mealPlan, setMealPlan] = useState({
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null },
  });

  const [draggedMeal, setDraggedMeal] = useState(null);
  const [availableMeals] = useState([
    {
      id: 1,
      name: 'Grilled Chicken & Brown Rice',
      calories: 600,
      protein: 45,
      carbs: 60,
      fat: 15,
    },
    {
      id: 2,
      name: 'Salmon & Sweet Potato',
      calories: 650,
      protein: 40,
      carbs: 55,
      fat: 25,
    },
    {
      id: 3,
      name: 'Tofu Stir-Fry',
      calories: 550,
      protein: 35,
      carbs: 50,
      fat: 20,
    },
    {
      id: 4,
      name: 'Oatmeal with Berries',
      calories: 400,
      protein: 15,
      carbs: 60,
      fat: 8,
    },
    {
      id: 5,
      name: 'Turkey Sandwich',
      calories: 450,
      protein: 35,
      carbs: 45,
      fat: 12,
    },
    {
      id: 6,
      name: 'Pasta Primavera',
      calories: 500,
      protein: 18,
      carbs: 75,
      fat: 12,
    },
  ]);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const mealTypes = [
    { key: 'breakfast', label: t('nutrition.breakfast') || 'Breakfast' },
    { key: 'lunch', label: t('nutrition.lunch') || 'Lunch' },
    { key: 'dinner', label: t('nutrition.dinner') || 'Dinner' },
  ];

  const handleDragStart = (meal) => {
    setDraggedMeal(meal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropMeal = (day, mealType) => {
    if (draggedMeal) {
      setMealPlan((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: draggedMeal,
        },
      }));
      setDraggedMeal(null);
    }
  };

  const handleRemoveMeal = (day, mealType) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null,
      },
    }));
  };

  const calculateWeeklyMacros = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(mealPlan).forEach((day) => {
      Object.values(day).forEach((meal) => {
        if (meal) {
          totals.calories += meal.calories;
          totals.protein += meal.protein;
          totals.carbs += meal.carbs;
          totals.fat += meal.fat;
        }
      });
    });
    return totals;
  };

  const weeklyMacros = calculateWeeklyMacros();

  const handleGenerateMealPlan = () => {
    // Simulated AI meal plan generation
    const randomMeals = availableMeals.sort(() => 0.5 - Math.random());
    const newPlan = {};

    days.forEach((day, dayIdx) => {
      newPlan[day] = {
        breakfast: randomMeals[0],
        lunch: randomMeals[1],
        dinner: randomMeals[2],
      };
    });

    setMealPlan(newPlan);
  };

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 rounded-lg border ${
          isDark
            ? 'border-blue-800 bg-blue-900/20'
            : 'border-blue-200 bg-blue-50'
        }`}
      >
        <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
          💡 {t('nutrition.dragDropInstruction') || 'Drag and drop meals from the sidebar to schedule them'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Available Meals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 rounded-lg border p-4 h-fit ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <h3
            className={`font-bold text-lg mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('nutrition.availableMeals') || 'Available Meals'}
          </h3>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {availableMeals.map((meal) => (
              <motion.div
                key={meal.id}
                draggable
                onDragStart={() => handleDragStart(meal)}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg cursor-grab border-2 border-dashed transition-all hover:border-accent ${
                  isDark
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <GripHorizontal className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {meal.name}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {meal.calories} cal
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Generate Plan Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateMealPlan}
            className="w-full mt-4 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {t('nutrition.generatePlan') || 'Generate AI Plan'}
          </motion.button>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setMealPlan(
                Object.fromEntries(
                  days.map((day) => [
                    day,
                    { breakfast: null, lunch: null, dinner: null },
                  ])
                )
              )
            }
            className={`w-full mt-2 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            {t('nutrition.clearPlan') || 'Clear Plan'}
          </motion.button>
        </motion.div>

        {/* Main: Weekly Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Weekly Macros Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border grid grid-cols-4 gap-4 ${
              isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div>
              <p
                className={`text-xs font-semibold mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Weekly Total
              </p>
              <div>
                <p className={`text-2xl font-bold text-accent`}>
                  {weeklyMacros.calories}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  / {macroGoals.tdee * 7}
                </p>
              </div>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Protein
              </p>
              <div>
                <p className={`text-2xl font-bold text-blue-500`}>
                  {weeklyMacros.protein}g
                </p>
                <p
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  / {macroGoals.protein * 7}g
                </p>
              </div>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Carbs
              </p>
              <div>
                <p className={`text-2xl font-bold text-yellow-500`}>
                  {weeklyMacros.carbs}g
                </p>
                <p
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  / {macroGoals.carbs * 7}g
                </p>
              </div>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Fat
              </p>
              <div>
                <p className={`text-2xl font-bold text-orange-500`}>
                  {weeklyMacros.fat}g
                </p>
                <p
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  / {macroGoals.fat * 7}g
                </p>
              </div>
            </div>
          </motion.div>

          {/* Meal Grid */}
          <div className="space-y-4">
            {days.map((day, dayIdx) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.05 }}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3
                  className={`font-bold text-lg mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {day}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mealTypes.map(({ key, label }) => (
                    <motion.div
                      key={key}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDropMeal(day, key)}
                      className={`p-3 rounded-lg border-2 border-dashed min-h-[100px] transition-all ${
                        mealPlan[day][key]
                          ? isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300 bg-gray-50'
                          : isDark
                          ? 'border-gray-600 bg-gray-700/50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold mb-2 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {label}
                      </p>

                      {mealPlan[day][key] ? (
                        <div>
                          <p
                            className={`font-semibold text-sm ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {mealPlan[day][key].name}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {mealPlan[day][key].calories} cal
                          </p>
                          <button
                            onClick={() => handleRemoveMeal(day, key)}
                            className="mt-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p
                          className={`text-xs italic ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          {t('nutrition.dragMealHere') || 'Drag meal here'}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
