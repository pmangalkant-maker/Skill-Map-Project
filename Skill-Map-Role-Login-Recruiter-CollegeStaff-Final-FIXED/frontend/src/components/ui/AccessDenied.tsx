import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AccessDeniedProps {
  currentPath: string;
  userRole: string;
  allowedRoleName: string;
  onReturn: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  currentPath,
  userRole,
  allowedRoleName,
  onReturn
}) => {
  const { logout } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
          <span>HTTP 403 • Access Denied</span>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight mb-2">
          Restricted Portal Access
        </h1>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          You are currently signed in as{' '}
          <span className="font-semibold text-white capitalize">{userRole.replace('_', ' ')}</span>,
          which does not have authorization to view <code className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 text-[11px]">{currentPath}</code>.
          This route is restricted to <strong className="text-slate-200">{allowedRoleName}</strong> accounts only.
        </p>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs mb-6 text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Requested Path:</span>
            <span className="text-slate-200 font-mono">{currentPath}</span>
          </div>
          <div className="flex justify-between">
            <span>Your Active Role:</span>
            <span className="text-slate-200 font-semibold capitalize">{userRole.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Required Authorization:</span>
            <span className="text-rose-400 font-semibold">{allowedRoleName}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onReturn}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Your Dashboard</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
