import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const model = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ai_model', 'model.json'), 'utf8'));
const index = new Map(Object.entries(model.vocabulary));

function tokenize(text) {
  const words = String(text || '').toLowerCase().match(/\b\w\w+\b/g) || [];
  const grams = [...words];
  for (let i = 0; i < words.length - 1; i++) grams.push(`${words[i]} ${words[i + 1]}`);
  return grams;
}

function predict(text) {
  const counts = new Map();
  for (const token of tokenize(text)) {
    const idx = index.get(token);
    if (idx !== undefined) counts.set(Number(idx), (counts.get(Number(idx)) || 0) + 1);
  }
  const values = new Array(model.feature_count).fill(0);
  for (const [i, count] of counts) values[i] = count * model.idf[i];
  const norm = Math.sqrt(values.reduce((s, v) => s + v * v, 0)) || 1;
  for (let i = 0; i < values.length; i++) values[i] /= norm;
  const scores = model.classes.map((_, c) => model.intercept[c] + model.coef[c].reduce((s, w, i) => s + w * values[i], 0));
  const order = scores.map((score, i) => ({ intent: model.classes[i], score })).sort((a,b) => b.score-a.score);
  return { intent: order[0]?.intent || 'action_plan', confidence: order[0] ? 1/(1+Math.exp(-order[0].score)) : 0, alternatives: order.slice(1,3) };
}

function listSkills(input) {
  if (Array.isArray(input?.skillDetails)) return input.skillDetails.map(x => ({ name:String(x.name || x.skill || ''), score:Number(x.score ?? x.level ?? 0) })).filter(x=>x.name);
  if (Array.isArray(input?.skills)) return input.skills.map(x => ({name:String(x),score:null}));
  return [];
}

function topSkills(skills) { return skills.filter(s=>s.score==null || s.score>=70).slice(0,4); }
function weakSkills(skills) { return skills.filter(s=>s.score!=null && s.score<60).sort((a,b)=>(a.score??0)-(b.score??0)).slice(0,4); }
function role(input) { return String(input?.targetRole || 'your target role').trim(); }
function lang(input) { return input?.language === 'hi'; }

function response(input, prediction) {
  const skills=listSkills(input), strong=topSkills(skills), weak=weakSkills(skills), r=role(input), hi=lang(input);
  const strongText=strong.length ? strong.map(s=>`${s.name}${s.score!=null?` (${s.score}%)`:''}`).join(', ') : 'your current profile';
  const weakText=weak.length ? weak.map(s=>`${s.name}${s.score!=null?` (${s.score}%)`:''}`).join(', ') : 'your lower-scoring or missing skills';
  const confidence=Math.round(prediction.confidence*100);
  const actions={
    next_skills: hi ? [`${weakText} me se sabse important skill choose karo.`, `${r} ke job descriptions se required level compare karo.`, 'Ek hands-on project me skill apply karo.', 'Weekly progress dashboard me update karo.'] : [`Prioritize ${weakText}.`, `Compare the required level for ${r} with your current scores.`, 'Apply the skill in a hands-on project.', 'Track weekly progress in Skill Map.'],
    skill_gaps: hi ? [`Tumhare current profile me priority gap ${weakText} hai.`, `${r} ke required skills ke saath exact comparison karo.`, 'High-gap skill ko pehle learning roadmap me rakho.'] : [`Your visible priority gaps are ${weakText}.`, `Compare them against the required skills for ${r}.`, 'Put the highest-impact gap first in your learning roadmap.'],
    readiness: hi ? [`Abhi readiness ko profile ke scores ke basis par dekho; strong areas ${strongText} hain.`, `Agar ${weakText} role ke core requirements hain to pehle unhe improve karo.`, 'Projects + interview practice ke baad applications start karo.'] : [`Judge readiness from your profile scores; current strengths include ${strongText}.`, `If ${weakText} are core requirements for ${r}, improve those first.`, 'Then validate readiness through projects and interview practice before applying.'],
    career_choice: hi ? [`Tumhare profile me ${strongText} visible strengths hain, isliye ${r} ek starting direction ho sakta hai.`, '2-3 related roles ko required skills ke basis par compare karo.', 'Jis role me gap manageable ho aur interest strong ho, use prioritize karo.'] : [`Your visible strengths include ${strongText}, so ${r} can be a reasonable direction to evaluate.`, 'Compare 2-3 related roles by required skills.', 'Prioritize the role where the gap is manageable and interest is strong.'],
    resume: hi ? ['Resume me measurable project outcomes add karo.', 'Skills ko actual projects/evidence ke saath connect karo.', 'Target role ke keywords ko naturally include karo.'] : ['Add measurable project outcomes to your resume.', 'Connect skills to concrete projects and evidence.', 'Use target-role keywords naturally and honestly.'],
    interview: hi ? ['Target role ke core concepts revise karo.', 'Apne projects ko STAR-style stories me explain karne ki practice karo.', 'Weak skills par technical questions practice karo.'] : ['Review the core concepts for your target role.', 'Practice explaining your projects with clear problem-action-result stories.', 'Practice technical questions around your weaker skills.'],
    projects: hi ? [`${r} ke liye ek end-to-end project banao.`, `Project me ${weakText} ko demonstrate karo.`, 'README, tests and deployment evidence add karo.'] : [`Build an end-to-end project for ${r}.`, `Use the project to demonstrate ${weakText}.`, 'Add README, tests, and deployment evidence.'],
    learning: hi ? [`Sabse pehle ${weakText} par focused learning karo.`, 'Theory ke baad practice task complete karo.', 'Har skill ko project milestone se validate karo.'] : [`Start focused learning on ${weakText}.`, 'Follow theory with a practical task.', 'Validate each skill through a project milestone.'],
    jobs: hi ? [`${r} se related opportunities search karo.`, 'Required skills ko apne profile scores se compare karo.', 'Strong-match roles par pehle apply karo aur gaps ko roadmap me track karo.'] : [`Search opportunities related to ${r}.`, 'Compare each requirement with your profile scores.', 'Apply first to strong matches and track remaining gaps in your roadmap.'],
    timeline: hi ? ['Weekly 6-10 focused hours allocate karna useful starting point hai.', 'High-priority gaps ko pehle close karo.', 'Har 2-4 weeks me readiness dobara assess karo.'] : ['A focused 6-10 hours per week is a useful starting point.', 'Close high-priority gaps first.', 'Reassess readiness every 2-4 weeks.'],
    match_score: hi ? ['Match score profile skills aur role requirements ke comparison par based hona chahiye.', 'Matched, partial aur missing skills alag dekho.', 'Low score ko actionable skill gaps me convert karo.'] : ['The match score should compare your profile skills with role requirements.', 'Review matched, partial, and missing skills separately.', 'Turn a low score into actionable skill gaps.'],
    strengths: hi ? [`Tumhari visible strengths: ${strongText}.`, 'In skills ko projects aur resume evidence se prove karo.', 'In strengths ko target role ki requirements se map karo.'] : [`Your visible strengths are ${strongText}.`, 'Prove these strengths with projects and resume evidence.', 'Map these strengths to the requirements of your target role.'],
    action_plan: hi ? ['Aaj highest-priority gap choose karo.', '45-60 minutes focused learning karo.', '30-60 minutes practical task karo.', 'Week ke end me progress update karo.'] : ['Choose the highest-priority gap today.', 'Spend 45-60 minutes on focused learning.', 'Spend 30-60 minutes on a practical task.', 'Update your progress at the end of the week.'],
    greeting: hi ? [`Namaste! Main Skill Map ka local trained career assistant hoon. Tum ${r}, skills, skill gaps, resume, projects ya jobs ke baare me pooch sakte ho.`] : [`Hi! I’m Skill Map’s local trained career assistant. Ask me about ${r}, skills, skill gaps, your resume, projects, learning, or jobs.`],
    thanks: hi ? ['Welcome! Jab bhi chaho apne skills, target role ya roadmap ke saath question pooch sakte ho.'] : ['You’re welcome! Ask me anything about your skills, target role, roadmap, resume, projects, or opportunities.']
  };
  const lines=actions[prediction.intent] || actions.action_plan;
  const intro = hi ? `Maine tumhare question ko ${prediction.intent.replace('_',' ')} intent ke roop me classify kiya (confidence ~${confidence}%).` : `I classified your question as ${prediction.intent.replace('_',' ')} (confidence ~${confidence}%).`;
  return `${intro}\n\n${lines.map((x,i)=>`${i+1}. ${x}`).join('\n')}`;
}

export function localCareerChat(input) {
  const prediction=predict(input?.question || '');
  return { answer: response(input,prediction), intent: prediction.intent, confidence: prediction.confidence, mode:'local-trained' };
}

export function localCareerAnalysis(input) {
  const skills=listSkills(input), strong=topSkills(skills), weak=weakSkills(skills), r=role(input), hi=lang(input);
  return {
    mode:'local-trained',
    summary: hi ? `${r} ke liye local trained career model ne tumhare profile ko analyze kiya. Strong areas: ${strong.length?strong.map(x=>x.name).join(', '):'profile data limited hai'}. Priority gaps: ${weak.length?weak.map(x=>x.name).join(', '):'koi clear low-score skill nahi mili'}.` : `The local trained career model analyzed your profile for ${r}. Strengths: ${strong.length?strong.map(x=>x.name).join(', '):'profile data is limited'}. Priority gaps: ${weak.length?weak.map(x=>x.name).join(', '):'no clear low-score skill was supplied'}.`,
    strengths: strong.map(x=>x.name), gaps: weak.map(x=>x.name),
    recommendations: weak.slice(0,4).map(x=>hi?`${x.name} ko priority do aur ek practical project me apply karo.`:`Prioritize ${x.name} and apply it in a practical project.`),
    roles:[r]
  };
}
