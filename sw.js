const CACHE_NAME = 'nyts-v16';
const PRECACHE = [
  './',
  'nyts-finalversion16.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/oswald-400.woff2',
  'fonts/oswald-500.woff2',
  'fonts/oswald-600.woff2',
  'fonts/oswald-700.woff2',
  'fonts/roboto-condensed-300.woff2',
  'fonts/roboto-condensed-400.woff2',
  'fonts/roboto-condensed-400-italic.woff2',
  'fonts/roboto-condensed-700.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp.ok && e.request.method === 'GET') {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
