import React, { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const QUESTIONS = [
  { id: 'js', skill: 'TypeScript & Modern JavaScript', q: 'How confidently can you build production JavaScript/TypeScript features?', options: [['Beginner', 45], ['Intermediate', 70], ['Advanced', 88]] },
  { id: 'react', skill: 'React Ecosystem & Next.js', q: 'How confidently can you build reusable React interfaces and manage application state?', options: [['Beginner', 45], ['Intermediate', 70], ['Advanced', 88]] },
  { id: 'backend', skill: 'Node.js & Express REST APIs', q: 'How confidently can you design and implement REST APIs?', options: [['Beginner', 45], ['Intermediate', 70], ['Advanced', 88]] },
  { id: 'cloud', skill: 'Cloud Infrastructure (GCP / AWS)', q: 'How comfortable are you deploying and operating applications on cloud platforms?', options: [['Beginner', 40], ['Intermediate', 68], ['Advanced', 88]] },
  { id: 'data', skill: 'PostgreSQL & Relational Data Modeling', q: 'How confidently can you model relational data and write optimized SQL?', options: [['Beginner', 45], ['Intermediate', 70], ['Advanced', 88]] },
  { id: 'soft', skill: 'Agile & Technical Collaboration', q: 'How effectively do you collaborate, communicate technical work, and participate in Agile teams?', options: [['Beginner', 50], ['Intermediate', 72], ['Advanced', 90]] },
];

export const SkillAssessmentView: React.FC = () => {
  const { skills, addSkill, setActiveNav } = useApp();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const unanswered = useMemo(() => QUESTIONS.filter(q => answers[q.id] == null).length, [answers]);
  const categoryFor = (skill: string): any => skill.includes('Agile') ? 'Soft Skills' : skill.includes('Cloud') ? 'Tools & Technologies' : skill.includes('PostgreSQL') ? 'Other Skills' : 'Technical Skills';

  const submit = async () => {
    if (unanswered) return;
    setSaving(true);
    try {
      for (const q of QUESTIONS) {
        const existing = skills.find(s => s.name.toLowerCase() === q.skill.toLowerCase());
        const score = answers[q.id];
        const level = score >= 85 ? 'Advanced' : score >= 65 ? 'Intermediate' : 'Beginner';
        if (existing) {
          // Existing skills are preserved; assessment is a supplementary profile signal.
          continue;
        }
        await addSkill({ name: q.skill, category: categoryFor(q.skill), level, score, targetScore: 85, status: 'Self-Assessed', source: 'manual', isAiExtracted: false, confirmedByCandidate: true, notes: 'Added from Skill Assessment questionnaire' });
      }
      setDone(true);
    } finally { setSaving(false); }
  };

  return <PageContainer title="Skill Assessment" description="Complete a short industry-aligned questionnaire to supplement resume evidence with your self-assessed technical and soft skills." badge={<Badge variant="primary">{QUESTIONS.length} Questions</Badge>}>
    <div className="max-w-4xl mx-auto space-y-5">
      {done && <Card className="border-emerald-200 bg-emerald-50/50"><CardContent className="p-4 flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-5 h-5"/> Assessment saved and added to your skill profile.</div><Button size="sm" variant="primary" onClick={() => setActiveNav('skill-gap')} rightIcon={<ArrowRight className="w-3.5 h-3.5"/>}>View Skill Gap</Button></CardContent></Card>}
      <Card><CardHeader><CardTitle>Industry Competency Questionnaire</CardTitle><CardDescription>Answer based on your current ability. Resume-derived evidence and assessment results remain separate signals.</CardDescription></CardHeader><CardContent className="space-y-5">
        {QUESTIONS.map((q, i) => <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"><div className="flex items-start gap-3"><div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div><div className="flex-1"><p className="text-sm font-semibold text-slate-900">{q.q}</p><p className="text-xs text-slate-500 mt-1">Skill: {q.skill}</p><div className="grid sm:grid-cols-3 gap-2 mt-3">{q.options.map(([label, score]) => <button key={label as string} type="button" onClick={() => setAnswers(a => ({...a, [q.id]: score as number}))} className={`text-left p-3 rounded-lg border text-xs font-medium transition ${answers[q.id] === score ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'}`}><span>{label}</span><span className="block text-[10px] text-slate-400 mt-1">Score {score}</span></button>)}</div></div></div></div>)}
        <div className="flex items-center justify-between pt-2"><span className="text-xs text-slate-500 flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4"/>{unanswered ? `${unanswered} question(s) remaining` : 'Ready to submit'}</span><Button variant="primary" onClick={() => void submit()} disabled={unanswered > 0 || saving} isLoading={saving}>Save Assessment</Button></div>
      </CardContent></Card>
    </div>
  </PageContainer>;
};
