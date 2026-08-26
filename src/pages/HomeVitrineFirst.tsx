import { ArrowRight, CheckCircle2, QrCode, Share2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusinessCardPreview, type BusinessCardPreviewLanguage } from '../components/BusinessCardPreview';
import VisibilityHouseSection from '../components/VisibilityHouseSection';
import { useLanguage } from '../context/LanguageContext';
import { Home as PlatformHome } from './Home';

const COPY: Record<BusinessCardPreviewLanguage, {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  example: string;
  primary: string;
  secondary: string;
  proof1: string;
  proof2: string;
  proof3: string;
  bridgeTitle: string;
  bridgeText: string;
}> = {
  fr: {
    eyebrow: 'Votre présence professionnelle commence ici',
    title: 'Votre entreprise mérite mieux qu’une simple fiche.',
    accent: 'Créez votre CV Business professionnel.',
    description: 'Un CV Business vivant qui réunit votre activité, vos services, vos réalisations, vos contacts, vos avis et votre QR Code dans une vitrine élégante, facile à montrer et à partager.',
    example: "Exemple réel de présentation : Aux saveurs d'Anis",
    primary: 'Découvrir les offres',
    secondary: 'Découvrir la plateforme',
    proof1: 'Une présentation qui rassure',
    proof2: 'Un QR Code toujours avec vous',
    proof3: 'Un lien simple à partager partout',
    bridgeTitle: 'Le CV Business attire, rassure et se partage.',
    bridgeText: 'La plateforme Dalil Tounes organise, amplifie et crée la découverte.',
  },
  ar: {
    eyebrow: 'حضورك المهني يبدأ من هنا',
    title: 'مؤسستك تستحق أكثر من مجرد بطاقة بسيطة.',
    accent: 'أنشئ CV Business احترافيًا.',
    description: 'CV Business حي يجمع نشاطك وخدماتك وإنجازاتك ووسائل الاتصال والآراء ورمز QR في واجهة أنيقة وسهلة العرض والمشاركة.',
    example: "مثال تقديم: Aux saveurs d'Anis",
    primary: 'اكتشف العروض',
    secondary: 'اكتشف المنصة',
    proof1: 'تقديم مهني يبعث الثقة',
    proof2: 'رمز QR معك دائماً',
    proof3: 'رابط واحد سهل المشاركة',
    bridgeTitle: 'CV Business يجذب ويطمئن ويسهل مشاركته.',
    bridgeText: 'منصة دليل تونس تنظّم الظهور وتضخّمه وتخلق فرص الاكتشاف.',
  },
  en: {
    eyebrow: 'Your professional presence starts here',
    title: 'Your business deserves more than a simple listing.',
    accent: 'Create your professional Business CV.',
    description: 'A living Business CV bringing together your activity, services, work, contact options, reviews and QR Code in one elegant showcase that is easy to present and share.',
    example: "Presentation example: Aux saveurs d'Anis",
    primary: 'Discover the offers',
    secondary: 'Discover the platform',
    proof1: 'A presentation that builds trust',
    proof2: 'A QR Code always with you',
    proof3: 'One simple link to share anywhere',
    bridgeTitle: 'The Business CV attracts, reassures and gets shared.',
    bridgeText: 'Dalil Tounes organizes, amplifies and creates discovery.',
  },
  it: {
    eyebrow: 'La tua presenza professionale inizia qui',
    title: 'La tua attività merita più di una semplice scheda.',
    accent: 'Crea il tuo CV Business professionale.',
    description: 'Un CV Business vivo che riunisce attività, servizi, lavori, contatti, recensioni e QR Code in una vetrina elegante, facile da mostrare e condividere.',
    example: "Esempio di presentazione: Aux saveurs d'Anis",
    primary: 'Scopri le offerte',
    secondary: 'Scopri la piattaforma',
    proof1: 'Una presentazione che crea fiducia',
    proof2: 'Un QR Code sempre con te',
    proof3: 'Un solo link da condividere ovunque',
    bridgeTitle: 'Il CV Business attira, rassicura e si condivide.',
    bridgeText: 'Dalil Tounes organizza, amplifica e crea scoperta.',
  },
  ru: {
    eyebrow: 'Ваше профессиональное присутствие начинается здесь',
    title: 'Ваш бизнес заслуживает большего, чем простая карточка.',
    accent: 'Создайте профессиональный Business CV.',
    description: 'Живой Business CV объединяет деятельность, услуги, работы, контакты, отзывы и QR-код в одной элегантной витрине, которую легко показывать и делиться.',
    example: "Пример презентации: Aux saveurs d'Anis",
    primary: 'Посмотреть предложения',
    secondary: 'Открыть платформу',
    proof1: 'Презентация, вызывающая доверие',
    proof2: 'QR-код всегда с вами',
    proof3: 'Одна ссылка для любого канала',
    bridgeTitle: 'Business CV привлекает, убеждает и легко распространяется.',
    bridgeText: 'Dalil Tounes организует, усиливает и создаёт новые возможности быть найденным.',
  },
};

export default function HomeVitrineFirst() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as BusinessCardPreviewLanguage;
  const t = COPY[lang];
  const rtl = lang === 'ar';

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <section className="relative overflow-hidden border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={rtl ? 'text-right' : 'text-left'}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white/85 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              {t.eyebrow}
            </div>

            <h1 className="mt-5 max-w-2xl font-serif text-3xl font-bold leading-tight text-[#2E102A] md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl font-serif text-2xl font-bold leading-tight text-[#B58A18] md:text-4xl">
              {t.accent}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 md:text-base">
              {t.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/subscription')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(74,29,67,0.2)] transition hover:-translate-y-0.5 hover:bg-[#5B2553] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {t.primary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/businesses')}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43] transition hover:bg-[#FFF8DF] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {t.secondary}
              </button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {[
                [CheckCircle2, t.proof1],
                [QrCode, t.proof2],
                [Share2, t.proof3],
              ].map(([Icon, label]) => {
                const FeatureIcon = Icon as typeof CheckCircle2;
                return (
                  <div key={String(label)} className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-white/75 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                    <FeatureIcon className="h-4 w-4 shrink-0 text-[#B58A18]" aria-hidden="true" />
                    <span>{String(label)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[410px]">
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#D4AF37]/18 via-transparent to-[#4A1D43]/10 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[30px] border border-[#D4AF37]/45 bg-white/90 p-3 shadow-[0_28px_70px_rgba(74,29,67,0.16)] backdrop-blur-sm">
              <p className="mb-3 text-center text-[11px] font-bold text-[#4A1D43]">{t.example}</p>
              <BusinessCardPreview variant="premium" size="compact" interactive language={lang} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2E102A] px-4 py-6 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="font-serif text-xl font-bold md:text-2xl">{t.bridgeTitle}</p>
          <p className="mt-1 text-sm font-semibold text-[#F1D783] md:text-base">{t.bridgeText}</p>
        </div>
      </section>

      <VisibilityHouseSection />

      <style>{`.platform-home-after-vitrine #maison-visibilite{display:none}`}</style>
      <div className="platform-home-after-vitrine">
        <PlatformHome />
      </div>
    </div>
  );
}
