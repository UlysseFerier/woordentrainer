/* service worker du camp : réseau d'abord (les mises à jour arrivent tout de suite), cache si hors ligne */
var CACHE = 'wt-camp-202610291028';
var BASE = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('wt-camp-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var copie = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copie); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request).then(function (r) { return r || (e.request.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});
