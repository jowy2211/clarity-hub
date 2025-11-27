import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 mt-1 bg-white border-t border-stone-800 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">
            © 2025 ClarityHub. Created with ❤️ & ☕.
          </p>
          <Link 
            href="/tech-stack"
            className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors hover:underline"
          >
            Tech Stack →
          </Link>
        </div>
      </div>
    </footer>
  );
}

