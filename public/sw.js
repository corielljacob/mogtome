// MogTome Service Worker v1.0.0
// Provides offline support and intelligent caching for a native app experience

const CACHE_NAME = 'mogtome-v1';
const RUNTIME_CACHE = 'mogtome-runtime-v1';

// Core app shell files to cache on install (critical for offline)
const APP_SHELL = [
  '/',
  '/index.html',
  '/favicon.png',
  '/mogs.png',
];

// API endpoints to cache with network-first strategy
const API_CACHE_PATTERNS = [
  /\/api\/members/,
  /\/api\/events/,
];

// Image domains to cache
const IMAGE_CACHE_PATTERNS = [
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.webp$/,
  /\.svg$/,
  /finalfantasyxiv\.com/,
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache app shell:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip WebSocket/SignalR connections
  if (url.pathname.includes('eventsHub') || request.url.includes('negotiate')) {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests: Network-first with cache fallback
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // Image requests: Cache-first with network fallback
  if (IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(cacheFirstWithNetwork(request));
    return;
  }

  // Navigation requests: Network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets (JS, CSS): Stale-while-revalidate
  if (url.pathname.match(/\.(js|css|woff|woff2)$/)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: Network-first
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Network-first with cache fallback strategy
async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Clone and cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a fallback response for API requests
    return new Response(
      JSON.stringify({ error: 'offline', message: 'You appear to be offline, kupo!' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first with network fallback strategy
async function cacheFirstWithNetwork(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch image:', request.url);
    // Return nothing for failed image requests (will show broken image)
    return new Response('', { status: 404 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Start network fetch in background
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || networkPromise;
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }
});
