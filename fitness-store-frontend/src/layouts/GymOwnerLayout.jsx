import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  TrendingUp,
  BarChart3,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GymOwnerLayout = ({ children }) => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/gym-owner/dashboard', active: true },
    { icon: Users, label: 'Members', href: '/gym-owner/members' },
    { icon: Calendar, label: 'Classes', href: '/gym-owner/classes' },
    { icon: Dumbbell, label: 'Trainers', href: '/gym-owner/trainers' },
    { icon: TrendingUp, label: 'Revenue', href: '/gym-owner/revenue' },
    { icon: BarChart3, label: 'Analytics', href: '/gym-owner/analytics' },
    { icon: Mail, label: 'Marketing', href: '/gym-owner/marketing' },
    { icon: Settings, label: 'Settings', href: '/gym-owner/settings' },
  ];

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            CF
          </div>
          {isSidebarOpen && (
            <div>
              <p className="font-bold text-sm">CrunchFit</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Go to gym page</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? isDark
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
              </motion.a>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`m-4 p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}
        >
          <div>
            <h1 className="text-xl font-bold">FitLife Gym</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold">
                ✓ Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Subscription Status */}
            <div className={`px-4 py-2 rounded-full text-xs font-bold ${
              isDark
                ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                : 'bg-blue-100 text-blue-700 border border-blue-300'
            }`}>
              🚀 Professional Plan
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  JD
                </div>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                >
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings size={16} className="inline mr-2" />
                    Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg">
                    <LogOut size={16} className="inline mr-2" />
                    Sign Out
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GymOwnerLayout;
