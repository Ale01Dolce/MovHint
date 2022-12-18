importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.setConfig({
    debug: true
});

const { ExpirationPlugin } = workbox.expiration;

workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
            cacheName: 'navigations',
        })
    )
);

workbox.routing.registerRoute(
    /^https:\/\/www\.themoviedb\.org\/t\/p/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'tmdb-images',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 2 * 24 * 60 * 60, // cache the images for only 2 Days
            })
        ]
    })
)


workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 2 * 24 * 60 * 60, // cache the images for only 2 Days
            })
        ]
    })
)

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com\/s\/*/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 2 * 24 * 60 * 60, // cache the images for only 2 Days
            })
        ]
    })
)

workbox.routing.registerRoute(
    /^https:\/\/kit\.fontawesome\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'fontawsome-icons',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 2 * 24 * 60 * 60, // cache the images for only 2 Days
            })
        ]
    })
)

workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst()
)