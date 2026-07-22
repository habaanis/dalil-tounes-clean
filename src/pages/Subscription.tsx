import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  MapPin,
  Phone,
  Rocket,
  Send,
  X,
} from 'lucide-react';
import { BusinessRegistrationRequestForm } from '../components/BusinessRegistrationRequestForm';
import { BusinessDetail } from '../components/BusinessDetail';
import { useLanguage } from '../context/LanguageContext';

type PreviewType = 'free' | 'artisan' | 'premium' | 'premium-detail' | 'launch' | 'request' | null;

const LOGO_PATH = '/images/logo_dalil_tounes_sceau_luxe.webp';

const printSupportCopy = {
  fr: {
    flyers: 'Flyers',
    annualPremiumOnly: 'PREMIUM ANNUEL UNIQUEMENT',
    flyerDescription: '500 flyers inclus avec l’abonnement annuel Premium.',
    flyerProduction: 'Conception et impression réalisées par Dalil Tounes.',
    flyerConditions: [
      'En cas de paiement annuel Premium en trois fois, les 500 flyers sont préparés et imprimés après le troisième et dernier versement.',
      'Le modèle du flyer est soumis au professionnel pour validation avant impression.',
      'Le professionnel doit vérifier le nom de l’activité, les coordonnées, le téléphone, les horaires, les textes et le QR Code.',
      'Une impression de 500 exemplaires est incluse après validation.',
      'Toute réimpression demandée à la suite d’une modification effectuée après validation est facturée séparément.',
    ],
  },
  en: {
    flyers: 'Flyers',
    annualPremiumOnly: 'ANNUAL PREMIUM ONLY',
    flyerDescription: '500 flyers included with the annual Premium subscription.',
    flyerProduction: 'Design and printing by Dalil Tounes.',
    flyerConditions: [
      'If the annual Premium subscription is paid in three installments, the 500 flyers are prepared and printed after the third and final installment.',
      'The flyer design is submitted to the professional for approval before printing.',
      'The professional must check the business name, contact details, phone number, opening hours, texts and QR Code.',
      'One print run of 500 copies is included after approval.',
      'Any reprint requested following a change made after approval is billed separately.',
    ],
  },
  it: {
    flyers: 'Volantini',
    annualPremiumOnly: 'SOLO PREMIUM ANNUALE',
    flyerDescription: '500 volantini inclusi con l’abbonamento annuale Premium.',
    flyerProduction: 'Progettazione grafica e stampa a cura di Dalil Tounes.',
    flyerConditions: [
      'In caso di pagamento dell’abbonamento annuale Premium in tre rate, i 500 volantini vengono preparati e stampati dopo la terza e ultima rata.',
      'Il modello del volantino viene sottoposto al professionista per l’approvazione prima della stampa.',
      'Il professionista deve verificare il nome dell’attività, i recapiti, il telefono, gli orari, i testi e il QR Code.',
      'Dopo l’approvazione è inclusa una tiratura di 500 copie.',
      'Qualsiasi ristampa richiesta a seguito di una modifica effettuata dopo l’approvazione viene fatturata separatamente.',
    ],
  },
  ru: {
    flyers: 'Флаеры',
    annualPremiumOnly: 'ТОЛЬКО ГОДОВАЯ ПОДПИСКА PREMIUM',
    flyerDescription: '500 флаеров включены в годовую подписку Premium.',
    flyerProduction: 'Дизайн и печать выполняет Dalil Tounes.',
    flyerConditions: [
      'При оплате годовой подписки Premium тремя платежами 500 флаеров подготавливаются и печатаются после третьего и последнего платежа.',
      'Макет флаера перед печатью предоставляется профессионалу на утверждение.',
      'Профессионал должен проверить название деятельности, контактные данные, телефон, часы работы, тексты и QR-код.',
      'После утверждения включена печать 500 экземпляров.',
      'Любая повторная печать, запрошенная из-за изменения после утверждения, оплачивается отдельно.',
    ],
  },
  ar: {
    flyers: 'المنشورات الإعلانية',
    annualPremiumOnly: 'للاشتراك السنوي PREMIUM فقط',
    flyerDescription: 'يشمل الاشتراك السنوي Premium طباعة 500 منشور إعلاني.',
    flyerProduction: 'يتولى دليل تونس التصميم والطباعة.',
    flyerConditions: [
      'عند دفع الاشتراك السنوي Premium على ثلاث دفعات، يتم إعداد وطباعة 500 منشور إعلاني بعد الدفعة الثالثة والأخيرة.',
      'يُعرض نموذج المنشور الإعلاني على المهني للمصادقة عليه قبل الطباعة.',
      'يجب على المهني التحقق من اسم النشاط وبيانات الاتصال ورقم الهاتف وأوقات العمل والنصوص ورمز QR.',
      'تشمل الخدمة طباعة 500 نسخة بعد المصادقة.',
      'تُفوتر بشكل منفصل أي إعادة طباعة مطلوبة نتيجة تعديل تم بعد المصادقة.',
    ],
  },
} as const;

const subscriptionCopy = {
  fr: {
    closeModal: 'Fermer la fenêtre',
    heroEyebrow: 'Solutions pour les professionnels',
    heroTitle: 'Choisissez votre manière de commencer',
    heroSubtitle: "Dalil Tounes rassemble les informations de votre activité sans remplacer les plateformes.",
    startingSolutions: 'Solutions de démarrage',
    selfService: 'Je crée moi-même',
    yourLogo: 'Votre\nlogo',
    essentialTitle: 'Présence essentielle',
    essentialFree: 'Gratuit, sans abonnement obligatoire',
    essentialFeatures: [
      "Nom de l'activité",
      'Catégorie et ville',
      'Téléphone ou WhatsApp',
      "Horaires d'ouverture",
      'Courte description',
      "Logo de l'activité",
      'Présence dans la recherche Dalil Tounes',
    ],
    addActivity: 'Ajouter mon activité',
    previewCard: 'Aperçu de la carte',
    humanSupport: 'Accompagnement humain',
    cvTitle: 'CV Business créé avec vous',
    cvPriceNotice: 'Paiement unique — le prix total reste toujours 199 TND.',
    paymentOptions: 'Possibilités de paiement',
    payOnce: '199 TND en une fois',
    or: 'ou',
    payTwice: '100 TND puis 99 TND',
    payThreeTimes: '67 + 66 + 66 TND',
    cvPublication: 'Votre CV Business est préparé pendant les différentes étapes et publié après le paiement complet.',
    cvFeatures: [
      'Entretien et collecte des informations',
      'Rédaction de la présentation',
      'Organisation des services',
      'Présentation du savoir-faire',
      'Coordonnées complètes',
      'Horaires',
      "Zones d'intervention",
      'Portfolio et réalisations',
      "Jusqu'à 10 photos fournies par le professionnel",
      'Connexion des plateformes existantes',
      'QR Code numérique',
      'Aperçu privé avant publication',
      'Une correction groupée',
      'Publication finale après le paiement complet',
    ],
    requestCreation: 'Demander la création',
    continuousServices: 'Services continus & options',
    launchBadge: 'OFFRE DE LANCEMENT',
    launchTitle: 'Offre spéciale de lancement',
    launchIntro: "Profitez de 3 mois d'accès Artisan ou Premium offerts dès votre inscription.",
    launchAnnualPrefix: "En choisissant l'abonnement annuel, bénéficiez de 3 mois supplémentaires :",
    launchAnnualStrong: "18 mois d'accès au total pour le prix de 12.",
    launchPayment: 'Paiement annuel possible en trois fois.',
    seeConditions: 'Voir les conditions',
    artisan: 'Artisan',
    premium: 'Premium',
    artisanIntro: 'Des outils pratiques pour gérer et développer votre présence avec une carte simple.',
    artisanFeatures: [
      'Statistiques et vues',
      'Formulaires de demande de devis ou de contact',
      'Outils pratiques pour améliorer votre présence',
      'Support technique',
    ],
    premiumIntro: 'Un suivi accompagné pour garder votre CV Business et vos informations à jour.',
    premiumFeatures: [
      'Mises à jour groupées',
      "Ajout d'informations et de photos",
      'Vérification des liens et horaires',
      'Assistance prioritaire',
    ],
    requestArtisan: 'Demander Artisan',
    requestPremium: 'Demander Premium',
    certifiedTitle: 'Certifié Dalil Tounes',
    certifiedText: "Attribué après vérification de l'identité, des informations et des justificatifs.",
    certifiedIndependence: 'Cette vérification est indépendante de la formule choisie.',
    trialClarification: "Les 3 mois d'essai commencent dès l'inscription. L'abonnement annuel est confirmé après le paiement complet. Les 500 flyers sont réservés à l'abonnement annuel Premium.",
    disclaimer: 'Dalil Tounes ne remplace pas vos réseaux sociaux et ne constitue pas une prestation de publicité.',
    ctaTitle: 'Prêt à présenter votre activité plus clairement ?',
    ctaText: 'Commencez gratuitement ou demandez un accompagnement pour créer votre CV Business.',
    ctaButton: 'Choisir ma solution',
    demoName: 'Fiche Démonstration Dalil Tounes',
    demoCategory: 'Plateforme tunisienne',
    tunisia: 'Tunisie',
    open: 'Ouvert',
    todaySchedule: "Aujourd'hui : horaires indiqués sur la fiche",
    todayCardSchedule: "Aujourd'hui : horaires affichés sur la carte",
    contactDalil: 'Contacter Dalil Tounes',
    call: 'Appeler',
    essentialPreviewText: "Une carte gratuite avec le logo et les informations essentielles de l'activité, sans galerie ni portfolio.",
    artisanPreviewText: 'Carte simple pour présenter clairement les informations essentielles. Aucun accès à une fiche Premium détaillée.',
    viewDetails: 'Voir les détails',
    premiumDemoDescription: 'Découvrez comment fonctionne une fiche professionnelle sur Dalil Tounes.',
    premiumDemoServices: 'Annuaire professionnel, Visibilité locale, Présentation des activités',
    previewEssentialTitle: 'Aperçu — Présence essentielle',
    previewArtisanTitle: 'Aperçu — Artisan',
    previewPremiumTitle: 'Aperçu — Premium',
    premiumDetailTitle: 'Fiche Premium détaillée',
    launchConditionsDialog: "Conditions de l'offre spéciale de lancement",
    launchConditionsTitle: "Conditions de l'offre spéciale",
    launchConditions: [
      'Offre réservée aux nouveaux abonnés Artisan et Premium.',
      'Une seule offre par activité.',
      "Les trois mois d'essai commencent à la date d'inscription.",
      'La période totale de 18 mois est calculée à partir de cette date.',
      "L'abonnement annuel est confirmé après le dernier versement.",
      "En cas de paiement annuel incomplet, le compte revient à la formule gratuite à la fin de la période d'essai.",
      "L'offre est limitée dans le temps ou à un nombre d'inscriptions qui sera défini avant la mise en ligne.",
      "L'offre ne peut pas être cumulée avec une autre promotion sans validation.",
    ],
    requestTitle: 'Demander cette solution',
    requestModal: 'Demande',
    cvPlanLabel: 'CV Business — paiement unique 199 TND',
    artisanPlanLabel: 'Abonnement Artisan',
    premiumPlanLabel: 'Abonnement Premium',
  },
  ar: {
    closeModal: 'إغلاق النافذة',
    heroEyebrow: 'حلول للمهنيين',
    heroTitle: 'اختر الطريقة المناسبة للبدء',
    heroSubtitle: 'يجمع دليل تونس معلومات نشاطك دون أن يحل محل المنصات التي تستخدمها.',
    startingSolutions: 'حلول البدء',
    selfService: 'أنشئها بنفسي',
    yourLogo: 'شعار\nنشاطك',
    essentialTitle: 'الحضور الأساسي',
    essentialFree: 'مجاني، دون اشتراك إلزامي',
    essentialFeatures: [
      'اسم النشاط',
      'الفئة والمدينة',
      'الهاتف أو واتساب',
      'أوقات العمل',
      'وصف مختصر',
      'شعار النشاط',
      'الظهور في بحث دليل تونس',
    ],
    addActivity: 'أضف نشاطي',
    previewCard: 'معاينة البطاقة',
    humanSupport: 'مرافقة بشرية',
    cvTitle: 'سيرة النشاط المهنية ننشئها معك',
    cvPriceNotice: 'دفعة واحدة — يبقى السعر الإجمالي دائمًا 199 د.ت.',
    paymentOptions: 'خيارات الدفع',
    payOnce: '199 د.ت دفعة واحدة',
    or: 'أو',
    payTwice: '100 د.ت ثم 99 د.ت',
    payThreeTimes: '67 + 66 + 66 د.ت',
    cvPublication: 'يتم إعداد سيرة نشاطك المهنية خلال المراحل المختلفة ونشرها بعد اكتمال الدفع.',
    cvFeatures: [
      'مقابلة وجمع المعلومات',
      'صياغة العرض التعريفي',
      'تنظيم الخدمات',
      'عرض الخبرة المهنية',
      'بيانات اتصال كاملة',
      'أوقات العمل',
      'مناطق التدخل',
      'ملف الأعمال والإنجازات',
      'ما يصل إلى 10 صور يقدمها المهني',
      'ربط المنصات الموجودة',
      'رمز QR رقمي',
      'معاينة خاصة قبل النشر',
      'تعديل مجمع واحد',
      'النشر النهائي بعد اكتمال الدفع',
    ],
    requestCreation: 'اطلب الإنشاء',
    continuousServices: 'خدمات مستمرة وخيارات',
    launchBadge: 'عرض الإطلاق',
    launchTitle: 'عرض إطلاق خاص',
    launchIntro: 'استفد من 3 أشهر مجانية من خدمة حرفي أو بريميوم فور تسجيلك.',
    launchAnnualPrefix: 'عند اختيار الاشتراك السنوي، تستفيد من 3 أشهر إضافية:',
    launchAnnualStrong: '18 شهرًا من النفاذ إجمالًا بسعر 12 شهرًا.',
    launchPayment: 'يمكن دفع الاشتراك السنوي على ثلاث دفعات.',
    seeConditions: 'عرض الشروط',
    artisan: 'حرفي',
    premium: 'بريميوم',
    artisanIntro: 'أدوات عملية لإدارة حضورك وتطويره باستخدام بطاقة بسيطة.',
    artisanFeatures: [
      'الإحصائيات والمشاهدات',
      'نماذج طلب عرض سعر أو اتصال',
      'أدوات عملية لتحسين حضورك',
      'دعم فني',
    ],
    premiumIntro: 'مرافقة تساعدك على تحديث سيرة نشاطك المهنية ومعلوماتك.',
    premiumFeatures: [
      'تحديثات مجمعة',
      'إضافة معلومات وصور',
      'التحقق من الروابط وأوقات العمل',
      'مساعدة ذات أولوية',
    ],
    requestArtisan: 'اطلب حرفي',
    requestPremium: 'اطلب بريميوم',
    certifiedTitle: 'موثّق من دليل تونس',
    certifiedText: 'يُمنح بعد التحقق من الهوية والمعلومات والمستندات الثبوتية.',
    certifiedIndependence: 'هذا التحقق مستقل عن الصيغة المختارة.',
    trialClarification: 'تبدأ فترة التجربة المجانية لمدة 3 أشهر فور التسجيل. يتم تأكيد الاشتراك السنوي بعد اكتمال الدفع. تقتصر طباعة 500 منشور إعلاني على الاشتراك السنوي Premium.',
    disclaimer: 'لا يحل دليل تونس محل شبكاتك الاجتماعية ولا يشكل خدمة إعلانية.',
    ctaTitle: 'هل أنت مستعد لتقديم نشاطك بصورة أوضح؟',
    ctaText: 'ابدأ مجانًا أو اطلب مرافقة لإنشاء سيرة نشاطك المهنية.',
    ctaButton: 'اختر الحل المناسب',
    demoName: 'Fiche Démonstration Dalil Tounes',
    demoCategory: 'منصة تونسية',
    tunisia: 'تونس',
    open: 'مفتوح',
    todaySchedule: 'اليوم: الأوقات مبيّنة في البطاقة',
    todayCardSchedule: 'اليوم: الأوقات معروضة على البطاقة',
    contactDalil: 'اتصل بدليل تونس',
    call: 'اتصل',
    essentialPreviewText: 'بطاقة مجانية تضم الشعار والمعلومات الأساسية للنشاط، دون معرض صور أو ملف أعمال.',
    artisanPreviewText: 'بطاقة بسيطة لعرض المعلومات الأساسية بوضوح، دون النفاذ إلى بطاقة بريميوم المفصلة.',
    viewDetails: 'عرض التفاصيل',
    premiumDemoDescription: 'اكتشف كيف تعمل البطاقة المهنية على دليل تونس.',
    premiumDemoServices: 'دليل مهني، حضور محلي، عرض الأنشطة',
    previewEssentialTitle: 'معاينة — الحضور الأساسي',
    previewArtisanTitle: 'معاينة — حرفي',
    previewPremiumTitle: 'معاينة — بريميوم',
    premiumDetailTitle: 'بطاقة بريميوم المفصلة',
    launchConditionsDialog: 'شروط عرض الإطلاق الخاص',
    launchConditionsTitle: 'شروط العرض الخاص',
    launchConditions: [
      'العرض مخصص للمشتركين الجدد في حرفي وبريميوم.',
      'عرض واحد فقط لكل نشاط.',
      'تبدأ فترة التجربة المجانية لمدة ثلاثة أشهر من تاريخ التسجيل.',
      'تُحتسب المدة الإجمالية البالغة 18 شهرًا ابتداءً من هذا التاريخ.',
      'يُؤكد الاشتراك السنوي بعد الدفعة الأخيرة.',
      'إذا لم يكتمل الدفع السنوي، يعود الحساب إلى الحضور الأساسي المجاني عند نهاية فترة التجربة.',
      'العرض محدود زمنيًا أو بعدد تسجيلات سيُحدد قبل الإطلاق.',
      'لا يمكن جمع هذا العرض مع عرض ترويجي آخر دون موافقة.',
    ],
    requestTitle: 'اطلب هذا الحل',
    requestModal: 'طلب',
    cvPlanLabel: 'سيرة النشاط المهنية — دفعة واحدة 199 د.ت',
    artisanPlanLabel: 'اشتراك حرفي',
    premiumPlanLabel: 'اشتراك بريميوم',
  },
} as const;

type SubscriptionCopy = (typeof subscriptionCopy)['fr'] | (typeof subscriptionCopy)['ar'];

function FeatureList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={columns ? 'grid gap-x-6 gap-y-2 sm:grid-cols-2' : 'space-y-2'}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Modal({
  title,
  onClose,
  children,
  closeLabel,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('hidden'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-xl'}`}
      >
        <div className="sticky top-0 z-20 flex justify-end bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-2 pt-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#D6AF2E] hover:text-[#4A123F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pb-5 sm:px-7 sm:pb-7">{children}</div>
      </div>
    </div>
  );
}

function DemoLogo({ alt }: { alt: string }) {
  return (
    <img
      src={LOGO_PATH}
      alt={alt}
      className="h-20 w-20 rounded-full border-4 border-[#D6AF2E] bg-white object-cover shadow-lg"
    />
  );
}

function EssentialCardPreview({ copy }: { copy: SubscriptionCopy }) {
  return (
    <div className="mx-auto max-w-lg rounded-[26px] border-[3px] border-[#D6AF2E] bg-white p-5 text-slate-800 shadow-xl sm:p-7">
      <div className="mb-5 flex justify-center">
        <DemoLogo alt={copy.demoName} />
      </div>
      <h3 className="text-xl font-bold sm:text-2xl">{copy.demoName}</h3>
      <p className="mt-1 font-semibold text-[#C89E19]">{copy.demoCategory}</p>
      <p className="mt-3 flex items-center gap-2 text-slate-600">
        <MapPin className="h-5 w-5" aria-hidden="true" /> {copy.tunisia}
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-700">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> {copy.open}
      </p>
      <p className="mt-1 text-slate-600">{copy.todaySchedule}</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#173429]">
        <Phone className="h-5 w-5" aria-hidden="true" /> {copy.contactDalil}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{copy.essentialPreviewText}</p>
    </div>
  );
}

function GreenCardPreview({
  tier,
  copy,
  onDetails,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  copy: SubscriptionCopy;
  onDetails?: () => void;
}) {
  const tierLabel = tier === 'ARTISAN' ? copy.artisan : copy.premium;

  return (
    <div className="mx-auto max-w-xl rounded-[26px] border-[3px] border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <DemoLogo alt={copy.demoName} />
        <span className="rounded-full border border-[#D6AF2E]/60 bg-[#D6AF2E]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#F4CE55]">
          {tierLabel}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-[#F0C537]">{copy.demoName}</h3>
      <p className="mt-1 font-semibold text-[#F0C537]">{copy.demoCategory}</p>
      <p className="mt-3 flex items-center gap-2 text-emerald-50">
        <MapPin className="h-5 w-5" aria-hidden="true" /> {copy.tunisia}
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-300">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> {copy.open}
      </p>
      <p className="mt-1 text-emerald-50">{copy.todayCardSchedule}</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#07543F]">
        <Phone className="h-5 w-5" aria-hidden="true" /> {copy.call}
      </div>
      {tier === 'ARTISAN' && (
        <p className="mt-4 border-t border-[#D6AF2E]/35 pt-4 text-sm leading-6 text-emerald-50">{copy.artisanPreviewText}</p>
      )}
      {tier === 'PREMIUM' && (
        <button
          type="button"
          onClick={onDetails}
          className="mt-4 flex w-full items-center justify-center gap-2 border-t border-[#D6AF2E]/35 pt-4 text-base font-bold text-[#F0C537] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          {copy.viewDetails} <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function PremiumDetailPreview({ copy, isArabic }: { copy: SubscriptionCopy; isArabic: boolean }) {
  const demonstrationBusiness = {
    id: 'demo-dalil-tounes-premium',
    nom: subscriptionCopy.fr.demoName,
    name_ar: subscriptionCopy.ar.demoName,
    categorie: copy.demoCategory,
    adresse: `${copy.tunisia}, ${copy.tunisia}`,
    description: subscriptionCopy.fr.premiumDemoDescription,
    description_ar: subscriptionCopy.ar.premiumDemoDescription,
    whatsapp: '+216 XX XXX XXX',
    email: 'contact@dalil-tounes.com',
    site_web: 'https://dalil-tounes.com',
    services: copy.premiumDemoServices,
    sous_categories_texte: copy.premiumDemoServices,
    statut_abonnement: 'premium',
    logo_url: LOGO_PATH,
    image_url: null,
    horaires_ok: 'Lundi : 08:00–18:00\nMardi : 08:00–18:00\nMercredi : 08:00–18:00\nJeudi : 08:00–18:00\nVendredi : 08:00–18:00\nSamedi : 09:00–13:00\nDimanche : Fermé',
    statut_carte: isArabic ? subscriptionCopy.ar.certifiedTitle : subscriptionCopy.fr.certifiedTitle,
    latitude: 36.8065,
    longitude: 10.1815,
    'lien facebook': 'https://www.facebook.com/daliltounes',
    'Lien Instagram': 'https://www.instagram.com/dalil.tounes/',
    'Lien LinkedIn': 'https://www.linkedin.com/company/daliltounes',
  };

  return <BusinessDetail preview business={demonstrationBusiness} />;
}

function ContinuousPlanCard({
  tier,
  copy,
  intro,
  features,
  onPreview,
  onRequest,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  copy: SubscriptionCopy;
  intro: string;
  features: string[];
  onPreview: () => void;
  onRequest: () => void;
}) {
  const tierLabel = tier === 'ARTISAN' ? copy.artisan : copy.premium;
  const requestLabel = tier === 'ARTISAN' ? copy.requestArtisan : copy.requestPremium;

  return (
    <article className="relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-3xl border-2 border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-[0_12px_30px_rgba(7,84,63,0.16)] sm:p-6">
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#D6AF2E] px-4 py-2 text-[11px] font-black tracking-[0.16em] text-[#07543F]">
        {tierLabel}
      </span>
      <span className="mb-5 w-fit rounded-full border border-[#D6AF2E]/50 bg-[#D6AF2E]/15 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#F4CE55]">
        {copy.launchBadge}
      </span>
      <h3 className="text-2xl font-bold">{tierLabel}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-emerald-50">{intro}</p>
      <ul className="mt-5 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm leading-5 text-emerald-50">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F0C537]">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-xl border border-[#D6AF2E] bg-transparent px-4 py-3 text-sm font-bold text-[#F0C537] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          {copy.previewCard}
        </button>
        <button
          type="button"
          onClick={onRequest}
          className="rounded-xl bg-[#D6AF2E] px-4 py-3 text-sm font-bold text-[#07543F] transition hover:bg-[#E5C64D] focus:outline-none focus:ring-2 focus:ring-white"
        >
          {requestLabel}
        </button>
      </div>
    </article>
  );
}

export const Subscription = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const copy = isArabic ? subscriptionCopy.ar : subscriptionCopy.fr;
  const flyerCopy = printSupportCopy[language];
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  const closePreview = () => setActivePreview(null);
  const openRequest = (plan: string) => {
    setSelectedPlan(plan);
    setActivePreview('request');
  };

  return (
    <div className="bg-[#FFFCF7] px-4 py-8 text-slate-900 sm:py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-3 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            <span className="h-px w-8 bg-amber-400" /> {copy.heroEyebrow} <span className="h-px w-8 bg-amber-400" />
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4A123F] sm:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">{copy.heroSubtitle}</p>
        </header>

        <section aria-label={copy.startingSolutions} className="grid items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="flex flex-col rounded-3xl border border-[#D6AF2E] bg-white p-5 shadow-[0_12px_30px_rgba(74,18,63,0.07)] sm:p-7">
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">
              {copy.selfService}
            </span>
            <div className="my-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#4A123F]/35 text-center text-[10px] font-bold uppercase text-[#4A123F]">
              {copy.yourLogo.split('\n').map((line) => <span key={line}>{line}<br /></span>)}
            </div>
            <h2 className="text-2xl font-bold text-[#4A123F]">{copy.essentialTitle}</h2>
            <div className="mt-3 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">0</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4A123F]">{copy.essentialFree}</p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={[...copy.essentialFeatures]} />
            <div className="mt-auto grid gap-2 pt-6">
              <a
                href="/inscription-entreprise"
                className="rounded-xl border-2 border-[#4A123F]/20 bg-white px-4 py-3 text-center text-sm font-bold text-[#4A123F] transition hover:border-[#D6AF2E] hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                {copy.addActivity}
              </a>
              <button
                type="button"
                onClick={() => setActivePreview('free')}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 underline decoration-[#D6AF2E] underline-offset-4 transition hover:text-[#4A123F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                {copy.previewCard}
              </button>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl border-2 border-[#D6AF2E] bg-gradient-to-br from-white via-white to-amber-50/80 p-5 shadow-[0_14px_36px_rgba(214,175,46,0.12)] sm:p-7">
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
              {copy.humanSupport}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F] sm:text-3xl">{copy.cvTitle}</h2>
            <div className="mt-2 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">199</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-3 text-sm font-bold text-[#4A123F]">{copy.cvPriceNotice}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={copy.paymentOptions}>
              <span className="rounded-lg bg-[#07543F] px-4 py-2 text-sm font-bold text-white">{copy.payOnce}</span>
              <span className="text-xs text-slate-400">{copy.or}</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payTwice}</span>
              <span className="text-xs text-slate-400">{copy.or}</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payThreeTimes}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy.cvPublication}</p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={[...copy.cvFeatures]} columns />
            <button
              type="button"
              onClick={() => openRequest(copy.cvPlanLabel)}
              className="mt-6 w-full rounded-xl bg-[#4A123F] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#5B1C4E] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            >
              {copy.requestCreation}
            </button>
          </article>
        </section>

        <section aria-labelledby="continuous-services-title" className="mt-9 sm:mt-11">
          <div className="mb-5 flex items-center justify-center gap-3 text-center">
            <span className="h-px w-8 bg-amber-400" />
            <h2 id="continuous-services-title" className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
              {copy.continuousServices}
            </h2>
            <span className="h-px w-8 bg-amber-400" />
          </div>

          <div className="mb-5 rounded-2xl border border-[#D6AF2E]/55 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div>
              <span className="inline-flex rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">
                {copy.launchBadge}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#4A123F]">{copy.launchTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{copy.launchIntro}</p>
              <p className="text-sm leading-6 text-slate-700">
                {copy.launchAnnualPrefix} <strong>{copy.launchAnnualStrong}</strong>
              </p>
              <p className="text-sm font-semibold leading-6 text-[#07543F]">{copy.launchPayment}</p>
            </div>
            <button
              type="button"
              onClick={() => setActivePreview('launch')}
              className="mt-3 shrink-0 text-sm font-semibold text-[#4A123F] underline decoration-[#D6AF2E] underline-offset-4 hover:text-[#07543F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] sm:mt-0"
            >
              {copy.seeConditions}
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.82fr]">
            <ContinuousPlanCard
              tier="ARTISAN"
              copy={copy}
              intro={copy.artisanIntro}
              features={[...copy.artisanFeatures]}
              onPreview={() => setActivePreview('artisan')}
              onRequest={() => openRequest(copy.artisanPlanLabel)}
            />
            <ContinuousPlanCard
              tier="PREMIUM"
              copy={copy}
              intro={copy.premiumIntro}
              features={[...copy.premiumFeatures]}
              onPreview={() => setActivePreview('premium')}
              onRequest={() => openRequest(copy.premiumPlanLabel)}
            />

            <div className="grid content-start gap-4">
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-9 w-9 shrink-0 text-amber-500" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">{copy.certifiedTitle}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{copy.certifiedText}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{copy.certifiedIndependence}</p>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 shrink-0 text-[#4A123F]" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">{flyerCopy.flyers}</h3>
                    <p className="mt-1 text-sm text-slate-600">{flyerCopy.flyerDescription}</p>
                    <p className="mt-1 text-sm text-slate-600">{flyerCopy.flyerProduction}</p>
                    <p className="mt-2 text-xs font-bold text-[#07543F]">{flyerCopy.annualPremiumOnly}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center text-sm font-semibold text-[#07543F]">
            {copy.trialClarification}
          </p>
        </section>

        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-center text-sm text-slate-700">
          <Info className="h-5 w-5 shrink-0 text-[#4A123F]" aria-hidden="true" />
          <p>{copy.disclaimer}</p>
        </div>

        <section className="mt-5 flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#D6AF2E] text-[#F0C537]">
              <Rocket className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">{copy.ctaTitle}</h2>
              <p className="mt-1 text-sm text-purple-100">{copy.ctaText}</p>
            </div>
          </div>
          <a
            href="#continuous-services-title"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
          >
            {copy.ctaButton} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </main>

      {activePreview === 'free' && (
        <Modal title={copy.previewEssentialTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewEssentialTitle}</h2>
          <EssentialCardPreview copy={copy} />
        </Modal>
      )}

      {activePreview === 'artisan' && (
        <Modal title={copy.previewArtisanTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewArtisanTitle}</h2>
          <GreenCardPreview tier="ARTISAN" copy={copy} />
        </Modal>
      )}

      {activePreview === 'premium' && (
        <Modal title={copy.previewPremiumTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewPremiumTitle}</h2>
          <GreenCardPreview tier="PREMIUM" copy={copy} onDetails={() => setActivePreview('premium-detail')} />
        </Modal>
      )}

      {activePreview === 'premium-detail' && (
        <Modal title={copy.premiumDetailTitle} onClose={closePreview} closeLabel={copy.closeModal} wide>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.premiumDetailTitle}</h2>
          <PremiumDetailPreview copy={copy} isArabic={isArabic} />
        </Modal>
      )}

      {activePreview === 'launch' && (
        <Modal title={copy.launchConditionsDialog} onClose={closePreview} closeLabel={copy.closeModal}>
          <div className="mx-auto max-w-lg">
            <span className="rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">{copy.launchBadge}</span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F]">{copy.launchConditionsTitle}</h2>
            <ul className="mt-5 space-y-3">
              {copy.launchConditions.map((condition) => (
                <li key={condition} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" /> {condition}
                </li>
              ))}
              {flyerCopy.flyerConditions.map((condition) => (
                <li key={condition} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" /> {condition}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {activePreview === 'request' && (
        <Modal title={`${copy.requestModal} — ${selectedPlan}`} onClose={closePreview} closeLabel={copy.closeModal} wide>
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 text-center">
              <Send className="mx-auto h-8 w-8 text-[#D6AF2E]" aria-hidden="true" />
              <h2 className="mt-2 text-2xl font-bold text-[#4A123F]">{copy.requestTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedPlan}</p>
            </div>
            <BusinessRegistrationRequestForm mode="subscription" selectedPlan={selectedPlan} onCancel={closePreview} onSuccess={closePreview} />
          </div>
        </Modal>
      )}
    </div>
  );
};
