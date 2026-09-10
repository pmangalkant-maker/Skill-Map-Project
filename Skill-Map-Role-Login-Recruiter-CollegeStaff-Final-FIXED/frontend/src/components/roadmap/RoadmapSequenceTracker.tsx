import React from 'react';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import { RoadmapMilestone, RoadmapStage } from '../../types';

interface RoadmapSequenceTrackerProps {
  milestones: RoadmapMilestone[];
  selectedStage: 'All' | RoadmapStage;
  onSelectStage: (stage: 'All' | RoadmapStage) => void;
}

export const RoadmapSequenceTracker: React.FC<RoadmapSequenceTrackerProps> = ({
  milestones,
  selectedStage,
  onSelectStage,
}) => {
  const stages: Array<{ stage: RoadmapStage; number: number; label: string }> = [
    { stage: 'Foundation Skills', number: 1, label: '1. Foundation Skills' },
    { stage: 'Core Technical Skills', number: 2, label: '2. Core Technical Skills' },
    { stage: 'Advanced Skills', number: 3, label: '3. Advanced Skills' },
    { stage: 'Projects & Practical Application', number: 4, label: '4. Projects & Application' },
    { stage: 'Career Readiness', number: 5, label: '5. Career Readiness' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recommended Learning Sequence
        </span>
        {selectedStage !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectStage('All')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 cursor-pointer"
          >
            Show All 5 Stages
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {stages.map((item) => {
          const m = milestones.find((x) => x.stage === item.stage);
          const isCompleted = m?.status === 'Completed';
          const isInProgress = m?.status === 'In Progress';
          const isSelected = selectedStage === item.stage;

          return (
            <button
              key={item.stage}
              type="button"
              onClick={() => onSelectStage(isSelected ? 'All' : item.stage)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                  : isCompleted
                  ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70'
                  : isInProgress
                  ? 'border-blue-200 bg-white hover:bg-slate-50'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Step {item.number}
                </span>

                {isCompleted ? (
                  <span className="inline-flex items-center text-emerald-600 text-xs font-bold gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </span>
                ) : isInProgress ? (
                  <span className="inline-flex items-center text-blue-600 text-xs font-bold gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center text-slate-400 text-xs font-medium gap-1">
                    <Circle className="w-3 h-3" />
                    <span>Next</span>
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-blue-950' : 'text-slate-800'
                  }`}
                >
                  {item.stage}
                </p>
                {m && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {m.completedHours}/{m.estimatedHours} hrs • {m.completedModules}/{m.modulesCount} modules
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
