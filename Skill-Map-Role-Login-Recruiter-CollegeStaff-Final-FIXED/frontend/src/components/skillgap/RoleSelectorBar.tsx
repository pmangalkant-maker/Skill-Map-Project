import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Target, Search, RefreshCw, X, Sparkles, AlertOctagon, Briefcase } from 'lucide-react';
import { BENCHMARK_ROLES } from '../../services/matchingApi';

interface RoleSelectorBarProps {
  currentRole: string;
  onSelectRole: (role: string) => void;
  onClearRole: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  simulateError: boolean;
  setSimulateError: (val: boolean) => void;
  seniorityLevel?: string;
  industryDemand?: string;
  roleDescription?: string;
}

export const RoleSelectorBar: React.FC<RoleSelectorBarProps> = ({
  currentRole,
  onSelectRole,
  onClearRole,
  onRefresh,
  isLoading,
  simulateError,
  setSimulateError,
  seniorityLevel = 'Associate / Early Career',
  industryDemand = 'Very High',
  roleDescription,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const selectOptions = [
    ...BENCHMARK_ROLES.map((r) => ({ value: r.roleName, label: r.roleName })),
  ];

  // If current role is custom and not in benchmark list, add it to options
  const isPredefined = BENCHMARK_ROLES.some((r) => r.roleName === currentRole);
  if (currentRole && !isPredefined) {
    selectOptions.push({ value: currentRole, label: `${currentRole} (Custom)` });
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectRole(customInput.trim());
      setIsCustomMode(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Role Selection / Input Controls */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="target-role-control"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Target Career Role</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  setCustomInput(currentRole);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors cursor-pointer"
              >
                {isCustomMode ? 'Select from standard benchmarks' : '+ Type custom target role'}
              </button>
            </div>

            {isCustomMode ? (
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    id="target-role-control"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. AI Prompt & Systems Engineer, Site Reliability Specialist..."
                    autoFocus
                  />
                </div>
                <Button type="submit" variant="primary" size="md">
                  Analyze Custom Role
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsCustomMode(false)}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1">
                  <Select
                    id="target-role-control"
                    value={currentRole}
                    onChange={(e) => onSelectRole(e.target.value)}
                    options={selectOptions}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onRefresh}
                    disabled={isLoading || !currentRole}
                    leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
                    title="Re-run matching analysis"
                  >
                    Re-Analyze
                  </Button>
                  {currentRole && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={onClearRole}
                      title="Clear target role to view unanalyzed state"
                      leftIcon={<X className="w-3.5 h-3.5 text-slate-400" />}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Simulation / Testing Tools */}
          <div className="lg:border-l lg:border-slate-200 lg:pl-4 flex flex-col justify-center space-y-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              API State Simulation
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulateError(!simulateError)}
                className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  simulateError
                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60'
                }`}
                title="Toggle simulated network error to inspect Error State and Retry flow"
              >
                <AlertOctagon className="w-3 h-3" />
                <span>Simulate Error: {simulateError ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Role Quick-Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Popular Benchmarks:</span>
          {BENCHMARK_ROLES.map((r) => {
            const isSelected = r.roleName === currentRole;
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => onSelectRole(r.roleName)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.roleName}
              </button>
            );
          })}
        </div>

        {/* Selected Role Metadata Context */}
        {currentRole && roleDescription && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 flex-wrap">
              <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-medium text-slate-800">{currentRole}</span>
              <span className="text-slate-300">•</span>
              <Badge variant="neutral" size="sm">
                Seniority: {seniorityLevel}
              </Badge>
              <Badge variant="info" size="sm">
                Demand: {industryDemand}
              </Badge>
            </div>
            <p className="text-slate-500 italic max-w-xl text-right sm:truncate">
              {roleDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
