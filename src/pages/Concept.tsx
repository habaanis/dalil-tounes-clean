import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Star, Search } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { getConceptSeoMeta } from '../lib/seoMetaTemplates';
import { LazyImage } from '../components/LazyImage';
import StructuredData from '../components/StructuredData';
import { generateAboutPageSchema } from '../lib/structuredDataSchemas';
import Breadcrumb from '../components/seo/Breadcrumb';
import { useHreflangPath } from '../hooks/useHreflangPath';

const STEPS = [
  {
    emoji: '\uD83D\uDD0E',
    title: 'Tu recherches un professionnel',
    problem: "Aujourd'hui, il n'est pas toujours facile de trouver rapidement un professionnel de confiance.",
    solution: "Il te suffit d'indiquer un metier, une activite ou une ville pour commencer ta recherche.",
    image: "/images/Capture_d'écran_2026-06-30_à_22.07.03.png",
    imageAlt: 'Barre de recherche Dalil Tounes - Rechercher un professionnel en Tunisie',
  },
  {
    emoji: '\uD83D\uDCCB',
    title: 'Dalil Tounes te propose plusieurs resultats',
    problem: 'Les informations importantes sont souvent dispersees ou difficiles a consulter rapidement.',
    solution: 'En quelques secondes, decouvre les professionnels correspondant a ta recherche grace aux Business Cards.',
    image: '/images/pourquoi-business-card.png',
    imageAlt: 'Business Cards Dalil Tounes - Resultats de recherche professionnels en Tunisie',
  },
  {
    emoji: '\uD83D\uDCC4',
    title: 'Tu ouvres une fiche complete',
    problem: 'Tu dois parfois consulter plusieurs sites ou applications pour reunir toutes les informations utiles.',
    solution: 'Le CV Business rassemble les informations essentielles sur une seule fiche : horaires, telephone, GPS, photos, services, avis, reservation, QR Code et bien plus encore.',
    image: '/images/pourquoi-cv-business.png',
    imageAlt: 'CV Business Dalil Tounes - Fiche complete entreprise en Tunisie',
  },
  {
    emoji: '\uD83D\uDCDE',
    title: 'Tu contactes facilement le professionnel',
    problem: 'Trouver le bon numero, les horaires ou la localisation peut faire perdre du temps.',
    solution: 'Depuis la fiche, tu peux appeler, reserver, utiliser le GPS ou contacter directement le professionnel.',
    image: null,
    imageAlt: '',
  },
  {
    emoji: '\u2B50',
    title: 'Tu poursuis ta recherche si tu le souhaites',
    problem: null,
    solution: "Dalil Tounes peut egalement te proposer d'autres professionnels correspondant a ta recherche afin de t'aider a trouver celui qui repond le mieux a tes besoins.",
    image: null,
    imageAlt: '',
  },
];

const FLOW_STEPS = [
  'Business Card',
  'CV Business',
  'Plus de visibilite',
  'Plus de contacts',
  "Plus d'opportunites",
];

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
                  step.image ? 'lg:flex-row' : ''
                } gap-8 items-start`}
              >
                {/* Text content */}
                <div className={`flex-1 space-y-4 ${step.image ? 'lg:max-w-[50%]' : 'max-w-3xl'}`}>
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

                {/* Image */}
                {step.image && (
                  <div className="flex-1 w-full lg:max-w-[50%]">
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        width={800}
                        height={idx === 2 ? 1642 : 572}
                        className="w-full h-auto"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
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
