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

## License

© 2025 ClarityHub. All rights reserved.

---

**ClarityHub** - Clear mind, clear goals.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
