import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../ui/SearchInput';
import { Select } from '../ui/Select';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Bookmark,
  AlertOctagon,
  FileQuestion,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  OpportunityType,
  WorkMode,
  ExperienceLevelFilter,
  MatchScoreFilter,
  SortOption,
  OpportunitiesFilterParams,
} from '../../services/opportunitiesApi';

interface OpportunityFiltersBarProps {
  filters: OpportunitiesFilterParams;
  onFilterChange: (updates: Partial<OpportunitiesFilterParams>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalCount: number;
  filteredCount: number;
}

export const OpportunityFiltersBar: React.FC<OpportunityFiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onRefresh,
  isLoading,
  totalCount,
  filteredCount,
}) => {
  const typeOptions = [
    { value: 'All', label: 'All Opportunities' },
    { value: 'Full-time', label: 'Jobs (Full-time)' },
    { value: 'Internship', label: 'Internships' },
    { value: 'Fellowship', label: 'Fellowships' },
  ];

  const workModeOptions = [
    { value: 'All', label: 'Any Work Mode' },
    { value: 'Remote', label: 'Remote Only' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'On-site', label: 'On-site' },
  ];

  const experienceOptions = [
    { value: 'All', label: 'Any Experience Level' },
    { value: 'Internship / Student', label: 'Internship / Student' },
    { value: 'Entry Level (0-1 yrs)', label: 'Entry Level (0-1 yrs)' },
    { value: 'Associate (1-3 yrs)', label: 'Associate (1-3 yrs)' },
    { value: 'Mid-Level (3+ yrs)', label: 'Mid-Level (3+ yrs)' },
  ];

  const matchScoreOptions = [
    { value: 'All', label: 'All Match Scores' },
    { value: '80%+', label: '80%+ High Alignment' },
    { value: '60-79%', label: '60–79% Moderate Match' },
    { value: 'Under 60%', label: 'Under 60% Bridging' },
  ];

  const sortOptions = [
    { value: 'match_desc', label: 'Highest Skill Match' },
    { value: 'deadline_asc', label: 'Application Deadline' },
    { value: 'title_asc', label: 'Role Title (A–Z)' },
  ];

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim()) ||
      (filters.type && filters.type !== 'All') ||
      (filters.workMode && filters.workMode !== 'All') ||
      (filters.experienceLevel && filters.experienceLevel !== 'All') ||
      (filters.matchScoreFilter && filters.matchScoreFilter !== 'All') ||
      filters.onlyBookmarked
  );

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Search & Primary Filter Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex-1">
            <SearchInput
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              onClear={() => onFilterChange({ search: '' })}
              placeholder="Search by role title, required skill, or location..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bookmarked Filter Pill */}
            <button
              type="button"
              onClick={() => onFilterChange({ onlyBookmarked: !filters.onlyBookmarked })}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                filters.onlyBookmarked
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filters.onlyBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>Saved Only</span>
            </button>

            {/* Sort Select */}
            <div className="w-44">
              <Select
                value={filters.sortBy || 'match_desc'}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                options={sortOptions}
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="md"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh opportunities list from /api/opportunities"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Role Type
            </label>
            <Select
              value={filters.type || 'All'}
              onChange={(e) => onFilterChange({ type: e.target.value as OpportunityType })}
              options={typeOptions}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Work Mode
            </label>
            <Select
              value={filters.workMode || 'All'}
              onChange={(e) => onFilterChange({ workMode: e.target.value as WorkMode })}
              options={workModeOptions}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Experience Level
            </label>
            <Select
              value={filters.experienceLevel || 'All'}
              onChange={(e) =>
                onFilterChange({ experienceLevel: e.target.value as ExperienceLevelFilter })
              }
              options={experienceOptions}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Skill Alignment
            </label>
            <Select
              value={filters.matchScoreFilter || 'All'}
              onChange={(e) =>
                onFilterChange({ matchScoreFilter: e.target.value as MatchScoreFilter })
              }
              options={matchScoreOptions}
            />
          </div>
        </div>

        {/* Status Bar & Testing Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">
              Showing <strong>{filteredCount}</strong> of {totalCount} opportunities
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Testing State Switches for Evaluation */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Test States:</span>
            <button
              type="button"
              onClick={() => onFilterChange({ simulateError: !filters.simulateError })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                filters.simulateError
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
              }`}
              title="Toggle error state for testing retry option"
            >
              <AlertOctagon className="w-2.5 h-2.5 inline mr-1" />
              Error: {filters.simulateError ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ simulateEmpty: !filters.simulateEmpty })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                filters.simulateEmpty
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
              }`}
              title="Toggle empty database state for testing empty state"
            >
              <FileQuestion className="w-2.5 h-2.5 inline mr-1" />
              Empty: {filters.simulateEmpty ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
