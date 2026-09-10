import React, { useState } from 'react';
import {
  Compass,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  FileUp,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Check,
  FileText,
  Sparkles,
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
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  terms?: string;
  general?: string;
}

interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const RegisterView: React.FC = () => {
  const { register, login, setAuthView, user, setIsAuthenticated, setActiveNav } = useApp();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Cloud Engineer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Show/Hide Password States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [simulateRegisterError, setSimulateRegisterError] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Dynamically registered data for success state display
  const [registeredData, setRegisteredData] = useState<{
    name: string;
    email: string;
    phone?: string;
    targetRole?: string;
  }>({ name: '', email: '' });

  // Calculate Password Strength
  const evaluatePassword = (pwd: string): { score: number; criteria: PasswordCriteria; label: string; color: string } => {
    const criteria: PasswordCriteria = {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };

    let score = 0;
    if (criteria.minLength) score += 1;
    if (criteria.hasUpper && criteria.hasLower) score += 1;
    if (criteria.hasNumber) score += 1;
    if (criteria.hasSpecial) score += 1;

    let label = 'Too Short';
    let color = 'bg-slate-200';

    if (pwd.length === 0) {
      label = '';
      color = 'bg-slate-200';
    } else if (score <= 1) {
      label = 'Weak';
      color = 'bg-rose-500';
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-600';
    } else {
      label = 'Strong';
      color = 'bg-emerald-600';
    }

    return { score, criteria, label, color };
  };

  const passwordEvaluation = evaluatePassword(password);

  // Validation functions
  const validateEmailFormat = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const validatePhoneFormat = (val: string): boolean => {
    if (!val.trim()) return true; // Optional field
    // Strip non-digits and check if at least 7 digits
    const digits = val.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  // Form Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // 1. Required Full Name
    if (!trimmedName) {
      newErrors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Required & Valid Email
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmailFormat(trimmedEmail)) {
      newErrors.email = 'Please enter a valid academic or professional email format (e.g. name@domain.edu).';
    }

    // 3. Optional Phone Validation
    if (trimmedPhone && !validatePhoneFormat(trimmedPhone)) {
      newErrors.phone = 'Please enter a valid telephone number format with area code.';
    }

    // 4. Password Strength & Length
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (passwordEvaluation.score < 2) {
      newErrors.password = 'Password is too weak. Include a mix of letters, numbers, and symbols.';
    }

    // 5. Confirm Password Matching
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // 6. Terms & Conditions Acceptance
    if (!agreeTerms) {
      newErrors.terms = 'You must accept the Terms of Service & Privacy Policy to register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and begin submission
    setErrors({});
    setIsLoading(true);

    try {
      // Execute real backend registration via API
      const result = await register({
        name: trimmedName,
        email: trimmedEmail,
        password,
        phone: trimmedPhone || undefined,
        targetRole: targetRole.trim() || undefined,
      });

      if (!result.success) {
        setErrors({
          general: result.error || 'Registration failed. Please check the provided information.',
        });
        return;
      }

      setRegisteredData({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        targetRole: targetRole.trim() || user.targetRole,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrors({
        general: err?.message || 'An unexpected connection error occurred during registration. Please retry.',
      });
    } finally {
      setIsLoading(false);
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

        {/* Development testing aid: quick toggle for Error state simulation & Overview */}
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
            onClick={() => setSimulateRegisterError((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              simulateRegisterError
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle to test registration error state handling"
          >
            {simulateRegisterError ? 'Simulating Error: ON' : 'Test Error State'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto my-auto">
        <Card className="shadow-lg border-slate-200/80 bg-white/95 backdrop-blur-xs">
          <CardContent className="p-6 sm:p-8">
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <Badge variant="success" size="md">Profile Initialized</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Registration Successful!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Welcome to Skill Map. Your candidate credentials and skill baseline profile have been recorded.
                  </p>
                </div>

                {/* Dynamic Summary Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-2.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Candidate Name:</span>
                    <span className="font-semibold text-slate-900">{registeredData.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Registered Email:</span>
                    <span className="font-semibold text-slate-900">{registeredData.email}</span>
                  </div>
                  {registeredData.phone && (
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                      <span className="text-slate-500 font-medium">Contact Phone:</span>
                      <span className="font-semibold text-slate-900">{registeredData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Target Career Track:</span>
                    <span className="font-semibold text-blue-700">{registeredData.targetRole}</span>
                  </div>
                </div>

                {/* Primary Action Buttons Following Candidate Journey Flow */}
                <div className="pt-2 space-y-2.5">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-sm font-semibold"
                    onClick={() => {
                      setIsAuthenticated(true);
                      setActiveNav('resume-upload');
                    }}
                    leftIcon={<FileUp className="w-4 h-4" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Resume Upload (Next Step)
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      className="justify-center text-xs"
                      onClick={() => {
                        setIsAuthenticated(true);
                        setActiveNav('profile');
                      }}
                    >
                      Complete Profile
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      className="justify-center text-xs"
                      onClick={() => {
                        setIsAuthenticated(true);
                        setActiveNav('dashboard');
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-slate-500 hover:text-slate-700 text-xs"
                    onClick={() => setAuthView('login')}
                  >
                    Proceed to Sign In Page Instead
                  </Button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <>
                {/* Header info */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Create Candidate Profile
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                    Map competencies against real industry benchmarks and unlock personalized job &amp; internship matches.
                  </p>
                </div>

                {/* General Registration Error Banner */}
                {errors.general && (
                  <div className="mb-5">
                    <Alert
                      variant="error"
                      title="Registration Error"
                      message={errors.general}
                      onDismiss={() => setErrors((prev) => ({ ...prev, general: undefined }))}
                    />
                  </div>
                )}

                {/* Simulated Error State Indicator Banner */}
                {simulateRegisterError && !errors.general && (
                  <div className="mb-5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Error simulation active. Submitting will trigger a registration conflict error.</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Input
                      id="register-full-name"
                      type="text"
                      label="Full Name"
                      placeholder="Candidate Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      error={errors.name}
                      leftIcon={<User className="w-4 h-4" />}
                      disabled={isLoading}
                      required
                      autoComplete="name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      id="register-email"
                      type="email"
                      label="Academic or Professional Email"
                      placeholder="candidate@institution.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      error={errors.email}
                      leftIcon={<Mail className="w-4 h-4" />}
                      disabled={isLoading}
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Two-Column: Phone & Target Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Optional Phone Field */}
                    <div>
                      <Input
                        id="register-phone"
                        type="tel"
                        label="Phone Number (Optional)"
                        placeholder="+1 (555) 019-2834"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        error={errors.phone}
                        leftIcon={<Phone className="w-4 h-4" />}
                        disabled={isLoading}
                        autoComplete="tel"
                      />
                    </div>

                    {/* Target Career Track */}
                    <div>
                      <Input
                        id="register-target-role"
                        type="text"
                        label="Target Career Track (Optional)"
                        placeholder="e.g. Cloud Engineer"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        leftIcon={<Briefcase className="w-4 h-4" />}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password with Strength Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="register-password" className="text-xs font-semibold text-slate-700">
                        Password <span className="text-rose-500 ml-0.5">*</span>
                      </label>
                      {password && (
                        <span className={`text-[11px] font-semibold ${
                          passwordEvaluation.score <= 1
                            ? 'text-rose-600'
                            : passwordEvaluation.score === 2
                            ? 'text-amber-600'
                            : passwordEvaluation.score === 3
                            ? 'text-blue-600'
                            : 'text-emerald-600'
                        }`}>
                          Strength: {passwordEvaluation.label}
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        disabled={isLoading}
                        required
                        autoComplete="new-password"
                        className={`w-full text-sm text-slate-900 bg-white border rounded-lg pl-9 pr-10 py-2 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
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
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Visual Bar */}
                    {password.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          <div className={`rounded-full transition-colors duration-200 ${
                            passwordEvaluation.score >= 1 ? passwordEvaluation.color : 'bg-slate-200'
                          }`} />
                          <div className={`rounded-full transition-colors duration-200 ${
                            passwordEvaluation.score >= 2 ? passwordEvaluation.color : 'bg-slate-200'
                          }`} />
                          <div className={`rounded-full transition-colors duration-200 ${
                            passwordEvaluation.score >= 3 ? passwordEvaluation.color : 'bg-slate-200'
                          }`} />
                          <div className={`rounded-full transition-colors duration-200 ${
                            passwordEvaluation.score >= 4 ? passwordEvaluation.color : 'bg-slate-200'
                          }`} />
                        </div>

                        {/* Criteria hints */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-500">
                          <span className={`flex items-center gap-1 ${passwordEvaluation.criteria.minLength ? 'text-emerald-700 font-medium' : ''}`}>
                            <Check className={`w-3 h-3 ${passwordEvaluation.criteria.minLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                            8+ characters
                          </span>
                          <span className={`flex items-center gap-1 ${passwordEvaluation.criteria.hasUpper && passwordEvaluation.criteria.hasLower ? 'text-emerald-700 font-medium' : ''}`}>
                            <Check className={`w-3 h-3 ${passwordEvaluation.criteria.hasUpper && passwordEvaluation.criteria.hasLower ? 'text-emerald-600' : 'text-slate-300'}`} />
                            Upper &amp; lowercase
                          </span>
                          <span className={`flex items-center gap-1 ${passwordEvaluation.criteria.hasNumber ? 'text-emerald-700 font-medium' : ''}`}>
                            <Check className={`w-3 h-3 ${passwordEvaluation.criteria.hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
                            Number
                          </span>
                          <span className={`flex items-center gap-1 ${passwordEvaluation.criteria.hasSpecial ? 'text-emerald-700 font-medium' : ''}`}>
                            <Check className={`w-3 h-3 ${passwordEvaluation.criteria.hasSpecial ? 'text-emerald-600' : 'text-slate-300'}`} />
                            Special character
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-xs text-rose-600 font-medium pt-0.5">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
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
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        disabled={isLoading}
                        required
                        autoComplete="new-password"
                        className={`w-full text-sm text-slate-900 bg-white border rounded-lg pl-9 pr-10 py-2 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                          errors.confirmPassword
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={isLoading}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        id="register-agree-terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                        }}
                        disabled={isLoading}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="register-agree-terms" className="text-xs text-slate-600 leading-normal cursor-pointer select-none">
                        I agree to the Skill Map{' '}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen(true)}
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline inline"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen(true)}
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline inline"
                        >
                          Candidate Privacy Policy
                        </button>
                        .
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-xs text-rose-600 font-medium mt-1.5 ml-6.5">{errors.terms}</p>
                    )}
                  </div>

                  {/* Register Submit Button */}
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
                      {isLoading ? 'Creating Candidate Profile...' : 'Register for Skill Map'}
                    </Button>
                  </div>
                </form>

                {/* Link to Login */}
                <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      <span>Sign in here</span>
                    </button>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Career Platform Security Note */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Encrypted Authentication</span>
          </span>
          <span>•</span>
          <span>Credential Privacy Protection</span>
          <span>•</span>
          <span>SSO Compatible</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 text-center text-xs text-slate-400">
        Skill Map &copy; 2026 — Competency Mapping &amp; Career Opportunity Recommendation Engine
      </footer>

      {/* Terms & Privacy Modal */}
      <Modal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Skill Map Candidate Agreement & Policy"
        description="Standard academic, research, and placement terms of use."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTermsModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAgreeTerms(true);
                setErrors((prev) => ({ ...prev, terms: undefined }));
                setTermsModalOpen(false);
              }}
            >
              I Accept the Terms
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">1. Competency Assessment &amp; Skill Data</h4>
            <p>
              Skill Map aggregates self-assessments, institution credentials, and industry benchmarks to provide career gap analyses and job matching. Skill verification scores remain private to the candidate until voluntarily shared with employers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">2. Candidate Privacy Protection</h4>
            <p>
              Candidate contact details and emails are encrypted and only accessible to authorized institutional career liaisons and matched recruitment partners upon direct candidate application.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">3. Opportunity Recommendations</h4>
            <p>
              Job match compatibility scores are computed in real-time based on your target role benchmarks and active learning roadmaps. Recommendations do not guarantee employment offers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">4. Account Security</h4>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Passwords are salted and encrypted in accordance with modern cryptographic standards.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
