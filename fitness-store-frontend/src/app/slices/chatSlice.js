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
  const compact = text.replace(/\s+/g, ' ').trim();
  const normalized = compact.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ');
  const hasAny = (terms) => terms.some((term) => normalized.includes(term));

  // Fuzzy word match — Jaro-Winkler-like simple check for typo tolerance
  const fuzzyMatch = (word, target) => {
    if (word === target) return true;
    if (word.length < 3 || target.length < 3) return word === target;
    // Simple starts-with + length-diff heuristic for common typos
    const shorter = Math.min(word.length, target.length);
    const longer = Math.max(word.length, target.length);
    if (longer - shorter > 2) return false;
    let matches = 0;
    for (let i = 0; i < shorter; i++) {
      if (word[i] === target[i]) matches++;
    }
    return matches / longer >= 0.75;
  };

  const hasAnyFuzzy = (terms) => terms.some((term) => {
    if (normalized.includes(term)) return true;
    return words.some((w) => fuzzyMatch(w, term));
  });

  // --- Price range detection ---
  const isPriceQuery =
    /\b(under|below|less than|cheaper than|up to|max|maximum)\s*\$?\s*\d+/i.test(compact) ||
    /\b(above|over|more than|greater than|min|minimum|atleast|at least|starting)\s*\$?\s*\d+/i.test(compact) ||
    /\b(between)\s*\$?\s*\d+\s*(and|to|-)\s*\$?\s*\d+/i.test(compact) ||
    /\$\d+/i.test(compact) ||
    hasAnyFuzzy(['cheap', 'budget', 'affordable', 'inexpensive', 'low price', 'low cost',
                 'expensive', 'premium', 'high end', 'highend', 'luxury', 'price range',
                 'price under', 'price below', 'price above', 'price over',
                 'cost less', 'cost more', 'cheapest', 'pricey']);

  // --- Intent detection with expanded synonyms and fuzzy matching ---
  const isCategoryQuery =
    hasAnyFuzzy(['category', 'categories', 'categore', 'catgory', 'catgories', 'catagory', 'catagories',
                 'department', 'departments', 'section', 'sections', 'type', 'types',
                 'collection', 'collections', 'genre', 'genres']) ||
    /what do you sell|types of products|which products|product types|what kind|what sort|what type/.test(normalized);

  const isOrderQuery =
    hasAnyFuzzy(['order status', 'my order', 'orders', 'order', 'track', 'tracking', 'trak', 'traking',
                 'delivery status', 'shipment', 'shipped', 'dispatched', 'dispatch',
                 'parcel', 'package', 'consignment', 'where is my']);

  const isCartQuery =
    hasAnyFuzzy(['cart', 'my cart', 'show cart', 'view cart', 'basket', 'bag', 'shopping bag',
                 'checkout', 'check out', 'coupon', 'promo code', 'voucher', 'shopping cart',
                 'trolley', 'kart']);

  const isRecommendationQuery =
    hasAnyFuzzy(['recommend', 'recommended', 'recomend', 'recomended', 'reccommend',
                 'suggest', 'suggested', 'suggestion', 'suggestions',
                 'trending', 'trendng', 'popular', 'populer', 'fame',
                 'best seller', 'bestseller', 'best selling', 'top products', 'top rated',
                 'hot products', 'hot items', 'whats hot', 'featured',
                 'must have', 'must buy', 'top picks', 'picks for me']);

  const isPolicyQuery =
    hasAnyFuzzy(['shipping', 'shippng', 'shippin', 'delivery', 'delivry', 'deliver',
                 'return', 'returns', 'return policy', 'refund', 'refunds', 'refnd',
                 'exchange', 'exchanges', 'replacement',
                 'policy', 'policies', 'polcy', 'terms', 'warranty', 'guarantee']);

  const isProductSearch =
    /\b(find|search|show|browse|list|display|need|want|shop|give|get|fetch|view|see|explore|discover|lookup|look)\b/.test(compact) &&
      /\b(product|products|item|items|supplement|supplements|equipment|apparel|accessories|gear|stuff|things|goods)\b/.test(compact) ||
    /\b(show me products|show products|view products|all products|products|show me items|show items|view items|all items)\b/.test(compact);

  const isLikelyProductNameQuery =
    compact.length >= 3 &&
    compact.length <= 60 &&
    !/\b(shipping|delivery|return|refund|policy|order|track|cart|coupon|payment|account|login|signup)\b/.test(compact) &&
    /^[a-z0-9\s\-]+$/.test(compact) &&
    compact.split(' ').length <= 6;

  // --- Routing priority ---

  if (isOrderQuery || /where is my order|order id|order number/.test(text)) {
    return '/ai/order-status';
  }

  if (isCartQuery || /add to cart|remove from cart|update cart|apply coupon/.test(text)) {
    return '/ai/cart-action';
  }

  if (isRecommendationQuery || /for me/.test(text)) {
    return '/ai/recommend';
  }

  // Price queries should go to search so they get filtered results
  if (isPriceQuery) {
    return '/ai/search';
  }

  if (isCategoryQuery) {
    return '/chat';
  }

  if (isPolicyQuery) {
    return '/chat';
  }

  if (isProductSearch || /looking for|need a|i want a|give me/.test(text)) {
    return '/ai/search';
  }

  // Support direct product-name queries such as "whey protein", "yoga mat", "creatine".
  if (isLikelyProductNameQuery) {
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
        ? payload.showAll
          ? `Here are all available products in the shop (${payload.totalCount || payload.products.length}).`
          : `I found ${payload.products.length} products that match your request.`
        : 'I could not find products for that request.',
      showAll: Boolean(payload.showAll),
      totalCount: payload.totalCount || payload.products?.length || 0,
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
    const state = storeRef?.getState?.() || {};
    const currentMessages = state.chat?.messages || [];
    const isAuthenticated = Boolean(state.auth?.accessToken);
    const history = toHistory(currentMessages);
    let endpoint = detectAIEndpoint(message);

    // Avoid known auth-only endpoints when user token is missing.
    if (!isAuthenticated && (endpoint === '/ai/order-status' || endpoint === '/ai/cart-action')) {
      endpoint = '/chat';
    }

    const payload = endpoint === '/ai/search'
      ? { userInput: message, history }
      : endpoint === '/ai/recommend'
      ? { userBehaviorData: {}, history }
      : endpoint === '/chat'
      ? { message }
      : { userMessage: message, history };

    const { data } = await api.post(endpoint, payload);
    const botResponse = endpoint === '/chat' ? data.data : normalizeAIResponse(endpoint, data.data);

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
