const cacheName = 'notes-pwa-v1';
const assets = ['index.html','style.css','app.js','manifest.json'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(cacheName).then(c=>c.addAll(assets)))
);
self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
);
