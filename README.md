# ClarityHub

**The hub for your daily clarity**

ClarityHub is a comprehensive productivity application that helps you focus deeply, organize tasks, and track spending—all in one beautiful, distraction-free hub.

## Features

### DeepWork

- **Pomodoro Timer**: 25-minute focused work sessions
- **Smart Breaks**: Automatic short (5/10/15 min) and long breaks (15/20/30 min)
- **Cycle Tracking**: 4-cycle Pomodoro system with daily counter
- **Session History**: Track all completed focus sessions
- **Statistics**: Comprehensive analytics of your deep work sessions

### Todo List

- **Task Management**: Create, complete, and delete tasks
- **Filter System**: View all, active, or completed tasks
- **Local Storage**: All data saved locally, no server needed
- **Clean Interface**: Distraction-free task management

### SpendSmart

- **Expense Tracking**: Record daily expenses with categories
- **7 Categories**: Food, Transport, Shopping, Entertainment, Bills, Health, Other
- **Period Filters**: View expenses by today, week, or month
- **Analytics Dashboard**: Visual insights with charts and trends
- **Category Breakdown**: See spending distribution by category
- **Top Expenses**: Track your biggest transactions

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: localStorage (100% offline)

## Project Structure

```
clarityhub/
├── app/              # Routes & Next.js special files
├── assets/           # Styles & images
├── components/       # Reusable components
├── lib/              # Utilities & types
└── public/           # Static files
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure documentation.

## Key Features

- **100% Offline** - All data stored locally
- **No Server Required** - Works completely client-side
- **Privacy First** - Your data never leaves your device
- **Modern UI** - Clean, beautiful interface with smooth animations
- **Responsive** - Works on desktop, tablet, and mobile
- **Type-Safe** - Built with TypeScript for reliability

## Design Philosophy

ClarityHub follows a consistent design system:

- **Thick Borders**: Bold 6-10px borders for visual clarity
- **Rounded Corners**: Modern, friendly appearance
- **Color Themes**: Purple (DeepWork), Blue (Todo), Orange (SpendSmart), Green (Statistics)
- **Smooth Animations**: Framer Motion for delightful interactions

# Project Structure

## Overview

Clean & organized structure with **root-level separation**. The `app/` directory focuses **purely on routes**, while components and utilities live at root level.

## Directory Structure

```
productivity-app/
│
├── app/                    # ROUTES & LAYOUTS ONLY
│   ├── deep-work/
│   │   ├── page.tsx       # DeepWork timer page
│   │   └── statistics/
│   │       └── page.tsx   # DeepWork statistics
│   ├── spend-smart/
│   │   ├── page.tsx       # Expense tracker
│   │   └── analytics/
│   │       └── page.tsx   # Spending analytics
│   ├── to-do-list/
│   │   └── page.tsx       # Todo list
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
│
├── assets/                 # ASSETS (Root Level)
│   ├── styles/
│   │   └── globals.css    # Global CSS
│   └── images/
│       └── favicon.ico    # Favicon source
│
├── components/             # REUSABLE COMPONENTS (Root Level)
│   ├── layout/
│   │   ├── CookieBanner.tsx
│   │   ├── FloatingTimer.tsx
│   │   ├── Footer.tsx
│   │   ├── PageTransition.tsx
│   │   └── index.ts       # Barrel export
│   └── ui/
│       ├── Button.tsx     # Standardized button
│       ├── Card.tsx       # Card components
│       ├── Modal.tsx      # Modal wrapper
│       ├── SkeletonLoader.tsx
│       └── index.ts       # Barrel export
│
├── lib/                    # UTILITIES & CONSTANTS (Root Level)
│   ├── constants.ts        # Categories, storage keys, durations
│   ├── types.ts            # TypeScript interfaces
│   ├── index.ts            # Barrel export
│   └── utils/
│       ├── formatters.ts   # formatTime, formatMoney, formatDate
│       └── storage.ts      # Type-safe localStorage helpers
│
├── public/                 # Static assets (served by Next.js)
│   └── assets/
│       └── images/
│           └── favicon.ico
│
├── node_modules/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Why This Structure?

### **Clear Separation**

- `app/` = Routes only (clean & focused)
- `components/` = All UI components
- `lib/` = All utilities & types

### **Better Organization**

- No mixing routes with components
- Easy to navigate
- Scalable structure

### **Next.js Best Practice**

- Follows App Router conventions
- Root-level `components/` and `lib/` are supported
- Clean import paths with `@/` alias

## Import Guidelines

### Components

```typescript
// Layout components
import { PageTransition, FloatingTimer } from '@/components/layout';

// UI components
import { Button, Card, Modal } from '@/components/ui';
```

### Utilities & Types

```typescript
// Formatters
import { formatTime, formatMoney, formatDate } from '@/lib/utils/formatters';

// Storage
import { getLocalStorage, setLocalStorage, STORAGE_KEYS } from '@/lib';

// Types
import { FocusSession, Expense, TodoItem } from '@/lib/types';

// Constants
import { EXPENSE_CATEGORIES, POMODORO_DURATIONS } from '@/lib/constants';
```

## Benefits

**Clean `app/` directory** - Only routes and layouts
**Easy to find** - Components in `components/`, utils in `lib/`
**No duplication** - Shared code centralized
**Type-safe** - TypeScript throughout
**Scalable** - Easy to add new features

## Folder Purposes

| Folder               | Purpose           | Contains                              |
| -------------------- | ----------------- | ------------------------------------- |
| `app/`               | Routes & Layouts  | Pages, layout.tsx, globals.css        |
| `components/layout/` | Layout components | PageTransition, FloatingTimer, Footer |
| `components/ui/`     | Reusable UI       | Button, Card, Modal, Skeleton         |
| `lib/`               | Utilities         | Types, constants, formatters, storage |
| `lib/utils/`         | Helper functions  | formatters.ts, storage.ts             |

## Example: Adding New Feature

1. **Create route** in `app/new-feature/page.tsx`
2. **Use components** from `@/components/ui`
3. **Use utilities** from `@/lib`
4. **Add types** to `lib/types.ts` if needed
5. **Add constants** to `lib/constants.ts` if needed

```typescript
// app/new-feature/page.tsx
import { PageTransition } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { formatTime, STORAGE_KEYS } from '@/lib';

export default function NewFeature() {
  // Your code here
}
```

Clean, simple, organized!

# PWA Implementation - ClarityHub

## ✅ Fitur PWA yang Telah Diimplementasikan

### 1. **Manifest File** (`/public/manifest.json`)

- ✅ App name, description, icons
- ✅ Display mode: standalone (full-screen app experience)
- ✅ Theme color & background color
- ✅ App shortcuts (Deep Work, Todo List, Spend Smart)
- ✅ Categories & language settings
- ✅ Screenshot placeholders

### 2. **Service Worker Configuration** (`next.config.ts`)

- ✅ Automatic service worker generation via `next-pwa`
- ✅ Caching strategies:
  - **CacheFirst**: Fonts, audio, video (long-term cache)
  - **StaleWhileRevalidate**: Images, CSS, JS, fonts
  - **NetworkFirst**: Pages, data, JSON
- ✅ Offline support dengan fallback
- ✅ Cache expiration policies

### 3. **Install Prompt Component** (`/components/layout/PWAInstallPrompt.tsx`)

- ✅ Custom install prompt dengan UI yang branded
- ✅ Auto-show setelah 3 detik page load
- ✅ Smart dismissal (jangan show lagi selama 7 hari)
- ✅ Deteksi jika sudah terinstall
- ✅ Mobile-first design dengan animasi

### 4. **Offline Fallback** (`/public/offline.html`)

- ✅ Custom offline page
- ✅ List fitur yang tersedia offline
- ✅ Try again button
- ✅ Branded design

### 5. **Metadata & SEO**

- ✅ Apple mobile web app tags
- ✅ Apple touch icons
- ✅ Web app manifest link
- ✅ PWA-friendly meta tags

## 📱 Cara Testing PWA

### Development Mode

```bash
npm run dev
```

**Note**: Service worker disabled di development mode secara default.

### Production Build

```bash
npm run build
npm start
```

### Testing Checklist

#### Desktop (Chrome/Edge)

1. Buka aplikasi di browser
2. Cek Chrome DevTools → Application → Manifest
3. Cek Service Workers tab
4. Klik install icon di address bar (jika muncul)
5. Test offline: DevTools → Network → Offline

#### Mobile

1. Buka di Chrome/Safari mobile
2. Tunggu install prompt muncul (3 detik)
3. Atau gunakan browser menu → "Add to Home Screen"
4. Buka dari home screen untuk test standalone mode
5. Test offline: Airplane mode

## 🎯 PWA Features

### Online Features

- ✅ Full application functionality
- ✅ Real-time data sync
- ✅ All interactive features

### Offline Features

- ✅ Cached pages tetap accessible
- ✅ Previously loaded data tersimpan
- ✅ Deep Work timer (local storage)
- ✅ Todo items (local storage)
- ✅ Expense tracker (local storage)
- ✅ Custom offline page

### App-like Experience

- ✅ Standalone mode (no browser UI)
- ✅ Fast loading (cached assets)
- ✅ App shortcuts
- ✅ Custom install prompt
- ✅ Splash screen support

## 🔧 Configuration Details

### Cache Duration

- **Static Assets**: 24 hours
- **Fonts**: 365 days
- **Images**: 24 hours
- **Pages**: 24 hours

### Cache Limits

- **Images**: 64 entries
- **JS/CSS**: 32 entries
- **Pages**: 32 entries

## 📦 Required Assets

### Icons (Belum dibuat - perlu generate)

Lokasi: `/public/icons/`

Ukuran yang dibutuhkan:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Generate icons**: Lihat `/public/icons/README.md`

### Screenshots (Optional)

- `/public/screenshots/home.png` (1280x720)
- `/public/screenshots/mobile.png` (750x1334)

## 🚀 Next Steps

1. **Generate Icons**

   - Gunakan `pwa-asset-generator` atau online tools
   - Lihat guide di `/public/icons/README.md`

2. **Add Screenshots**

   - Screenshot homepage (desktop)
   - Screenshot mobile view
   - Untuk app stores & PWA installation

3. **Test Extensively**

   - Test di berbagai devices
   - Test online/offline transitions
   - Test install/uninstall flow

4. **Optimize**
   - Monitor cache size
   - Adjust cache duration based on usage
   - Update service worker strategies if needed

## 📊 PWA Audit

Run Lighthouse audit untuk check PWA score:

1. Chrome DevTools → Lighthouse
2. Select "Progressive Web App"
3. Generate report
4. Target: 90+ score

## ⚠️ Known Limitations

- Service worker tidak aktif di development mode
- Icons placeholder (SVG) - perlu generate PNG versions
- Screenshots belum ada - optional tapi recommended
- Local storage masih mock data - perlu database integration untuk production

## 🔗 Resources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## License

© 2025 ClarityHub. All rights reserved.
MIT License. See [LICENSE](LICENSE) for details.

---

**ClarityHub** - Clear mind, clear goals.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
