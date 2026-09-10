import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Clock,
  CheckCircle2,
  Play,
  Sparkles,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Target,
  FileCheck,
} from 'lucide-react';
import { RoadmapMilestone } from '../../types';

interface RoadmapModuleCardProps {
  milestone: RoadmapMilestone;
  onContinueLearning: (milestone: RoadmapMilestone) => void;
  onMarkCompleted: (id: string) => void;
  onResetMilestone?: (id: string) => void;
  onToggleLesson?: (milestoneId: string, lessonId: string) => void;
}

export const RoadmapModuleCard: React.FC<RoadmapModuleCardProps> = ({
  milestone,
  onContinueLearning,
  onMarkCompleted,
  onResetMilestone,
  onToggleLesson,
}) => {
  const [showLessons, setShowLessons] = useState(false);

  const {
    id,
    title,
    stage,
    stageNumber = 1,
    skillFocus,
    skillsGained = [],
    estimatedHours,
    completedHours,
    modulesCount,
    completedModules,
    status,
    priority,
    description,
    lessons = [],
  } = milestone;

  const progressPercent =
    estimatedHours > 0 ? Math.round((completedHours / estimatedHours) * 100) : 0;

  const isCompleted = status === 'Completed' || progressPercent >= 100;
  const isInProgress = status === 'In Progress';
  const isNotStarted = status === 'Not Started' || status === 'Upcoming' || progressPercent === 0;

  const statusTheme = isCompleted
    ? {
        border: 'border-emerald-200 bg-emerald-50/20',
        badgeVariant: 'success' as const,
        label: 'Completed',
      }
    : isInProgress
    ? {
        border: 'border-blue-200 bg-white',
        badgeVariant: 'primary' as const,
        label: 'In Progress',
      }
    : {
        border: 'border-slate-200 bg-slate-50/40',
        badgeVariant: 'neutral' as const,
        label: 'Not Started',
      };

  return (
    <Card className={`transition-all duration-200 shadow-xs hover:shadow-md ${statusTheme.border}`}>
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Header Row: Stage badge, Priority, Status */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {stageNumber}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {stage}
            </span>
            <Badge variant={priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'neutral'} size="sm">
              {priority} Priority
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={statusTheme.badgeVariant} size="sm" dot>
              {statusTheme.label}
            </Badge>
          </div>
        </div>

        {/* Title & Target Skill */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Target Competency Focus:</span>
            <strong className="text-slate-700">{skillFocus}</strong>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* Skills Gained After Completing Module */}
        {skillsGained.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Skills Gained After Completion:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress Metric & Indicator */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {completedHours} of {estimatedHours} Hours Completed ({completedModules} of {modulesCount} modules)
              </span>
            </span>
            <span className="font-bold text-slate-900">{progressPercent}%</span>
          </div>

          <ProgressBar
            value={completedHours}
            max={estimatedHours}
            size="sm"
            variant={isCompleted ? 'success' : 'primary'}
          />
        </div>

        {/* Expandable Lessons Section */}
        {lessons.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowLessons(!showLessons)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {showLessons ? 'Hide Curriculum Lessons' : `View Curriculum Lessons (${lessons.length})`}
              </span>
              {showLessons ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showLessons && (
              <div className="mt-3 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1 mr-2">
                      <input
                        type="checkbox"
                        checked={lesson.completed}
                        onChange={() => onToggleLesson && onToggleLesson(id, lesson.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300 cursor-pointer"
                      />
                      <span className={lesson.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                        {lesson.title}
                      </span>
                    </label>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                      {lesson.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Estimated Duration: ~{estimatedHours} hours total</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isCompleted ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Module Verified</span>
                </span>
                {onResetMilestone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResetMilestone(id)}
                    title="Reset module progress to study again"
                    leftIcon={<RotateCcw className="w-3 h-3 text-slate-400" />}
                  >
                    Re-study
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkCompleted(id)}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Mark as Completed
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onContinueLearning(milestone)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Continue Learning
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
