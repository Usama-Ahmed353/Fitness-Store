import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useGlobalLoading } from '../../hooks/useApiLoading';
import { useTheme } from '../../context/ThemeContext';

/**
 * GlobalLoadingBar - NProgress-style loading bar
 * Shows during:
 * - Route transitions
 * - API loading states
 */
export const GlobalLoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { isLoading } = useGlobalLoading();
  const { isDark } = useTheme();
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Handle route changes — quick start + finish
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;

      setProgress(30);
      setIsVisible(true);

      // Auto-complete after a short delay (route chunk usually loads quickly)
      timerRef.current = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 300);
      }, 200);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  // Handle API loading state
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Complete the progress bar
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(hideTimer);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 h-1 z-[9998] ${
        isDark ? 'bg-gradient-to-r from-accent to-accent/50' : 'bg-gradient-to-r from-accent via-accent to-accent/50'
      }`}
      initial={{ width: '0%' }}
      animate={{ width: `${Math.min(progress, 100)}%` }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        boxShadow: '0 0 10px rgba(233, 69, 96, 0.5)',
      }}
    />
  );
};

export default GlobalLoadingBar;
