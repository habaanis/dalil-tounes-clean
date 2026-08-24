import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: Array<{ lead?: string; text: string }>;
  warning?: Array<{ lead?: string; text: string }>;
};

type Copy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  updated: string;
  sections: Section[];
};

const COPY: Record<PublicLanguage, Copy> = {
  fr: {
    seoTitle: "Conditions Générales d'Utilisation — Dalil Tounes",
    seoDescription: "Conditions générales d'utilisation du site dalil-tounes.com : accès, services de mise en relation, responsabilité et droit applicable.",
    eyebrow: 'Informations légales',
    title: "Conditions Générales d'Utilisation",
    updated: 'Dernière mise à jour : 28 avril 2026',
    sections: [
      {
        title: '1. Objet',
        paragraphs: [
          "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités d'accès et d'utilisation du site dalil-tounes.com (ci-après « le Site »). En naviguant sur le Site, l'utilisateur accepte sans réserve l'ensemble des présentes conditions. Si l'utilisateur n'accepte pas ces conditions, il lui appartient de ne pas utiliser le Site.",
        ],
      },
      {
        title: '2. Services de mise en relation',
        paragraphs: [
          'Dalil Tounes est une plateforme de référencement. Elle a pour vocation de faciliter la mise en relation entre les utilisateurs et des prestataires tiers (entreprises, médecins, commerces, etc.) référencés sur la plateforme.',
        ],
        bullets: [
          { lead: 'Indépendance :', text: "Dalil Tounes n'est pas partie prenante des contrats, accords ou transactions conclus entre l'utilisateur et les prestataires référencés. La plateforme agit exclusivement en qualité d'intermédiaire technique." },
          { lead: 'Absence de garantie :', text: "L'éditeur ne garantit pas la disponibilité, la qualité, la conformité, la licéité ni l'exactitude des services ou informations fournis par les tiers inscrits sur la plateforme. Il appartient à l'utilisateur de procéder à toutes les vérifications qu'il juge nécessaires avant d'engager une relation commerciale ou contractuelle avec un prestataire." },
        ],
      },
      {
        title: '3. Avertissement spécifique — Section E-Santé',
        warning: [
          { text: 'Le contenu de la section « E-Santé » est fourni à titre informatif uniquement.' },
          { lead: 'Pas de conseil médical :', text: "Dalil Tounes n'est pas un professionnel de santé. Les informations publiées sur la plateforme ne constituent en aucun cas un diagnostic médical, une prescription ou un avis thérapeutique. Elles ne sauraient se substituer à une consultation auprès d'un médecin ou d'un professionnel de santé qualifié." },
          { lead: 'Urgence médicale :', text: "En cas d'urgence médicale, l'utilisateur doit immédiatement contacter les services de secours officiels compétents (SAMU, pompiers ou services d'urgence locaux). L'éditeur décline toute responsabilité en cas d'utilisation des informations publiées à des fins diagnostiques ou thérapeutiques." },
        ],
      },
      {
        title: "4. Responsabilité de l'utilisateur",
        paragraphs: [
          "L'utilisateur s'engage à utiliser le Site de manière loyale et conforme aux lois et réglementations en vigueur. À ce titre, il s'interdit notamment :",
          "Tout manquement aux présentes obligations pourra entraîner la suppression des contenus concernés et, le cas échéant, l'engagement de la responsabilité civile et pénale de l'utilisateur fautif.",
        ],
        bullets: [
          { text: 'de publier des contenus illicites, injurieux, diffamatoires, obscènes, menaçants ou portant atteinte aux droits de tiers, notamment dans les avis ou commentaires ;' },
          { text: "d'utiliser le Site à des fins frauduleuses, commerciales non autorisées ou contraires à l'ordre public et aux bonnes mœurs ;" },
          { text: 'de tenter de perturber ou d’altérer le fonctionnement technique de la plateforme.' },
        ],
      },
      {
        title: '5. Propriété intellectuelle',
        paragraphs: [
          "L'ensemble des éléments constitutifs du Site (textes, logotypes, design, images, structure, code source) sont la propriété exclusive d'Anis Taieb HABA et sont protégés par les lois relatives à la propriété intellectuelle et au droit d'auteur. Toute reproduction, représentation, utilisation ou adaptation, totale ou partielle, de ces éléments sans l'autorisation préalable et écrite de l'éditeur est strictement interdite et constitue une contrefaçon susceptible d'engager la responsabilité civile et pénale de son auteur.",
        ],
      },
      {
        title: '6. Modification des CGU et droit applicable',
        paragraphs: [
          "L'éditeur se réserve le droit de modifier les présentes CGU à tout moment, sans notification préalable. Les modifications prennent effet dès leur publication sur le Site. Il appartient à l'utilisateur de consulter régulièrement les CGU afin de prendre connaissance de toute évolution.",
          "Les présentes CGU sont régies par le droit français. En cas de litige relatif à leur interprétation ou à leur exécution, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.",
        ],
      },
    ],
  },
  ar: {
    seoTitle: 'الشروط العامة للاستخدام — دليل تونس',
    seoDescription: 'الشروط العامة لاستخدام موقع dalil-tounes.com: النفاذ، خدمات الربط، المسؤولية والقانون المطبق.',
    eyebrow: 'معلومات قانونية',
    title: 'الشروط العامة للاستخدام',
    updated: 'آخر تحديث: 28 أبريل 2026',
    sections: [
      {
        title: '1. الغرض',
        paragraphs: [
          'تهدف هذه الشروط العامة للاستخدام (ويشار إليها فيما يلي بـ «الشروط») إلى تحديد كيفية النفاذ إلى موقع dalil-tounes.com واستخدامه (ويشار إليه فيما يلي بـ «الموقع»). وبمجرد تصفح الموقع، يوافق المستخدم دون تحفظ على جميع هذه الشروط. وإذا لم يوافق المستخدم عليها، فعليه عدم استخدام الموقع.',
        ],
      },
      {
        title: '2. خدمات الربط',
        paragraphs: [
          'دليل تونس منصة مرجعية تهدف إلى تسهيل الربط بين المستخدمين ومقدمي خدمات من أطراف ثالثة (شركات، أطباء، متاجر وغيرها) المدرجين على المنصة.',
        ],
        bullets: [
          { lead: 'الاستقلالية:', text: 'دليل تونس ليس طرفاً في العقود أو الاتفاقيات أو المعاملات المبرمة بين المستخدم ومقدمي الخدمات المدرجين. وتعمل المنصة حصراً كوسيط تقني.' },
          { lead: 'غياب الضمان:', text: 'لا يضمن الناشر توافر أو جودة أو مطابقة أو قانونية أو دقة الخدمات أو المعلومات المقدمة من الأطراف الثالثة المسجلة على المنصة. ويتعين على المستخدم إجراء كل التحقق الذي يراه ضرورياً قبل الدخول في علاقة تجارية أو تعاقدية مع أي مقدم خدمة.' },
        ],
      },
      {
        title: '3. تنبيه خاص — قسم الصحة الإلكترونية',
        warning: [
          { text: 'محتوى قسم «الصحة الإلكترونية» مقدم لأغراض إعلامية فقط.' },
          { lead: 'لا يقدم نصيحة طبية:', text: 'دليل تونس ليس مهنياً صحياً. ولا تشكل المعلومات المنشورة على المنصة بأي حال تشخيصاً طبياً أو وصفة أو رأياً علاجياً، ولا يمكن أن تحل محل استشارة طبيب أو مهني صحي مؤهل.' },
          { lead: 'حالة طبية طارئة:', text: 'في حالة الطوارئ الطبية، يجب على المستخدم الاتصال فوراً بخدمات الإنقاذ الرسمية المختصة (SAMU أو الحماية المدنية أو خدمات الطوارئ المحلية). ويخلي الناشر مسؤوليته عن استخدام المعلومات المنشورة لأغراض تشخيصية أو علاجية.' },
        ],
      },
      {
        title: '4. مسؤولية المستخدم',
        paragraphs: [
          'يتعهد المستخدم باستخدام الموقع بحسن نية ووفق القوانين واللوائح السارية. ويحظر عليه خصوصاً:',
          'قد يؤدي أي إخلال بهذه الالتزامات إلى حذف المحتوى المعني، وعند الاقتضاء، إلى قيام المسؤولية المدنية والجزائية للمستخدم المخالف.',
        ],
        bullets: [
          { text: 'نشر محتوى غير قانوني أو مسيء أو تشهيري أو فاحش أو مهدد أو منتهك لحقوق الغير، ولا سيما في الآراء أو التعليقات؛' },
          { text: 'استخدام الموقع لأغراض احتيالية أو تجارية غير مصرح بها أو مخالفة للنظام العام والآداب العامة؛' },
          { text: 'محاولة تعطيل أو تغيير التشغيل التقني للمنصة.' },
        ],
      },
      {
        title: '5. الملكية الفكرية',
        paragraphs: [
          'جميع العناصر المكونة للموقع (النصوص، الشعارات، التصميم، الصور، البنية، الشفرة المصدرية) هي ملك حصري لـ Anis Taieb HABA ومحميّة بقوانين الملكية الفكرية وحقوق المؤلف. ويحظر تماماً نسخ هذه العناصر أو تمثيلها أو استخدامها أو تكييفها كلياً أو جزئياً دون إذن كتابي مسبق من الناشر، ويعد ذلك تقليداً قد يرتب المسؤولية المدنية والجزائية على مرتكبه.',
        ],
      },
      {
        title: '6. تعديل الشروط والقانون المطبق',
        paragraphs: [
          'يحتفظ الناشر بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق. وتصبح التعديلات نافذة بمجرد نشرها على الموقع. ويتعين على المستخدم مراجعة الشروط بانتظام للاطلاع على أي تحديث.',
          'تخضع هذه الشروط للقانون الفرنسي. وفي حال نشوء نزاع يتعلق بتفسيرها أو تنفيذها وعدم التوصل إلى حل ودي، تكون المحاكم الفرنسية وحدها مختصة.',
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Terms of Use — Dalil Tounes',
    seoDescription: 'Terms of use for dalil-tounes.com: access, referral services, liability and applicable law.',
    eyebrow: 'Legal information',
    title: 'Terms of Use',
    updated: 'Last updated: April 28, 2026',
    sections: [
      {
        title: '1. Purpose',
        paragraphs: [
          'These Terms of Use (the “Terms”) define the conditions for accessing and using dalil-tounes.com (the “Site”). By browsing the Site, the user accepts these Terms without reservation. If the user does not accept them, the user must not use the Site.',
        ],
      },
      {
        title: '2. Referral services',
        paragraphs: [
          'Dalil Tounes is a listing platform intended to facilitate connections between users and third-party providers (businesses, doctors, shops, etc.) listed on the platform.',
        ],
        bullets: [
          { lead: 'Independence:', text: 'Dalil Tounes is not a party to any contract, agreement or transaction entered into between the user and listed providers. The platform acts exclusively as a technical intermediary.' },
          { lead: 'No warranty:', text: 'The publisher does not guarantee the availability, quality, compliance, legality or accuracy of services or information provided by third parties registered on the platform. Users are responsible for carrying out any checks they consider necessary before entering into a commercial or contractual relationship with a provider.' },
        ],
      },
      {
        title: '3. Specific notice — E-Health section',
        warning: [
          { text: 'Content in the “E-Health” section is provided for information purposes only.' },
          { lead: 'No medical advice:', text: 'Dalil Tounes is not a healthcare professional. Information published on the platform does not constitute a medical diagnosis, prescription or therapeutic opinion and cannot replace consultation with a doctor or qualified healthcare professional.' },
          { lead: 'Medical emergency:', text: 'In a medical emergency, users must immediately contact the competent official emergency services (SAMU, fire brigade or local emergency services). The publisher accepts no liability for the use of published information for diagnostic or therapeutic purposes.' },
        ],
      },
      {
        title: '4. User responsibility',
        paragraphs: [
          'Users undertake to use the Site fairly and in compliance with applicable laws and regulations. In particular, users must not:',
          'Any breach of these obligations may result in removal of the relevant content and, where applicable, civil and criminal liability for the offending user.',
        ],
        bullets: [
          { text: 'publish unlawful, insulting, defamatory, obscene or threatening content, or content infringing third-party rights, including in reviews or comments;' },
          { text: 'use the Site for fraudulent, unauthorized commercial or public-order-related unlawful purposes;' },
          { text: 'attempt to disrupt or alter the technical operation of the platform.' },
        ],
      },
      {
        title: '5. Intellectual property',
        paragraphs: [
          'All elements making up the Site (texts, logos, design, images, structure and source code) are the exclusive property of Anis Taieb HABA and are protected by intellectual property and copyright laws. Any reproduction, representation, use or adaptation, in whole or in part, without the publisher’s prior written authorization is strictly prohibited and may constitute infringement giving rise to civil and criminal liability.',
        ],
      },
      {
        title: '6. Changes to the Terms and applicable law',
        paragraphs: [
          'The publisher reserves the right to amend these Terms at any time without prior notice. Changes take effect as soon as they are published on the Site. Users are responsible for reviewing the Terms regularly to keep informed of any changes.',
          'These Terms are governed by French law. In the event of a dispute concerning their interpretation or performance, and failing an amicable resolution, the French courts shall have exclusive jurisdiction.',
        ],
      },
    ],
  },
  it: {
    seoTitle: 'Condizioni Generali di Utilizzo — Dalil Tounes',
    seoDescription: 'Condizioni di utilizzo di dalil-tounes.com: accesso, servizi di messa in contatto, responsabilità e legge applicabile.',
    eyebrow: 'Informazioni legali',
    title: 'Condizioni Generali di Utilizzo',
    updated: 'Ultimo aggiornamento: 28 aprile 2026',
    sections: [
      {
        title: '1. Oggetto',
        paragraphs: [
          'Le presenti Condizioni Generali di Utilizzo (di seguito le “Condizioni”) definiscono le modalità di accesso e utilizzo del sito dalil-tounes.com (di seguito il “Sito”). Navigando sul Sito, l’utente accetta senza riserve tutte le presenti condizioni. Se non le accetta, deve astenersi dall’utilizzare il Sito.',
        ],
      },
      {
        title: '2. Servizi di messa in contatto',
        paragraphs: [
          'Dalil Tounes è una piattaforma di repertoriazione che mira a facilitare il contatto tra gli utenti e fornitori terzi (aziende, medici, negozi, ecc.) presenti sulla piattaforma.',
        ],
        bullets: [
          { lead: 'Indipendenza:', text: 'Dalil Tounes non è parte dei contratti, accordi o transazioni conclusi tra l’utente e i fornitori presenti sulla piattaforma. La piattaforma agisce esclusivamente come intermediario tecnico.' },
          { lead: 'Assenza di garanzia:', text: 'L’editore non garantisce disponibilità, qualità, conformità, liceità o accuratezza dei servizi o delle informazioni forniti da terzi registrati sulla piattaforma. Spetta all’utente effettuare tutte le verifiche ritenute necessarie prima di instaurare un rapporto commerciale o contrattuale con un fornitore.' },
        ],
      },
      {
        title: '3. Avvertenza specifica — Sezione E-Salute',
        warning: [
          { text: 'Il contenuto della sezione “E-Salute” è fornito esclusivamente a scopo informativo.' },
          { lead: 'Nessun consiglio medico:', text: 'Dalil Tounes non è un professionista sanitario. Le informazioni pubblicate sulla piattaforma non costituiscono diagnosi medica, prescrizione o parere terapeutico e non possono sostituire la consultazione di un medico o di un professionista sanitario qualificato.' },
          { lead: 'Emergenza medica:', text: 'In caso di emergenza medica, l’utente deve contattare immediatamente i servizi ufficiali di emergenza competenti (SAMU, vigili del fuoco o servizi locali di emergenza). L’editore declina ogni responsabilità per l’utilizzo delle informazioni pubblicate a fini diagnostici o terapeutici.' },
        ],
      },
      {
        title: '4. Responsabilità dell’utente',
        paragraphs: [
          'L’utente si impegna a utilizzare il Sito in modo leale e conforme alle leggi e ai regolamenti vigenti. In particolare, è vietato:',
          'Qualsiasi violazione di tali obblighi può comportare la rimozione dei contenuti interessati e, ove applicabile, la responsabilità civile e penale dell’utente responsabile.',
        ],
        bullets: [
          { text: 'pubblicare contenuti illeciti, offensivi, diffamatori, osceni, minacciosi o lesivi dei diritti di terzi, in particolare nelle recensioni o nei commenti;' },
          { text: 'utilizzare il Sito per finalità fraudolente, commerciali non autorizzate o contrarie all’ordine pubblico e al buon costume;' },
          { text: 'tentare di perturbare o alterare il funzionamento tecnico della piattaforma.' },
        ],
      },
      {
        title: '5. Proprietà intellettuale',
        paragraphs: [
          'Tutti gli elementi che compongono il Sito (testi, loghi, design, immagini, struttura e codice sorgente) sono di proprietà esclusiva di Anis Taieb HABA e sono protetti dalle leggi sulla proprietà intellettuale e sul diritto d’autore. Qualsiasi riproduzione, rappresentazione, utilizzo o adattamento, totale o parziale, senza previa autorizzazione scritta dell’editore è severamente vietato e può costituire contraffazione con conseguente responsabilità civile e penale.',
        ],
      },
      {
        title: '6. Modifica delle Condizioni e legge applicabile',
        paragraphs: [
          'L’editore si riserva il diritto di modificare le presenti Condizioni in qualsiasi momento senza preavviso. Le modifiche entrano in vigore al momento della loro pubblicazione sul Sito. Spetta all’utente consultare regolarmente le Condizioni per conoscere eventuali aggiornamenti.',
          'Le presenti Condizioni sono disciplinate dal diritto francese. In caso di controversia relativa alla loro interpretazione o esecuzione e in assenza di soluzione amichevole, saranno competenti esclusivamente i tribunali francesi.',
        ],
      },
    ],
  },
  ru: {
    seoTitle: 'Условия использования — Dalil Tounes',
    seoDescription: 'Условия использования dalil-tounes.com: доступ, посреднические сервисы, ответственность и применимое право.',
    eyebrow: 'Юридическая информация',
    title: 'Условия использования',
    updated: 'Последнее обновление: 28 апреля 2026 г.',
    sections: [
      {
        title: '1. Назначение',
        paragraphs: [
          'Настоящие Условия использования (далее — «Условия») определяют порядок доступа к сайту dalil-tounes.com и его использования (далее — «Сайт»). Используя Сайт, пользователь безоговорочно принимает настоящие Условия. Если пользователь с ними не согласен, он должен прекратить использование Сайта.',
        ],
      },
      {
        title: '2. Посреднические сервисы',
        paragraphs: [
          'Dalil Tounes является платформой-каталогом, предназначенной для облегчения связи между пользователями и сторонними поставщиками услуг (компаниями, врачами, магазинами и др.), представленными на платформе.',
        ],
        bullets: [
          { lead: 'Независимость:', text: 'Dalil Tounes не является стороной договоров, соглашений или сделок, заключенных между пользователем и представленными поставщиками. Платформа выступает исключительно как технический посредник.' },
          { lead: 'Отсутствие гарантии:', text: 'Издатель не гарантирует доступность, качество, соответствие требованиям, законность или точность услуг и информации, предоставляемых третьими сторонами на платформе. Пользователь самостоятельно обязан провести все проверки, которые считает необходимыми, до вступления в коммерческие или договорные отношения с поставщиком.' },
        ],
      },
      {
        title: '3. Специальное предупреждение — раздел E-Health',
        warning: [
          { text: 'Содержимое раздела «E-Health» предоставляется исключительно в информационных целях.' },
          { lead: 'Не является медицинской консультацией:', text: 'Dalil Tounes не является медицинским специалистом. Информация на платформе не является медицинским диагнозом, назначением или терапевтическим заключением и не заменяет консультацию врача или квалифицированного медицинского работника.' },
          { lead: 'Медицинская неотложная ситуация:', text: 'При медицинской неотложной ситуации пользователь должен немедленно обратиться в официальные экстренные службы (SAMU, пожарно-спасательную службу или местные службы экстренной помощи). Издатель не несет ответственности за использование опубликованной информации в диагностических или лечебных целях.' },
        ],
      },
      {
        title: '4. Ответственность пользователя',
        paragraphs: [
          'Пользователь обязуется использовать Сайт добросовестно и в соответствии с действующими законами и нормативными актами. В частности, запрещается:',
          'Нарушение этих обязательств может повлечь удаление соответствующего контента и, при необходимости, гражданскую и уголовную ответственность нарушителя.',
        ],
        bullets: [
          { text: 'публиковать незаконный, оскорбительный, клеветнический, непристойный, угрожающий контент или контент, нарушающий права третьих лиц, в том числе в отзывах и комментариях;' },
          { text: 'использовать Сайт в мошеннических, несанкционированных коммерческих целях или в целях, противоречащих общественному порядку и общепринятым нормам;' },
          { text: 'пытаться нарушить или изменить техническую работу платформы.' },
        ],
      },
      {
        title: '5. Интеллектуальная собственность',
        paragraphs: [
          'Все элементы Сайта (тексты, логотипы, дизайн, изображения, структура и исходный код) являются исключительной собственностью Anis Taieb HABA и защищены законодательством об интеллектуальной собственности и авторском праве. Любое полное или частичное воспроизведение, представление, использование или адаптация без предварительного письменного разрешения издателя строго запрещены и могут повлечь гражданскую и уголовную ответственность.',
        ],
      },
      {
        title: '6. Изменение Условий и применимое право',
        paragraphs: [
          'Издатель оставляет за собой право изменять настоящие Условия в любое время без предварительного уведомления. Изменения вступают в силу с момента их публикации на Сайте. Пользователь обязан регулярно знакомиться с Условиями, чтобы быть в курсе изменений.',
          'Настоящие Условия регулируются законодательством Франции. В случае спора относительно их толкования или исполнения и при отсутствии мирного урегулирования исключительной компетенцией обладают французские суды.',
        ],
      },
    ],
  },
};

const CGU: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={copy.seoTitle} description={copy.seoDescription} />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            {copy.eyebrow}
          </span>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {copy.title}
          </h1>
          <p className="mt-4 text-xs text-gray-400">{copy.updated}</p>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">
        {copy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{section.title}</h2>

            {section.warning ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                {section.warning.map((item, index) => (
                  <p key={index} className={index === 0 ? 'font-medium text-amber-900' : 'text-amber-800'}>
                    {item.lead && <span className="font-medium">{item.lead} </span>}
                    {item.text}
                  </p>
                ))}
              </div>
            ) : (
              <>
                {section.paragraphs?.[0] && <p>{section.paragraphs[0]}</p>}
                {section.bullets && (
                  <ul className={`mt-4 space-y-3 ${isRTL ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-[#D4AF37]`}>
                    {section.bullets.map((item, index) => (
                      <li key={index}>
                        {item.lead && <span className="font-medium">{item.lead} </span>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
                {section.paragraphs?.slice(1).map((paragraph, index) => (
                  <p key={index} className="mt-3">{paragraph}</p>
                ))}
              </>
            )}
          </section>
        ))}

        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">{copy.updated}</p>
      </div>
    </div>
  );
};

export default CGU;
