/* Service Worker — OLIVELAS Catálogo Digital
   Estratégias:
   - Navegação: network-first (fallback index/offline)
   - produtos.json:  network-first  (edições do JSON valem ao vivo; cache só offline)
   - Assets locais:  stale-while-revalidate
   - Fontes (CDN):   stale-while-revalidate */

const CORE_VERSION = "olivelas-v13";
const CORE = [
  "./",
  "./index.html",
  "./offline.html",
  "./404.html",
  "./manifest.webmanifest",
  "./assets/data/produtos.json",
  "./assets/css/variables.css",
  "./assets/css/style.css",
  "./assets/css/layout.css",
  "./assets/css/components.css",
  "./assets/css/responsive.css",
  "./assets/js/utils.js",
  "./assets/js/data.js",
  "./assets/js/whatsapp.js",
  "./assets/js/modal.js",
  "./assets/js/cart.js",
  "./assets/js/favorites.js",
  "./assets/js/app.js",
  "./assets/images/logo.png",
  "./assets/images/monogram.svg",
  "./assets/images/logo-light.svg",
  "./assets/images/logo-dark.svg",
  "./assets/images/placeholder.webp",
  "./assets/images/og-cover.webp",
  "./assets/images/icons/icon-192.png",
  "./assets/images/icons/icon-512.png",
  "./assets/images/icons/icon-maskable-512.png",
  "./assets/images/icons/apple-touch-icon.png",
  "./assets/images/icons/favicon-32.png",
  "./assets/images/icons/favicon-16.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CORE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "./index.html", "./offline.html"));
    return;
  }

  if (sameOrigin && url.pathname.includes("/assets/data/")) {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (sameOrigin) {
    event.respondWith(swr(request, CORE_VERSION));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(swr(request, "olivelas-fonts"));
  }
});

async function networkFirst(request, fallbackCacheKey, fallbackUrl) {
  const cache = await caches.open(CORE_VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackCacheKey || fallbackUrl);
      if (fallback) return fallback;
      return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
    }
    return new Response("Not found", { status: 404 });
  }
}

async function swr(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return cached || network || new Response("", { status: 408 });
}