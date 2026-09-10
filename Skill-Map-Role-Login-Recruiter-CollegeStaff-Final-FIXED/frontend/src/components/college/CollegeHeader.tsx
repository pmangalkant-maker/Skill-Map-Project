import React from 'react';
import { Building2, Bell, LogOut, ShieldCheck } from 'lucide-react';
import { CollegeStaffNotification, CollegeProfileData } from '../../types';

interface CollegeHeaderProps {
  profile: CollegeProfileData | null;
  userName?: string;
  notifications: CollegeStaffNotification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onMarkRead: (id: string) => void;
  onLogout: () => void;
}

export const CollegeHeader: React.FC<CollegeHeaderProps> = ({
  profile,
  userName,
  notifications,
  showNotifications,
  setShowNotifications,
  onMarkRead,
  onLogout
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Skill Map</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                Institution Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {profile?.institutionName || 'Apex Institute of Science & Technology'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Accreditation Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NAAC A++ · NBA Tier-1</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-sm font-bold text-white">Institutional Alerts</span>
                  <span className="text-xs text-indigo-400 font-medium">{unreadCount} unread</span>
                </div>
                <div className="divide-y divide-slate-700/60 max-h-80 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkRead(n.id)}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                        n.read ? 'text-slate-400 hover:bg-slate-700/40' : 'bg-slate-700/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">
              {profile?.headOfPlacement || userName || 'Placement Dean'}
            </span>
            <span className="text-[10px] text-slate-400">
              {profile?.headTitle || 'Dean - Industry Relations'}
            </span>
          </div>

          {/* Sign Out */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-rose-950/40 hover:border-rose-800/50 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
