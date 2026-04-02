import { useEffect, useState } from 'react';

/**
 * usePWA Hook
 * Manages PWA installation prompt and service worker registration
 */
export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Save the deferred prompt for later use
      setDeferredPrompt(event);
      setIsInstallable(true);

      console.log('[PWA] Install prompt available');
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Avoid stale SW cache in local dev that can cause blank/503 screens.
    if (import.meta.env.DEV) {
      unregisterDevServiceWorkers();
    } else {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Register service worker
   */
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // New service worker is activated
              // Optionally notify user of update
              console.log('[PWA] Service Worker updated');

              // Show update notification
              if (window.confirm('A new version is available! Reload?')) {
                window.location.reload();
              }
            }
          });
        });
      } catch (error) {
        console.warn('[PWA] Service Worker registration failed:', error);
      }
    }
  };

  /**
   * Remove existing service workers/caches in development.
   */
  const unregisterDevServiceWorkers = async () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      console.log('[PWA] Cleared service workers and caches for development');
    } catch (error) {
      console.warn('[PWA] Failed to clear service workers/caches in development:', error);
    }
  };

  /**
   * Trigger PWA install prompt
   */
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`[PWA] User response: ${outcome}`);

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Error prompting install:', error);
      return false;
    }
  };

  /**
   * Uninstall PWA (doesn't actually uninstall, just clears deferred prompt)
   */
  const dismissPrompt = () => {
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    dismissPrompt,
    deferredPrompt,
  };
};

export default usePWA;
