const CACHE_NAME = "yt-clone"
const ASSETS_CACHE = "yt-clone-assets"

// Files to precache
const PRECACHE_URLS = ["/", "/index.html"]

// ================= INSTALL =================
self.addEventListener("install", (event) => {
	console.log("[SW] Installing...")
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
	)
	self.skipWaiting()
})

// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {
	console.log("[SW] Activating...")
	event.waitUntil(
		caches.keys().then((names) =>
			Promise.all(
				names.map((name) => {
					if (name !== CACHE_NAME && name !== ASSETS_CACHE) {
						return caches.delete(name)
					}
				}),
			),
		),
	)
	self.clients.claim()
})

// ================= FETCH =================
self.addEventListener("fetch", (event) => {
	const { request } = event
	const url = new URL(request.url)

	// ❌ Skip non-GET
	if (request.method !== "GET") return

	// ❌ Skip extensions/websockets
	if (
		url.protocol === "chrome-extension:" ||
		url.protocol === "ws:" ||
		url.protocol === "wss:"
	) {
		return
	}

	// ✅ IMPORTANT: NEVER CACHE API
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(fetch(request)) // direct network
		return
	}

	// ❌ Skip Google Fonts (fix your error)
	if (url.hostname.includes("fonts.googleapis.com")) {
		event.respondWith(fetch(request))
		return
	}

	// ✅ Assets → Cache First
	if (isAsset(request.url)) {
		event.respondWith(cacheFirst(request))
		return
	}

	// ✅ HTML → Network First
	event.respondWith(networkFirst(request))
})

// ================= STRATEGIES =================

async function cacheFirst(request) {
	const cached = await caches.match(request)
	if (cached) return cached

	try {
		const response = await fetch(request)
		if (response && response.status === 200) {
			const cache = await caches.open(ASSETS_CACHE)
			cache.put(request, response.clone())
		}
		return response
	} catch (err) {
		console.error("[SW] cacheFirst failed:", err)
	}
}

async function networkFirst(request) {
	try {
		const response = await fetch(request)

		if (response && response.status === 200) {
			const cache = await caches.open(CACHE_NAME)
			cache.put(request, response.clone())
		}

		return response
	} catch (err) {
		console.warn("[SW] network failed, trying cache:", request.url)

		const cached = await caches.match(request)
		if (cached) return cached

		// ONLY fallback to index.html for navigation requests
		if (request.mode === "navigate") {
			return caches.match("/index.html")
		}

		throw err
	}
}

// ================= HELPERS =================

function isAsset(url) {
	return [
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
	].some((ext) => url.includes(ext))
}
