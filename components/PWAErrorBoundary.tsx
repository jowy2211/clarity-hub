/**
 * PWA Error Boundary
 * Catches errors in PWA mode and prevents app crash
 */
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PWAErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PWA Error:', error, errorInfo);
    
    // Log to analytics or error tracking service if needed
    if (typeof window !== 'undefined') {
      // Check if running as PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      if (isPWA) {
        console.log('Error occurred in PWA mode');
      }
    }
  }

  handleReset = () => {
    // Clear potentially corrupted localStorage
    try {
      const keysToKeep = ['deepwork-sessions', 'pomodoro-data'];
      const backup: Record<string, string> = {};
      
      // Backup important data
      keysToKeep.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) backup[key] = value;
      });
      
      // Clear active timers that might be corrupted
      localStorage.removeItem('active-timer');
      localStorage.removeItem('active-break-timer');
      
      // Restore important data
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    } catch (error) {
      console.error('Failed to reset localStorage:', error);
    }
    
    // Reset error state
    this.setState({ hasError: false, error: null });
    
    // Reload page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 mb-4">
              Aplikasi mengalami error. Jangan khawatir, data Anda aman.
            </p>
            {this.state.error && (
              <details className="text-left bg-white p-3 rounded mb-4 text-xs text-gray-700">
                <summary className="cursor-pointer font-semibold mb-2">
                  Detail Error
                </summary>
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Reset & Kembali ke Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
