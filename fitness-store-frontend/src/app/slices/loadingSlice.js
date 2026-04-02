import { createSlice } from '@reduxjs/toolkit';

/**
 * loadingSlice - Manages API loading states across the app
 * 
 * Structure:
 * {
 *   [key]: {
 *     loading: boolean,
 *     error: null | string
 *   }
 * }
 * 
 * Usage in async thunks:
 * .pending() -> startLoading(key)
 * .fulfilled() -> stopLoading(key)
 * .rejected() -> setLoadingError(key, error)
 */

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {},
  reducers: {
    // Start loading for a specific key
    startLoading: (state, action) => {
      const key = action.payload;
      state[key] = {
        loading: true,
        error: null,
      };
    },

    // Stop loading for a specific key
    stopLoading: (state, action) => {
      const key = action.payload;
      if (state[key]) {
        state[key].loading = false;
      }
    },

    // Set loading error
    setLoadingError: (state, action) => {
      const { key, error } = action.payload;
      if (state[key]) {
        state[key].loading = false;
        state[key].error = error;
      }
    },

    // Clear error for a specific key
    clearLoadingError: (state, action) => {
      const key = action.payload;
      if (state[key]) {
        state[key].error = null;
      }
    },

    // Clear all loading states
    clearAllLoading: () => ({}),
  },
});

export const {
  startLoading,
  stopLoading,
  setLoadingError,
  clearLoadingError,
  clearAllLoading,
} = loadingSlice.actions;

export default loadingSlice.reducer;
