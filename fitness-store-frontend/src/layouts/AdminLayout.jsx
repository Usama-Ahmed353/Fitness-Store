import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
  Dumbbell,
  Users2,
  CreditCard,
  BarChart3,
  BookOpen,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { logoutAsync } from '../app/slices/authSlice';

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('admin.dashboard') || 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'members', label: t('admin.members') || 'Members', icon: Users, href: '/admin/members' },
    { id: 'gyms', label: t('admin.gyms') || 'Gyms', icon: Building2, href: '/admin/gyms' },
    { id: 'classes', label: t('admin.classes') || 'Classes', icon: Dumbbell, href: '/admin/classes' },
    { id: 'trainers', label: t('admin.trainers') || 'Trainers', icon: Users2, href: '/admin/trainers' },
    { id: 'payments', label: t('admin.payments') || 'Payments', icon: CreditCard, href: '/admin/payments' },
    { id: 'reports', label: t('admin.reports') || 'Reports', icon: BarChart3, href: '/admin/reports' },
    { id: 'content', label: t('admin.content') || 'Content', icon: BookOpen, href: '/admin/content' },
    { id: 'settings', label: t('admin.settings') || 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  const notifications = [
    { id: 1, type: 'warning', message: 'Stripe webhook failure detected', time: '5 min ago' },
    { id: 2, type: 'info', message: '3 new gym verification requests', time: '1 hour ago' },
    { id: 3, type: 'error', message: 'Database connection latency high', time: '2 hours ago' }
  ];

  const adminUser = {
    name: 'Admin User',
    email: 'admin@crunchfit.com',
    avatar: '👨‍💼'
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
    } finally {
      setShowProfileMenu(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}
      >
        {/* Logo Section */}
        <motion.div
          className="flex items-center justify-between p-4 border-b border-gray-700/50"
          layout
        >
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ delay: sidebarOpen ? 0.1 : 0 }}
            className={`flex items-center gap-2 ${sidebarOpen ? '' : 'hidden'}`}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CrunchFit
            </span>
          </motion.div>

          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.id}
                href={item.href}
                layout
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                whileHover={{ x: 4 }}
              >
                <Icon size={20} className="flex-shrink-0" />
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ delay: sidebarOpen ? 0.1 : 0 }}
                  className={`text-sm font-medium ${sidebarOpen ? '' : 'hidden'}`}
                >
                  {item.label}
                </motion.span>
              </motion.a>
            );
          })}
        </nav>

        {/* Footer */}
        <motion.div
          className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          layout
        >
          <motion.button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 transition-colors ${
              isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
            }`}
            whileHover={{ x: 4 }}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ delay: sidebarOpen ? 0.1 : 0 }}
              className={`text-sm font-medium ${sidebarOpen ? '' : 'hidden'}`}
            >
              {t('common.logout') || 'Logout'}
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between gap-4`}
        >
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              <input
                type="text"
                placeholder={t('common.search') || 'Search...'}
                className={`flex-1 bg-transparent outline-none text-sm ${
                  isDark
                    ? 'text-white placeholder-gray-500'
                    : 'text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-12 w-96 rounded-lg shadow-xl z-50 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t('admin.notifications') || 'Notifications'}
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <motion.div
                          key={notif.id}
                          layout
                          className={`p-4 border-b last:border-b-0 ${
                            isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
                          } cursor-pointer`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'error' ? 'bg-red-500' :
                              notif.type === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                {notif.message}
                              </p>
                              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                  {adminUser.avatar}
                </div>
                <span className={`hidden sm:inline text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {adminUser.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-12 w-64 rounded-lg shadow-xl z-50 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {adminUser.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {adminUser.email}
                      </p>
                    </div>

                    <div className="p-2 space-y-1">
                      <motion.a
                        href="/admin/profile"
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        {t('common.profile') || 'Profile'}
                      </motion.a>
                      <motion.a
                        href="/admin/settings"
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        {t('admin.settings') || 'Settings'}
                      </motion.a>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm text-red-500 transition-colors ${
                          isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                        }`}
                      >
                        {t('common.logout') || 'Logout'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
