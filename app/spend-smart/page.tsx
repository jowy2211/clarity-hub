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
  BarChart3,
  Calendar,
  Coffee,
  CreditCard,
  DollarSign,
  Edit,
  Home,
  Package,
  Plane,
  Plus,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

import PageTransition from '@/components/layout/PageTransition';
import { SpendSmartSkeleton } from '@/components/ui/SkeletonLoader';

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

interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
}

const CATEGORIES: Category[] = [
  { id: 'food', name: 'Makanan', icon: Coffee, color: 'bg-amber-600' },
  { id: 'transport', name: 'Transport', icon: Zap, color: 'bg-sky-600' },
  { id: 'shopping', name: 'Belanja', icon: ShoppingBag, color: 'bg-pink-500' },
  { id: 'entertainment', name: 'Hiburan', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'bills', name: 'Tagihan', icon: CreditCard, color: 'bg-red-500' },
  { id: 'health', name: 'Kesehatan', icon: Package, color: 'bg-emerald-600' },
  { id: 'other', name: 'Lainnya', icon: Wallet, color: 'bg-stone-500' },
];

const GOAL_ICONS = [
  { id: 'smartphone', icon: Smartphone, label: 'Gadget' },
  { id: 'plane', icon: Plane, label: 'Travel' },
  { id: 'home', icon: Home, label: 'Rumah' },
  { id: 'wallet', icon: Wallet, label: 'Dana Darurat' },
  { id: 'sparkles', icon: Sparkles, label: 'Lainnya' },
  { id: 'target', icon: Target, label: 'Target' },
];

export default function SpendSmart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpensesInitialized, setIsExpensesInitialized] = useState(false);
  const [isGoalsInitialized, setIsGoalsInitialized] = useState(false);
  
  // Form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Goal form states
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalIcon, setGoalIcon] = useState('target');
  
  // Filter
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Load expenses from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Failed to parse expenses:', error);
      }
    }
    setIsExpensesInitialized(true);
  }, []);

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('savingGoals');
    if (savedGoals) {
      try {
        setSavingGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Failed to parse saving goals:', error);
      }
    }
    setIsGoalsInitialized(true);
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (isExpensesInitialized) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isExpensesInitialized]);

  // Save goals to localStorage
  useEffect(() => {
    if (isGoalsInitialized) {
      localStorage.setItem('savingGoals', JSON.stringify(savingGoals));
    }
  }, [savingGoals, isGoalsInitialized]);

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Masukkan jumlah yang valid!');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      note,
      date,
      createdAt: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);
    
    // Reset form
    setAmount('');
    setCategory('food');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const deleteExpense = (id: number) => {
    if (confirm('Hapus pengeluaran ini?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // Goal functions
  const addOrUpdateGoal = () => {
    if (!goalName || !goalTarget || parseFloat(goalTarget) <= 0) {
      alert('Masukkan nama dan target yang valid!');
      return;
    }

    if (!goalDeadline) {
      alert('Pilih tanggal deadline!');
      return;
    }

    if (editingGoal) {
      // Update existing goal
      setSavingGoals(savingGoals.map(g => 
        g.id === editingGoal.id 
          ? {
              ...g,
              name: goalName,
              targetAmount: parseFloat(goalTarget),
              currentAmount: parseFloat(goalCurrent) || 0,
              deadline: goalDeadline,
              icon: goalIcon,
            }
          : g
      ));
    } else {
      // Add new goal
      const newGoal: SavingGoal = {
        id: Date.now().toString(),
        name: goalName,
        targetAmount: parseFloat(goalTarget),
        currentAmount: parseFloat(goalCurrent) || 0,
        deadline: goalDeadline,
        icon: goalIcon,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setSavingGoals([newGoal, ...savingGoals]);
    }

    // Reset form
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDeadline('');
    setGoalIcon('target');
    setEditingGoal(null);
    setShowGoalForm(false);
  };

  const deleteGoal = (id: string) => {
    if (confirm('Hapus saving goal ini?')) {
      setSavingGoals(savingGoals.filter(g => g.id !== id));
    }
  };

  const editGoal = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalTarget(goal.targetAmount.toString());
    setGoalCurrent(goal.currentAmount.toString());
    setGoalDeadline(goal.deadline);
    setGoalIcon(goal.icon);
    setShowGoalForm(true);
  };

  const calculateGoalProgress = (goal: SavingGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMonthlyTarget = (goal: SavingGoal) => {
    const daysLeft = calculateDaysLeft(goal.deadline);
    const monthsLeft = Math.max(daysLeft / 30, 0.1);
    const remaining = goal.targetAmount - goal.currentAmount;
    const rawTarget = remaining / monthsLeft;
    // Round up to nearest thousand
    return Math.ceil(rawTarget / 1000) * 1000;
  };

  const calculateDailyTarget = (goal: SavingGoal) => {
    const rawDaily = calculateMonthlyTarget(goal) / 30;
    // Round up to nearest thousand
    return Math.ceil(rawDaily / 1000) * 1000;
  };

  const calculateExtraSavings = (goal: SavingGoal) => {
    const daysLeft = calculateDaysLeft(goal.deadline);
    const monthsLeft = Math.max(daysLeft / 30, 0.1);
    const remaining = goal.targetAmount - goal.currentAmount;
    
    // Raw calculations
    const rawMonthly = remaining / monthsLeft;
    const rawDaily = rawMonthly / 30;
    
    // Rounded calculations
    const roundedMonthly = Math.ceil(rawMonthly / 1000) * 1000;
    const roundedDaily = Math.ceil(rawDaily / 1000) * 1000;
    
    // Extra amounts
    const extraMonthly = roundedMonthly - rawMonthly;
    const extraDaily = roundedDaily - rawDaily;
    
    // Total extra if saved consistently
    const totalExtraMonthly = extraMonthly * monthsLeft;
    const totalExtraDaily = extraDaily * daysLeft;
    
    return {
      extraMonthly,
      extraDaily,
      totalExtraMonthly,
      totalExtraDaily,
    };
  };

  const getGoalIcon = (iconId: string) => {
    const iconData = GOAL_ICONS.find(i => i.id === iconId);
    return iconData || GOAL_ICONS[GOAL_ICONS.length - 1];
  };

  // Filter expenses by period
  const getFilteredExpenses = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      switch (filterPeriod) {
        case 'today':
          return expenseDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return expenseDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return expenseDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalSpending = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const spendingByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Today's stats
  const todayExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const today = new Date();
    return expenseDate.toDateString() === today.toDateString();
  });
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <SpendSmartSkeleton />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header - Mobile First */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <Wallet className="w-9 h-9 sm:w-10 sm:h-10 text-amber-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">Spend Smart</h1>
            </div>
            <div className="flex gap-2.5">
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/spend-smart/analytics"
                className="flex-1 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 active:bg-emerald-100 lg:hover:bg-emerald-100 transition border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-emerald-300 flex items-center gap-2 justify-center touch-manipulation"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistics</span>
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/"
                className="flex-1 rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700 active:bg-stone-200 lg:hover:bg-stone-200 transition border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 flex items-center gap-2 justify-center touch-manipulation"
              >
                <Home className="w-4 h-4" />
                <span>Kembali</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Stats - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-amber-500 to-amber-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-amber-700 p-5 sm:p-6"
            >
              <DollarSign className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-3xl sm:text-4xl font-bold mb-2">{formatMoney(todayTotal)}</div>
              <div className="text-sm sm:text-base opacity-90 font-medium">Pengeluaran Hari Ini</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-linear-to-br from-sky-500 to-sky-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-sky-700 p-5 sm:p-6"
            >
              <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-3xl sm:text-4xl font-bold mb-2">{formatMoney(totalSpending)}</div>
              <div className="text-sm sm:text-base opacity-90 font-medium">
                {filterPeriod === 'today' ? 'Hari Ini' : filterPeriod === 'week' ? '7 Hari' : filterPeriod === 'month' ? '30 Hari' : 'Total'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-emerald-700 p-5 sm:p-6"
            >
              <Calendar className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-3xl sm:text-4xl font-bold mb-2">{filteredExpenses.length}</div>
              <div className="text-sm sm:text-base opacity-90 font-medium">Transaksi</div>
            </motion.div>
          </div>

          {/* Add Button & Filters - Mobile First */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="w-full rounded-xl bg-amber-600 px-6 py-4 text-base font-bold text-white active:bg-amber-700 lg:hover:bg-amber-700 transition border-t border-l border-r-[6px] border-b-[6px] border-amber-700 flex items-center gap-2 justify-center touch-manipulation"
            >
              <Plus className="w-5 h-5" />
              Tambah Pengeluaran
            </motion.button>
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'today', 'week', 'month'] as const).map((period) => (
                <motion.button
                  key={period}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterPeriod(period)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 transition whitespace-nowrap touch-manipulation ${
                    filterPeriod === period
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-stone-700 active:bg-stone-100'
                  }`}
                >
                  {period === 'all' ? 'Semua' : period === 'today' ? 'Hari Ini' : period === 'week' ? '7 Hari' : '30 Hari'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add Form Modal - Mobile First */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8 max-w-md w-full"
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">Tambah Pengeluaran</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-3 active:bg-stone-100 lg:hover:bg-stone-100 rounded-xl transition touch-manipulation"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Amount */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Jumlah (Rp)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="50000"
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white touch-manipulation"
                        autoFocus
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Kategori
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {CATEGORIES.map((cat) => (
                          <motion.button
                            key={cat.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 transition touch-manipulation ${
                              category === cat.id
                                ? `${cat.color} text-white`
                                : 'bg-white text-stone-700 active:bg-stone-100 lg:hover:bg-stone-100'
                            }`}
                          >
                            <cat.icon className="w-5 h-5" />
                            <span className="text-sm">{cat.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Catatan (opsional)
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Makan siang..."
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white touch-manipulation"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white touch-manipulation"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={addExpense}
                      className="w-full rounded-xl bg-amber-600 px-6 py-4 text-base font-bold text-white active:bg-amber-700 lg:hover:bg-amber-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
                    >
                      Simpan
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goal Form Modal */}
          <AnimatePresence>
            {showGoalForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">
                      {editingGoal ? 'Edit Saving Goal' : 'Tambah Saving Goal'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowGoalForm(false);
                        setEditingGoal(null);
                      }}
                      className="p-3 active:bg-stone-100 lg:hover:bg-stone-100 rounded-xl transition touch-manipulation"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Goal Name */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Nama Goal
                      </label>
                      <input
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Beli iPhone 16 Pro"
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white touch-manipulation"
                        autoFocus
                      />
                    </div>

                    {/* Target Amount */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Target Amount (Rp)
                      </label>
                      <input
                        type="number"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        placeholder="15000000"
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white touch-manipulation"
                      />
                    </div>

                    {/* Current Amount */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Sudah Terkumpul (Rp)
                      </label>
                      <input
                        type="number"
                        value={goalCurrent}
                        onChange={(e) => setGoalCurrent(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white touch-manipulation"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Target Deadline
                      </label>
                      <input
                        type="date"
                        value={goalDeadline}
                        onChange={(e) => setGoalDeadline(e.target.value)}
                        className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white touch-manipulation"
                      />
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block text-base font-bold text-stone-700 mb-3">
                        Pilih Icon
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {GOAL_ICONS.map((iconData) => {
                          const IconComponent = iconData.icon;
                          return (
                            <motion.button
                              key={iconData.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setGoalIcon(iconData.id)}
                              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl font-bold border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 transition touch-manipulation ${
                                goalIcon === iconData.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-stone-700 active:bg-stone-100 lg:hover:bg-stone-100'
                              }`}
                            >
                              <IconComponent className="w-6 h-6" />
                              <span className="text-xs">{iconData.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Calculation Preview */}
                    {goalTarget && goalDeadline && (
                      <div className="bg-green-50 rounded-xl border-2 border-green-200 p-4">
                        <div className="text-sm font-bold text-green-800 mb-3">💡 Target Saving (Dibulatkan):</div>
                        <div className="space-y-2">
                          {(() => {
                            const daysLeft = calculateDaysLeft(goalDeadline);
                            const monthsLeft = Math.max(daysLeft / 30, 0.1);
                            const remaining = parseFloat(goalTarget) - (parseFloat(goalCurrent) || 0);
                            const rawMonthly = remaining / monthsLeft;
                            const rawDaily = rawMonthly / 30;
                            const roundedMonthly = Math.ceil(rawMonthly / 1000) * 1000;
                            const roundedDaily = Math.ceil(rawDaily / 1000) * 1000;
                            const extraMonthly = roundedMonthly - rawMonthly;
                            const extraDaily = roundedDaily - rawDaily;
                            
                            return (
                              <>
                                <div className="text-sm text-emerald-700">
                                  <div className="font-bold mb-1">Per Bulan: {formatMoney(roundedMonthly)}</div>
                                  {extraMonthly > 0 && (
                                    <div className="text-xs text-blue-600 ml-4">
                                      ↳ Lebih {formatMoney(extraMonthly)} dari target asli
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-emerald-700">
                                  <div className="font-bold mb-1">Per Hari: {formatMoney(roundedDaily)}</div>
                                  {extraDaily > 0 && (
                                    <div className="text-xs text-blue-600 ml-4">
                                      ↳ Lebih {formatMoney(extraDaily)} dari target asli
                                    </div>
                                  )}
                                </div>
                                {(extraMonthly > 0 || extraDaily > 0) && (
                                  <div className="pt-2 mt-2 border-t border-green-300 text-xs text-blue-700">
                                    <span className="font-bold">Bonus Total:</span> +{formatMoney(Math.max(extraMonthly * monthsLeft, extraDaily * daysLeft))}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={addOrUpdateGoal}
                      className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white active:bg-emerald-700 lg:hover:bg-emerald-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 touch-manipulation"
                    >
                      {editingGoal ? 'Update Goal' : 'Buat Goal'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saving Goals Section */}
          {savingGoals.filter(g => g.status === 'active').length > 0 && (
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">
                    Saving Goals ({savingGoals.filter(g => g.status === 'active').length})
                  </h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingGoal(null);
                    setGoalName('');
                    setGoalTarget('');
                    setGoalCurrent('');
                    setGoalDeadline('');
                    setGoalIcon('target');
                    setShowGoalForm(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white active:bg-emerald-700 lg:hover:bg-emerald-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 flex items-center gap-2 touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {savingGoals
                  .filter(goal => goal.status === 'active')
                  .map((goal) => {
                    const IconComponent = getGoalIcon(goal.icon).icon;
                    const progress = calculateGoalProgress(goal);
                    const daysLeft = calculateDaysLeft(goal.deadline);
                    const monthlyTarget = calculateMonthlyTarget(goal);
                    const dailyTarget = calculateDailyTarget(goal);
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const extraSavings = calculateExtraSavings(goal);

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl border-2 border-stone-300">
                              <IconComponent className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-stone-800">{goal.name}</h3>
                              <div className="text-sm text-stone-600">
                                {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Deadline terlewat'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editGoal(goal)}
                              className="p-2 rounded-lg active:bg-stone-100 lg:hover:bg-stone-100 transition touch-manipulation"
                            >
                              <Edit className="w-5 h-5 text-stone-600" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-2 rounded-lg active:bg-red-50 lg:hover:bg-red-50 transition touch-manipulation"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-stone-700">{Math.round(progress)}%</span>
                            <span className="text-sm text-stone-600">{formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-stone-300">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-600">Sisa:</span>
                            <span className="font-bold text-stone-800">{formatMoney(remaining)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-600">Target/Bulan:</span>
                            <span className="font-bold text-green-600">{formatMoney(monthlyTarget)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-600">Target/Hari:</span>
                            <span className="font-bold text-green-600">{formatMoney(dailyTarget)}</span>
                          </div>
                        </div>

                        {/* Extra Savings Info */}
                        {(extraSavings.extraMonthly > 0 || extraSavings.extraDaily > 0) && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="text-xs font-bold text-blue-800 mb-2">💡 Bonus Savings:</div>
                            <div className="space-y-1 text-xs text-blue-700">
                              {extraSavings.extraMonthly > 0 && (
                                <div>Bulanan: <span className="font-bold">+{formatMoney(extraSavings.extraMonthly)}</span> lebih</div>
                              )}
                              {extraSavings.extraDaily > 0 && (
                                <div>Harian: <span className="font-bold">+{formatMoney(extraSavings.extraDaily)}</span> lebih</div>
                              )}
                              <div className="pt-1 mt-1 border-t border-blue-300">
                                Total Bonus: <span className="font-bold text-blue-900">+{formatMoney(Math.max(extraSavings.totalExtraMonthly, extraSavings.totalExtraDaily))}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="mt-4 pt-4 border-t-2 border-gray-200">
                          {progress >= 100 ? (
                            <div className="bg-green-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-bold text-center border-2 border-green-300">
                              🎉 Goal Tercapai!
                            </div>
                          ) : daysLeft <= 0 ? (
                            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold text-center border-2 border-red-300">
                              ⚠️ Deadline Terlewat
                            </div>
                          ) : progress >= 50 ? (
                            <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold text-center border-2 border-blue-300">
                              ✅ On Track
                            </div>
                          ) : (
                            <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-bold text-center border-2 border-yellow-300">
                              💪 Keep Going!
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Add Goal Button (when no goals) */}
          {savingGoals.filter(g => g.status === 'active').length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-8 text-center mb-6 sm:mb-8"
            >
              <Target className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2">
                Belum Ada Saving Goal
              </h3>
              <p className="text-stone-600 mb-5">
                Mulai rencanakan target keuangan kamu!
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGoalForm(true)}
                className="rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white active:bg-emerald-700 lg:hover:bg-emerald-700 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 inline-flex items-center gap-2 touch-manipulation"
              >
                <Plus className="w-5 h-5" />
                Buat Saving Goal Pertama
              </motion.button>
            </motion.div>
          )}

          {/* Expenses List - Mobile First */}
          <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-5">
              Riwayat Pengeluaran
            </h2>
            
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800">
                <Wallet className="w-20 h-20 text-gray-300 mx-auto mb-5" />
                <p className="text-base text-stone-600 font-medium">
                  Belum ada pengeluaran tercatat
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredExpenses.map((expense) => {
                  const catInfo = getCategoryInfo(expense.category);
                  const CategoryIcon = catInfo.icon;
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 flex items-start gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`${catInfo.color} p-3 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-base text-stone-800">{catInfo.name}</span>
                            <span className="text-sm text-stone-500">
                              {new Date(expense.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                          {expense.note && (
                            <p className="text-sm text-stone-600 mb-2">{expense.note}</p>
                          )}
                          <div className="font-bold text-xl text-stone-900">
                            {formatMoney(expense.amount)}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteExpense(expense.id)}
                        className="p-3 active:bg-red-100 lg:hover:bg-red-100 rounded-xl transition text-red-500 touch-manipulation"
                      >
                        <Trash2 className="w-6 h-6" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Category Summary */}
          {/* Category Summary - Mobile First */}
          {filteredExpenses.length > 0 && (
            <div className="bg-stone-50 mt-5 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-5 sm:p-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-5">
                Pengeluaran per Kategori
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {Object.entries(spendingByCategory).map(([catId, amount]) => {
                  const catInfo = getCategoryInfo(catId);
                  const CategoryIcon = catInfo.icon;
                  const percentage = (amount / totalSpending) * 100;
                  
                  return (
                    <div
                      key={catId}
                      className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`${catInfo.color} p-2.5 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800`}>
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-stone-800">{catInfo.name}</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                        {formatMoney(amount)}
                      </div>
                      <div className="text-sm text-stone-600 font-medium">
                        {percentage.toFixed(0)}% dari total
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}


