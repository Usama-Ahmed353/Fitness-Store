import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalLoading } from '../../hooks/useApiLoading';
import { useTheme } from '../../context/ThemeContext';

/**
 * GlobalLoadingBar - NProgress-style loading bar
 * Shows during:
 * - Route transitions
 * - API loading states
 * 
 * Features:
 * - Auto-increments to ~90% during loading
 * - Completes with animation
 * - Respects dark mode
 */
export const GlobalLoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { isLoading } = useGlobalLoading();
  const { isDark } = useTheme();

  // Handle route changes
  useEffect(() => {
    // Start progress on route change
    setProgress(10);
    setIsVisible(true);
  }, [location]);

  // Handle API loading state
  useEffect(() => {
    if (isLoading) {
      // Ensure progress bar is visible
      if (!isVisible) {
        setIsVisible(true);
      }

      // Increment progress step by step
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 30; // Random increment
          return next > 90 ? 90 : next; // Cap at 90%
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Complete the progress bar when loading is done
      if (progress > 0) {
        setProgress(100);
        const timer = setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, progress, isVisible]);

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
