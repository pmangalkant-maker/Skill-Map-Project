import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  FileCheck2,
  Compass,
  Briefcase,
  Target,
  FileUp,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/ErrorState';
import { UploadedResume } from '../types';
import { resumeApi } from '../services/resumeApi';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export const ResumeUploadView: React.FC = () => {
  const { uploadedResume, setUploadedResume, deleteResume, setActiveNav, user, refreshSkills } = useApp();

  // Local state for selected pending file before upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload progress & async state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [resumeAiMode, setResumeAiMode] = useState<string>('');

  // Error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);

  // Hidden native file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format bytes helper
  const formatBytes = (bytes: number, decimals = 1): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Validate file type & size
  const validateFile = (file: File): { valid: boolean; title?: string; error?: string } => {
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';

    if (!hasValidExt && !hasValidMime) {
      return {
        valid: false,
        title: 'Invalid File Format',
        error: `"${file.name}" is not supported. Please upload a PDF (.pdf) or Microsoft Word (.docx) resume document.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        title: 'File Exceeds Size Limit',
        error: `"${file.name}" is ${formatBytes(file.size)}. Maximum allowed resume size is 10 MB.`,
      };
    }

    if (file.size === 0) {
      return {
        valid: false,
        title: 'Empty File',
        error: `"${file.name}" is empty (0 bytes). Please select a valid resume document.`,
      };
    }

    return { valid: true };
  };

  // Process a selected or dropped file
  const handleProcessFile = (file: File) => {
    setErrorMessage(null);
    setErrorTitle(null);
    setUploadSuccess(false);

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorTitle(validation.title || 'Upload Error');
      setErrorMessage(validation.error || 'The file could not be accepted.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  // Native input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setErrorMessage(null);
    setErrorTitle(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load sample / demo resume for quick UI evaluation
  const handleLoadSampleResume = () => {
    handleRemoveFile();
    // Create a mock PDF File object labeled as sample data with dynamic candidate name
    const candidateSlug = (user.name || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Candidate';
    const sampleBlob = new Blob(['%PDF-1.4 Mock Candidate Resume Data'], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], `${candidateSlug}_Technical_Resume_2026.pdf`, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    // Manually define size for realistic display
    Object.defineProperty(sampleFile, 'size', { value: 342 * 1024 });
    setSelectedFile(sampleFile);
  };

  // Real upload action via resumeApi
  const handleStartUpload = async () => {
    if (!selectedFile && !uploadedResume) {
      setErrorTitle('No File Selected');
      setErrorMessage('Please select or drag a resume document to upload.');
      return;
    }

    const fileToUpload = selectedFile;
    if (!fileToUpload) return;

    setIsUploading(true);
    setErrorMessage(null);
    setErrorTitle(null);
    setUploadProgress(20);

    try {
      if (simulateError) {
        throw new Error('Connection interrupted during document transfer. Please retry the upload.');
      }

      setUploadProgress(50);
      const res = await resumeApi.uploadResume(fileToUpload);
      setUploadProgress(90);

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to upload resume to server.');
      }

      setUploadProgress(100);
      setUploadedResume(res.data);
      setSelectedFile(null);
      setUploadSuccess(true);

      // Complete the user journey automatically: upload -> parse -> extract -> skill gap.
      setIsExtracting(true);
      try {
        const extraction = await resumeApi.extractSkills(res.data.id);
        if (!extraction.success || extraction.extractedSkills.length === 0) {
          setErrorTitle('Resume Analysis Failed');
          setErrorMessage(extraction.error || 'Resume was uploaded, but no readable skills could be extracted. You can retry analysis below.');
          return;
        }
        setResumeAnalysis(extraction.resumeAnalysis || null);
        setResumeAiMode(extraction.aiMode || 'resume-analyzer');
        await refreshSkills();
        setUploadSuccess(true);
        setTimeout(() => setActiveNav('skill-gap'), 350);
      } finally {
        setIsExtracting(false);
      }

    } catch (err: any) {
      setErrorTitle('Upload Failed');
      setErrorMessage(err.message || 'An unexpected error occurred during upload. Please retry.');
      setUploadProgress(0);
    } finally {
      setIsExtracting(false);
      setIsUploading(false);
    }
  };

  const handleProceedToExtraction = async () => {
    setIsExtracting(true);
    setErrorMessage(null);
    try {
      const res = await resumeApi.extractSkills();
      if (res.success && res.extractedSkills.length > 0) {
        setResumeAnalysis(res.resumeAnalysis || null);
        setResumeAiMode(res.aiMode || 'resume-analyzer');
        await refreshSkills();
        setActiveNav('skill-gap');
      } else {
        setErrorMessage(res.error || 'Skill extraction failed. Please ensure a valid resume is uploaded.');
        setErrorTitle('Extraction Error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'AI skill extraction failed.');
      setErrorTitle('Extraction Error');
    } finally {
      setIsExtracting(false);
    }
  };

  const currentDisplayResume = uploadedResume || (selectedFile ? {
    name: selectedFile.name,
    formattedSize: formatBytes(selectedFile.size),
    format: selectedFile.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF',
  } : null);

  return (
    <PageContainer
      title="Resume Upload & Parsing"
      description="Upload your latest candidate CV or resume to benchmark your competencies against real job market requirements."
      badge={
        uploadedResume ? (
          <Badge variant="success" size="md">
            Resume Staged for Extraction
          </Badge>
        ) : (
          <Badge variant="neutral" size="md">
            No Resume Uploaded
          </Badge>
        )
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Testing Banner / Developer Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Evaluation Tools:</strong> Test format rejection, size constraints, or load sample candidate data.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleResume}
              disabled={isUploading}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
              title="Load a sample candidate PDF resume for rapid UI testing"
            >
              Load Sample PDF Resume
            </button>

            <button
              type="button"
              onClick={() => setSimulateError((prev) => !prev)}
              className={`px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer ${
                simulateError
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle to test upload failure state handling"
            >
              {simulateError ? 'Simulating Error: ON' : 'Test Error State'}
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <Alert
            variant="error"
            title={errorTitle || 'Upload Error'}
            message={errorMessage}
            onDismiss={() => {
              setErrorMessage(null);
              setErrorTitle(null);
            }}
          />
        )}

        {/* Global Success Banner */}
        {uploadSuccess && (
          <Alert
            variant="success"
            title="Resume Uploaded Successfully!"
            message="Your resume file is securely staged. You can now proceed to extract and benchmark technical skills against your target role."
            onDismiss={() => setUploadSuccess(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Zone & Controls (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Upload Resume File</CardTitle>
                    <CardDescription>
                      Accepted formats: <strong>PDF (.pdf)</strong> and <strong>Word (.docx)</strong> up to 10 MB.
                    </CardDescription>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      PDF
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      DOCX
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Hidden Native File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="resume-file-input"
                  disabled={isUploading}
                />

                {/* Dropzone Area */}
                {!selectedFile && !uploadedResume ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none group ${
                      isDragging
                        ? 'border-blue-600 bg-blue-50/70 ring-4 ring-blue-500/10 scale-[1.01]'
                        : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-blue-500/10">
                      <UploadCloud className="w-8 h-8" />
                    </div>

                    <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {isDragging ? 'Drop your resume file here' : 'Drag & drop your resume file here'}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      Files will be verified for text readability and parsed for technical competencies, certifications, and project experience.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        leftIcon={<FileUp className="w-4 h-4" />}
                      >
                        Browse Resume File
                      </Button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                      <span>Maximum size: <strong>10 MB</strong></span>
                      <span>•</span>
                      <span>Supported: <strong>.pdf, .docx</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Private &amp; Secure
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Selected File or Staged Resume Card */
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                          (currentDisplayResume?.format === 'PDF' || currentDisplayResume?.name.toLowerCase().endsWith('.pdf'))
                            ? 'bg-rose-50 text-rose-600 border-rose-200/80'
                            : 'bg-blue-50 text-blue-600 border-blue-200/80'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-sm font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-md"
                              title={currentDisplayResume?.name}
                            >
                              {currentDisplayResume?.name}
                            </h4>
                            <Badge
                              variant={currentDisplayResume?.format === 'PDF' ? 'error' : 'primary'}
                              size="sm"
                            >
                              {currentDisplayResume?.format}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>{currentDisplayResume?.formattedSize}</span>
                            <span>•</span>
                            {uploadedResume ? (
                              <span className="text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Ready for extraction
                              </span>
                            ) : (
                              <span className="text-amber-700 font-medium">Pending upload confirmation</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons on file card */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => fileInputRef.current?.click()}
                          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                          title="Select a different resume file"
                        >
                          Replace
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isUploading}
                          onClick={async () => {
                            if (uploadedResume) {
                              await deleteResume();
                            }
                            handleRemoveFile();
                          }}
                          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          title="Remove file"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Upload Progress Bar (when uploading) */}
                    {isUploading && (
                      <div className="space-y-2 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-blue-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                            Uploading &amp; Sanitizing Document...
                          </span>
                          <span className="text-blue-700">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-200 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-blue-700">
                          Preparing text segmentation and semantic token stream for skill matrix matching.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 border-t border-slate-100">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  {uploadedResume ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Uploaded on {uploadedResume.uploadedAt}
                    </span>
                  ) : selectedFile ? (
                    <span>Ready to upload. Click below to initiate secure staging.</span>
                  ) : (
                    <span>Select a PDF or Word document to get started.</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {selectedFile && !uploadedResume && (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      isLoading={isUploading}
                      disabled={isUploading}
                      onClick={handleStartUpload}
                      leftIcon={<UploadCloud className="w-4 h-4" />}
                      className="w-full sm:w-auto font-semibold"
                    >
                      {isUploading ? 'Uploading Resume...' : 'Confirm & Upload Resume'}
                    </Button>
                  )}

                  {uploadedResume && (
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setActiveNav('profile')}
                        className="w-full sm:w-auto"
                      >
                        Proceed to Profile
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleProceedToExtraction}
                        disabled={isExtracting}
                        rightIcon={isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto font-semibold"
                      >
                        {isExtracting ? 'Extracting with Gemini...' : 'Proceed to Skill Extraction'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>

            {resumeAnalysis && uploadedResume && (
              <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-base">Resume Analysis Complete</CardTitle>
                  <CardDescription>
                    Your resume was parsed first; the extracted competencies are now driving Skill Gap, Roadmap and Opportunity matching.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200"><p className="text-[11px] text-slate-500">Candidate</p><p className="text-sm font-semibold text-slate-900 mt-1 truncate">{resumeAnalysis.candidateName || user.name}</p></div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200"><p className="text-[11px] text-slate-500">Education</p><p className="text-sm font-semibold text-slate-900 mt-1 truncate">{resumeAnalysis.education || 'Not identified'}</p></div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200"><p className="text-[11px] text-slate-500">Skills detected</p><p className="text-lg font-bold text-emerald-700 mt-1">{resumeAnalysis.skillsDetected?.length || 0}</p></div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200"><p className="text-[11px] text-slate-500">Analysis engine</p><p className="text-sm font-semibold text-slate-900 mt-1">{resumeAiMode === 'gemini-ai' ? 'Gemini AI' : 'Resume Analyzer'}</p></div>
                  </div>
                  {Array.isArray(resumeAnalysis.skillsDetected) && resumeAnalysis.skillsDetected.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">{resumeAnalysis.skillsDetected.map((skill: string) => <Badge key={skill} variant="success" size="sm">{skill}</Badge>)}</div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button type="button" variant="primary" size="sm" onClick={() => setActiveNav('skill-gap')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>View Resume-Based Skill Gap</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NEXT STEPS SECTION (Prominent after upload or staging) */}
            <Card className={uploadedResume ? 'border-blue-200 bg-gradient-to-br from-white to-blue-50/30' : 'opacity-90'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Next Step: Skill Extraction &amp; Alignment</CardTitle>
                    <CardDescription>
                      How your uploaded resume translates into verified career competencies
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Visual Pipeline Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border bg-white border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">1. Document Parsing</span>
                      {uploadedResume ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pending</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Extracts structural headers, experience milestones, projects, and coursework.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-white border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">2. Skill Extraction</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {uploadedResume ? 'Ready' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Identifies technical frameworks, domain knowledge, and tool mastery scores.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-white border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">3. Gap Benchmark</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Step 3</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Compares against <strong>{user.targetRole}</strong> industry expectations.
                    </p>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
                  <div className="text-xs text-blue-950 text-center sm:text-left">
                    <p className="font-semibold">Ready to view extracted competencies?</p>
                    <p className="text-blue-800/80 text-[11px]">
                      Navigate to the My Skills inventory or explore the Skill Gap analysis.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveNav('skill-gap')}
                      leftIcon={<Target className="w-3.5 h-3.5" />}
                    >
                      Skill Gap Matrix
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveNav('my-skills')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      My Skills Matrix
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Guidelines & Security (1 Column) */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Formatting Recommendations</CardTitle>
                <CardDescription>Tips for maximum skill extraction fidelity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Use Standard Headings</p>
                    <p className="text-slate-500 text-[11px]">
                      Use common section titles like "Technical Skills", "Work Experience", and "Education".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Select Text-Based Formats</p>
                    <p className="text-slate-500 text-[11px]">
                      Avoid scanned image PDFs. Ensure text can be selected and highlighted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Highlight Specific Technologies</p>
                    <p className="text-slate-500 text-[11px]">
                      List specific languages (TypeScript, Python), frameworks (React, FastAPI), and cloud tools (AWS, Docker).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Compliance Assurance */}
            <Card className="bg-slate-50/50 border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <CardTitle className="text-sm">Candidate Privacy Guarantee</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-[11px] text-slate-500 leading-relaxed">
                <p>
                  • <strong>Secure Staging:</strong> Uploaded resumes are securely scoped to your session account.
                </p>
                <p>
                  • <strong>PII Masking:</strong> Personal contact information (street address, personal phone) is shielded from external employer viewing until you voluntarily submit an application.
                </p>
                <p>
                  • <strong>Candidate Control:</strong> You can replace or permanently delete your staged resume document at any time.
                </p>
              </CardContent>
            </Card>

            {/* Fast Nav to Opportunities */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Explore Matched Roles</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  See how current listings match your target profile of <strong>{user.targetRole}</strong>.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setActiveNav('jobs')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Job &amp; Internship Matches
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
