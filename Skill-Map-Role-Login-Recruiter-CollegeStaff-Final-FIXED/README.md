# Skill Map

Academia–Industry Collaboration Portal with Student, Recruiter and College Staff experiences.

## Folder structure
```text
Skill-Map-Role-Login-Recruiter-CollegeStaff-Final-FIXED/
├── frontend/
├── backend/
├── scripts/
├── RUN-SKILL-MAP.bat
└── package.json
```

## Easiest Windows run
Double-click `RUN-SKILL-MAP.bat`.

Or from PowerShell at this project root:
```powershell
npm run install:all
```
Then use two terminals:
```powershell
npm run dev:backend
```
and
```powershell
npm run dev:frontend
```

Open `http://localhost:3000`.

## Manual run
Backend:
```powershell
cd backend
npm install
npm run dev
```

Frontend (second terminal):
```powershell
cd frontend
npm install
npm run dev
```

## Environment
Create `backend/.env` from `backend/.env.example` and put your existing MongoDB URI and JWT secret there. Do not commit secrets.

Create `frontend/.env` from `frontend/.env.example` if you want to override the default API URL.

## Role login
The login screen explicitly selects:
- Student
- Recruiter
- College Staff

After authentication:
- Student → existing Student Dashboard
- Recruiter → Recruiter Dashboard
- College Staff → College Staff Dashboard

Backend role middleware independently protects recruiter and college-staff APIs.

## Validation
```powershell
npm run verify:backend
npm run lint
npm run build
```

`npm run build` and `npm run lint` require frontend dependencies to be installed first.
