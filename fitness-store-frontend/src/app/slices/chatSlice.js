import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

let storeRef = null;
export const setChatStoreRef = (s) => { storeRef = s; };

api.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState()?.auth?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessage = createAsyncThunk('chat/send', async (message, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/chat', { message });
    return { userMessage: message, botResponse: data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Chat failed');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isOpen: false,
    loading: false,
  },
  reducers: {
    toggleChat(state) { state.isOpen = !state.isOpen; },
    openChat(state) { state.isOpen = true; },
    closeChat(state) { state.isOpen = false; },
    clearMessages(state) { state.messages = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.messages.push({ role: 'user', content: action.meta.arg, timestamp: Date.now() });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'bot',
          content: action.payload.botResponse.message,
          data: action.payload.botResponse,
          timestamp: Date.now(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'bot',
          content: action.payload || 'Sorry, something went wrong. Please try again.',
          timestamp: Date.now(),
        });
      });
  },
});

export const { toggleChat, openChat, closeChat, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
