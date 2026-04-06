import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Component
 */
export const Card = ({ variant = 'default', className = '', children, ...props }) => {
  const variantClasses = {
    default: 'bg-white/95 border border-slate-200/80 shadow-sm backdrop-blur-sm',
    hover: 'bg-white/95 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-900/10',
    dark: 'bg-dark-bg/70 border border-accent/20 shadow-lg shadow-black/20 backdrop-blur-sm',
    'dark-hover': 'bg-dark-bg/70 border border-accent/30 shadow-lg shadow-black/20 backdrop-blur-sm hover:shadow-xl hover:border-accent/50',
    bordered: 'bg-transparent border border-slate-300/80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-2xl p-6
        ${variantClasses[variant]}
        ${variant === 'hover' || variant === 'dark-hover' ? 'transition-all duration-300 hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
