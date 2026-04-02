import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Async Thunks
export const fetchMemberProfile = createAsyncThunk(
  'member/fetchMemberProfile',
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/${memberId}`);
      return response.data.member;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateMemberProfile = createAsyncThunk(
  'member/updateMemberProfile',
  async ({ memberId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/members/${memberId}`, data);
      return response.data.member;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const purchaseMembership = createAsyncThunk(
  'member/purchaseMembership',
  async ({ memberId, planId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/members/${memberId}/memberships`,
        { planId, paymentData }
      );
      return response.data.membership;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to purchase membership');
    }
  }
);

export const fetchMemberBookings = createAsyncThunk(
  'member/fetchMemberBookings',
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/${memberId}/bookings`);
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'member/addToFavorites',
  async ({ memberId, itemId, itemType }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/members/${memberId}/favorites`, {
        itemId,
        itemType,
      });
      return response.data.favorite;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'member/removeFromFavorites',
  async ({ memberId, itemId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/members/${memberId}/favorites/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
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
