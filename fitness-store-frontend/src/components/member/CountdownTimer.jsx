import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Clock } from 'lucide-react';

/**
 * CountdownTimer - Shows time until next class
 */
export const CountdownTimer = ({ nextClass = null }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!nextClass) {
      setIsVisible(false);
      return;
    }

    const classTime = new Date(nextClass.classTime);
    const now = new Date();
    const diff = classTime - now;

    // Show countdown only if within 24 hours
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Update countdown every second
    const interval = setInterval(() => {
      const now = new Date();
      const diff = classTime - now;

      if (diff <= 0) {
        setCountdown('00:00:00');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    // Initial update
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}:${String(seconds).padStart(2, '0')}`
    );

    return () => clearInterval(interval);
  }, [nextClass]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`rounded-lg p-6 ${
        isDark
          ? 'bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30'
          : 'bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isDark
              ? 'bg-accent/20 text-accent'
              : 'bg-accent/10 text-accent'
          }`}
        >
          <Clock size={24} />
        </div>

        <div className="flex-1">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('member.nextClass.label')}
          </p>
          <p className={`text-3xl font-bold font-mono mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {countdown}
          </p>

          {nextClass && (
            <div className="mt-3">
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {nextClass.class?.name}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                With {nextClass.class?.instructor?.name} at{' '}
                {new Date(nextClass.classTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
