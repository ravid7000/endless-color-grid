var CACHE_NAME = 'endless-cache-v1';
var urlsToCache = [
    './index.html',
    './css/bootstrap.min.css',
    './font/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
    './font/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    './style.css',
    './js/jquery.min.js',
    './js/popper.min.js',
    './js/bootstrap.min.js',
    './script.js',
    './manifest.json',
    './icons/apple-icon.png',
    './icons/favicon-96x96.png'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    console.log('Installing application')
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('activating...')
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
