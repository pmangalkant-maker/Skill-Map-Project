import React from 'react';
import { BadgeVariant, BadgeSize } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  primary: {
    container: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-600',
  },
  success: {
    container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  warning: {
    container: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  danger: {
    container: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  neutral: {
    container: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
  outline: {
    container: 'bg-white text-slate-700 border-slate-300',
    dot: 'bg-slate-400',
  },
  // Compatibility aliases used by existing views. These intentionally
  // preserve the same visual language without changing the UI.
  info: {
    container: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-600',
  },
  error: {
    container: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1.5 rounded-md font-medium',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center border select-none whitespace-nowrap leading-none ${styles.container} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
