// Runmind PWA service worker — minimal install-eligibility shim. No offline caching.

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // Network-only passthrough. Listener presence satisfies Chromium install criteria.
})
