"use client";

import {
    useEffect,
    useState,
} from 'react';

import {
    AnimatePresence,
    motion,
} from 'framer-motion';
import {
    Download,
    X,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show if dismissed within last 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds of page load
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
      >
        <div className="bg-white rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 shadow-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-stone-100 active:bg-stone-200 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-stone-900 rounded-xl border-2 border-stone-800 flex items-center justify-center shrink-0">
              <Download className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Install ClarityHub</h3>
              <p className="text-sm text-gray-600">
                Add to your home screen for quick access and offline use
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 bg-stone-100 border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 rounded-xl font-medium hover:bg-stone-200 active:translate-y-1 active:border-b-2 active:border-r-2 transition-all"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-3 bg-stone-900 text-white border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-700 rounded-xl font-medium hover:bg-stone-800 active:translate-y-1 active:border-b-2 active:border-r-2 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Works offline • Fast • Native feel
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

