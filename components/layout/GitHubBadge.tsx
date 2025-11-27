'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function GitHubBadge() {
  return (
    <motion.a
      href="https://github.com/jowy2211/clarity-hub"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Github className="w-5 h-5" />
      <span className="font-medium text-sm hidden sm:inline">Star on GitHub</span>
    </motion.a>
  );
}
