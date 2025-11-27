"use client";
import { useState } from 'react';

import {
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import {
  Brain,
  CheckSquare,
  Home,
  Wallet,
} from 'lucide-react';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

export default function FloatingQuickNav() {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  // Draggable position (persist across sessions)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Load/save position
  useState(() => {
    try {
      const raw = localStorage.getItem('floating-quick-nav-pos');
      if (raw) {
        const pos = JSON.parse(raw);
        if (typeof pos.x === 'number') x.set(pos.x);
        if (typeof pos.y === 'number') y.set(pos.y);
      }
    } catch {}
    return undefined;
  });

  // Hide on homepage
  if (pathname === '/') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Fixed button only (no drag), allow interactions only on the button/menu */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="absolute bottom-10 left-5 pointer-events-auto"
      >
        {/* Main FAB */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Quick Navigation"
          className="w-14 h-14 bg-stone-100 text-stone-700 rounded-lg border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 shadow-lg flex items-center justify-center"
        >
          {open ? (
            <span className="font-extrabold text-xl">×</span>
          ) : (
            <Home className="w-6 h-6" />
          )}
        </motion.button>

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={open ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
          transition={prefersReducedMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 30 }}
          className="absolute bottom-16 left-0 bg-stone-50/95 backdrop-blur-sm rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-3 shadow-lg"
        >
          <div className="flex flex-col gap-2 min-w-[180px]">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { router.push('/'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-5 rounded-lg bg-stone-100 border border-stone-300 text-stone-700"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-bold">Home</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { router.push('/deep-work'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-5 rounded-lg bg-violet-50 border border-violet-300 text-violet-800"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-bold">Deep Work</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { router.push('/to-do-list'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-5 rounded-lg bg-sky-50 border border-sky-300 text-sky-800"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="text-sm font-bold">Todo List</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { router.push('/spend-smart'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-bold">SpendSmart</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

