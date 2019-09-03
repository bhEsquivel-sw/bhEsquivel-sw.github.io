importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

self.skipWaiting();
self.clients.claim();
workbox.setConfig({ debug: false });



self.addEventListener('push', (event) => {
  const title = 'Fortune Chimes';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener( "fetch", function ( event ) {
  event.respondWith(
      fetch( event.request )
  );
});/*
self.addEventListener( "install", function ( event ) {
  console.log( "Installing the service worker!" );
  self.skipWaiting();
  caches.open( preCache )
      .then( cache => {
          cache.addAll( cacheList );
      } );
} );*/

self.addEventListener( "activate", function ( event ) {
  event.waitUntil(
      //wholesale purge of previous version caches
      caches.keys().then( cacheNames => {
          cacheNames.forEach( value => {
              if ( value.indexOf( version ) < 0 ) {
                  caches.delete( value );
              }
          } );
          console.log( "service worker activated" );
          return;
      } )
  );
} );

workbox.precaching.precacheAndRoute([
  {
    "url": "index copy.html",
    "revision": "4b7557c25f69d801f74dbc87cdbcfa84"
  },
  {
    "url": "index.html",
    "revision": "5be71d0a5b59a5448994213982828f68"
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

workbox.routing.registerNavigationRoute('index.html');