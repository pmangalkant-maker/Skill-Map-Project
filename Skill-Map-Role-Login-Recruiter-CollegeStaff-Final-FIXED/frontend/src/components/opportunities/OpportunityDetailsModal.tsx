import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Briefcase,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Plus,
  Sparkles,
  DollarSign,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { OpportunityItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface OpportunityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: OpportunityItem | null;
  onApply: (opp: OpportunityItem) => void;
  onToggleBookmark: (id: string) => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onApply,
  onToggleBookmark,
}) => {
  const { user, setActiveNav, addSkill } = useApp();

  if (!opportunity) return null;

  const {
    id,
    title,
    organization,
    type,
    workMode,
    location,
    experienceLevel = 'Entry Level (0-1 yrs)',
    matchScore,
    stipendOrSalary,
    deadline,
    matchedSkills = [],
    missingSkills = [],
    requiredSkills = [],
    description,
    responsibilities = [],
    perks = [],
    isBookmarked,
    hasApplied,
  } = opportunity;

  const handleAddMissingToRoadmap = () => {
    onClose();
    setActiveNav('roadmap');
  };

  const handleAddMissingToSkills = (skillName: string) => {
    addSkill({
      name: skillName,
      category: 'Technical Skills',
      level: 'Beginner',
      score: 30,
      targetScore: 80,
      status: 'Learning',
      source: 'manually_added',
      isAiExtracted: false,
      confirmedByCandidate: true,
      notes: `Added from ${title} benchmark opportunity requirements`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Educational benchmark simulation • Zero automated screening rejection</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleBookmark(id)}
              leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />}
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>

            <Button
              variant={hasApplied ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onApply(opportunity)}
              disabled={hasApplied}
              leftIcon={
                hasApplied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )
              }
            >
              {hasApplied ? 'Application Submitted' : 'Submit Application'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-slate-700 text-xs sm:text-sm">
        {/* Header Metadata Ribbon */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Organization / Team
              </span>
              <h4 className="text-base font-bold text-slate-900">{organization}</h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{matchScore}% Profile Match</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 flex-wrap pt-1 border-t border-slate-200/60">
            <Badge variant="primary" size="sm">
              {type}
            </Badge>
            <Badge variant="outline" size="sm">
              {workMode}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{location}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{experienceLevel}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{deadline}</span>
            </span>
            <span className="font-semibold text-slate-800 ml-auto">
              {stipendOrSalary}
            </span>
          </div>
        </div>

        {/* Ethical Transparency Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Sample Opportunity Notice:</strong> This benchmark listing illustrates competency
            expectations for {title}. Recommendations are generated strictly as career feedback, not as
            hiring commitments or candidate guarantees.
          </p>
        </div>

        {/* Role Overview */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Opportunity Overview
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Key Responsibilities */}
        {responsibilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Core Responsibilities &amp; Projects
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc list-inside">
              {responsibilities.map((resp, idx) => (
                <li key={idx} className="leading-relaxed">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Alignment Matrix */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Skill Alignment &amp; Prerequisites
            </h4>
            <span className="text-xs text-slate-500">
              {matchedSkills.length} of {matchedSkills.length + missingSkills.length} Met
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched Skills (Green) */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Matching Skills ({matchedSkills.length})</span>
              </div>
              <div className="space-y-1">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-medium text-emerald-800 bg-white/80 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center justify-between"
                    >
                      <span>{skill}</span>
                      <span className="text-[10px] text-emerald-600 uppercase font-bold">Passed</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No skills currently matched.</p>
                )}
              </div>
            </div>

            {/* Missing Skills (Red/Amber) */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Deficit Skills to Bridge ({missingSkills.length})</span>
              </div>
              <div className="space-y-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-medium text-rose-800 bg-white/80 px-2.5 py-1 rounded-md border border-rose-200 flex items-center justify-between gap-1"
                    >
                      <span className="truncate">{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleAddMissingToSkills(skill)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline shrink-0 cursor-pointer"
                        title="Add to your skills profile"
                      >
                        + Add to Profile
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">All required skills met!</p>
                )}
              </div>
            </div>
          </div>

          {missingSkills.length > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600">
                Want to bridge these missing skills to raise your match percentage?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMissingToRoadmap}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Learning Roadmap
              </Button>
            </div>
          )}
        </div>

        {/* Perks & Benefits */}
        {perks.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Learning &amp; Growth Perks
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {perks.map((perk, idx) => (
                <span
                  key={idx}
                  className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Status Confirmation */}
        {hasApplied && (
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">Application Staged for Candidate: {user.name}</p>
              <p className="text-[11px] text-emerald-700">
                Your verified skill inventory and candidate profile have been associated with this role
                simulation.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
