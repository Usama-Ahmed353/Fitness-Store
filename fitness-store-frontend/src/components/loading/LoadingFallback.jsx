import { PageSkeleton } from './Skeleton';

/**
 * LoadingFallback - Suspense fallback component
 * Shown while lazy-loaded pages are loading
 * 
 * Usage:
 * <Suspense fallback={<LoadingFallback />}>
 *   <YourPageComponent />
 * </Suspense>
 */
export const LoadingFallback = () => {
  return <PageSkeleton />;
};

export default LoadingFallback;
