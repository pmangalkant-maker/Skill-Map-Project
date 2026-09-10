# Skill Map — Final Feature Audit

This build keeps the existing Student Dashboard and Resume Upload/analysis source files intact.

## Included
- Student skill assessment and skill profile
- Resume upload, parsing, extraction and skill-gap pipeline
- Learning roadmap and career guidance
- AI Career Assistant with English/Hinglish support in the existing app
- Student jobs/internships and application tracking
- Digital portfolio data model and profile support
- Recruiter role login and dedicated recruiter dashboard
- Recruiter jobs, internships and live projects
- Candidate search and AI-style skill/readiness matching
- Shortlisting, application pipeline, interviews and offers
- Recruiter skill-demand analytics
- Recruiter–academia collaboration
- College Staff role login and dedicated institution dashboard
- Student progress, skill intelligence, skill gaps
- Internship and placement tracking
- Recruiter connections
- Faculty opportunities: FDP, faculty internship, industrial training, mentorship, research/consultancy
- Industry collaboration, reports and notifications
- 3D Skill Map landing/dashboard experience
- Backend role-based authorization
- Secure document-management API for certificates, internship reports, academic records and portfolio documents
- Root-level package scripts so commands can be run from the project root
- `.env.example` files for clean setup
- Windows `RUN-SKILL-MAP.bat` launcher

## Intentionally unchanged
- `frontend/src/views/DashboardView.tsx`
- `frontend/src/views/ResumeUploadView.tsx`
- `frontend/src/services/resumeApi.ts`
- `backend/controllers/resumeController.js`
- `backend/routes/resumeRoutes.js`
- `backend/models/Resume.js`

## Demo accounts
- Student: `alex.rivers@example.com` / `Password123!`
- Recruiter: `recruiter@skillmap.demo` / `Password123!`
- College Staff: `staff@skillmap.demo` / `Password123!`

Use real accounts/data for evaluation; demo data is only for local testing.
