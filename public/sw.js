/**
 * SPRINT 2.4 (TASK-2.4.1 -> TASK-2.4.3):
 * Service Worker & Offline Audio Cache Manager
 * Hỗ trợ cài đặt PWA như ứng dụng native và tải trước bài nghe WebM/Opus học khi mất mạng
 */

const STATIC_CACHE_NAME = "englishflow-static-v2";
const AUDIO_CACHE_NAME = "englishflow-offline-audio-v2";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/public/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(async (cache) => {
      for (const url of PRECACHE_ASSETS) {
        try {
          await cache.add(url);
        } catch (_) {}
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const reqUrl = new URL(event.request.url);

  // Ưu tiên phục vụ file âm thanh .webm từ Cache Storage khi học viên ở chế độ Offline
  if (reqUrl.pathname.endsWith(".webm")) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
