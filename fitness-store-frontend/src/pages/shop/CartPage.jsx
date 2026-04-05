import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../../app/slices/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, total, itemCount, loading } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const handleUpdateQty = (productId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ productId, quantity: qty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId)).then((res) => {
      if (!res.error) toast.success('Item removed');
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart()).then(() => toast.success('Cart cleared'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please log in</h2>
        <p className="text-gray-400 mb-6">Sign in to view your shopping cart</p>
        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90">Log In</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart | FitStore</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart ({itemCount})</h1>
            {items.length > 0 && (
              <button onClick={handleClearCart} className="text-sm text-red-400 hover:text-red-300">Clear Cart</button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Looks like you haven't added anything yet</p>
              <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90">Start Shopping</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/5 rounded-xl p-4 flex gap-4"
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate cursor-pointer hover:text-accent" onClick={() => navigate(`/product/${product.slug}`)}>{product.title}</h3>
                          <p className="text-accent font-bold">${item.price.toFixed(2)}</p>
                          {product.discount > 0 && <p className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center bg-white/10 rounded-lg">
                              <button onClick={() => handleUpdateQty(product._id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 hover:bg-white/10 rounded-l-lg disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button onClick={() => handleUpdateQty(product._id, item.quantity + 1)} disabled={item.quantity >= (product.stock || 99)} className="p-1.5 hover:bg-white/10 rounded-r-lg disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => handleRemove(product._id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-xl p-6 sticky top-8">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Subtotal ({itemCount} items)</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{subtotal >= 50 ? <span className="text-green-400">Free</span> : '$5.99'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Tax (est.)</span><span>${(subtotal * 0.08).toFixed(2)}</span></div>
                    <hr className="border-white/10" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-accent">${(subtotal + (subtotal >= 50 ? 0 : 5.99) + subtotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition font-semibold"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate('/shop')} className="w-full flex items-center justify-center gap-2 mt-3 text-gray-400 hover:text-white text-sm transition">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
