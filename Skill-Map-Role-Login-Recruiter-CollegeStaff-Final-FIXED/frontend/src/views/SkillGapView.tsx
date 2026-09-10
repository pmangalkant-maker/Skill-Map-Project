import React, { useState, useEffect, useCallback } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Plus,
  HelpCircle,
  Compass,
  ArrowRight,
  BookOpen,
  Briefcase,
  Map,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert, PageError } from '../components/ui/ErrorState';
import { Spinner, Skeleton } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

import {
  matchingApi,
  AnalyzeResponse,
  SkillMatchItem,
  BENCHMARK_ROLES,
} from '../services/matchingApi';

import { RoleSelectorBar } from '../components/skillgap/RoleSelectorBar';
import { MatchScoreSummary } from '../components/skillgap/MatchScoreSummary';
import { SkillGapVisualizer } from '../components/skillgap/SkillGapVisualizer';
import { RecommendedSkillsCard } from '../components/skillgap/RecommendedSkillsCard';
import { SkillsComparisonSection } from '../components/skillgap/SkillsComparisonSection';
import { ScoreExplanationModal } from '../components/skillgap/ScoreExplanationModal';

export const SkillGapView: React.FC = () => {
  const { user, skills, updateTargetRole, addSkill, setActiveNav } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>(
    user.targetRole || 'Full Stack Cloud Engineer'
  );
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [addedSkillIds, setAddedSkillIds] = useState<Set<string>>(new Set());

  // Execute matching analysis against target role
  const executeAnalysis = useCallback(
    async (roleName: string, forceSimulateError = false) => {
      if (!roleName || roleName.trim() === '') {
        setAnalysis(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await matchingApi.analyzeRole({
          targetRole: roleName.trim(),
          candidateSkills: skills,
          simulateError: forceSimulateError,
        });
        setAnalysis(result);
      } catch (err: any) {
        setError(
          err.message ||
            'Failed to retrieve benchmark requirements from /api/matching/analyze. Please check connectivity and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [skills]
  );

  // Trigger analysis when selected role changes or simulateError changes
  useEffect(() => {
    executeAnalysis(selectedRole, simulateError);
  }, [selectedRole, simulateError, executeAnalysis]);

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    updateTargetRole(newRole);
    setSuccessNotice(`Target role updated to "${newRole}". Recalculating benchmark alignment...`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleClearRole = () => {
    setSelectedRole('');
    setAnalysis(null);
    setError(null);
  };

  const handleRetry = () => {
    setSimulateError(false);
    executeAnalysis(selectedRole, false);
  };

  // One-click action to add a missing skill directly into user profile
  const handleAddMissingSkill = async (skillItem: SkillMatchItem) => {
    try {
      await addSkill({
        name: skillItem.name,
        category: skillItem.category,
        level: 'Beginner',
        score: 25,
        targetScore: skillItem.requiredScore,
        status: 'Learning',
        source: 'manual',
        isAiExtracted: false,
        confirmedByCandidate: true,
        notes: `Added from ${selectedRole} benchmark gap analysis`,
      });

      setAddedSkillIds((prev) => new Set(prev).add(skillItem.id));
      setSuccessNotice(
        `Added "${skillItem.name}" to your profile under ${skillItem.category}. Refreshing match score...`
      );
      setTimeout(() => setSuccessNotice(null), 4000);

      // Re-run analysis with the newly added skill
      executeAnalysis(selectedRole, false);
    } catch (err: any) {
      setError(err?.message || 'Failed to add missing skill to profile.');
    }
  };

  return (
    <PageContainer
      title="Skill Gap Analysis"
      description="Transparent, deterministic benchmark comparison evaluating your verified profile against market expectations for your target role."
      badge={
        analysis ? (
          <Badge
            variant={
              analysis.overallMatchPercentage >= 80
                ? 'success'
                : analysis.overallMatchPercentage >= 60
                ? 'warning'
                : 'danger'
            }
          >
            {analysis.overallMatchPercentage}% Role Match
          </Badge>
        ) : undefined
      }
      actions={
        analysis ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HelpCircle className="w-3.5 h-3.5 text-blue-600" />}
              onClick={() => setIsExplanationModalOpen(true)}
            >
              Explain Match Score
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => setActiveNav('roadmap')}
            >
              Open Learning Plan
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Success feedback toast */}
        {successNotice && (
          <Alert
            variant="success"
            title="Update Applied"
            message={successNotice}
            onDismiss={() => setSuccessNotice(null)}
          />
        )}

        {/* Role Selector Bar (Always present so user can pick/change/custom role) */}
        <RoleSelectorBar
          currentRole={selectedRole}
          onSelectRole={handleRoleChange}
          onClearRole={handleClearRole}
          onRefresh={() => executeAnalysis(selectedRole, false)}
          isLoading={isLoading}
          simulateError={simulateError}
          setSimulateError={setSimulateError}
          seniorityLevel={analysis?.seniorityLevel}
          industryDemand={analysis?.industryDemand}
          roleDescription={analysis?.roleDescription}
        />

        {/* 1. LOADING STATE */}
        {isLoading && (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 text-center">
              <Spinner size="lg" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-800">
                  Analyzing Competencies for {selectedRole}...
                </h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Querying deterministic role benchmark from <code>/api/matching/analyze</code> and
                  comparing {skills.length} candidate skills...
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <Skeleton width="w-1/2" height="h-4" />
                <Skeleton width="w-24" height="h-8" />
                <Skeleton width="w-full" height="h-3" />
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <Skeleton width="w-1/2" height="h-4" />
                <Skeleton width="w-24" height="h-8" />
                <Skeleton width="w-full" height="h-3" />
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <Skeleton width="w-1/2" height="h-4" />
                <Skeleton width="w-24" height="h-8" />
                <Skeleton width="w-full" height="h-3" />
              </div>
            </div>
          </div>
        )}

        {/* 2. ERROR STATE WITH RETRY */}
        {!isLoading && error && (
          <div className="space-y-4">
            <PageError
              title="Matching Analysis Failed"
              message={error}
              onRetry={handleRetry}
            />
            {simulateError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>
                  <strong>Tip:</strong> Simulation mode is currently ON. Click &quot;Try Again&quot;
                  above or toggle &quot;Simulate Error: OFF&quot; in the toolbar to resume normal
                  benchmark analysis.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSimulateError(false);
                    executeAnalysis(selectedRole, false);
                  }}
                >
                  Turn Off Simulation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 3. NO ANALYSIS / EMPTY STATE */}
        {!isLoading && !error && (!selectedRole || !analysis) && (
          <EmptyState
            title="No Target Career Role Selected"
            description="Select an industry benchmark or type a custom role above to evaluate your verified skills against market requirements."
            icon={<Compass className="w-8 h-8 text-blue-500" />}
            action={
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {BENCHMARK_ROLES.map((role) => (
                  <Button
                    key={role.slug}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleChange(role.roleName)}
                  >
                    Analyze {role.roleName}
                  </Button>
                ))}
              </div>
            }
          />
        )}

        {/* 4. ACTIVE ANALYSIS STATE */}
        {!isLoading && !error && analysis && (
          <div className="space-y-6">
            {/* Overall Match Score Summary */}
            <MatchScoreSummary
              analysis={analysis}
              onOpenExplanation={() => setIsExplanationModalOpen(true)}
            />

            {/* Skill Gap & Readiness Visualization */}
            <SkillGapVisualizer analysis={analysis} />

            {/* Recommended Skills to Learn First */}
            <RecommendedSkillsCard
              recommendations={analysis.recommendedToLearnFirst}
              onAddMissingSkill={handleAddMissingSkill}
              addedSkillIds={addedSkillIds}
            />

            {/* Detailed Skills Comparison (Matched, Partially Matched, Missing) */}
            <SkillsComparisonSection
              matchedSkills={analysis.matchedSkills}
              partiallyMatchedSkills={analysis.partiallyMatchedSkills}
              missingSkills={analysis.missingSkills}
              allRequiredSkills={analysis.allRequiredSkills}
              onAddMissingSkill={handleAddMissingSkill}
              addedSkillIds={addedSkillIds}
            />

            {/* Next Steps in Candidate Journey */}
            <Card className="border-blue-200 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20">
              <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">Candidate Journey Flow</Badge>
                    <span className="text-xs text-slate-500">Next Action Recommended</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">
                    Explore Matched Opportunities or Generate Learning Roadmap
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Now that your competency gaps are quantified against <strong>{analysis.targetRole}</strong>, browse internships matching your strengths or follow a structured sequence to close missing skills.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setActiveNav('jobs')}
                    leftIcon={<Briefcase className="w-4 h-4 text-blue-600" />}
                    className="w-full sm:w-auto font-medium"
                  >
                    Jobs &amp; Internships
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveNav('roadmap')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto font-semibold"
                  >
                    View Learning Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* In-depth Score Explanation & Anti-Bias Audit Modal */}
            <ScoreExplanationModal
              isOpen={isExplanationModalOpen}
              onClose={() => setIsExplanationModalOpen(false)}
              analysis={analysis}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};
