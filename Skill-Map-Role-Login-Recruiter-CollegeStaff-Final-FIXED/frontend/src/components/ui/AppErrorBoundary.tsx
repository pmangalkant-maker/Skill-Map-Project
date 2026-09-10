import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message: string }

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'Unexpected application error' };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Skill Map UI crash prevented:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg w-full bg-white border border-rose-200 rounded-2xl p-6 text-center shadow-sm"><div className="text-rose-600 font-bold text-lg">Something went wrong while rendering this section.</div><p className="text-sm text-slate-600 mt-2">Your data is safe. Refresh this section and continue.</p><p className="text-xs text-slate-400 mt-3 break-words">{this.state.message}</p><button className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold" onClick={() => window.location.reload()}>Refresh Skill Map</button></div></div>;
    }
    return this.props.children;
  }
}
