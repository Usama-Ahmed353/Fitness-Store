import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Moon, Sun, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Theme and Language hooks
  const { isDark, toggleTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();

  const { items: cartItems } = useSelector((state) => state.cart || { items: [] });
  const cartCount = cartItems?.length || 0;

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'shop', i18nKey: 'navbar.shop' },
    { key: 'locations', i18nKey: 'navbar.findGym' },
    { key: 'classes', i18nKey: 'navbar.exploreClasses' },
    { key: 'training', i18nKey: 'navbar.startTraining' },
    { key: 'crunch-plus', i18nKey: 'navbar.viewPlans' },
  ];

  const paths = {
    shop: '/shop',
    locations: '/locations',
    classes: '/classes',
    training: '/training',
    'crunch-plus': '/crunch-plus',
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleFreeTrial = () => {
    navigate('/free-trial');
    setIsOpen(false);
  };

  const isActive = (key) => {
    const path = paths[key];
    return location.pathname === path;
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800/50'
              : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
            : isDark
            ? 'bg-gray-900/80 backdrop-blur-sm'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 group"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CF</span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className={`font-bold text-lg leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>CrunchFit</span>
                  <span className="text-accent text-xs font-semibold">Pro</span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.key}
                  onClick={() => handleNavClick(paths[link.key])}
                  whileHover={{ color: '#E94560' }}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    isActive(link.key)
                      ? 'text-accent'
                      : isDark
                      ? 'text-gray-300 hover:text-accent'
                      : 'text-gray-700 hover:text-accent'
                  }`}
                >
                  {t(link.i18nKey)}
                  {isActive(link.key) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={t('navbar.theme')}
                aria-label={t('accessibility.toggleTheme')}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Language Switcher */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <button
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-accent bg-gray-800/30 hover:bg-gray-800/50'
                      : 'text-gray-700 hover:text-accent bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label={t('accessibility.toggleLanguage')}
                  title={t('navbar.language')}
                >
                  {language === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {[
                    { code: 'en', label: '🇺🇸 English' },
                    { code: 'es', label: '🇪🇸 Español' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                        language === lang.code
                          ? 'bg-accent text-white'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Free Trial CTA Button */}
              <Button
                onClick={handleFreeTrial}
                variant="primary"
                size="sm"
                className="animate-pulse-soft"
              >
                {t('navbar.viewPlans')}
              </Button>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cart')}
                className={`relative p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-800/50 text-gray-300 hover:text-accent hover:bg-gray-700/50'
                    : 'bg-gray-100 text-gray-700 hover:text-accent hover:bg-gray-200'
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </motion.button>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                variant="outline"
                size="sm"
              >
                {t('common.login')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={t('accessibility.toggleTheme')}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Mobile Language Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className={`text-sm font-medium px-2 py-1 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-accent bg-gray-800/30 hover:bg-gray-800/50'
                    : 'text-gray-700 hover:text-accent bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label={t('accessibility.toggleLanguage')}
              >
                {language === 'en' ? '🇺🇸' : '🇪🇸'}
              </motion.button>

              {/* Hamburger Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-accent bg-gray-800/30 hover:bg-gray-800/50'
                    : 'text-gray-700 hover:text-accent bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label={t('accessibility.openMenu')}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: 0, opacity: 0 }}
                      animate={{ rotate: 90, opacity: 1 }}
                      exit={{ rotate: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden border-t transition-colors ${
                isDark
                  ? 'bg-gray-800/50 border-gray-700/50'
                  : 'bg-gray-50 border-gray-200/50'
              }`}
            >
              <div className="px-4 py-4 space-y-3 max-w-md">
                {/* Mobile Navigation Links */}
                {navLinks.map((link, idx) => (
                  <motion.button
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleNavClick(paths[link.key])}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(link.key)
                        ? 'bg-accent text-white'
                        : isDark
                        ? 'text-gray-300 hover:bg-gray-700/50'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(link.i18nKey)}
                  </motion.button>
                ))}

                {/* Mobile Action Buttons */}
                <div className={`pt-4 space-y-3 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={handleFreeTrial}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      {t('navbar.viewPlans')}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                      size="md"
                      className="w-full"
                    >
                      {t('common.login')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
