import React, { useState } from 'react';
import {
  Menu,
  Bell,
  SlidersHorizontal,
  Compass,
  Check,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchInput } from '../ui/SearchInput';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const {
    user,
    searchQuery,
    setSearchQuery,
    demoState,
    setDemoState,
    setMobileMenuOpen,
    setActiveNav,
    logout,
    setIsAuthenticated,
    setAuthView,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [stateSwitcherOpen, setStateSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 bg-[#08111f]/95 backdrop-blur-xs border-b border-slate-700/80 h-16 transition-all">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & Brand (on mobile) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-100 text-base tracking-tight">Skill Map</span>
          </div>

          {/* Quick search input on desktop */}
          <div className="hidden md:block w-64 lg:w-80">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search skills, opportunities, or roadmaps..."
              sizeVariant="sm"
            />
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* UI Foundation State Tester Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStateSwitcherOpen(!stateSwitcherOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Toggle foundation state simulation"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">UI State:</span>
              <span className="capitalize font-semibold text-slate-100">{demoState}</span>
            </button>

            {stateSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setStateSwitcherOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-lg border border-slate-700 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    State Foundation Simulation
                  </div>
                  {(['normal', 'loading', 'empty', 'error'] as const).map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => {
                        setDemoState(state);
                        setStateSwitcherOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors"
                    >
                      <span className="capitalize text-slate-200">
                        {state === 'normal' ? 'Normal (Default)' : `${state} State`}
                      </span>
                      {demoState === state && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                    <span className="text-xs font-semibold text-slate-100">Notifications</span>
                    <Badge variant="primary" size="sm">2 New</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-900">
                      <p className="font-medium text-slate-100">Opportunity Match</p>
                      <p className="text-slate-400 mt-0.5 text-[11px]">
                        New opportunity matched at 89% based on your recent skill verification.
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      <p className="font-medium text-slate-900">Roadmap Milestone</p>
                      <p className="text-slate-400 mt-0.5 text-[11px]">
                        Containerization milestone marked as completed.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User profile dropdown trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/80 flex items-center justify-center font-semibold text-xs shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-semibold text-slate-100 leading-tight">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[120px]">
                  {user.targetRole}
                </div>
              </div>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-lg border border-slate-700 py-1 z-50 divide-y divide-slate-700">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-semibold text-slate-100 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    <div className="mt-1.5">
                      <Badge variant="primary" size="sm">Active Session</Badge>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Profile &amp; Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsAuthenticated(false);
                        setAuthView('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <Compass className="w-4 h-4 text-slate-400" />
                      <span>Platform Overview / Flow</span>
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-950/40 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out to Login</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
