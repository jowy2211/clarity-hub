"use client";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  BarChart3,
  Brain,
  Clock,
  Home,
  Inbox,
  MousePointerClick,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import PageTransition from '@/components/layout/PageTransition';
import { DeepWorkSkeleton } from '@/components/ui/SkeletonLoader';
import {
  initializePWA,
  safeGetLocalStorage,
  safePlayAlarm,
  safeRemoveLocalStorage,
  safeRequestNotification,
  safeSetLocalStorage,
  safeShowNotification,
} from '@/lib/utils/pwa-safe';
import {
  notifyBreakStarted,
  notifyBreakStopped,
  notifyTimerStarted,
  notifyTimerStopped,
} from '@/lib/utils/sw-messages';

interface FocusSession {
  id: number;
  meaning: string;
  duration: number;
  completedAt: string;
}

export default function DeepWork() {
  return (
    <Suspense fallback={<DeepWorkSkeleton />}>
      <DeepWorkContent />
    </Suspense>
  );
}

function DeepWorkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [meaning, setMeaning] = useState("");
  const [duration, setDuration] = useState(25); // minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionsInitialized, setIsSessionsInitialized] = useState(false);
  const [showBreakTimer, setShowBreakTimer] = useState(false);
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60); // seconds
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  
  // Pomodoro cycle tracking
  const [pomodoroCount, setPomodoroCount] = useState(0); // Current cycle position (0-3)
  const [dailyPomodoroCount, setDailyPomodoroCount] = useState(0); // Total today
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [shouldTriggerCompletion, setShouldTriggerCompletion] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load existing timer state on mount
  useEffect(() => {
    // Initialize PWA features
    initializePWA();
    
    // Load pomodoro count first
    const data = safeGetLocalStorage<any>('pomodoro-data', null);
    if (data) {
      const today = new Date().toDateString();
      if (data.date === today) {
        setPomodoroCount(data.cycleCount || 0);
        setDailyPomodoroCount(data.dailyCount || 0);
      } else {
        // Reset for new day
        safeSetLocalStorage('pomodoro-data', {
          date: today,
          cycleCount: 0,
          dailyCount: 0,
        });
      }
    }

    // Then load timer state
    const state = safeGetLocalStorage<any>('active-timer', null);
    if (state) {
      if (state.isRunning && !state.isPaused && state.endTime) {
          // Calculate actual time left from endTime
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((state.endTime - now) / 1000));
          
          if (remaining > 0) {
            setMeaning(state.meaning);
            setDuration(state.duration);
            setTimeLeft(remaining);
            setIsRunning(true);
            setIsPaused(false);
            setShowSetup(false);
          } else {
            // Timer finished while user was away - set flag to trigger completion
            setMeaning(state.meaning);
            setDuration(state.duration);
            setTimeLeft(0);
            setShouldTriggerCompletion(true);
          }
        } else if (state.isPaused) {
          // Load paused state
          setMeaning(state.meaning);
          setDuration(state.duration);
          setTimeLeft(state.timeLeft);
          setIsRunning(true);
          setIsPaused(true);
          setShowSetup(false);
        }
    }

    // Check if should start break timer (from FloatingTimer completion)
    const startBreakFlag = safeGetLocalStorage<any>('start-break-timer', null);
    if (startBreakFlag && startBreakFlag.shouldStartBreak) {
      // User clicked "Continue" after pomodoro completion
      setShowBreakTimer(true);
      setIsLongBreak(startBreakFlag.isLongBreak);
      setBreakDuration(startBreakFlag.duration);
      setBreakTimeLeft(startBreakFlag.duration * 60);
      setShowSetup(false); // Hide pomodoro setup
      
      // Clear the flag
      safeRemoveLocalStorage('start-break-timer');
    } else {
      // Load break timer state (existing break timer)
      const breakState = safeGetLocalStorage<any>('active-break-timer', null);
      if (breakState) {
        if (breakState.isRunning && breakState.endTime) {
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((breakState.endTime - now) / 1000));
          
          if (remaining > 0) {
            // Break timer still running
            setBreakDuration(breakState.duration);
            setBreakTimeLeft(remaining);
            setIsLongBreak(breakState.isLongBreak);
            setShowBreakTimer(true);
            setIsBreakRunning(true);
            setShowSetup(false); // Hide pomodoro setup when break timer is running
          } else {
            // Break timer finished while user was away
            safeRemoveLocalStorage('active-break-timer');
            // Show setup for next pomodoro
            setShowSetup(true);
            safePlayAlarm();
            safeShowNotification('Break Selesai! ⏰', {
              body: 'Waktunya lanjut fokus lagi!',
            });
          }
        }
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = safeGetLocalStorage<FocusSession[]>('deepwork-sessions', []);
    setSessions(savedSessions);
    setIsSessionsInitialized(true);

    // Check if meaning is passed from todo list
    const todoMeaning = searchParams.get('meaning');
    if (todoMeaning) {
      setMeaning(decodeURIComponent(todoMeaning));
    }
  }, [searchParams]);

  // Save sessions to localStorage (but not on initial mount)
  useEffect(() => {
    if (isSessionsInitialized) {
      safeSetLocalStorage('deepwork-sessions', sessions);
    }
  }, [sessions, isSessionsInitialized]);

  // Timer logic - timestamp-based for perfect sync
  useEffect(() => {
    if (isRunning && !isPaused) {
      const state = safeGetLocalStorage<any>('active-timer', null);
      let endTime: number;
      
      if (state && state.endTime) {
        endTime = state.endTime;
      } else {
        // First time starting - calculate end time
        endTime = Date.now() + (timeLeft * 1000);
      }

      // Save timer state with endTime
      const timerState = {
        meaning,
        duration,
        isRunning: true,
        isPaused: false,
        endTime, // Store when timer should finish
        startedAt: Date.now(),
      };
      safeSetLocalStorage('active-timer', timerState);

      // Notify service worker for background notifications
      notifyTimerStarted(meaning, endTime);

      // Update every second based on endTime
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          handleTimerComplete();
        }
      }, 1000);
    } else if (isRunning && isPaused) {
      // Update paused state with current timeLeft
      const timerState = {
        meaning,
        duration,
        timeLeft, // Save current time when paused
        isRunning,
        isPaused: true,
        startedAt: Date.now(),
      };
      safeSetLocalStorage('active-timer', timerState);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, meaning, duration]);

  // Handle delayed timer completion (when timer finished while user was away)
  useEffect(() => {
    if (shouldTriggerCompletion && !isLoading && sessions) {
      setShouldTriggerCompletion(false);
      handleTimerComplete();
    }
  }, [shouldTriggerCompletion, isLoading, sessions]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Remove active timer from localStorage
    safeRemoveLocalStorage('active-timer');
    
    // Play alarm sound
    safePlayAlarm();
    
    // Increment pomodoro counters
    const newCycleCount = (pomodoroCount + 1) % 4; // 0-3 cycle
    const newDailyCount = dailyPomodoroCount + 1;
    
    setPomodoroCount(newCycleCount);
    setDailyPomodoroCount(newDailyCount);
    
    // Save pomodoro data
    const today = new Date().toDateString();
    safeSetLocalStorage('pomodoro-data', {
      date: today,
      cycleCount: newCycleCount,
      dailyCount: newDailyCount,
    });
    
    // Determine break type: long break after 4th pomodoro
    const isLongBreakTime = newCycleCount === 0 && newDailyCount > 0;
    setIsLongBreak(isLongBreakTime);
    
    // Show browser notification
    safeShowNotification(`Pomodoro ${pomodoroCount + 1} Selesai!`, {
      body: isLongBreakTime 
        ? `4 pomodoro selesai! Waktunya long break.` 
        : `Selesai: ${meaning}. Waktunya istirahat sebentar!`,
    });

    // Save session to history
    const session: FocusSession = {
      id: Date.now(),
      meaning: meaning,
      duration: duration,
      completedAt: new Date().toISOString(),
    };
    setSessions([session, ...sessions]);
    
    // Show break timer with smart duration
    setShowBreakTimer(true);
    const breakTime = isLongBreakTime ? 15 : 5; // 15 min long break, 5 min short break
    setBreakDuration(breakTime);
    setBreakTimeLeft(breakTime * 60);
  };

  const startTimer = () => {
    if (!meaning.trim()) {
      alert('Tulis dulu apa yang mau kamu kerjakan!');
      return;
    }
    
    safeRequestNotification();
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setIsPaused(false);
    setShowSetup(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setShowSetup(true);
    // Remove active timer from localStorage
    safeRemoveLocalStorage('active-timer');
    // Notify service worker to cancel scheduled notification
    notifyTimerStopped();
  };

  // Break timer functions
  const startBreak = () => {
    const timeInSeconds = breakDuration * 60;
    setBreakTimeLeft(timeInSeconds);
    setIsBreakRunning(true);
    
    // Save break timer to localStorage with endTime
    const endTime = Date.now() + (timeInSeconds * 1000);
    const breakTimerState = {
      duration: breakDuration,
      timeLeft: timeInSeconds,
      isRunning: true,
      isLongBreak: isLongBreak,
      endTime: endTime,
    };
    safeSetLocalStorage('active-break-timer', breakTimerState);
    
    // Notify service worker for background notifications
    notifyBreakStarted(isLongBreak, endTime);
  };

  const skipBreak = () => {
    setShowBreakTimer(false);
    setShowSetup(true);
    // Reset form untuk pomodoro berikutnya, tapi jangan reset counter
    setMeaning("");
    setDuration(25);
    setTimeLeft(25 * 60);
    setIsBreakRunning(false);
    
    // Remove break timer from localStorage
    safeRemoveLocalStorage('active-break-timer');
    
    // Notify service worker to cancel scheduled notification
    notifyBreakStopped();
  };

  const handleBreakComplete = () => {
    setIsBreakRunning(false);
    
    // Remove break timer from localStorage
    safeRemoveLocalStorage('active-break-timer');
    
    safePlayAlarm();
    
    safeShowNotification('Break Selesai! ⏰', {
      body: 'Waktunya lanjut fokus lagi!',
    });
    
    // Langsung ke setup pomodoro berikutnya tanpa reset counter
    setTimeout(() => {
      setShowBreakTimer(false);
      setShowSetup(true);
      // Reset form untuk pomodoro berikutnya, tapi counter tetap
      setMeaning("");
      setDuration(25);
      setTimeLeft(25 * 60);
    }, 2000);
  };

  // Break timer countdown - timestamp-based
  useEffect(() => {
    if (isBreakRunning) {
      const state = safeGetLocalStorage<any>('active-break-timer', null);
      let endTime: number;
      
      if (state && state.endTime) {
        endTime = state.endTime;
      } else {
        // First time starting - calculate end time
        endTime = Date.now() + (breakTimeLeft * 1000);
        const breakTimerState = {
          duration: breakDuration,
          timeLeft: breakTimeLeft,
          isRunning: true,
          isLongBreak: isLongBreak,
          endTime: endTime,
        };
        safeSetLocalStorage('active-break-timer', breakTimerState);
      }

      // Update every second based on endTime
      breakIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        setBreakTimeLeft(remaining);
        
        if (remaining <= 0) {
          handleBreakComplete();
        }
      }, 1000);
    } else {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    }

    return () => {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    };
  }, [isBreakRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const presetDurations = [15, 25, 30, 45, 50, 60];

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  // Group sessions by meaning and duration
  const groupedSessions = sessions.reduce((acc, session) => {
    const key = `${session.meaning}-${session.duration}`;
    if (!acc[key]) {
      acc[key] = {
        meaning: session.meaning,
        duration: session.duration,
        count: 1,
        lastCompletedAt: session.completedAt,
      };
    } else {
      acc[key].count += 1;
      if (new Date(session.completedAt) > new Date(acc[key].lastCompletedAt)) {
        acc[key].lastCompletedAt = session.completedAt;
      }
    }
    return acc;
  }, {} as Record<string, { meaning: string; duration: number; count: number; lastCompletedAt: string }>);

  const groupedSessionsArray = Object.values(groupedSessions).sort(
    (a, b) => new Date(b.lastCompletedAt).getTime() - new Date(a.lastCompletedAt).getTime()
  );

  const reuseSession = (sessionMeaning: string, sessionDuration: number) => {
    setMeaning(sessionMeaning);
    setDuration(sessionDuration);
    setTimeLeft(sessionDuration * 60);
    setIsRunning(true);
    setIsPaused(false);
    setShowSetup(false);
    safeRequestNotification();
  };

  if (isLoading) {
    return <DeepWorkSkeleton />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 pb-24 lg:pb-20">
        <main className="flex flex-col lg:flex-row h-full w-full max-w-6xl mx-auto gap-5 lg:gap-6">
          {/* Main Timer Section - Mobile First */}
          <div className="flex-1 flex flex-col bg-stone-50 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 lg:p-8">
            {/* Header - Mobile First */}
            <div className="flex flex-col gap-3 mb-5 sm:mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <Brain className="w-9 h-9 sm:w-10 sm:h-10 text-violet-600" />
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">Deep Work</h1>
              </div>
              <div className="flex gap-2.5">
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="/deep-work/statistics"
                  className="flex-1 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-emerald-300 flex items-center gap-2 justify-center touch-manipulation"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistics</span>
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="/"
                  className="flex-1 rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-200 transition border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 flex items-center gap-2 justify-center touch-manipulation"
                >
                  <Home className="w-4 h-4" />
                  <span>Kembali</span>
                </motion.a>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showBreakTimer ? (
                <motion.div
                  key="break"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex flex-col justify-center items-center gap-6 sm:gap-8 py-4"
                >
                  {/* Break Header - Mobile First */}
                  <div className="text-center px-4">
                    <p className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
                      {isLongBreak ? '4 Pomodoro Selesai!' : 'Pomodoro Selesai!'}
                    </p>
                    <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                      {isLongBreak 
                        ? 'Mantap! Waktunya long break (15-30 menit)' 
                        : 'Waktunya short break (5 menit)'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-full border-2 border-stone-300">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <p className="text-sm font-bold text-violet-700">
                        Total hari ini: {dailyPomodoroCount} pomodoro
                      </p>
                    </div>
                  </div>

                  {!isBreakRunning ? (
                    <>
                      {/* Break Duration Selection - Mobile First */}
                      <div className="w-full max-w-md px-4">
                        <label className="block text-base sm:text-lg font-bold text-stone-700 mb-4 text-center">
                          {isLongBreak ? 'Long Break - Pilih durasi:' : 'Short Break - Pilih durasi:'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(isLongBreak ? [15, 20, 30] : [5, 10, 15]).map((mins) => (
                            <motion.button
                              key={mins}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setBreakDuration(mins)}
                              className={`rounded-xl px-5 py-4 text-base font-bold border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 transition touch-manipulation ${
                                breakDuration === mins
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-stone-700 active:bg-stone-100'
                              }`}
                            >
                              {mins} min
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Break Actions - Mobile First */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-4">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={startBreak}
                          className="flex-1 rounded-xl bg-violet-500 px-6 py-5 text-lg font-bold text-white active:bg-violet-600 lg:hover:bg-violet-600 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 flex items-center gap-3 justify-center touch-manipulation"
                        >
                          <Play className="w-6 h-6" fill="white" />
                          Mulai Break
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={skipBreak}
                          className="flex-1 rounded-xl bg-gray-200 px-6 py-5 text-lg font-bold text-stone-700 active:bg-gray-300 lg:hover:bg-gray-300 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
                        >
                          Skip
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Break Timer Display - Mobile First */}
                      <div className="text-center px-4">
                        <p className="text-base text-stone-500 mb-5">Istirahat dulu...</p>
                        <div className="text-7xl sm:text-8xl font-bold text-violet-500 mb-8">
                          {formatTime(breakTimeLeft)}
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={skipBreak}
                        className="rounded-xl bg-gray-200 px-8 py-4 text-base font-bold text-stone-700 active:bg-gray-300 lg:hover:bg-gray-300 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
                      >
                        Skip Break
                      </motion.button>
                    </>
                  )}
                </motion.div>
              ) : showSetup ? (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex flex-col justify-center gap-5 sm:gap-6 py-4"
                >
                  {/* Pomodoro Counter Display - Mobile First */}
                  {dailyPomodoroCount > 0 && (
                    <div className="bg-violet-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-violet-300 p-5 text-center">
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="text-4xl font-black text-violet-900">{dailyPomodoroCount}</div>
                          <div className="text-sm font-bold text-violet-700 uppercase mt-1">Pomodoro Hari Ini</div>
                        </div>
                        <div className="h-px bg-violet-200"></div>
                        <div>
                          <div className="text-lg font-bold text-violet-900">
                            Cycle: {pomodoroCount + 1}/4
                          </div>
                          <div className="text-sm text-violet-700 mt-1">
                            {pomodoroCount === 3 ? 'Long break setelah ini!' : 'Short break next'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meaning Input - Mobile First */}
                  <div className="px-4">
                    <label className="block text-base font-bold text-stone-700 mb-3">
                      Apa yang mau kamu kerjakan?
                    </label>
                    <input
                      type="text"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && startTimer()}
                      placeholder="Contoh: Menulis artikel, Coding fitur baru..."
                      className="w-full rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                      autoFocus
                    />
                  </div>

                  {/* Duration Presets - Mobile First */}
                  <div className="px-4">
                    <label className="block text-base font-bold text-stone-700 mb-3">
                      Berapa lama? (menit)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {presetDurations.map((mins) => (
                        <motion.button
                          key={mins}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDuration(mins)}
                          className={`rounded-xl px-5 py-4 text-base font-bold border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 transition touch-manipulation ${
                            duration === mins
                              ? 'bg-violet-600 text-white border-violet-700'
                              : 'bg-white text-stone-700 active:bg-stone-100'
                          }`}
                        >
                          {mins}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button - Mobile First */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startTimer}
                    className="mx-4 rounded-xl bg-violet-600 px-6 py-5 text-xl font-bold text-white active:bg-violet-700 lg:hover:bg-violet-700 transition border-t border-l border-r-[6px] border-b-[6px] border-violet-700 flex items-center justify-center gap-3 touch-manipulation"
                  >
                    <Play className="w-7 h-7" fill="white" />
                    Mulai Pomodoro #{dailyPomodoroCount + 1}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex flex-col justify-center items-center gap-6 sm:gap-8 py-4"
                >
                  {/* Pomodoro Cycle Indicator - Mobile First */}
                  <div className="w-full max-w-md bg-violet-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-violet-300 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-violet-900">Pomodoro {pomodoroCount + 1}/4</span>
                        <span className="text-sm text-violet-700">Hari ini: {dailyPomodoroCount + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-full ${
                              i === pomodoroCount 
                                ? 'bg-violet-600 animate-pulse' 
                                : i < pomodoroCount 
                                ? 'bg-violet-300' 
                                : 'bg-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Task - Mobile First */}
                  <div className="text-center mb-2 px-4">
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-bold">
                      SEDANG FOKUS PADA
                    </p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800">{meaning}</h2>
                  </div>

                  {/* Modern Timer Box - Mobile First */}
                  <div className="w-full max-w-md px-4">
                    <div className="bg-white rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8">
                      {/* Timer Display */}
                      <div className="text-center mb-6">
                        <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-stone-900 tracking-tighter mb-4">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-violet-500'} animate-pulse`}></div>
                          <span className={`text-base sm:text-lg font-bold uppercase tracking-wider ${isPaused ? 'text-amber-600' : 'text-violet-600'}`}>
                            {isPaused ? 'DIJEDA' : 'FOKUS'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-300 mb-5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-linear-to-r from-violet-500 to-violet-600"
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      {/* Duration Info */}
                      <div className="flex justify-between text-sm font-bold text-stone-600 mb-5">
                        <span>{Math.floor((duration * 60 - timeLeft) / 60)} menit lewat</span>
                        <span>{duration} menit total</span>
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls - Mobile First */}
                  <div className="flex gap-3 px-4 w-full max-w-md">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={pauseTimer}
                      className={`flex-1 rounded-xl px-6 py-5 font-black text-lg transition border-t border-l border-r-2 border-b-2 flex items-center gap-3 justify-center touch-manipulation ${
                        isPaused 
                          ? 'bg-violet-500 text-white active:bg-violet-600 lg:hover:bg-violet-600 border-violet-600' 
                          : 'bg-amber-400 text-amber-900 active:bg-amber-500 lg:hover:bg-amber-500 border-amber-500'
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-6 h-6" fill="currentColor" />
                          <span>LANJUT</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-6 h-6" fill="currentColor" />
                          <span>JEDA</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={resetTimer}
                      className="rounded-xl bg-rose-600 px-6 py-5 font-black text-lg text-white active:bg-rose-700 lg:hover:bg-rose-700 transition border-t border-l border-r-[6px] border-b-[6px] border-rose-700 flex items-center gap-3 touch-manipulation"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History Sidebar - Mobile First */}
          <div className="w-full lg:w-80 flex flex-col bg-stone-50 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 max-h-[400px] lg:max-h-full">
            <h2 className="text-2xl font-bold text-stone-800 mb-5 shrink-0">
              History
            </h2>
            <div className="space-y-3 overflow-y-auto flex-1">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <div className="flex justify-center mb-3">
                    <Inbox className="w-16 h-16 text-stone-300" />
                  </div>
                  <p className="text-base">Belum ada sesi fokus</p>
                </div>
              ) : (
                groupedSessionsArray.map((group, index) => (
                  <motion.div
                    key={`${group.meaning}-${group.duration}-${index}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => reuseSession(group.meaning, group.duration)}
                    className="bg-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-4 cursor-pointer active:bg-violet-50 lg:hover:bg-violet-50 transition touch-manipulation"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-bold text-stone-800 text-base flex-1 pr-2">
                        {group.meaning}
                      </p>
                      {group.count > 1 && (
                        <span className="bg-violet-600 text-white text-sm font-bold px-3 py-1 rounded-full shrink-0">
                          {group.count}x
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-stone-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {group.duration} menit
                      </span>
                      <span>
                        {new Date(group.lastCompletedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-stone-200">
                      <p className="text-sm text-violet-700 font-bold flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4" />
                        Klik untuk mulai
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}


