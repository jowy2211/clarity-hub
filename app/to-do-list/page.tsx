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
  Brain,
  CheckSquare,
  Home,
  Inbox,
  Plus,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import PageTransition from '@/components/layout/PageTransition';
import { TodoListSkeleton } from '@/components/ui/SkeletonLoader';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  // Save todos to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isInitialized]);

  const addTodo = () => {
    if (newTodo.trim() === "") return;
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white font-sans p-4 pb-24 sm:pb-20">
        <main className="flex h-full w-full max-w-4xl mx-auto flex-col bg-stone-50 rounded-2xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 py-5 sm:py-6 px-5 sm:px-6">
          <section className="w-full flex flex-col h-full">
            {/* Header - Mobile First */}
            <div className="mb-5 flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-9 h-9 sm:w-10 sm:h-10 text-sky-600" />
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
                  Todo List
                </h1>
              </div>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/"
                className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-bold text-stone-700 active:bg-stone-200 lg:hover:bg-stone-200 transition border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 flex items-center gap-2 justify-center w-full sm:w-auto touch-manipulation"
              >
                <Home className="w-4 h-4" />
                Kembali
              </motion.a>
            </div>
          
            {/* Input untuk menambah todo - Mobile First */}
            <div className="mb-4 flex flex-col gap-3 shrink-0">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="Tulis tugas baru di sini..."
                maxLength={150}
                className="w-full rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800 px-5 py-4 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              <p className="text-xs text-stone-500 text-right">{newTodo.length}/150 karakter</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addTodo}
                className="w-full rounded-xl bg-sky-600 px-6 py-4 text-base text-white active:bg-sky-700 lg:hover:bg-sky-700 font-bold border-t border-l border-r-[6px] border-b-[6px] border-sky-700 transition flex items-center gap-2 justify-center touch-manipulation"
              >
                <Plus className="w-5 h-5" />
                Tambah Tugas
              </motion.button>
            </div>

            {/* Filter buttons - Mobile First */}
            <div className="mb-5 flex gap-2 shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("all")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 transition touch-manipulation ${
                  filter === "all"
                    ? "bg-sky-600 text-white border-sky-700"
                    : "bg-white text-stone-700 active:bg-stone-100"
                }`}
              >
                Semua ({todos.length})
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("active")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 transition touch-manipulation ${
                  filter === "active"
                    ? "bg-amber-400 text-amber-900 border-amber-500"
                    : "bg-white text-stone-700 active:bg-stone-100"
                }`}
              >
                Aktif ({activeCount})
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("completed")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 transition touch-manipulation ${
                  filter === "completed"
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : "bg-white text-stone-700 active:bg-stone-100"
                }`}
              >
                Selesai ({completedCount})
              </motion.button>
            </div>

            {/* Daftar todo - Mobile First */}
            <div className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-1">
              {isLoading ? (
                <TodoListSkeleton />
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredTodos.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0.8, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 bg-stone-50 rounded-xl border-t-2 border-l-2 border-r-8 border-b-8 border-stone-800"
                    >
                      <div className="flex justify-center mb-5">
                        <Inbox className="w-20 h-20 text-stone-300" />
                      </div>
                      <p className="text-base text-stone-600 font-medium px-4">
                        {todos.length === 0
                          ? "Belum ada tugas. Yuk tambahkan sekarang!"
                          : `Tidak ada tugas ${filter === "active" ? "aktif" : "selesai"}.`}
                      </p>
                    </motion.div>
                  ) : (
                    filteredTodos.map((todo, index) => (
                  <div className="relative">
                    {/* Delete background reveal */}
                    <div className="absolute inset-0 rounded-xl bg-red-50 flex items-center justify-end pr-4">
                      <div className="flex items-center gap-2 text-red-700 font-bold">
                        <Trash2 className="w-5 h-5" />
                        <span className="text-sm">Hapus</span>
                      </div>
                    </div>
                  <motion.div
                    key={todo.id}
                    layout="position"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    dragMomentum={true}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                    whileDrag={{ scale: 1.005 }}
                    style={{ willChange: 'transform' }}
                    onUpdate={(latest) => {
                      // latest.x available via motion style if set; simple pulse on threshold
                    }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 120) deleteTodo(todo.id);
                    }}
                    initial={{ opacity: 0.8, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-3 rounded-xl border-t-2 border-l-2 border-r-[6px] border-b-[6px] border-stone-800 p-4 transition touch-manipulation relative overflow-hidden ${
                      todo.completed 
                        ? "bg-linear-to-br from-emerald-50/80 to-white/60 backdrop-blur-sm" 
                        : "bg-white"
                    }`}
                  >
                    {todo.completed && (
                      <div className="absolute inset-0 bg-linear-to-br from-emerald-100/30 to-transparent opacity-40"></div>
                    )}
                    <div className="relative z-10 flex items-center gap-3 w-full">
                    {/* Checkbox - Mobile First */}
                    <motion.input
                      whileTap={{ scale: 1.2 }}
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-6 w-6 cursor-pointer accent-emerald-600 shrink-0 touch-manipulation"
                    />
                    
                    {/* Text with word break - Mobile First */}
                    <motion.span
                      animate={{
                        opacity: todo.completed ? 0.6 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`flex-1 text-base leading-relaxed wrap-break-word ${
                        todo.completed
                          ? "text-stone-500 line-through"
                          : "text-stone-800 font-medium"
                      }`}
                    >
                      {todo.text}
                    </motion.span>
                    
                    {/* Action Buttons - Icon Only */}
                    <div className="flex gap-2 shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/deep-work?meaning=${encodeURIComponent(todo.text)}`)}
                      className="text-emerald-700 active:text-emerald-800 lg:hover:text-emerald-800 p-2 rounded-lg active:bg-emerald-50 lg:hover:bg-emerald-50 transition border border-emerald-300 touch-manipulation"
                      title="Fokus pada tugas ini"
                    >
                      <Brain className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteTodo(todo.id)}
                      className="text-rose-600 active:text-rose-700 lg:hover:text-rose-700 p-2 rounded-lg active:bg-rose-50 lg:hover:bg-rose-50 transition border border-rose-300 touch-manipulation"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                    </div>
                    </div>
                  </motion.div>
                  </div>
                ))
              )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>
    </div>
    </PageTransition>
  );
}
