import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Target,
  Briefcase,
  Map,
  Sparkles,
  LayoutDashboard,
  User,
  FileUp,
  LogIn,
  UserPlus,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { NavItemKey } from '../types';
import { SkillMap3DScene } from '../components/three/SkillMap3DScene';

interface FlowStepItem {
  number: number;
  id: string;
  title: string;
  category: 'Access' | 'Onboarding' | 'Analytics' | 'Career Readiness';
  description: string;
  navTarget?: NavItemKey;
  authTarget?: 'login' | 'register';
  icon: React.ComponentType<{ className?: string }>;
}

export const LandingView: React.FC = () => {
  const { setAuthView, setIsAuthenticated, setActiveNav, user } = useApp();
  const [selectedStep, setSelectedStep] = useState<number>(1);

  // The complete required flow for Skill Map
  const flowSteps: FlowStepItem[] = [
    {
      number: 1,
      id: 'landing',
      title: 'Landing / UI',
      category: 'Access',
      description: 'System overview, architecture transparency, and interactive feature navigation.',
      icon: Compass,
    },
    {
      number: 2,
      id: 'login',
      title: 'Login',
      category: 'Access',
      description: 'Secure candidate sign-in with credential authentication and password visibility toggles.',
      authTarget: 'login',
      icon: LogIn,
    },
    {
      number: 3,
      id: 'register',
      title: 'Register',
      category: 'Onboarding',
      description: 'Candidate account onboarding, password strength diagnostics, and target role objective setup.',
      authTarget: 'register',
      icon: UserPlus,
    },
    {
      number: 4,
      id: 'resume-upload',
      title: 'Resume Upload',
      category: 'Onboarding',
      description: 'Client-side PDF/DOCX ingestion, drag-and-drop validation, and text extraction staging.',
      navTarget: 'resume-upload',
      icon: FileUp,
    },
    {
      number: 5,
      id: 'profile',
      title: 'Profile',
      category: 'Onboarding',
      description: 'Comprehensive candidate credentials, degree, graduation year, bio, and career interests.',
      navTarget: 'profile',
      icon: User,
    },
    {
      number: 6,
      id: 'dashboard',
      title: 'Dashboard',
      category: 'Analytics',
      description: 'Unified career diagnostic dashboard showing profile readiness, skill gaps, and active roadmaps.',
      navTarget: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      number: 7,
      id: 'my-skills',
      title: 'My Skills',
      category: 'Analytics',
      description: 'Categorized competency inventory (Technical, Soft, Tools, Other) with verification states.',
      navTarget: 'my-skills',
      icon: Compass,
    },
    {
      number: 8,
      id: 'skill-gap',
      title: 'Skill Gap',
      category: 'Analytics',
      description: 'Objective multi-role competency gap benchmark analysis and anti-bias transparent scoring.',
      navTarget: 'skill-gap',
      icon: Target,
    },
    {
      number: 9,
      id: 'jobs',
      title: 'Jobs & Internships',
      category: 'Career Readiness',
      description: 'Curated career opportunities filtered by match score, work mode, and verified vs missing skills.',
      navTarget: 'jobs',
      icon: Briefcase,
    },
    {
      number: 10,
      id: 'roadmap',
      title: 'Learning Roadmap',
      category: 'Career Readiness',
      description: 'Personalized 5-stage learning sequence with modular lessons, milestones, and time tracking.',
      navTarget: 'roadmap',
      icon: Map,
    },
  ];

  const handleEnterStep = (step: FlowStepItem) => {
    if (step.authTarget) {
      setAuthView(step.authTarget);
    } else if (step.navTarget) {
      setIsAuthenticated(true);
      setActiveNav(step.navTarget);
    } else {
      setSelectedStep(1);
    }
  };

  const handleLaunchDemo = () => {
    setIsAuthenticated(true);
    setActiveNav('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col antialiased selection:bg-blue-500 selection:text-white overflow-hidden">
      <section className="relative min-h-[680px] overflow-hidden bg-[radial-gradient(circle_at_70%_35%,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_25%_70%,rgba(124,58,237,0.16),transparent_35%)]">
        <SkillMap3DScene />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> AI-powered Academia × Industry Career Intelligence
            </div>
            <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98]">
              Map your skills.
              <span className="block bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Build your future.</span>
            </h1>
            <p className="mt-7 text-lg sm:text-xl leading-8 text-slate-300 max-w-xl">
              A connected career platform that turns resumes and skills into gap analysis, learning paths, real opportunities, portfolios, mentorship and institutional intelligence.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={() => setAuthView('register')} className="rounded-2xl px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white shadow-xl shadow-blue-500/20">Get Started <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <Button variant="ghost" onClick={handleLaunchDemo} className="rounded-2xl px-6 py-3 border border-white/15 bg-white/5 text-white hover:bg-white/10">Explore Demo</Button>
            </div>
          </div>
          <div className="hidden lg:block h-[520px]" />
        </div>
      </section>
      <div className="bg-slate-50 text-slate-900">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">Skill Map</span>
                <Badge variant="primary" size="sm">Candidate Career Platform</Badge>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Skill Mapping, Gap Benchmark &amp; Opportunity Recommendation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthView('login')}
              className="text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium"
            >
              Sign In
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthView('register')}
              className="hidden sm:inline-flex text-xs sm:text-sm font-medium"
            >
              Register
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchDemo}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="text-xs sm:text-sm font-semibold shadow-xs"
            >
              Explore Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Skill Mapping &amp; Objective Gap Benchmark</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight sm:leading-tight">
            Map Your Competencies. Close Critical Gaps. Navigate Career Pathways.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Skill Map bridges academic achievement and employer expectations through evidence-based competency diagnostics, ethical opportunity matching, and adaptive learning roadmaps.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLaunchDemo}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-sm font-semibold px-6"
            >
              Enter Dashboard as Candidate
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setAuthView('register')}
              className="font-medium px-6 bg-white"
            >
              Create New Candidate Account
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Transparent &amp; Anti-Bias Scoring
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Dynamic Candidate Identity
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Client &amp; Backend-Ready APIs
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* REQUIRED 10-STEP COMPLETE PLATFORM FLOW (INTERACTIVE STEPPER) */}
        {/* ========================================================================= */}
        <section className="py-10 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="neutral" size="sm">End-to-End Architecture Flow</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                The Complete 10-Step Skill Map Journey
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Experience every stage of the candidate pathway from authentication and resume extraction to multi-role gap matching and adaptive learning.
              </p>
            </div>

            {/* Stepper Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {flowSteps.map((step) => {
                const Icon = step.icon;
                const isSelected = selectedStep === step.number;

                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step.number)}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {step.number}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {step.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 group">
                        {step.number === 1 ? 'Current View' : 'Launch Step'}
                        <ChevronRight className="w-3 h-3" />
                      </span>

                      {step.number !== 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnterStep(step);
                          }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 transition-colors cursor-pointer"
                        >
                          Open View
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Step Spotlight Preview */}
            {selectedStep && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold tracking-wide uppercase border border-blue-400/30">
                      Step {selectedStep} Active Focus
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {flowSteps[selectedStep - 1].category} Domain
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    {flowSteps[selectedStep - 1].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {flowSteps[selectedStep - 1].description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleEnterStep(flowSteps[selectedStep - 1])}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto font-semibold"
                  >
                    {selectedStep === 1
                      ? 'You are on Landing / UI'
                      : `Open ${flowSteps[selectedStep - 1].title} Screen`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CORE PLATFORM PILLARS */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="primary" size="sm">Core Architecture</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Engineered for Fairness &amp; Actionable Insights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Bridging candidates to verified career opportunities without black-box bias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <Card className="hover:shadow-xs transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Semantic Resume Parsing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ingests candidate resumes in PDF/DOCX formats, validates structural readability, and organizes technical, soft, and tool skills.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="hover:shadow-xs transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Multi-Role Gap Analytics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Benchmarks candidate competencies against curated target roles, highlighting high-priority missing skills with full audit explanations.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="hover:shadow-xs transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ethical Opportunities
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Career opportunities labeled transparently as benchmark sample data, detailing exact matched and missing competencies.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="hover:shadow-xs transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Adaptive Learning Roadmap
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structured 5-stage sequential curriculum (Foundation, Core, Advanced, Projects, Readiness) with verifiable milestones and hours tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ETHICAL NOTICE & SAMPLE DATA TRANSPARENCY BANNER */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs">
              <h4 className="text-sm font-bold text-amber-900">
                Ethical AI &amp; Sample Data Transparency Guarantee
              </h4>
              <p className="text-amber-800/90 leading-relaxed">
                Skill Map recommendations and match percentages are advisory diagnostic tools designed to inform candidate self-study and mentor discussions. Opportunities in the evaluation preview represent realistic benchmark data for roadmap alignment and do not constitute hiring commitments. Personal candidate identities are dynamically bound to candidate inputs and are never hardcoded.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900">Skill Map Platform</span>
            <span>—</span>
            <span>Production-Ready Frontend Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAuthView('login')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setAuthView('register')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Register
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              Live Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
};
