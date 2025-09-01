const CACHE_NAME = 'notes-reloaded-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/favicon.ico',
  '/manifest.json',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.url.startsWith(location.origin)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        return new Response('Contenu non disponible hors ligne.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
