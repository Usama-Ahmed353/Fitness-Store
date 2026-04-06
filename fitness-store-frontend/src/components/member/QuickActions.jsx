import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Calendar,
  Users,
  CheckCircle,
  BarChart,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';

/**
 * QuickActionButton - Individual action button
 */
const QuickActionButton = ({ icon: Icon, label, onClick }) => {
  const { isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-lg transition-all ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700 hover:border-accent hover:bg-gray-800'
          : 'bg-white border border-gray-200 hover:border-accent hover:bg-gray-50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isDark
            ? 'bg-accent/20 text-accent'
            : 'bg-accent/10 text-accent'
        }`}
      >
        <Icon size={24} />
      </div>
      <span className={`text-xs md:text-sm font-semibold text-center ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </span>
    </motion.button>
  );
};

/**
 * QuickActions - 6 quick action buttons
 */
export const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    {
      icon: Calendar,
      label: t('member.actions.bookClass'),
      onClick: () => navigate('/member/classes'),
    },
    {
      icon: Users,
      label: t('member.actions.findTrainer'),
      onClick: () => navigate('/member/trainers'),
    },
    {
      icon: CheckCircle,
      label: t('member.actions.checkIn'),
      onClick: () => navigate('/member/checkin'),
    },
    {
      icon: BarChart,
      label: t('member.actions.viewSchedule'),
      onClick: () => navigate('/member/bookings'),
    },
    {
      icon: TrendingUp,
      label: t('member.actions.myProgress'),
      onClick: () => navigate('/member/progress'),
    },
    {
      icon: ShoppingBag,
      label: t('member.actions.shop'),
      onClick: () => navigate('/shop'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {actions.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
          >
            <QuickActionButton {...action} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
