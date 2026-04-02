import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Token management
let store = null;

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    if (store) {
      const state = store.getState();
      const token = state?.auth?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store?.getState();
      const refreshToken = state?.auth?.refreshToken;

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        apiClient.post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            const { accessToken: newToken } = data;
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            if (store) {
              store.dispatch(setAccessToken(newToken));
            }
            
            processQueue(null, newToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            if (store) {
              store.dispatch(clearAuth());
            }
            reject(err);
          });
      });
    }

    return Promise.reject(error);
  }
);

// Async Thunks
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      if (rememberMe && refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      const { user, accessToken, refreshToken } = response.data;

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (state.auth.accessToken) {
        await apiClient.post('/auth/logout', {});
      }
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];
      return null;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];
      return null;
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshTokenAsync',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { accessToken } = response.data;

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return { accessToken };
    } catch (error) {
      return rejectWithValue('Token refresh failed');
    }
  }
);

export const getMeAsync = createAsyncThunk(
  'auth/getMeAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const verifyTokenAsync = createAsyncThunk(
  'auth/verifyTokenAsync',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Token verification failed');
    }
  }
);

// Keep old names for backwards compatibility
export const loginUser = loginAsync;
export const registerUser = registerAsync;
export const logoutUser = logoutAsync;
export const verifyToken = verifyTokenAsync;

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: false,
    isLoading: false,
    isTokenVerifying: false,
    error: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('refreshToken');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Get Me
    builder
      .addCase(getMeAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('refreshToken');
      });

    // Verify Token
    builder
      .addCase(verifyTokenAsync.pending, (state) => {
        state.isTokenVerifying = true;
      })
      .addCase(verifyTokenAsync.fulfilled, (state, action) => {
        state.isTokenVerifying = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyTokenAsync.rejected, (state) => {
        state.isTokenVerifying = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { clearAuth, setAccessToken, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

// Store reference for interceptor
export const setStore = (reduxStore) => {
  store = reduxStore;
};
