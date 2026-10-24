const CACHE_VERSION = 'kalkal-v51';
// Relative to the SW scope so it works under a subdirectory mount
// (e.g. /kalkal/). Absolute '/...' paths pointed at the origin root and
// 404'd here, which aborted addAll and left the old SW serving stale builds.
const CORE_ASSETS = [
  './',
  './index.html',
  './calendars.html',
  './methodology.html',
  './eclipses.html',
  './dynasties.html',
  './about.html',
  './android.html',
  './css/fonts.css',
  './css/style.css',
  './js/hijri.js',
  './js/app.js',
  './js/i18n.js',
  './js/pages.js',
  './js/astronomy.js',
  './js/eclipses.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './favicon.svg',
  './manifest.json'
];

// Install: cache core assets. Tolerant — a single missing asset must not
// abort the whole install (which would keep the previous SW alive).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(
        CORE_ASSETS.map(a => cache.add(a).catch(() => null))
      ))
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

  // Skip non-GET
  if (event.request.method !== 'GET') return;

  // Bypass /beta/ (and the old /kalkal/beta/ mount) — the Flutter app has
  // its own service worker.
  if (url.pathname.startsWith('/beta/') || url.pathname === '/beta' ||
      url.pathname.startsWith('/kalkal/beta/') || url.pathname === '/kalkal/beta') return;

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

  // Core app code (HTML / JS / CSS): network-first so deploys show up
  // immediately; cache is only an offline fallback. Cache-first here is what
  // froze users on stale builds — never reintroduce it for these assets.
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok && url.origin === self.location.origin) {
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      })
    )
  );
});
