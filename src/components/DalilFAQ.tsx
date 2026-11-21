import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Question = { q: string; a: string };
const faq: Record<'fr' | 'ar',Question[]> = {
  fr: [
    {q:'À quoi servent Dalil Tounes et son application ?',a:'Dalil Tounes aide à rechercher des entreprises, commerces, professionnels et services en Tunisie. Son application donne accès aux fiches publiées et facilite la recherche et le contact depuis un téléphone.'},
    {q:'Comment inscrire gratuitement mon activité ?',a:'Vous pouvez demander une Présence Essentielle gratuite sur Dalil Tounes. Votre fiche est vérifiée avant sa publication. Les outils professionnels plus complets sont présentés séparément dans notre espace professionnel.'},
    {q:'Quelle différence entre la présence gratuite et la mini-appli payante ?',a:'La Présence Essentielle gratuite permet de référencer votre activité avec ses informations principales sur Dalil Tounes. Avec une mini-appli payante, vous bénéficiez d’une présentation plus complète, plus visuelle et mieux mise en valeur sur la plateforme, avec un lien et un QR Code à partager. Selon les fonctions activées, vous pouvez aussi présenter vos produits et recevoir des demandes ou commandes. Cette mise en valeur ne garantit pas une première place dans les résultats.'},
    {q:'J’ai déjà Facebook ou un site Internet. Pourquoi une mini-appli ?',a:'Les réseaux sociaux attirent l’attention. Votre mini-appli réunit au même endroit vos coordonnées, vos prestations, votre QR Code et, selon les options activées, vos produits et votre Boutique. Elle complète vos réseaux : elle ne les remplace pas.'},
    {q:'Quels avantages pour un commerçant et ses clients ?',a:'Le commerçant dispose d’une présentation facile à partager. Ses clients retrouvent ses informations depuis un lien ou un QR Code, peuvent le contacter et, si la Boutique est activée, lui transmettre des demandes ou commandes.'},
    {q:'Une mini-appli peut-elle m’aider à vendre ?',a:'Oui, en facilitant la consultation d’un catalogue et l’envoi de commandes ou devis lorsque ces fonctions sont activées. Des packs cadeaux, offres et outils de fidélité peuvent compléter la Boutique. Les ventes ne sont pas garanties : les résultats dépendent de votre activité et de vos clients.'},
    {q:'Quel est le prix d’une mini-appli Dalil Tounes ?',a:'L’offre de référence présentée pour la Tunisie est de 59 DT pour la création, avec la première année incluse. L’entretien ultérieur et les conditions de l’offre sont détaillés dans l’espace professionnel. La Présence Essentielle reste gratuite.'},
    {q:'Est-ce compliqué à utiliser ou à partager ?',a:'Votre mini-appli se partage par lien ou QR Code et s’ouvre depuis le téléphone du client. Elle fonctionne comme une application web : le client n’a pas besoin de créer un compte pour consulter votre présentation. Certaines actions, comme gérer ses commandes, nécessitent le compte du professionnel.'}
  ],
  ar: [
    {q:'ما فائدة دليل تونس وتطبيقه؟',a:'يساعد دليل تونس على البحث عن المؤسسات والمحلات والمهنيين والخدمات في تونس. يسهّل التطبيق تصفّح الملفات المنشورة والبحث والتواصل عبر الهاتف.'},
    {q:'كيف يمكنني تسجيل نشاطي مجاناً؟',a:'يمكنك طلب حضور أساسي مجاني لنشاطك في دليل تونس. تتم مراجعة الملف قبل نشره، أما الأدوات المهنية الإضافية فتجد تفاصيلها في الفضاء المهني.'},
    {q:'ما الفرق بين الحضور المجاني والميني تطبيق المدفوع؟',a:'يتيح لك الحضور الأساسي المجاني إدراج نشاطك ومعلوماته الرئيسية في دليل تونس. أما الميني تطبيق المدفوع فيوفّر عرضاً أكثر اكتمالاً وجاذبية بصرياً ويُبرز نشاطك بشكل أفضل داخل المنصة، مع رابط ورمز QR للمشاركة. وحسب الخدمات المفعّلة، يمكنك عرض منتجاتك واستقبال الطلبات. هذا التميّز البصري لا يضمن الظهور في المرتبة الأولى من نتائج البحث.'},
    {q:'لدي صفحة فيسبوك أو موقع إلكتروني، فلماذا أحتاج إلى ميني تطبيق؟',a:'تجلب وسائل التواصل الانتباه، بينما يجمع الميني تطبيق بياناتك وخدماتك ورمز QR، ويمكن أن يضم منتجاتك ومتجرك حسب الخدمات المفعّلة. هو مكمّل لشبكاتك الاجتماعية وليس بديلاً عنها.'},
    {q:'ما الفائدة للتاجر ولحرفائه؟',a:'يستطيع التاجر مشاركة عرض واضح لنشاطه بسهولة. ويجد الحرفاء معلوماته عبر رابط أو رمز QR، ويتواصلون معه، ويمكنهم إرسال طلبات أو طلبيات إذا كانت خدمة المتجر مفعّلة.'},
    {q:'هل يساعدني الميني تطبيق على البيع؟',a:'نعم، فهو يسهّل عرض المنتجات وإرسال الطلبات أو طلب عروض الأسعار عند تفعيل هذه الخدمات. ويمكن إضافة علب الهدايا والعروض وأدوات الوفاء. لكن المبيعات ليست مضمونة وتعتمد على النشاط والحرفاء.'},
    {q:'ما هو سعر الميني تطبيق في دليل تونس؟',a:'العرض المرجعي في تونس هو 59 ديناراً لإنشاء الميني تطبيق، مع السنة الأولى مشمولة. تجد شروط الصيانة اللاحقة وتفاصيل العرض في الفضاء المهني. أما الحضور الأساسي فهو مجاني.'},
    {q:'هل استعمال الميني تطبيق ومشاركته سهل؟',a:'يمكن مشاركة الميني تطبيق عبر رابط أو رمز QR وفتحه من هاتف الحريف. لا يحتاج الزائر إلى حساب لتصفّح العرض، بينما تتطلب إدارة الطلبات حساباً مهنياً.'}
  ]
};
const labels = {
  fr: { eyebrow:'VOS QUESTIONS, NOS RÉPONSES',title:'Ce que Dalil Tounes peut apporter à votre activité',description:'L’essentiel en quelques questions. Ouvrez une réponse pour en savoir plus.' },
  ar: { eyebrow:'أسئلتكم وإجاباتنا',title:'كيف يمكن أن يفيدك دليل تونس في نشاطك؟',description:'إجابات مختصرة عن الأسئلة الأكثر شيوعاً. اضغط على السؤال لمعرفة التفاصيل.' }
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
  return <section id="faq" aria-label={t.title} dir={locale==='ar'?'rtl':'ltr'} className="scroll-mt-20 rounded-xl border border-[#C9A65D] bg-[#FFFCF6] px-3 py-3 shadow-sm">
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
  </section>;
}
