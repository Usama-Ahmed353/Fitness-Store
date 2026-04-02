import React from 'react';

/**
 * Skeleton Component - Loading placeholder
 */
const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  circle = false,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${circle ? 'rounded-full' : 'rounded'}
        ${width} ${height}
        ${className}
      `}
      {...props}
    />
  );
};

export default Skeleton;
