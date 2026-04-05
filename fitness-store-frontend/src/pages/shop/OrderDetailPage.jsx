import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, ExternalLink } from 'lucide-react';
import { fetchOrder, cancelOrder, clearSelectedOrder } from '../../app/slices/orderSlice';
import toast from 'react-hot-toast';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusIcons = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle, canceled: XCircle };

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrder: order, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
    return () => { dispatch(clearSelectedOrder()); };
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    const result = await dispatch(cancelOrder({ id, reason: 'Canceled by user' }));
    if (!result.error) toast.success('Order canceled');
    else toast.error(result.payload);
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent" />
      </div>
    );
  }

  const currentStepIdx = statusSteps.indexOf(order.status);
  const isCanceled = order.status === 'canceled' || order.status === 'returned';

  return (
    <>
      <Helmet><title>Order {order.orderNumber} | FitStore</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Orders</button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-gray-400 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {!isCanceled && currentStepIdx < 2 && (
              <button onClick={handleCancel} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm">Cancel Order</button>
            )}
          </div>

          {/* Order Tracking Timeline */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h2 className="font-bold mb-6">Order Status</h2>
            {isCanceled ? (
              <div className="flex items-center gap-3 text-red-400">
                <XCircle className="w-8 h-8" />
                <div>
                  <p className="font-bold capitalize">{order.status}</p>
                  {order.cancelReason && <p className="text-sm text-gray-400">{order.cancelReason}</p>}
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex justify-between">
                  {statusSteps.map((step, i) => {
                    const Icon = statusIcons[step];
                    const isActive = i <= currentStepIdx;
                    const isCurrent = i === currentStepIdx;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10" style={{ width: '25%' }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isActive ? (isCurrent ? 'bg-accent' : 'bg-green-500') : 'bg-white/10'}`}
                        >
                          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        </motion.div>
                        <span className={`text-xs font-medium capitalize ${isActive ? 'text-white' : 'text-gray-500'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress bar */}
                <div className="absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>
            )}

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-sm font-bold text-gray-400 mb-3">History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-gray-400 w-32">{new Date(h.timestamp).toLocaleString()}</span>
                      <span className="capitalize font-medium">{h.status}</span>
                      {h.note && <span className="text-gray-500">- {h.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking */}
            {order.trackingNumber && (
              <div className="mt-6 bg-white/5 rounded-lg p-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-gray-400">Tracking Number</p>
                  <p className="font-mono">{order.trackingNumber}</p>
                </div>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-accent hover:underline flex items-center gap-1 text-sm">
                    Track <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {order.estimatedDelivery && (
              <p className="mt-3 text-sm text-gray-400">Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h2 className="font-bold mb-4">Items ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-3 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h3>
              <p className="text-sm text-gray-300">{order.shippingAddress?.fullName}</p>
              <p className="text-sm text-gray-400">{order.shippingAddress?.street}</p>
              <p className="text-sm text-gray-400">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              {order.shippingAddress?.phone && <p className="text-sm text-gray-400">{order.shippingAddress.phone}</p>}
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{order.shippingCost === 0 ? <span className="text-green-400">Free</span> : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Tax</span><span>${order.tax?.toFixed(2)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-green-400">-${order.discount?.toFixed(2)}</span></div>}
                <hr className="border-white/10" />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-accent">${order.total?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Payment</span><span className={order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'} >{order.paymentStatus}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
