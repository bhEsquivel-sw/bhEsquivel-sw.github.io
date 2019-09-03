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
    "url": "index.html",
    "revision": "5be71d0a5b59a5448994213982828f68"
  },
  {
    "url": "js/app.js",
    "revision": "de6ccf23a2808c6e30e4367710e9184a"
  },
  {
    "url": "favicon.ico",
    "revision": "e960fdbf5a1fc2501f2790000cb4f87a"
  },
  {
    "url": "manifest.json",
    "revision": "d0ff17bfd50491d4ebde7b8b184c8d87"
  },
  {
    "url": "assets/_fortunechimes/bg/bg_loading.jpg",
    "revision": "f6efc96168ea155450f6aced3c63878c"
  },
  {
    "url": "assets/_fortunechimes/bg/bg_m_loading_p.jpg",
    "revision": "83bbd1003677a31c550b5a60f9b3bb1e"
  },
  {
    "url": "assets/_fortunechimes/bg/bg_m_loading.jpg",
    "revision": "b37b33542e7ad6e39aec57222a5084e5"
  },
  {
    "url": "assets/_fortunechimes/bg/bg-fs-p.jpg",
    "revision": "65262906927ebc329c93b568c3afd4c6"
  },
  {
    "url": "assets/_fortunechimes/bg/bg-fs.jpg",
    "revision": "295d80b3867c5bca76819d6c23b6c80e"
  },
  {
    "url": "assets/_fortunechimes/bg/bg-main-p.jpg",
    "revision": "65a6a39eafc40d72c7c7eb3c8f20eeb1"
  },
  {
    "url": "assets/_fortunechimes/bg/bg-main.jpg",
    "revision": "97f2c19c732c72cca9bd647dd06f5a66"
  },
  {
    "url": "assets/_fortunechimes/button.png",
    "revision": "c433215f9a33f7707f38a54d3f4c3535"
  },
  {
    "url": "assets/_fortunechimes/symbols/symbols.png",
    "revision": "7b90ce34c191b9a2cd706bc17d965464"
  },
  {
    "url": "assets/_fortunechimes/symbols/symbols.json",
    "revision": "a5d0e1965006de796e8c9badacdb22d5"
  },
  {
    "url": "assets/icons/icon-128x128.png",
    "revision": "573ed1ebc07927ece4c15af50e42621c"
  },
  {
    "url": "assets/icons/icon-144x144.png",
    "revision": "4d0cf2a482f47585629895849f8cbabb"
  },
  {
    "url": "assets/icons/icon-152x152.png",
    "revision": "ddeef34939ef17bb69624205140857c2"
  },
  {
    "url": "assets/icons/icon-192x192.png",
    "revision": "ed53cea5f0ba2c6369ebf2e08de0cfd4"
  },
  {
    "url": "assets/icons/icon-384x384.png",
    "revision": "6d41d9911c4281e7427927af5a093dab"
  },
  {
    "url": "assets/icons/icon-512x512.png",
    "revision": "ada841d3ed8f29ac831468b43d66b9c4"
  },
  {
    "url": "assets/icons/icon-72x72.png",
    "revision": "c012c516689e3e9debb06b9749c8fcaf"
  },
  {
    "url": "assets/icons/icon-96x96.png",
    "revision": "8c0d8df68f5007840dc205958ea5be0a"
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

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|atlas|json)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('js/app.js'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'app-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
);

workbox.routing.registerNavigationRoute('index.html');