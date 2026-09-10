import React, { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, Sparkles, Target, BookOpen, Briefcase, FileText, MessageCircle, CheckCircle2, Languages, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../services/apiClient';

type Language = 'en' | 'hi';

export const AICareerAssistantView: React.FC = () => {
  const { user, skills, opportunities } = useApp();
  const [language, setLanguage] = useState<Language>('en');
  const [resumeText, setResumeText] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [chatMode, setChatMode] = useState<'gemini' | 'fallback' | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'not-configured' | 'error'>('checking');
  const [aiStatusMessage, setAiStatusMessage] = useState('Checking Gemini AI...');

  const skillNames = useMemo(() => skills.map(s => s.name), [skills]);
  const skillDetails = useMemo(() => skills.map(s => ({
    name: s.name, score: s.score, targetScore: s.targetScore, level: s.level, status: s.status
  })), [skills]);

  useEffect(() => {
    let alive = true;
    apiRequest('/api/ai/status').then((d:any) => {
      if (!alive) return;
      if (d.configured) { setAiStatus('connected'); setAiStatusMessage('Gemini AI connected'); }
      else { setAiStatus('not-configured'); setAiStatusMessage('GEMINI_API_KEY is missing in backend/.env'); }
    }).catch((e:any) => {
      if (!alive) return;
      setAiStatus('error'); setAiStatusMessage(e.message || 'Could not check Gemini AI');
    });
    return () => { alive = false; };
  }, []);

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({
          resumeText, targetRole: user.targetRole, skills: skillNames, skillDetails,
          interests: user.careerInterests, readinessScore: user.readinessScore, language
        })
      });
      setResult(data.analysis);
    } catch (e:any) {
      setResult({
        summary: e.message || (language === 'hi' ? 'Gemini AI available nahi hai.' : 'Gemini AI is unavailable.'),
        strengths: [], gaps: [], recommendations: [], roles: [], mode: 'error'
      });
    } finally { setLoading(false); }
  };

  const ask = async () => {
    if (!question.trim()) return;
    setChatLoading(true);
    try {
      const data = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          question, targetRole: user.targetRole, skills: skillNames, skillDetails,
          gaps: result?.gaps || [], interests: user.careerInterests,
          readinessScore: user.readinessScore, resumeText, language
        })
      });
      setAnswer(data.answer || (language === 'hi' ? 'Koi answer generate nahi hua.' : 'No answer generated.'));
      setChatMode(data.mode || null);
    } catch (e:any) {
      setAnswer(e.message || (language === 'hi' ? 'Please dobara try karo.' : 'Please try again.'));
      setChatMode(null);
    } finally { setChatLoading(false); }
  };

  const switchLanguage = (next: Language) => {
    setLanguage(next);
    setAnswer('');
    setResult(null);
  };

  const hi = language === 'hi';
  const card = 'rounded-2xl border border-slate-200 bg-white p-5';

  return <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto space-y-6">
    <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Sparkles className="w-6 h-6" /></div>
          <div><p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">{hi ? 'Intelligent Career Layer' : 'Intelligent Career Layer'}</p><h1 className="text-2xl font-bold mt-1">{hi ? 'AI Career Assistant' : 'AI Career Assistant'}</h1></div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
          <Languages className="w-4 h-4 ml-2 text-blue-200" />
          <button onClick={() => switchLanguage('en')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${language === 'en' ? 'bg-white text-slate-900' : 'text-white'}`}>English</button>
          <button onClick={() => switchLanguage('hi')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${language === 'hi' ? 'bg-white text-slate-900' : 'text-white'}`}>Hindi / Hinglish</button>
        </div>
      </div>
      <p className="text-sm text-slate-300 mt-4 max-w-3xl">{hi ? 'Apne skills, gaps aur career goals ke basis par personalized AI guidance lo.' : 'Get personalized AI guidance based on your skills, gaps and career goals.'} {hi ? 'Suggestions advisory hain.' : 'Suggestions are advisory, not hiring decisions.'}</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
        <span className={`w-2 h-2 rounded-full ${aiStatus==='connected'?'bg-emerald-400':aiStatus==='checking'?'bg-amber-300':'bg-red-400'}`}></span>
        {aiStatusMessage}
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-5">
      <section className={card+' lg:col-span-2'}>
        <div className="flex items-center gap-2 mb-3"><FileText className="w-5 h-5 text-blue-600"/><h2 className="font-bold">{hi ? 'AI Resume & Skill Analyzer' : 'AI Resume & Skill Analyzer'}</h2></div>
        <p className="text-xs text-slate-500 mb-3">{hi ? 'Resume text paste karo. Existing profile skills bhi analysis me use honge.' : 'Paste resume text for deeper analysis. Your existing profile skills are also used.'}</p>
        <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} className="w-full min-h-36 rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder={hi ? 'Resume text yahan paste karo (optional)...' : 'Paste resume text here (optional)...'}/>
        <button onClick={analyze} disabled={loading} className="mt-3 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">{loading ? (hi ? 'Analyze ho raha hai...' : 'Analyzing...') : (hi ? 'AI se Analyze Karo' : 'Analyze with AI')}</button>
      </section>

      <section className={card}>
        <div className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-600"/><h2 className="font-bold">{hi ? 'Current Context' : 'Current Context'}</h2></div>
        <div className="mt-4 space-y-3 text-sm">
          <div><span className="text-slate-500">{hi ? 'Target role' : 'Target role'}</span><p className="font-semibold">{user.targetRole}</p></div>
          <div><span className="text-slate-500">{hi ? 'Skills' : 'Skills'}</span><p className="font-semibold">{skills.length}</p></div>
          <div><span className="text-slate-500">{hi ? 'Readiness' : 'Readiness'}</span><p className="font-semibold">{user.readinessScore}%</p></div>
          <div><span className="text-slate-500">{hi ? 'Opportunities' : 'Opportunities'}</span><p className="font-semibold">{opportunities.length}</p></div>
        </div>
      </section>
    </div>

    {result && <section className={card}>
      <div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-blue-600"/><h2 className="font-bold">{hi ? 'AI Career Report' : 'AI Career Report'}</h2><span className={`ml-auto text-[10px] px-2 py-1 rounded-full ${result.mode==='gemini'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{result.mode==='gemini'?'Gemini AI':'Gemini unavailable'}</span></div>
      <p className="text-sm text-slate-600 mt-3">{result.summary}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        <Report title={hi ? 'Strengths' : 'Strengths'} icon={CheckCircle2} items={result.strengths}/>
        <Report title={hi ? 'Skill Gaps' : 'Skill Gaps'} icon={Target} items={result.gaps}/>
        <Report title={hi ? 'Recommended Learning' : 'Recommended Learning'} icon={BookOpen} items={result.recommendations}/>
        <Report title={hi ? 'Career Roles' : 'Career Roles'} icon={Briefcase} items={result.roles}/>
      </div>
    </section>}

    <section className={card}>
      <div className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-blue-600"/><h2 className="font-bold">{hi ? 'Career Assistant se Pucho' : 'Ask the Career Assistant'}</h2></div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') void ask();}} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder={hi ? 'Example: Mere target role ke liye next kya seekhun?' : 'e.g. What should I learn next for my target role?'}/>
        <button onClick={ask} disabled={chatLoading} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:opacity-50">{chatLoading?(hi?'Soch raha hoon...':'Thinking...'):(hi?'AI se Pucho':'Ask AI')}</button>
      </div>
      {answer && <div className="mt-4">
        <div className="flex items-center gap-2 mb-2"><span className={`text-[10px] px-2 py-1 rounded-full ${chatMode==='gemini'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{chatMode==='gemini'?'Gemini AI':'Smart fallback'}</span><button onClick={()=>{setAnswer('');setChatMode(null)}} className="ml-auto text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"><RotateCcw className="w-3 h-3"/>Clear</button></div>
        <div className="p-4 rounded-xl bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">{answer}</div>
      </div>}
    </section>
  </div>;
};

const Report=({title,icon:Icon,items}:{title:string,icon:any,items?:string[]})=><div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-blue-600"/><h3 className="font-semibold text-sm">{title}</h3></div><ul className="mt-3 space-y-2">{(items||[]).slice(0,6).map((x:string,i:number)=><li key={i} className="text-xs text-slate-600">• {x}</li>)}{!(items||[]).length&&<li className="text-xs text-slate-400">No items identified.</li>}</ul></div>;
