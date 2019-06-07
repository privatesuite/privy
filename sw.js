// Service Worker
//
// This file allows `privatesuitemag.com` to be viewed offline until a better connection is available
//

const CACHE_NAME = "privatesuite-cache-v1";
var urlsToCache = [

	"/",
	"/css/app.min.css",
	"/js/app.js",
	"/js/background.js",
	"/img/favicon.png",
	
	"/views/about.njk",
	"/views/footer.njk",
	"/views/index.njk",
	"/views/issue.njk",
	"/views/read.njk",
	"/views/regulars.njk"

]

self.addEventListener("install", event => {

	event.waitUntil(caches.open(CACHE_NAME).then(cache => {
	
		console.log("Opened cache");
    	return cache.addAll(urlsToCache);
	
	}));

});

self.addEventListener("fetch", event => {

	console.log(navigator.onLine, event.request)

	event.respondWith(caches.match(event.request).then(response => {

		if (!navigator.onLine && response) {
		
			return response;
		
		}
		
		return fetch(event.request);
	
	}));

});
