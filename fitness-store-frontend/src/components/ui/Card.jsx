import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Component
 */
export const Card = ({ variant = 'default', className = '', children, ...props }) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    hover: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg',
    dark: 'bg-dark-bg/70 border border-accent/20 shadow-sm backdrop-blur-sm',
    'dark-hover': 'bg-dark-bg/70 border border-accent/30 shadow-sm backdrop-blur-sm hover:shadow-lg hover:border-accent/50',
    bordered: 'bg-transparent border-2 border-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-lg p-6
        ${variantClasses[variant]}
        ${variant === 'hover' || variant === 'dark-hover' ? 'transition-shadow duration-300 hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
