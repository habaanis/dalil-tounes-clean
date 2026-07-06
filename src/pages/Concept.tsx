import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Star, Search, Globe, Navigation, Mail, Clock, ChevronDown } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { getConceptSeoMeta } from '../lib/seoMetaTemplates';
import { LazyImage } from '../components/LazyImage';
import StructuredData from '../components/StructuredData';
import { generateAboutPageSchema } from '../lib/structuredDataSchemas';
import Breadcrumb from '../components/seo/Breadcrumb';
import { useHreflangPath } from '../hooks/useHreflangPath';
import { BusinessCard } from '../components/BusinessCard';

const LOGO_URL = 'https://ik.imagekit.io/gfdpqvshw/Design_Assets_Dalil_Tounes/logos/logo_dalil_tounes_sceau_luxe.png?updatedAt=1773327267816&tr=w-140,h-140,f-auto,q-85';

function DemoSearchBar() {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg bg-white p-4 space-y-3" aria-hidden="true">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <input
            type="text"
            readOnly
            value="Plombier"
            className="w-full px-3 py-2.5 rounded-lg border border-[#D4AF37] bg-white text-sm text-gray-800 font-medium"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        </div>
        <div className="relative">
          <input
            type="text"
            readOnly
            value="Sousse"
            className="w-full px-3 py-2.5 rounded-lg border border-[#D4AF37] bg-white text-sm text-gray-800 font-medium"
          />
          <MapPin size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        </div>
      </div>
      <button className="w-full py-2.5 rounded-lg bg-[#4A1D43] text-white text-sm font-bold border border-[#D4AF37] hover:bg-[#5A2D53] transition-colors">
        Rechercher
      </button>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#D4AF37] text-white font-semibold">Tous</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-green-600 text-green-700 font-semibold">Certifies</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-orange-500 text-orange-600 font-semibold">Non certifies</span>
      </div>
    </div>
  );
}

const DEMO_BUSINESS = {
  id: 'demo-dalil-tounes',
  name: 'Dalil Tounes',
  categorie: 'Plateforme tunisienne',
  ville: 'Tunisie',
  gouvernorat: 'Tunisie',
  adresse: 'Tunisie',
  description: 'Decouvrez comment fonctionne une fiche professionnelle sur Dalil Tounes. Recherche, avis, horaires, GPS et contact direct.',
  telephone: '+216 XX XXX XXX',
  statut_abonnement: 'elite',
  niveau_priorite_abonnement: 4,
  logoUrl: LOGO_URL,
  imageUrl: null,
  horaires_ok: 'Lundi-Vendredi: 08:00-18:00, Samedi: 09:00-13:00',
  note_google: '5.0',
  nombre_avis: '24',
  score_avis: '5.0',
  statut_carte: 'Certifié Dalil Tounes',
  latitude: 36.8065,
  longitude: 10.1815,
  google_url: null,
  'BTN_Maps': null,
  name_ar: null,
  name_en: null,
  name_it: null,
  name_ru: null,
  description_ar: null,
  description_en: null,
  description_it: null,
  description_ru: null,
  featured: true,
  is_premium: true,
  approved: true,
  statut_validation: 'valide',
  badges: [],
};

function DemoBusinessCard() {
  return (
    <div className="max-w-[340px] mx-auto" aria-hidden="true">
      <BusinessCard
        business={DEMO_BUSINESS}
        onClick={() => {}}
      />
    </div>
  );
}

function DemoCVBusiness() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <div
        style={{
          transform: 'scale(0.65)',
          transformOrigin: 'top center',
        }}
      >
        <div
          className="rounded-2xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden"
          style={{ background: '#000', width: '380px' }}
        >
          {/* Header image */}
          <div className="relative h-24" style={{ background: '#1a0a18' }}>
            <img
              src="/images/drapeau-tunisie.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              width={380}
              height={96}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          </div>

          {/* Logo */}
          <div className="flex justify-center -mt-8 relative z-10">
            <div className="w-16 h-16 rounded-full border-[3px] border-[#D4AF37] bg-black flex items-center justify-center shadow-xl overflow-hidden">
              <img src={LOGO_URL} alt="" className="w-full h-full object-contain" width={64} height={64} />
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-5 pt-3 text-center space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white">Dalil Tounes</h3>
              <p className="text-xs font-medium text-[#D4AF37] mt-1">Plateforme tunisienne</p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide text-white bg-green-700">
                CERTIFIE DALIL TOUNES
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300">
              <MapPin size={12} className="text-[#D4AF37]" />
              <span>Tunisie</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 text-[9px] font-bold text-[#D4AF37] uppercase ml-1">
                <Navigation size={8} strokeWidth={3} /> GPS
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#D4AF37] font-bold">
              <Phone size={12} />
              <span>+216 XX XXX XXX</span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed px-2">
              Decouvrez comment fonctionne une fiche professionnelle sur Dalil Tounes. Recherche, fiches completes, avis et contact direct.
            </p>

            {/* Services tags */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-medium">
                Recherche
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-medium">
                Annuaire
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-medium">
                Visibilite
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-medium">
                Avis
              </span>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <span className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Phone size={13} className="text-[#D4AF37]" />
              </span>
              <span className="w-8 h-8 rounded-full bg-green-900/40 border border-green-500/40 flex items-center justify-center">
                <span className="text-[11px] text-green-400 font-bold">W</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Mail size={13} className="text-[#D4AF37]" />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Globe size={13} className="text-[#D4AF37]" />
              </span>
            </div>

            {/* Hours */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-green-400 font-medium">
              <Clock size={11} />
              <span>Ouvert maintenant</span>
              <span className="text-gray-500 ml-1">08:00 - 18:00</span>
            </div>

            {/* Full schedule */}
            <div className="text-left rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 text-[10px] space-y-1">
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Lundi</span><span>08:00 - 18:00</span></div>
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Mardi</span><span>08:00 - 18:00</span></div>
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Mercredi</span><span>08:00 - 18:00</span></div>
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Jeudi</span><span>08:00 - 18:00</span></div>
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Vendredi</span><span>08:00 - 18:00</span></div>
              <div className="flex justify-between text-gray-300"><span className="text-[#D4AF37] font-semibold">Samedi</span><span>09:00 - 13:00</span></div>
              <div className="flex justify-between text-red-400"><span className="font-semibold">Dimanche</span><span>Ferme</span></div>
            </div>

            {/* Photos gallery placeholder */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-800 border border-[#D4AF37]/20 flex items-center justify-center">
                  <span className="text-[9px] text-gray-500">Photo 1</span>
                </div>
                <div className="aspect-square bg-gray-800 border border-[#D4AF37]/20 flex items-center justify-center">
                  <span className="text-[9px] text-gray-500">Photo 2</span>
                </div>
                <div className="aspect-square bg-gray-800 border border-[#D4AF37]/20 flex items-center justify-center">
                  <span className="text-[9px] text-gray-500">Photo 3</span>
                </div>
              </div>
            </div>

            {/* QR Code section */}
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#D4AF37]/20">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 bg-gray-200 rounded" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400">Scanner pour partager</p>
                <p className="text-[10px] text-[#D4AF37] font-semibold">QR Code</p>
              </div>
            </div>

            {/* Reviews section */}
            <div className="pt-2 border-t border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Star size={13} fill="#D4AF37" className="text-[#D4AF37]" />
                  <span className="text-sm font-bold text-[#D4AF37]">5.0 / 5</span>
                  <span className="text-[10px] text-gray-400">(24 avis)</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                <span className="flex items-center gap-1.5">
                  <Star size={12} fill="#D4AF37" className="text-[#D4AF37]" />
                  Laisser un avis
                </span>
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Reservation button */}
            <button className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold mt-2">
              Reserver un rendez-vous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    emoji: '\uD83D\uDD0E',
    title: 'Tu recherches un professionnel',
    problem: "Aujourd'hui, il n'est pas toujours facile de trouver rapidement un professionnel de confiance.",
    solution: "Il te suffit d'indiquer un metier, une activite ou une ville pour commencer ta recherche.",
    component: 'searchbar',
  },
  {
    emoji: '\uD83D\uDCCB',
    title: 'Dalil Tounes te propose plusieurs resultats',
    problem: 'Les informations importantes sont souvent dispersees ou difficiles a consulter rapidement.',
    solution: 'En quelques secondes, decouvre les professionnels correspondant a ta recherche grace aux Business Cards.',
    component: 'businesscard',
  },
  {
    emoji: '\uD83D\uDCC4',
    title: 'Tu ouvres une fiche complete',
    problem: 'Tu dois parfois consulter plusieurs sites ou applications pour reunir toutes les informations utiles.',
    solution: 'Le CV Business rassemble les informations essentielles sur une seule fiche : horaires, telephone, GPS, photos, services, avis, reservation, QR Code et bien plus encore.',
    component: 'cvbusiness',
  },
  {
    emoji: '\uD83D\uDCDE',
    title: 'Tu contactes facilement le professionnel',
    problem: 'Trouver le bon numero, les horaires ou la localisation peut faire perdre du temps.',
    solution: 'Depuis la fiche, tu peux appeler, reserver, utiliser le GPS ou contacter directement le professionnel.',
    component: null,
  },
  {
    emoji: '\u2B50',
    title: 'Tu poursuis ta recherche si tu le souhaites',
    problem: null,
    solution: "Dalil Tounes peut egalement te proposer d'autres professionnels correspondant a ta recherche afin de t'aider a trouver celui qui repond le mieux a tes besoins.",
    component: null,
  },
];

const FLOW_STEPS = [
  'Business Card',
  'CV Business',
  'Plus de visibilite',
  'Plus de contacts',
  "Plus d'opportunites",
];

function StepIllustration({ type }: { type: string | null }) {
  if (type === 'searchbar') return <DemoSearchBar />;
  if (type === 'businesscard') return <DemoBusinessCard />;
  if (type === 'cvbusiness') return <DemoCVBusiness />;
  return null;
}

export default function Concept() {
  const currentPath = useHreflangPath();
  const seo = getConceptSeoMeta();

  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={[
          generateAboutPageSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://dalil-tounes.com/' },
              { '@type': 'ListItem', position: 2, name: 'Comment fonctionne Dalil Tounes ?' },
            ],
          },
        ]}
      />

      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image="/images/pourquoi-business-card.png"
        type="website"
        canonical={seo.canonical}
        currentPath={currentPath}
      />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Comment fonctionne Dalil Tounes ?' }]} />
      </div>

      {/* HERO */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src="/images/cat_magasin.jpg.jpg"
            alt="Commerces et artisans en Tunisie"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.55)' }}
            fallbackSrc="https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&w=1920"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Comment fonctionne{' '}
            <span className="text-[#D4AF37]">Dalil Tounes</span> ?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Decouvre comment trouver rapidement un artisan, un commercant, un professionnel ou une entreprise de
            confiance en Tunisie, et comment Dalil Tounes aide les professionnels a developper leur visibilite.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-20">
          {STEPS.map((step, idx) => (
            <div key={idx} className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">{step.emoji}</span>
                <span>
                  Etape {idx + 1} : {step.title}
                </span>
              </h2>

              <div
                className={`flex flex-col ${
                  step.component ? 'lg:flex-row' : ''
                } gap-8 items-start`}
              >
                {/* Text content */}
                <div className={`flex-1 space-y-4 ${step.component ? 'lg:max-w-[50%]' : 'max-w-3xl'}`}>
                  {step.problem && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                      <span className="text-red-400 text-lg mt-0.5">&#x26A0;</span>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold text-gray-800">Probleme : </span>
                        {step.problem}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                    <span className="text-green-500 text-lg mt-0.5">&#x2714;</span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold text-gray-800">Solution : </span>
                      {step.solution}
                    </p>
                  </div>

                  {/* Step 4: show action buttons */}
                  {idx === 3 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm font-medium text-[#D4AF37]">
                        <Phone size={14} /> Appeler
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm font-medium text-[#D4AF37]">
                        <MapPin size={14} /> GPS
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                        WhatsApp
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700">
                        Reserver
                      </span>
                    </div>
                  )}

                  {/* Step 5: link to search */}
                  {idx === 4 && (
                    <div className="pt-2">
                      <Link
                        to="/entreprises"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-white font-semibold text-sm hover:bg-[#c9a42e] transition-colors"
                      >
                        <Search size={16} />
                        Essayer une recherche
                      </Link>
                    </div>
                  )}
                </div>

                {/* Illustration */}
                {step.component && (
                  <div className="flex-1 w-full lg:max-w-[50%]">
                    <StepIllustration type={step.component} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENTERPRISE SECTION */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Tu souhaites etre plus visible pour attirer davantage de clients ?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Dalil Tounes t'aide a presenter ton activite grace a une fiche professionnelle complete, a etre trouve
            plus facilement sur Internet et a faciliter le contact avec tes futurs clients.
          </p>

          {/* Flow/Frise */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-12">
            {FLOW_STEPS.map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx < 2 ? 'bg-[#D4AF37]' : 'bg-gray-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="mt-2 text-xs sm:text-sm font-medium text-gray-700 max-w-[110px] text-center leading-tight">
                    {label}
                  </span>
                </div>
                {idx < FLOW_STEPS.length - 1 && (
                  <ArrowRight size={20} className="text-[#D4AF37] mx-2 sm:mx-4 hidden sm:block flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <Link
            to="/abonnement"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4AF37] text-white font-bold text-base hover:bg-[#c9a42e] transition-colors shadow-lg hover:shadow-xl"
          >
            Decouvrir les offres entreprises
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CONCLUSION */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Dalil Tounes</span> simplifie la recherche des citoyens
            et aide les artisans, commercants, independants, PME et entreprises tunisiennes a etre visibles, trouves
            et contactes plus facilement.
          </p>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/entreprises" className="text-[#D4AF37] hover:underline font-medium">
              Rechercher un professionnel
            </Link>
            <Link to="/pourquoi-dalil-tounes" className="text-[#D4AF37] hover:underline font-medium">
              Pourquoi Dalil Tounes ?
            </Link>
            <Link to="/abonnement" className="text-[#D4AF37] hover:underline font-medium">
              Offres entreprises
            </Link>
            <Link to="/contact" className="text-[#D4AF37] hover:underline font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
