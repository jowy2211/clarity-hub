import '@/assets/styles/globals.css';

import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
} from 'next/font/google';

import CookieBanner from '@/components/layout/CookieBanner';
import FloatingQuickNav from '@/components/layout/FloatingQuickNav';
import FloatingTimer from '@/components/layout/FloatingTimer';
import Footer from '@/components/layout/Footer';
import PWAInstallPrompt from '@/components/layout/PWAInstallPrompt';
import { PWAErrorBoundary } from '@/components/PWAErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClarityHub - The hub for your daily clarity",
  description: "Organize life, amplify focus. ClarityHub helps you focus deeply with Pomodoro timers, organize tasks effortlessly, and track spending smartly—all in one beautiful, distraction-free hub.",
  keywords: [
    'productivity app',
    'pomodoro timer',
    'todo list',
    'expense tracker',
    'focus timer',
    'task management',
    'time management',
    'budget tracker',
    'clarity',
    'deep work',
  ],
  authors: [{ name: 'ClarityHub' }],
  creator: 'ClarityHub',
  publisher: 'ClarityHub',
  robots: 'index, follow',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ClarityHub',
  },
  applicationName: 'ClarityHub',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://clarityhub.app',
    title: 'ClarityHub - The hub for your daily clarity',
    description: 'Focus deeply, organize tasks, track spending—all in one place',
    siteName: 'ClarityHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClarityHub - The hub for your daily clarity',
    description: 'Focus deeply, organize tasks, track spending—all in one place',
  },
  icons: {
    icon: '/assets/images/favicon.ico',
    apple: [
      { url: '/icons/icon-192x192.png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClarityHub" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAErrorBoundary>
          {children}
          <FloatingTimer />
          <FloatingQuickNav />
          <Footer />
          <CookieBanner />
          <PWAInstallPrompt />
        </PWAErrorBoundary>
      </body>
    </html>
  );
}
