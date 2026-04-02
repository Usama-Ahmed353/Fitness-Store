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
    sm: 'px-3 py-1.5 text-small',
    md: 'px-4 py-2 text-body',
    lg: 'px-6 py-3 text-body',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg',
    secondary:
      'bg-gradient-to-r from-secondary to-secondary-dark text-white hover:shadow-lg',
    outline:
      'border-2 border-primary text-primary hover:bg-primary/5 bg-transparent',
    ghost: 'text-primary hover:bg-primary/10 bg-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const isDisabledOrLoading = disabled || isLoading;

  return (
    <motion.button
      whileHover={!isDisabledOrLoading ? { scale: 1.02 } : {}}
      whileTap={!isDisabledOrLoading ? { scale: 0.98 } : {}}
      disabled={isDisabledOrLoading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
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
