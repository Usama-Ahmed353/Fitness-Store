import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

// Async Thunks
export const fetchGyms = createAsyncThunk(
  'gyms/fetchGyms',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/gyms?${params}`);
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gyms');
    }
  }
);

export const fetchGymDetails = createAsyncThunk(
  'gyms/fetchGymDetails',
  async (gymId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gyms/${gymId}`);
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gym details');
    }
  }
);

// Slice
const gymSlice = createSlice({
  name: 'gyms',
  initialState: {
    list: [],
    selectedGym: null,
    filters: {
      location: '',
      amenities: [],
      priceRange: [0, 200],
      rating: 0,
    },
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        amenities: [],
        priceRange: [0, 200],
        rating: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    selectGym: (state, action) => {
      state.selectedGym = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Gyms
    builder
      .addCase(fetchGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Gym Details
    builder
      .addCase(fetchGymDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGymDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGym = action.payload;
      })
      .addCase(fetchGymDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, selectGym } = gymSlice.actions;
export default gymSlice.reducer;
