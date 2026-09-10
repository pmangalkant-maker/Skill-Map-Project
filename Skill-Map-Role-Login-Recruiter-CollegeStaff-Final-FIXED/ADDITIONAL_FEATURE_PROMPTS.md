# Skill Map — Missing Feature Prompts

These prompts describe the features added to the supplied project and can be reused in Google AI Studio or another coding agent.

## 1. Digital Portfolio
Add a persistent student digital portfolio containing projects, certifications, achievements, professional summary, credential URLs and verification status. Store it per authenticated user, expose GET/PUT APIs, and add a responsive UI for viewing and editing it.

## 2. Application Tracking
Add an application entity linked to the authenticated student and opportunity. Implement apply, duplicate-application prevention, list applications, and statuses: Applied, Under Review, Shortlisted, Interview, Selected, Rejected, Completed. Add a responsive tracker UI.

## 3. Industry Learning & Collaboration
Add a collaboration module supporting mentorships, workshops, guest lectures, innovation challenges, live industry projects, FDPs, faculty internships, industrial training, research and consultancy. Support audience targeting for Student, Academician, Institution and All.

## 4. Academician Portal
Create an academician-facing experience for discovering faculty internships, industrial training, FDPs, mentorships and research opportunities. Keep it connected to the same collaboration API and allow filtering by audience.

## 5. Industry Portal
Create an industry-facing workflow for publishing jobs/internships and collaboration programs, capturing required skills, eligibility, descriptions, deadlines and capacity. Add recruiter-side candidate matching and shortlisting in the next iteration.

## 6. Institution Analytics
Add an institution dashboard with student count, verified skills, active opportunities, application volume, placement readiness and internship completion metrics. Make the analytics API-backed and ready for MongoDB.

## 7. Role-Based Access
Extend the User model with student, academician, industry and institution roles. Enforce authorization on the backend for recruiter posting, academician programs and institution analytics. Do not rely on a frontend-only role selector for security.

## 8. Secure Document Management
Extend resume/document handling to support certificates, internship reports and academic records with file type/size validation, authenticated ownership checks and controlled download endpoints.

## 9. Recommendation & Matching
Keep the current resume-to-skill and skill-gap engine, then extend matching to applications and industry opportunities. Score candidates by required-skill compatibility, proficiency gap, experience level and career interest.

## 10. Full Recruitment Workflow
Add recruiter candidate lists, shortlist/reject actions, interview stages, notes, status history and notifications. Institution dashboards should aggregate recruitment outcomes without exposing private candidate data unnecessarily.
