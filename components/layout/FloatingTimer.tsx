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
import {
  BreakTimerState,
  TimerState,
} from '@/lib/types';
import { formatTime } from '@/lib/utils/formatters';
import {
  safePlayAlarm,
  safeShowNotification,
} from '@/lib/utils/pwa-safe';
import {
  getLocalStorage,
  removeLocalStorage,
} from '@/lib/utils/storage';

export default function FloatingTimer() {
  const router = useRouter();
  const pathname = usePathname();
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [breakTimerState, setBreakTimerState] = useState<BreakTimerState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showCompletionNotice, setShowCompletionNotice] = useState(false);
  const [completionType, setCompletionType] = useState<'pomodoro' | 'break'>('pomodoro');
  const [completionMessage, setCompletionMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);
  const hasBreakCompletedRef = useRef(false);

  // Check if we're on DeepWork page
  const isOnDeepWorkPage = pathname === '/deep-work';

  // Handle timer completion
  const handleTimerComplete = () => {
    if (hasCompletedRef.current) return; // Prevent double execution
    hasCompletedRef.current = true;

    // Play alarm
    safePlayAlarm();

    // Show notification
    safeShowNotification('Pomodoro Selesai! ⏰', {
      body: `Timer selesai! Waktunya istirahat.`,
    });

    // Show completion notice instead of auto-redirect
    setCompletionType('pomodoro');
    setCompletionMessage(timerState?.meaning || 'Sesi fokus');
    setShowCompletionNotice(true);
    
    // Clear timer state
    setTimerState(null);
    setTimeLeft(0);
    
    // Remove from localStorage to prevent showing again
    removeLocalStorage(STORAGE_KEYS.ACTIVE_TIMER);
  };

  // Handle break timer completion
  const handleBreakComplete = () => {
    if (hasBreakCompletedRef.current) return; // Prevent double execution
    hasBreakCompletedRef.current = true;

    // Play alarm
    safePlayAlarm();

    // Show notification
    safeShowNotification('Break Selesai! ⏰', {
      body: `Waktunya lanjut fokus lagi!`,
    });

    // Show completion notice instead of auto-redirect
    setCompletionType('break');
    setCompletionMessage(breakTimerState?.isLongBreak ? 'Long break' : 'Short break');
    setShowCompletionNotice(true);
    
    // Clear break timer state
    setBreakTimerState(null);
    setBreakTimeLeft(0);
    
    // Remove from localStorage to prevent showing again
    removeLocalStorage(STORAGE_KEYS.ACTIVE_BREAK_TIMER);
  };

  // Load timer state from localStorage with continuous polling
  useEffect(() => {
    const loadTimerState = () => {
      const state = getLocalStorage<TimerState | null>(STORAGE_KEYS.ACTIVE_TIMER, null);
      if (state) {
        if (state.isRunning && !state.isPaused && state.endTime) {
          // Calculate actual time left from endTime (single source of truth)
          const now = Date.now();
          const actualTimeLeft = Math.max(0, Math.floor((state.endTime - now) / 1000));
          
          // Check if timer completed (either just now or already completed)
          if (actualTimeLeft <= 0) {
            if (!hasCompletedRef.current) {
              handleTimerComplete();
            }
            return;
          }
          
          setTimeLeft(actualTimeLeft);
          setTimerState({ ...state, timeLeft: actualTimeLeft });
        } else {
          // Paused or no endTime - use saved timeLeft
          setTimeLeft(state.timeLeft);
          setTimerState(state);
        }
      } else {
        setTimerState(null);
        hasCompletedRef.current = false; // Reset flag when no timer
      }
    };

    // Load initial state
    loadTimerState();

    // Always poll to detect new timers from other pages
    const checkInterval = setInterval(loadTimerState, 500); // Check every 500ms

    return () => {
      clearInterval(checkInterval);
    };
  }, []); // Empty dependency - always run polling

  // Load break timer state from localStorage with continuous polling
  useEffect(() => {
    const loadBreakTimerState = () => {
      const state = getLocalStorage<BreakTimerState | null>(STORAGE_KEYS.ACTIVE_BREAK_TIMER, null);
      if (state) {
        if (state.isRunning && state.endTime) {
          const now = Date.now();
          const actualTimeLeft = Math.max(0, Math.floor((state.endTime - now) / 1000));
          
          // Check if break timer completed (either just now or already completed)
          if (actualTimeLeft <= 0) {
            if (!hasBreakCompletedRef.current) {
              handleBreakComplete();
            }
            return;
          }
          
          setBreakTimeLeft(actualTimeLeft);
          setBreakTimerState({ ...state, timeLeft: actualTimeLeft });
        } else {
          setBreakTimeLeft(state.timeLeft);
          setBreakTimerState(state);
        }
      } else {
        setBreakTimerState(null);
        hasBreakCompletedRef.current = false; // Reset flag when no break timer
      }
    };

    // Load initial state
    loadBreakTimerState();

    // Always poll to detect new break timers from other pages
    const checkInterval = setInterval(loadBreakTimerState, 500); // Check every 500ms

    return () => {
      clearInterval(checkInterval);
    };
  }, []); // Empty dependency - always run polling

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

  const handleContinue = () => {
    setShowCompletionNotice(false);
    hasCompletedRef.current = false;
    hasBreakCompletedRef.current = false;
    
    // If pomodoro completed, set flag to start break timer
    if (completionType === 'pomodoro') {
      const breakState = getLocalStorage<any>(STORAGE_KEYS.POMODORO_DATA, null);
      const cycleCount = breakState?.cycleCount || 0;
      const isLongBreak = cycleCount === 0 && (breakState?.dailyCount || 0) > 0;
      
      // Set flag for DeepWork page to show break timer
      const breakDuration = isLongBreak ? 15 : 5;
      const startBreakFlag = {
        shouldStartBreak: true,
        isLongBreak: isLongBreak,
        duration: breakDuration,
      };
      localStorage.setItem(STORAGE_KEYS.START_BREAK_TIMER, JSON.stringify(startBreakFlag));
    }
    
    router.push('/deep-work');
  };

  const handleDismissCompletion = () => {
    setShowCompletionNotice(false);
    hasCompletedRef.current = false;
    hasBreakCompletedRef.current = false;
  };

  // Don't show if on DeepWork page
  if (isOnDeepWorkPage) return null;
  
  // Show completion notice if timer/break completed
  if (showCompletionNotice) {
    const isBreak = completionType === 'break';
    const bgColor = isBreak ? 'bg-blue-500' : 'bg-violet-600';
    const borderColor = isBreak ? 'border-blue-600' : 'border-violet-700';
    const hoverColor = isBreak ? 'hover:bg-blue-600' : 'hover:bg-violet-700';
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed top-6 right-5 z-50"
        >
          <motion.div
            className={`${bgColor} text-white rounded-lg border-t border-l border-r-[6px] border-b-[6px] ${borderColor} shadow-2xl overflow-hidden max-w-sm`}
            animate={{ 
              boxShadow: [
                '0 10px 50px rgba(0,0,0,0.3)',
                '0 10px 60px rgba(139,92,246,0.5)',
                '0 10px 50px rgba(0,0,0,0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Brain className="w-8 h-8" />
                </motion.div>
                <div className="flex-1">
                  <div className="font-bold text-xl">
                    {isBreak ? '🎉 Break Selesai!' : '⏰ Pomodoro Selesai!'}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {isBreak ? 'Waktunya fokus lagi!' : `Selesai: ${completionMessage}`}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismissCompletion}
                  className={`p-2 ${hoverColor} rounded-md transition`}
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinue}
                  className="flex-1 bg-white text-gray-900 font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isBreak ? '🚀 Mulai Fokus' : '☕ Istirahat'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismissCompletion}
                  className={`px-4 py-3 ${hoverColor} rounded-lg font-semibold transition-all`}
                >
                  Nanti
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  // Show break timer if active
  if (breakTimerState && breakTimerState.isRunning) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed top-6 right-5 z-40"
        >
          <div className="bg-blue-500 text-white rounded-lg border-t border-l border-r-[6px] border-b-[6px] border-blue-600 shadow-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3">
              <Brain className="w-6 h-6 shrink-0" />
              <div className="flex-1">
                <div className="text-xs opacity-80">{breakTimerState.isLongBreak ? 'Long Break' : 'Short Break'}</div>
                <div className="font-bold text-lg">{formatTime(breakTimeLeft)}</div>
                <div className="text-xs opacity-90">
                  Istirahat dulu...
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleMaximize}
                className="p-2 hover:bg-blue-600 rounded-md transition"
                title="Buka DeepWork"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  // Show pomodoro timer if active
  if (!timerState || !timerState.isRunning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed top-6 right-5 z-40"
      >
        <div className="bg-violet-600 text-white rounded-lg border-t border-l border-r-[6px] border-b-[6px] border-violet-700 shadow-lg overflow-hidden">
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
                className="p-2 hover:bg-violet-700 rounded-md transition"
                title="Buka DeepWork"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 hover:bg-violet-700 rounded-md transition"
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

