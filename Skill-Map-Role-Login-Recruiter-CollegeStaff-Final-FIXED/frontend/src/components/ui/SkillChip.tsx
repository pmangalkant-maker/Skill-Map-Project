import React from 'react';
import { X, CheckCircle2, Award, Zap, Sparkles, UserCheck } from 'lucide-react';
import { SkillCategory, ProficiencyLevel, SkillStatus, SkillSource } from '../../types';

export interface SkillChipData {
  id?: string;
  name: string;
  category?: SkillCategory;
  level?: ProficiencyLevel;
  score?: number;
  status?: SkillStatus;
  source?: SkillSource;
  isAiExtracted?: boolean;
  aiConfidence?: number;
}

export interface SkillChipProps {
  skill: SkillChipData;
  onRemove?: (skill: SkillChipData) => void;
  onClick?: () => void;
  size?: 'sm' | 'md';
  showScore?: boolean;
  showLevel?: boolean;
  showSource?: boolean;
  className?: string;
}

const categoryStyles: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Technical: {
    bg: 'bg-blue-50/80',
    text: 'text-blue-900',
    border: 'border-blue-200/90',
    badge: 'bg-blue-100/90 text-blue-700',
  },
  'Technical Skills': {
    bg: 'bg-blue-50/80',
    text: 'text-blue-900',
    border: 'border-blue-200/90',
    badge: 'bg-blue-100/90 text-blue-700',
  },
  'Domain Knowledge': {
    bg: 'bg-purple-50/80',
    text: 'text-purple-900',
    border: 'border-purple-200/90',
    badge: 'bg-purple-100/90 text-purple-700',
  },
  'Other Skills': {
    bg: 'bg-purple-50/80',
    text: 'text-purple-900',
    border: 'border-purple-200/90',
    badge: 'bg-purple-100/90 text-purple-700',
  },
  'Tools & Systems': {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-900',
    border: 'border-emerald-200/90',
    badge: 'bg-emerald-100/90 text-emerald-700',
  },
  'Tools & Technologies': {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-900',
    border: 'border-emerald-200/90',
    badge: 'bg-emerald-100/90 text-emerald-700',
  },
  'Core & Collaborative': {
    bg: 'bg-amber-50/80',
    text: 'text-amber-900',
    border: 'border-amber-200/90',
    badge: 'bg-amber-100/90 text-amber-800',
  },
  'Soft Skills': {
    bg: 'bg-amber-50/80',
    text: 'text-amber-900',
    border: 'border-amber-200/90',
    badge: 'bg-amber-100/90 text-amber-800',
  },
};

const defaultCategoryStyle = {
  bg: 'bg-slate-50',
  text: 'text-slate-800',
  border: 'border-slate-200',
  badge: 'bg-slate-200/70 text-slate-700',
};

export const SkillChip: React.FC<SkillChipProps> = ({
  skill,
  onRemove,
  onClick,
  size = 'md',
  showScore = true,
  showLevel = true,
  showSource = false,
  className = '',
}) => {
  const style = skill.category ? categoryStyles[skill.category] || defaultCategoryStyle : defaultCategoryStyle;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all select-none ${
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-xs sm:text-sm px-3 py-1.5'
      } ${style.bg} ${style.text} ${style.border} ${
        onClick ? 'cursor-pointer hover:shadow-xs hover:border-slate-300' : ''
      } ${className}`}
    >
      {skill.status === 'Verified' && (
        <span title="Verified Competency" className="inline-flex shrink-0">
          <CheckCircle2
            className={`shrink-0 text-emerald-600 ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
          />
        </span>
      )}

      <span className="font-semibold tracking-tight">{skill.name}</span>

      {showLevel && skill.level && (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.badge}`}
        >
          {skill.level}
        </span>
      )}

      {showScore && typeof skill.score === 'number' && (
        <span className="text-[11px] font-bold text-slate-600 ml-0.5">
          {skill.score}%
        </span>
      )}

      {showSource && (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
            skill.source === 'resume' || skill.source === 'resume_extracted' || skill.isAiExtracted
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title={
            skill.source === 'resume' || skill.source === 'resume_extracted' || skill.isAiExtracted
              ? `AI Extracted from Resume${skill.aiConfidence ? ` (${skill.aiConfidence}% match confidence)` : ''}`
              : 'Manually Added by Candidate'
          }
        >
          {skill.source === 'resume' || skill.source === 'resume_extracted' || skill.isAiExtracted ? (
            <>
              <Sparkles className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
              <span>AI Extracted</span>
            </>
          ) : (
            <>
              <UserCheck className="w-2.5 h-2.5 text-slate-500 shrink-0" />
              <span>Manual</span>
            </>
          )}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="ml-0.5 -mr-1 p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-rose-400 cursor-pointer"
          aria-label={`Remove skill ${skill.name}`}
          title={`Remove ${skill.name}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};
