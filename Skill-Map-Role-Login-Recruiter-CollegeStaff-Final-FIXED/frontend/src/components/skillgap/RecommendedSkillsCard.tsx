import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, ArrowRight, Clock, TrendingUp, Plus, Check } from 'lucide-react';
import { SkillMatchItem } from '../../services/matchingApi';
import { useApp } from '../../context/AppContext';

interface RecommendedSkillsCardProps {
  recommendations: SkillMatchItem[];
  onAddMissingSkill?: (skill: SkillMatchItem) => void;
  addedSkillIds: Set<string>;
}

export const RecommendedSkillsCard: React.FC<RecommendedSkillsCardProps> = ({
  recommendations,
  onAddMissingSkill,
  addedSkillIds,
}) => {
  const { setActiveNav } = useApp();

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <CardTitle>Recommended Skills to Learn First</CardTitle>
            </div>
            <CardDescription>
              Prioritized by career role impact, benchmark weighting, and highest return on learning time
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveNav('roadmap')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Full Roadmap
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((skill, index) => {
            const isAdded = addedSkillIds.has(skill.id) || skill.isInCandidateProfile;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                          #{index + 1} Priority
                        </span>
                        <Badge
                          variant={skill.weight === 'Core Required' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {skill.weight}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm pt-1">{skill.name}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <TrendingUp className="w-3 h-3" />
                        +{skill.potentialScoreBoost}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {skill.marketDemandRationale}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{skill.estimatedTimeToBridgeHours}h to complete
                    </span>
                    <span>
                      Target benchmark: <strong>{skill.requiredScore}%</strong> ({skill.requiredLevel})
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    {skill.status === 'Missing' ? (
                      <span className="text-rose-600 font-medium">Missing from Profile</span>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        Current: {skill.candidateScore}% (Deficit: {skill.gap}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {skill.status === 'Missing' && !isAdded && onAddMissingSkill && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onAddMissingSkill(skill)}
                        leftIcon={<Plus className="w-3 h-3" />}
                      >
                        Add to Profile
                      </Button>
                    )}
                    {isAdded && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium px-2 py-1">
                        <Check className="w-3.5 h-3.5" /> Added
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveNav('roadmap')}
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
