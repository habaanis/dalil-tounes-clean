import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Layout } from './components/Layout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Subscription = lazy(() => import('./pages/Subscription').then(m => ({ default: m.Subscription })));
const PaiementConfirmation = lazy(() => import('./pages/PaiementConfirmation'));

const Businesses = lazy(() => import('./pages/Businesses').then(m => ({ default: m.Businesses })));
const Citizens = lazy(() => import('./pages/Citizens'));
const CitizensHealth = lazy(() => import('./pages/CitizensHealth'));
const CitizensAdmin = lazy(() => import('./pages/CitizensAdmin'));
const CitizensLeisure = lazy(() => import('./pages/CitizensLeisure'));
const CitizensShops = lazy(() => import('./pages/CitizensShops'));
const CitizensServices = lazy(() => import('./pages/CitizensServices'));
const CitizensTourism = lazy(() => import('./pages/CitizensTourism'));
const CultureEvents = lazy(() => import('./pages/CultureEvents'));
const Jobs = lazy(() => import('./pages/Jobs').then(m => ({ default: m.Jobs })));
const PartnerSearch = lazy(() => import('./pages/PartnerSearch').then(m => ({ default: m.PartnerSearch })));
const BusinessEvents = lazy(() => import('./pages/BusinessEvents').then(m => ({ default: m.BusinessEvents })));
const BusinessDetail = lazy(() => import('./components/BusinessDetail').then(m => ({ default: m.BusinessDetail })));
const LegacyBusinessRedirect = lazy(() => import('./components/LegacyBusinessRedirect').then(m => ({ default: m.LegacyBusinessRedirect })));
const TransportInscription = lazy(() => import('./pages/TransportInscription'));
const Education = lazy(() => import('./pages/EducationNew'));
const EducationEventForm = lazy(() => import('./pages/EducationEventForm'));
const LocalMarketplace = lazy(() => import('./pages/LocalMarketplace'));
const AdminSourcing = lazy(() => import('./pages/AdminSourcing'));
const AroundMe = lazy(() => import('./pages/AroundMe'));
const SearchDebug = lazy(() => import('./pages/debug/SearchDebug'));
const EntrepriseDebug = lazy(() => import('./pages/debug/EntrepriseDebug'));
const I18nDebug = lazy(() => import('./pages/debug/I18nDebug'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile'));
const CandidateList = lazy(() => import('./pages/CandidateList'));
const PublishJob = lazy(() => import('./pages/PublishJob'));
const BusinessList = lazy(() => import('./pages/BusinessList'));
const PartnerDirectory = lazy(() => import('./pages/PartnerDirectory'));
const CandidateJobMatches = lazy(() => import('./pages/CandidateJobMatches'));
const JobCandidateMatches = lazy(() => import('./pages/JobCandidateMatches'));
const PartnerRequestsAdmin = lazy(() => import('./pages/PartnerRequestsAdmin'));
const AdminInscriptionsLoisirs = lazy(() => import('./pages/AdminInscriptionsLoisirs'));
const AdminAvis = lazy(() => import('./pages/AdminAvis'));
const SuperModeration = lazy(() => import('./pages/SuperModeration'));
const AdminPremium = lazy(() => import('./pages/AdminPremium'));
const AdminCommercial = lazy(() => import('./pages/AdminCommercial'));
const AdminDownloads = lazy(() => import('./pages/AdminDownloads'));
const AdminBusinessNeeds = lazy(() => import('./pages/AdminBusinessNeeds'));
const BusinessNeedsPublic = lazy(() => import('./pages/BusinessNeedsPublic'));
const Auth = lazy(() => import('./pages/Auth'));
const CandidateDashboard = lazy(() => import('./pages/CandidateDashboard'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const Concept = lazy(() => import('./pages/Concept'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));
const Contact = lazy(() => import('./pages/legal/Contact'));
const MentionsLegales = lazy(() => import('./pages/legal/MentionsLegales'));
const CGU = lazy(() => import('./pages/legal/CGU'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const SitemapPage = lazy(() => import('./pages/legal/Sitemap'));
const InfoAvis = lazy(() => import('./pages/legal/InfoAvis'));
const MetierVillePage = lazy(() => import('./pages/seo/MetierVillePage'));
const MetierSousCatVillePage = lazy(() => import('./pages/seo/MetierSousCatVillePage'));
const MetierPage = lazy(() => import('./pages/seo/MetierPage'));
const VillePage = lazy(() => import('./pages/seo/VillePage'));
const SecteurPage = lazy(() => import('./pages/seo/SecteurPage'));
const GouvernoratPage = lazy(() => import('./pages/seo/GouvernoratPage'));
const SuggestBusiness = lazy(() => import('./pages/SuggestBusiness').then(m => ({ default: m.SuggestBusiness })));
const CardPreview = lazy(() => import('./pages/CardPreview'));

// Le PageLoader réutilise LA MÊME image que le hero final. L'image est
// déjà préchargée et servie depuis le cache, donc aucune requête réseau :
// elle peint instantanément et reste le LCP stable jusqu'au mount de Home.
const PageLoader = () => (
  <div className="min-h-screen bg-white" aria-hidden="true">
    <div className="py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl border border-[#D4AF37]"
          style={{ aspectRatio: '3 / 1', minHeight: 180, background: '#1a0a18' }}
        >
          <img
            src="/images/drapeau-tunisie.webp?v=1"
            alt="Drapeau de la Tunisie"
            className="absolute inset-0 w-full h-full object-cover"
            width={1200}
            height={400}
            {...{ fetchpriority: 'high' }}
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <div className="h-6 w-56 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-4 w-80 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    <div className="px-4 pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
);

function AppRouter() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<Home />} />

              {/* Sections Citoyens */}
              <Route path="/citizens" element={<Citizens />} />
              <Route path="/citizens/health" element={<CitizensHealth />} />
              <Route path="/citizens/sante" element={<CitizensHealth />} />
              <Route path="/citizens/admin" element={<CitizensAdmin />} />
              <Route path="/citizens/leisure" element={<CitizensLeisure />} />
              <Route path="/citizens/loisirs" element={<CitizensLeisure />} />
              <Route path="/citizens/shops" element={<CitizensShops />} />
              <Route path="/citizens/magasins" element={<CitizensShops />} />
              <Route path="/citizens/services" element={<CitizensServices />} />
              <Route path="/citizens/tourism" element={<CitizensTourism />} />
              <Route path="/citizens/tourisme" element={<CitizensTourism />} />

              {/* Recherche globale */}
              <Route path="/recherche" element={<Businesses />} />

              {/* Entreprises */}
              <Route path="/businesses" element={<Businesses />} />
              <Route path="/entreprises" element={<Businesses />} />
              <Route path="/business/:id/:slug?" element={<LegacyBusinessRedirect />} />
              <Route path="/entreprises/:id/:slug?" element={<LegacyBusinessRedirect />} />
              <Route path="/entreprise/id/:id" element={<BusinessDetail />} />
              <Route path="/entreprise/:villeSlug/:slug" element={<BusinessDetail />} />
              <Route path="/entreprise/:slug" element={<BusinessDetail />} />
              <Route path="/p/:slug" element={<BusinessDetail />} />

              {/* Emplois */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/emploi" element={<Jobs />} />
              <Route path="/emplois" element={<Jobs />} />
              <Route path="/emplois/publier" element={<PublishJob />} />
              <Route path="/emplois/mes-recommandations" element={<CandidateJobMatches />} />
              <Route path="/emplois/:jobId/candidats" element={<JobCandidateMatches />} />

              {/* Education */}
              <Route path="/education" element={<Education />} />
              <Route path="/education-event-form" element={<EducationEventForm />} />

              {/* Culture & Evenements */}
              <Route path="/culture-events" element={<CultureEvents />} />
              <Route path="/evenements" element={<CultureEvents />} />

              {/* Marketplace */}
              <Route path="/marketplace" element={<LocalMarketplace />} />
              <Route path="/marche-local" element={<LocalMarketplace />} />
              <Route path="/local-marketplace" element={<LocalMarketplace />} />

              {/* Geolocalisation */}
              <Route path="/around-me" element={<AroundMe />} />
              <Route path="/autour-de-moi" element={<AroundMe />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/connexion" element={<Auth />} />
              <Route path="/inscription" element={<Auth />} />

              {/* Dashboards */}
              <Route path="/dashboard/candidat" element={<CandidateDashboard />} />
              <Route path="/dashboard/entreprise" element={<CompanyDashboard />} />

              {/* Pages publiques */}
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/abonnement" element={<Subscription />} />
              <Route path="/paiement/confirmation" element={<PaiementConfirmation />} />
              <Route path="/concept" element={<Concept />} />
              <Route path="/notre-concept" element={<Concept />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Partenaires */}
              <Route path="/partner-search" element={<PartnerSearch />} />
              <Route path="/partner-directory" element={<PartnerDirectory />} />
              <Route path="/annuaire-partenaires" element={<PartnerDirectory />} />

              {/* Autres */}
              <Route path="/business-events" element={<BusinessEvents />} />
              <Route path="/besoins-professionnels" element={<BusinessNeedsPublic />} />
              <Route path="/transport-inscription" element={<TransportInscription />} />
              <Route path="/candidate-profile" element={<CandidateProfile />} />
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/candidats" element={<CandidateList />} />
              <Route path="/business-list" element={<BusinessList />} />
              <Route path="/suggest-business" element={<SuggestBusiness />} />

              {/* Admin */}
              <Route path="/admin/partner-requests" element={<PartnerRequestsAdmin />} />
              <Route path="/admin/inscriptions-loisirs" element={<AdminInscriptionsLoisirs />} />
              <Route path="/admin/sourcing" element={<AdminSourcing />} />
              <Route path="/admin/avis" element={<AdminAvis />} />
              <Route path="/admin/super-moderation" element={<SuperModeration />} />
              <Route path="/admin/premium" element={<AdminPremium />} />
              <Route path="/admin/abonnements" element={<AdminPremium />} />
              <Route path="/admin/commercial" element={<AdminCommercial />} />
              <Route path="/commercial" element={<AdminCommercial />} />
              <Route path="/admin/downloads" element={<AdminDownloads />} />
              <Route path="/admin/business-needs" element={<AdminBusinessNeeds />} />

              {/* Debug */}
              <Route path="/card-preview" element={<CardPreview />} />
              <Route path="/searchDebug" element={<SearchDebug />} />
              <Route path="/debug/entreprise" element={<EntrepriseDebug />} />
              <Route path="/debug/i18n" element={<I18nDebug />} />

              {/* Pages légales et informations */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/cgu" element={<CGU />} />
              <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/plan-du-site" element={<SitemapPage />} />
              <Route path="/info-avis" element={<InfoAvis />} />

              {/* SEO Landing pages - villes */}
              <Route path="/ville/:villeSlug" element={<VillePage />} />

              {/* SEO Landing pages - secteurs */}
              <Route path="/secteur/:secteurSlug" element={<SecteurPage />} />

              {/* SEO Landing pages - gouvernorats */}
              <Route path="/gouvernorat/:gouvernoratSlug" element={<GouvernoratPage />} />

              {/* SEO Landing pages - métiers seuls */}
              <Route path="/metier/:metierSlug" element={<MetierPage />} />

              {/* SEO Landing pages - combinaison métier+sous-catégorie+ville (ex: /avocat-fiscaliste-sousse) et métier+ville (ex: /plombier-tunis) */}
              <Route path="/:slug" element={<MetierSousCatVillePage />} />

              {/* Anciennes routes hash - redirection */}
              <Route path="/#/*" element={<Navigate to="/" replace />} />

              {/* 404 - Redirection vers accueil */}
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default AppRouter;
