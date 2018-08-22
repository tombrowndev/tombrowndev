var staticCacheName = 'restaurant-reviews-v3';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/mws-restaurant-stage-1/index.html',
                '/mws-restaurant-stage-1/restaurant.html',
                '/mws-restaurant-stage-1/js/main.js',
                '/mws-restaurant-stage-1/js/restaurant_info.js',
                '/mws-restaurant-stage-1/js/dbhelper.js',
                '/mws-restaurant-stage-1/css/styles.css',
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-reviews-') &&
                   cacheName != staticCacheName;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
  
    if(requestUrl.origin === location.origin) {
      if(requestUrl.pathname === '/mws-restaurant-stage-1/') {
        event.respondWith(caches.match('/mws-restaurant-stage-1/index.html'));
        return;
      }

      if(requestUrl.pathname.startsWith('/mws-restaurant-stage-1/restaurant.html')) {
        event.respondWith(caches.match('/mws-restaurant-stage-1/restaurant.html'));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
