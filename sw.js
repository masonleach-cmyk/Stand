// Stand — offline cache.
// Bump CACHE when you change any file, or browsers will keep serving the old one.
const CACHE = 'stand-v25';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Cache entries one at a time so a single failure doesn't abort the install.
    await Promise.all(SHELL.map(u => c.add(u).catch(err => console.warn('skip', u, err))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache first, since none of these change while you're playing. Network
// responses refresh the cache in the background for the next launch.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreVary: true });
    const fetching = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        caches.open(CACHE).then(c => c.put(req, res.clone())).catch(() => {});
      }
      return res;
    }).catch(() => null);

    if (cached) return cached;

    const fresh = await fetching;
    if (fresh) return fresh;

    // Offline with nothing cached: for a page request, fall back to the app itself.
    if (req.mode === 'navigate') {
      const shell = await caches.match('./index.html', { ignoreVary: true });
      if (shell) return shell;
    }
    return new Response('Offline and not cached.', { status: 503, statusText: 'Offline' });
  })());
});
