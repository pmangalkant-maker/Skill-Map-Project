import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Target,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { updateCandidateProfile } from '../services/profileApi';

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useApp();

  const [formData, setFormData] = useState({
    name: user.name || '',
    headline: user.headline || '',
    email: user.email || '',
    phone: user.phone || '',
    education: user.education || '',
    degree: user.degree || '',
    graduationYear: user.graduationYear || '2026',
    department: user.department || '',
    targetRole: user.targetRole || '',
    experienceLevel: user.experienceLevel || '',
    location: user.location || '',
    bio: user.bio || '',
    careerInterests: (user.careerInterests || []).join(', '),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const interestsArray = formData.careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await updateCandidateProfile({
        name: formData.name,
        headline: formData.headline,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        degree: formData.degree,
        graduationYear: formData.graduationYear,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        bio: formData.bio,
        careerInterests: interestsArray,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save profile changes.');
        setIsSaving(false);
        return;
      }

      updateUser({
        name: formData.name,
        headline: formData.headline,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        degree: formData.degree,
        graduationYear: formData.graduationYear,
        department: formData.department,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        bio: formData.bio,
        careerInterests: interestsArray,
      });

      setSuccessMessage('Candidate profile successfully updated.');
    } catch {
      setErrorMessage('A network error occurred while updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer
      title="Candidate Profile"
      subtitle="Manage your scholarly credentials, technical competencies, target career objectives, and professional portfolio details."
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Overview Card */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name || 'Candidate Profile'}</h2>
                  <p className="text-slate-300 text-sm mt-0.5">{user.headline || 'Computing Systems Scholar'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-slate-800 text-slate-200 border-slate-700 text-xs">
                      <Target className="w-3 h-3 mr-1 text-blue-400" />
                      {user.targetRole || 'Full Stack Cloud Engineer'}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-800 text-slate-200 border-slate-700 text-xs">
                      <Award className="w-3 h-3 mr-1 text-emerald-400" />
                      Readiness: {user.readinessScore || 78}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Status</div>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Academic Candidate
                </div>
              </div>
            </div>
          </div>
        </Card>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-sm text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal & Contact Information */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Personal & Contact Information
              </CardTitle>
              <CardDescription>
                Your candidate identity as displayed on generated reports and applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Alex Johnson"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Headline</label>
                  <Input
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g., Computing & Software Systems Scholar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="candidate@university.edu"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Campus / Regional Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Greater Metro Innovation District"
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Credentials & Objective */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Academic Background & Career Target
              </CardTitle>
              <CardDescription>
                Educational institution and career targets driving the skill mapping analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Institution / University</label>
                  <Input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g., State University of Technology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree / Course Major</label>
                  <Input
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g., B.S. in Computer Science & Engineering"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Department of Computing"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                  <Input
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience Level</label>
                  <Input
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    placeholder="e.g., Undergraduate / Early Career"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Professional Role</label>
                <Input
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g., Full Stack Cloud Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Career Interests & Specialties (Comma-separated)</label>
                <Input
                  name="careerInterests"
                  value={formData.careerInterests}
                  onChange={handleChange}
                  placeholder="Cloud Architectures, Distributed Systems, API Engineering, DevOps"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Bio & Research Focus</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Briefly describe your technical background, research interests, and career objectives..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Profile Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
