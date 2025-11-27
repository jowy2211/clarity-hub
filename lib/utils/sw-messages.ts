/**
 * Service Worker Communication Utilities
 * Send messages to service worker for background notifications
 */

/**
 * Send message to service worker
 */
const sendMessageToSW = async (message: any): Promise<void> => {
  try {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage(message);
      console.log('[SW Message] Sent:', message);
    }
  } catch (error) {
    console.error('[SW Message] Failed to send:', error);
  }
};

/**
 * Notify service worker that timer started
 */
export const notifyTimerStarted = async (
  meaning: string,
  endTime: number
): Promise<void> => {
  await sendMessageToSW({
    type: 'TIMER_STARTED',
    meaning,
    endTime,
    timestamp: Date.now(),
  });
};

/**
 * Notify service worker that timer stopped
 */
export const notifyTimerStopped = async (): Promise<void> => {
  await sendMessageToSW({
    type: 'TIMER_STOPPED',
    timestamp: Date.now(),
  });
};

/**
 * Notify service worker that break started
 */
export const notifyBreakStarted = async (
  isLongBreak: boolean,
  endTime: number
): Promise<void> => {
  await sendMessageToSW({
    type: 'BREAK_STARTED',
    isLongBreak,
    endTime,
    timestamp: Date.now(),
  });
};

/**
 * Notify service worker that break stopped
 */
export const notifyBreakStopped = async (): Promise<void> => {
  await sendMessageToSW({
    type: 'TIMER_STOPPED', // Reuse same message type
    timestamp: Date.now(),
  });
};

/**
 * Register custom service worker for notifications
 */
export const registerCustomSW = async (): Promise<void> => {
  try {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Wait for default SW to be ready
    await navigator.serviceWorker.ready;

    // Import custom SW logic
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      console.log('[Custom SW] Service worker ready for messages');

      // Request persistent notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  } catch (error) {
    console.error('[Custom SW] Registration failed:', error);
  }
};
