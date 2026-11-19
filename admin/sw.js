/* VERSIYA: v26 — RentBooks Boshqaruv: kompyuterga o'rnatiladigan ilova (service worker)
 * Faqat sayt «qobig'i» (index.html, til.js, ikonkalar) saqlanadi — tez ochilishi va o'rnatish uchun.
 * Ma'lumotlar (Supabase, kassa, mijozlar) HECH QACHON saqlanmaydi: ular har doim internetdan olinadi.
 * Sahifa har ochilganda avval internetdan yangisi olinadi — saytga yangi fayl yuklansa, ilova o'zi yangilanadi.
 */
const CACHE = "rb-admin-v31u";
const SHELL = ["./", "./index.html", "./til.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    const old = keys.filter((k) => k.startsWith("rb-admin-") && k !== CACHE);
    await Promise.all(old.map((k) => caches.delete(k)));
    await self.clients.claim();
    if (old.length) (await self.clients.matchAll({ type: "window" })).forEach((cl) => cl.postMessage({ type: "rb-updated" }));
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Supabase, shriftlar, Telegram — tegilmaydi
  // sahifa: avval internet (yangi versiya), internet yo'q bo'lsa — saqlangan nusxa
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put("./index.html", cp)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // qobiq fayllari: saqlangan nusxa darhol, orqada yangilanadi
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
