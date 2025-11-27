"use client";
import { ReactNode } from 'react';

import {
  motion,
  useReducedMotion,
} from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  const spring = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 32,
    mass: 0.9,
  };

  const fadeOnly = {
    duration: 0.1,
    ease: [0.25, 0.1, 0.25, 1] as const,
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 6 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      transition={prefersReducedMotion ? fadeOnly : spring}
    >
      {children}
    </motion.div>
  );
}
