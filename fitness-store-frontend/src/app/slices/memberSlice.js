import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setMemberStoreRef = (s) => {
  storeRef = s;
};

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async Thunks
export const fetchMemberProfile = createAsyncThunk(
  'member/fetchMemberProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/members/me');
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateMemberProfile = createAsyncThunk(
  'member/updateMemberProfile',
  async (_, { rejectWithValue }) => rejectWithValue('Profile update endpoint is not available yet')
);

export const purchaseMembership = createAsyncThunk(
  'member/purchaseMembership',
  async ({ gymId, plan, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/members/join', { gymId, plan, paymentMethodId });
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to purchase membership');
    }
  }
);

export const fetchMemberBookings = createAsyncThunk(
  'member/fetchMemberBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/members/me/bookings');
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'member/addToFavorites',
  async (_, { rejectWithValue }) => rejectWithValue('Favorites endpoint is not available yet')
);

export const removeFromFavorites = createAsyncThunk(
  'member/removeFromFavorites',
  async (_, { rejectWithValue }) => rejectWithValue('Favorites endpoint is not available yet')
);

// Slice
const memberSlice = createSlice({
  name: 'member',
  initialState: {
    profile: null,
    currentMembership: null,
    bookings: [],
    favorites: [],
    loading: false,
    profileLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Member Profile
    builder
      .addCase(fetchMemberProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMemberProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // Update Member Profile
    builder
      .addCase(updateMemberProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateMemberProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateMemberProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // Purchase Membership
    builder
      .addCase(purchaseMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMembership = action.payload;
        state.successMessage = 'Membership purchased successfully';
      })
      .addCase(purchaseMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Member Bookings
    builder
      .addCase(fetchMemberBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMemberBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to Favorites
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Remove from Favorites
    builder
      .addCase(removeFromFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter((f) => f._id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = memberSlice.actions;
export default memberSlice.reducer;
