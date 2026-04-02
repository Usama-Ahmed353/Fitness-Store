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
      helperText,
      type = 'text',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value || props.defaultValue;

    return (
      <div className="w-full">
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LeftIcon size={20} />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(e.target.value !== '');
            }}
            className={`
              w-full px-4 py-2.5 pt-6 pb-2
              bg-white border-2 border-gray-200
              rounded-lg font-body text-body
              transition-all duration-200
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${LeftIcon ? 'pl-10' : ''}
              ${RightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={`
              absolute left-4 pointer-events-none
              transition-all duration-200 origin-left
              ${LeftIcon ? 'left-10' : ''}
              ${
                isFocused || hasValue
                  ? 'top-2 text-small text-primary font-medium scale-90'
                  : 'top-1/2 -translate-y-1/2 text-gray-500 font-normal'
              }
            `}
          >
            {label}
          </label>

          {/* Right Icon */}
          {RightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <RightIcon size={20} />
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
          <p className="mt-1 text-small text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
