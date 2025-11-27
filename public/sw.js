/** SW - Shasimi - huytv04883 */

const CACHE_NAME = 'shasimi-cache-v1';

/** Init sw */
self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

/** Activate sw */
self.addEventListener('activate', (event) => {
  // Claim all clients (pages) immediately
  event.waitUntil(self.clients.claim());
});

/** Fetch sw */
self.addEventListener('fetch', () => {
  // For now, just let requests pass through normally
  // We can add caching strategy later if needed
});

/** Push event sw */
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
});

/** Notification click event sw */
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
});
