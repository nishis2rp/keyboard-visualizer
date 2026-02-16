/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Version should be updated on each significant change to force cache invalidation
const CACHE_VERSION = 'v3';
const CACHE_NAME = `keyboard-visualizer-cache-${CACHE_VERSION}`;

const urlsToCache: string[] = [
  '/',
  '/index.html',
  '/manifest.json',
  '/keyboard.svg',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network First strategy for JS/CSS and API calls to ensure updates are reflected
  // This prevents the "disappearing lines" bug from being stuck in cache
  if (
    request.destination === 'script' || 
    request.destination === 'style' ||
    url.hostname.includes('supabase.co')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || new Response('Offline', { status: 503 })))
    );
    return;
  }

  // Cache First strategy for static assets like images
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
