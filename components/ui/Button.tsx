"use client";
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'purple' | 'blue' | 'orange' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-stone-800 text-white hover:bg-stone-700',
  secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  purple: 'bg-emerald-600 text-white hover:bg-emerald-700',
  blue: 'bg-sky-600 text-white hover:bg-sky-700',
  orange: 'bg-amber-600 text-white hover:bg-amber-700',
  green: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        rounded-md font-bold transition
        border-t border-l border-r-[6px] border-b-[6px] border-stone-800
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

