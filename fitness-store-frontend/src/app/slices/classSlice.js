import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Async Thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/classes?${params}`);
      return response.data.classes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const fetchClassDetails = createAsyncThunk(
  'classes/fetchClassDetails',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes/${classId}`);
      return response.data.class;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class details');
    }
  }
);

export const bookClass = createAsyncThunk(
  'classes/bookClass',
  async ({ classId, memberId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/classes/${classId}/book`, {
        memberId,
      });
      return response.data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book class');
    }
  }
);

export const cancelClassBooking = createAsyncThunk(
  'classes/cancelClassBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/classes/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

// Slice
const classSlice = createSlice({
  name: 'classes',
  initialState: {
    list: [],
    selectedClass: null,
    myBookings: [],
    filters: {
      type: '',
      trainer: '',
      difficultyLevel: 'all',
      timeSlot: 'all',
      gym: '',
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
        type: '',
        trainer: '',
        difficultyLevel: 'all',
        timeSlot: 'all',
        gym: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    selectClass: (state, action) => {
      state.selectedClass = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Classes
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Class Details
    builder
      .addCase(fetchClassDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = action.payload;
      })
      .addCase(fetchClassDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Book Class
    builder
      .addCase(bookClass.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(bookClass.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.myBookings.push(action.payload);
      })
      .addCase(bookClass.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      });

    // Cancel Booking
    builder
      .addCase(cancelClassBooking.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(cancelClassBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.myBookings = state.myBookings.filter((b) => b._id !== action.payload);
      })
      .addCase(cancelClassBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, selectClass } = classSlice.actions;
export default classSlice.reducer;
