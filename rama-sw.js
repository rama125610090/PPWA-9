<!-- Muat library waktu proses AMP-with-Shadow-DOM secara asinkron. -->
<script async src="https://cdn.ampproject.org/shadow-v0.js"></script>

var filesToCache =  [
  '/',
  'style/main.css',
  'images/still_life_medium.jpg',
  'index.html',
  'pages/offline.html',
  'pages/404.html'
];
//var digunakan untuk kompilasi, jika menggunakan let//

var staticCacheName =  'pages-cache-v2';
//Artinya Cache Halaman Hanya pada Versi 2//

self.addEventListener('install', event => {
	// install dijalankan pada bagian cache data.//
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName) 
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', event => {
	//fetch berfungsi untuk mengambil suatu data dari alamat url.//
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('pages/404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
	  // mengembalikan chace halaman dengan halaman offline.//
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');
// Activate berfungsi untuk mengaktifkan service worker dari aplikasi yang sedang berjalan.//

  var cacheWhitelist =  [staticCacheName];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) ===  -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});



 

