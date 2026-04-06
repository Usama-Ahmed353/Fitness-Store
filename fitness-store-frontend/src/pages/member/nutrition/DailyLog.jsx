import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import {
  Plus,
  Trash2,
  Sunrise,
  Sun,
  Moon,
  Apple,
} from 'lucide-react';
import CircularProgress from '../../../components/common/CircularProgress';
import FoodSearchModal from './FoodSearchModal';

/**
 * DailyLog - Track daily food intake with meal sections and macro goals
 */
const DailyLog = ({ selectedDate, macroGoals, initialMeals, onMealsChange }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const tx = (key, fallback) => {
    const value = t(key);
    return !value || value === key ? fallback : value;
  };
  const [showFoodSearch, setShowFoodSearch] = useState(null); // meal type: breakfast, lunch, dinner, snacks
  const [dailyLog, setDailyLog] = useState({
    date: selectedDate.toISOString().split('T')[0],
    meals: initialMeals || {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  });

  useEffect(() => {
    setDailyLog({
      date: selectedDate.toISOString().split('T')[0],
      meals: initialMeals || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    });
  }, [selectedDate, initialMeals]);

  const updateMeals = (nextMeals) => {
    setDailyLog((prev) => {
      const next = { ...prev, date: selectedDate.toISOString().split('T')[0], meals: nextMeals };
      onMealsChange?.(next.meals);
      return next;
    });
  };

  const mealSections = [
    { key: 'breakfast', label: tx('nutrition.breakfast', 'Breakfast'), color: 'from-orange-500 to-yellow-500', icon: Sunrise },
    { key: 'lunch', label: tx('nutrition.lunch', 'Lunch'), color: 'from-emerald-500 to-lime-500', icon: Sun },
    { key: 'dinner', label: tx('nutrition.dinner', 'Dinner'), color: 'from-blue-500 to-cyan-500', icon: Moon },
    { key: 'snacks', label: tx('nutrition.snacks', 'Snacks'), color: 'from-fuchsia-500 to-pink-500', icon: Apple },
  ];

  // Calculate totals
  const calculateTotals = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(dailyLog.meals).forEach((meal) => {
      meal.forEach((item) => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.carbs += item.carbs || 0;
        totals.fat += item.fat || 0;
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  const handleAddFood = (mealType, food) => {
    const nextMeals = {
      ...dailyLog.meals,
      [mealType]: [
        ...(dailyLog.meals[mealType] || []),
        {
          id: Date.now(),
          ...food,
        },
      ],
    };
    updateMeals(nextMeals);
    setShowFoodSearch(null);
  };

  const handleDeleteFood = (mealType, itemId) => {
    const nextMeals = {
      ...dailyLog.meals,
      [mealType]: (dailyLog.meals[mealType] || []).filter((item) => item.id !== itemId),
    };
    updateMeals(nextMeals);
  };

  return (
    <div className="space-y-6">
      {/* Macro Summary with Circular Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`grid grid-cols-2 gap-4 rounded-xl border p-4 md:grid-cols-4 ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}
      >
        {/* Calories */}
        <div className="flex flex-col items-center">
          <CircularProgress
            current={totals.calories}
            goal={macroGoals.tdee}
            color="text-accent"
            label={tx('nutrition.calories', 'Calories')}
          />
          <p
            className={`mt-3 text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {totals.calories} / {macroGoals.tdee}
          </p>
        </div>

        {/* Protein */}
        <div className="flex flex-col items-center">
          <CircularProgress
            current={totals.protein}
            goal={macroGoals.protein}
            color="text-blue-500"
            label={tx('nutrition.protein', 'Protein')}
          />
          <p
            className={`mt-3 text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {totals.protein}g / {macroGoals.protein}g
          </p>
        </div>

        {/* Carbs */}
        <div className="flex flex-col items-center">
          <CircularProgress
            current={totals.carbs}
            goal={macroGoals.carbs}
            color="text-yellow-500"
            label={tx('nutrition.carbs', 'Carbs')}
          />
          <p
            className={`mt-3 text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {totals.carbs}g / {macroGoals.carbs}g
          </p>
        </div>

        {/* Fat */}
        <div className="flex flex-col items-center">
          <CircularProgress
            current={totals.fat}
            goal={macroGoals.fat}
            color="text-orange-500"
            label={tx('nutrition.fat', 'Fat')}
          />
          <p
            className={`mt-3 text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {totals.fat}g / {macroGoals.fat}g
          </p>
        </div>
      </motion.div>

      {/* Meal Sections */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {mealSections.map((section, idx) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`overflow-hidden rounded-xl border ${
              isDark
                ? 'border-gray-700 bg-gray-800/70'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Section Header */}
            <div
              className={`bg-gradient-to-r ${section.color} p-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  <h3 className="text-lg font-bold">{section.label}</h3>
                </div>
                <p className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                  {dailyLog.meals[section.key].length} {tx('nutrition.items', 'items')}
                </p>
              </div>
            </div>

            {/* Section Content */}
            <div className="space-y-3 p-4">
              {/* Food Items */}
              <AnimatePresence>
                {dailyLog.meals[section.key].length > 0 ? (
                  dailyLog.meals[section.key].map((food, itemIdx) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        isDark
                          ? 'border-gray-600 bg-gray-700/70'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {food.name}
                        </p>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                          <div className={`rounded px-2 py-1 text-center font-medium ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-100'}`}>{food.calories} cal</div>
                          <div className={`rounded px-2 py-1 text-center font-medium ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>{food.protein}p</div>
                          <div className={`rounded px-2 py-1 text-center font-medium ${isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}`}>{food.carbs}c</div>
                          <div className={`rounded px-2 py-1 text-center font-medium ${isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'}`}>{food.fat}f</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteFood(section.key, food.id)}
                        className={`ml-3 p-2 rounded-lg transition-all ${
                          isDark
                            ? 'hover:bg-red-900/30'
                            : 'hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p
                    className={`text-center py-4 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {tx('nutrition.noFoodsAdded', 'No foods added yet')}
                  </p>
                )}
              </AnimatePresence>

              {/* Add Food Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFoodSearch(section.key)}
                className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
                {tx('nutrition.addFood', 'Add Food')}
              </motion.button>

              {/* Meal Totals */}
              {dailyLog.meals[section.key].length > 0 && (
                <div
                  className={`mt-4 pt-4 border-t ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                    <div>
                      <p
                        className={isDark ? 'text-gray-400' : 'text-gray-600'}
                      >
                        {dailyLog.meals[section.key].reduce(
                          (sum, item) => sum + (item.calories || 0),
                          0
                        )}{' '}
                        cal
                      </p>
                    </div>
                    <div>
                      <p
                        className={isDark ? 'text-gray-400' : 'text-gray-600'}
                      >
                        {dailyLog.meals[section.key].reduce(
                          (sum, item) => sum + (item.protein || 0),
                          0
                        )}
                        g P
                      </p>
                    </div>
                    <div>
                      <p
                        className={isDark ? 'text-gray-400' : 'text-gray-600'}
                      >
                        {dailyLog.meals[section.key].reduce(
                          (sum, item) => sum + (item.carbs || 0),
                          0
                        )}
                        g C
                      </p>
                    </div>
                    <div>
                      <p
                        className={isDark ? 'text-gray-400' : 'text-gray-600'}
                      >
                        {dailyLog.meals[section.key].reduce(
                          (sum, item) => sum + (item.fat || 0),
                          0
                        )}
                        g F
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <FoodSearchModal
          mealType={showFoodSearch}
          onAddFood={(food) => handleAddFood(showFoodSearch, food)}
          onClose={() => setShowFoodSearch(null)}
        />
      )}
    </div>
  );
};

export default DailyLog;
