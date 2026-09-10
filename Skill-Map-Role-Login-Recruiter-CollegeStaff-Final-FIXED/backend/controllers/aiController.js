import { localCareerChat, localCareerAnalysis } from '../services/localCareerAI.js';

function normalize(list = []) {
  return Array.isArray(list)
    ? list.map(String).map((s) => s.trim()).filter(Boolean)
    : [];
}

function cleanText(value = '', max = 12000) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function fallbackAnalysis({ targetRole, skills = [], interests = [], language = 'en' }) {
  const names = normalize(skills);
  const role = targetRole || 'Full Stack Engineer';
  const gaps = ['System Design', 'Cloud Infrastructure', 'Testing & Quality Assurance'];
  if (language === 'hi') {
    return {
      mode: 'fallback',
      summary: `${role} ke liye tumhare profile ka foundation useful hai. Lekin ye fallback analysis hai; Gemini AI response available nahi hua.`,
      strengths: names.slice(0, 6),
      gaps,
      recommendations: gaps.map(g => `${g} par hands-on project banao aur measurable progress track karo.`),
      roles: [role, ...normalize(interests).slice(0, 2)]
    };
  }
  return {
    mode: 'fallback',
    summary: `${role} ke liye profile ka basic analysis available hai. This is fallback mode because Gemini AI did not return a response.`,
    strengths: names.slice(0, 6),
    gaps,
    recommendations: gaps.map(g => `Build a hands-on project around ${g} and track measurable progress.`),
    roles: [role, ...normalize(interests).slice(0, 2)]
  };
}

function languageInstruction(language) {
  return language === 'hi'
    ? 'Reply in natural Roman Hindi/Hinglish. Keep technical terms such as React, AWS, Docker, API, System Design, CI/CD in English. Do not answer in formal Hindi script.'
    : 'Reply in clear professional English.';
}

async function geminiText(prompt) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    const err = new Error('GEMINI_API_KEY is not configured in backend/.env');
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const body = {
    system_instruction: {
      parts: [{
        text: 'You are Skill Map, a personalized career copilot. Never give a generic canned answer when student context is available. Use the exact profile data supplied. Answer the exact question first, then give practical next steps. Never invent scores, experience, employers, certifications or completed actions.'
      }]
    },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.45,
      maxOutputTokens: 1800
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = data?.error?.message || `Gemini API request failed with HTTP ${response.status}`;
    const err = new Error(msg);
    err.code = `GEMINI_HTTP_${response.status}`;
    throw err;
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map(p => p?.text || '')
    .join('')
    .trim();

  if (!text) {
    const err = new Error('Gemini returned an empty response');
    err.code = 'GEMINI_EMPTY_RESPONSE';
    throw err;
  }
  return text;
}

export async function aiStatus(req, res) {
  const configured = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  res.json({
    success: true,
    configured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    provider: 'Google Gemini',
    message: configured
      ? 'Gemini API key is configured'
      : 'GEMINI_API_KEY is missing from backend/.env'
  });
}

export async function analyzeCareer(req, res, next) {
  try {
    const input = req.body || {};
    const language = input.language === 'hi' ? 'hi' : 'en';
    const base = fallbackAnalysis({ ...input, language });
    const skills = normalize(input.skills);
    const interests = normalize(input.interests);

    const prompt = `You are answering a student's career question using ONLY the supplied context.
${languageInstruction(language)}

Student target role: ${cleanText(input.targetRole, 200) || 'Not specified'}
Skill details: ${cleanText(JSON.stringify(input.skillDetails || skills), 6500)}
Career interests: ${cleanText(interests.join(', '), 1500) || 'Not specified'}
Readiness score: ${input.readinessScore ?? 'Not provided'}
Resume/profile text: ${cleanText(input.resumeText, 9000) || 'Not provided'}

Create a concise personalized career report. Return plain JSON only with:
{"summary":"...","strengths":["..."],"gaps":["..."],"recommendations":["..."],"roles":["..."]}
Make every item specific to the supplied data.`;

    const raw = await geminiText(prompt);
    let ai;
    try { ai = JSON.parse(raw.replace(/^```json\s*/i,'').replace(/\s*```$/i,'').trim()); } catch {
      const start = raw.indexOf('{'), end = raw.lastIndexOf('}');
      ai = start >= 0 && end > start ? JSON.parse(raw.slice(start,end+1)) : null;
    }
    if (!ai) throw new Error('Gemini returned an invalid career report format');

    res.json({
      success: true,
      analysis: {
        summary: String(ai.summary || ''),
        strengths: normalize(ai.strengths).slice(0,8),
        gaps: normalize(ai.gaps).slice(0,8),
        recommendations: normalize(ai.recommendations).slice(0,8),
        roles: normalize(ai.roles).slice(0,6),
        mode: 'gemini'
      },
      aiConfigured: true
    });
  } catch (e) {
    console.error('[AI Analyze]', e.message);
    const local = localCareerAnalysis(req.body || {});
    res.json({ success: true, analysis: local, aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), fallbackReason: e.message });
  }
}

export async function chatCareer(req, res) {
  try {
    const input = req.body || {};
    const q = cleanText(input.question, 4000);
    if (!q) return res.status(400).json({ success: false, message: 'Question is required' });
    const language = input.language === 'hi' ? 'hi' : 'en';

    const prompt = `Answer this student's EXACT question. Do not reuse a canned template and do not merely repeat "focus on system design, cloud, testing and communication".
${languageInstruction(language)}

Target role: ${cleanText(input.targetRole, 300) || 'Not specified'}
Readiness score: ${input.readinessScore ?? 'Not provided'}
Skills and scores: ${cleanText(JSON.stringify(input.skillDetails || input.skills || []), 7000)}
Known skill gaps: ${cleanText(normalize(input.gaps).join(', '), 3000) || 'Not provided'}
Career interests: ${cleanText(normalize(input.interests).join(', '), 1800) || 'Not provided'}
Resume/profile context: ${cleanText(input.resumeText, 8000) || 'Not provided'}
Student question: ${q}

Rules:
- Answer the question directly in the first paragraph.
- Reference 2-4 relevant facts from the student's supplied profile when possible.
- Give 3-5 concrete next actions, prioritized.
- If recommending a skill, explain why it matters for this student's target role.
- Give realistic time estimates only when useful.
- Do not invent facts.
- Do not claim to have performed an action.`;

    const raw = await geminiText(prompt);
    res.json({
      success: true,
      answer: raw,
      mode: 'gemini',
      aiConfigured: true
    });
  } catch (e) {
    console.error('[AI Chat]', e.message);
    const local = localCareerChat(req.body || {});
    res.json({ success: true, ...local, aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), fallbackReason: e.message });
  }
}
