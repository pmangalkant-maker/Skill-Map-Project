import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './views/DashboardView';
import { MySkillsView } from './views/MySkillsView';
import { SkillGapView } from './views/SkillGapView';
import { JobsInternshipsView } from './views/JobsInternshipsView';
import { LearningRoadmapView } from './views/LearningRoadmapView';
import { ProfileView } from './views/ProfileView';
import { ResumeUploadView } from './views/ResumeUploadView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { LandingView } from './views/LandingView';
import { FoundationGuideModal } from './components/ui/FoundationGuideModal';
import { Sparkles } from 'lucide-react';
import { PlatformHubView } from './views/PlatformHubView';
import { AICareerAssistantView } from './views/AICareerAssistantView';
import { SkillAssessmentView } from './views/SkillAssessmentView';
import { AppErrorBoundary } from './components/ui/AppErrorBoundary';
import { RecruiterDashboardView } from './views/RecruiterDashboardView';
import { CollegeStaffDashboardView } from './views/CollegeStaffDashboardView';
import { AccessDenied } from './components/ui/AccessDenied';

const MainAppContent: React.FC = () => {
  const { activeNav, isAuthenticated, authView, user } = useApp();
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Track active URL path and hash changes for role routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase().replace('#', '');
      if (p.includes('/recruiter') || h.includes('recruiter')) return '/recruiter';
      if (p.includes('/college-staff') || h.includes('college-staff')) return '/college-staff';
      if (p.includes('/student') || h.includes('student')) return '/student';
      return p || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase().replace('#', '');
      if (p.includes('/recruiter') || h.includes('recruiter')) {
        setCurrentPath('/recruiter');
      } else if (p.includes('/college-staff') || h.includes('college-staff')) {
        setCurrentPath('/college-staff');
      } else if (p.includes('/student') || h.includes('student')) {
        setCurrentPath('/student');
      } else {
        setCurrentPath(p || '/');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path.toLowerCase());
    }
  };

  const isRecruiter = user.role === 'recruiter' || (user.role as string) === 'industry';
  const isCollegeStaff = user.role === 'college_staff' || (user.role as string) === 'institution' || (user.role as string) === 'academician';
  const isStudent = !isRecruiter && !isCollegeStaff;

  // Keep URL in sync with role on successful authentication
  useEffect(() => {
    if (!isAuthenticated) return;
    if (isRecruiter && currentPath !== '/college-staff' && !window.location.pathname.includes('/recruiter')) {
      window.history.replaceState({}, '', '/recruiter');
      setCurrentPath('/recruiter');
    } else if (isCollegeStaff && currentPath !== '/recruiter' && !window.location.pathname.includes('/college-staff')) {
      window.history.replaceState({}, '', '/college-staff');
      setCurrentPath('/college-staff');
    }
  }, [isAuthenticated, isRecruiter, isCollegeStaff, currentPath]);

  // Unauthenticated Flow
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 antialiased text-slate-900">
        {authView === 'landing' ? <LandingView /> : authView === 'register' ? <RegisterView /> : <LoginView />}
        <button type="button" onClick={() => setGuideModalOpen(true)} className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg hover:bg-slate-800 transition-all hover:scale-102 border border-slate-700 select-none cursor-pointer" title="Open Design System Foundation Guide">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>UI Foundation Spec</span>
        </button>
        <FoundationGuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
      </div>
    );
  }

  // AUTHORIZATION & ROLE ROUTING GUARDS

  // 1. Student Access Control: Student cannot access /recruiter or /college-staff
  if (isStudent) {
    if (currentPath === '/recruiter') {
      return (
        <AccessDenied
          currentPath="/recruiter"
          userRole="Student"
          allowedRoleName="Recruiter"
          onReturn={() => navigateTo('/')}
        />
      );
    }
    if (currentPath === '/college-staff') {
      return (
        <AccessDenied
          currentPath="/college-staff"
          userRole="Student"
          allowedRoleName="College Staff"
          onReturn={() => navigateTo('/')}
        />
      );
    }
  }

  // 2. Recruiter Access Control: Recruiter cannot access /college-staff
  if (isRecruiter) {
    if (currentPath === '/college-staff') {
      return (
        <AccessDenied
          currentPath="/college-staff"
          userRole="Recruiter"
          allowedRoleName="College Staff"
          onReturn={() => navigateTo('/recruiter')}
        />
      );
    }
    return <RecruiterDashboardView />;
  }

  // 3. College Staff Access Control: College Staff cannot access /recruiter
  if (isCollegeStaff) {
    if (currentPath === '/recruiter') {
      return (
        <AccessDenied
          currentPath="/recruiter"
          userRole="College Staff"
          allowedRoleName="Recruiter"
          onReturn={() => navigateTo('/college-staff')}
        />
      );
    }
    return <CollegeStaffDashboardView />;
  }

  // 4. Student Portal Views (LOCKED & PRESERVED)
  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard': return <DashboardView />;
      case 'my-skills': return <MySkillsView />;
      case 'skill-gap': return <SkillGapView />;
      case 'jobs': return <JobsInternshipsView />;
      case 'roadmap': return <LearningRoadmapView />;
      case 'resume-upload': return <ResumeUploadView />;
      case 'skill-assessment': return <SkillAssessmentView />;
      case 'profile': return <ProfileView />;
      case 'platform-hub': return <PlatformHubView />;
      case 'ai-assistant': return <AICareerAssistantView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08111f] flex flex-col antialiased text-slate-100">
      <AppErrorBoundary>
        <div className="flex flex-1 min-h-screen">
          <Sidebar />
          <MobileNav />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 pb-16">{renderActiveView()}</main>
          </div>
        </div>
      </AppErrorBoundary>
      <button type="button" onClick={() => setGuideModalOpen(true)} className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg hover:bg-slate-800 transition-all hover:scale-102 border border-slate-700 select-none cursor-pointer" title="Open Design System Foundation Guide">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>UI Foundation Spec</span>
      </button>
      <FoundationGuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

