"use client";
import {
  useEffect,
  useState,
} from 'react';

import {
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Flame,
  Target,
  TrendingUp,
} from 'lucide-react';

import PageTransition from '@/components/layout/PageTransition';
import { StatisticsSkeleton } from '@/components/ui/SkeletonLoader';

interface FocusSession {
  id: number;
  meaning: string;
  duration: number;
  completedAt: string;
}

interface DailyStats {
  date: string;
  sessions: number;
  totalMinutes: number;
}

export default function Statistics() {
  const prefersReducedMotion = useReducedMotion();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPomodoroCount, setDailyPomodoroCount] = useState(0);

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('deepwork-sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (error) {
        console.error('Failed to parse sessions:', error);
      }
    }

    // Load pomodoro count
    const savedPomodoroData = localStorage.getItem('pomodoro-data');
    if (savedPomodoroData) {
      try {
        const data = JSON.parse(savedPomodoroData);
        const today = new Date().toDateString();
        if (data.date === today) {
          setDailyPomodoroCount(data.dailyCount || 0);
        }
      } catch (error) {
        console.error('Failed to parse pomodoro data:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Count total pomodoros (25-min sessions)
  const totalPomodoros = sessions.filter(s => s.duration === 25).length;

  // Calculate streak (consecutive days with sessions)
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;

    const uniqueDates = [...new Set(sessions.map(s => 
      new Date(s.completedAt).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of uniqueDates) {
      const sessionDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Get last 7 days stats
  const getLast7DaysStats = (): DailyStats[] => {
    const stats: DailyStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });
      
      stats.push({
        date: dateStr,
        sessions: daySessions.length,
        totalMinutes: daySessions.reduce((acc, s) => acc + s.duration, 0),
      });
    }
    
    return stats;
  };

  const last7Days = getLast7DaysStats();
  const maxSessions = Math.max(...last7Days.map(d => d.sessions), 1);

  // Most productive time
  const getTopMeanings = () => {
    const meaningCount: Record<string, { count: number; totalMinutes: number }> = {};
    
    sessions.forEach(s => {
      if (!meaningCount[s.meaning]) {
        meaningCount[s.meaning] = { count: 0, totalMinutes: 0 };
      }
      meaningCount[s.meaning].count++;
      meaningCount[s.meaning].totalMinutes += s.duration;
    });
    
    return Object.entries(meaningCount)
      .map(([meaning, data]) => ({ meaning, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const topMeanings = getTopMeanings();

  // This week stats
  const getThisWeekStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekSessions = sessions.filter(s => 
      new Date(s.completedAt) >= startOfWeek
    );

    return {
      sessions: weekSessions.length,
      minutes: weekSessions.reduce((acc, s) => acc + s.duration, 0),
    };
  };

  const thisWeek = getThisWeekStats();

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header - Mobile First */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">Deep Work Statistics</h1>
            </div>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="/deep-work"
              className="rounded-xl bg-violet-50 px-5 py-3 text-sm font-bold text-violet-700 active:bg-violet-200 lg:hover:bg-violet-200 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 flex items-center gap-2 justify-center w-full sm:w-auto touch-manipulation"
            >
              <Brain className="w-4 h-4" />
              Kembali ke Deep Work
            </motion.a>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-16 sm:py-20 px-4">
              <BarChart3 className="w-24 h-24 text-emerald-300 mx-auto mb-5" />
              <h2 className="text-3xl font-bold text-stone-800 mb-3">
                Belum ada data
              </h2>
              <p className="text-base sm:text-lg text-stone-500 mb-8 max-w-md mx-auto">
                Mulai sesi DeepWork pertamamu untuk melihat statistik!
              </p>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/deep-work"
                className="inline-flex items-center gap-3 rounded-xl bg-violet-600 px-8 py-4 text-lg text-white font-bold active:bg-violet-700 lg:hover:bg-violet-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
              >
                <Brain className="w-6 h-6" />
                Mulai Deep Work
              </motion.a>
            </div>
          ) : (
            <>
              {/* Stats Cards - Mobile First */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-10">
                {/* Total Pomodoros */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <Brain className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{totalPomodoros}</div>
                  <div className="text-sm sm:text-base opacity-90 font-medium">Total Pomodoro</div>
                  <div className="text-xs opacity-75 mt-2 hidden sm:block">25-min sessions</div>
                </motion.div>

                {/* Today Pomodoros */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-linear-to-br from-teal-500 to-teal-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <Target className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{dailyPomodoroCount}</div>
                  <div className="text-sm sm:text-base opacity-90 font-medium">Hari Ini</div>
                  <div className="text-xs opacity-75 mt-2 hidden sm:block">Pomodoro selesai</div>
                </motion.div>

                {/* Total Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <Clock className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-2">
                    {totalHours}
                    <span className="text-2xl">h</span>
                    {remainingMinutes > 0 && (
                      <span className="text-2xl ml-1">{remainingMinutes}m</span>
                    )}
                  </div>
                  <div className="text-sm sm:text-base opacity-90 font-medium">Total Waktu Fokus</div>
                  <div className="text-xs opacity-75 mt-2">{totalSessions} sesi</div>
                </motion.div>

                {/* Current Streak */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <Flame className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{currentStreak}</div>
                  <div className="text-sm sm:text-base opacity-90 font-medium">Hari Streak</div>
                  <div className="text-xs opacity-75 mt-2">{currentStreak > 0 ? 'Jaga terus!' : 'Mulai hari ini'}</div>
                </motion.div>

                {/* This Week */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6"
                >
                  <Calendar className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{thisWeek.sessions}</div>
                  <div className="text-sm sm:text-base opacity-90 font-medium">Minggu Ini</div>
                  <div className="text-xs opacity-75 mt-2">{Math.floor(thisWeek.minutes / 60)}h {thisWeek.minutes % 60}m fokus</div>
                </motion.div>
              </div>

              {/* Charts Section - Mobile First */}
              <div className="space-y-5 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-6 mb-8 sm:mb-10">
                {/* 7 Days Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 lg:self-start"
                >
                  <div className="flex items-center gap-2 mb-5 sm:mb-6">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-stone-800">
                      Aktivitas 7 Hari Terakhir
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-2 sm:gap-3 h-64 lg:h-80">
                    {last7Days.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full h-full flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                            transition={prefersReducedMotion ? { duration: 0.12 } : { delay: 0.4 + index * 0.08, type: 'spring', stiffness: 260, damping: 26 }}
                            className="w-full bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t-lg border-t-2 border-l-2 border-r-4 border-stone-300 relative group cursor-pointer touch-manipulation"
                            style={{ minHeight: day.sessions > 0 ? '24px' : '0px' }}
                          >
                            {day.sessions > 0 && (
                              <>
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm font-bold text-stone-700">
                                  {day.sessions}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden lg:group-hover:block bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                                  {day.totalMinutes} menit
                                </div>
                              </>
                            )}
                          </motion.div>
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                          {day.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Activities - Mobile First */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 lg:self-start"
                >
                  <div className="flex items-center gap-2 mb-5 sm:mb-6">
                    <Brain className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-stone-800">
                      Top 5 Aktivitas Fokus
                    </h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {topMeanings.length === 0 ? (
                      <p className="text-stone-500 text-base text-center py-10">
                        Belum ada data
                      </p>
                    ) : (
                      topMeanings.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={prefersReducedMotion ? { duration: 0.12 } : { delay: 0.5 + index * 0.08, type: 'spring', stiffness: 320, damping: 28 }}
                          className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-4 sm:p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-base text-stone-800 flex-1 truncate pr-3">
                              {item.meaning}
                            </span>
                            <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shrink-0">
                              {item.count}x
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <Clock className="w-4 h-4" />
                            <span>{item.totalMinutes} menit total</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Recent Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-6"
              >
                <h2 className="text-xl font-bold text-stone-800 mb-4">
                  Sesi Terbaru
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-3 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-stone-800">{session.meaning}</p>
                        <p className="text-xs text-stone-500">
                          {new Date(session.completedAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-stone-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold">{session.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}



