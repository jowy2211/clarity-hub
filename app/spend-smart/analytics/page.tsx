"use client";
import {
  useEffect,
  useState,
} from 'react';

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Coffee,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';

import PageTransition from '@/components/layout/PageTransition';
import { AnalyticsSkeleton } from '@/components/ui/SkeletonLoader';

interface Expense {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'food', name: 'Makanan', icon: Coffee, color: 'bg-amber-600' },
  { id: 'transport', name: 'Transport', icon: Zap, color: 'bg-sky-600' },
  { id: 'shopping', name: 'Belanja', icon: ShoppingBag, color: 'bg-pink-500' },
  { id: 'entertainment', name: 'Hiburan', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'bills', name: 'Tagihan', icon: CreditCard, color: 'bg-rose-600' },
  { id: 'health', name: 'Kesehatan', icon: Package, color: 'bg-emerald-600' },
  { id: 'other', name: 'Lainnya', icon: Wallet, color: 'bg-stone-500' },
];

interface DailySpending {
  date: string;
  amount: number;
}

export default function SpendSmartStatistics() {
  const prefersReducedMotion = useReducedMotion();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Failed to parse expenses:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Filter by period
  const getFilteredExpenses = () => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return expenses.filter(e => new Date(e.date) >= startDate);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalSpending = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSpendingMV = useMotionValue(0);
  const totalSpendingDisplay = useTransform(totalSpendingMV, (latest) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.round(latest))
  );

  // Spending by category
  const spendingByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(spendingByCategory)
    .map(([catId, amount]) => ({
      category: getCategoryInfo(catId),
      amount,
      percentage: (amount / totalSpending) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Daily spending trend (last 7/30 days)
  const getDailyTrend = (): DailySpending[] => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const trend: DailySpending[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dateStr = date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });

      const dayExpenses = filteredExpenses.filter(e => {
        const expenseDate = new Date(e.date);
        expenseDate.setHours(0, 0, 0, 0);
        return expenseDate.getTime() === date.getTime();
      });

      trend.push({
        date: dateStr,
        amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      });
    }

    return trend;
  };

  const dailyTrend = getDailyTrend();
  const maxDaily = Math.max(...dailyTrend.map(d => d.amount), 1);
  const avgDaily = totalSpending / dailyTrend.length;
  const avgDailyMV = useMotionValue(0);
  const avgDailyDisplay = useTransform(avgDailyMV, (latest) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.round(latest))
  );

  // This month vs last month
  const getMonthlyComparison = () => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = expenses.filter(e => new Date(e.date) >= thisMonthStart);
    const lastMonth = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
    const change = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    return { thisMonthTotal, lastMonthTotal, change };
  };

  const monthlyComparison = getMonthlyComparison();
  const changeMV = useMotionValue(0);
  const changeDisplay = useTransform(changeMV, (latest) => `${latest >= 0 ? '+' : ''}${latest.toFixed(1)}%`);

  useEffect(() => {
    if (prefersReducedMotion) {
      changeMV.set(monthlyComparison.change);
      return;
    }
    const c = animate(changeMV, monthlyComparison.change, { duration: 0.6, ease: 'easeOut' });
    return () => c.stop();
  }, [monthlyComparison.change, prefersReducedMotion]);

  // Animate counters when data changes
  useEffect(() => {
    if (prefersReducedMotion) {
      totalSpendingMV.set(totalSpending);
      avgDailyMV.set(avgDaily);
      return;
    }
    const controls1 = animate(totalSpendingMV, totalSpending, { duration: 0.6, ease: 'easeOut' });
    const controls2 = animate(avgDailyMV, avgDaily, { duration: 0.6, ease: 'easeOut' });
    return () => { controls1.stop(); controls2.stop(); };
  }, [totalSpending, avgDaily, prefersReducedMotion]);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header - Mobile First */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-9 h-9 sm:w-10 sm:h-10 text-green-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">Spend Smart Statistics</h1>
            </div>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="/spend-smart"
              className="w-full sm:w-auto rounded-xl bg-orange-100 px-5 py-3 text-sm text-orange-700 active:bg-orange-200 lg:hover:bg-orange-200 font-bold transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 flex items-center gap-2 justify-center touch-manipulation"
            >
              <Wallet className="w-4 h-4" />
              Kembali ke Spend Smart
            </motion.a>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-24">
              <BarChart3 className="w-24 h-24 text-green-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-stone-800 mb-3">
                Belum ada data
              </h2>
              <p className="text-base text-stone-600 mb-8 font-medium">
                Mulai catat pengeluaran untuk melihat statistics!
              </p>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/spend-smart"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-4 text-base text-white font-bold active:bg-amber-700 lg:hover:bg-amber-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
              >
                <Wallet className="w-5 h-5" />
                Catat Pengeluaran
              </motion.a>
            </div>
          ) : (
            <>
              {/* Period Filter - Mobile First */}
              <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1">
                {(['week', 'month', 'year'] as const).map((p) => (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 transition whitespace-nowrap touch-manipulation ${
                      period === p
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-700 active:bg-stone-100 lg:hover:bg-stone-100'
                    }`}
                  >
                    {p === 'week' ? '7 Hari' : p === 'month' ? '30 Hari' : '1 Tahun'}
                  </motion.button>
                ))}
              </div>

              {/* Stats Cards - Mobile First */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8"
                >
                  <DollarSign className="w-10 h-10 mb-4 opacity-80" />
                  <motion.div className="text-4xl sm:text-5xl font-bold mb-2">{totalSpendingDisplay}</motion.div>
                  <div className="text-base opacity-90 font-medium">Total Pengeluaran</div>
                  <div className="text-sm opacity-75 mt-2">{filteredExpenses.length} transaksi</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8"
                >
                  <Calendar className="w-10 h-10 mb-4 opacity-80" />
                  <motion.div className="text-4xl sm:text-5xl font-bold mb-2">{avgDailyDisplay}</motion.div>
                  <div className="text-base opacity-90 font-medium">Rata-rata Harian</div>
                  <div className="text-sm opacity-75 mt-2">dalam periode ini</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`bg-linear-to-br ${
                    monthlyComparison.change > 0 
                      ? 'from-red-500 to-red-600' 
                      : 'from-green-500 to-green-600'
                  } text-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8`}
                >
                  {monthlyComparison.change > 0 ? (
                    <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                  ) : (
                    <TrendingDown className="w-10 h-10 mb-4 opacity-80" />
                  )}
                  <motion.div className="text-4xl sm:text-5xl font-bold mb-2">
                    {changeDisplay}
                  </motion.div>
                  <div className="text-base opacity-90 font-medium">vs Bulan Lalu</div>
                  <div className="text-sm opacity-75 mt-2">
                    {monthlyComparison.change > 0 ? 'Spending naik' : 'Spending turun'}
                  </div>
                </motion.div>
              </div>

              {/* Charts Section - Mobile First */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
                {/* Daily Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">
                      Trend Harian
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-1 h-56 sm:h-64">
                    {dailyTrend.slice(-14).map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full h-full flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.amount / maxDaily) * 100}%` }}
                            transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                            className="w-full bg-linear-to-t from-orange-500 to-orange-400 rounded-t-xl border-t-2 border-l-2 border-r-4 border-stone-300 relative group cursor-pointer"
                            style={{ minHeight: day.amount > 0 ? '12px' : '0px' }}
                          >
                            {day.amount > 0 && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden lg:group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {formatMoney(day.amount)}
                              </div>
                            )}
                          </motion.div>
                        </div>
                        <div className="text-xs text-stone-600 font-medium mt-2 -rotate-45 origin-top-left">
                          {day.date.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">
                      Per Kategori
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {categoryData.length === 0 ? (
                      <p className="text-base text-stone-600 font-medium text-center py-12">
                        Belum ada data
                      </p>
                    ) : (
                      categoryData.map((item, index) => {
                        const CategoryIcon = item.category.icon;
                        return (
                          <motion.div
                            key={item.category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`${item.category.color} p-3 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800`}>
                                  <CategoryIcon className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-stone-800 text-base">
                                  {item.category.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-base text-stone-900">
                                  {formatMoney(item.amount)}
                                </div>
                                <div className="text-sm text-stone-600 font-medium">
                                  {item.percentage.toFixed(0)}%
                                </div>
                              </div>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-stone-300">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                className={`h-full ${item.category.color}`}
                              />
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Top Spending - Mobile First */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-5">
                  Top 10 Pengeluaran Terbesar
                </h2>
                <div className="space-y-4">
                  {filteredExpenses
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 10)
                    .map((expense, index) => {
                      const catInfo = getCategoryInfo(expense.category);
                      const CategoryIcon = catInfo.icon;
                      
                      return (
                        <div
                          key={expense.id}
                          className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 flex items-start gap-4"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="bg-orange-100 text-orange-900 font-black text-base w-10 h-10 rounded-xl flex items-center justify-center border-2 border-stone-300 shrink-0">
                              {index + 1}
                            </div>
                            <div className={`${catInfo.color} p-3 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 shrink-0`}>
                              <CategoryIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base text-stone-800 mb-1">{catInfo.name}</div>
                              {expense.note && (
                                <div className="text-sm text-stone-600 mb-2">{expense.note}</div>
                              )}
                              <div className="text-sm text-stone-500">
                                {new Date(expense.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-xl text-stone-900 shrink-0">
                            {formatMoney(expense.amount)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}


