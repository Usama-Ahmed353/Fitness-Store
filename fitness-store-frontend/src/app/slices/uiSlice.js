import { createSlice } from '@reduxjs/toolkit';

// Slice for managing UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    mobileMenuOpen: false,
    darkMode: true,
    toastMessages: [],
    modalStates: {
      loginModal: false,
      signupModal: false,
      bookingModal: false,
      filterModal: false,
    },
    pageLoading: false,
    searchQuery: '',
    filters: {
      sort: 'popular',
      priceRange: [0, 200],
      location: 'all',
    },
    viewMode: 'grid', // 'grid' or 'list'
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sort: 'popular',
        priceRange: [0, 200],
        location: 'all',
      };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    // Modal management
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modalStates.hasOwnProperty(modalName)) {
        state.modalStates[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modalStates.hasOwnProperty(modalName)) {
        state.modalStates[modalName] = false;
      }
    },
    toggleModal: (state, action) => {
      const modalName = action.payload;
      if (state.modalStates.hasOwnProperty(modalName)) {
        state.modalStates[modalName] = !state.modalStates[modalName];
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modalStates).forEach((key) => {
        state.modalStates[key] = false;
      });
    },
    // Toast management
    addToast: (state, action) => {
      const toast = {
        id: Date.now(),
        duration: 3000,
        position: 'bottom-right',
        ...action.payload,
      };
      state.toastMessages.push(toast);
    },
    removeToast: (state, action) => {
      state.toastMessages = state.toastMessages.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toastMessages = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleDarkMode,
  setDarkMode,
  setPageLoading,
  setSearchQuery,
  setFilters,
  clearFilters,
  setViewMode,
  openModal,
  closeModal,
  toggleModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
