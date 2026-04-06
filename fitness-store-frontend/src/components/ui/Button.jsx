import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button Component
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-small',
    md: 'px-5 py-2.5 text-body',
    lg: 'px-7 py-3.5 text-body',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm hover:shadow-xl hover:shadow-primary/30',
    secondary:
      'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-sm hover:shadow-xl hover:shadow-secondary/25',
    outline:
      'border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 bg-transparent',
    ghost: 'text-primary hover:bg-primary/10 bg-transparent',
    danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/25',
  };

  const isDisabledOrLoading = disabled || isLoading;

  return (
    <motion.button
      whileHover={!isDisabledOrLoading ? { scale: 1.02 } : {}}
      whileTap={!isDisabledOrLoading ? { scale: 0.98 } : {}}
      disabled={isDisabledOrLoading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold tracking-[0.01em] transition-all duration-200
        disabled:opacity-55 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {LeftIcon && !isLoading && <LeftIcon size={size === 'sm' ? 16 : 20} />}
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
      {RightIcon && !isLoading && <RightIcon size={size === 'sm' ? 16 : 20} />}
    </motion.button>
  );
};

export default Button;
