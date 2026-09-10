SKILL MAP - ROLE PORTALS

Changes in this build:
- Student dashboard is preserved.
- Resume upload/extraction files are preserved unchanged.
- Login now has Student, Recruiter and College Staff role selection.
- Recruiter opens a dedicated Recruiter Portal with hiring, jobs, candidate finder and academia collaboration sections.
- College Staff opens a dedicated College Staff Portal with student analytics, placements, faculty opportunities and industry collaboration sections.
- Legacy Industry accounts are mapped to Recruiter portal.
- Legacy Institution accounts are mapped to College Staff portal.

DEMO LOGIN ACCOUNTS
Recruiter:
  Email: recruiter@skillmap.demo
  Password: Password123!

College Staff:
  Email: staff@skillmap.demo
  Password: Password123!

Student:
  Email: alex.rivers@example.com
  Password: Password123!

RUN
Frontend terminal:
  cd "Skill Map\frontend"
  npm install
  npm run dev

Backend terminal:
  cd "Skill Map\backend"
  npm install
  npm run dev

Open:
  http://localhost:3000

If the backend has MongoDB configured, existing Industry users continue to work as Recruiter and existing Institution users continue to work as College Staff.
