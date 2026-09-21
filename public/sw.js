/* 9xTechnology Digital Card — offline shell service worker (Phase 1, static).
 * Caches only public static assets. Never caches cross-origin requests,
 * API/auth responses or anything non-GET. Bump VERSION to invalidate. */
const VERSION = "9x-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

const SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/hemant.vcf",
  "/9xTechnology/android-chrome-192x192.png",
  "/9xTechnology/android-chrome-512x512.png",
  "/9xTechnology/apple-touch-icon.png",
  "/9xTechnology/favicon-32x32.png",
  "/9xtechnology-og.png",
];

const STATIC_PREFIXES = ["/_next/static/", "/9xTechnology/", "/img/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(SHELL_URLS);
      // Also cache the JS/CSS/fonts the shell HTML references.
      const html = await (await cache.match("/"))?.text();
      if (html) {
        const assets = [...new Set(html.match(/\/_next\/static\/[^"'\s)]+/g) ?? [])];
        const assetCache = await caches.open(ASSET_CACHE);
        await Promise.allSettled(assets.map((url) => assetCache.add(url)));
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(fallbackUrl ?? request, response.clone());
    return response;
  } catch {
    const cached = (await cache.match(request, { ignoreSearch: true })) ?? (fallbackUrl && (await cache.match(fallbackUrl)));
    if (cached) return cached;
    throw new Error("offline");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/"));
    return;
  }
  if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) || url.pathname.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
