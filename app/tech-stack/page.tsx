"use client";
import { motion } from 'framer-motion';
import {
  Box,
  Brain,
  CheckSquare,
  Code,
  Cpu,
  Database,
  FileCode,
  Layers,
  Lock,
  Package,
  Palette,
  Server,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

import PageTransition from '@/components/layout/PageTransition';

interface TechItem {
  name: string;
  version: string;
  description: string;
  icon: any;
  category: string;
}

export default function TechStack() {
  const techStack: TechItem[] = [
    // Core Framework
    {
      name: 'Node.js',
      version: '22.15.0',
      description: 'JavaScript runtime environment',
      icon: Server,
      category: 'Runtime',
    },
    {
      name: 'Next.js',
      version: '16.0.4',
      description: 'React framework dengan App Router',
      icon: Layers,
      category: 'Framework',
    },
    {
      name: 'React',
      version: '19.2.0',
      description: 'Library UI untuk membangun interface',
      icon: Code,
      category: 'Framework',
    },
    {
      name: 'TypeScript',
      version: '^5',
      description: 'Typed superset of JavaScript',
      icon: FileCode,
      category: 'Language',
    },
    
    // Styling
    {
      name: 'Tailwind CSS',
      version: '^4',
      description: 'Utility-first CSS framework',
      icon: Palette,
      category: 'Styling',
    },
    {
      name: 'Framer Motion',
      version: '12.23.24',
      description: 'Animation library untuk React',
      icon: Zap,
      category: 'Animation',
    },
    
    // Icons & UI
    {
      name: 'Lucide React',
      version: '0.554.0',
      description: 'Beautiful & consistent icon toolkit',
      icon: Box,
      category: 'UI',
    },
    
    // PWA
    {
      name: 'next-pwa',
      version: '5.6.0',
      description: 'Progressive Web App support untuk Next.js',
      icon: Smartphone,
      category: 'PWA',
    },
    
    // Storage
    {
      name: 'LocalStorage API',
      version: 'Browser Native',
      description: 'Penyimpanan data lokal di browser',
      icon: Database,
      category: 'Storage',
    },
    {
      name: 'Service Worker',
      version: 'Browser Native',
      description: 'Background sync & offline support',
      icon: Cpu,
      category: 'PWA',
    },
  ];

  const categories = [...new Set(techStack.map(tech => tech.category))];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-10 lg:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 sm:mb-14"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-800 mb-4 tracking-tight">
              Tech Stack
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl">
              Teknologi modern yang digunakan untuk membangun ClarityHub - aplikasi produktivitas PWA yang cepat, aman, dan privat.
            </p>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-linear-to-br from-violet-50/80 via-violet-50/40 to-white/40 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-3 bg-sky-600 rounded-xl border border-sky-700">
                <Package className="w-7 h-7 text-white" />
              </div>
              Informasi Aplikasi
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Nama Aplikasi</h3>
                <p className="text-stone-600">ClarityHub</p>
              </div>
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Versi</h3>
                <p className="text-stone-600">0.1.0</p>
              </div>
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Deskripsi</h3>
                <p className="text-stone-600">The hub for your daily clarity - Focus deeply, organize tasks, track spending</p>
              </div>
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Tipe</h3>
                <p className="text-stone-600">Progressive Web App (PWA)</p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack by Category */}
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.05 }}
              className="mb-10 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-6">
                {category}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {techStack
                  .filter(tech => tech.category === category)
                  .map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-6 sm:p-7 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-sky-600 rounded-xl border border-sky-700 shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-stone-800 text-lg mb-1">
                              {tech.name}
                            </h3>
                            <p className="text-sm font-mono text-sky-600 font-bold mb-3">
                              v{tech.version}
                            </p>
                            <p className="text-sm text-stone-600 leading-relaxed">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          ))}

          {/* Features Built */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-linear-to-br from-sky-50/80 via-sky-50/40 to-white/40 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-3 bg-sky-600 rounded-xl border border-sky-700">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              Fitur yang Dibangun
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border-t border-l border-r-[6px] border-b-[6px] border-stone-300 p-6">
                <h3 className="font-black text-sky-600 text-lg mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Deep Work
                </h3>
                <ul className="text-sm text-stone-600 space-y-2 leading-relaxed">
                  <li>• Pomodoro Timer dengan break otomatis</li>
                  <li>• Background notifications via Service Worker</li>
                  <li>• Floating timer di semua halaman</li>
                  <li>• Statistik produktivitas</li>
                  <li>• PWA-safe audio & vibration</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl border-t border-l border-r-[6px] border-b-[6px] border-stone-300 p-6">
                <h3 className="font-black text-sky-600 text-lg mb-3 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  SpendSmart
                </h3>
                <ul className="text-sm text-stone-600 space-y-2 leading-relaxed">
                  <li>• Pencatatan pengeluaran harian</li>
                  <li>• Kategori kustom dengan icons</li>
                  <li>• Analytics & visualisasi data</li>
                  <li>• Filter berdasarkan periode</li>
                  <li>• Export data lokal</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl border-t border-l border-r-[6px] border-b-[6px] border-stone-300 p-6">
                <h3 className="font-black text-sky-600 text-lg mb-3 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  To-Do List
                </h3>
                <ul className="text-sm text-stone-600 space-y-2 leading-relaxed">
                  <li>• Manajemen tugas dengan kategori</li>
                  <li>• Priority & deadline tracking</li>
                  <li>• Quick actions</li>
                  <li>• Drag & drop (coming soon)</li>
                  <li>• Sync dengan Deep Work</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-linear-to-br from-emerald-50/80 via-emerald-50/40 to-white/40 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10 mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-xl border border-emerald-700">
                <Lock className="w-7 h-7 text-white" />
              </div>
              Privasi & Keamanan
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-stone-700 leading-relaxed">
              <p className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-xl shrink-0">✓</span>
                <span><strong className="font-black">100% Lokal:</strong> Semua data tersimpan di browser Anda menggunakan LocalStorage API</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-xl shrink-0">✓</span>
                <span><strong className="font-black">Zero Tracking:</strong> Tidak ada pengumpulan data anonim, tidak ada analytics pihak ketiga</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-xl shrink-0">✓</span>
                <span><strong className="font-black">Offline First:</strong> Service Worker memungkinkan aplikasi berjalan tanpa internet</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-xl shrink-0">✓</span>
                <span><strong className="font-black">Open Source Ready:</strong> Kode transparan dan dapat diaudit</span>
              </p>
            </div>
          </motion.div>

          {/* Developer Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-linear-to-br from-stone-50/80 via-stone-50/40 to-white/40 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 p-7 sm:p-8 lg:p-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-6">
              Developer
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-black text-stone-800 mb-2">Anjas Octaris</h3>
                <p className="text-stone-600 mb-4">Full Stack Developer & Creator of ClarityHub</p>
                <a
                  href="https://github.com/jowy2211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700 transition border-t border-l border-r-[6px] border-b-[6px] border-stone-900"
                >
                  <Code className="w-5 h-5" />
                  @jowy2211 on GitHub
                </a>
              </div>
              <div className="w-full sm:w-auto">
                <div className="bg-white rounded-xl border-t border-l border-r-[6px] border-b-[6px] border-stone-300 p-6">
                  <p className="text-sm text-stone-600 mb-2">GitHub Profile</p>
                  <a
                    href="https://github.com/jowy2211"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-mono text-sm break-all hover:underline"
                  >
                    github.com/jowy2211
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
