import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2, TrendingUp, Users, Building2 } from 'lucide-react';
import { CollegeReportsAnalytics } from '../../../types';

interface ReportsTabProps {
  analytics: CollegeReportsAnalytics | null;
  onExportReport: (type: 'csv' | 'pdf') => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ analytics, onExportReport }) => {
  const [downloading, setDownloading] = useState<'csv' | 'pdf' | null>(null);

  const handleExport = (type: 'csv' | 'pdf') => {
    setDownloading(type);
    onExportReport(type);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Institutional Reports &amp; Placement Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready skill distributions, year-over-year hiring trajectories, and exportable regulatory accreditation portfolios.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            disabled={downloading !== null}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            {downloading === 'csv' ? 'Exporting CSV...' : 'Export CSV Dataset'}
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={downloading !== null}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            {downloading === 'pdf' ? 'Generating PDF...' : 'Download Executive PDF'}
          </button>
        </div>
      </div>

      {/* Year-over-Year Placement Trends */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-1">5-Year Historical Campus Placement Trajectory</h3>
        <p className="text-[11px] text-slate-400 mb-4">Total campus placement offers and average compensation packages</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {analytics?.placementTrendsOverTime?.map((trend, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 text-center">
              <div className="text-xs font-bold text-indigo-400">{trend.year}</div>
              <div className="text-xl font-bold text-white mt-1">{trend.placed}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{trend.placementRate} Placed</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg CTC: {trend.avgSalary}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Recruiting Companies & Hiring Volume */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3">Top Corporate Hiring Partners &amp; Volume</h3>
          <div className="space-y-3">
            {analytics?.topRecruitingCompanies?.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-white">{comp.name}</div>
                  <div className="text-[11px] text-slate-400">Primary Role: {comp.roles}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{comp.hires} Hires</div>
                  <div className="text-[10px] text-indigo-300">{comp.avgPackage} CTC</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Placement Readiness Breakdown */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Student Readiness Tier Distribution</h3>
            <p className="text-[11px] text-slate-400 mb-4">Competency scoring breakdown for NAAC/NBA auditing</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-200">Tier 1: High Corporate Readiness (85%+)</span>
                  <span className="font-bold text-emerald-400">
                    {analytics?.readinessDistribution?.readyAbove85 || '48%'}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '48%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Eligible for dream &amp; super-dream tier-1 recruitment drives.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-indigo-200">Tier 2: Moderate Readiness (70% - 84%)</span>
                  <span className="font-bold text-indigo-400">
                    {analytics?.readinessDistribution?.moderate70to84 || '38%'}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '38%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Mass hiring eligible; requires 2-week brush-up on system design.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-amber-200">Tier 3: Academic Remediation Required (&lt;70%)</span>
                  <span className="font-bold text-amber-400">
                    {analytics?.readinessDistribution?.needsImprovementBelow70 || '14%'}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '14%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Assigned to faculty mentoring and weekend laboratory bootcamps.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified By: Internal Quality Assurance Cell (IQAC)</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> NAAC Evidence Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
