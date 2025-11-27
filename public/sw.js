/** SW - Shasimi - huytv04883 */

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
  const data = event.data ? event.data.text() : 'New message!';
  event.waitUntil(
    self.registration.showNotification('New message', {
      body: data,
      icon: '/icons/icons/ss.png',
      badge: '/icons/icons/ss.png',
    }),
  );
});

/** Notification click event sw */
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
});
