importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.setConfig({
    debug: true
});

const { CacheableResponse } = workbox.cacheableResponse;


workbox.routing.registerRoute(
    /^https:\/\/www\.themoviedb\.org\/t\/p/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'tmdb-images',
        //  plugins: [new CacheableResponse({statuses: [0, 200]})]
    })
)


workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
)

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com\/s\/*/,
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

workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst()
)