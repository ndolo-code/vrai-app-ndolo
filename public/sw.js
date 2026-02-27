const CACHE_VERSION = 'ndolomath-v9'
const STATIC_ASSETS = [
  '/',
  '/offline/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/ndolomath-tutorial.mp3',
  '/data/bepc/index.json',
  '/data/bepc/1999/subject.json',
  '/data/bepc/1999/correction.json',
  '/data/bepc/2021/subject.json',
  '/data/bepc/2021/correction.json',
  '/images/bepc2021-geo-ex2.jpg',
  '/data/bepc/2022/subject.json',
  '/data/bepc/2022/correction.json',
  '/images/bepc2022-geo-ex2.jpg',
  '/images/bepc2022-geo-ex1.webp',
  '/data/bepc/2023/subject.json',
  '/data/bepc/2023/correction.json',
  '/images/bepc2023-num-ex3.jpg',
  '/data/bepc/2024/subject.json',
  '/data/bepc/2024/correction.json',
  '/images/bepc2024-geo-ex2.jpg',
  '/images/bepc2024-geo-ex3.jpg',
  '/images/bepc2023-geo-ex2.jpg',
  '/images/bepc2023-geo-ex3.jpg',
  '/data/bepc/2025/subject.json',
  '/data/bepc/2025/correction.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  if (url.hostname.includes('supabase')) return

  if (url.hostname.includes('youtube') || url.hostname.includes('youtu.be') || url.hostname.includes('vimeo')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response('<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Hors connexion</h2><p>Les videos ne sont pas disponibles hors connexion.</p></body></html>', { headers: { 'Content-Type': 'text/html' } })
      )
    )
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              if (response && response.ok) cache.put(event.request, response.clone())
              return response
            })
            .catch(() => cached || caches.match('/offline/'))
          return cached || fetchPromise
        })
      )
    )
    return
  }

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

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
