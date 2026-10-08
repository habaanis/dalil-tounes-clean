import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Lang = 'fr' | 'en' | 'ar';
type Recommendation = 'business' | 'portfolio' | 'both';
const copy = {"fr":{"language":"Langue","brand":"Dalil Tounes · Diagnostic interactif","multiple":"Plusieurs réponses possibles","instruction":"Choisissez une ou plusieurs réponses. « Tous ces choix » sélectionne les réponses compatibles.","all":"Tous ces choix","back":"← Retour","next":"Continuer →","show":"Voir mon résultat","done":"Votre diagnostic est terminé","matchOne":"pourrait vous correspondre","matchBoth":"peuvent vous correspondre","disclaimer":"Cette orientation présente les modèles disponibles, sans évaluer votre entreprise.","discover":"Découvrez les présentations","demoNotice":"Une véritable démonstration correspondant à ce modèle sera reliée après vérification.","actual":"Découvrir le CV Business Dalil Tounes ↗","ask":"Souhaitez-vous recevoir un exemple adapté à votre activité ?","yes":"Oui, recevoir un exemple","no":"Non, merci","request":"Recevoir un exemple personnalisé","notReady":"Le formulaire sécurisé n'est pas encore disponible. Aucune coordonnée n'est demandée ni enregistrée sur cette version.","privacy":"Confidentialité","thanks":"Merci d’avoir participé !","thanksBody":"Vous pouvez découvrir les modèles Dalil Tounes sans communiquer vos coordonnées.","review":"Revoir mon résultat","recommended":"Recommandé","question":"Question","both":"Les deux modèles","descB":"Vous souhaitez surtout présenter votre activité, vos services et faciliter les échanges.","descP":"Vous souhaitez mettre en avant vos produits et réalisations, tout en restant joignable.","descBoth":"Vous souhaitez présenter votre activité et montrer vos réalisations. Les deux modèles peuvent convenir.","demoB":"Présentation de l’activité, des services et des contacts.","demoP":"Une place importante pour les produits, photos et réalisations."},"en":{"language":"Language","brand":"Dalil Tounes · Interactive questionnaire","multiple":"Multiple answers allowed","instruction":"Select one or more answers. “All of these” selects compatible options.","all":"All of these","back":"← Back","next":"Continue →","show":"See my result","done":"Your questionnaire is complete","matchOne":"could suit you","matchBoth":"could suit you","disclaimer":"This guidance introduces available models; it is not an assessment of your business.","discover":"Explore the presentations","demoNotice":"A verified demonstration for this specific model will be linked here once available.","actual":"Explore Dalil Tounes CV Business ↗","ask":"Would you like an example tailored to your activity?","yes":"Yes, request an example","no":"No, thank you","request":"Request a personalized example","notReady":"The secure contact form is not yet available. No contact details are requested or saved in this version.","privacy":"Privacy","thanks":"Thank you for taking part!","thanksBody":"You can explore Dalil Tounes models without providing contact details.","review":"Review my result","recommended":"Recommended","question":"Question","both":"Both models","descB":"You mainly want to introduce your business, services and make contact easier.","descP":"You want to showcase products and work while remaining easy to reach.","descBoth":"You want to introduce your business and showcase your work. Either model may suit you.","demoB":"Business presentation, services and contact information.","demoP":"Focus on products, pictures and completed work."},"ar":{"language":"اللغة","brand":"دليل تونس · استبيان تفاعلي","multiple":"يمكن اختيار عدة إجابات","instruction":"اختر إجابة واحدة أو أكثر. خيار «جميع هذه الخيارات» يحدد الخيارات المتوافقة.","all":"جميع هذه الخيارات","back":"→ رجوع","next":"متابعة ←","show":"عرض النتيجة","done":"اكتمل الاستبيان","matchOne":"قد يناسب نشاطك","matchBoth":"قد يناسبان نشاطك","disclaimer":"تساعدك هذه النتيجة على التعرف على النموذجين، ولا تمثل تقييماً لمؤسستك.","discover":"اكتشف نماذج العرض","demoNotice":"ستُضاف هنا نسخة تجريبية موثوقة لهذا النموذج بعد التحقق من رابطها.","actual":"اكتشف CV Business من دليل تونس ↗","ask":"هل ترغب في الحصول على مثال مخصص لنشاطك؟","yes":"نعم، أريد مثالاً","no":"لا، شكراً","request":"طلب مثال مخصص","notReady":"استمارة الاتصال الآمنة غير متاحة بعد. لن نطلب أو نسجل بيانات اتصال في هذه النسخة.","privacy":"سياسة الخصوصية","thanks":"شكراً لمشاركتك!","thanksBody":"يمكنك اكتشاف نماذج دليل تونس دون مشاركة بيانات الاتصال.","review":"مراجعة النتيجة","recommended":"موصى به","question":"السؤال","both":"النموذجان","descB":"ترغب أساساً في تقديم نشاطك وخدماتك وتسهيل التواصل مع حرفائك.","descP":"ترغب في إبراز منتجاتك وأعمالك مع تسهيل التواصل معك.","descBoth":"ترغب في تقديم نشاطك وعرض أعمالك؛ وقد يناسبك كلا النموذجين.","demoB":"عرض النشاط والخدمات ووسائل الاتصال.","demoP":"مساحة أكبر للمنتجات والصور والأعمال المنجزة."}};
const questions = [{"fr":["Comment présentez-vous votre activité aujourd’hui ?","Bouche-à-oreille","Réseaux sociaux","Site internet","Carte de visite","Pas encore"],"en":["How do you currently present your business?","Word of mouth","Social media","Website","Business card","Not yet"],"ar":["كيف تقدم نشاطك حالياً؟","التوصيات الشفهية","شبكات التواصل الاجتماعي","موقع إلكتروني","بطاقة عمل","ليس بعد"],"exclusive":4},{"fr":["Qu’aimeriez-vous faciliter pour vos clients ?","Me contacter","Comprendre mes services","Voir mon travail","Me localiser","Consulter les avis"],"en":["What would you like to make easier for customers?","Contact me","Understand my services","See my work","Find my location","Read reviews"],"ar":["ما الذي تريد تسهيله على حرفائك؟","التواصل معي","فهم خدماتي","مشاهدة أعمالي","العثور على موقعي","الاطلاع على التقييمات"]},{"fr":["Qu’avez-vous surtout envie de montrer ?","Mon activité","Mes services","Mes réalisations","Mes produits","Mes références"],"en":["What do you most want to showcase?","My business","My services","My work","My products","My references"],"ar":["ما الذي ترغب في إبرازه بشكل أساسي؟","نشاطي","خدماتي","أعمالي المنجزة","منتجاتي","مراجعي المهنية"]},{"fr":["Qu’utilisez-vous déjà pour présenter votre travail ?","Photos","Vidéos","Exemples de projets","Présentation écrite","Pas encore de contenu"],"en":["What content do you already use?","Photos","Videos","Project examples","Written introduction","No content yet"],"ar":["ما المحتوى الذي تستخدمه حالياً للتعريف بعملك؟","صور","فيديوهات","أمثلة لمشاريع","نبذة مكتوبة","لا أملك محتوى بعد"],"exclusive":4},{"fr":["Comment aimeriez-vous partager votre présentation ?","Lien direct","QR Business","WhatsApp","E-mail","Réseaux sociaux"],"en":["How would you like to share your presentation?","Direct link","QR Business","WhatsApp","Email","Social media"],"ar":["كيف ترغب في مشاركة ملفك المهني؟","رابط مباشر","رمز QR Business","واتساب","البريد الإلكتروني","شبكات التواصل الاجتماعي"]},{"fr":["Que souhaitez-vous découvrir maintenant ?","Voir un exemple","Recevoir un exemple adapté","Mieux comprendre","Pas maintenant"],"en":["What would you like to do next?","See an example","Request a tailored example","Learn more","Not now"],"ar":["ماذا ترغب في اكتشافه الآن؟","مشاهدة مثال","طلب مثال مخصص","معرفة المزيد","ليس الآن"],"exclusive":3}];
const recommend = (values: number[]): Recommendation => {
  const b = (values.includes(0) ? 2 : 0) + (values.includes(1) ? 2 : 0) + (values.includes(4) ? 1 : 0);
  const p = (values.includes(2) ? 2 : 0) + (values.includes(3) ? 2 : 0) + (values.includes(4) ? 1 : 0);
  return b - p >= 2 ? 'business' : p - b >= 2 ? 'portfolio' : 'both';
};
function emit(event: string, detail: Record<string,string|number> = {}) {
  const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
  const payload = {event:'dalil_diagnostic_' + event, source, ...detail};
  window.dispatchEvent(new CustomEvent('dalil:diagnostic',{detail:payload}));
  const layer = (window as Window & {dataLayer?: Record<string,string|number>[]}).dataLayer;
  if (Array.isArray(layer)) layer.push(payload);
}
export default function DiagnosticCvPage() {
  const [lang, setLang] = useState<Lang>(() => {
    const param = new URLSearchParams(window.location.search).get('lang');
    return param === 'ar' || param === 'en' ? param : 'fr';
  });
  const t = copy[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(() => questions.map(() => []));
  const [view, setView] = useState<'questions'|'result'|'request'|'thanks'>('questions');
  const started = useRef(false);
  useEffect(() => { emit('view',{language:lang}); }, [lang]);
  const selection = answers[step];
  const current = questions[step];
  const eligible = current[lang].slice(1).map((_,i)=>i).filter(i=>i!==current.exclusive);
  const allChecked = eligible.every(i=>selection.includes(i)) && !selection.includes(current.exclusive ?? -1);
  const result = useMemo(() => recommend(answers[2]),[answers]);
  function toggle(i:number) {
    if (!started.current) {started.current=true;emit('start',{language:lang});}
    setAnswers(prev => prev.map((row,n) => {
      if(n!==step) return row;
      if(i===-1) return allChecked ? [] : eligible;
      if(i===current.exclusive) return row.includes(i)?[]:[i];
      return row.includes(i)?row.filter(x=>x!==i):[...row.filter(x=>x!==current.exclusive),i];
    }));
  }
  function next() {
    emit('question_completed',{question:step+1,language:lang});
    if(step===5) {emit('completed',{recommendation:result,language:lang});setView('result');}
    else setStep(x=>x+1);
  }
  const resultTitle = result==='business'?'CV Business':result==='portfolio'?'CV Portfolio':t.both;
  const summary = result==='business'?t.descB:result==='portfolio'?t.descP:t.descBoth;
  return <main className="dt-diagnostic" dir={lang==='ar'?'rtl':'ltr'} lang={lang}>
    <style>{`
      .dt-diagnostic{font-family:inherit;min-height:75vh;padding:38px 14px;color:#153d38;background:#f6f8f5}
      .dt-diagnostic .panel{max-width:720px;margin:0 auto;padding:clamp(20px,5vw,40px);border-radius:20px;background:#fff;border:1px solid #dfe7e3}
      .dt-diagnostic h1{font-size:clamp(24px,4vw,36px);line-height:1.3;margin:15px 0}
      .dt-diagnostic p{line-height:1.65}.dt-diagnostic .muted{color:#566b66;font-size:14px}
      .dt-diagnostic .top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
      .dt-diagnostic .top select{background:#fff;color:inherit;border:1px solid #a9bcb3;border-radius:9px;padding:9px}
      .dt-diagnostic .progress{display:flex;gap:6px;margin:24px 0}
      .dt-diagnostic .progress span{height:7px;flex:1;border-radius:8px;background:#dfe6e3}
      .dt-diagnostic .progress span.active{background:#26775c}
      .dt-diagnostic .options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
      .dt-diagnostic button{font:inherit;cursor:pointer}
      .dt-diagnostic .choice{background:white;color:inherit;border:1px solid #bacbc2;border-radius:11px;min-height:62px;padding:14px;text-align:start}
      .dt-diagnostic .choice[aria-pressed=true]{background:#e2f3ea;border-color:#24704f;font-weight:700}
      .dt-diagnostic .choice.all{grid-column:1/-1}
      .dt-diagnostic .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
      .dt-diagnostic .action{padding:13px 20px;border-radius:10px;border:1px solid #26775c;background:#26775c;color:white;text-decoration:none}
      .dt-diagnostic .action.alt{color:#26775c;background:transparent}
      .dt-diagnostic button:disabled{opacity:.45;cursor:not-allowed}
      .dt-diagnostic :focus-visible{outline:3px solid #66ad91;outline-offset:2px}
      .dt-diagnostic .demo{border:1px solid #dfe7e3;border-radius:12px;padding:15px;margin:12px 0}
      @media(max-width:540px){.dt-diagnostic .options{grid-template-columns:1fr}.dt-diagnostic .action{flex:1}}
    `}</style>
    <div className="panel">
      <div className="top"><strong>{t.brand}</strong><label>{t.language} <select aria-label={t.language} value={lang} onChange={e=>setLang(e.target.value as Lang)}><option value="fr">Français</option><option value="en">English</option><option value="ar">العربية</option></select></label></div>
      {view==='questions'?<>
        <div className="progress" aria-label={t.question+' '+(step+1)+' / 6'}>{questions.map((_,i)=><span key={i} className={i<=step?'active':''}/>)}</div>
        <p className="muted">{t.question} {step+1} / 6 · {t.multiple}</p>
        <h1>{current[lang][0]}</h1><p className="muted">{t.instruction}</p>
        <div className="options">{current[lang].slice(1).map((label,i)=><button type="button" key={i} className="choice" aria-pressed={selection.includes(i)} onClick={()=>toggle(i)}>{selection.includes(i)?'✓ ':''}{label}</button>)}
        <button type="button" className="choice all" aria-pressed={allChecked} onClick={()=>toggle(-1)}>✓ {t.all}</button></div>
        <div className="actions"><button type="button" className="action alt" disabled={step===0} onClick={()=>setStep(i=>i-1)}>{t.back}</button><button type="button" className="action" disabled={!selection.length} onClick={next}>{step===5?t.show:t.next}</button></div>
      </>:view==='result'?<>
        <p className="muted">{t.done}</p><h1>{resultTitle} {result==='both'?t.matchBoth:t.matchOne}</h1><p>{summary}</p><p className="muted">{t.disclaimer}</p><h2>{t.discover}</h2>
        {(['business','portfolio'] as const).map((model,i)=><div className="demo" key={model}><strong>{i===0?'CV Business':'CV Portfolio'} {result===model?'· '+t.recommended:''}</strong><p>{i===0?t.demoB:t.demoP}</p><p className="muted">{t.demoNotice}</p></div>)}
        <p><a href="/cv-business" target="_blank" rel="noopener noreferrer" onClick={()=>emit('demo_opened',{demo:'cv-business-dalil',language:lang})}>{t.actual}</a></p>
        <h2>{t.ask}</h2><div className="actions"><button type="button" className="action" onClick={()=>{emit('request_yes',{language:lang});setView('request');}}>{t.yes}</button><button type="button" className="action alt" onClick={()=>{emit('request_no',{language:lang});setView('thanks');}}>{t.no}</button></div>
      </>:view==='request'?<>
        <h1>{t.request}</h1><p>{t.notReady}</p><p><Link to="/politique-confidentialite">{t.privacy}</Link></p>
        <button type="button" className="action alt" onClick={()=>setView('result')}>{t.back}</button>
      </>:<>
        <h1>{t.thanks}</h1><p>{t.thanksBody}</p><button type="button" className="action" onClick={()=>setView('result')}>{t.review}</button>
      </>}
    </div>
  </main>;
}
