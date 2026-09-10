import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin text-blue-600 ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    />
  );
};

export const Skeleton: React.FC<{
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}> = ({ className = '', width = 'w-full', height = 'h-4', rounded = 'rounded-md' }) => {
  return (
    <div
      className={`bg-slate-200/80 animate-pulse ${width} ${height} ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 space-y-3.5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton width="w-1/3" height="h-4" />
        <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
      </div>
      <Skeleton width="w-2/3" height="h-3" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} width="w-full" height="h-2.5" />
        ))}
      </div>
    </div>
  );
};

export const PageLoading: React.FC<{ label?: string }> = ({ label = 'Loading content...' }) => {
  return (
    <div className="space-y-6 py-4">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton width="w-48" height="h-7" />
        <Skeleton width="w-96" height="h-4" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard rows={3} />
        <SkeletonCard rows={3} />
        <SkeletonCard rows={3} />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-4">
        <Spinner size="sm" />
        <span>{label}</span>
      </div>
    </div>
  );
};
