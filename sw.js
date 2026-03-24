const CACHE_VERSION = 'kalkal-v5';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/calendars.html',
  '/methodology.html',
  '/eclipses.html',
  '/dynasties.html',
  '/css/style.css',
  '/js/hijri.js',
  '/js/app.js',
  '/js/i18n.js',
  '/js/pages.js',
  '/js/astronomy.js',
  '/js/eclipses.js',
  '/js/ai.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.svg',
  '/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for core, network-first for fonts & large files
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin API requests (Gemini AI)
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('generativelanguage.googleapis.com')) return;

  // Google Fonts: cache after first fetch
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetched = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
        return cached || fetched;
      })
    );
    return;
  }

  // Large files (eclipse data, maps, KaTeX): lazy cache on demand
  if (url.pathname.includes('/maps/') ||
      url.pathname.includes('eclipse_path_data') ||
      url.hostname.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Core assets: cache-first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback: return cached index for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
