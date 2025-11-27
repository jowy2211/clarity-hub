/**
 * Shared TypeScript interfaces and types
 */

/**
 * DeepWork Focus Session
 */
export interface FocusSession {
  id: number;
  meaning: string;
  duration: number;
  completedAt: string;
}

/**
 * Timer State
 */
export interface TimerState {
  meaning: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  endTime?: number;
}

/**
 * Break Timer State
 */
export interface BreakTimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isLongBreak: boolean;
  endTime?: number;
}

/**
 * Pomodoro Data
 */
export interface PomodoroData {
  date: string;
  cycleCount: number;
  dailyCount: number;
}

/**
 * Expense
 */
export interface Expense {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}

/**
 * Todo Item
 */
export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Daily Statistics
 */
export interface DailyStats {
  date: string;
  sessions: number;
  totalMinutes: number;
}

/**
 * Category Spending
 */
export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}
