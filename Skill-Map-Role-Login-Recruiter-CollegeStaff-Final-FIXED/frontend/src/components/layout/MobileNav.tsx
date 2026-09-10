import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Target,
  Briefcase,
  Map,
  User,
  X,
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

export const MobileNav: React.FC = () => {
  const context = useApp();
  const { mobileMenuOpen, setMobileMenuOpen, activeNav, setActiveNav, user } = context;

  if (!mobileMenuOpen) return null;

  const navItems: Array<{
    key: NavItemKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: React.ReactNode;
  }> = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      key: 'my-skills',
      label: 'My Skills',
      icon: Compass,
      badge: <Badge variant="neutral" size="sm">{context.skills.length}</Badge>,
    },
    {
      key: 'skill-gap',
      label: 'Skill Gap',
      icon: Target,
      badge: <Badge variant="warning" size="sm">{context.gapMetric.criticalGapsCount}</Badge>,
    },
    {
      key: 'jobs',
      label: 'Jobs & Internships',
      icon: Briefcase,
      badge: <Badge variant="primary" size="sm">{context.opportunities.length}</Badge>,
    },
    {
      key: 'roadmap',
      label: 'Learning Roadmap',
      icon: Map,
      badge: <Badge variant="success" size="sm">{context.user.completedRoadmapModules}/{context.user.totalRoadmapModules}</Badge>,
    },
    { key: 'skill-assessment', label: 'Skill Assessment', icon: ClipboardCheck },
    {
      key: 'resume-upload',
      label: 'Resume Upload',
      icon: FileUp,
      badge: context.uploadedResume ? <Badge variant="success" size="sm">Uploaded</Badge> : undefined,
    },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'platform-hub', label: 'Career & Collaboration', icon: Handshake },
    { key: 'ai-assistant', label: 'AI Career Assistant', icon: Sparkles, badge: <Badge variant="primary" size="sm">AI</Badge> },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#08111f] h-full shadow-2xl flex flex-col z-10 border-r border-slate-700">
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-100 text-base">Skill Map</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveNav(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-700 bg-slate-50">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-100 truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.targetRole}</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" /> Readiness:
            </span>
            <span className="font-bold text-slate-100">{user.readinessScore}%</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              context.logout();
            }}
            className="mt-3 pt-2.5 border-t border-slate-700 w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
