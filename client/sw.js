importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.routing.registerRoute(
    ({request}) => request.destination === "image",
    new workbox.strategies.CacheFirst())

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
)

workbox.routing.registerRoute(
    /^https:\/\/kit\.fontawesome\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'fontawsome-icons',
    })
)
