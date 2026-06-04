const CACHE_NAME = 'sap-cache-v1.0.15';
const ASSETS = [
  'index.html',
  'about.html',
  'team.html',
  'authors.html',
  'news.html',
  'events.html',
  'contact.html',
  'order.html',
  'css/styles.css',
  'js/components.js',
  'js/catalog.js',
  'js/sheets-cms.js',
  'js/authors.js',
  'js/events.js',
  'data/fallback-data.js',
  'images/sap logo only.webp',
  'images/San Anselmo Press logo.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(cached => {
        return cached || fetch(e.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  } else {
    // External requests (Google Sheets CSV, dynamic images, etc.)
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response.ok && (url.pathname.endsWith('.webp') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(e.request, response.clone());
              return response;
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(e.request, { ignoreSearch: true });
        })
    );
  }
});
