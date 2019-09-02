importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.setConfig({ debug: false });



self.addEventListener('push', (event) => {
  const title = 'Fortune Chimes';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('install', (event) => {
  console.log('👷', 'install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('👷', 'activate', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // console.log('👷', 'fetch', event);
  event.respondWith(fetch(event.request));
});

workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "4b7557c25f69d801f74dbc87cdbcfa84"
  },
  {
    "url": "js/app.js",
    "revision": "a985e3b1445eec5989f2978abfdf4d0d"
  }
]);

const bgSyncPlugin = new workbox.backgroundSync.Plugin('test-queue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

// plugin for cache expiry and clear
const expirationPlugin = new workbox.expiration.Plugin({
    maxEntries: 100
});

// cache opaque responses
const cacheOpaques = new workbox.cacheableResponse.Plugin({
    statuses: [0, 200]
});


// versioning for killswitch
const version = 1.2


// set custom cache parameters

this.workbox.core.setCacheNameDetails({
    prefix: 'rslots-pwa',
    suffix: `v:${version}`,
});

const assets = 'https://bhEsquivel-sw.github.io/assets/'

workbox.routing.registerRoute(
    new RegExp(assets),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'rslots-fchimes-assets',
        plugins: [
            expirationPlugin,
            cacheOpaques
        ]
    }),
);