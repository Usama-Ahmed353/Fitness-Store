import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authReducer from './slices/authSlice';
import gymReducer from './slices/gymSlice';
import classReducer from './slices/classSlice';
import memberReducer from './slices/memberSlice';
import trainerReducer from './slices/trainerSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import loadingReducer from './slices/loadingSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';
import chatReducer from './slices/chatSlice';
import challengeReducer from './slices/challengeSlice';
import { setProductStoreRef } from './slices/productSlice';
import { setCartStoreRef } from './slices/cartSlice';
import { setChatStoreRef } from './slices/chatSlice';
import { setClassStoreRef } from './slices/classSlice';
import { setMemberStoreRef } from './slices/memberSlice';
import { setOrderStoreRef } from './slices/orderSlice';
import { setWishlistStoreRef } from './slices/wishlistSlice';
import { setChallengeStoreRef } from './slices/challengeSlice';

// Create a localStorage wrapper that works in all environments
const storage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' && window.localStorage
        ? Promise.resolve(window.localStorage.getItem(key))
        : Promise.resolve(null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  },
};

// Configure persist for auth and member slices (localStorage)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

const memberPersistConfig = {
  key: 'member',
  storage,
  whitelist: ['currentMembership', 'bookings', 'favorites'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedMemberReducer = persistReducer(memberPersistConfig, memberReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    gyms: gymReducer,
    classes: classReducer,
    member: persistedMemberReducer,
    trainers: trainerReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    loading: loadingReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    chat: chatReducer,
    challenges: challengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

  setProductStoreRef(store);
  setCartStoreRef(store);
  setChatStoreRef(store);
  setClassStoreRef(store);
  setMemberStoreRef(store);
  setOrderStoreRef(store);
  setWishlistStoreRef(store);
  setChallengeStoreRef(store);

export const persistor = persistStore(store);
