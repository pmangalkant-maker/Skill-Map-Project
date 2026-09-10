import React from 'react';

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValueText?: boolean;
  valueSuffix?: string;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  className?: string;
}

const variantFillStyles: Record<ProgressBarVariant, string> = {
  primary: 'bg-blue-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-500',
};

const sizeStyles: Record<ProgressBarSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValueText = false,
  valueSuffix = '%',
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  // Dynamic color selection if default primary is used but dynamic indicator is preferred
  const fillClass = variantFillStyles[variant];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || showValueText) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showValueText && (
            <span className="font-semibold text-slate-900 tabular-nums">
              {percentage}
              {valueSuffix}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full transition-all duration-300 rounded-full ${fillClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
