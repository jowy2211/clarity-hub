// Custom Service Worker for ClarityHub Timer Notifications
// This file adds background timer notification support

console.log('[ClarityHub SW] Service Worker loaded');

// Check timer completion in background
const checkTimerCompletion = async () => {
  try {
    // We can't access localStorage directly in service worker
    // Instead, we'll use IndexedDB or rely on client messages
    console.log('[ClarityHub SW] Checking for timer completion...');
  } catch (error) {
    console.error('[ClarityHub SW] Error checking timer:', error);
  }
};

// Listen for messages from the client
self.addEventListener('message', (event) => {
  console.log('[ClarityHub SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'TIMER_STARTED') {
    const { meaning, endTime } = event.data;
    console.log('[ClarityHub SW] Timer started:', meaning, 'ends at:', new Date(endTime));
    
    // Schedule notification for when timer completes
    scheduleTimerNotification(meaning, endTime);
  }
  
  if (event.data && event.data.type === 'TIMER_STOPPED') {
    console.log('[ClarityHub SW] Timer stopped');
    // Cancel any scheduled notifications
    cancelScheduledNotification();
  }

  if (event.data && event.data.type === 'BREAK_STARTED') {
    const { isLongBreak, endTime } = event.data;
    console.log('[ClarityHub SW] Break started:', isLongBreak ? 'Long' : 'Short', 'ends at:', new Date(endTime));
    scheduleBreakNotification(isLongBreak, endTime);
  }
});

// Store timer ID for cancellation
let timerNotificationTimeout = null;

// Schedule notification for timer completion
const scheduleTimerNotification = (meaning, endTime) => {
  // Clear any existing timeout
  if (timerNotificationTimeout) {
    clearTimeout(timerNotificationTimeout);
  }
  
  const now = Date.now();
  const timeUntilEnd = endTime - now;
  
  if (timeUntilEnd <= 0) {
    // Already passed, show immediately
    showTimerNotification(meaning);
    return;
  }
  
  // Schedule notification
  // Note: setTimeout has a max delay of ~24.8 days
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
    
    console.log('[ClarityHub SW] Break notification scheduled in', Math.round(timeUntilEnd / 1000), 'seconds');
  }
};

// Cancel scheduled notification
const cancelScheduledNotification = () => {
  if (timerNotificationTimeout) {
    clearTimeout(timerNotificationTimeout);
    timerNotificationTimeout = null;
    console.log('[ClarityHub SW] Scheduled notification cancelled');
  }
};

// Show timer completion notification
const showTimerNotification = async (meaning) => {
  console.log('[ClarityHub SW] Showing timer notification');
  
  try {
    const registration = await self.registration;
    
    await registration.showNotification('Pomodoro Selesai! ⏰', {
      body: `Selesai: ${meaning}. Waktunya istirahat!`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'clarityhub-timer',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Buka App'
        },
        {
          action: 'close',
          title: 'Tutup'
        }
      ],
      data: {
        url: '/deep-work'
      }
    });
    
    console.log('[ClarityHub SW] Notification shown successfully');
  } catch (error) {
    console.error('[ClarityHub SW] Failed to show notification:', error);
  }
};

// Show break completion notification
const showBreakNotification = async (isLongBreak) => {
  console.log('[ClarityHub SW] Showing break notification');
  
  try {
    const registration = await self.registration;
    
    await registration.showNotification('Break Selesai! ⏰', {
      body: isLongBreak ? 'Long break selesai! Siap fokus lagi?' : 'Waktunya lanjut fokus lagi!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'clarityhub-break',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Mulai Fokus'
        },
        {
          action: 'close',
          title: 'Nanti'
        }
      ],
      data: {
        url: '/deep-work'
      }
    });
    
    console.log('[ClarityHub SW] Break notification shown successfully');
  } catch (error) {
    console.error('[ClarityHub SW] Failed to show break notification:', error);
  }
};

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[ClarityHub SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || '/deep-work';
      
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // No window found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Periodic check (using Periodic Background Sync API if available)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-timer') {
      event.waitUntil(checkTimerCompletion());
    }
  });
}

console.log('[ClarityHub SW] Custom handlers registered');
