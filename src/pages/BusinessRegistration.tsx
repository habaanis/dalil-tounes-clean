import { useEffect } from 'react';
import { Building2, CheckCircle2, CreditCard, Smartphone, type LucideIcon } from 'lucide-react';
import { BusinessRegistrationRequestForm } from '../components/BusinessRegistrationRequestForm';
import { useLanguage } from '../context/LanguageContext';

const PAGE_COPY = {
  fr: {
    eyebrow: 'Inscription professionnelle',
    title: 'Inscrire mon entreprise sur Dalil Tounes',
    subtitle: 'Développez votre présence sur Internet et présentez votre activité aux citoyens.',
    intro:
      'Ce formulaire permet à un artisan, un commerçant, un professionnel ou une entreprise de demander son inscription sans créer de compte.',
    mobile: 'Simple sur téléphone et ordinateur',
    noPayment: 'Aucun paiement sur cette page',
    followUp: 'Notre équipe vérifie la demande et vous recontacte',
    formTitle: 'Commençons par les informations essentielles',
    formHint: 'Les champs marqués d’un astérisque sont obligatoires. Les autres pourront être complétés plus tard.',
    privacyTitle: 'Comment vos informations sont utilisées',
    privacyText:
      'Elles sont transmises à l’équipe Dalil Tounes pour traiter votre demande et ne sont pas publiées automatiquement dans l’annuaire.',
    documentTitle: 'Inscrire mon entreprise sur Dalil Tounes',
    description:
      'Demandez simplement l’inscription de votre entreprise, commerce, activité artisanale ou professionnelle sur Dalil Tounes.',
  },
  ar: {
    eyebrow: 'تسجيل المهنيين',
    title: 'تسجيل مؤسستي في دليل تونس',
    subtitle: 'طوّر حضورك على الإنترنت وقدّم نشاطك للمواطنين.',
    intro:
      'يسمح هذا النموذج للحرفي أو التاجر أو المهني أو المؤسسة بطلب التسجيل دون إنشاء حساب.',
    mobile: 'سهل على الهاتف والحاسوب',
    noPayment: 'لا يوجد أي دفع في هذه الصفحة',
    followUp: 'يتحقق فريقنا من الطلب ثم يتصل بك',
    formTitle: 'لنبدأ بالمعلومات الأساسية',
    formHint: 'الخانات التي تحمل علامة النجمة إجبارية، ويمكن إكمال بقية المعلومات لاحقاً.',
    privacyTitle: 'كيف تُستعمل معلوماتك',
    privacyText:
      'تُرسل إلى فريق دليل تونس لمعالجة طلبك ولا يتم نشرها تلقائياً في الدليل.',
    documentTitle: 'تسجيل مؤسستي في دليل تونس',
    description:
      'اطلب بسهولة تسجيل مؤسستك أو تجارتك أو نشاطك الحرفي أو المهني في دليل تونس.',
  },
};

export default function BusinessRegistration() {
  const { language } = useLanguage();
  const text = language === 'ar' ? PAGE_COPY.ar : PAGE_COPY.fr;

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionMeta?.content;

    document.title = text.documentTitle;
    if (descriptionMeta) descriptionMeta.content = text.description;

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== undefined) {
        descriptionMeta.content = previousDescription;
      }
    };
  }, [text.description, text.documentTitle]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#4A1D43] via-[#632652] to-[#0B5A45] px-5 py-9 text-white shadow-[0_24px_70px_rgba(74,29,67,0.18)] sm:px-8 sm:py-12 lg:px-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-[#D4AF37]/50 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F7D978]">
              {text.eyebrow}
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{text.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">{text.subtitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{text.intro}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <TrustItem icon={Smartphone} label={text.mobile} />
              <TrustItem icon={CreditCard} label={text.noPayment} />
              <TrustItem icon={CheckCircle2} label={text.followUp} />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="rounded-3xl border border-[#D4AF37]/35 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4A1D43] text-[#D4AF37]">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-[#4A1D43] sm:text-2xl">{text.formTitle}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{text.formHint}</p>
            </div>

            <BusinessRegistrationRequestForm mode="company_registration" />
          </div>

          <aside className="rounded-3xl border border-[#D4AF37]/30 bg-[#FFFDF7] p-5 shadow-sm lg:sticky lg:top-28">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#4A1D43]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#4A1D43]">{text.privacyTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{text.privacyText}</p>
          </aside>
        </section>
      </div>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/95 backdrop-blur-sm">
      <Icon className="h-5 w-5 flex-none text-[#F7D978]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
