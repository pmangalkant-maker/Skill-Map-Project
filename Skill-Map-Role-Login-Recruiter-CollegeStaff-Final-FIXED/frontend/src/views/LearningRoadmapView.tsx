import React, { useState, useEffect, useCallback } from 'react';
import {
  Map,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  FileQuestion,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { PageError, Alert } from '../components/ui/ErrorState';
import { Spinner, SkeletonCard } from '../components/ui/LoadingState';
import { RoadmapMilestone, RoadmapStage } from '../types';

import {
  roadmapApi,
  RoadmapQueryParams,
  RoadmapResponse,
} from '../services/roadmapApi';

import { RoadmapHeaderSummary } from '../components/roadmap/RoadmapHeaderSummary';
import { RoadmapSequenceTracker } from '../components/roadmap/RoadmapSequenceTracker';
import { RoadmapModuleCard } from '../components/roadmap/RoadmapModuleCard';
import { LessonCurriculumModal } from '../components/roadmap/LessonCurriculumModal';

export const LearningRoadmapView: React.FC = () => {
  const { user, skills, gapMetric } = useApp();

  // Filter and simulation parameters
  const [params, setParams] = useState<RoadmapQueryParams>({
    statusFilter: 'All',
    stageFilter: 'All',
    search: '',
    simulateError: false,
    simulateEmpty: false,
  });

  // State management
  const [roadmapData, setRoadmapData] = useState<RoadmapMilestone[]>([]);
  const [currentSkillLevel, setCurrentSkillLevel] = useState<string>('Early Professional / Intermediate');
  const [missingSkillsList, setMissingSkillsList] = useState<string[]>([]);
  const [totalEstimatedHours, setTotalEstimatedHours] = useState<number>(0);
  const [totalCompletedHours, setTotalCompletedHours] = useState<number>(0);
  const [overallProgressPercentage, setOverallProgressPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active modal for detailed curriculum view
  const [activeCurriculumModal, setActiveCurriculumModal] = useState<RoadmapMilestone | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Fetch roadmap from service (prepared for future GET /api/roadmap)
  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: RoadmapResponse = await roadmapApi.getRoadmap(
        user.targetRole,
        skills,
        gapMetric,
        params
      );

      setRoadmapData(response.data);
      setCurrentSkillLevel(response.currentSkillLevel);
      setMissingSkillsList(response.missingSkillsList);
      setTotalEstimatedHours(response.totalEstimatedHours);
      setTotalCompletedHours(response.totalCompletedHours);
      setOverallProgressPercentage(response.overallProgressPercentage);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to retrieve learning roadmap from /api/roadmap. Please check connection and try again.'
      );
      setRoadmapData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.targetRole, skills, gapMetric, params]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleParamChange = (updates: Partial<RoadmapQueryParams>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setParams({
      statusFilter: 'All',
      stageFilter: 'All',
      search: '',
      simulateError: false,
      simulateEmpty: false,
    });
  };

  const handleRetry = () => {
    setParams((prev) => ({ ...prev, simulateError: false }));
  };

  // Mark a milestone as completely verified (100%)
  const handleMarkCompleted = (id: string) => {
    const targetMilestone = roadmapData.find((x) => x.id === id);
    const updatedLessons = targetMilestone?.lessons?.map((l) => ({ ...l, completed: true })) || [];

    setRoadmapData((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: 'Completed',
            completedHours: m.estimatedHours,
            completedModules: m.modulesCount,
            lessons: updatedLessons,
          };
        }
        return m;
      })
    );

    // Persist to MongoDB backend
    void roadmapApi.updateModuleProgress(id, {
      status: 'Completed',
      completedHours: targetMilestone?.estimatedHours || 20,
      completedModules: targetMilestone?.modulesCount || 4,
      lessons: updatedLessons,
    });

    // Recalculate totals
    setTimeout(() => {
      setRoadmapData((current) => {
        const est = current.reduce((acc, m) => acc + m.estimatedHours, 0);
        const comp = current.reduce((acc, m) => acc + m.completedHours, 0);
        setTotalCompletedHours(comp);
        setOverallProgressPercentage(est > 0 ? Math.round((comp / est) * 100) : 0);
        return current;
      });
    }, 50);

    setActionFeedback(
      `Milestone "${targetMilestone?.title || 'Stage'}" marked as completed! Gained skills added to verified competency profile.`
    );
    setTimeout(() => setActionFeedback(null), 5000);

    if (activeCurriculumModal?.id === id) {
      setActiveCurriculumModal((prev) =>
        prev
          ? {
              ...prev,
              status: 'Completed',
              completedHours: prev.estimatedHours,
              completedModules: prev.modulesCount,
              lessons: prev.lessons?.map((l) => ({ ...l, completed: true })),
            }
          : null
      );
    }
  };

  // Reset milestone to not started for re-studying
  const handleResetMilestone = (id: string) => {
    const targetMilestone = roadmapData.find((x) => x.id === id);
    const resetLessons = targetMilestone?.lessons?.map((l) => ({ ...l, completed: false })) || [];

    setRoadmapData((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: 'In Progress',
            completedHours: 0,
            completedModules: 0,
            lessons: resetLessons,
          };
        }
        return m;
      })
    );

    // Persist reset to MongoDB backend
    void roadmapApi.updateModuleProgress(id, {
      status: 'In Progress',
      completedHours: 0,
      completedModules: 0,
      lessons: resetLessons,
    });

    setTimeout(() => {
      setRoadmapData((current) => {
        const est = current.reduce((acc, m) => acc + m.estimatedHours, 0);
        const comp = current.reduce((acc, m) => acc + m.completedHours, 0);
        setTotalCompletedHours(comp);
        setOverallProgressPercentage(est > 0 ? Math.round((comp / est) * 100) : 0);
        return current;
      });
    }, 50);
  };

  // Toggle individual lesson check inside a milestone
  const handleToggleLesson = (milestoneId: string, lessonId: string) => {
    let updatedPayload: any = null;

    setRoadmapData((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const updatedLessons =
            m.lessons?.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l)) ||
            [];
          const completedCount = updatedLessons.filter((l) => l.completed).length;
          const totalLessons = updatedLessons.length;
          const newHours =
            totalLessons > 0 ? Math.round((completedCount / totalLessons) * m.estimatedHours) : 0;
          const newStatus =
            completedCount === totalLessons
              ? 'Completed'
              : completedCount > 0
              ? 'In Progress'
              : 'Not Started';

          const updated = {
            ...m,
            status: newStatus as any,
            completedHours: newHours,
            completedModules: completedCount,
            lessons: updatedLessons,
          };

          updatedPayload = {
            status: newStatus,
            completedHours: newHours,
            completedModules: completedCount,
            lessons: updatedLessons,
          };

          if (activeCurriculumModal?.id === milestoneId) {
            setActiveCurriculumModal(updated);
          }

          return updated;
        }
        return m;
      })
    );

    // Persist lesson toggle to MongoDB
    if (updatedPayload) {
      void roadmapApi.updateModuleProgress(milestoneId, updatedPayload);
    }

    setTimeout(() => {
      setRoadmapData((current) => {
        const est = current.reduce((acc, m) => acc + m.estimatedHours, 0);
        const comp = current.reduce((acc, m) => acc + m.completedHours, 0);
        setTotalCompletedHours(comp);
        setOverallProgressPercentage(est > 0 ? Math.round((comp / est) * 100) : 0);
        return current;
      });
    }, 50);
  };

  // Increment study hours
  const handleAddHours = (milestoneId: string, hours: number) => {
    let newHoursCalculated = 0;
    let newStatusCalculated: any = 'In Progress';

    setRoadmapData((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const newHours = Math.min(m.estimatedHours, m.completedHours + hours);
          const newStatus = newHours >= m.estimatedHours ? 'Completed' : 'In Progress';
          newHoursCalculated = newHours;
          newStatusCalculated = newStatus;

          const updated = {
            ...m,
            completedHours: newHours,
            status: newStatus as any,
          };
          if (activeCurriculumModal?.id === milestoneId) {
            setActiveCurriculumModal(updated);
          }
          return updated;
        }
        return m;
      })
    );

    // Persist added hours to MongoDB
    void roadmapApi.updateModuleProgress(milestoneId, {
      deltaHours: hours,
      completedHours: newHoursCalculated,
      status: newStatusCalculated,
    });

    setTimeout(() => {
      setRoadmapData((current) => {
        const est = current.reduce((acc, m) => acc + m.estimatedHours, 0);
        const comp = current.reduce((acc, m) => acc + m.completedHours, 0);
        setTotalCompletedHours(comp);
        setOverallProgressPercentage(est > 0 ? Math.round((comp / est) * 100) : 0);
        return current;
      });
    }, 50);
  };

  const completedStagesCount = roadmapData.filter((m) => m.status === 'Completed').length;
  const totalStagesCount = 5;

  const hasActiveFilters = Boolean(
    (params.search && params.search.trim()) ||
      (params.statusFilter && params.statusFilter !== 'All') ||
      (params.stageFilter && params.stageFilter !== 'All')
  );

  return (
    <PageContainer
      title="Adaptive Learning Roadmap"
      description={`Personalized 5-stage competency progression designed to close verified skill gaps for ${user.targetRole}.`}
      badge={
        !isLoading && !error ? (
          <Badge variant="success">{overallProgressPercentage}% Completed</Badge>
        ) : undefined
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRoadmap}
            disabled={isLoading}
            title="Refresh roadmap curriculum from /api/roadmap"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Action Feedback Toast */}
        {actionFeedback && (
          <Alert
            variant="success"
            title="Milestone Progress Updated"
            message={actionFeedback}
            onDismiss={() => setActionFeedback(null)}
          />
        )}

        {/* 1. Header Diagnostic & Progress Summary */}
        <RoadmapHeaderSummary
          targetRole={user.targetRole}
          currentSkillLevel={currentSkillLevel}
          missingSkills={missingSkillsList}
          totalEstimatedHours={totalEstimatedHours}
          totalCompletedHours={totalCompletedHours}
          overallProgressPercentage={overallProgressPercentage}
          completedStagesCount={completedStagesCount}
          totalStagesCount={totalStagesCount}
        />

        {/* 2. Recommended 5-Stage Sequential Stepper */}
        <RoadmapSequenceTracker
          milestones={roadmapData}
          selectedStage={params.stageFilter || 'All'}
          onSelectStage={(stage) => handleParamChange({ stageFilter: stage })}
        />

        {/* 3. Filter Bar & Test State Toolbar */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="flex-1">
                <SearchInput
                  value={params.search || ''}
                  onChange={(e) => handleParamChange({ search: e.target.value })}
                  onClear={() => handleParamChange({ search: '' })}
                  placeholder="Search modules by competency, lesson, or skill..."
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['All', 'In Progress', 'Completed', 'Not Started'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleParamChange({ statusFilter: status })}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium cursor-pointer ${
                      params.statusFilter === status
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Stats and Test Switches */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">
                  Showing <strong>{roadmapData.length}</strong> modules
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>

              {/* Test State Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Test States:</span>
                <button
                  type="button"
                  onClick={() => handleParamChange({ simulateError: !params.simulateError })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                    params.simulateError
                      ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                  }`}
                  title="Toggle error state for testing retry flow"
                >
                  <AlertOctagon className="w-2.5 h-2.5 inline mr-1" />
                  Error: {params.simulateError ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => handleParamChange({ simulateEmpty: !params.simulateEmpty })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                    params.simulateEmpty
                      ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                  }`}
                  title="Toggle empty roadmap state for testing empty state"
                >
                  <FileQuestion className="w-2.5 h-2.5 inline mr-1" />
                  Empty: {params.simulateEmpty ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. LOADING STATE */}
        {isLoading && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
              <Spinner size="md" />
              <p className="text-xs text-slate-500">
                Calibrating adaptive learning roadmap from <code>/api/roadmap</code> based on target
                role gaps...
              </p>
            </div>
            <div className="space-y-4">
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
            </div>
          </div>
        )}

        {/* 5. ERROR STATE WITH RETRY BUTTON */}
        {!isLoading && error && (
          <div className="space-y-4">
            <PageError
              title="Unable to Load Learning Roadmap"
              message={error}
              onRetry={handleRetry}
            />
            {params.simulateError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>
                  <strong>Tip:</strong> Network simulation mode is active. Click &quot;Try Again&quot;
                  above or toggle &quot;Error: OFF&quot; in the filter bar to resume normal curriculum
                  delivery.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleParamChange({ simulateError: false })}
                >
                  Turn Off Simulation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 6. EMPTY STATE (When roadmap is empty) */}
        {!isLoading && !error && roadmapData.length === 0 && !hasActiveFilters && (
          <EmptyState
            title="No Learning Roadmap Available"
            description="There are currently no learning milestones mapped to your profile. Select a target role to generate a calibrated curriculum."
            icon={<Map className="w-8 h-8 text-blue-500" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleParamChange({ simulateEmpty: false })}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Generate Adaptive Roadmap
              </Button>
            }
          />
        )}

        {/* 7. NO SEARCH RESULTS STATE */}
        {!isLoading && !error && roadmapData.length === 0 && hasActiveFilters && (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-semibold text-slate-800">
                No Modules Match Your Active Filters
              </h4>
              <p className="text-xs text-slate-500">
                No learning modules match &quot;{params.search}&quot; or the selected stage criteria.
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

        {/* 8. ACTIVE ROADMAP MODULE CARDS */}
        {!isLoading && !error && roadmapData.length > 0 && (
          <div className="space-y-4">
            {roadmapData.map((milestone) => (
              <RoadmapModuleCard
                key={milestone.id}
                milestone={milestone}
                onContinueLearning={(selected) => setActiveCurriculumModal(selected)}
                onMarkCompleted={handleMarkCompleted}
                onResetMilestone={handleResetMilestone}
                onToggleLesson={handleToggleLesson}
              />
            ))}
          </div>
        )}

        {/* Detailed Curriculum & Study Space Modal */}
        <LessonCurriculumModal
          isOpen={Boolean(activeCurriculumModal)}
          onClose={() => setActiveCurriculumModal(null)}
          milestone={activeCurriculumModal}
          onToggleLesson={handleToggleLesson}
          onAddHours={handleAddHours}
          onMarkCompleted={handleMarkCompleted}
        />
      </div>
    </PageContainer>
  );
};
