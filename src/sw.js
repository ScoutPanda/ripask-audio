const CACHE_NAME = "ripask-cache-v1";
const urlsToCache = [
  "index.html",
  "assets/no-image.png"
];


self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener("activate", event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", function fetcher(event) {
  if (event.request.url.indexOf("getCoverArt") > -1
    || (event.request.url.indexOf("getAlbumList2") > -1 && event.request.url.indexOf("byGenre") > -1)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function (response) {
            if (response.ok) {
              cache.put(event.request, response.clone()).then();
            }
            return response;
          });
        });
      })
    );
  }
});
