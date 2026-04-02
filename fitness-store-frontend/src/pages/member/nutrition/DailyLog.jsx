import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import {
  Plus,
  X,
  Search,
  Trash2,
  Edit2,
} from 'lucide-react';
import CircularProgress from '../../../components/common/CircularProgress';
import FoodSearchModal from './FoodSearchModal';

/**
 * DailyLog - Track daily food intake with meal sections and macro goals
 */
const DailyLog = ({ selectedDate, macroGoals }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showFoodSearch, setShowFoodSearch] = useState(null); // meal type: breakfast, lunch, dinner, snacks
  const [dailyLog, setDailyLog] = useState({
    date: selectedDate.toISOString().split('T')[0],
    meals: {
      breakfast: [
        { id: 1, name: 'Oatmeal with Banana', calories: 300, protein: 10, carbs: 50, fat: 5 },
      ],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  });

  const mealSections = [
    { key: 'breakfast', label: t('nutrition.breakfast') || 'Breakfast', color: 'from-orange-500 to-yellow-500' },
    { key: 'lunch', label: t('nutrition.lunch') || 'Lunch', color: 'from-green-500 to-emerald-500' },
    { key: 'dinner', label: t('nutrition.dinner') || 'Dinner', color: 'from-blue-500 to-cyan-500' },
    { key: 'snacks', label: t('nutrition.snacks') || 'Snacks', color: 'from-purple-500 to-pink-500' },
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
    setDailyLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: [
          ...prev.meals[mealType],
          {
            id: Date.now(),
            ...food,
          },
        ],
      },
    }));
    setShowFoodSearch(null);
  };

  const handleDeleteFood = (mealType, itemId) => {
    setDailyLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].filter((item) => item.id !== itemId),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Macro Summary with Circular Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Calories */}
        <div className="flex flex-col items-center">
          <CircularProgress
            current={totals.calories}
            goal={macroGoals.tdee}
            color="text-accent"
            label={t('nutrition.calories') || 'Calories'}
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
            label={t('nutrition.protein') || 'Protein'}
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
            label={t('nutrition.carbs') || 'Carbs'}
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
            label={t('nutrition.fat') || 'Fat'}
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
      <div className="space-y-4">
        {mealSections.map((section, idx) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-lg border overflow-hidden ${
              isDark
                ? 'border-gray-700 bg-gray-700/50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Section Header */}
            <div
              className={`bg-gradient-to-r ${section.color} p-4 text-white`}
            >
              <h3 className="text-lg font-bold">{section.label}</h3>
              <p className="text-sm opacity-90">
                {dailyLog.meals[section.key].length}{' '}
                {t('nutrition.items') || 'items'}
              </p>
            </div>

            {/* Section Content */}
            <div className="p-4 space-y-3">
              {/* Food Items */}
              <AnimatePresence>
                {dailyLog.meals[section.key].length > 0 ? (
                  dailyLog.meals[section.key].map((food, itemIdx) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        isDark
                          ? 'bg-gray-600'
                          : 'bg-white'
                      } border ${isDark ? 'border-gray-500' : 'border-gray-200'}`}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {food.name}
                        </p>
                        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                          <div>
                            <p
                              className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {food.calories} cal
                            </p>
                          </div>
                          <div>
                            <p
                              className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {food.protein}p
                            </p>
                          </div>
                          <div>
                            <p
                              className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {food.carbs}c
                            </p>
                          </div>
                          <div>
                            <p
                              className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {food.fat}f
                            </p>
                          </div>
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
                    {t('nutrition.noFoodsAdded') || 'No foods added'}
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
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
                {t('nutrition.addFood') || 'Add Food'}
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
