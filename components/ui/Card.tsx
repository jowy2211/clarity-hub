"use client";
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'purple' | 'blue' | 'orange' | 'green';
  onClick?: () => void;
  hoverable?: boolean;
}

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  subLabel?: string;
  variant?: 'purple' | 'blue' | 'orange' | 'green' | 'red' | 'teal';
  delay?: number;
}

const variantStyles = {
  default: 'bg-stone-50',
  purple: 'bg-emerald-50',
  blue: 'bg-sky-50',
  orange: 'bg-amber-50',
  green: 'bg-emerald-50',
};

const statVariantStyles = {
  purple: 'bg-linear-to-br from-purple-500 to-purple-600',
  blue: 'bg-linear-to-br from-blue-500 to-blue-600',
  orange: 'bg-linear-to-br from-orange-500 to-orange-600',
  green: 'bg-linear-to-br from-green-500 to-green-600',
  red: 'bg-linear-to-br from-red-500 to-red-600',
  teal: 'bg-linear-to-br from-teal-500 to-teal-600',
};

export function Card({
  children,
  className = '',
  variant = 'default',
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border-t border-l border-r-8 border-b-8 border-stone-800 p-6
        ${variantStyles[variant]}
        ${hoverable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  value,
  label,
  subLabel,
  variant = 'purple',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        ${statVariantStyles[variant]}
        text-white rounded-lg
        border-t border-l border-r-8 border-b-8 border-stone-800
        p-6
      `}
    >
      <Icon className="w-8 h-8 mb-3 opacity-80" />
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
      {subLabel && <div className="text-xs opacity-75 mt-1">{subLabel}</div>}
    </motion.div>
  );
}


