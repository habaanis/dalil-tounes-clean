// Dalil Tounes Service Worker
// Version: 1.4.0
// Strategie: Network-First pour le HTML, cache valide uniquement pour les assets

const CACHE_VERSION = 'v11';
const STATIC_CACHE = `dalil-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dalil-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = self.location.hostname === 'app.dalil-tounes.com'
  ? ['/offline.html']
  : ['/manifest.json', '/offline.html'];

const ASSET_RE = /\.(js|css|png|jpg|jpeg|webp|svg|gif|woff|woff2|ttf|eot)$/;

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

function isHtmlRequest(request) {
  const accept = request.headers.get('accept') || '';
  return request.mode === 'navigate' || accept.includes('text/html');
}

function isStaticAsset(request) {
  return ASSET_RE.test(new URL(request.url).pathname);
}

function isValidAssetResponse(request, response) {
  if (!response || !response.ok) return false;

  const pathname = new URL(request.url).pathname;
  const contentType = response.headers.get('content-type') || '';

  // A Vite JS chunk must never be cached if the server returned the SPA HTML fallback.
  if (pathname.endsWith('.js')) {
    return (
      contentType.includes('javascript') ||
      contentType.includes('ecmascript') ||
      contentType.includes('text/javascript')
    );
  }

  if (pathname.endsWith('.css')) {
    return contentType.includes('text/css');
  }

  return !contentType.includes('text/html');
}

async function deleteOldCaches() {
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((n) => n !== STATIC_CACHE && n !== DYNAMIC_CACHE)
      .map((n) => caches.delete(n))
  );
}

async function clearRuntimeCaches() {
  await caches.delete(DYNAMIC_CACHE);
}

async function clearAllCaches() {
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
}

async function getOfflineResponse() {
  const cached = await caches.match('/offline.html');
  if (cached) return cached;

  try {
    const response = await fetch('/offline.html', { cache: 'reload' });
    if (response.ok) {
      const copy = response.clone();
      caches.open(STATIC_CACHE).then((cache) => cache.put('/offline.html', copy));
      return response;
    }
  } catch {
    // Fall through to a readable inline response.
  }

  return new Response(
    '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connexion indisponible</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#032D21;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px"><main><h1>Connexion indisponible</h1><p>Vérifiez votre connexion puis relancez l’application.</p></main></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    deleteOldCaches().then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (shouldBypass(event.request)) return;

  const { request } = event;

  // Network-First for HTML pages. Do not cache index.html or SPA routes:
  // a stale Vite shell can reference chunks that no longer exist after deployment.
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .catch(() => getOfflineResponse())
    );
    return;
  }

  // Cache-First for immutable Vite assets, but only cache responses with the expected MIME.
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (isValidAssetResponse(request, response)) {
              const clone = response.clone();
              caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
              return response;
            }

            // If a JS/CSS asset returns HTML, it is usually a stale index/chunk mismatch.
            // Clear old caches so the next navigation receives a fresh Vite shell.
            const pathname = new URL(request.url).pathname;
            if (pathname.endsWith('.js') || pathname.endsWith('.css')) {
              clearRuntimeCaches();
            }

            return response;
          })
          .catch(() => caches.match(request))
          .then((r) => r || new Response('', { status: 504 }));
      })
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
      clearAllCaches()
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
