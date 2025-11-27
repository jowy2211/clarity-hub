"use client";
import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Brain,
  CheckSquare,
  Filter,
  ListTodo,
  Save,
  Target,
  Timer,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import GitHubBadge from '@/components/layout/GitHubBadge';
import PageTransition from '@/components/layout/PageTransition';
import { HomePageSkeleton } from '@/components/ui/SkeletonLoader';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set minimal delay untuk skeleton loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 20); // Delay minimal 20ms
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <PageTransition>
      <GitHubBadge />
      <div className="min-h-screen bg-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-10 lg:py-16">
          {/* Header - Mobile First */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 sm:mb-14 lg:mb-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 border-2 border-stone-300 mb-5 sm:mb-7">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-stone-800 mb-4 sm:mb-5 tracking-tight leading-none">
              ClarityHub
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-stone-600 max-w-2xl mx-auto px-2">
              The hub for your daily clarity
            </p>
          </motion.div>

          {/* Feature Cards Grid - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-10 mb-10 sm:mb-14">
            {/* DeepWork Card with subtle tilt/parallax */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ rotateX: 1.5, rotateY: -1.5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={() => router.push('/deep-work')}
              className="group cursor-pointer bg-linear-to-br from-violet-50/80 via-violet-50/40 to-white/40 backdrop-blur-sm rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 active:scale-[0.98] lg:hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-200 relative overflow-hidden will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-br from-violet-100/20 to-transparent opacity-50"></div>
              <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5 sm:mb-6 lg:mb-7">
                <div className="p-3 lg:p-4 bg-violet-600 rounded-xl border border-violet-700">
                  <Brain className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800">Deep Work</h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-stone-700 mb-5 sm:mb-6 lg:mb-8 leading-relaxed">
                Pomodoro timer dengan tracking otomatis untuk membantu fokus dalam bekerja
              </p>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <Timer className="w-5 h-5 lg:w-6 lg:h-6 text-violet-700" />
                  </div>
                  <span>Pomodoro 25 menit</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-violet-700" />
                  </div>
                  <span>Statistik & analytics</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-violet-700" />
                  </div>
                  <span>Notifikasi & alarm</span>
                </div>
              </div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="mt-6 lg:mt-8 w-full rounded-xl bg-violet-600 px-6 py-4 lg:py-5 text-center text-base lg:text-lg font-bold text-white border-t border-l border-r-[6px] border-b-[6px] border-violet-700 group-hover:bg-violet-700 transition touch-manipulation"
              >
                Mulai Fokus →
              </motion.div>
              </div>
            </motion.div>

            {/* Todo List Card with subtle tilt/parallax */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ rotateX: 1.5, rotateY: 1.5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={() => router.push('/to-do-list')}
              className="group cursor-pointer bg-linear-to-br from-sky-50/80 via-sky-50/40 to-white/40 backdrop-blur-sm rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 active:scale-[0.98] lg:hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-200 relative overflow-hidden will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-br from-sky-100/20 to-transparent opacity-50"></div>
              <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5 sm:mb-6 lg:mb-7">
                <div className="p-3 lg:p-4 bg-sky-600 rounded-xl border border-sky-700">
                  <CheckSquare className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800">Todo List</h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-stone-700 mb-5 sm:mb-6 lg:mb-8 leading-relaxed">
                Kelola tugas harian dengan mudah, filter berdasarkan status dan prioritas
              </p>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <ListTodo className="w-5 h-5 lg:w-6 lg:h-6 text-sky-700" />
                  </div>
                  <span>Manage tasks dengan cepat</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-sky-700" />
                  </div>
                  <span>Filter & kategori</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <Save className="w-5 h-5 lg:w-6 lg:h-6 text-sky-700" />
                  </div>
                  <span>Auto-save lokal</span>
                </div>
              </div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="mt-6 lg:mt-8 w-full rounded-xl bg-sky-600 px-6 py-4 lg:py-5 text-center text-base lg:text-lg font-bold text-white border-t border-l border-r-[6px] border-b-[6px] border-sky-700 group-hover:bg-sky-700 transition touch-manipulation"
              >
                Kelola Tugas →
              </motion.div>
              </div>
            </motion.div>

            {/* SpendSmart Card with subtle tilt/parallax */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ rotateX: -1.5, rotateY: 1.5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={() => router.push('/spend-smart')}
              className="group cursor-pointer bg-linear-to-br from-amber-50/80 via-amber-50/40 to-white/40 backdrop-blur-sm rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 active:scale-[0.98] lg:hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-200 relative overflow-hidden will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-br from-amber-100/20 to-transparent opacity-50"></div>
              <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5 sm:mb-6 lg:mb-7">
                <div className="p-3 lg:p-4 bg-amber-600 rounded-xl border border-amber-700">
                  <Wallet className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800">Spend Smart</h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-stone-700 mb-5 sm:mb-6 lg:mb-8 leading-relaxed">
                Tracking pengeluaran harian dengan analytics dan insights untuk budget
              </p>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <Target className="w-5 h-5 lg:w-6 lg:h-6 text-amber-700" />
                  </div>
                  <span>Catat pengeluaran</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-amber-700" />
                  </div>
                  <span>Analytics spending</span>
                </div>
                <div className="flex items-center gap-3 text-base lg:text-lg text-stone-700">
                  <div className="p-2 lg:p-2.5 bg-white rounded-lg border border-stone-300">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-amber-700" />
                  </div>
                  <span>Budget tracking</span>
                </div>
              </div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="mt-6 lg:mt-8 w-full rounded-xl bg-amber-600 px-6 py-4 lg:py-5 text-center text-base lg:text-lg font-bold text-white border-t border-l border-r-[6px] border-b-[6px] border-amber-700 group-hover:bg-amber-700 transition touch-manipulation"
              >
                Track Spending →
              </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Footer Info - Mobile First */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center px-2"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-stone-100 px-5 sm:px-6 py-3 sm:py-4 rounded-full border border-stone-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-sm sm:text-base font-medium text-stone-700">
                100% offline • Data tersimpan lokal di perangkat
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

