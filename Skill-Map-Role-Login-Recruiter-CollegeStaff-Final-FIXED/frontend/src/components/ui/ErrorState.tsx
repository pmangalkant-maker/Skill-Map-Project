import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X, RefreshCw } from 'lucide-react';
import { AlertVariant } from '../../types';
import { Button } from './Button';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig: Record<
  AlertVariant,
  { container: string; text: string; titleText: string; icon: React.ReactNode }
> = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    titleText: 'text-blue-900',
    text: 'text-blue-700',
    icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    titleText: 'text-emerald-900',
    text: 'text-emerald-700',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    titleText: 'text-amber-900',
    text: 'text-amber-700',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
  },
  error: {
    container: 'bg-rose-50 border-rose-200 text-rose-800',
    titleText: 'text-rose-900',
    text: 'text-rose-700',
    icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const config = alertConfig[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${config.container} ${className}`}
    >
      {config.icon}
      <div className="flex-1">
        {title && <h5 className={`font-semibold mb-0.5 ${config.titleText}`}>{title}</h5>}
        <div className={config.text}>{message}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 -mr-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const PageError: React.FC<PageErrorProps> = ({
  title = 'Unable to load information',
  message = 'We encountered a connection or data retrieval issue. Please try refreshing or verify your connectivity.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-rose-200 rounded-xl bg-rose-50/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-600 max-w-md mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
