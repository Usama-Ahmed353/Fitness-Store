import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '../../app/slices/wishlistSlice';
import { addToCart } from '../../app/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((s) => s.wishlist);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart({ productId: id })).then((res) => {
      if (!res.error) toast.success('Added to cart!');
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex flex-col items-center justify-center">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please log in</h2>
        <p className="text-gray-400 mb-6">Sign in to view your wishlist</p>
        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-accent text-white rounded-lg">Log In</button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>My Wishlist | FitStore</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist ({products.length})</h1>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 mb-6">Save products you love by clicking the heart icon</p>
              <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-accent text-white rounded-lg">Browse Products</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const finalPrice = product.discount > 0
                  ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
                  : product.price;
                return (
                  <div key={product._id} className="bg-white/5 rounded-xl overflow-hidden group hover:bg-white/10 transition">
                    <div className="relative aspect-square bg-white/5 cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                      )}
                      {product.discount > 0 && <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-accent">${finalPrice.toFixed(2)}</span>
                        {product.discount > 0 && <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddToCart(product._id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition text-sm font-medium">
                          <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </button>
                        <button onClick={() => handleRemove(product._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
