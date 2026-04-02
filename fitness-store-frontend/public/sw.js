/**
 * Service Worker for CrunchFit Pro
 * Handles offline caching of static assets and API responses
 */

const CACHE_NAME = 'crunchfit-v1';
const OFFLINE_FALLBACK = '/offline.html';

// Paths to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/index.css',
  '/icons/logo.svg',
];

// Paths to avoid caching (dynamic/protected)
const DYNAMIC_ROUTES = [
  '/api/',
  '/login',
  '/register',
  '/member/',
  '/admin/',
  '/gym-owner/',
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('[ServiceWorker] Cache addAll error:', error);
      });
    })
  );

  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip dynamic routes
  if (DYNAMIC_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (
            response &&
            response.status === 200 &&
            response.type !== 'error'
          ) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Return offline page or placeholder
          if (request.destination === 'document') {
            return caches.match(OFFLINE_FALLBACK) ||
              new Response('Offline - please try again later', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain',
                }),
              });
          }

          // For images, return a placeholder
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#1a1a2e" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="#e94560" font-size="12">Offline</text></svg>',
              {
                headers: { 'Content-Type': 'image/svg+xml' },
              }
            );
          }

          return new Response('Offline - please try again later', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
