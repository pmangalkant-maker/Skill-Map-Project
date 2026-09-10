# AI Assistant update

- Gemini chat now requests plain text (not forced JSON), so conversational answers work reliably.
- Career analysis uses structured JSON with robust parsing.
- Student context includes skill scores, target role, readiness, interests and resume text.
- Added English and Hindi/Hinglish language switch.
- UI shows whether the response came from Gemini AI or Smart fallback.
- Configure GEMINI_API_KEY and optionally GEMINI_MODEL in backend/.env.
