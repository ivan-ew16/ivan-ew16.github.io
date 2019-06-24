var cacheName ='v2';
var cacheNameDynamic ='v2';
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/login.html',
          '/help/index.html',
          '/help/icon_person.png',
          '/help/main-image.jpg',
          '/help/main-image-sm.jpg',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/css/help.css',
          '/src/images/main-image.jpg',
          '/src/images/main-image-lg.jpg',
          '/src/images/main-image-sm.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
          'https://newsapi.org/v2/everything?q=bitcoin&from=2019-05-24&sortBy=publishedAt&apiKey=f0c757cbf826400394bfc454ec04a403',
          '/offline.html',
        ]);

      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
        	console.log("Found in Cache", event.request.url);
          return response;
        } else {
        	console.log("Not Found in Cache");
          return fetch(event.request)
            .then(function(res) {
              return caches.open(cacheName)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
            	console.log("Masuk");
            	return caches.open(cacheName)
              .then(function(cache) {
          		  console.log("Masuk");
                return cache.match('./offline.html');
              });
            });
        }
      })
  );
});
