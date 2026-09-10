import React, { useEffect, useState } from 'react';
import { Award, BarChart3, BriefcaseBusiness, Building2, CheckCircle2, Edit3, GraduationCap, Handshake, Plus, Save, Users, X } from 'lucide-react';
import { apiRequest } from '../services/apiClient';
import { useApp } from '../context/AppContext';

const emptyPortfolio = { summary: '', projects: [], certifications: [], achievements: [] };

export const PlatformHubView: React.FC = () => {
  const { opportunities, user } = useApp();
  const [tab, setTab] = useState<'portfolio'|'applications'|'collaboration'|'analytics'>('portfolio');
  const [portfolio, setPortfolio] = useState<any>(emptyPortfolio);
  const [applications, setApplications] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState('Student');
  const [opForm, setOpForm] = useState({ title: '', type: 'Internship', company: '', location: 'Remote', experienceLevel: 'Entry Level (0-1 yrs)', requiredSkills: '', description: '', salary: '', deadline: '' });
  const [publishing, setPublishing] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [collabForm, setCollabForm] = useState({ title:'', type:'Workshop', organization:'', audience:'All', skills:'', description:'', seats:25, deadline:'' });
  const [collabSaving, setCollabSaving] = useState(false);

  const loadCandidates = async () => {
    try {
      const r = await apiRequest('/api/opportunities/candidates?skills=' + encodeURIComponent(opForm.requiredSkills));
      setCandidates(r.candidates || []);
    } catch { setCandidates([]); }
  };

  const load = async () => {
    try {
      const [p, a, c, x] = await Promise.all([
        apiRequest('/api/platform/portfolio'), apiRequest('/api/platform/applications'), apiRequest('/api/platform/collaborations'), apiRequest('/api/platform/analytics')
      ]);
      setPortfolio(p.portfolio || emptyPortfolio); setApplications(a.applications || []); setCollaborations(c.collaborations || []); setAnalytics(x.analytics || null);
      if (role === 'Industry') await loadCandidates();
    } catch (e) { console.warn('Platform hub load:', e); }
  };
  useEffect(() => { void load(); }, [role]);

  const savePortfolio = async () => {
    setSaving(true);
    try { const r = await apiRequest('/api/platform/portfolio', { method: 'PUT', body: JSON.stringify({ portfolio }) }); setPortfolio(r.portfolio || portfolio); setEditing(false); }
    finally { setSaving(false); }
  };

  const addProject = () => setPortfolio((p:any) => ({ ...p, projects: [...(p.projects || []), { title: 'New Project', description: '', skills: [], url: '', verified: false }] }));
  const addCert = () => setPortfolio((p:any) => ({ ...p, certifications: [...(p.certifications || []), { name: 'New Certification', issuer: '', year: '', credentialUrl: '', verified: false }] }));
  const addAchievement = () => setPortfolio((p:any) => ({ ...p, achievements: [...(p.achievements || []), { title: 'New Achievement', issuer: '', year: '', verified: false }] }));

  const publishOpportunity = async () => {
    setPublishing(true);
    try {
      await apiRequest('/api/opportunities', { method: 'POST', body: JSON.stringify({ ...opForm, requiredSkills: opForm.requiredSkills.split(',').map(s=>s.trim()).filter(Boolean) }) });
      alert('Opportunity published successfully.');
      setOpForm({ title: '', type: 'Internship', company: '', location: 'Remote', experienceLevel: 'Entry Level (0-1 yrs)', requiredSkills: '', description: '', salary: '', deadline: '' });
      await load();
    } catch (e:any) { alert(e.message || 'Publishing failed. Connect MongoDB and try again.'); }
    finally { setPublishing(false); }
  };

  const updateApplication = async (id:string, status:string) => {
    try { await apiRequest('/api/platform/applications/' + id, { method:'PATCH', body:JSON.stringify({ status }) }); await load(); } catch (e:any) { alert(e.message || 'Could not update application'); }
  };
  const createCollaboration = async () => {
    if (!collabForm.title || !collabForm.organization) return alert('Title and organization are required.');
    setCollabSaving(true);
    try { await apiRequest('/api/platform/collaborations', { method:'POST', body:JSON.stringify({...collabForm, skills:collabForm.skills.split(',').map(s=>s.trim()).filter(Boolean)}) }); setCollabForm({title:'',type:'Workshop',organization:'',audience:'All',skills:'',description:'',seats:25,deadline:''}); await load(); } catch(e:any){ alert(e.message || 'Could not create program'); } finally { setCollabSaving(false); }
  };

  const apply = async (op:any) => {
    try { await apiRequest('/api/platform/applications', { method: 'POST', body: JSON.stringify({ opportunityId: op.id, opportunityTitle: op.title, organization: op.organization }) }); await load(); setTab('applications'); }
    catch (e:any) { alert(e.message || 'Could not apply'); }
  };

  const input = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100';
  return <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Academia–Industry Collaboration</p><h1 className="text-2xl font-bold text-slate-900 mt-1">Career & Collaboration Hub</h1><p className="text-sm text-slate-500 mt-1">Portfolio, applications, industry learning and institutional readiness in one place.</p></div>
      <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Portal view</span><select className={input+' w-auto'} value={role} onChange={e=>setRole(e.target.value)}><option>Student</option><option>Academician</option><option>Industry</option><option>Institution</option></select></div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[['Portfolio','Verified credentials',Award],['Applications',`${applications.length} tracked`,BriefcaseBusiness],['Collaborations',`${collaborations.length} programs`,Handshake],['Readiness',`${analytics?.placementReady ?? user.readinessScore}%`,BarChart3]].map(([a,b,I]:any)=><button key={a} onClick={()=>setTab(a==='Portfolio'?'portfolio':a==='Applications'?'applications':a==='Collaborations'?'collaboration':'analytics')} className={`text-left p-4 rounded-2xl border bg-white hover:shadow-sm ${tab===(a==='Portfolio'?'portfolio':a==='Applications'?'applications':a==='Collaborations'?'collaboration':'analytics')?'border-blue-200 ring-1 ring-blue-100':'border-slate-200'}`}><I className="w-5 h-5 text-blue-600"/><p className="font-semibold text-slate-900 mt-3">{a}</p><p className="text-xs text-slate-500 mt-1">{b}</p></button>)}
    </div>

    {role==='Industry' && <section className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">Recruiter Candidate Shortlisting</h2><p className="text-xs text-slate-500">Rank student candidates by required-skill compatibility and readiness.</p></div><button onClick={()=>void loadCandidates()} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs">Refresh Candidates</button></div><div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500 border-b"><th className="p-2">Candidate</th><th className="p-2">Target Role</th><th className="p-2">Match</th><th className="p-2">Readiness</th><th className="p-2">Action</th></tr></thead><tbody>{candidates.map(c=><tr key={c.id} className="border-b last:border-0"><td className="p-2 font-medium">{c.name}</td><td className="p-2">{c.targetRole}</td><td className="p-2 font-semibold text-blue-600">{c.matchScore}%</td><td className="p-2">{c.readinessScore}%</td><td className="p-2"><span className="text-xs text-slate-500">Shortlist from application workflow</span></td></tr>)}{!candidates.length&&<tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">Create an opportunity with required skills, then refresh.</td></tr>}</tbody></table></div></section>}

    {(role==='Academician' || role==='Institution' || role==='Industry') && tab==='collaboration' && <section className="bg-white rounded-2xl border border-slate-200 p-5"><h2 className="font-bold">Create Collaboration Program</h2><p className="text-xs text-slate-500 mb-4">Publish mentorship, workshops, guest lectures, innovation challenges, live projects, FDPs, faculty internships, industrial training or research programs.</p><div className="grid md:grid-cols-2 gap-2"><input className={input} placeholder="Program title" value={collabForm.title} onChange={e=>setCollabForm({...collabForm,title:e.target.value})}/><input className={input} placeholder="Organization" value={collabForm.organization} onChange={e=>setCollabForm({...collabForm,organization:e.target.value})}/><select className={input} value={collabForm.type} onChange={e=>setCollabForm({...collabForm,type:e.target.value})}>{['Mentorship','Workshop','Guest Lecture','Innovation Challenge','Live Project','Research','Consultancy','FDP','Faculty Internship','Industrial Training'].map(x=><option key={x}>{x}</option>)}</select><select className={input} value={collabForm.audience} onChange={e=>setCollabForm({...collabForm,audience:e.target.value})}><option>All</option><option>Student</option><option>Academician</option><option>Institution</option></select><input className={input+' md:col-span-2'} placeholder="Skills (comma separated)" value={collabForm.skills} onChange={e=>setCollabForm({...collabForm,skills:e.target.value})}/><textarea className={input+' md:col-span-2'} placeholder="Description" value={collabForm.description} onChange={e=>setCollabForm({...collabForm,description:e.target.value})}/></div><button onClick={()=>void createCollaboration()} disabled={collabSaving} className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">{collabSaving?'Publishing...':'Publish Program'}</button></section>}

    {tab==='portfolio' && <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5"><div><h2 className="font-bold text-slate-900">Digital Portfolio</h2><p className="text-xs text-slate-500 mt-1">Showcase skills, projects, certifications and achievements.</p></div><div className="flex gap-2">{editing?<><button onClick={()=>setEditing(false)} className="px-3 py-2 text-sm rounded-lg border"><X className="w-4 h-4 inline mr-1"/>Cancel</button><button disabled={saving} onClick={savePortfolio} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white"><Save className="w-4 h-4 inline mr-1"/>{saving?'Saving...':'Save'}</button></>:<button onClick={()=>setEditing(true)} className="px-3 py-2 text-sm rounded-lg border"><Edit3 className="w-4 h-4 inline mr-1"/>Edit Portfolio</button>}</div></div>
      {editing ? <div className="space-y-5"><textarea className={input+' min-h-24'} value={portfolio.summary||''} onChange={e=>setPortfolio({...portfolio,summary:e.target.value})} placeholder="Professional summary"/>
        <div><div className="flex justify-between mb-2"><h3 className="font-semibold text-sm">Projects</h3><button onClick={addProject} className="text-xs text-blue-600"><Plus className="w-3 h-3 inline"/> Add</button></div>{(portfolio.projects||[]).map((p:any,i:number)=><div className="grid md:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 mb-2" key={i}><input className={input} value={p.title} onChange={e=>{const a=[...portfolio.projects];a[i]={...p,title:e.target.value};setPortfolio({...portfolio,projects:a})}}/><input className={input} value={p.url||''} placeholder="Project URL" onChange={e=>{const a=[...portfolio.projects];a[i]={...p,url:e.target.value};setPortfolio({...portfolio,projects:a})}}/><textarea className={input+' md:col-span-2'} value={p.description||''} placeholder="What did you build?" onChange={e=>{const a=[...portfolio.projects];a[i]={...p,description:e.target.value};setPortfolio({...portfolio,projects:a})}}/></div>)}</div>
        <div><div className="flex justify-between mb-2"><h3 className="font-semibold text-sm">Certifications</h3><button onClick={addCert} className="text-xs text-blue-600"><Plus className="w-3 h-3 inline"/> Add</button></div>{(portfolio.certifications||[]).map((c:any,i:number)=><div className="grid md:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 mb-2" key={i}><input className={input} value={c.name} onChange={e=>{const a=[...portfolio.certifications];a[i]={...c,name:e.target.value};setPortfolio({...portfolio,certifications:a})}}/><input className={input} value={c.issuer||''} placeholder="Issuer" onChange={e=>{const a=[...portfolio.certifications];a[i]={...c,issuer:e.target.value};setPortfolio({...portfolio,certifications:a})}}/><input className={input} value={c.year||''} placeholder="Year" onChange={e=>{const a=[...portfolio.certifications];a[i]={...c,year:e.target.value};setPortfolio({...portfolio,certifications:a})}}/><input className={input} value={c.credentialUrl||''} placeholder="Credential URL" onChange={e=>{const a=[...portfolio.certifications];a[i]={...c,credentialUrl:e.target.value};setPortfolio({...portfolio,certifications:a})}}/></div>)}</div>
        <div><div className="flex justify-between mb-2"><h3 className="font-semibold text-sm">Achievements</h3><button onClick={addAchievement} className="text-xs text-blue-600"><Plus className="w-3 h-3 inline"/> Add</button></div>{(portfolio.achievements||[]).map((a:any,i:number)=><div className="grid md:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 mb-2" key={i}><input className={input} value={a.title} onChange={e=>{const x=[...portfolio.achievements];x[i]={...a,title:e.target.value};setPortfolio({...portfolio,achievements:x})}}/><input className={input} value={a.issuer||''} placeholder="Issuer" onChange={e=>{const x=[...portfolio.achievements];x[i]={...a,issuer:e.target.value};setPortfolio({...portfolio,achievements:x})}}/><input className={input} value={a.year||''} placeholder="Year" onChange={e=>{const x=[...portfolio.achievements];x[i]={...a,year:e.target.value};setPortfolio({...portfolio,achievements:x})}}/></div>)}</div>
      </div> : <div><p className="text-sm text-slate-600 leading-6">{portfolio.summary || user.bio}</p><div className="grid lg:grid-cols-3 gap-4 mt-5"><Card title="Projects" icon={BriefcaseBusiness} items={portfolio.projects} empty="Add projects to demonstrate practical experience."/><Card title="Certifications" icon={GraduationCap} items={portfolio.certifications} empty="Add industry certifications and credentials."/><Card title="Achievements" icon={Award} items={portfolio.achievements} empty="Add awards, competitions and achievements."/></div></div>}
    </section>}

    {tab==='applications' && <section className="bg-white rounded-2xl border border-slate-200 p-5"><h2 className="font-bold">Application Tracker</h2><p className="text-xs text-slate-500 mb-4">Track applications from Applied through selection.</p>{applications.length===0?<Empty text="No applications yet. Apply from Jobs & Internships."/>:<div className="space-y-2">{applications.map((a:any)=><div key={a._id||a.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border"><div><p className="font-semibold text-sm">{a.opportunityTitle}</p><p className="text-xs text-slate-500">{a.organization} · {new Date(a.appliedAt||a.createdAt).toLocaleDateString()}</p></div><select value={a.status} onChange={e=>void updateApplication(a._id||a.id,e.target.value)} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700">{["Applied","Under Review","Shortlisted","Interview","Selected","Rejected","Completed"].map(st=><option key={st}>{st}</option>)}</select></div>)}</div>}</section>}

    {tab==='collaboration' && <section className="bg-white rounded-2xl border border-slate-200 p-5">
      {role==='Industry' && <div className="mb-6 p-4 rounded-xl bg-slate-50 border"><h3 className="font-bold">Industry Opportunity Publisher</h3><p className="text-xs text-slate-500 mb-3">Publish jobs and internships with explicit skill requirements.</p><div className="grid md:grid-cols-2 gap-2">{(['title','company','location','salary','requiredSkills','deadline'] as const).map(k=><input key={k} className={input} type={k==='deadline'?'date':'text'} placeholder={k==='requiredSkills'?'Required skills (comma separated)':k[0].toUpperCase()+k.slice(1)} value={(opForm as any)[k]} onChange={e=>setOpForm({...opForm,[k]:e.target.value})}/>)}<select className={input} value={opForm.type} onChange={e=>setOpForm({...opForm,type:e.target.value})}><option>Internship</option><option>Job</option></select><select className={input} value={opForm.experienceLevel} onChange={e=>setOpForm({...opForm,experienceLevel:e.target.value})}><option>Internship / Student</option><option>Entry Level (0-1 yrs)</option><option>Associate (1-3 yrs)</option></select><textarea className={input+' md:col-span-2'} placeholder="Description" value={opForm.description} onChange={e=>setOpForm({...opForm,description:e.target.value})}/></div><button disabled={publishing} onClick={publishOpportunity} className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">{publishing?'Publishing...':'Publish Opportunity'}</button></div>}
      {role==='Academician' && <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800">Academician view prioritizes faculty internships, industrial training, FDPs, mentorship and research programs.</div>}
      <h2 className="font-bold">Industry & Academia Programs</h2><p className="text-xs text-slate-500 mb-4">Mentorship, workshops, FDPs, faculty internships, live projects and research collaborations.</p><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{collaborations.map((c:any)=><div key={c.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200"><div className="flex justify-between"><span className="text-xs font-semibold text-blue-600">{c.type}</span><Users className="w-4 h-4 text-slate-400"/></div><h3 className="font-semibold mt-2">{c.title}</h3><p className="text-xs text-slate-500 mt-1">{c.organization}</p><p className="text-sm text-slate-600 mt-3">{c.description}</p><div className="flex flex-wrap gap-1 mt-3">{(c.skills||[]).map((s:string)=><span className="text-[10px] px-2 py-1 rounded-full bg-slate-100" key={s}>{s}</span>)}</div></div>)}</div></section>}

    {tab==='analytics' && <section className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600"/><div><h2 className="font-bold">Institution & Placement Analytics</h2><p className="text-xs text-slate-500">Monitor skill development, opportunity participation and placement readiness.</p></div></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">{[['Students',analytics?.students],['Verified Skills',analytics?.verifiedSkills],['Opportunities',analytics?.activeOpportunities],['Applications',analytics?.applications],['Placement Ready',`${analytics?.placementReady||0}%`],['Internships Completed',analytics?.internshipsCompleted||0]].map(([k,v])=><div className="p-4 rounded-xl bg-slate-50 border" key={k as string}><p className="text-xs text-slate-500">{k}</p><p className="text-xl font-bold mt-1">{v}</p></div>)}</div><div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100"><p className="text-sm font-semibold text-blue-900">Decision support</p><p className="text-xs text-blue-800 mt-1">Use these metrics to identify high-demand skills, improve internship participation and focus training on placement readiness gaps.</p></div></section>}

    {tab==='portfolio' && opportunities.length>0 && <section className="bg-white rounded-2xl border border-slate-200 p-5"><h2 className="font-bold">Quick Apply</h2><div className="grid md:grid-cols-2 gap-3 mt-3">{opportunities.slice(0,4).map((o:any)=><div className="flex items-center justify-between p-3 rounded-xl border" key={o.id}><div className="min-w-0"><p className="text-sm font-semibold truncate">{o.title}</p><p className="text-xs text-slate-500">{o.organization} · {o.matchScore}% match</p></div><button onClick={()=>apply(o)} disabled={o.hasApplied} className="ml-3 shrink-0 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs disabled:opacity-50">{o.hasApplied?'Applied':'Apply'}</button></div>)}</div></section>}
  </div>;
};

const Card=({title,icon:Icon,items,empty}:{title:string,icon:any,items:any[],empty:string})=><div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-blue-600"/><h3 className="font-semibold text-sm">{title}</h3></div>{items?.length?<div className="mt-3 space-y-2">{items.map((x:any,i:number)=><div key={i} className="text-sm"><p className="font-medium">{x.title||x.name}</p><p className="text-xs text-slate-500">{x.issuer||x.description||''}</p>{(x.verified||false)&&<span className="text-[10px] text-emerald-600"><CheckCircle2 className="w-3 h-3 inline mr-1"/>Verified</span>}</div>)}</div>:<p className="text-xs text-slate-400 mt-3">{empty}</p>}</div>;
const Empty=({text}:{text:string})=><div className="py-12 text-center text-sm text-slate-500">{text}</div>;
