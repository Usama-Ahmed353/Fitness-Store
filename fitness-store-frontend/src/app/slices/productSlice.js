import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach token from store
let storeRef = null;
export const setProductStoreRef = (s) => { storeRef = s; };

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/categories');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
  }
});

export const fetchBrands = createAsyncThunk('products/fetchBrands', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/brands');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch brands');
  }
});

export const fetchTrending = createAsyncThunk('products/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/trending');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch trending');
  }
});

export const fetchFeatured = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured');
  }
});

export const fetchRelated = createAsyncThunk('products/fetchRelated', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${slug}/related`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch related');
  }
});

export const searchAutocomplete = createAsyncThunk('products/autocomplete', async (q, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/autocomplete', { params: { q } });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

// Admin thunks
export const fetchAdminProducts = createAsyncThunk('products/fetchAdmin', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/admin/all', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/products/${id}`, updates);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    selectedProduct: null,
    trending: [],
    featured: [],
    related: [],
    categories: [],
    brands: [],
    autocompleteResults: [],
    adminProducts: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    adminPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    loading: false,
    adminLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.related = [];
    },
    clearAutocomplete(state) {
      state.autocompleteResults = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch by slug
      .addCase(fetchProductBySlug.pending, (state) => { state.loading = true; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })

      // Brands
      .addCase(fetchBrands.fulfilled, (state, action) => { state.brands = action.payload; })

      // Trending
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload; })

      // Featured
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })

      // Related
      .addCase(fetchRelated.fulfilled, (state, action) => { state.related = action.payload; })

      // Autocomplete
      .addCase(searchAutocomplete.fulfilled, (state, action) => { state.autocompleteResults = action.payload; })

      // Admin products
      .addCase(fetchAdminProducts.pending, (state) => { state.adminLoading = true; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminProducts = action.payload.data;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => { state.adminLoading = false; state.error = action.payload; })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminProducts.unshift(action.payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.adminProducts.findIndex((p) => p._id === action.payload._id);
        if (idx >= 0) state.adminProducts[idx] = action.payload;
        if (state.selectedProduct?._id === action.payload._id) state.selectedProduct = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminProducts = state.adminProducts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct, clearAutocomplete, clearError } = productSlice.actions;
export default productSlice.reducer;
