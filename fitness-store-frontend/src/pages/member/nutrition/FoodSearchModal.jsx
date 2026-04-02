import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { Search, X, Loader, Plus } from 'lucide-react';

/**
 * FoodSearchModal - Search food database using Open Food Facts API
 */
const FoodSearchModal = ({ mealType, onAddFood, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentFoods, setRecentFoods] = useState([
    { id: 'oats', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '30g' },
    { id: 'chicken', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
    { id: 'rice', name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: '100g' },
    { id: 'banana', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '100g' },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const searchFoodDatabase = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Using Open Food Facts API (free, no API key required)
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query
        )}&json=1&pageSize=10`
      );
      const data = await response.json();

      const foods = data.products
        .slice(0, 10)
        .filter((product) => product.nutriments)
        .map((product) => ({
          id: product.id,
          name: product.product_name || 'Unknown',
          calories: Math.round(product.nutriments['energy-kcal_100g'] || 0),
          protein: Math.round(product.nutriments.proteins_100g || 0),
          carbs: Math.round(product.nutriments.carbohydrates_100g || 0),
          fat: Math.round(product.nutriments.fat_100g || 0),
          serving: '100g',
          url: product.image_url,
        }));

      setResults(foods);
    } catch (error) {
      console.error('Food search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchFoodDatabase(searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(100);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      const multiplier = quantity / 100;
      onAddFood({
        name: selectedFood.name,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier),
        carbs: Math.round(selectedFood.carbs * multiplier),
        fat: Math.round(selectedFood.fat * multiplier),
        quantity,
        serving: selectedFood.serving,
      });
    }
  };

  const getDisplayFoods = searchQuery.trim() ? results : recentFoods;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('nutrition.addFood') || 'Add Food'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        {!selectedFood && (
          <div
            className={`p-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="relative">
              <Search
                className={`absolute left-3 top-3 w-5 h-5 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              />
              <input
                type="text"
                placeholder={
                  t('nutrition.searchFoods') || 'Search foods...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {!searchQuery && (
              <p
                className={`text-sm mt-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('nutrition.showingRecent') ||
                  'Showing recent foods'}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedFood ? (
              // Quantity Selection
              <motion.div
                key="quantity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-6"
              >
                {/* Selected Food Info */}
                <div
                  className={`p-4 rounded-lg flex items-start gap-4 ${
                    isDark
                      ? 'bg-gray-700/50'
                      : 'bg-gray-50'
                  }`}
                >
                  {selectedFood.url && (
                    <img
                      src={selectedFood.url}
                      alt={selectedFood.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {selectedFood.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {selectedFood.calories} cal per 100g
                    </p>
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('nutrition.quantity') || 'Quantity'} ({selectedFood.serving})
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      g
                    </span>
                  </div>
                </div>

                {/* Calculated Macros */}
                <div
                  className={`p-4 rounded-lg grid grid-cols-4 gap-3 ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Calories
                    </p>
                    <p
                      className={`text-xl font-bold text-accent`}
                    >
                      {Math.round(selectedFood.calories * (quantity / 100))}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Protein
                    </p>
                    <p
                      className={`text-xl font-bold text-blue-500`}
                    >
                      {Math.round(selectedFood.protein * (quantity / 100))}g
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Carbs
                    </p>
                    <p
                      className={`text-xl font-bold text-yellow-500`}
                    >
                      {Math.round(selectedFood.carbs * (quantity / 100))}g
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Fat
                    </p>
                    <p
                      className={`text-xl font-bold text-orange-500`}
                    >
                      {Math.round(selectedFood.fat * (quantity / 100))}g
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Food List
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : getDisplayFoods.length > 0 ? (
                  getDisplayFoods.map((food, idx) => (
                    <motion.button
                      key={food.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectFood(food)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isDark
                          ? 'border-gray-700 hover:border-accent hover:bg-gray-700'
                          : 'border-gray-200 hover:border-accent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`font-semibold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {food.name}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {food.calories} cal | {food.protein}g P | {food.carbs}g C | {food.fat}g F
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-accent flex-shrink-0" />
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <p
                    className={`text-center py-8 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {searchQuery
                      ? t('nutrition.noFoodsFound') || 'No foods found'
                      : ''}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          {selectedFood ? (
            <>
              <button
                onClick={() => setSelectedFood(null)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {t('nutrition.back') || 'Back'}
              </button>
              <button
                onClick={handleAddFood}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('nutrition.addToMeal') || 'Add to Meal'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-all"
            >
              {t('nutrition.close') || 'Close'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FoodSearchModal;
