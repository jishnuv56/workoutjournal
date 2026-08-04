// Iron Log service worker — caches the app shell so it works offline and can
// be installed as a PWA. It never intercepts cross-origin requests, so calls
// to the GitHub API and Google Fonts always go straight to the network.
const CACHE_NAME = 'iron-log-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './icons/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET requests. Everything else (GitHub API
  // writes/reads, Google Fonts, etc.) passes straight through untouched.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(req);

    const networkFetch = fetch(req).then((resp) => {
      if (resp && resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      }
      return resp;
    }).catch(() => null);

    // Serve from cache instantly if we have it, refreshing in the background;
    // otherwise wait for the network, falling back to cache if that fails.
    if (cached) {
      networkFetch;
      return cached;
    }
    return (await networkFetch) || cached || Response.error();
  })());
});
