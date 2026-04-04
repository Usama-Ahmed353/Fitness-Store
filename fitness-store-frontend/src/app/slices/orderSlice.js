import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setOrderStoreRef = (s) => { storeRef = s; };

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order not found');
  }
});

export const confirmPayment = createAsyncThunk('orders/confirmPayment', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/orders/${id}/confirm-payment`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment confirmation failed');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/orders/${id}/cancel`, { reason });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
  }
});

// Admin
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/admin/all', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/orders/admin/${id}/status`, body);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const fetchOrderAnalytics = createAsyncThunk('orders/analytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/admin/analytics');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    selectedOrder: null,
    analytics: null,
    clientSecret: null,
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    adminPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError(state) { state.error = null; },
    clearSelectedOrder(state) { state.selectedOrder = null; },
    clearClientSecret(state) { state.clientSecret = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.order;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchOrder.pending, (state) => { state.loading = true; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.selectedOrder = action.payload; })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(confirmPayment.fulfilled, (state, action) => { state.selectedOrder = action.payload; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        const idx = state.myOrders.findIndex((o) => o._id === action.payload._id);
        if (idx >= 0) state.myOrders[idx] = action.payload;
      })

      // Admin
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload.data;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex((o) => o._id === action.payload._id);
        if (idx >= 0) state.allOrders[idx] = action.payload;
        if (state.selectedOrder?._id === action.payload._id) state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderAnalytics.fulfilled, (state, action) => { state.analytics = action.payload; });
  },
});

export const { clearOrderError, clearSelectedOrder, clearClientSecret } = orderSlice.actions;
export default orderSlice.reducer;
