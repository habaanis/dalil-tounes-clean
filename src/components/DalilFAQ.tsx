import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VisitorSuggestions } from './VisitorSuggestions';
import { useLanguage } from '../context/LanguageContext';

type Question = { q: string; a: string };
const faq: Record<'fr' | 'ar',Question[]> = {
  fr: [
    {q:"À quoi sert Dalil Tounes ?",a:"Vous cherchez un commerce, un professionnel ou un service en Tunisie ? Dalil Tounes vous aide à le trouver et à le contacter facilement. Et si vous êtes professionnel, nous vous aidons aussi à faire connaître votre activité et à présenter vos produits."},
    {q:"Puis-je inscrire mon entreprise gratuitement ?",a:"Bien sûr ! Votre entreprise peut être présente gratuitement sur Dalil Tounes avec ses informations essentielles. Et si vous souhaitez aller plus loin, vous pouvez créer votre propre mini-appli professionnelle."},
    {q:"Pourquoi choisir une mini-appli plutôt que la fiche gratuite ?",a:"La fiche gratuite permet aux clients de vous trouver. La mini-appli va plus loin : elle vous aide à convaincre et à vendre. Présentez votre activité, vos réalisations et vos produits dans une carte professionnelle élégante, personnalisée et facile à partager. Votre entreprise bénéficie également d’une meilleure mise en valeur sur Dalil Tounes, pour attirer davantage l’attention des visiteurs."},
    {q:"J’ai déjà des réseaux sociaux ou un site Internet. Pourquoi une mini-appli ?",a:"Les réseaux sociaux attirent l’attention, mais vos publications passent rapidement. Votre mini-appli rassemble tout au même endroit : présentation, photos, coordonnées, produits et boutique. Un seul lien à partager sur tous vos réseaux, pour permettre à vos clients de vous retrouver, de vous contacter et de commander plus facilement."},
    {q:"Mes clients pourront-ils commander mes produits ?",a:"Oui ! Avec la boutique activée, vos clients peuvent consulter vos produits et vous envoyer une commande ou une demande de devis. Vous recevez les demandes et pouvez suivre leur traitement depuis votre espace professionnel."},
    {q:"Combien coûte une mini-appli Dalil Tounes ?",a:"Nous proposons deux formules : Artisan à 30 DT et Premium à 59 DT, avec la première année incluse. À partir de la deuxième année, l’entretien est proposé à 50 DT/an. Pas d’abonnement mensuel imposé pour la création."},
    {q:"Mes clients doivent-ils télécharger ma mini-appli ?",a:"Non, ce n’est pas obligatoire ! Ils peuvent l’ouvrir directement grâce à votre lien ou votre QR Business. Mais ils peuvent aussi l’installer sur leur téléphone pour vous retrouver en un clic. Avec les notifications activées et leur accord, vous pouvez les informer de vos nouveautés et nouveaux produits. Ils peuvent également recevoir des informations sur leurs commandes lorsque le suivi et les notifications sont disponibles. Votre mini-appli devient ainsi un outil pour garder le contact avec vos clients."},
    {q:"Je ne suis pas très à l’aise avec l’informatique. Est-ce compliqué ?",a:"Pas besoin d’être informaticien ! Vous nous transmettez les informations et les photos de votre activité, puis nous préparons votre mini-appli avec vous. Vous vérifiez le résultat avant sa publication. Et votre mini-appli est prête à être partagée avec vos clients."}
  ],
  ar: [
    {q:"شنوة ينجم يقدّملي دليل تونس؟",a:"تلوّج على محلّ، مهني أو خدمة في تونس؟ دليل تونس يعاونك تلقاهم وتتواصل معاهم بسهولة. وإذا عندك نشاط مهني، نعاونوك باش تعرّف بيه وتعرض منتجاتك."},
    {q:"نجم نسجّل مؤسستي مجانًا؟",a:"إي بالطبيعة! تنجم تسجّل مؤسستك مجانًا في دليل تونس بالمعلومات الأساسية متاعها. وإذا تحب تمشي أبعد، تنجم تعمل الميني تطبيق المهني الخاص بيك."},
    {q:"علاش نختار ميني تطبيق بدل البطاقة المجانية؟",a:"البطاقة المجانية تعاون الحرفاء يلقاو نشاطك. أمّا الميني تطبيق يزيد يعاونك تقنعهم وتبيع منتجاتك. تعرض نشاطك، أعمالك ومنتجاتك في بطاقة مهنية أنيقة وشخصية، وسهلة المشاركة. وزادة نشاطك يكون أبرز داخل دليل تونس باش يلفت انتباه الزوار أكثر."},
    {q:"عندي شبكات اجتماعية أو موقع، علاش نحتاج ميني تطبيق؟",a:"الشبكات الاجتماعية تجيب الانتباه، أمّا المنشورات تتعدّى بسرعة. الميني تطبيق يجمع في بلاصة واحدة تقديم نشاطك، الصور، معلومات الاتصال، المنتجات والمتجر. رابط واحد تشاركه في شبكاتك الكل، باش الحرفاء يلقاوك ويتواصلوا معاك ويطلبوا منتجاتك بسهولة."},
    {q:"الحرفاء ينجموا يطلبوا منتجاتي؟",a:"إي! وقت اللي المتجر يكون مفعّل، الحرفاء ينجموا يتفرّجوا على المنتجات ويبعثولك طلبية أو طلب عرض سعر. وإنت تستقبل الطلبات وتتابعها من فضائك المهني."},
    {q:"قدّاش يكلّف الميني تطبيق في دليل تونس؟",a:"عندنا عرضين: Artisan بـ30 دينار وPremium بـ59 دينار، والسنة الأولى داخلة في السعر. من السنة الثانية، الصيانة اختيارية بـ50 دينار في العام. ما فماش اشتراك شهري مفروض لإنشاء الميني تطبيق."},
    {q:"لازم الحرفاء يحمّلوا الميني تطبيق؟",a:"لا، موش ضروري! ينجموا يفتحوه مباشرة بالرابط أو رمز QR Business. وينجموا زادة يثبّتوه على تليفونهم باش يرجعولك بضغطة واحدة. إذا الإشعارات مفعّلة ووافق عليها الحريف، تنجم تعلّمه بالمنتجات الجديدة. وينجم زادة يتلقى أخبار على طلبياته وقت اللي تكون خاصية المتابعة والإشعارات متوفّرة. هكّا تبقى على تواصل مع حرفائك."},
    {q:"ما نفهمش برشة في الإعلامية. الاستعمال صعيب؟",a:"ما يلزمكش تكون خبير! تبعثلنا معلومات نشاطك والصور، ونحضّروا معاك الميني تطبيق. تراجع النتيجة قبل النشر، وبعدها تنجم تشاركه مع حرفائك."}
  ]
};
const labels = {
  fr: { eyebrow:'VOS QUESTIONS, NOS RÉPONSES',title:'Vous avez des questions ? On vous répond simplement.',description:'L’essentiel en quelques questions. Ouvrez une réponse pour en savoir plus.' },
  ar: { eyebrow:'أسئلتكم وإجاباتنا',title:'عندك أسئلة؟ نجاوبوك ببساطة.',description:'إجابات مختصرة عن الأسئلة الأكثر شيوعاً. اضغط على السؤال لمعرفة التفاصيل.' }
};
export default function DalilFAQ() {
  const {language}=useLanguage();
  const locale=language==='ar'?'ar':'fr';
  const t=labels[locale];
  const [expanded,setExpanded]=useState<number|null>(null);
  const [panelOpen,setPanelOpen]=useState(()=>typeof window!=='undefined' && window.location.hash==='#faq');
  useEffect(()=>{
    const openFromNavigation=()=>{
      if(window.location.hash==='#faq'){
        setPanelOpen(true);
        window.requestAnimationFrame(()=>document.getElementById('faq')?.scrollIntoView({block:'start',behavior:'smooth'}));
      }
    };
    openFromNavigation();
    window.addEventListener('hashchange',openFromNavigation);
    return ()=>window.removeEventListener('hashchange',openFromNavigation);
  },[]);
  return <><section id="faq" aria-label={t.title} dir={locale==='ar'?'rtl':'ltr'} className="scroll-mt-20 rounded-xl border border-[#C9A65D] bg-[#FFFCF6] px-3 py-3 shadow-sm">
    <div className="mx-auto max-w-5xl">
      <button type="button" aria-expanded={panelOpen} aria-controls="dalil-faq-items"
        onClick={()=>{setPanelOpen(current=>!current);setExpanded(null);}}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-start text-sm font-semibold text-[#183b2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B79245]">
        <span>{locale==='ar'?'أسئلتكم وإجاباتنا':'Mes questions, nos réponses'}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[#8B6C35]">
          {locale==='ar'?(panelOpen?'تصغير':'تكبير'):(panelOpen?'Réduire':'Agrandir')}
          <ChevronDown aria-hidden="true" className={'h-4 w-4 transition-transform '+(panelOpen?'rotate-180':'')}/>
        </span>
      </button>
      {panelOpen&&<div id="dalil-faq-items" className="border-t border-[#e6d9bf] pt-3">
        <h2 className="font-serif text-base font-semibold leading-tight text-[#183b2f]">{t.title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#555d59]">{t.description}</p>
        <div className="mt-3 space-y-2">
        {faq[locale].map((entry,index)=><div key={index} className="overflow-hidden rounded-xl border border-[#e6d9bf] bg-white">
          <button type="button" aria-expanded={expanded===index}
            aria-controls={'dalil-faq-answer-'+index}
            onClick={()=>setExpanded(current=>current===index?null:index)}
            className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-semibold text-[#183b2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B79245] md:text-base">
            <span>{entry.q}</span>
            <ChevronDown aria-hidden="true" className={'h-4 w-4 shrink-0 text-[#9B762D] transition-transform '+(expanded===index?'rotate-180':'')}/>
          </button>
          {expanded===index&&<div id={'dalil-faq-answer-'+index} className="border-t border-[#efe6d3] px-4 py-3 text-sm leading-6 text-[#3e4843]">{entry.a}</div>}
        </div>)}
        </div>
      </div>}
    </div>
  </section>
    <div className="mt-3"><VisitorSuggestions source="app" /></div>
  </>;
}
