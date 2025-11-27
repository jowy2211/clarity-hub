"use client";
import { motion } from 'framer-motion';

// Todo Item Skeleton
export function TodoItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-4 bg-stone-100"
    >
      <div className="h-6 w-6 rounded bg-gray-300 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 shrink-0">
        <div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
        <div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );
}

export function TodoListSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <TodoItemSkeleton />
      <TodoItemSkeleton />
      <TodoItemSkeleton />
      <TodoItemSkeleton />
    </div>
  );
}

// Homepage Skeleton
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto py-6 sm:py-10 lg:py-16">
        {/* Header Skeleton */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 border-4 border-stone-800 mb-5 sm:mb-7 animate-pulse" />
          <div className="h-14 sm:h-16 lg:h-20 w-80 sm:w-96 bg-gray-200 rounded-xl mb-4 sm:mb-5 animate-pulse mx-auto" />
          <div className="h-6 sm:h-7 lg:h-8 w-96 sm:w-[500px] bg-gray-200 rounded-xl animate-pulse mx-auto" />
        </div>

        {/* Feature Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-stone-100 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8">
              <div className="flex items-center gap-4 mb-5 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-300 rounded-xl border-2 border-stone-800 animate-pulse" />
                <div className="h-8 sm:h-9 w-40 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse mb-5 sm:mb-6" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg border-2 border-stone-800 animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg border-2 border-stone-800 animate-pulse" />
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg border-2 border-stone-800 animate-pulse" />
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="mt-6 h-14 w-full bg-gray-300 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Footer Info Skeleton */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-stone-100 px-6 py-4 rounded-full border-2 border-stone-800">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// DeepWork Page Skeleton
export function DeepWorkSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans p-4 pb-24 lg:pb-20">
      <main className="flex flex-col lg:flex-row h-full w-full max-w-6xl mx-auto gap-5 lg:gap-6">
        {/* Main Timer Section Skeleton */}
        <div className="flex-1 flex flex-col bg-stone-50 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse" />
              <div className="h-9 sm:h-10 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2.5">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
            </div>
          </div>

          {/* Setup Form Skeleton */}
          <div className="flex-1 flex flex-col justify-center gap-5 sm:gap-6 py-4">
            <div className="px-4">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-14 w-full bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
            </div>

            <div className="px-4">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-14 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                <div className="h-14 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                <div className="h-14 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
              </div>
            </div>

            <div className="mx-4 h-16 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
          </div>
        </div>

        {/* History Sidebar Skeleton */}
        <div className="w-full lg:w-80 flex flex-col bg-stone-50 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 max-h-[400px] lg:max-h-full">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="space-y-3 overflow-y-auto flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Statistics Page Skeleton
export function StatisticsSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-9 sm:h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full sm:w-48 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-stone-100 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-56 sm:h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
            <div className="h-7 w-36 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Activities Skeleton */}
        <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SpendSmart Page Skeleton
export function SpendSmartSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-9 sm:h-10 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
            <div className="flex-1 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-stone-100 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Add & Filter Buttons Skeleton */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="h-14 w-full bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-28 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse shrink-0" />
            ))}
          </div>
        </div>

        {/* Expense List Skeleton */}
        <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="h-7 sm:h-8 w-48 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 flex items-start gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Summary Skeleton */}
        <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
          <div className="h-7 sm:h-8 w-52 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-7 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Page Skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-9 sm:h-10 w-56 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full sm:w-48 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-stone-100 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-10 w-28 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-56 sm:h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
            <div className="h-7 w-44 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-56 sm:h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Top Spending Categories Skeleton */}
        <div className="bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-5 sm:p-6">
          <div className="h-7 sm:h-8 w-56 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


