import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Bookmark,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Compass,
  FileQuestion,
  RotateCcw,
  Map,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert, PageError } from '../components/ui/ErrorState';
import { Spinner, SkeletonCard } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { OpportunityItem } from '../types';

import {
  opportunitiesApi,
  OpportunitiesFilterParams,
  OpportunitiesResponse,
} from '../services/opportunitiesApi';

import { EthicalNoticeBanner } from '../components/opportunities/EthicalNoticeBanner';
import { OpportunityFiltersBar } from '../components/opportunities/OpportunityFiltersBar';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityDetailsModal } from '../components/opportunities/OpportunityDetailsModal';

export const JobsInternshipsView: React.FC = () => {
  const { user, skills, toggleBookmark, applyToOpportunity, setActiveNav } = useApp();

  // Filter state
  const [filters, setFilters] = useState<OpportunitiesFilterParams>({
    search: '',
    type: 'All',
    workMode: 'All',
    experienceLevel: 'All',
    matchScoreFilter: 'All',
    sortBy: 'match_desc',
    onlyBookmarked: false,
    simulateError: false,
    simulateEmpty: false,
  });

  // Data state
  const [items, setItems] = useState<OpportunityItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction state
  const [activeModalOpp, setActiveModalOpp] = useState<OpportunityItem | null>(null);
  const [applicationNotice, setApplicationNotice] = useState<string | null>(null);

  // Fetch opportunities from service (prepared for future GET /api/opportunities)
  const fetchOpportunities = useCallback(
    async (currentFilters: OpportunitiesFilterParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: OpportunitiesResponse = await opportunitiesApi.getOpportunities(
          currentFilters,
          skills
        );
        setItems(response.data);
        setTotalCount(response.totalCount);
      } catch (err: any) {
        setError(
          err.message ||
            'Unable to connect to /api/opportunities. Please verify your connection or try again.'
        );
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    },
    [skills]
  );

  // Trigger fetch when filters or candidate skills change
  useEffect(() => {
    fetchOpportunities(filters);
  }, [filters, fetchOpportunities]);

  const handleFilterUpdate = (updates: Partial<OpportunitiesFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      workMode: 'All',
      experienceLevel: 'All',
      matchScoreFilter: 'All',
      sortBy: 'match_desc',
      onlyBookmarked: false,
      simulateError: false,
      simulateEmpty: false,
    });
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev, simulateError: false }));
  };

  // Toggle bookmark in local view and global context
  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
    if (activeModalOpp?.id === id) {
      setActiveModalOpp((prev) => (prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null));
    }
  };

  // Dispatch application
  const handleApply = (opp: OpportunityItem) => {
    applyToOpportunity(opp.id);

    // Update locally
    setItems((prev) =>
      prev.map((item) => (item.id === opp.id ? { ...item, hasApplied: true } : item))
    );
    if (activeModalOpp?.id === opp.id) {
      setActiveModalOpp((prev) => (prev ? { ...prev, hasApplied: true } : null));
    }

    setApplicationNotice(
      `Candidate application successfully registered for "${opp.title}" under ${user.name} (${user.email}).`
    );
    setTimeout(() => setApplicationNotice(null), 6000);
  };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim()) ||
      (filters.type && filters.type !== 'All') ||
      (filters.workMode && filters.workMode !== 'All') ||
      (filters.experienceLevel && filters.experienceLevel !== 'All') ||
      (filters.matchScoreFilter && filters.matchScoreFilter !== 'All') ||
      filters.onlyBookmarked
  );

  return (
    <PageContainer
      title="Jobs &amp; Internships"
      description="Explore career opportunities and internships aligned with your target role and verified competencies."
      badge={
        !isLoading && !error ? (
          <Badge variant="primary">{items.length} Opportunities</Badge>
        ) : undefined
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterUpdate({ onlyBookmarked: !filters.onlyBookmarked })}
            leftIcon={<Bookmark className={`w-3.5 h-3.5 ${filters.onlyBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />}
          >
            {filters.onlyBookmarked ? 'Showing Saved' : 'View Saved'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Application Notification Feedback Toast */}
        {applicationNotice && (
          <Alert
            variant="success"
            title="Application Dispatched"
            message={applicationNotice}
            onDismiss={() => setApplicationNotice(null)}
          />
        )}

        {/* Ethical Transparency & Non-Recruiter Disclaimer */}
        <EthicalNoticeBanner />

        {/* Search, Filters, and Sorting Controls */}
        <OpportunityFiltersBar
          filters={filters}
          onFilterChange={handleFilterUpdate}
          onResetFilters={handleResetFilters}
          onRefresh={() => fetchOpportunities(filters)}
          isLoading={isLoading}
          totalCount={totalCount}
          filteredCount={items.length}
        />

        {/* 1. LOADING STATE */}
        {isLoading && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
              <Spinner size="md" />
              <p className="text-xs text-slate-500">
                Retrieving career opportunities from <code>/api/opportunities</code> and calibrating
                match scores...
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SkeletonCard rows={4} />
              <SkeletonCard rows={4} />
              <SkeletonCard rows={4} />
              <SkeletonCard rows={4} />
            </div>
          </div>
        )}

        {/* 2. ERROR STATE WITH RETRY OPTION */}
        {!isLoading && error && (
          <div className="space-y-4">
            <PageError
              title="Failed to Load Opportunities"
              message={error}
              onRetry={handleRetry}
            />
            {filters.simulateError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>
                  <strong>Tip:</strong> Network simulation mode is active. Click &quot;Try Again&quot;
                  above or toggle &quot;Error: OFF&quot; in the filter bar to resume normal feed
                  delivery.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterUpdate({ simulateError: false })}
                >
                  Turn Off Simulation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 3. EMPTY STATE (When no opportunities exist in feed) */}
        {!isLoading && !error && totalCount === 0 && (
          <EmptyState
            title="No Career Opportunities Available"
            description="There are currently no benchmark opportunities available in the system catalog. Check back soon or refresh the feed."
            icon={<Compass className="w-8 h-8 text-blue-500" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleFilterUpdate({ simulateEmpty: false })}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Opportunities
              </Button>
            }
          />
        )}

        {/* 4. NO RESULTS STATE (When search/filters return 0 items) */}
        {!isLoading && !error && totalCount > 0 && items.length === 0 && (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-semibold text-slate-800">
                No Opportunities Match Your Current Filters
              </h4>
              <p className="text-xs text-slate-500">
                We couldn&apos;t find any roles matching your active search criteria or filter
                thresholds. Try broadening your criteria.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        )}

        {/* 5. ACTIVE RESULTS GRID */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {items.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onViewDetails={(selected) => setActiveModalOpp(selected)}
                onToggleBookmark={handleToggleBookmark}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Next Step in Candidate Journey: Bridge Gaps via Roadmap */}
        {!isLoading && !error && items.length > 0 && (
          <Card className="border-emerald-200 bg-gradient-to-br from-white via-emerald-50/20 to-blue-50/20">
            <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">Roadmap Bridge</Badge>
                  <span className="text-xs text-slate-500">Close Missing Skills</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 tracking-tight">
                  Need higher match scores for competitive roles?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bridge missing competencies required by top employers through your personalized, step-by-step <strong>Adaptive Learning Roadmap</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveNav('roadmap')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-semibold"
                >
                  Open Learning Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Opportunity Modal */}
        <OpportunityDetailsModal
          isOpen={Boolean(activeModalOpp)}
          onClose={() => setActiveModalOpp(null)}
          opportunity={activeModalOpp}
          onApply={handleApply}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>
    </PageContainer>
  );
};
