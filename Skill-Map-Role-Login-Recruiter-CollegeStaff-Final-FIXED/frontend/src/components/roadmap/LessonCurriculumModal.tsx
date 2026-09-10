import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Check,
  RotateCcw,
  Target,
} from 'lucide-react';
import { RoadmapMilestone } from '../../types';

interface LessonCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: RoadmapMilestone | null;
  onToggleLesson: (milestoneId: string, lessonId: string) => void;
  onAddHours: (milestoneId: string, hours: number) => void;
  onMarkCompleted: (milestoneId: string) => void;
}

export const LessonCurriculumModal: React.FC<LessonCurriculumModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onToggleLesson,
  onAddHours,
  onMarkCompleted,
}) => {
  if (!milestone) return null;

  const {
    id,
    title,
    stage,
    stageNumber,
    skillFocus,
    skillsGained = [],
    estimatedHours,
    completedHours,
    lessons = [],
  } = milestone;

  const completedLessonsCount = lessons.filter((l) => l.completed).length;
  const progressPercent =
    estimatedHours > 0 ? Math.round((completedHours / estimatedHours) * 100) : 0;
  const isCompleted = progressPercent >= 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full text-xs">
          <span className="text-slate-500">
            Self-paced milestone tracking • Practice hours logged directly to competency profile
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddHours(id, 2)}
              disabled={isCompleted}
            >
              +2 Hours Studied
            </Button>

            {!isCompleted ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onMarkCompleted(id);
                }}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Mark Stage Completed
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-slate-700 text-xs sm:text-sm">
        {/* Header Ribbon */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Step {stageNumber}: {stage}
              </Badge>
              <Badge variant={isCompleted ? 'success' : 'neutral'} size="sm">
                {isCompleted ? 'Completed' : 'In Progress'}
              </Badge>
            </div>

            <span className="font-bold text-slate-800 text-xs">
              {completedHours} of {estimatedHours} Hours Logged ({progressPercent}%)
            </span>
          </div>

          <ProgressBar
            value={completedHours}
            max={estimatedHours}
            size="sm"
            variant={isCompleted ? 'success' : 'primary'}
          />

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800 font-semibold">Competency Focus:</strong>{' '}
            {skillFocus}
          </p>
        </div>

        {/* Skills Gained After Completion */}
        {skillsGained.length > 0 && (
          <div className="space-y-2 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Verified Competencies Gained After Completing This Stage:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum Lessons Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Curriculum Lessons &amp; Practical Exercises
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              {completedLessonsCount} of {lessons.length} Passed
            </span>
          </div>

          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => onToggleLesson(id, lesson.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  lesson.completed
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={lesson.completed}
                    onChange={() => onToggleLesson(id, lesson.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${
                        lesson.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Estimated Duration: {lesson.duration}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {lesson.completed ? (
                    <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Passed
                    </span>
                  ) : (
                    <span className="text-xs text-blue-600 font-medium hover:underline">
                      Mark Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
