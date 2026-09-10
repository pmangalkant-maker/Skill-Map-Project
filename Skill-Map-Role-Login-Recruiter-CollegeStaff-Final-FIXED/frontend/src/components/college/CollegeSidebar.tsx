import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  AlertTriangle,
  BriefcaseBusiness,
  Award,
  Building2,
  GraduationCap,
  Handshake,
  BarChart3,
  Bell,
  School
} from 'lucide-react';

export type CollegeStaffTab =
  | 'overview'
  | 'students'
  | 'skill-intelligence'
  | 'skill-gaps'
  | 'internships'
  | 'placements'
  | 'recruiters'
  | 'faculty'
  | 'collaboration'
  | 'reports'
  | 'notifications'
  | 'profile';

interface CollegeSidebarProps {
  activeTab: CollegeStaffTab;
  setActiveTab: (tab: CollegeStaffTab) => void;
  studentsCount: number;
  gapAlertsCount: number;
  unreadNotifications: number;
}

interface NavItem {
  key: CollegeStaffTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | number | null;
  badgeColor?: string;
}

export const CollegeSidebar: React.FC<CollegeSidebarProps> = ({
  activeTab,
  setActiveTab,
  studentsCount,
  gapAlertsCount,
  unreadNotifications
}) => {
  const navItems: NavItem[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { key: 'students', label: 'Student Progress', icon: Users, badge: studentsCount || '2.4k' },
    { key: 'skill-intelligence', label: 'Skill Intelligence', icon: Compass, badge: 'AI' },
    { key: 'skill-gaps', label: 'Skill Gaps & Alerts', icon: AlertTriangle, badge: gapAlertsCount > 0 ? `${gapAlertsCount}` : null, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { key: 'internships', label: 'Internship Tracking', icon: BriefcaseBusiness, badge: '164' },
    { key: 'placements', label: 'Placement Drives', icon: Award, badge: '91%' },
    { key: 'recruiters', label: 'Recruiter Connections', icon: Building2, badge: '52' },
    { key: 'faculty', label: 'Faculty Opportunities', icon: GraduationCap, badge: null },
    { key: 'collaboration', label: 'Industry Collaboration', icon: Handshake, badge: null },
    { key: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { key: 'notifications', label: 'Institutional Alerts', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : null },
    { key: 'profile', label: 'College Profile', icon: School, badge: null }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/80 p-2 shadow-xl sticky top-20">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Institution Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key as CollegeStaffTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isActive
                        ? 'bg-indigo-700 text-white border-indigo-400/40'
                        : item.badgeColor || 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
