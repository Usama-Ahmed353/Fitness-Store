import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Calendar,
  TrendingUp,
  BookOpen,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
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
  const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const tx = (key, fallback) => {
    const value = t(key);
    return !value || value === key ? fallback : value;
  };
  const { accessToken } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('dailyLog');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyMeals, setDailyMeals] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });
  const [loadingLog, setLoadingLog] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [saveError, setSaveError] = useState('');

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
      label: tx('nutrition.dailyLog', 'Daily Log'),
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'mealPlanner',
      label: tx('nutrition.mealPlanner', 'Meal Planner'),
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'foodDatabase',
      label: tx('nutrition.foodDatabase', 'Food Database'),
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      id: 'progress',
      label: tx('nutrition.progress', 'Progress'),
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    if (isToday) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const selectedDateKey = useMemo(
    () => selectedDate.toISOString().split('T')[0],
    [selectedDate]
  );

  const dailyTotals = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(dailyMeals).forEach((mealItems) => {
      mealItems.forEach((item) => {
        totals.calories += Number(item.calories || 0);
        totals.protein += Number(item.protein || 0);
        totals.carbs += Number(item.carbs || 0);
        totals.fat += Number(item.fat || 0);
      });
    });
    return totals;
  }, [dailyMeals]);

  const adherence = useMemo(() => {
    const caloriesGoal = Number(userMacros.tdee || 1);
    return Math.min(100, Math.round((dailyTotals.calories / caloriesGoal) * 100));
  }, [dailyTotals.calories, userMacros.tdee]);

  const isToday = selectedDateKey === new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!accessToken) return;

    const headers = { Authorization: `Bearer ${accessToken}` };
    const loadGoals = async () => {
      try {
        const { data } = await axios.get(`${API}/nutrition/me/goals`, { headers });
        const goals = data?.data;
        if (goals) {
          setUserMacros((prev) => ({
            ...prev,
            tdee: Number(goals.calories || prev.tdee),
            protein: Number(goals.protein || prev.protein),
            carbs: Number(goals.carbs || prev.carbs),
            fat: Number(goals.fat || prev.fat),
            goal: goals.objective || prev.goal,
          }));
        }
      } catch {
        // Keep local defaults if API is unavailable.
      }
    };

    loadGoals();
  }, [API, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const loadLog = async () => {
      try {
        setLoadingLog(true);
        setSaveError('');
        const { data } = await axios.get(`${API}/nutrition/me/logs/${selectedDateKey}`, { headers });
        setDailyMeals(data?.data?.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] });
      } catch {
        setDailyMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
      } finally {
        setLoadingLog(false);
      }
    };

    loadLog();
  }, [API, accessToken, selectedDateKey]);

  const handleMealsChange = async (meals) => {
    setDailyMeals(meals);
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
      setSavingLog(true);
      setSaveError('');
      await axios.put(`${API}/nutrition/me/logs/${selectedDateKey}`, { meals }, { headers });
    } catch {
      setSaveError('Could not sync right now. Changes are kept locally.');
    } finally {
      setSavingLog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
          isDark
            ? 'border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900'
            : 'border-orange-100 bg-gradient-to-br from-orange-50 via-white to-emerald-50'
        }`}
      >
        <div className="absolute inset-y-0 right-0 hidden w-1/3 opacity-40 md:block" style={{ background: 'radial-gradient(circle at 55% 50%, rgba(251,146,60,0.45) 0%, rgba(251,146,60,0) 70%)' }} />

        <div className="relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isDark
                ? 'border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1
            className={`text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {tx('nutrition.title', 'Nutrition Tracker')}
          </h1>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {tx(
              'nutrition.subtitle',
              'Track your meals and reach your fitness goals'
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-100' : 'border border-gray-200 bg-white text-gray-700'}`}>
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {dailyTotals.calories} kcal logged
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-100' : 'border border-gray-200 bg-white text-gray-700'}`}>
              <Target className="h-3.5 w-3.5 text-emerald-500" />
              {adherence}% adherence
            </span>
          </div>
        </div>

        {/* Macro Goals Summary Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative mt-6 p-5 rounded-xl border md:mt-0 ${
            isDark
              ? 'border-gray-600 bg-gray-800/80'
              : 'border-white bg-white/80 shadow-sm'
          }`}
        >
          <p
            className={`text-xs font-semibold mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {tx('nutrition.dailyGoals', 'Daily Goals')}
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
                {tx('nutrition.calories', 'Calories')}
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
                {tx('nutrition.protein', 'Protein')}
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
                {tx('nutrition.carbs', 'Carbs')}
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
                {tx('nutrition.fat', 'Fat')}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Calories Remaining</p>
          <p className={`mt-2 text-2xl font-bold ${dailyTotals.calories > userMacros.tdee ? 'text-red-500' : 'text-emerald-500'}`}>
            {Math.max(0, Number(userMacros.tdee || 0) - dailyTotals.calories)} kcal
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Protein Target</p>
          <p className="mt-2 text-2xl font-bold text-blue-500">{dailyTotals.protein}g / {userMacros.protein}g</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sync Status</p>
          <div className="mt-2 flex items-center gap-2">
            {savingLog ? <Loader2 className="h-5 w-5 animate-spin text-orange-500" /> : saveError ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {savingLog ? 'Saving changes...' : saveError || 'All changes synced'}
            </p>
          </div>
        </div>
      </div>

      {/* Date Navigator (for Daily Log tab) */}
      {activeTab === 'dailyLog' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl border p-6 ${
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
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
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
              disabled={isToday}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
                  : 'text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {!isToday && (
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
      <div className={`rounded-xl border p-2 ${isDark ? 'border-gray-700 bg-gray-800/70' : 'border-gray-200 bg-white'}`}>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-sm'
                  : isDark
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-xl border p-6 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        {activeTab === 'dailyLog' && (
          loadingLog ? (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Loading your nutrition log...</p>
          ) : (
            <DailyLog
              selectedDate={selectedDate}
              macroGoals={userMacros}
              initialMeals={dailyMeals}
              onMealsChange={handleMealsChange}
            />
          )
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
