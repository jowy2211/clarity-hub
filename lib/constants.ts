import {
  Coffee,
  CreditCard,
  Package,
  ShoppingBag,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

/**
 * Expense category type
 */
export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

/**
 * Expense categories for SpendSmart
 */
export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Makanan', icon: Coffee, color: 'bg-orange-500' },
  { id: 'transport', name: 'Transport', icon: Zap, color: 'bg-blue-500' },
  { id: 'shopping', name: 'Belanja', icon: ShoppingBag, color: 'bg-pink-500' },
  {
    id: 'entertainment',
    name: 'Hiburan',
    icon: Sparkles,
    color: 'bg-purple-500',
  },
  { id: 'bills', name: 'Tagihan', icon: CreditCard, color: 'bg-red-500' },
  { id: 'health', name: 'Kesehatan', icon: Package, color: 'bg-green-500' },
  { id: 'other', name: 'Lainnya', icon: Wallet, color: 'bg-gray-500' },
];

/**
 * Get category info by ID
 */
export function getCategoryById(categoryId: string): Category {
  return (
    EXPENSE_CATEGORIES.find((c) => c.id === categoryId) ||
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}

/**
 * Pomodoro durations in minutes
 */
export const POMODORO_DURATIONS = [25, 45, 60, 90];

/**
 * Short break durations in minutes
 */
export const SHORT_BREAK_DURATIONS = [5, 10, 15];

/**
 * Long break durations in minutes
 */
export const LONG_BREAK_DURATIONS = [15, 20, 30];

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  ACTIVE_TIMER: 'active-timer',
  DEEPWORK_SESSIONS: 'deepwork-sessions',
  POMODORO_DATA: 'pomodoro-data',
  EXPENSES: 'expenses',
  TODOS: 'todos',
} as const;
