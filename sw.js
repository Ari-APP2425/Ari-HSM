// sw.js — Service Worker për Push Notifications
// Vendoseni në root të GitHub repo (pranë index.html)

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch(e) {
    data = { title: '🔔 Reminder', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: data.icon || '/Ari-HSM/icon-192.png',
    badge: data.badge || '/Ari-HSM/icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: '📋 Hap App' },
      { action: 'close', title: 'Mbyll' }
    ],
    data: {
      url: data.url || 'https://ari-app2425.github.io/Ari-HSM/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 Reminder', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data?.url || 'https://ari-app2425.github.io/Ari-HSM/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes('Ari-HSM') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
