importScripts("precache-manifest.c23f8647e03a9b0ca54a7bc9e180d710.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// disable/enable debug logging
workbox.setConfig({ debug: true });

const bgSyncPlugin = new workbox.backgroundSync.Plugin('test-queue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

// plugin for cache expiry and clear
const expirationPlugin = new workbox.expiration.Plugin({
    maxEntries: 20
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


const gameSource = 'https://rslots.gp2play.com/wuxiaprincessmegareels/?&fun=1&op=w88&lang=en'


// routes

workbox.routing.registerRoute(
    new RegExp(gameSource),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'game-wuxia-feed',
        plugins: [
            expirationPlugin,
            cacheOpaques
        ]
    }),
);



self.addEventListener('message', (messageEvent) => {

    switch (messageEvent.data.id) {
        // handle reload of content
        case 'skipWaiting':
            skipAndReload();
            break;
        // clear all caches and metadata
        case 'clear-cache':
            console.log('all caches emptied')
            expirationPlugin.deleteCacheAndMetadata();
            break;
        // delete specific cache
        case 'delete-cache':
            deleteCache(messageEvent.data);
        // delete specific entry from a specific cache
        case 'remove-entry':
            removeEntry(messageEvent.data);
            break;
        default:
            console.log(messageEvent);
    }
});

async function skipAndReload() {
    await self.skipWaiting();
    const clients = await self.clients.matchAll({
        includeUncontrolled: true
    });
    clients.forEach((client) => {
        client.postMessage({ command: 'reload-window' })
    });
}

function deleteCache(data) {
    caches.delete(data.cacheName).then(() => {
        console.log(`cache:${data.cacheName} deleted`)
    });
}

function removeEntry(data) {
    const cacheUrl = `${data.cacheName}`
    caches.open(cacheUrl).then((cache) => {
        cache.delete(data.entry).then((response) => {
            console.log(`cached response found: ${data.entry} and removed:${response}`);
        });
    })
}

// additional assets to precache
const additionalCacheAssets = ['https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2']

for (let i = 0; i < additionalCacheAssets.length; i++) {
    self.__precacheManifest.push({ url: additionalCacheAssets[i] });
}

// set precache
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// fallback route in SPA
workbox.routing.registerNavigationRoute('index.html');
