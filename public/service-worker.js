const CACHE_NAME = 'keyboard-visualizer-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/keyboard.svg', // favicon
  '/logo192.png',
  '/logo512.png',
  // アプリケーションのCSSとJavaScriptバンドル (ビルド後にパスが変わる可能性があるので注意)
  // Viteの場合、ビルド後のファイル名はハッシュを含むため、動的に取得するか、
  // Workboxなどのライブラリを使うのがより堅牢。
  // ここでは開発時の'/src/main.jsx'と'/src/styles/index.js'を記述するが、
  // 実際にはビルド後のdistフォルダ内のアセットをキャッシュすべき。
  // デモ目的のため、'/src/main.jsx'と'/src/styles'は含めず、静的アセットのみキャッシュ。
  // Service Workerはルートディレクトリに配置されるため、パスはルートからの相対パス
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache addAll failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-http(s) schemes (chrome-extension, etc.)
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // console.log('[Service Worker] Returning from cache:', event.request.url);
          return response;
        }
        // No cache hit - fetch from network
        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // we can serve it to the browser and cache it.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', event.request.url, error);
            // オフライン時にフォールバックページを提供する場合ここにロジックを追加
            // return caches.match('/offline.html');
            return new Response('Network error occurred.', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});
