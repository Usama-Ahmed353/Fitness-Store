import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { Search, Heart, Loader, Clock, Star } from 'lucide-react';

/**
 * FoodDatabase - Browse and manage food database with favorites
 */
const FoodDatabase = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: '100g',
    },
    {
      id: 'brown-rice',
      name: 'Brown Rice',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      serving: '100g',
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      serving: '100g',
    },
  ]);
  const [recentlyViewed, setRecentlyViewed] = useState([
    {
      id: 'oatmeal',
      name: 'Oatmeal',
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      serving: '30g',
    },
    {
      id: 'greek-yogurt',
      name: 'Greek Yogurt',
      calories: 73,
      protein: 10,
      carbs: 3,
      fat: 0.7,
      serving: '100g',
    },
  ]);

  const searchFoodDatabase = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query
        )}&json=1&pageSize=20`
      );
      const data = await response.json();

      const foods = data.products
        .slice(0, 20)
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

  const toggleFavorite = (food) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === food.id);
      if (exists) {
        return prev.filter((f) => f.id !== food.id);
      } else {
        return [...prev, food];
      }
    });
  };

  const isFavorite = (foodId) => favorites.some((f) => f.id === foodId);

  const FoodCard = ({ food, showRecent = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        isDark
          ? 'border-gray-700 bg-gray-700/50'
          : 'border-gray-200 bg-gray-50'
      } hover:border-accent transition-all`}
    >
      {food.url && (
        <img
          src={food.url}
          alt={food.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}

      <h3
        className={`font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {food.name}
      </h3>

      <p
        className={`text-sm mb-3 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {food.calories} cal per {food.serving}
      </p>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div
          className={`text-center p-2 rounded ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}
        >
          <p className="text-xs font-semibold text-blue-500">P</p>
          <p className="text-sm font-bold">{food.protein}g</p>
        </div>
        <div
          className={`text-center p-2 rounded ${
            isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
          }`}
        >
          <p className="text-xs font-semibold text-yellow-500">C</p>
          <p className="text-sm font-bold">{food.carbs}g</p>
        </div>
        <div
          className={`text-center p-2 rounded ${
            isDark ? 'bg-orange-900/30' : 'bg-orange-50'
          }`}
        >
          <p className="text-xs font-semibold text-orange-500">F</p>
          <p className="text-sm font-bold">{food.fat}g</p>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleFavorite(food)}
        className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isFavorite(food.id)
            ? 'bg-accent text-white'
            : isDark
            ? 'bg-gray-600 text-white hover:bg-gray-500'
            : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${isFavorite(food.id) ? 'fill-current' : ''}`}
        />
        {isFavorite(food.id)
          ? t('nutrition.favorite') || 'Favorite'
          : t('nutrition.addFavorite') || 'Add Favorite'}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('nutrition.searchFoods') || 'Search Foods'}
        </h2>

        <div className="relative">
          <Search
            className={`absolute left-3 top-3 w-5 h-5 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          />
          <input
            type="text"
            placeholder={
              t('nutrition.searchPlaceholder') ||
              'Search foods, brands, nutrients...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 placeholder-gray-500'
            }`}
          />
        </div>

        {searchQuery && (
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.poweredByOpenFoodFacts') ||
              'Powered by Open Food Facts API'}
          </p>
        )}
      </motion.div>

      {/* Search Results */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('nutrition.searchResults') || 'Search Results'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((food, idx) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('nutrition.noResultsFound') || 'No results found'}
            </p>
          )}
        </motion.div>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            {t('nutrition.favoritefoods') || 'Favorite Foods'} ({favorites.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <FoodCard food={food} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && !searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Clock className="w-5 h-5 text-accent" />
            {t('nutrition.recentlyViewed') || 'Recently Viewed'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <FoodCard food={food} showRecent />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!searchQuery && favorites.length === 0 && recentlyViewed.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p
            className={`text-lg font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            {t('nutrition.startSearching') || 'Start searching for foods'}
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('nutrition.searchTip') ||
              'Search for any food to see nutritional information'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FoodDatabase;
