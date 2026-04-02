import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyImage Component
 * Lazy-loads images using Intersection Observer
 * Shows placeholder/skeleton while loading
 */
const LazyImage = ({
  src,
  alt,
  placeholder = '/placeholder.jpg',
  className = '',
  onLoad,
  width,
  height,
  objectFit = 'cover',
}) => {
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get the image element
    const img = imageRef.current;
    if (!img) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is now in viewport, start loading
            const actualImage = new Image();

            actualImage.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              if (onLoad) onLoad();
              observer.unobserve(img);
            };

            actualImage.onerror = () => {
              // Fallback to placeholder if image fails to load
              console.warn(`Failed to load image: ${src}`);
              observer.unobserve(img);
            };

            // Start loading the image
            actualImage.src = src;
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [src, onLoad]);

  return (
    <motion.div
      ref={imageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden ${className}`}
    >
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit }}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-50'
        }`}
      />

      {/* Loading skeleton overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-dark-navy via-dark-navy/50 to-dark-navy animate-pulse" />
      )}
    </motion.div>
  );
};

/**
 * VirtualImage Component
 * For use in long lists or grids with react-window
 * Coordinates with virtual list scrolling
 */
const VirtualImage = ({ style, data, index }) => {
  const imageData = data[index];

  return (
    <div style={style} className="p-2">
      <LazyImage
        src={imageData.src}
        alt={imageData.alt}
        className="rounded-lg h-full w-full"
      />
    </div>
  );
};

export { LazyImage, VirtualImage };
export default LazyImage;
