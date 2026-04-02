import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  Check,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    category: 'Members',
    type: 'join',
    title: 'New Member Joined',
    message: 'Sarah Johnson joined your gym',
    timestamp: '2 minutes ago',
    read: false,
    icon: Users,
    color: 'blue',
    actionUrl: '/gym-owner/members',
  },
  {
    id: 2,
    category: 'Classes',
    type: 'check-in',
    title: 'Class Check-in Alert',
    message: 'Morning Cardio class at 06:00 has started. 25/30 members checked in.',
    timestamp: '1 hour ago',
    read: false,
    icon: Calendar,
    color: 'purple',
    actionUrl: '/gym-owner/classes',
  },
  {
    id: 3,
    category: 'Payments',
    type: 'success',
    title: 'Payment Received',
    message: '$299 received from Professional Plan subscription',
    timestamp: '2 hours ago',
    read: false,
    icon: CreditCard,
    color: 'green',
    actionUrl: '/gym-owner/subscription',
  },
  {
    id: 4,
    category: 'Classes',
    type: 'low-attendance',
    title: 'Low Attendance Alert',
    message: 'Evening Yoga class (18:00) has only 3/20 bookings',
    timestamp: '3 hours ago',
    read: true,
    icon: AlertCircle,
    color: 'red',
    actionUrl: '/gym-owner/classes',
  },
  {
    id: 5,
    category: 'Members',
    type: 'review',
    title: 'New Review',
    message: 'Jessica Lee left a 5-star review: "Great equipment and staff!"',
    timestamp: '5 hours ago',
    read: true,
    icon: Users,
    color: 'yellow',
    actionUrl: '/gym-owner/members',
  },
  {
    id: 6,
    category: 'System',
    type: 'verification',
    title: 'Gym Verified',
    message: 'Your gym has been verified successfully!',
    timestamp: '1 day ago',
    read: true,
    icon: CheckCircle,
    color: 'green',
    actionUrl: '/gym-owner/settings',
  },
];

const NotificationCenter = ({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => n.category.toLowerCase() === filter);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const categories = ['all', 'members', 'classes', 'payments', 'system'];
  const colorMap = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100',
    green: 'from-green-500 to-green-600 text-green-100',
    red: 'from-red-500 to-red-600 text-red-100',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-100',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed right-0 top-0 h-screen w-96 flex flex-col z-50 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-l`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bell size={24} />
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-4 border-b border-gray-700 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Filter</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      filter === cat
                        ? 'bg-blue-600 text-white'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell size={32} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No notifications
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          notif.read
                            ? isDark
                              ? 'bg-gray-700'
                              : 'bg-gray-50'
                            : isDark
                            ? 'bg-blue-900/20 border border-blue-900/50'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          // In production, navigate to actionUrl
                        }}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorMap[notif.color]} flex-shrink-0`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-sm">{notif.title}</p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {notif.message}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {notif.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            className={`flex-1 text-xs py-1 rounded transition-colors ${
                              isDark
                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                            }`}
                          >
                            <Check size={12} className="inline mr-1" />
                            Read
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notif.id);
                            }}
                            className={`flex-1 text-xs py-1 rounded transition-colors ${
                              isDark
                                ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300'
                                : 'bg-red-100 hover:bg-red-200 text-red-700'
                            }`}
                          >
                            <Trash2 size={12} className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
