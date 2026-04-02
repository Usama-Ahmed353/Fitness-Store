import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Skeleton - Base animated skeleton component
 * Shows a shimmer effect while content is loading
 */
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  className = '',
  circle = false,
}) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`${
        circle ? 'rounded-full' : 'rounded'
      } overflow-hidden ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'
      } ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
};

/**
 * PageSkeleton - Full page loading skeleton
 * Displays skeleton for navbar, hero, and content sections
 */
export const PageSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`space-y-8 p-4 md:p-8 pt-24 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <div className="space-y-4">
        <Skeleton height="3rem" width="70%" className="mx-auto" />
        <Skeleton height="1.5rem" width="50%" className="mx-auto" />
        <div className="flex gap-3 justify-center pt-4">
          <Skeleton width="120px" height="2.5rem" />
          <Skeleton width="120px" height="2.5rem" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <CardSkeleton key={i} />
          ))}
      </div>
    </motion.div>
  );
};

/**
 * CardSkeleton - Reusable card skeleton
 */
export const CardSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton height="200px" width="100%" className="rounded-md mb-4" />
      <Skeleton height="1.5rem" width="80%" className="mb-2" />
      <Skeleton height="1rem" width="100%" className="mb-2" />
      <Skeleton height="1rem" width="90%" />
      <div className="flex gap-2 mt-4">
        <Skeleton width="50%" height="2rem" />
        <Skeleton width="50%" height="2rem" />
      </div>
    </motion.div>
  );
};

/**
 * GymCardSkeleton - Skeleton for gym listing cards
 */
export const GymCardSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton height="180px" width="100%" className="rounded-md mb-3" />
      <Skeleton height="1.25rem" className="mb-2" />
      <Skeleton height="0.875rem" width="80%" className="mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton height="0.875rem" width="60%" />
        <Skeleton height="0.875rem" width="70%" />
      </div>
      <Skeleton height="2.5rem" width="100%" />
    </motion.div>
  );
};

/**
 * ClassCardSkeleton - Skeleton for class listing cards
 */
export const ClassCardSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton height="1.25rem" width="80%" className="mb-2" />
          <Skeleton height="0.875rem" width="60%" />
        </div>
        <Skeleton width="3rem" height="3rem" circle />
      </div>
      <Skeleton height="0.875rem" width="70%" className="mb-3" />
      <Skeleton height="2.5rem" width="100%" />
    </motion.div>
  );
};

/**
 * ListItemSkeleton - Skeleton for list items
 */
export const ListItemSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <Skeleton width="4rem" height="4rem" className="rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" width="60%" />
          <Skeleton height="0.875rem" width="80%" />
          <Skeleton height="0.875rem" width="50%" />
        </div>
      </div>
    </motion.div>
  );
};

export default Skeleton;
