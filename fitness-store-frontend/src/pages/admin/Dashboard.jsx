import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Users, Package, ShoppingCart, DollarSign, TrendingUp,
  ArrowRight, Clock, Truck, CheckCircle, XCircle, Eye, Calendar
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { accessToken } = useSelector((s) => s.auth);
  const [dashData, setDashData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      axios.get(`${API}/admin/analytics`, { headers }).catch(() => ({ data: { data: null } })),
      axios.get(`${API}/orders/admin/analytics`, { headers }).catch(() => ({ data: { data: null } })),
      axios.get(`${API}/products/admin/all`, { headers, params: { page: 1, limit: 1 } }).catch(() => ({ data: {} })),
      axios.get(`${API}/admin/users`, { headers, params: { page: 1, limit: 5 } }).catch(() => ({ data: {} })),
    ]).then(([adminRes, orderRes, productsRes, usersRes]) => {
      setDashData(adminRes.data?.data || null);
      setOrderData(orderRes.data?.data || null);
      setTotalProducts(productsRes.data?.pagination?.total || 0);
      setRecentUsers(usersRes.data?.data || []);
      setLoading(false);
    });
  }, [accessToken]);

  const metrics = dashData?.metrics || {};
  const statusCounts = orderData?.statusCounts || {};

  const kpiCards = [
    { label: 'Total Users', value: metrics.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-700', link: '/admin/members' },
    { label: 'Total Orders', value: orderData?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-700', link: '/admin/orders' },
    { label: 'Revenue', value: `$${(orderData?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-700', link: '/admin/orders' },
    { label: 'Products', value: totalProducts, icon: Package, color: 'from-orange-500 to-orange-700', link: '/admin/products' },
    { label: 'Class Bookings', value: metrics.totalClassBookings || 0, icon: Calendar, color: 'from-cyan-500 to-cyan-700', link: '/admin/classes' },
    { label: 'PT Sessions', value: metrics.totalTrainerSessions || 0, icon: TrendingUp, color: 'from-rose-500 to-rose-700', link: '/admin/trainers' },
  ];

  const orderStatusCards = [
    { label: 'Pending', value: statusCounts.pending || 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Processing', value: statusCounts.processing || 0, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Shipped', value: statusCounts.shipped || 0, icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Delivered', value: statusCounts.delivered || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Canceled', value: statusCounts.canceled || 0, icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  const quickLinks = [
    { label: 'Manage Products', desc: 'Add, edit, or remove products with SEO', path: '/admin/products', icon: Package },
    { label: 'Manage Orders', desc: 'Track and update order statuses', path: '/admin/orders', icon: ShoppingCart },
    { label: 'User Management', desc: 'View and manage all users', path: '/admin/members', icon: Users },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard | FitStore</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-dark-navy text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of your e-commerce store</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl h-28 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                {kpiCards.map((kpi) => (
                  <motion.div
                    key={kpi.label}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(kpi.link)}
                    className="bg-white/5 rounded-xl p-5 cursor-pointer hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                        <kpi.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm text-gray-400">{kpi.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Order Status Breakdown */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Order Status</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {orderStatusCards.map((card) => (
                    <div key={card.label} className="bg-white/5 rounded-xl p-4 text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${card.bg}`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <p className="text-xl font-bold">{card.value}</p>
                      <p className="text-xs text-gray-400">{card.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              {orderData?.recentOrders?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <button onClick={() => navigate('/admin/orders')} className="text-accent text-sm flex items-center gap-1 hover:underline">
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Order</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Customer</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Total</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Status</th>
                          <th className="text-right px-6 py-3 text-sm text-gray-400">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData.recentOrders.map((order) => (
                          <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-3 font-mono text-sm text-accent">{order.orderNumber}</td>
                            <td className="px-6 py-3 text-sm">
                              {order.user?.firstName} {order.user?.lastName}
                            </td>
                            <td className="px-6 py-3 text-sm font-medium">${order.total?.toFixed(2)}</td>
                            <td className="px-6 py-3">
                              <span className={`text-xs px-2 py-1 rounded capitalize ${
                                order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
                                order.status === 'shipped' ? 'bg-purple-400/20 text-purple-400' :
                                order.status === 'processing' ? 'bg-blue-400/20 text-blue-400' :
                                order.status === 'canceled' ? 'bg-red-400/20 text-red-400' :
                                'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent User Records */}
              {recentUsers.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent User Records</h2>
                    <button onClick={() => navigate('/admin/members')} className="text-accent text-sm flex items-center gap-1 hover:underline">
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Name</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Email</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Role</th>
                          <th className="text-left px-6 py-3 text-sm text-gray-400">Status</th>
                          <th className="text-right px-6 py-3 text-sm text-gray-400">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-3 text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-300">{user.email}</td>
                            <td className="px-6 py-3 text-sm capitalize">{user.role?.replace('_', ' ')}</td>
                            <td className="px-6 py-3">
                              <span className={`text-xs px-2 py-1 rounded ${
                                user.isActive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
                              }`}>
                                {user.isActive ? 'active' : 'inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickLinks.map((link) => (
                    <motion.div
                      key={link.label}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(link.path)}
                      className="bg-white/5 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition flex items-center gap-4"
                    >
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <link.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{link.label}</p>
                        <p className="text-sm text-gray-400">{link.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
