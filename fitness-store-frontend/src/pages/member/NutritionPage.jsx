import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Calendar,
  TrendingUp,
  BookOpen,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DailyLog from './nutrition/DailyLog';
import MealPlanner from './nutrition/MealPlanner';
import FoodDatabase from './nutrition/FoodDatabase';
import NutritionProgress from './nutrition/NutritionProgress';

/**
 * NutritionPage - Complete nutrition tracking and meal planning module
 * Includes daily logging, meal planning, food database, and progress tracking
 */
const NutritionPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dailyLog');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock user data - replace with API call
  const [userMacros, setUserMacros] = useState({
    weight: 75, // kg
    goal: 'cut', // cut, bulk, maintain
    activityLevel: 1.5, // sedentary, light, moderate, active
    tdee: 2200, // Total Daily Energy Expenditure
    protein: 180, // g
    carbs: 220, // g
    fat: 73, // g
  });

  const tabs = [
    {
      id: 'dailyLog',
      label: t('nutrition.dailyLog') || 'Daily Log',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'mealPlanner',
      label: t('nutrition.mealPlanner') || 'Meal Planner',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'foodDatabase',
      label: t('nutrition.foodDatabase') || 'Food Database',
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      id: 'progress',
      label: t('nutrition.progress') || 'Progress',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1
            className={`text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('nutrition.title') || 'Nutrition Tracker'}
          </h1>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.subtitle') ||
              'Track your meals and reach your fitness goals'}
          </p>
        </div>

        {/* Macro Goals Summary Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`mt-4 md:mt-0 p-4 rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <p
            className={`text-xs font-semibold mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.dailyGoals') || 'Daily Goals'}
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div>
              <p className={`text-2xl font-bold text-accent`}>
                {userMacros.tdee}
              </p>
              <p
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('nutrition.calories') || 'Calories'}
              </p>
            </div>
            <div>
              <p className={`text-2xl font-bold text-blue-500`}>
                {userMacros.protein}g
              </p>
              <p
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('nutrition.protein') || 'Protein'}
              </p>
            </div>
            <div>
              <p className={`text-2xl font-bold text-yellow-500`}>
                {userMacros.carbs}g
              </p>
              <p
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('nutrition.carbs') || 'Carbs'}
              </p>
            </div>
            <div>
              <p className={`text-2xl font-bold text-orange-500`}>
                {userMacros.fat}g
              </p>
              <p
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('nutrition.fat') || 'Fat'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Date Navigator (for Daily Log tab) */}
      {activeTab === 'dailyLog' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-6 rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevDate}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {selectedDate.toDateString() === new Date().toDateString()
                  ? t('nutrition.today') || 'Today'
                  : ''}
              </p>
            </div>

            <button
              onClick={handleNextDate}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {selectedDate.toDateString() !== new Date().toDateString() && (
            <button
              onClick={handleToday}
              className={`w-full mt-4 px-4 py-2 rounded-lg border font-semibold transition-all ${
                isDark
                  ? 'border-gray-600 text-white hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {t('nutrition.goToToday') || 'Go to Today'}
            </button>
          )}
        </motion.div>
      )}

      {/* Tabs */}
      <div
        className={`flex gap-2 overflow-x-auto pb-2 rounded-lg border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `bg-accent text-white`
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {activeTab === 'dailyLog' && (
          <DailyLog
            selectedDate={selectedDate}
            macroGoals={userMacros}
          />
        )}
        {activeTab === 'mealPlanner' && (
          <MealPlanner macroGoals={userMacros} />
        )}
        {activeTab === 'foodDatabase' && (
          <FoodDatabase />
        )}
        {activeTab === 'progress' && (
          <NutritionProgress />
        )}
      </motion.div>
    </div>
  );
};

export default NutritionPage;
