import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLoading } from '../ui/LoadingState';
import { PageError } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';

export interface PageContainerProps {
  title: string;
  description?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  subtitle,
  badge,
  actions,
  children,
  emptyTitle = 'No records found',
  emptyDescription = 'There is currently no data to display for this view.',
}) => {
  const activeDescription = description || subtitle;
  const { demoState, setDemoState } = useApp();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {badge}
          </div>
          {activeDescription && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
              {activeDescription}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
      </div>

      {/* Main Content with State Handling */}
      {demoState === 'loading' ? (
        <PageLoading label="Rendering view foundation & metrics..." />
      ) : demoState === 'error' ? (
        <PageError
          title={`Unable to load ${title}`}
          message="Demonstration error state: The system could not fetch remote skill mapping records. Test the retry action below."
          onRetry={() => setDemoState('normal')}
        />
      ) : demoState === 'empty' ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel="Reset to Standard View"
          onAction={() => setDemoState('normal')}
        />
      ) : (
        <div className="animate-in fade-in duration-200">{children}</div>
      )}
    </div>
  );
};
