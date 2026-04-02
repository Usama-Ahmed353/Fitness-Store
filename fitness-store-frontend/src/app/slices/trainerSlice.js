import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Async Thunks
export const fetchTrainers = createAsyncThunk(
  'trainers/fetchTrainers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/trainers?${params}`);
      return response.data.trainers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainers');
    }
  }
);

export const fetchTrainerDetails = createAsyncThunk(
  'trainers/fetchTrainerDetails',
  async (trainerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/${trainerId}`);
      return response.data.trainer;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainer details');
    }
  }
);

export const bookTrainerSession = createAsyncThunk(
  'trainers/bookTrainerSession',
  async ({ trainerId, memberId, sessionData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/trainers/${trainerId}/book`,
        { memberId, ...sessionData }
      );
      return response.data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book session');
    }
  }
);

export const rateTrainer = createAsyncThunk(
  'trainers/rateTrainer',
  async ({ trainerId, memberId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trainers/${trainerId}/rate`, {
        memberId,
        rating,
        comment,
      });
      return response.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate trainer');
    }
  }
);

// Slice
const trainerSlice = createSlice({
  name: 'trainers',
  initialState: {
    list: [],
    selectedTrainer: null,
    myTrainers: [],
    bookings: [],
    filters: {
      specialty: '',
      gym: '',
      minRating: 0,
      experience: 'all',
    },
    loading: false,
    bookingLoading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        specialty: '',
        gym: '',
        minRating: 0,
        experience: 'all',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    selectTrainer: (state, action) => {
      state.selectedTrainer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Trainers
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Trainer Details
    builder
      .addCase(fetchTrainerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrainer = action.payload;
      })
      .addCase(fetchTrainerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Book Trainer Session
    builder
      .addCase(bookTrainerSession.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(bookTrainerSession.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(bookTrainerSession.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      });

    // Rate Trainer
    builder
      .addCase(rateTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateTrainer.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedTrainer) {
          state.selectedTrainer.reviews = [
            ...(state.selectedTrainer.reviews || []),
            action.payload,
          ];
        }
      })
      .addCase(rateTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, selectTrainer } = trainerSlice.actions;
export default trainerSlice.reducer;
