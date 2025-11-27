"use client";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const spring = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 };
  const fade = { duration: 0.12, ease: [0.25, 0.1, 0.25, 1] as const };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/30 backdrop-blur-[2px] z-90"
          />

          {/* Modal */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 28 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 28 }}
            transition={prefersReducedMotion ? fade : spring}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
          >
            <div className="bg-stone-50/95 backdrop-blur-sm rounded-lg border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-md transition"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </motion.button>
              </div>

              {/* Content */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

