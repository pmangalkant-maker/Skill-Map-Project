import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Target,
  Briefcase,
  Map,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  FileUp,
  Handshake,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavItemKey } from '../../types';
import { Badge } from '../ui/Badge';

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: (ctx: ReturnType<typeof useApp>) => React.ReactNode;
}

const navItems: NavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'my-skills',
    label: 'My Skills',
    icon: Compass,
    badge: (ctx) => <Badge variant="neutral" size="sm">{ctx.skills.length}</Badge>,
  },
  {
    key: 'skill-gap',
    label: 'Skill Gap',
    icon: Target,
    badge: (ctx) => (
      <Badge variant="warning" size="sm">
        {ctx.gapMetric.criticalGapsCount} Gaps
      </Badge>
    ),
  },
  {
    key: 'jobs',
    label: 'Jobs & Internships',
    icon: Briefcase,
    badge: (ctx) => (
      <Badge variant="primary" size="sm">
        {ctx.opportunities.length}
      </Badge>
    ),
  },
  {
    key: 'roadmap',
    label: 'Learning Roadmap',
    icon: Map,
    badge: (ctx) => (
      <Badge variant="success" size="sm">
        {Math.round((ctx.user.completedRoadmapModules / ctx.user.totalRoadmapModules) * 100)}%
      </Badge>
    ),
  },
  {
    key: 'skill-assessment',
    label: 'Skill Assessment',
    icon: ClipboardCheck,
  },
  {
    key: 'resume-upload',
    label: 'Resume Upload',
    icon: FileUp,
    badge: (ctx) =>
      ctx.uploadedResume ? (
        <Badge variant="success" size="sm">
          Uploaded
        </Badge>
      ) : undefined,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    key: 'platform-hub',
    label: 'Career & Collaboration',
    icon: Handshake,
  },
  {
    key: 'ai-assistant',
    label: 'AI Career Assistant',
    icon: Sparkles,
    badge: () => <Badge variant="primary" size="sm">AI</Badge>,
  },
];

export const Sidebar: React.FC = () => {
  const context = useApp();
  const { activeNav, setActiveNav, sidebarCollapsed, setSidebarCollapsed, user, logout } = context;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#08111f] border-r border-slate-700/80 transition-all duration-200 shrink-0 z-20 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-700/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-slate-100 text-base leading-tight tracking-tight">
                Skill Map
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Opportunity Engine
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          {!sidebarCollapsed && (
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveNav(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-semibold shadow-2xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!sidebarCollapsed && item.badge && <div>{item.badge(context)}</div>}
            </button>
          );
        })}
      </div>

      {/* Target Readiness Summary Footer Card */}
      {!sidebarCollapsed ? (
        <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Role Readiness
            </span>
            <span className="font-bold text-slate-900">{user.readinessScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${user.readinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 truncate" title={user.targetRole}>
            Target: <span className="font-medium text-slate-700">{user.targetRole}</span>
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-3 pt-2.5 border-t border-slate-200/80 w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Sign out of Skill Map"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="p-3 text-center border-t border-slate-100 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-blue-600">{user.readinessScore}%</span>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
