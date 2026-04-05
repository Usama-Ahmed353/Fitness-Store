import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setWishlistStoreRef = (s) => { storeRef = s; };

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/wishlist');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    await api.post(`/wishlist/${productId}`);
    return productId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/wishlist/${productId}`);
    return productId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: [],
    productIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.productIds = (action.payload.products || []).map((p) => p._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.productIds.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.productIds = state.productIds.filter((id) => id !== action.payload);
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
