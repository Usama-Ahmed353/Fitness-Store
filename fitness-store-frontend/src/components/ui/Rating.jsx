import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Rating Component
 */
const Rating = ({
  value = 0,
  onChange,
  size = 'md',
  readonly = false,
  className = '',
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const displayValue = hoverValue || value;

  return (
    <div className={`flex gap-1 ${className}`} {...props}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          disabled={readonly}
          className={`transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:text-primary'
          }`}
        >
          <Star
            className={sizeClasses[size]}
            fill={star <= displayValue ? 'currentColor' : 'none'}
            color={star <= displayValue ? '#E94560' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;
