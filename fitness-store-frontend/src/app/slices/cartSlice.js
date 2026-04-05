import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const runtimeHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setCartStoreRef = (s) => { storeRef = s; };

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/items', { productId, quantity });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/cart/items/${productId}`, { quantity });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
  }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/items/${productId}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartError(state) { state.error = null; },
    resetCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    const updateCartState = (state, cart) => {
      if (!cart) {
        state.items = [];
        state.subtotal = 0;
        state.total = 0;
        state.itemCount = 0;
        return;
      }
      state.items = cart.items || [];
      state.subtotal = cart.subtotal || 0;
      state.total = cart.total || 0;
      state.itemCount = cart.itemCount || 0;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; updateCartState(state, action.payload); })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addToCart.pending, (state) => { state.loading = true; })
      .addCase(addToCart.fulfilled, (state, action) => { state.loading = false; updateCartState(state, action.payload); })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateCartItem.fulfilled, (state, action) => { updateCartState(state, action.payload); })
      .addCase(removeCartItem.fulfilled, (state, action) => { updateCartState(state, action.payload); })

      .addCase(clearCart.fulfilled, (state) => { state.items = []; state.subtotal = 0; state.total = 0; state.itemCount = 0; });
  },
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
