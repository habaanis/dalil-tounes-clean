// Dalil Tounes Service Worker
// Version: 1.2.0
// Strategie: Cache-First pour assets statiques, Network-First pour pages

const STATIC_CACHE = 'dalil-static-v3';
const DYNAMIC_CACHE = 'dalil-dynamic-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// URLs that must NEVER be intercepted by the service worker
function shouldBypass(request) {
  const url = new URL(request.url);

  // Never intercept non-GET requests (POST reservations, etc.)
  if (request.method !== 'GET') return true;

  // Never intercept Supabase (API, Edge Functions, storage)
  if (url.hostname.includes('supabase.co')) return true;

  // Never intercept Edge Function paths served via our own origin proxy
  if (url.pathname.startsWith('/functions/v1/')) return true;

  // Never intercept /entreprise/ pages (SPA deep links)
  if (url.pathname.startsWith('/entreprise/')) return true;

  // Never intercept Resend / Airtable / external APIs
  if (url.hostname.includes('resend.com')) return true;
  if (url.hostname.includes('airtable.com')) return true;

  // Dev environments
  if (url.hostname.includes('webcontainer') || url.hostname.includes('local-credentialless')) return true;

  return false;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== STATIC_CACHE && n !== DYNAMIC_CACHE)
          .map((n) => caches.delete(n))
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (shouldBypass(event.request)) return;

  const { request } = event;

  // Cache-First for static assets (JS, CSS, fonts, images)
  if (request.url.match(/\.(js|css|png|jpg|jpeg|webp|svg|gif|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-First for HTML pages
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
        .then((r) => r || new Response('Offline', { status: 503, statusText: 'Service Unavailable' }))
    );
    return;
  }

  // All other GET requests: Network-First with safe fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
      .then((r) => r || new Response('', { status: 504 }))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
    );
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Dalil Tounes', {
      body: data.body || '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
