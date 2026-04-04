import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { fetchMyOrders } from '../../app/slices/orderSlice';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  processing: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  canceled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  returned: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/10' },
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myOrders, loading, pagination } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders({}));
  }, [dispatch]);

  return (
    <>
      <Helmet><title>My Orders | FitStore</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-24 animate-pulse" />)}</div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
              <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-accent text-white rounded-lg">Browse Products</button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-white/5 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-accent">{order.orderNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} capitalize`}>{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} &middot; {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total?.toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
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

export default OrdersPage;
