import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Choice = { label: string; exclusive?: boolean };
type Question = { title: string; choices: Choice[] };
const questions: Question[] = [
  { title: 'Comment présentez-vous votre activité aujourd’hui ?', choices: [
    {label:'Bouche-à-oreille'}, {label:'Réseaux sociaux'}, {label:'Site internet'}, {label:'Carte de visite'}, {label:'Pas encore',exclusive:true},
  ]},
  { title: 'Qu’aimeriez-vous faciliter pour vos clients ?', choices: [
    {label:'Me contacter'}, {label:'Comprendre mes services'}, {label:'Voir mon travail'}, {label:'Me localiser'}, {label:'Consulter les avis'},
  ]},
  { title: 'Qu’avez-vous surtout envie de montrer ?', choices: [
    {label:'Mon activité'}, {label:'Mes services'}, {label:'Mes réalisations'}, {label:'Mes produits'}, {label:'Mes références'},
  ]},
  { title: 'Qu’utilisez-vous déjà pour présenter votre travail ?', choices: [
    {label:'Photos'}, {label:'Vidéos'}, {label:'Exemples de projets'}, {label:'Présentation écrite'}, {label:'Pas encore de contenu',exclusive:true},
  ]},
  { title: 'Comment aimeriez-vous partager votre présentation ?', choices: [
    {label:'Lien direct'}, {label:'QR Business'}, {label:'WhatsApp'}, {label:'E-mail'}, {label:'Réseaux sociaux'},
  ]},
  { title: 'Que souhaitez-vous découvrir maintenant ?', choices: [
    {label:'Voir un exemple'}, {label:'Recevoir un exemple adapté'}, {label:'Mieux comprendre'}, {label:'Pas maintenant',exclusive:true},
  ]},
];
type Recommendation = 'business' | 'portfolio' | 'both';
// Anonymous event hooks only. A reporting destination still needs to be configured.
function diagnosticEvent(name: string, detail: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
  const payload = { event: 'dalil_diagnostic_' + name, source, ...detail };
  window.dispatchEvent(new CustomEvent('dalil:diagnostic', { detail: payload }));
  const analyticsWindow = window as Window & { dataLayer?: Record<string, string | number>[] };
  if (Array.isArray(analyticsWindow.dataLayer)) analyticsWindow.dataLayer.push(payload);
}

const recommend = (selected: string[]): Recommendation => {
  const business = (selected.includes('Mon activité') ? 2 : 0) + (selected.includes('Mes services') ? 2 : 0) + (selected.includes('Mes références') ? 1 : 0);
  const portfolio = (selected.includes('Mes réalisations') ? 2 : 0) + (selected.includes('Mes produits') ? 2 : 0) + (selected.includes('Mes références') ? 1 : 0);
  return business - portfolio >= 2 ? 'business' : portfolio - business >= 2 ? 'portfolio' : 'both';
};
const demos = [{name:'CV Business',detail:'Présentation de l’activité, des services et des contacts.'},{name:'CV Portfolio',detail:'Une place importante pour les produits, photos et réalisations.'}];
export default function DiagnosticCvPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(() => questions.map(() => []));
  const [view, setView] = useState<'questions'|'result'|'request'|'thanks'>('questions');
  const [contact, setContact] = useState<'whatsapp'|'email'|'telephone'>('whatsapp');
  const [activity, setActivity] = useState('');
  const [contactValue, setContactValue] = useState('');
  
  const started = useRef(false);
  useEffect(() => { diagnosticEvent('view'); }, []);
  const begin = () => { if (!started.current) { started.current = true; diagnosticEvent('start'); } };
  const nextQuestion = () => {
    begin();
    diagnosticEvent('question_completed', { question: step + 1 });
    if (step === questions.length - 1) {
      diagnosticEvent('completed', { recommendation: recommend(answers[2]) });
      setView('result');
    } else setStep(s => s + 1);
  };
  const result = useMemo(() => recommend(answers[2]), [answers]);
  const all = questions[step].choices.filter(c => !c.exclusive).map(c => c.label);
  const picked = answers[step];
  const toggle = (label: string, exclusive = false) => {
    begin();
    const next = label === 'Tous ces choix' ? (all.every(v => picked.includes(v)) ? [] : all)
      : exclusive ? (picked.includes(label) ? [] : [label])
      : picked.includes(label) ? picked.filter(v => v !== label)
      : [...picked.filter(v => !questions[step].choices.find(c => c.label === v)?.exclusive), label];
    setAnswers(previous => previous.map((a,i) => i === step ? next : a));
  };
  const resultTitle = result === 'business' ? 'CV Business' : result === 'portfolio' ? 'CV Portfolio' : 'Les deux modèles';
  const description = result === 'business' ? 'Vous souhaitez avant tout présenter votre activité, vos services et faciliter les échanges.'
    : result === 'portfolio' ? 'Vous souhaitez mettre en avant vos produits et vos réalisations tout en restant facilement joignable.'
    : 'Vous voulez présenter votre activité et montrer vos réalisations. Les deux modèles peuvent convenir.';

  return <div className="ln-diagnostic">
    <style>{`
      .ln-diagnostic{font-family:inherit;color:#173b32;min-height:72vh;background:#f7f6f0;padding:56px 18px}
      .ln-diagnostic .ln-panel{max-width:720px;margin:auto;background:#fff;border:1px solid #e5e6df;border-radius:22px;padding:clamp(22px,5vw,42px);box-shadow:0 15px 40px #102e2112}
      .ln-diagnostic h1{font-size:clamp(26px,4.3vw,39px);line-height:1.18;margin:12px 0 14px;color:#173b32}
      .ln-diagnostic p{line-height:1.55}.ln-diagnostic .ln-eyebrow{font-size:12px;letter-spacing:.08em;font-weight:700;color:#527568;text-transform:uppercase}
      .ln-diagnostic .ln-progress{display:flex;gap:5px;margin:22px 0 25px}.ln-diagnostic .ln-progress i{flex:1;height:6px;border-radius:6px;background:#e4e8e2}.ln-diagnostic .ln-progress i.active{background:#2e8061}
      .ln-diagnostic .ln-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
      .ln-diagnostic button,.ln-diagnostic a.ln-btn{cursor:pointer;font:inherit}
      .ln-diagnostic .ln-choice{padding:15px;text-align:left;border:1px solid #dce3da;border-radius:12px;background:white;color:#173b32;min-height:66px}
      .ln-diagnostic .ln-choice[aria-pressed=true]{border-color:#28775b;background:#e9f4ee;font-weight:650}
      .ln-diagnostic .ln-choice:focus-visible,.ln-diagnostic .ln-btn:focus-visible{outline:3px solid #92bcad;outline-offset:2px}
      .ln-diagnostic .ln-choice.all{grid-column:1/-1}.ln-diagnostic .ln-actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:26px}
      .ln-diagnostic .ln-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #28775b;background:#28775b;color:#fff;padding:13px 20px;border-radius:11px;font-weight:650}
      .ln-diagnostic .ln-btn.alt{background:transparent;color:#23684f}.ln-diagnostic .ln-btn:disabled{opacity:.45;cursor:not-allowed}
      .ln-diagnostic .ln-demo{border:1px solid #e2e6df;padding:18px;border-radius:14px;margin-top:14px}
      .ln-diagnostic .ln-muted{color:#64756d;font-size:14px}.ln-diagnostic .ln-field{display:block;margin:18px 0;font-weight:600}
      .ln-diagnostic .ln-field input,.ln-diagnostic .ln-field select{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:12px;border:1px solid #cdd7cf;border-radius:10px;font:inherit;color:#173b32;background:white}
      @media(max-width:520px){.ln-diagnostic{padding:22px 12px}.ln-diagnostic .ln-choices{grid-template-columns:1fr}.ln-diagnostic .ln-actions .ln-btn{flex:1}}
    `}</style>
    <div className="ln-panel">
      <div className="ln-eyebrow">Dalil Tounes · Diagnostic interactif</div>
      {view === 'questions' ? <>
        <div className="ln-progress" aria-label={`Question ${step+1} sur 6`}>{questions.map((_,i)=><i className={i<=step?'active':''} key={i}/>)}</div>
        <p className="ln-muted">Question {step+1} sur 6 · Plusieurs réponses possibles</p>
        <h1>{questions[step].title}</h1>
        <p className="ln-muted">Sélectionnez une ou plusieurs réponses. « Tous ces choix » sélectionne toutes les réponses compatibles.</p>
        <div className="ln-choices">{questions[step].choices.map(c=><button type="button" className="ln-choice" aria-pressed={picked.includes(c.label)} onClick={()=>toggle(c.label,!!c.exclusive)} key={c.label}>{picked.includes(c.label)?'✓ ':''}{c.label}</button>)}
          <button type="button" className="ln-choice all" aria-pressed={all.every(v=>picked.includes(v))} onClick={()=>toggle('Tous ces choix')}>✓ Tous ces choix</button>
        </div>
        <div className="ln-actions"><button type="button" className="ln-btn alt" disabled={step===0} onClick={()=>setStep(s=>s-1)}>← Retour</button><button type="button" className="ln-btn" disabled={!picked.length} onClick={nextQuestion}>{step===5?'Voir mon résultat':'Continuer →'}</button></div>
      </> : view === 'result' ? <>
        <p className="ln-eyebrow">Votre diagnostic est terminé</p><h1>{resultTitle} {result==='both'?'peuvent vous correspondre':'pourrait vous correspondre'}</h1>
        <p>{description}</p><p className="ln-muted">Cette orientation vous aide à découvrir les modèles. Elle ne constitue pas une évaluation de votre entreprise.</p>
        <h2>Découvrez les présentations</h2>
        {demos.map((d,i)=><div className="ln-demo" key={d.name}><h3>{d.name} {result!=='both' && ((result==='business'&&i===0)||(result==='portfolio'&&i===1))?'· Recommandée':''}</h3><p>{d.detail}</p><p className="ln-muted">Une véritable démonstration Dalil Tounes correspondant à ce modèle sera reliée ici après vérification.</p></div>)}
        <p><a href="/cv-business" target="_blank" rel="noopener noreferrer" onClick={()=>diagnosticEvent('demo_opened',{demo:'aux-saveurs-danis',recommendation:result})}>Découvrir le CV Business Dalil Tounes ↗</a></p>
        <h2>Souhaitez-vous recevoir un exemple adapté à votre activité ?</h2>
        <div className="ln-actions"><button className="ln-btn" onClick={()=>{diagnosticEvent('request_yes',{recommendation:result});setView('request');}}>Oui, recevoir un exemple</button><button className="ln-btn alt" onClick={()=>{diagnosticEvent('request_no',{recommendation:result});setView('thanks');}}>Non, merci</button></div>
      </> : view === 'request' ? <>
        <p className="ln-eyebrow">Étape facultative</p><h1>Recevoir un exemple adapté à votre activité</h1>
        <p>Aucun paiement n'est demandé. Le formulaire d'envoi sera raccordé avant publication. Aucune donnée n'est envoyée depuis cette version de travail.</p>
        <label className="ln-field">Votre activité<input value={activity} onChange={e=>setActivity(e.target.value)} placeholder="Ex. traiteur, consultant" required/></label>
        <label className="ln-field">Moyen de contact préféré<select value={contact} onChange={e=>{setContact(e.target.value as typeof contact);setContactValue('');}}><option value="whatsapp">WhatsApp</option><option value="email">E-mail</option><option value="telephone">Téléphone</option></select></label>
        <label className="ln-field">{contact==='email'?'Adresse e-mail':'Numéro de téléphone'}<input type={contact==='email'?'email':'tel'} value={contactValue} onChange={e=>setContactValue(e.target.value)} required/></label>

        <p className="ln-muted">Vos réponses ne sont pas enregistrées par cette version de travail. <Link to="/politique-confidentialite">Confidentialité</Link></p>
        <div className="ln-actions"><button className="ln-btn alt" onClick={()=>setView('result')}>← Retour</button><button type="button" className="ln-btn" disabled>Envoi en préparation</button></div>
      </> : <>
        <h1>Merci d’avoir participé !</h1><p>Vous pouvez continuer à découvrir les modèles Dalil Tounes sans communiquer vos coordonnées.</p><button className="ln-btn" onClick={()=>setView('result')}>Revoir mon résultat</button>
      </>}
    </div>
  </div>;
}
