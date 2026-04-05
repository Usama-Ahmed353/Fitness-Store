import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const runtimeHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

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

function detectAIEndpoint(message) {
  const text = String(message || '').toLowerCase();

  if (/where is my order|track|order status|order id|delivery status/.test(text)) {
    return '/ai/order-status';
  }

  if (/add to cart|remove from cart|update cart|coupon|apply coupon|cart/.test(text)) {
    return '/ai/cart-action';
  }

  if (/recommend|suggest|trending|popular|for me/.test(text)) {
    return '/ai/recommend';
  }

  if (/find|search|show products|looking for|need a|shop/.test(text)) {
    return '/ai/search';
  }

  return '/ai/faq';
}

function toHistory(messages) {
  return messages.slice(-8).map((msg) => ({
    role: msg.role === 'bot' ? 'assistant' : 'user',
    content: msg.content,
  }));
}

function mapCartData(cart) {
  const items = (cart?.items || []).map((item) => ({
    title: item?.product?.title || 'Item',
    slug: item?.product?.slug,
    quantity: item.quantity,
    price: item.price,
    image: item?.product?.images?.[0]?.url,
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    type: 'cart',
    items,
    total,
  };
}

function normalizeAIResponse(endpoint, payload) {
  if (!payload) {
    return {
      message: 'Sorry, I could not process that request.',
      type: 'text',
    };
  }

  if (endpoint === '/ai/search') {
    return {
      type: 'products',
      message: payload.products?.length
        ? `I found ${payload.products.length} products that match your request.`
        : 'I could not find products for that request.',
      products: payload.products || [],
      suggestions: payload.suggestions || [],
    };
  }

  if (endpoint === '/ai/recommend') {
    return {
      type: 'products',
      message: 'Here are recommendations based on your activity and trending products.',
      products: payload.recommendations || [],
      suggestions: (payload.categories || []).map((c) => `Show me ${c}`),
    };
  }

  if (endpoint === '/ai/order-status') {
    return {
      type: payload.type || 'order_tracking',
      message: payload.message,
      order: payload.order,
      timeline: payload.order?.timeline || [],
      suggestions: ['Track another order', 'Show my recent orders'],
    };
  }

  if (endpoint === '/ai/cart-action') {
    const cartData = mapCartData(payload.cart);
    return {
      ...cartData,
      message: payload.message,
      suggestions: ['View my cart', 'Apply coupon FIT20', 'Continue shopping'],
    };
  }

  return {
    type: payload.type || 'text',
    message: payload.message || 'How can I help you next?',
    suggestions: ['Shipping info', 'Return policy', 'Payment options'],
  };
}

export const sendMessage = createAsyncThunk('chat/send', async (message, { rejectWithValue }) => {
  try {
    const currentMessages = storeRef?.getState?.()?.chat?.messages || [];
    const history = toHistory(currentMessages);
    const endpoint = detectAIEndpoint(message);

    const payload = endpoint === '/ai/search'
      ? { userInput: message, history }
      : endpoint === '/ai/recommend'
      ? { userBehaviorData: {}, history }
      : { userMessage: message, history };

    const { data } = await api.post(endpoint, payload);
    const botResponse = normalizeAIResponse(endpoint, data.data);

    return { userMessage: message, botResponse };
  } catch (err) {
    try {
      const { data } = await api.post('/chat', { message });
      return { userMessage: message, botResponse: data.data };
    } catch {
      return rejectWithValue(err.response?.data?.message || 'Chat failed');
    }
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
