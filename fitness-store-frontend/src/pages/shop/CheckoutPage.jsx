import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { createOrder, confirmPayment, clearClientSecret } from '../../app/slices/orderSlice';
import { resetCart } from '../../app/slices/cartSlice';
import toast from 'react-hot-toast';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const cardElementOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontSize: '16px',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: {
      color: '#f87171',
    },
  },
};

const CheckoutContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, itemCount } = useSelector((s) => s.cart);
  const { loading: orderLoading, error: orderError, selectedOrder } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [shipping, setShipping] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0 && step === 1) navigate('/cart');
    return () => { dispatch(clearClientSecret()); };
  }, [dispatch, items.length, navigate, step]);

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.street || !shipping.city || !shipping.state || !shipping.zip) {
      return toast.error('Please fill in all required fields');
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) {
      toast.error('Payment form is still loading. Please wait a moment.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card input is not ready. Please refresh and try again.');
      return;
    }

    const createResult = await dispatch(createOrder({ shippingAddress: shipping }));
    if (createResult.error) {
      toast.error(createResult.payload || 'Failed to create order');
      return;
    }

    const order = createResult.payload.order;
    const secret = createResult.payload.clientSecret;

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: shipping.fullName,
          email: user?.email || undefined,
          phone: shipping.phone || undefined,
          address: {
            line1: shipping.street,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zip,
            country: shipping.country,
          },
        },
      },
    });

    if (stripeError) {
      toast.error(stripeError.message || 'Payment failed. Please check card details.');
      return;
    }

    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      toast.error('Payment was not completed. Please try again.');
      return;
    }

    const confirmResult = await dispatch(confirmPayment(order._id));
    if (!confirmResult.error) {
      dispatch(resetCart());
      setStep(3);
      toast.success('Order placed successfully!');
    } else {
      toast.error(confirmResult.payload || 'Payment captured but order confirmation failed.');
    }
  };

  if (step === 3 && selectedOrder) {
    return (
      <>
        <Helmet><title>Order Confirmed | FitStore</title><meta name="robots" content="noindex" /></Helmet>
        <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full mx-4 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 mb-2">Thank you for your purchase</p>
            <p className="text-accent font-mono text-lg mb-6">{selectedOrder.orderNumber}</p>
            <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between mb-2"><span className="text-gray-400">Items</span><span>{selectedOrder.items?.length || 0}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-400">Total</span><span className="font-bold text-accent">${selectedOrder.total?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400 capitalize">{selectedOrder.status}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/orders/${selectedOrder._id}`)} className="flex-1 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold">View Order</button>
              <button onClick={() => navigate('/shop')} className="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">Continue Shopping</button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Checkout | FitStore</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Cart</button>

          {/* Steps */}
          <div className="flex items-center justify-center mb-10">
            {['Shipping', 'Payment'].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 ${step > i + 1 ? 'text-green-400' : step === i + 1 ? 'text-accent' : 'text-gray-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-400 text-black' : step === i + 1 ? 'bg-accent text-white' : 'bg-white/10'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{label}</span>
                </div>
                {i < 1 && <div className={`w-16 sm:w-24 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-400' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleShippingSubmit} className="bg-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                      <input type="text" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Street Address *</label>
                      <input type="text" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">City *</label>
                      <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">State *</label>
                      <input type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">ZIP Code *</label>
                      <input type="text" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold">Continue to Payment</button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment</h2>
                  <div className="bg-white/5 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-400">Your payment info is secure (Stripe sandbox)</span>
                    </div>
                    {!STRIPE_PUBLISHABLE_KEY && (
                      <p className="mb-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300">
                        Missing VITE_STRIPE_PUBLISHABLE_KEY. Add your Stripe test publishable key to complete checkout.
                      </p>
                    )}
                    <label className="block text-sm text-gray-400 mb-2">Card Details</label>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                      <CardElement options={cardElementOptions} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20">Back</button>
                    <button onClick={handlePlaceOrder} disabled={orderLoading || !STRIPE_PUBLISHABLE_KEY || !stripe || !elements} className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold disabled:opacity-50">
                      {orderLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {orderLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </button>
                  </div>
                  {orderError && <p className="mt-3 text-red-400 text-sm">{orderError}</p>}
                </motion.div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-xl p-6 sticky top-8">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-white/10 rounded flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{item.product?.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <hr className="border-white/10 mb-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-400">Free</span> : `$${shippingCost.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Tax</span><span>${tax.toFixed(2)}</span></div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-accent">${total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutContent />
  </Elements>
);

export default CheckoutPage;
