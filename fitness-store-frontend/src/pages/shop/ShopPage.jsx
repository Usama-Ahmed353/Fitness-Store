import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  searchAutocomplete,
  clearAutocomplete,
  searchProductsWithAI,
  fetchAIRecommendations,
} from '../../app/slices/productSlice';
import { addToCart } from '../../app/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../app/slices/wishlistSlice';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = {
  supplements: 'Supplements',
  equipment: 'Equipment',
  apparel: 'Apparel',
  accessories: 'Accessories',
  nutrition: 'Nutrition',
  recovery: 'Recovery',
  cardio: 'Cardio',
  strength: 'Strength',
  yoga: 'Yoga',
  other: 'Other',
};

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    list: products,
    pagination,
    categories,
    brands,
    autocompleteResults,
    loading,
    aiSearchLoading,
    aiSuggestions,
    recommended,
    recommendationsLoading,
  } = useSelector((s) => s.products);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { productIds: wishlistIds } = useSelector((s) => s.wishlist);

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchAIRecommendations({}));
  }, [dispatch]);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.sort) params.sort = filters.sort;
    dispatch(fetchProducts(params));
  }, [dispatch, page, filters, searchParams]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
    dispatch(clearAutocomplete());
  }, [searchInput, searchParams, setSearchParams, dispatch]);

  const handleAISearch = useCallback(async () => {
    const query = searchInput.trim();
    if (!query) return;

    const action = await dispatch(searchProductsWithAI({ userInput: query }));
    if (searchProductsWithAI.fulfilled.match(action)) {
      const aiFilters = action.payload?.filters || {};
      setFilters((prev) => ({
        ...prev,
        category: aiFilters.category || '',
        brand: aiFilters.brand || '',
        minPrice: aiFilters?.price?.min ?? '',
        maxPrice: aiFilters?.price?.max ?? '',
        minRating: aiFilters.minRating || '',
      }));

      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      if (aiFilters.category) params.set('category', aiFilters.category);
      else params.delete('category');
      if (aiFilters.brand) params.set('brand', aiFilters.brand);
      else params.delete('brand');
      if (aiFilters?.price?.min) params.set('minPrice', String(aiFilters.price.min));
      else params.delete('minPrice');
      if (aiFilters?.price?.max) params.set('maxPrice', String(aiFilters.price.max));
      else params.delete('maxPrice');
      if (aiFilters.minRating) params.set('minRating', String(aiFilters.minRating));
      else params.delete('minRating');

      setSearchParams(params);
      toast.success('AI filters applied');
    } else {
      toast.error(action.payload || 'AI search failed');
    }
  }, [dispatch, searchInput, searchParams, setSearchParams]);

  const handleAutocomplete = useCallback((val) => {
    setSearchInput(val);
    if (val.length >= 2) {
      dispatch(searchAutocomplete(val));
    } else {
      dispatch(clearAutocomplete());
    }
  }, [dispatch]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', minRating: '', sort: '-createdAt' });
    setSearchParams({ page: '1' });
    setSearchInput('');
  };

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) return navigate('/login');
    dispatch(addToCart({ productId })).then((res) => {
      if (!res.error) toast.success('Added to cart!');
      else toast.error(res.payload);
    });
  };

  const handleWishlist = (productId) => {
    if (!isAuthenticated) return navigate('/login');
    if (wishlistIds.includes(productId)) {
      dispatch(removeFromWishlist(productId));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(productId));
      toast.success('Added to wishlist!');
    }
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '-createdAt').length;

  return (
    <>
      <Helmet>
        <title>Shop Fitness Products | FitStore</title>
        <meta name="description" content="Browse our collection of fitness supplements, equipment, apparel, and accessories. Find the best products for your workout routine." />
        <meta property="og:title" content="Shop Fitness Products | FitStore" />
        <meta property="og:description" content="Premium fitness products for every workout" />
        <link rel="canonical" href={`${window.location.origin}/shop`} />
      </Helmet>

      <div className="min-h-screen bg-dark-navy text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-dark-navy py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Shop</h1>
            <p className="text-gray-300 mb-6">Premium fitness products for your journey</p>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleAutocomplete(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={handleAISearch}
                disabled={aiSearchLoading || !searchInput.trim()}
                className="absolute right-2 top-2 px-3 py-1.5 bg-accent text-white text-xs rounded-md hover:bg-accent/90 disabled:opacity-60"
              >
                {aiSearchLoading ? 'Thinking...' : 'AI Search'}
              </button>
              {autocompleteResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-dark-navy border border-white/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  {autocompleteResults.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => { navigate(`/product/${p.slug}`); dispatch(clearAutocomplete()); }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-left"
                    >
                      {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-8 h-8 rounded object-cover" />}
                      <div>
                        <div className="text-sm">{p.title}</div>
                        <div className="text-xs text-accent">${p.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
            {aiSuggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-w-3xl">
                {aiSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setSearchInput(suggestion);
                      dispatch(searchProductsWithAI({ userInput: suggestion }));
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Recommended products */}
          {recommended.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Recommended for you</h2>
                {recommendationsLoading && <span className="text-xs text-gray-400">Updating...</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={{ ...product, _id: product.id || product._id }}
                    onAddToCart={handleAddToCart}
                    onWishlist={handleWishlist}
                    isWishlisted={wishlistIds.includes(product.id || product._id)}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filter bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-accent hover:underline">Clear all</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{pagination.total} products</span>
              <select
                value={filters.sort}
                onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings.average">Top Rated</option>
                <option value="-viewCount">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white/5 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{CATEGORY_LABELS[c._id] || c._id} ({c.count})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brand</label>
                  <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b._id} ({b.count})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Min Price</label>
                    <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} placeholder="$0" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                    <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="$999" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Rating</label>
                  <select value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={applyFilters} className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition">Apply Filters</button>
              </div>
            </motion.div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl animate-pulse h-80" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No products found</p>
              <button onClick={clearFilters} className="mt-4 text-accent hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleWishlist}
                  isWishlisted={wishlistIds.includes(product._id)}
                  navigate={navigate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= pagination.pages - 3) {
                  pageNum = pagination.pages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${page === pageNum ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => goToPage(page + 1)} disabled={page >= pagination.pages} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product, onAddToCart, onWishlist, isWishlisted, navigate }) => {
  const finalPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl overflow-hidden group hover:bg-white/10 transition-all duration-300"
    >
      <div className="relative aspect-square bg-white/5 cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.images[0].alt || product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product._id); }}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-xs text-accent uppercase tracking-wide mb-1">{CATEGORY_LABELS[product.category] || product.category}</div>
        <h3
          className="font-semibold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-accent transition"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(product.ratings?.average || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.ratings?.count || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product._id)}
            className="p-2 bg-accent/20 text-accent rounded-lg hover:bg-accent hover:text-white transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPage;
