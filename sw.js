// PocketSpend service worker: cho phép mở app khi không có mạng.
// Chỉ xử lý file của chính app và font. Không đụng tới Firebase (đồng bộ tự lo phần offline).
const CACHE = "pocketspend-v2.0.0";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./firebase-config.js", "./pocket-cloud.js",
  "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return; // Firebase và mọi thứ khác: để trình duyệt tự xử lý
  if (isFont) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })));
    return;
  }
  // File của app: ưu tiên mạng để nhận bản mới (và cấu hình mới), mất mạng thì dùng bản đã lưu
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "./index.html" : req, copy)); }
    return r;
  }).catch(() => caches.match(req.mode === "navigate" ? "./index.html" : req, { ignoreSearch: true })));
});
