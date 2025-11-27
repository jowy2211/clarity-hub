// Service Worker Wrapper
// This file extends the generated sw.js with custom notification handling

// Import the generated service worker
importScripts('/sw.js');

// Add custom notification handlers
console.log('[ClarityHub SW Wrapper] Loading custom handlers...');

// Store timer ID for cancellation
let timerNotificationTimeout = null;

// Listen for messages from the client
self.addEventListener('message', (event) => {
  console.log('[ClarityHub SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'TIMER_STARTED') {
    const { meaning, endTime } = event.data;
    console.log('[ClarityHub SW] Timer started:', meaning, 'ends at:', new Date(endTime));
    scheduleTimerNotification(meaning, endTime);
  }
  
  if (event.data && event.data.type === 'TIMER_STOPPED') {
    console.log('[ClarityHub SW] Timer stopped');
    cancelScheduledNotification();
  }

  if (event.data && event.data.type === 'BREAK_STARTED') {
    const { isLongBreak, endTime } = event.data;
    console.log('[ClarityHub SW] Break started:', isLongBreak ? 'Long' : 'Short');
    scheduleBreakNotification(isLongBreak, endTime);
  }
});

// Schedule notification for timer completion
const scheduleTimerNotification = (meaning, endTime) => {
  if (timerNotificationTimeout) {
    clearTimeout(timerNotificationTimeout);
  }
  
  const now = Date.now();
  const timeUntilEnd = endTime - now;
  
  if (timeUntilEnd <= 0) {
    showTimerNotification(meaning);
    return;
  }
  
  if (timeUntilEnd < 2147483647) {
    timerNotificationTimeout = setTimeout(() => {
      showTimerNotification(meaning);
    }, timeUntilEnd);
    
    console.log('[ClarityHub SW] Notification scheduled in', Math.round(timeUntilEnd / 1000), 'seconds');
  }
};

// Schedule break notification
const scheduleBreakNotification = (isLongBreak, endTime) => {
  if (timerNotificationTimeout) {
    clearTimeout(timerNotificationTimeout);
  }
  
  const now = Date.now();
  const timeUntilEnd = endTime - now;
  
  if (timeUntilEnd <= 0) {
    showBreakNotification(isLongBreak);
    return;
  }
  
  if (timeUntilEnd < 2147483647) {
    timerNotificationTimeout = setTimeout(() => {
      showBreakNotification(isLongBreak);
    }, timeUntilEnd);
  }
};

// Cancel scheduled notification
const cancelScheduledNotification = () => {
  if (timerNotificationTimeout) {
    clearTimeout(timerNotificationTimeout);
    timerNotificationTimeout = null;
  }
};

// Show timer completion notification
const showTimerNotification = async (meaning) => {
  try {
    await self.registration.showNotification('Pomodoro Selesai! ⏰', {
      body: `Selesai: ${meaning}. Waktunya istirahat!`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'clarityhub-timer',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: { url: '/deep-work' }
    });
  } catch (error) {
    console.error('[ClarityHub SW] Failed to show notification:', error);
  }
};

// Show break completion notification
const showBreakNotification = async (isLongBreak) => {
  try {
    await self.registration.showNotification('Break Selesai! ⏰', {
      body: isLongBreak ? 'Long break selesai!' : 'Waktunya fokus lagi!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'clarityhub-break',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { url: '/deep-work' }
    });
  } catch (error) {
    console.error('[ClarityHub SW] Failed to show break notification:', error);
  }
};

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') return;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || '/deep-work';
      
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('[ClarityHub SW Wrapper] Custom handlers registered');
