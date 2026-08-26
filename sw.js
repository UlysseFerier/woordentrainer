/* Woordentrainer — service worker
   Change VERSION à chaque mise à jour du code : ça force le rafraîchissement
   sur les téléphones au lancement suivant. */
const VERSION = 'wt-2026-08-27-an';
const SHELL = VERSION + '-shell';
const DATA = VERSION + '-data';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './config.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

/* cache:'reload' force chaque fichier à repartir du réseau : addAll peut
   sinon se resservir dans le cache HTTP du navigateur et réinstaller la
   version qu'on cherchait justement à remplacer. */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL).then(function (c) {
      return Promise.all(SHELL_FILES.map(function (f) {
        return fetch(f, { cache: 'reload' }).then(function (r) {
          if (r.ok) return c.put(f, r);
        });
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k.indexOf(VERSION) !== 0; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Listes de vocabulaire : réseau d'abord (pour attraper les nouvelles semaines),
  // cache en secours quand le téléphone est hors ligne.
  if (url.pathname.indexOf('/data/') !== -1) {
    e.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(DATA).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req);
      })
    );
    return;
  }

  // Polices Google : cache d'abord, mise à jour en arrière-plan.
  if (url.origin.indexOf('gstatic') !== -1 || url.origin.indexOf('googleapis') !== -1) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        const net = fetch(req).then(function (res) {
          const copy = res.clone();
          caches.open(SHELL).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      })
    );
    return;
  }

  // Page et code de l'app : RÉSEAU D'ABORD, cache en secours hors ligne.
  // En cache d'abord, une nouvelle version d'index.html restait invisible tant
  // que sw.js lui-même ne changeait pas — si seul index.html était déposé, le
  // téléphone gardait l'ancienne version pour toujours.
  const estCoquille = req.mode === 'navigate' ||
    url.pathname.slice(-1) === '/' ||
    url.pathname.indexOf('index.html') !== -1 ||
    url.pathname.indexOf('config.js') !== -1 ||
    url.pathname.indexOf('manifest.webmanifest') !== -1;
  if (estCoquille) {
    e.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(SHELL).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match('./index.html'); });
      })
    );
    return;
  }

  // Icônes et fichiers immuables : cache d'abord.
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(SHELL).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
