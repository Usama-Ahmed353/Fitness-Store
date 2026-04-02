import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { store, persistor } from './app/store';
import AppRouter from './routes/AppRouter';
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import { ThemeProvider } from './context/ThemeContext';
import SkipToMainContent from './components/accessibility/SkipToMainContent';
import AriaLiveRegion from './components/accessibility/AriaLiveRegion';
import LoadingFallback from './components/loading/LoadingFallback';
import './App.css';
import './i18n'; // Initialize i18n

function AppContent() {
  return (
    <>
      {/* Accessibility Components */}
      <SkipToMainContent mainId="main-content" />
      <AriaLiveRegion />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Router with all pages */}
      <AppRouter />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A2E',
            color: '#F5F5F5',
            border: '1px solid #E94560',
          },
          success: {
            style: {
              background: '#1A1A2E',
              color: '#4CAF50',
            },
          },
          error: {
            style: {
              background: '#1A1A2E',
              color: '#E94560',
            },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingFallback />} persistor={persistor}>
            <Suspense fallback={<LoadingFallback />}>
              <AppContent />
            </Suspense>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;

