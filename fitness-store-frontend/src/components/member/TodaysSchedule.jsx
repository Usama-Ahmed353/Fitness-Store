import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Clock, MapPin, User } from 'lucide-react';
import Button from '../ui/Button';

/**
 * TodaysSchedule - Shows classes booked for today
 */
export const TodaysSchedule = ({ bookings = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Filter today's classes
  const today = new Date().toDateString();
  const todaysClasses = bookings.filter(
    (booking) => new Date(booking.classTime).toDateString() === today
  );

  const handleCheckIn = (bookingId) => {
    // TODO: Check in to class
    console.log('Check in to class:', bookingId);
  };

  const handleBookClass = () => {
    navigate('/member/bookings');
  };

  if (todaysClasses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`rounded-lg p-8 text-center ${
          isDark
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        <p className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('member.schedule.noClasses')}
        </p>
        <Button
          onClick={handleBookClass}
          variant="primary"
        >
          {t('member.schedule.bookNow')}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`rounded-lg p-6 ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('member.schedule.today')}
      </h2>

      <div className="space-y-3">
        {todaysClasses.map((booking, idx) => {
          const classTime = new Date(booking.classTime);
          const checkInEnabled = isCheckInEnabled(classTime);

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-4 rounded-lg flex items-start justify-between ${
                isDark
                  ? 'bg-gray-700/50 hover:bg-gray-700'
                  : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors group border ${
                isDark ? 'border-gray-600/50' : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {booking.class?.name}
                </h3>
                <div
                  className={`mt-2 space-y-1 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {classTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    {booking.class?.instructor?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {booking.class?.gym?.name}
                  </div>
                </div>
              </div>

              {/* Check In Button */}
              <Button
                onClick={() => handleCheckIn(booking.id)}
                disabled={!checkInEnabled}
                size="sm"
                variant={checkInEnabled ? 'primary' : 'outline'}
                className="ml-4 whitespace-nowrap"
              >
                {t('member.schedule.checkIn')}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/**
 * Check if check-in is enabled (30 min before class)
 */
function isCheckInEnabled(classTime) {
  const now = new Date();
  const thirtyMinBefore = new Date(classTime.getTime() - 30 * 60 * 1000);
  return now >= thirtyMinBefore && now < classTime;
}

export default TodaysSchedule;
