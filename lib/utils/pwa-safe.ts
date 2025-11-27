/**
 * PWA-Safe utility functions
 * These functions handle common PWA issues with proper error handling
 */

/**
 * Safely play alarm sound with fallback for PWA
 * Web Audio API requires user interaction in PWA mode
 */
export const safePlayAlarm = (): boolean => {
  try {
    // Check if AudioContext is available
    if (typeof window === 'undefined') {
      console.warn('AudioContext not available on server');
      return false;
    }

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('AudioContext not supported');
      return false;
    }

    const audioContext = new AudioContextClass();

    // Check if context is suspended (common in PWA)
    if (audioContext.state === 'suspended') {
      audioContext
        .resume()
        .then(() => {
          playBeep(audioContext);
        })
        .catch((error) => {
          console.warn('Failed to resume audio context:', error);
          // Fallback: try vibration
          tryVibrate();
        });
    } else {
      playBeep(audioContext);
    }

    return true;
  } catch (error) {
    console.error('Failed to play alarm:', error);
    // Fallback: try vibration
    tryVibrate();
    return false;
  }
};

/**
 * Play beep sound using Web Audio API
 */
const playBeep = (audioContext: AudioContext) => {
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (error) {
    console.error('Failed to create beep:', error);
  }
};

/**
 * Try to vibrate device as fallback
 */
const tryVibrate = () => {
  try {
    if ('vibrate' in navigator) {
      // Vibrate pattern: vibrate, pause, vibrate
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  } catch (error) {
    console.error('Vibration failed:', error);
  }
};

/**
 * Safely request notification permission
 */
export const safeRequestNotification =
  async (): Promise<NotificationPermission> => {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.warn('Notifications not supported');
        return 'denied';
      }

      if (Notification.permission === 'granted') {
        return 'granted';
      }

      if (Notification.permission === 'denied') {
        return 'denied';
      }

      // Request permission
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

/**
 * Safely show notification with fallback
 */
export const safeShowNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      // Try vibration as fallback
      tryVibrate();
      return false;
    }

    // Show notification
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  } catch (error) {
    console.error('Failed to show notification:', error);
    // Fallback: vibrate
    tryVibrate();
    return false;
  }
};

/**
 * Safely get from localStorage with validation
 */
export const safeGetLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }

    const parsed = JSON.parse(item);
    return parsed as T;
  } catch (error) {
    console.error(`Failed to get localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set to localStorage with error handling
 */
export const safeSetLocalStorage = <T>(key: string, value: T): boolean => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to set localStorage key "${key}":`, error);

    // Check if it's a quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Clearing old data...');
      // Try to clear some old data
      clearOldSessionData();

      // Retry
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return false;
      }
    }

    return false;
  }
};

/**
 * Safely remove from localStorage
 */
export const safeRemoveLocalStorage = (key: string): boolean => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear old session data to free up space
 */
const clearOldSessionData = () => {
  try {
    const sessions = safeGetLocalStorage<any[]>('deepwork-sessions', []);

    // Keep only last 50 sessions
    if (sessions.length > 50) {
      const recentSessions = sessions.slice(0, 50);
      safeSetLocalStorage('deepwork-sessions', recentSessions);
    }

    // Clear old pomodoro data (older than 30 days)
    const pomodoroData = safeGetLocalStorage<any>('pomodoro-data', null);
    if (pomodoroData && pomodoroData.date) {
      const dataDate = new Date(pomodoroData.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (dataDate < thirtyDaysAgo) {
        safeRemoveLocalStorage('pomodoro-data');
      }
    }
  } catch (error) {
    console.error('Failed to clear old data:', error);
  }
};

/**
 * Check if running as PWA
 */
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
};

/**
 * Initialize PWA features
 */
export const initializePWA = async (): Promise<void> => {
  try {
    // Request notification permission if PWA
    if (isPWA()) {
      await safeRequestNotification();
    }

    // Register for background sync if available
    if (
      'serviceWorker' in navigator &&
      'sync' in (window as any).registration
    ) {
      const registration = await navigator.serviceWorker.ready;
      // Background sync setup can be added here
    }
  } catch (error) {
    console.error('Failed to initialize PWA:', error);
  }
};
