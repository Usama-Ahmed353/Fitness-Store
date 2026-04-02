import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { TrendingUp, Calendar, Activity } from 'lucide-react';

/**
 * NutritionProgress - Track nutrition progress with charts and trends
 */
const NutritionProgress = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90

  // Mock data for last 30 days
  const generateChartData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: 1800 + Math.random() * 600,
        protein: 150 + Math.random() * 50,
        carbs: 180 + Math.random() * 80,
        fat: 60 + Math.random() * 30,
      });
    }
    return data;
  };

  const [chartData] = useState(generateChartData());

  // Weight tracking data
  const [weights, setWeights] = useState([
    { date: '2024-02-24', weight: 75.5 },
    { date: '2024-02-25', weight: 75.3 },
    { date: '2024-02-26', weight: 75.0 },
    { date: '2024-02-27', weight: 74.8 },
    { date: '2024-02-28', weight: 74.5 },
  ]);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleAddWeight = () => {
    if (newWeight) {
      setWeights((prev) => [
        ...prev,
        { date: newWeightDate, weight: parseFloat(newWeight) },
      ]);
      setNewWeight('');
    }
  };

  const calculateStats = () => {
    const avgCalories = Math.round(
      chartData.reduce((sum, day) => sum + day.calories, 0) / chartData.length
    );
    const avgProtein = Math.round(
      chartData.reduce((sum, day) => sum + day.protein, 0) / chartData.length
    );
    const weightChange = (
      weights[weights.length - 1].weight - weights[0].weight
    ).toFixed(1);

    return { avgCalories, avgProtein, weightChange };
  };

  const stats = calculateStats();

  // Simple bar chart for calorie intake
  const maxCalories = Math.max(...chartData.map((d) => d.calories));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.averageDailyCalories') ||
              'Average Daily Calories'}
          </p>
          <p className={`text-3xl font-bold text-accent mt-2`}>
            {stats.avgCalories}
          </p>
          <p
            className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Last {timeRange} days
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.averageDailyProtein') ||
              'Average Daily Protein'}
          </p>
          <p className={`text-3xl font-bold text-blue-500 mt-2`}>
            {stats.avgProtein}g
          </p>
          <p
            className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Consistent intake
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.weightChange') || 'Weight Change'}
          </p>
          <p
            className={`text-3xl font-bold ${
              stats.weightChange < 0 ? 'text-green-500' : 'text-red-500'
            } mt-2`}
          >
            {stats.weightChange < 0 ? '-' : '+'}
            {Math.abs(stats.weightChange)} kg
          </p>
          <p
            className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            From {weights[0]?.weight} to {weights[weights.length - 1]?.weight} kg
          </p>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7', '30', '90'].map((range) => (
          <motion.button
            key={range}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              timeRange === range
                ? 'bg-accent text-white'
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range} {t('nutrition.days') || 'days'}
          </motion.button>
        ))}
      </div>

      {/* Calorie Intake Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          {t('nutrition.calorieIntakeTrend') ||
            'Calorie Intake Trend'}
        </h3>

        <div className="overflow-x-auto">
          <div className="flex items-end gap-2 min-w-max pr-4" style={{ height: '250px' }}>
            {chartData.map((day, idx) => {
              const height = (day.calories / maxCalories) * 100;
              return (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex flex-col items-center gap-2 flex-1"
                  title={`${day.date}: ${day.calories} cal`}
                >
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t from-accent to-accent/70 hover:from-accent hover:to-accent/90 transition-all cursor-pointer`}
                    style={{ minHeight: '1px' }}
                  />
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      idx % 3 === 0
                        ? isDark
                          ? 'text-gray-300'
                          : 'text-gray-600'
                        : 'hidden'
                    }`}
                  >
                    {day.date}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p
          className={`text-xs mt-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Goal line at 2200 calories
        </p>
      </motion.div>

      {/* Macro Breakdown Pie Chart (simplified) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('nutrition.macroBreakdown') || 'Average Macro Breakdown'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart Representation */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Protein segment (40%) - Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="20"
                  strokeDasharray="125.66 314.16"
                  transform="rotate(-90 50 50)"
                />
                {/* Carbs segment (45%) - Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="20"
                  strokeDasharray="141.37 314.16"
                  strokeDashoffset="-125.66"
                  transform="rotate(-90 50 50)"
                />
                {/* Fat segment (15%) - Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="20"
                  strokeDasharray="47.12 314.16"
                  strokeDashoffset="-267.03"
                  transform="rotate(-90 50 50)"
                />
              </svg>

              <div
                className={`absolute inset-0 flex items-center justify-center text-center`}
              >
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Balanced
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    macros
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <div>
                <p
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Protein - 40%
                </p>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {stats.avgProtein}g avg
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <div>
                <p
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Carbs - 45%
                </p>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  180g avg
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <div>
                <p
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Fat - 15%
                </p>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  65g avg
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weight Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          <Activity className="w-5 h-5" />
          {t('nutrition.weightLog') || 'Weight Log'}
        </h3>

        {/* Add Weight Entry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div>
            <label
              className={`text-sm font-semibold block mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('nutrition.date') || 'Date'}
            </label>
            <input
              type="date"
              value={newWeightDate}
              onChange={(e) => setNewWeightDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label
              className={`text-sm font-semibold block mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('nutrition.weight') || 'Weight'} (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="75.5"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddWeight}
              className="w-full px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all"
            >
              {t('nutrition.addEntry') || 'Add Entry'}
            </motion.button>
          </div>
        </div>

        {/* Weight History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <th
                  className={`text-left py-2 px-3 font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('nutrition.date') || 'Date'}
                </th>
                <th
                  className={`text-right py-2 px-3 font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('nutrition.weight') || 'Weight'}
                </th>
                <th
                  className={`text-right py-2 px-3 font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('nutrition.change') || 'Change'}
                </th>
              </tr>
            </thead>
            <tbody>
              {weights.map((entry, idx) => {
                const change =
                  idx > 0 ? (entry.weight - weights[idx - 1].weight).toFixed(1) : 0;
                return (
                  <tr
                    key={idx}
                    className={`border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : ''}`}>
                      {new Date(entry.date).toLocaleDateString('en-US')}
                    </td>
                    <td
                      className={`text-right py-2 px-3 font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {entry.weight} kg
                    </td>
                    <td
                      className={`text-right py-2 px-3 ${
                        change < 0 ? 'text-green-500' : 'text-red-500'
                      } font-semibold`}
                    >
                      {idx === 0
                        ? '-'
                        : `${change < 0 ? '-' : '+'}${Math.abs(change)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default NutritionProgress;
