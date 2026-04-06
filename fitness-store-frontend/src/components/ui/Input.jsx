import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Input Component
 * Handles floating labels, error states, icons, helper text
 */
const Input = React.forwardRef(
  (
    {
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      icon,
      helperText,
      type = 'text',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(props.value ?? props.defaultValue);
    const leadingIcon = LeftIcon || icon;

    const renderIcon = (iconProp, fallbackSize = 18) => {
      if (!iconProp) return null;
      if (React.isValidElement(iconProp)) {
        return React.cloneElement(iconProp, {
          size: iconProp.props?.size ?? fallbackSize,
        });
      }
      if (typeof iconProp === 'function') {
        const IconComponent = iconProp;
        return <IconComponent size={fallbackSize} />;
      }
      return null;
    };

    return (
      <div className="w-full">
        <div className="relative">
          {/* Left Icon */}
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {renderIcon(leadingIcon, 18)}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(Boolean(e.target.value));
            }}
            className={`
              w-full px-4 py-2.5
              ${label ? 'pt-6 pb-2' : 'py-3'}
              bg-white/95 dark:bg-slate-900/60 border border-slate-300/70 dark:border-slate-700/70
              rounded-xl text-body text-slate-900 dark:text-slate-100
              transition-all duration-200
              focus:outline-none focus:border-primary/80 focus:ring-4 focus:ring-primary/10
              disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              ${leadingIcon ? 'pl-10' : ''}
              ${RightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              className={`
                absolute left-4 pointer-events-none
                transition-all duration-200 origin-left
                ${leadingIcon ? 'left-10' : ''}
                ${
                  isFocused || hasValue
                    ? 'top-2 text-small text-primary font-semibold scale-90'
                    : 'top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium'
                }
              `}
            >
              {label}
            </label>
          )}

          {/* Right Icon */}
          {RightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {renderIcon(RightIcon, 18)}
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 text-small text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-small text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
