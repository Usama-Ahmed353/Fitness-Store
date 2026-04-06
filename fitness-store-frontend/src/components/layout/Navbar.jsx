import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const { items: cartItems } = useSelector((state) => state.cart || { items: [] });
  const cartCount = cartItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

  const containerClass = isDark
    ? isScrolled
      ? 'bg-slate-950/92 border-b border-slate-700/70 shadow-xl shadow-black/30 backdrop-blur-xl'
      : 'bg-slate-900/78 border-b border-slate-700/45 backdrop-blur-md'
    : isScrolled
    ? 'bg-white/92 border-b border-slate-200/80 shadow-xl shadow-slate-900/8 backdrop-blur-xl'
    : 'bg-white/74 border-b border-slate-200/50 backdrop-blur-md';

  const getNavItemClass = (active) => {
    if (active) {
      return 'text-accent';
    }
    return isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900';
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${containerClass}`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[4.65rem] items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary shadow-lg shadow-accent/30 transition-transform duration-200 group-hover:scale-105">
                <span className="text-sm font-extrabold tracking-wide text-white">CF</span>
              </div>
              <div className="hidden sm:block">
                <p className={`text-base font-extrabold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  CrunchFit
                </p>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Pro
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const active = location.pathname === paths[link.key];
                return (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(paths[link.key])}
                    className={`relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 ${getNavItemClass(active)}`}
                  >
                    {t(link.i18nKey)}
                    {active && (
                      <motion.span
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[0.35rem] left-3 right-3 h-[2.5px] rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={toggleTheme}
                className={`rounded-xl border px-3 py-2 transition-colors duration-200 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-yellow-300 hover:bg-slate-700/80'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={t('navbar.theme')}
                aria-label={t('accessibility.toggleTheme')}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className={`relative rounded-xl border px-3 py-2 transition-colors duration-200 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-700/80'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                {t('common.login')}
              </Button>

              <Button onClick={() => navigate('/free-trial')} variant="primary" size="sm" className="ml-1">
                {t('navbar.viewPlans')}
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => navigate('/cart')}
                className={`relative rounded-xl border p-2 transition-colors duration-200 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-700/80'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`rounded-xl border p-2 transition-colors duration-200 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-yellow-300 hover:bg-slate-700/80'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label={t('accessibility.toggleTheme')}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`rounded-xl border p-2 transition-colors duration-200 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-700/80'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label={t('accessibility.openMenu')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`lg:hidden ${isDark ? 'border-t border-slate-700/60 bg-slate-900/96' : 'border-t border-slate-200/80 bg-white/96'} backdrop-blur-xl`}
            >
              <div className="mx-auto max-w-7xl space-y-2 px-4 pb-5 pt-4 sm:px-6">
                {navLinks.map((link) => {
                  const active = location.pathname === paths[link.key];
                  return (
                    <button
                      key={link.key}
                      onClick={() => handleNavClick(paths[link.key])}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 ${
                        active
                          ? 'bg-accent text-white'
                          : isDark
                          ? 'text-slate-200 hover:bg-slate-800/80'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t(link.i18nKey)}
                    </button>
                  );
                })}

                <div className={`mt-3 grid grid-cols-2 gap-2 border-t pt-3 ${isDark ? 'border-slate-700/60' : 'border-slate-200/80'}`}>
                  <Button onClick={() => navigate('/login')} variant="outline" size="sm" className="w-full">
                    {t('common.login')}
                  </Button>
                  <Button onClick={() => navigate('/free-trial')} variant="primary" size="sm" className="w-full">
                    {t('navbar.viewPlans')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-[4.65rem]" />
    </>
  );
};

export default Navbar;
