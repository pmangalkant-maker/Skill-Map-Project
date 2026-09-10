import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, BriefcaseBusiness, Building2, GraduationCap, Check } from 'lucide-react';
import { CollegeStaffNotification } from '../../../types';

interface NotificationsTabProps {
  notifications: CollegeStaffNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'drive':
        return <BriefcaseBusiness className="w-4 h-4 text-indigo-400" />;
      case 'recruiter':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'internship':
        return <BriefcaseBusiness className="w-4 h-4 text-cyan-400" />;
      case 'faculty':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Institutional Notifications &amp; System Alerts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Placement updates, recruiter messages, internship applications, and urgent skill gap intervention triggers.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl divide-y divide-slate-750 overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={`p-4 flex items-start justify-between transition-colors cursor-pointer ${
              n.read ? 'hover:bg-slate-750/50 text-slate-400' : 'bg-slate-800/40 hover:bg-slate-750/70 text-slate-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                  <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 ml-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(n.id);
                }}
                className={`p-1.5 rounded-lg text-xs ${
                  n.read ? 'text-slate-500 hover:text-slate-300' : 'text-indigo-400 hover:text-indigo-300 bg-indigo-950/40'
                }`}
                title={n.read ? 'Already read' : 'Mark as read'}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
