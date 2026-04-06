import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setChallengeStoreRef = (s) => {
  storeRef = s;
};

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchChallenges = createAsyncThunk('challenges/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/challenges', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch challenges');
  }
});

export const fetchMyChallenges = createAsyncThunk('challenges/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/challenges/me');
    return data.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your challenges');
  }
});

export const joinChallenge = createAsyncThunk('challenges/join', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/challenges/${id}/join`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to join challenge');
  }
});

export const leaveChallenge = createAsyncThunk('challenges/leave', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/challenges/${id}/leave`);
    return { id, data: data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to leave challenge');
  }
});

export const updateChallengeProgress = createAsyncThunk(
  'challenges/updateProgress',
  async ({ id, progress }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/challenges/${id}/progress`, { progress });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update progress');
    }
  }
);

const challengeSlice = createSlice({
  name: 'challenges',
  initialState: {
    list: [],
    myChallenges: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearChallengeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyChallenges.fulfilled, (state, action) => {
        state.myChallenges = action.payload || [];
      })

      .addCase(joinChallenge.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((c) => c._id === updated._id);
        if (idx >= 0) state.list[idx] = updated;

        const myIdx = state.myChallenges.findIndex((c) => c._id === updated._id);
        if (myIdx >= 0) state.myChallenges[myIdx] = updated;
        else state.myChallenges.push(updated);
      })

      .addCase(leaveChallenge.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const idx = state.list.findIndex((c) => c._id === updated._id);
        if (idx >= 0) state.list[idx] = updated;
        state.myChallenges = state.myChallenges.filter((c) => c._id !== action.payload.id);
      })

      .addCase(updateChallengeProgress.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((c) => c._id === updated._id);
        if (idx >= 0) state.list[idx] = updated;

        const myIdx = state.myChallenges.findIndex((c) => c._id === updated._id);
        if (myIdx >= 0) state.myChallenges[myIdx] = updated;
      });
  },
});

export const { clearChallengeError } = challengeSlice.actions;
export default challengeSlice.reducer;
