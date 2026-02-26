const CACHE_VERSION = 'ndolomath-v3'
const STATIC_ASSETS = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/ndolomath-tutorial.mp3']

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: purge ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Never cache Supabase API calls (auth, realtime, REST)
  if (url.hostname.includes('supabase')) return

  // Block video sites when offline
  if (url.hostname.includes('youtube') || url.hostname.includes('youtu.be') || url.hostname.includes('vimeo')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response('<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Hors connexion</h2><p>Les videos ne sont pas disponibles hors connexion.</p></body></html>', { headers: { 'Content-Type': 'text/html' } })
      )
    )
    return
  }

  // Same-origin: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              if (response && response.ok) {
                cache.put(event.request, response.clone())
              }
              return response
            })
            .catch(() => cached)
          return cached || fetchPromise
        })
      )
    )
    return
  }

  // External: network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone()
          caches.open(CACHE_VERSION).then((c) => c.put(event.request, clone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})

// Listen for version update messages
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
