"use client";
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  Brain,
  Maximize2,
  X,
} from 'lucide-react';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { STORAGE_KEYS } from '@/lib/constants';
import { TimerState } from '@/lib/types';
import { formatTime } from '@/lib/utils/formatters';
import {
  getLocalStorage,
  removeLocalStorage,
} from '@/lib/utils/storage';

export default function FloatingTimer() {
  const router = useRouter();
  const pathname = usePathname();
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on DeepWork page
  const isOnDeepWorkPage = pathname === '/deep-work';

  // Load timer state from localStorage
  useEffect(() => {
    const loadTimerState = () => {
      const state = getLocalStorage<TimerState | null>(STORAGE_KEYS.ACTIVE_TIMER, null);
      if (state) {
        if (state.isRunning && !state.isPaused && state.endTime) {
          // Calculate actual time left from endTime (single source of truth)
          const now = Date.now();
          const actualTimeLeft = Math.max(0, Math.floor((state.endTime - now) / 1000));
          setTimeLeft(actualTimeLeft);
          setTimerState({ ...state, timeLeft: actualTimeLeft });
        } else {
          // Paused or no endTime - use saved timeLeft
          setTimeLeft(state.timeLeft);
          setTimerState(state);
        }
      } else {
        setTimerState(null);
      }
    };

    // Load initial state
    loadTimerState();

    // Only poll if there's an active timer
    let checkInterval: NodeJS.Timeout | null = null;
    const saved = getLocalStorage<TimerState | null>(STORAGE_KEYS.ACTIVE_TIMER, null);
    if (saved) {
      checkInterval = setInterval(loadTimerState, 100);
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [timerState?.isRunning]);

  // No local countdown - just rely on polling localStorage
  useEffect(() => {
    // Clear any interval since we're relying on polling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleClose = () => {
    if (confirm('Yakin mau stop timer dan kembali ke setup?')) {
      removeLocalStorage(STORAGE_KEYS.ACTIVE_TIMER);
      setTimerState(null);
      router.push('/deep-work');
    }
  };

  const handleMaximize = () => {
    router.push('/deep-work');
  };

  // Don't show if on DeepWork page or no active timer
  if (isOnDeepWorkPage || !timerState || !timerState.isRunning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed top-6 right-5 z-40"
      >
        <div className="bg-emerald-600 text-white rounded-lg border-t border-l border-r-[6px] border-b-[6px] border-emerald-700 shadow-lg overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <Brain className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <div className="text-xs opacity-80">DeepWork</div>
              <div className="font-bold text-lg">{formatTime(timeLeft)}</div>
              <div className="text-xs opacity-90 truncate max-w-[200px]">
                {timerState.meaning}
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleMaximize}
                className="p-2 hover:bg-emerald-700 rounded-md transition"
                title="Buka DeepWork"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 hover:bg-emerald-700 rounded-md transition"
                title="Stop Timer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          {timerState.isPaused && (
            <div className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 text-center">
              DIJEDA
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

