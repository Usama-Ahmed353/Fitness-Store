import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Salad,
  TrendingUp,
  Trophy,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';

/**
 * MemberLayout - Main layout for authenticated member pages
 * - Sidebar (desktop) / Bottom navigation (mobile)
 * - Top bar with greeting, notifications, profile dropdown
 * - Responsive design
 */
const MemberLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const { profile: memberProfile } = useSelector((state) => state.member);
  const user = useSelector((state) => state.auth.user);

  const memberName = memberProfile?.name || user?.name || 'Member';
  const memberInitials = memberName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: t('member.nav.dashboard'),
      icon: LayoutDashboard,
      path: '/member/dashboard',
    },
    {
      id: 'classes',
      label: t('member.nav.myClasses'),
      icon: Calendar,
      path: '/member/bookings',
    },
    {
      id: 'trainers',
      label: t('member.nav.trainers'),
      icon: Users,
      path: '/member/trainers',
    },
    {
      id: 'nutrition',
      label: t('member.nav.nutrition'),
      icon: Salad,
      path: '/member/nutrition',
    },
    {
      id: 'progress',
      label: t('member.nav.progress'),
      icon: TrendingUp,
      path: '/member/progress',
    },
    {
      id: 'challenges',
      label: t('member.nav.challenges'),
      icon: Trophy,
      path: '/member/challenges',
    },
    {
      id: 'community',
      label: t('member.nav.community'),
      icon: MessageSquare,
      path: '/member/community',
    },
    {
      id: 'settings',
      label: t('common.settings'),
      icon: Settings,
      path: '/member/settings',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleSignOut = () => {
    // TODO: Dispatch logout action
    navigate('/login');
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('member.greeting.morning');
    if (hour < 18) return t('member.greeting.afternoon');
    return t('member.greeting.evening');
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-64 border-r transition-colors ${
          isDark
            ? 'border-gray-800 bg-gray-800/50'
            : 'border-gray-200 bg-white/50'
        } backdrop-blur-sm`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/member/dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div>
              <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                CrunchFit
              </div>
              <div className="text-accent text-xs font-semibold">Pro</div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-accent text-white shadow-lg'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header
          className={`border-b transition-colors ${
            isDark
              ? 'bg-gray-800/50 border-gray-800'
              : 'bg-white/50 border-gray-200'
          } backdrop-blur-sm`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Left: Greeting + Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>

              {/* Greeting */}
              <div className="hidden sm:block">
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {getGreeting()}
                </p>
                <p className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {memberName}
                </p>
              </div>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
                aria-label={t('accessibility.notifications')}
              >
                <Bell size={20} />
                {/* Badge */}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"
                />
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700/50 hover:bg-gray-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label={t('member.nav.profile')}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      isDark
                        ? 'bg-accent/20 text-accent'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {memberInitials}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      key="profile-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl border z-50 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {[
                        { label: t('member.nav.profile'), path: '/member/profile' },
                        { label: t('member.nav.billing'), path: '/member/billing' },
                        { label: t('common.settings'), path: '/member/settings' },
                      ].map((item, idx) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            handleNavClick(item.path);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            idx < 2 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''
                          } ${
                            isDark
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      ))}

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                          isDark
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut size={16} />
                        <span className="text-sm font-medium">{t('common.signOut')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          className={`lg:hidden fixed bottom-0 left-0 right-0 border-t transition-colors ${
            isDark
              ? 'bg-gray-800/95 border-gray-700'
              : 'bg-white/95 border-gray-200'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center justify-around overflow-x-auto">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 min-w-max transition-colors ${
                    active ? 'text-accent' : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 lg:hidden z-40"
              />
              <motion.div
                key="mobile-sidebar"
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ duration: 0.3 }}
                className={`fixed left-0 top-0 bottom-0 w-64 z-50 overflow-y-auto ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Mobile Sidebar Content */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">{t('member.nav.navigation')}</p>
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            active
                              ? 'bg-accent text-white'
                              : isDark
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemberLayout;
