var staticCacheName = 'restaurant-reviews-v3';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                'index.html',
                'restaurant.html',
                'js/main.js',
                'js/restaurant_info.js',
                'js/dbhelper.js',
                'css/styles.css',
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
      if(requestUrl.pathname === '/') {
        event.respondWith(caches.match('/index.html'));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });