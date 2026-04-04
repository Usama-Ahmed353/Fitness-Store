import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, ChevronLeft, ChevronRight, X, Eye,
  DollarSign, Clock, Truck, CheckCircle, XCircle, BarChart3
} from 'lucide-react';
import {
  fetchAllOrders, updateOrderStatus, fetchOrderAnalytics
} from '../../app/slices/orderSlice';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];
const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  processing: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/20' },
  canceled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/20' },
  returned: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/20' },
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { allOrders, allOrdersPagination, allOrdersLoading, analytics } = useSelector((s) => s.orders);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const load = useCallback(() => {
    dispatch(fetchAllOrders({ page, limit: 20, status: statusFilter || undefined }));
  }, [dispatch, page, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { dispatch(fetchOrderAnalytics()); }, [dispatch]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    const result = await dispatch(updateOrderStatus({ id: selectedOrder._id, status: newStatus }));
    if (!result.error) {
      toast.success(`Order updated to ${newStatus}`);
      setSelectedOrder(null);
      setNewStatus('');
      load();
    }
  };

  const totalPages = allOrdersPagination?.pages || 1;

  const statCards = [
    { label: 'Total Revenue', value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-700' },
    { label: 'Total Orders', value: analytics?.totalOrders || allOrdersPagination?.total || 0, icon: Package, color: 'from-blue-500 to-blue-700' },
    { label: 'Avg Order Value', value: `$${(analytics?.averageOrderValue || 0).toFixed(2)}`, icon: BarChart3, color: 'from-purple-500 to-purple-700' },
    { label: 'Pending Orders', value: analytics?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0, icon: Clock, color: 'from-yellow-500 to-yellow-700' },
  ];

  return (
    <>
      <Helmet><title>Order Management | Admin</title></Helmet>
      <div className="min-h-screen bg-dark-navy text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-gray-400 mt-1">Track and manage customer orders</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => { setStatusFilter(''); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!statusFilter ? 'bg-accent text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              All
            </button>
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${statusFilter === s ? 'bg-accent text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Order #</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Items</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrdersLoading ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
                  ) : allOrders?.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                  ) : (
                    allOrders?.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-6 py-4 font-mono text-sm text-accent">{order.orderNumber}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
                          <td className="px-6 py-4 font-medium">${order.total?.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" /> {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition" title="Update Status">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail / Status Update Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#16213E] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold">Order {selectedOrder.orderNumber}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-lg transition"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Customer */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Customer</h3>
                    <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-400">{selectedOrder.user?.email}</p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Items ({selectedOrder.items?.length})</h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{item.product?.title || item.title || 'Product'}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/5 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span>${selectedOrder.subtotal?.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Shipping</span><span>${selectedOrder.shippingCost?.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Tax</span><span>${selectedOrder.tax?.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold border-t border-white/10 pt-2"><span>Total</span><span className="text-accent">${selectedOrder.total?.toFixed(2)}</span></div>
                  </div>

                  {/* Shipping */}
                  {selectedOrder.shippingAddress && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Shipping Address</h3>
                      <p className="text-sm">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Update Status</h3>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent capitalize">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#16213E] capitalize">{s}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setSelectedOrder(null)} className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">Cancel</button>
                    <button onClick={handleStatusUpdate} disabled={newStatus === selectedOrder.status}
                      className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium disabled:opacity-50">
                      Update Status
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default OrdersPage;
