import React, { useState } from 'react';
import {
  Compass,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
  UserCheck,
  Building2,
  UsersRound,
  GraduationCap,
  Briefcase,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const LoginView: React.FC = () => {
  const { login, register, setActiveNav, user, updateUser, setAuthView, registeredEmail } = useApp();

  const [selectedRole, setSelectedRole] = useState<'student' | 'recruiter' | 'college_staff'>('student');

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [email, setEmail] = useState(registeredEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States (Optional toggle view)
  const [registerName, setRegisterName] = useState('');
  const [registerRole, setRegisterRole] = useState('Full Stack Cloud Engineer');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password Modal States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // UI / Async State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [simulateAuthError, setSimulateAuthError] = useState(false);

  // Field validation helpers
  const validateEmailFormat = (val: string): boolean => {
    // Standard RFC-compliant email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Submit Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    // 1. Validate required email and email format
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmailFormat(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.edu).';
    }

    // 2. Validate required password
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear field errors
    setErrors({});
    setIsLoading(true);

    try {
      // Execute REAL backend login via API
      const result = await login({
        email: trimmedEmail,
        password,
        rememberMe,
        role: selectedRole,
      });

      if (!result.success) {
        setErrors({
          general: result.error || 'Invalid email or password. Please verify your credentials.',
        });
        return;
      }

      // Update email in active profile if changed, preserving candidate structure
      if (trimmedEmail) {
        updateUser({ email: trimmedEmail });
      }

      // Navigate to dashboard
      setActiveNav('dashboard');
    } catch (err: any) {
      setErrors({
        general: err?.message || 'An unexpected connection error occurred during authentication. Please retry.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const trimmedEmail = email.trim();

    if (!registerName.trim()) {
      newErrors.general = 'Full name is required for registration.';
    }
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmailFormat(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Execute REAL backend registration via API
      const result = await register({
        name: registerName.trim(),
        email: trimmedEmail,
        password,
        targetRole: registerRole || user.targetRole,
        role: selectedRole,
      });

      if (!result.success) {
        setErrors({
          general: result.error || 'Registration failed. Please check the provided information.',
        });
        return;
      }

      setActiveNav('dashboard');
    } catch (err: any) {
      setErrors({
        general: err?.message || 'Could not create account at this time. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    if (!validateEmailFormat(forgotEmail)) {
      setForgotError('Please enter a valid email address format.');
      return;
    }

    setForgotError('');
    setForgotLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 750));
      setForgotSubmitted(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 flex flex-col justify-between antialiased px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header / Platform Brand */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between pb-6 sm:pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">Skill Map</span>
              <Badge variant="primary" size="sm">Career Platform</Badge>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Skill Mapping &amp; Opportunity Recommendation System
            </p>
          </div>
        </div>

        {/* Development testing aid: quick toggle for Error state simulation & Back to Landing */}
        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAuthView('landing')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Overview
          </Button>
          <button
            type="button"
            onClick={() => setSimulateAuthError((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              simulateAuthError
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle to test how general authentication error state renders"
          >
            {simulateAuthError ? 'Simulating Error: ON' : 'Test Error State'}
          </button>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <div className="w-full max-w-md mx-auto my-auto">
        <Card className="shadow-lg border-slate-200/80 bg-white/95 backdrop-blur-xs">
          <CardContent className="p-6 sm:p-8">
            {/* Form Header */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
                {authMode === 'login' ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <UserCheck className="w-6 h-6" />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {authMode === 'login' ? 'Sign in to Skill Map' : 'Create Candidate Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
                {authMode === 'login'
                  ? 'Access your career readiness matrix, skill benchmarks, and matched opportunities.'
                  : 'Start mapping competencies and benchmarking your skills against target roles.'}
              </p>
            </div>

            {/* General Authentication Error Banner */}
            {errors.general && (
              <div className="mb-5">
                <Alert
                  variant="error"
                  title="Authentication Error"
                  message={errors.general}
                  onDismiss={() => setErrors((prev) => ({ ...prev, general: undefined }))}
                />
              </div>
            )}

            {/* Simulated Error State Indicator Banner if enabled */}
            {simulateAuthError && !errors.general && (
              <div className="mb-5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Error simulation enabled. Submitting will trigger auth failure.</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                {/* Role Selection - Clearly Visible 'Login as' Section with 3 Role Cards */}
                <div className="space-y-2.5 pb-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 tracking-wide">
                      Login as
                    </label>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Login as {selectedRole === 'student' ? 'Student' : selectedRole === 'recruiter' ? 'Recruiter' : 'College Staff'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        value: 'student' as const,
                        label: 'Student',
                        portal: 'Student Portal',
                        icon: GraduationCap,
                        defaultEmail: 'alex.rivers@example.com'
                      },
                      {
                        value: 'recruiter' as const,
                        label: 'Recruiter',
                        portal: 'Industry Portal',
                        icon: Briefcase,
                        defaultEmail: 'recruiter@skillmap.demo'
                      },
                      {
                        value: 'college_staff' as const,
                        label: 'College Staff',
                        portal: 'Institution',
                        icon: Building2,
                        defaultEmail: 'staff@skillmap.demo'
                      },
                    ].map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role.value);
                            // Auto-fill demo credentials if empty or matching demo values
                            if (!email || email === 'alex.rivers@example.com' || email === 'recruiter@skillmap.demo' || email === 'staff@skillmap.demo') {
                              setEmail(role.defaultEmail);
                              setPassword('Password123!');
                            }
                          }}
                          disabled={isLoading}
                          className={`relative rounded-xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[96px] ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                            isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold leading-tight block text-slate-900">
                              {role.label}
                            </span>
                            <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                              {role.portal}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                    <span>
                      Active: <strong className="text-slate-800 font-semibold">{selectedRole === 'student' ? 'Student' : selectedRole === 'recruiter' ? 'Recruiter' : 'College Staff'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRole === 'recruiter') {
                          setEmail('recruiter@skillmap.demo');
                          setPassword('Password123!');
                        } else if (selectedRole === 'college_staff') {
                          setEmail('staff@skillmap.demo');
                          setPassword('Password123!');
                        } else {
                          setEmail('alex.rivers@example.com');
                          setPassword('Password123!');
                        }
                      }}
                      className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <Input
                    id="login-email"
                    type="email"
                    label="Email Address"
                    placeholder="candidate@institution.edu"
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                    leftIcon={<Mail className="w-4 h-4" />}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <div className="w-full flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="text-xs font-semibold text-slate-700">
                        Password <span className="text-rose-500 ml-0.5">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotModalOpen(true);
                          setForgotEmail(email);
                          setForgotSubmitted(false);
                          setForgotError('');
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors select-none"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                        className={`w-full text-sm text-slate-900 bg-white border rounded-lg pl-9 pr-10 py-2 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
                          errors.password
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isLoading}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-xs text-rose-600 font-medium">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="pt-1">
                  <Checkbox
                    id="remember-me-checkbox"
                    label="Remember me on this device"
                    description="Keep me securely signed in for 30 days"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full justify-center shadow-sm font-semibold"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isLoading
                      ? 'Authenticating...'
                      : `Login as ${selectedRole === 'student' ? 'Student' : selectedRole === 'recruiter' ? 'Recruiter' : 'College Staff'}`}
                  </Button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                <div>
                  <Input
                    id="register-name"
                    type="text"
                    label="Full Name / Display Title"
                    placeholder="Candidate Name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    leftIcon={<UserCheck className="w-4 h-4" />}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Input
                    id="register-email"
                    type="email"
                    label="Academic or Professional Email"
                    placeholder="candidate@institution.edu"
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                    leftIcon={<Mail className="w-4 h-4" />}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Input
                    id="register-role"
                    type="text"
                    label="Target Career Goal / Role"
                    placeholder="e.g. Cloud Architect, Data Engineer"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    hint="Can be customized or updated later in Profile."
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-password" className="text-xs font-semibold text-slate-700">
                    Create Password <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      required
                      className={`w-full text-sm text-slate-900 bg-white border rounded-lg pl-9 pr-10 py-2 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-confirm-password" className="text-xs font-semibold text-slate-700">
                    Confirm Password <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className={`w-full text-sm text-slate-900 bg-white border rounded-lg pl-9 pr-10 py-2 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full justify-center shadow-sm font-semibold"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account & Continue'}
                  </Button>
                </div>
              </form>
            )}

            {/* Toggle Between Login and Register */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
              {authMode === 'login' ? (
                <p className="text-xs sm:text-sm text-slate-600">
                  New to Skill Map?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('register');
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Create a candidate profile</span>
                  </button>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrors({});
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    <span>Sign in here</span>
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Career Platform Security Note */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Encrypted Authentication</span>
          </span>
          <span>•</span>
          <span>Career Benchmark Security</span>
          <span>•</span>
          <span>SSO Compatible</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 text-center text-xs text-slate-400">
        Skill Map &copy; 2026 — Competency Mapping &amp; Career Opportunity Recommendation Engine
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        description="Enter your registered academic or professional email address to receive password recovery instructions."
        maxWidth="md"
        footer={
          forgotSubmitted ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Back to Login
            </Button>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
                disabled={forgotLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleForgotSubmit}
                isLoading={forgotLoading}
                disabled={forgotLoading}
              >
                Send Reset Link
              </Button>
            </div>
          )
        }
      >
        {forgotSubmitted ? (
          <div className="py-3 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">Recovery Link Dispatched</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              If an account matches <span className="font-semibold text-slate-800">{forgotEmail}</span>, password reset instructions have been sent. Please check your inbox and follow the secure link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 py-1">
            <Input
              id="forgot-email-input"
              type="email"
              label="Account Email"
              placeholder="candidate@institution.edu"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                setForgotError('');
              }}
              error={forgotError}
              leftIcon={<Mail className="w-4 h-4" />}
              autoFocus
              required
            />
            <p className="text-xs text-slate-500">
              For security reasons, recovery tokens expire after 30 minutes. Contact your campus or organization administrator if you no longer have access to this address.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
};
