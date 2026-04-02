import { useSelector } from 'react-redux';

/**
 * useApiLoading - Hook to access API loading states
 * Maps loading states to specific API endpoint keys
 * 
 * Usage:
 * const isLoading = useApiLoading('gyms');
 * const { isLoading, error } = useApiLoading('classes');
 */
export const useApiLoading = (key) => {
  const loading = useSelector((state) => state.loading);

  return {
    isLoading: loading[key]?.loading || false,
    error: loading[key]?.error || null,
  };
};

/**
 * useGlobalLoading - Get overall app loading state
 * Useful for global progress bar
 */
export const useGlobalLoading = () => {
  const loading = useSelector((state) => state.loading);
  
  const isAnyLoading = Object.values(loading).some((l) => l?.loading);
  const errorCount = Object.values(loading).filter((l) => l?.error).length;

  return {
    isLoading: isAnyLoading,
    errorCount,
    loadingStates: loading,
  };
};

export default useApiLoading;
