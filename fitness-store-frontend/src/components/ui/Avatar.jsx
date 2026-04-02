import React from 'react';

/**
 * Avatar Component
 */
const Avatar = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-small',
    md: 'w-10 h-10 text-body',
    lg: 'w-12 h-12 text-h3',
    xl: 'w-16 h-16 text-h2',
  };

  const getInitials = (fallback) => {
    if (!fallback) return '?';
    const parts = fallback.split(' ');
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`
        flex items-center justify-center rounded-full
        bg-gradient-to-br from-primary to-primary-dark
        text-white font-bold overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(fallback)}</span>
      )}
    </div>
  );
};

export default Avatar;
