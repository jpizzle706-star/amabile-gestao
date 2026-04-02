// Amabile Gestão — Service Worker
// Coloque este arquivo na mesma pasta que o index.html no Netlify

const CACHE = 'amabile-v1';

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll([
        './',
        './index.html',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap'
      ]);
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(resp){
        // Cachear fontes e o próprio app
        if(e.request.url.indexOf('fonts.g') >= 0 || e.request.url.indexOf('index.html') >= 0){
          var clone = resp.clone();
          caches.open(CACHE).then(function(cache){ cache.put(e.request, clone); });
        }
        return resp;
      }).catch(function(){
        return cached;
      });
    })
  );
});
