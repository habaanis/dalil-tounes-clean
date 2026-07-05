import {
  ArrowDown,
  ArrowRight,
  Award,
  CalendarCheck,
  Camera,
  Check,
  Clock,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  Crown,
  QrCode,
  Search,
  Share2,
  ShoppingBag,
  Star,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

type PlatformRole = {
  name: string;
  question: string;
  icons: LucideIcon[];
};

type Marker = {
  label: string;
  description?: string;
  icon: LucideIcon;
};

type FeatureGroup = {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
};

const platformRoles: PlatformRole[] = [
  { name: 'Google', question: 'Où trouver cette entreprise ?', icons: [Search] },
  { name: 'Facebook / Instagram', question: 'Que publie cette entreprise ?', icons: [Facebook, Instagram] },
  { name: 'LinkedIn', question: 'Qui est cette entreprise sur le plan professionnel ?', icons: [Linkedin] },
  { name: 'Pages Jaunes', question: 'Comment contacter cette entreprise ?', icons: [Clock] },
  { name: 'Marketplace B2B', question: 'Que cherche à acheter ou vendre cette entreprise ?', icons: [ShoppingBag] },
];

const businessCardMarkers: Marker[] = [
  { label: 'Premium', description: "Cette Business Card met en avant le statut Premium de l'établissement.", icon: Crown },
  { label: 'Certificat Dalil Tounes', icon: Award },
  { label: 'Téléphone', icon: Phone },
  { label: 'Horaires', icon: Clock },
  { label: 'Voir les détails', icon: ArrowRight },
];

const cvBusinessGroups: FeatureGroup[] = [
  {
    title: 'Localisation',
    description: "Trouver l'établissement et préparer ta visite.",
    icon: MapPin,
    items: ['GPS', 'Coordonnées', 'Horaires'],
  },
  {
    title: 'Réputation',
    description: 'Lire les signaux de confiance.',
    icon: Award,
    items: ['Avis Google', 'Certificat Dalil Tounes'],
  },
  {
    title: "Découvrir l'entreprise",
    description: "Comprendre l'activité en images et en services.",
    icon: Camera,
    items: ['Photos', 'Services', 'Présentation'],
  },
  {
    title: 'Échanger',
    description: 'Passer facilement de la découverte au contact.',
    icon: Phone,
    items: ['Téléphone', 'Réservation', 'Site web', 'Réseaux sociaux'],
  },
  {
    title: 'Partager',
    description: "Retrouver ou transmettre la fiche sur ton smartphone.",
    icon: QrCode,
    items: ['QR Code professionnel'],
  },
];

const citizenBenefits = [
  'Trouver rapidement le bon professionnel',
  'Consulter des fiches complètes et régulièrement mises à jour',
  'Lire les avis des clients',
  'Voir les horaires, le GPS et les coordonnées',
  "Réserver ou contacter directement l'entreprise",
  'Découvrir les services, les photos et les informations utiles',
  'Partager facilement une entreprise avec ton entourage',
];

const companyBenefits = [
  'Gagner en visibilité auprès des citoyens',
  'Présenter votre activité avec une fiche professionnelle complète',
  'Valoriser votre savoir-faire grâce au Certificat Dalil Tounes',
  'Recevoir des demandes de contact et de réservation',
  'Faciliter le partage de votre fiche grâce au QR Code professionnel',
  'Développer votre présence numérique',
  'Être trouvé plus facilement par vos futurs clients',
];

const timelineSteps = [
  { title: 'Photos', description: 'Montrer les lieux, les réalisations et le savoir-faire.', icon: Camera },
  { title: 'Avis', description: 'Faire évoluer la confiance avec les retours publics.', icon: Star },
  { title: 'Informations', description: 'Garder les horaires, coordonnées et détails utiles à jour.', icon: Clock },
  { title: 'Réservations', description: 'Faciliter les demandes directes depuis la fiche.', icon: CalendarCheck },
  { title: 'Partage', description: 'Retrouver ou transmettre une fiche grâce au QR Code professionnel.', icon: QrCode },
];

const SectionLabel = ({ children }: { children: string }) => (
  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{children}</p>
);

const BenefitList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3 text-gray-700">
        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF8E6] text-[#B8860B]">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const MarkerPill = ({ marker }: { marker: Marker }) => (
  <div className="rounded-xl border border-[#D4AF37]/25 bg-white/90 p-3 shadow-sm">
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8E6] text-[#4A1D43]">
        <marker.icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-bold text-[#4A1D43]">{marker.label}</p>
        {marker.description && <p className="mt-0.5 text-[11px] leading-4 text-gray-600">{marker.description}</p>}
      </div>
    </div>
  </div>
);

const FeatureGroupCard = ({ group }: { group: FeatureGroup }) => (
  <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#FFFCF4] p-4 shadow-sm">
    <div className="flex items-start gap-3.5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">
        <group.icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h4 className="text-base font-bold text-[#4A1D43]">{group.title}</h4>
        <p className="mt-0.5 text-sm leading-5 text-gray-600">{group.description}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {group.items.map((item) => (
            <span key={item} className="rounded-full border border-[#D4AF37]/25 bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#4A1D43]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ScreenshotFrame = ({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div className={`relative overflow-hidden rounded-[28px] border-2 border-[#D4AF37] bg-[#07573f] shadow-2xl ${className}`}>
    <img src={src} alt={alt} className="h-auto w-full object-contain" loading="lazy" decoding="async" />
  </div>
);

export default function PourquoiDalilTounes() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <SEOHead
        title="Pourquoi Dalil Tounes ? Plateforme tunisienne pour citoyens et entreprises"
        description="Découvrez pourquoi Dalil Tounes rapproche les citoyens, les entreprises et les professionnels en Tunisie dans une plateforme claire, utile et vivante."
        canonical="https://dalil-tounes.com/pourquoi-dalil-tounes"
        currentPath="/pourquoi-dalil-tounes"
      />

      <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-[#1B1020] px-5 py-20 text-white">
        <img
          src="/images/drapeau-tunisie.webp?v=1"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1020]/80 via-[#1B1020]/75 to-white" />
        <div className="relative mx-auto max-w-5xl text-center">
          <SectionLabel>Dalil Tounes</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Pourquoi Dalil Tounes ?</h1>
          <p className="mx-auto mt-5 max-w-3xl text-xl leading-8 text-white/90 sm:text-2xl">
            La plateforme tunisienne qui rapproche les citoyens et les entreprises.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Trouver une entreprise fiable ou être visible sur Internet ne devrait pas être compliqué.
            Dalil Tounes organise les informations utiles pour rendre la recherche plus simple, plus locale et plus humaine.
          </p>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionLabel>Le point de départ</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight text-[#4A1D43] sm:text-4xl">
                Chaque plateforme répond à un besoin différent.
              </h2>
              <p className="mt-5 text-lg leading-8 text-gray-700">
                Aujourd'hui, tu dois souvent passer d'une plateforme à une autre pour trouver toutes les informations dont tu as besoin.
                Dalil Tounes rapproche ces usages pour rendre ton parcours plus clair, du premier aperçu jusqu'au contact.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {platformRoles.map((platform) => (
                <div
                  key={platform.name}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex gap-2">
                    {platform.icons.map((Icon, index) => (
                      <span
                        key={`${platform.name}-${index}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E6] text-[#4A1D43]"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900">{platform.name}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">"{platform.question}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#D4AF37]/40 bg-[#FFF8E6] p-6 text-center shadow-sm">
            <p className="text-lg font-semibold leading-8 text-[#4A1D43]">
              Dalil Tounes réunit ces usages dans une plateforme pensée pour les citoyens, les entreprises et les professionnels en Tunisie, afin qu'ils puissent se retrouver plus facilement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Le parcours</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-[#4A1D43] sm:text-4xl">
              Comment Dalil Tounes peut t'aider ?
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Tu découvres d'abord une entreprise en quelques secondes, puis tu ouvres son CV Business pour consulter toutes les informations utiles.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionLabel>Étape 1</SectionLabel>
              <h3 className="text-3xl font-bold text-[#4A1D43]">① Business Card</h3>
              <p className="mt-4 text-lg leading-8 text-gray-700">
                La Business Card te permet de découvrir rapidement une entreprise.
              </p>
              <p className="mt-3 leading-7 text-gray-600">
                En quelques secondes, tu visualises les informations essentielles avant d'ouvrir la fiche complète.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {businessCardMarkers.map((marker) => (
                  <MarkerPill key={marker.label} marker={marker} />
                ))}
              </div>
            </div>

            <ScreenshotFrame
              src="/images/pourquoi-business-card.png"
              alt="Capture réelle d'une Business Card Dalil Tounes"
              className="mx-auto w-full max-w-xl bg-[#07573f]"
            />
          </div>

          <div className="mx-auto my-14 flex max-w-md flex-col items-center rounded-3xl border border-[#D4AF37]/35 bg-white px-6 py-7 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">① Business Card</p>
            <ArrowDown className="my-3 h-7 w-7 text-[#4A1D43]" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">② CV Business</p>
            <p className="mt-4 text-lg font-semibold text-[#4A1D43]">
              En un clic, découvre toutes les informations utiles.
            </p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <SectionLabel>Étape 2</SectionLabel>
              <h3 className="text-3xl font-bold text-[#4A1D43]">② CV Business</h3>
              <p className="mt-4 text-lg leading-8 text-gray-700">
                Le CV Business rassemble toutes les informations utiles pour t'aider à faire ton choix et permettre aux entreprises de présenter pleinement leur activité.
              </p>
              <div className="mt-7 grid gap-3">
                {cvBusinessGroups.map((group) => (
                  <FeatureGroupCard key={group.title} group={group} />
                ))}
              </div>
            </div>

            <ScreenshotFrame
              src="/images/pourquoi-cv-business.png"
              alt="Capture réelle d'un CV Business Dalil Tounes"
              className="mx-auto w-full max-w-[520px] bg-[#07573f]"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <SectionLabel>Pour les citoyens</SectionLabel>
            <h2 className="text-3xl font-bold text-[#4A1D43]">Tu cherches une entreprise ?</h2>
            <div className="mt-7">
              <BenefitList items={citizenBenefits} />
            </div>
          </div>

          <div className="rounded-3xl border border-[#D4AF37]/35 bg-[#FFF8E6] p-7 shadow-sm">
            <SectionLabel>Pour les professionnels</SectionLabel>
            <h2 className="text-3xl font-bold text-[#4A1D43]">Vous êtes une entreprise ?</h2>
            <div className="mt-7">
              <BenefitList items={companyBenefits} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1B1020] px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Une plateforme vivante</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Dalil Tounes évolue continuellement.</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Chaque nouvelle fonctionnalité est développée en fonction des besoins réels des citoyens et des entreprises.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 md:grid-cols-5">
            <div className="absolute left-0 right-0 top-[42px] hidden h-px bg-white/15 md:block" aria-hidden="true" />
            {timelineSteps.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-[#1B1020]">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-white/35">0{index + 1}</span>
                </div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
