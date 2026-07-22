import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
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

type PreviewType = 'free' | 'artisan' | 'premium' | 'premium-detail' | 'launch' | 'request' | null;

const LOGO_PATH = '/images/logo_dalil_tounes_sceau_luxe.webp';

const essentialFeatures = [
  "Nom de l'activité",
  'Catégorie et ville',
  'Téléphone ou WhatsApp',
  "Horaires d'ouverture",
  'Courte description',
  "Logo de l'activité",
  'Présence dans la recherche Dalil Tounes',
];

const cvBusinessFeatures = [
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
];

const artisanSummary = [
  'Statistiques et vues',
  'Formulaires de demande de devis ou de contact',
  'Outils pratiques pour améliorer votre présence',
  'Support technique',
];

const premiumSummary = [
  'Mises à jour groupées',
  "Ajout d'informations et de photos",
  'Vérification des liens et horaires',
  'Assistance prioritaire',
];

const launchConditions = [
  'Offre réservée aux nouveaux abonnés Artisan et Premium.',
  'Une seule offre par activité.',
  "Les trois mois d'essai commencent à la date d'inscription.",
  'La période totale de 18 mois est calculée à partir de cette date.',
  "L'abonnement annuel est confirmé après le dernier versement.",
  "En cas de paiement annuel incomplet, le compte revient à la formule gratuite à la fin de la période d'essai.",
  'Les cartes de visite et les flyers sont produits uniquement après le paiement annuel complet.',
  "L'offre est limitée dans le temps ou à un nombre d'inscriptions qui sera défini avant la mise en ligne.",
  "L'offre ne peut pas être cumulée avec une autre promotion sans validation.",
];

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
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
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
            aria-label="Fermer la fenêtre"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pb-5 sm:px-7 sm:pb-7">{children}</div>
      </div>
    </div>
  );
}

function DemoLogo({ large = false }: { large?: boolean }) {
  return (
    <img
      src={LOGO_PATH}
      alt="Logo Dalil Tounes"
      className={`${large ? 'h-24 w-24' : 'h-20 w-20'} rounded-full border-4 border-[#D6AF2E] bg-white object-cover shadow-lg`}
    />
  );
}

function EssentialCardPreview() {
  return (
    <div className="mx-auto max-w-lg rounded-[26px] border-[3px] border-[#D6AF2E] bg-white p-5 text-slate-800 shadow-xl sm:p-7">
      <div className="mb-5 flex justify-center">
        <DemoLogo />
      </div>
      <h3 className="text-xl font-bold sm:text-2xl">Fiche Démonstration Dalil Tounes</h3>
      <p className="mt-1 font-semibold text-[#C89E19]">Plateforme tunisienne</p>
      <p className="mt-3 flex items-center gap-2 text-slate-600">
        <MapPin className="h-5 w-5" aria-hidden="true" /> Tunisie
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-700">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> Ouvert
      </p>
      <p className="mt-1 text-slate-600">Aujourd'hui : horaires indiqués sur la fiche</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#173429]">
        <Phone className="h-5 w-5" aria-hidden="true" /> Contacter Dalil Tounes
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Une carte gratuite avec le logo et les informations essentielles de l'activité, sans galerie ni portfolio.
      </p>
    </div>
  );
}

function GreenCardPreview({ tier, onDetails }: { tier: 'ARTISAN' | 'PREMIUM'; onDetails?: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-[26px] border-[3px] border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <DemoLogo />
        <span className="rounded-full border border-[#D6AF2E]/60 bg-[#D6AF2E]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#F4CE55]">
          {tier}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-[#F0C537]">Fiche Démonstration Dalil Tounes</h3>
      <p className="mt-1 font-semibold text-[#F0C537]">Plateforme tunisienne</p>
      <p className="mt-3 flex items-center gap-2 text-emerald-50">
        <MapPin className="h-5 w-5" aria-hidden="true" /> Tunisie
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-300">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> Ouvert
      </p>
      <p className="mt-1 text-emerald-50">Aujourd'hui : horaires affichés sur la carte</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#07543F]">
        <Phone className="h-5 w-5" aria-hidden="true" /> Appeler
      </div>
      {tier === 'ARTISAN' && (
        <p className="mt-4 border-t border-[#D6AF2E]/35 pt-4 text-sm leading-6 text-emerald-50">
          Carte simple pour présenter clairement les informations essentielles. Aucun accès à une fiche Premium détaillée.
        </p>
      )}
      {tier === 'PREMIUM' && (
        <button
          type="button"
          onClick={onDetails}
          className="mt-4 flex w-full items-center justify-center gap-2 border-t border-[#D6AF2E]/35 pt-4 text-base font-bold text-[#F0C537] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          Voir les détails <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function PremiumDetailPreview() {
  const demonstrationBusiness = {
    id: 'demo-dalil-tounes-premium',
    nom: 'Fiche Démonstration Dalil Tounes',
    categorie: 'Plateforme tunisienne',
    adresse: 'Tunisie, Tunisie',
    description: 'Découvrez comment fonctionne une fiche professionnelle sur Dalil Tounes.',
    whatsapp: '+216 XX XXX XXX',
    email: 'contact@dalil-tounes.com',
    site_web: 'https://dalil-tounes.com',
    services: 'Annuaire professionnel, Visibilité locale, Présentation des activités',
    sous_categories_texte: 'Annuaire professionnel, Visibilité locale, Présentation des activités',
    statut_abonnement: 'premium',
    logo_url: LOGO_PATH,
    image_url: null,
    horaires_ok: 'Lundi : 08:00–18:00\nMardi : 08:00–18:00\nMercredi : 08:00–18:00\nJeudi : 08:00–18:00\nVendredi : 08:00–18:00\nSamedi : 09:00–13:00\nDimanche : Fermé',
    statut_carte: 'Certifié Dalil Tounes',
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
  intro,
  features,
  onPreview,
  onRequest,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  intro: string;
  features: string[];
  onPreview: () => void;
  onRequest: () => void;
}) {
  return (
    <article className="relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-3xl border-2 border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-[0_12px_30px_rgba(7,84,63,0.16)] sm:p-6">
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#D6AF2E] px-4 py-2 text-[11px] font-black tracking-[0.16em] text-[#07543F]">
        {tier}
      </span>
      <span className="mb-5 w-fit rounded-full border border-[#D6AF2E]/50 bg-[#D6AF2E]/15 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#F4CE55]">
        OFFRE DE LANCEMENT
      </span>
      <h3 className="text-2xl font-bold">{tier === 'ARTISAN' ? 'Artisan' : 'Premium'}</h3>
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
          Aperçu de la carte
        </button>
        <button
          type="button"
          onClick={onRequest}
          className="rounded-xl bg-[#D6AF2E] px-4 py-3 text-sm font-bold text-[#07543F] transition hover:bg-[#E5C64D] focus:outline-none focus:ring-2 focus:ring-white"
        >
          Choisir {tier === 'ARTISAN' ? 'Artisan' : 'Premium'}
        </button>
      </div>
    </article>
  );
}

export const Subscription = () => {
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  const closePreview = () => setActivePreview(null);
  const openRequest = (plan: string) => {
    setSelectedPlan(plan);
    setActivePreview('request');
  };

  return (
    <div className="bg-[#FFFCF7] px-4 py-8 text-slate-900 sm:py-12">
      <main className="mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-3 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            <span className="h-px w-8 bg-amber-400" /> Solutions pour les professionnels <span className="h-px w-8 bg-amber-400" />
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4A123F] sm:text-4xl lg:text-5xl">
            Choisissez votre manière de commencer
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
            Dalil Tounes rassemble les informations de votre activité sans remplacer les plateformes.
          </p>
        </header>

        <section aria-label="Solutions de démarrage" className="grid items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="flex flex-col rounded-3xl border border-[#D6AF2E] bg-white p-5 shadow-[0_12px_30px_rgba(74,18,63,0.07)] sm:p-7">
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">
              Je crée moi-même
            </span>
            <div className="my-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#4A123F]/35 text-center text-[10px] font-bold uppercase text-[#4A123F]">
              Votre<br />logo
            </div>
            <h2 className="text-2xl font-bold text-[#4A123F]">Présence essentielle</h2>
            <div className="mt-3 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">0</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4A123F]">Gratuit, sans abonnement obligatoire</p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={essentialFeatures} />
            <div className="mt-auto grid gap-2 pt-6">
              <a
                href="/inscription-entreprise"
                className="rounded-xl border-2 border-[#4A123F]/20 bg-white px-4 py-3 text-center text-sm font-bold text-[#4A123F] transition hover:border-[#D6AF2E] hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                Ajouter mon activité
              </a>
              <button
                type="button"
                onClick={() => setActivePreview('free')}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 underline decoration-[#D6AF2E] underline-offset-4 transition hover:text-[#4A123F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                Aperçu de la carte
              </button>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl border-2 border-[#D6AF2E] bg-gradient-to-br from-white via-white to-amber-50/80 p-5 shadow-[0_14px_36px_rgba(214,175,46,0.12)] sm:p-7">
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
              Accompagnement humain
            </span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F] sm:text-3xl">CV Business créé avec vous</h2>
            <div className="mt-2 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">199</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-3 text-sm font-bold text-[#4A123F]">Paiement unique — le prix total reste toujours 199 TND.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Possibilités de paiement">
              <span className="rounded-lg bg-[#07543F] px-4 py-2 text-sm font-bold text-white">199 TND en une fois</span>
              <span className="text-xs text-slate-400">ou</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">100 TND puis 99 TND</span>
              <span className="text-xs text-slate-400">ou</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">67 + 66 + 66 TND</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Votre CV Business est préparé pendant les différentes étapes et publié après le paiement complet.
            </p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={cvBusinessFeatures} columns />
            <button
              type="button"
              onClick={() => openRequest('CV Business — paiement unique 199 TND')}
              className="mt-6 w-full rounded-xl bg-[#4A123F] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#5B1C4E] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            >
              Demander la création
            </button>
          </article>
        </section>

        <section aria-labelledby="continuous-services-title" className="mt-9 sm:mt-11">
          <div className="mb-5 flex items-center justify-center gap-3 text-center">
            <span className="h-px w-8 bg-amber-400" />
            <h2 id="continuous-services-title" className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
              Services continus &amp; options
            </h2>
            <span className="h-px w-8 bg-amber-400" />
          </div>

          <div className="mb-5 rounded-2xl border border-[#D6AF2E]/55 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div>
              <span className="inline-flex rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">
                OFFRE DE LANCEMENT
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#4A123F]">Offre spéciale de lancement</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Profitez de 3 mois d'accès Artisan ou Premium offerts dès votre inscription.
              </p>
              <p className="text-sm leading-6 text-slate-700">
                En choisissant l'abonnement annuel, bénéficiez de 3 mois supplémentaires : <strong>18 mois d'accès au total pour le prix de 12.</strong>
              </p>
              <p className="text-sm font-semibold leading-6 text-[#07543F]">Paiement annuel possible en trois fois.</p>
            </div>
            <button
              type="button"
              onClick={() => setActivePreview('launch')}
              className="mt-3 shrink-0 text-sm font-semibold text-[#4A123F] underline decoration-[#D6AF2E] underline-offset-4 hover:text-[#07543F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] sm:mt-0"
            >
              Voir les conditions
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.82fr]">
            <ContinuousPlanCard
              tier="ARTISAN"
              intro="Des outils pratiques pour gérer et développer votre présence avec une carte simple."
              features={artisanSummary}
              onPreview={() => setActivePreview('artisan')}
              onRequest={() => openRequest('Abonnement Artisan')}
            />
            <ContinuousPlanCard
              tier="PREMIUM"
              intro="Un suivi accompagné pour garder votre CV Business et vos informations à jour."
              features={premiumSummary}
              onPreview={() => setActivePreview('premium')}
              onRequest={() => openRequest('Abonnement Premium')}
            />

            <div className="grid content-start gap-4">
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-9 w-9 shrink-0 text-amber-500" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">Certifié Dalil Tounes</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">Attribué après vérification des informations et des justificatifs.</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Peut être accordé à une activité gratuite, Artisan ou Premium selon les pièces fournies et les critères de qualité.</p>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-8 w-8 shrink-0 text-[#4A123F]" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">Cartes de visite</h3>
                    <p className="mt-1 text-sm text-slate-600">Design et impression professionnelle.</p>
                    <p className="mt-2 text-xs font-bold text-[#07543F]">Inclus dans l'abonnement annuel uniquement.</p>
                  </div>
                </div>
                <div className="my-4 h-px bg-amber-100" />
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 shrink-0 text-[#4A123F]" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">Flyers</h3>
                    <p className="mt-1 text-sm text-slate-600">Design et impression professionnelle.</p>
                    <p className="mt-2 text-xs font-bold text-[#07543F]">Inclus dans l'abonnement annuel uniquement.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center text-sm font-semibold text-[#07543F]">
            Paiement annuel possible en 3 fois — activation après le paiement final.
          </p>
        </section>

        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-center text-sm text-slate-700">
          <Info className="h-5 w-5 shrink-0 text-[#4A123F]" aria-hidden="true" />
          <p>Dalil Tounes ne remplace pas vos réseaux sociaux et ne constitue pas une prestation de publicité.</p>
        </div>

        <section className="mt-5 flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#D6AF2E] text-[#F0C537]">
              <Rocket className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Prêt à présenter votre activité plus clairement ?</h2>
              <p className="mt-1 text-sm text-purple-100">Commencez gratuitement ou demandez un accompagnement pour créer votre CV Business.</p>
            </div>
          </div>
          <a
            href="#continuous-services-title"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
          >
            Choisir ma solution <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </main>

      {activePreview === 'free' && (
        <Modal title="Aperçu de la carte Présence essentielle" onClose={closePreview}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">Aperçu — Présence essentielle</h2>
          <EssentialCardPreview />
        </Modal>
      )}

      {activePreview === 'artisan' && (
        <Modal title="Aperçu de la carte Artisan" onClose={closePreview}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">Aperçu — Artisan</h2>
          <GreenCardPreview tier="ARTISAN" />
        </Modal>
      )}

      {activePreview === 'premium' && (
        <Modal title="Aperçu de la carte Premium" onClose={closePreview}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">Aperçu — Premium</h2>
          <GreenCardPreview tier="PREMIUM" onDetails={() => setActivePreview('premium-detail')} />
        </Modal>
      )}

      {activePreview === 'premium-detail' && (
        <Modal title="Fiche Premium détaillée" onClose={closePreview} wide>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">Fiche Premium détaillée</h2>
          <PremiumDetailPreview />
        </Modal>
      )}

      {activePreview === 'launch' && (
        <Modal title="Conditions de l'offre spéciale de lancement" onClose={closePreview}>
          <div className="mx-auto max-w-lg">
            <span className="rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">OFFRE DE LANCEMENT</span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F]">Conditions de l'offre spéciale</h2>
            <ul className="mt-5 space-y-3">
              {launchConditions.map((condition) => (
                <li key={condition} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" /> {condition}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {activePreview === 'request' && (
        <Modal title={`Demande — ${selectedPlan}`} onClose={closePreview} wide>
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 text-center">
              <Send className="mx-auto h-8 w-8 text-[#D6AF2E]" aria-hidden="true" />
              <h2 className="mt-2 text-2xl font-bold text-[#4A123F]">Demander cette solution</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedPlan}</p>
            </div>
            <BusinessRegistrationRequestForm mode="subscription" selectedPlan={selectedPlan} onCancel={closePreview} onSuccess={closePreview} />
          </div>
        </Modal>
      )}
    </div>
  );
};
