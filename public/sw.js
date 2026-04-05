const CACHE_NAME = "yt-clone-v1"
const ASSETS_CACHE = "yt-clone-assets-v1"
const API_CACHE = "yt-clone-api-v1"

// Files to precache
const PRECACHE_URLS = ["/", "/index.html"]

// Install event - cache precache URLs
self.addEventListener("install", (event) => {
	console.log("[ServiceWorker] Installing...")
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("[ServiceWorker] Precaching files")
			return cache.addAll(PRECACHE_URLS)
		}),
	)
	self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("[ServiceWorker] Activating...")
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (
						cacheName !== CACHE_NAME &&
						cacheName !== ASSETS_CACHE &&
						cacheName !== API_CACHE
					) {
						console.log("[ServiceWorker] Deleting old cache:", cacheName)
						return caches.delete(cacheName)
					}
				}),
			)
		}),
	)
	self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
	const { request } = event
	const url = new URL(request.url)

	// Skip non-GET requests
	if (request.method !== "GET") {
		return
	}

	// Skip chrome extensions and websockets
	if (
		url.protocol === "chrome-extension:" ||
		url.protocol === "ws:" ||
		url.protocol === "wss:"
	) {
		return
	}

	// API requests - Network first, fall back to cache
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(networkFirstStrategy(request, API_CACHE))
		return
	}

	// Assets (js, css, images) - Cache first, fall back to network
	if (isAsset(request.url)) {
		event.respondWith(cacheFirstStrategy(request, ASSETS_CACHE))
		return
	}

	// HTML and other requests - Network first, fall back to cache
	event.respondWith(networkFirstStrategy(request, CACHE_NAME))
})

// Cache first strategy: use cache if available, otherwise fetch from network
async function cacheFirstStrategy(request, cacheName) {
	try {
		const cached = await caches.match(request)
		if (cached) {
			console.log("[ServiceWorker] Returning from cache:", request.url)
			return cached
		}

		const response = await fetch(request)
		if (!response || response.status !== 200) {
			return response
		}

		const cache = await caches.open(cacheName)
		cache.put(request, response.clone())
		return response
	} catch (error) {
		console.error("[ServiceWorker] Cache first strategy failed:", error)
		return caches.match("/index.html")
	}
}

// Network first strategy: try network first, fall back to cache
async function networkFirstStrategy(request, cacheName) {
	try {
		const response = await fetch(request)

		if (!response || response.status !== 200) {
			return caches.match(request)
		}

		const cache = await caches.open(cacheName)
		cache.put(request, response.clone())
		return response
	} catch (error) {
		console.error("[ServiceWorker] Network first strategy failed:", error)
		const cached = await caches.match(request)
		if (cached) {
			return cached
		}
		return caches.match("/index.html")
	}
}

// Check if URL is an asset
function isAsset(url) {
	const assetExtensions = [
		".js",
		".css",
		".png",
		".jpg",
		".jpeg",
		".gif",
		".svg",
		".webp",
		".woff",
		".woff2",
		".ttf",
		".eot",
	]
	return assetExtensions.some((ext) => url.endsWith(ext))
}

// Handle push notifications (optional)
self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json()
		const options = {
			body: data.body,
			icon: "/icon.png",
			badge: "/badge.png",
		}
		event.waitUntil(self.registration.showNotification(data.title, options))
	}
})
