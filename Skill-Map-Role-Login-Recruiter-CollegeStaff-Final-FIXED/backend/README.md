# SkillMap Backend

Backend scaffold for the SkillMap frontend flow:

Landing → Login → Register → Resume Upload → Profile → Dashboard → My Skills → Skill Gap → Jobs & Internships → Learning Roadmap

## Setup

1. Install Node.js LTS.
2. Copy `.env.example` to `.env`.
3. Put your MongoDB connection string in `MONGO_URI`.
4. Set a strong `JWT_SECRET`.
5. Install dependencies:

```bash
npm install
```

6. Start development server:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Main endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /profile`
- `PUT /profile`
- `GET /resume`
- `POST /resume/upload` with multipart field `resume`
- `DELETE /resume`
- `GET /skills`
- `POST /skills`
- `PUT /skills/:skillId`
- `DELETE /skills/:skillId`
- `POST /matching/analyze`
- `GET /opportunities`
- `GET /roadmap`
- `PUT /roadmap/modules/:moduleId`

Protected endpoints require:

`Authorization: Bearer <JWT>`

## Important

- Resume uploads are restricted to PDF/DOCX and the configured size limit.
- Passwords are stored as hashes, never plaintext.
- Match percentages are calculated only when required skills are supplied to `/matching/analyze`; no fake AI result is generated.
- Opportunity data must come from a real/approved data source or be explicitly marked as demo data.
- Resume text extraction/AI skill extraction is intentionally left as the next integration layer.
