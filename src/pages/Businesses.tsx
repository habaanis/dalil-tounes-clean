import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabaseClient';
import { getHashQueryParams } from '../lib/url';
import { readParams } from '../lib/urlParams';
import { buildEntrepriseUrl } from '../lib/slugify';
import { RPC, Tables } from '../lib/dbTables';
import { FINANCE_SUBCATEGORIES } from '../lib/entrepriseCategories';
import { Search, MapPin, Phone, Mail, Building2, X, Award, ArrowRight, ShieldCheck, Clock, QrCode, Calendar } from 'lucide-react';
import { Toast } from '../components/Toast';
import BusinessNeedForm from '../components/BusinessNeedForm';
import { normalizeText, removeArabicDiacritics, extractFrenchName, cleanSearchTerm, cleanArabicField } from '../lib/textNormalization';
import { BusinessCardWithActivity, type BusinessActivity } from '../components/BusinessCardWithActivity';
import { BusinessDetail } from '../components/BusinessDetail';
import { GuideMascot } from '../components/GuideMascot';
import SearchBar from '../components/SearchBar';
import { getSubscriptionPriority } from '../lib/subscriptionHelper';
import {
  readBusinessesCache,
  prefetchBusinessesData,
  subscribeBusinessesData,
  type BusinessRow,
} from '../lib/businessesCache';
import { extractMainCategory, getAllKeywords } from '../lib/categoryDisplay';
import StructuredData from '../components/StructuredData';
import { generateCollectionPageSchema } from '../lib/structuredDataSchemas';

interface Business {
  id: string;
  name: string;
  category: string;
  subCategories?: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  a_propos?: string | null;
  services?: string;
  imageUrl?: string | null;
  logoUrl?: string | null;
  gouvernorat?: string;
  secteur?: string;
  statut_abonnement?: string | null;
  niveau_priorite_abonnement?: number | null;
  badges?: string[];
  mots_cles_recherche?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
  lien_x?: string;
  horaires_ok?: string | null;
  statut_carte?: string | null;
  slug?: string | null;
  ville?: string | null;
  note_google?: string | number | null;
  nombre_avis?: string | number | null;
  'Note Google Globale'?: string | number | null;
  'Compteur Avis Google'?: string | number | null;
  name_ar?: string | null;
  description_ar?: string | null;
}

interface BusinessesProps {
  showSuggestionForm?: boolean;
  onCloseSuggestionForm?: () => void;
  onNavigate?: (page: any) => void;
  initialSearchKeyword?: string;
  initialSearchCity?: string;
  onClearSearch?: () => void;
}

interface BusinessNeedActivityRow {
  id: string;
  type: string;
  title: string | null;
  company_id?: string | null;
  description: string | null;
  company_name: string | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string | null;
  urgency: string | null;
  city: string | null;
  governorate: string | null;
  company_slug: string | null;
  company_city: string | null;
  published_at: string | null;
  created_at: string | null;
}

const ENTREPRISE_SELECT_FIELDS = 'id, nom, sous_categories_texte, sous_categories_clean, categorie, gouvernorat, ville, adresse, telephone, email, site_web, description, a_propos, services, image_url, logo_url, statut_abonnement, "mots cles recherche", "Lien Instagram", "lien facebook", "Lien TikTok", "Lien LinkedIn", "Lien YouTube", lien_x, horaires_ok, statut_carte, "Note Google Globale", "Compteur Avis Google", name_ar, description_ar, slug';

const PUBLIC_BUSINESS_NEED_ACTIVITY_TYPES = new Set([
  'supplier_search',
  'service_provider_search',
  'equipment_purchase',
  'equipment_sale',
  'liquidation',
  'partnership',
  'business_opportunity',
  'other',
]);

const DEMO_LOGO_URL = 'https://ik.imagekit.io/gfdpqvshw/Design_Assets_Dalil_Tounes/logos/logo_dalil_tounes_sceau_luxe.png?updatedAt=1773327267816&tr=w-140,h-140,f-auto,q-85';

const DEMO_BUSINESS = {
  id: 'demo-professionnel-dalil',
  name: 'Fiche Professionnelle Démo',
  nom: 'Fiche Professionnelle Démo',
  categorie: 'Entreprise tunisienne',
  category: 'Entreprise tunisienne',
  ville: 'Tunisie',
  city: 'Tunisie',
  gouvernorat: 'Tunisie',
  adresse: 'Adresse de démonstration',
  description: "Une fiche complète permet de présenter l'activité, les services, les horaires, les photos et les moyens de contact sur un seul espace clair.",
  a_propos: "Cette démonstration montre comment une entreprise peut rassembler ses informations utiles dans un CV Business clair et rassurant.",
  telephone: '+216 XX XXX XXX',
  phone: '+216 XX XXX XXX',
  whatsapp: '+216 XX XXX XXX',
  email: 'contact@dalil-tounes.com',
  site_web: 'https://dalil-tounes.com',
  website: 'https://dalil-tounes.com',
  services: 'Présentation, coordonnées, horaires, photos, réservation, QR Code',
  statut_abonnement: 'premium',
  niveau_priorite_abonnement: 3,
  logoUrl: DEMO_LOGO_URL,
  logo_url: DEMO_LOGO_URL,
  imageUrl: null,
  image_url: null,
  horaires_ok: 'Lundi : 08:00–18:00\nMardi : 08:00–18:00\nMercredi : 08:00–18:00\nJeudi : 08:00–18:00\nVendredi : 08:00–18:00\nSamedi : 09:00–13:00\nDimanche : Fermé',
  note_google: null,
  nombre_avis: null,
  score_avis: null,
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

const PROFESSIONAL_FAQ = [
  {
    question: 'Est-ce que Dalil remplace Google Business ?',
    answer: "Non. Dalil Tounes ne remplace pas Google Business, Facebook, Instagram, LinkedIn ou votre site web. La plateforme les complète en réunissant les informations utiles dans une fiche claire pensée pour la Tunisie.",
  },
  {
    question: 'Puis-je conserver mon site web ?',
    answer: "Oui. Votre site web reste important. La fiche Dalil Tounes peut au contraire aider vos visiteurs à retrouver votre site officiel, vos réseaux sociaux, vos coordonnées et vos informations pratiques.",
  },
  {
    question: 'Comment mettre ma fiche à jour ?',
    answer: "L'objectif est de permettre aux entreprises de vérifier, compléter et mettre à jour leurs informations afin que la fiche reste fiable pour les futurs clients.",
  },
  {
    question: 'Pourquoi créer une fiche professionnelle ?',
    answer: "Parce qu'une fiche complète rassure les visiteurs. Elle montre votre activité, vos informations utiles, vos horaires, vos moyens de contact et facilite le premier échange.",
  },
  {
    question: 'Les artisans peuvent-ils rejoindre Dalil Tounes ?',
    answer: "Oui. La page s'adresse aussi aux artisans, indépendants, commerçants, professions libérales, PME et entreprises qui souhaitent être trouvés plus facilement.",
  },
  {
    question: 'Les commerçants sont-ils concernés ?',
    answer: "Oui. Un commerce peut utiliser sa fiche pour présenter ses horaires, sa localisation, ses photos, ses réseaux sociaux, son site web et ses moyens de contact.",
  },
];

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-3">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-[#4A1D43] leading-tight">{title}</h2>
      {children && <div className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed space-y-3">{children}</div>}
    </div>
  );
}

function DemoCVBusinessPreview() {
  return (
    <div className="relative mx-auto w-fit max-w-full rounded-2xl border border-[#D4AF37]/30 bg-[#F8F4EA] p-2 shadow-[0_16px_42px_rgba(74,29,67,0.12)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(212,175,55,0.16),transparent_26%)]" />
      <div className="relative mx-auto max-h-[430px] overflow-hidden rounded-xl">
        <div style={{ width: '440px', maxWidth: '100%', zoom: 0.58 } as any}>
          <BusinessDetail preview business={DEMO_BUSINESS} />
        </div>
      </div>
    </div>
  );
}

function DemoCVBusinessLargePreview() {
  return (
    <div className="mx-auto w-fit max-w-full overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-[#F8F4EA] p-2 shadow-sm">
      <div className="max-h-[72vh] overflow-y-auto overflow-x-hidden rounded-xl">
        <div style={{ width: '420px', maxWidth: '100%', zoom: 0.88 } as any}>
          <BusinessDetail preview business={DEMO_BUSINESS} />
        </div>
      </div>
    </div>
  );
}

function FeaturePill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white px-3 py-1.5 text-xs font-semibold text-[#4A1D43] shadow-sm">
      <Icon className="h-3.5 w-3.5 text-[#D4AF37]" />
      {label}
    </span>
  );
}

function normalizeActivityCompanyName(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getActivityCompanyIdKey(value: string | null | undefined): string {
  const normalized = String(value || '').trim();
  return normalized ? `id:${normalized}` : '';
}

function getActivityCompanySlugKey(slug: string | null | undefined, city: string | null | undefined): string {
  const normalizedSlug = normalizeActivityCompanyName(slug);
  const normalizedCity = normalizeActivityCompanyName(city);
  return normalizedSlug && normalizedCity ? `slug:${normalizedSlug}|city:${normalizedCity}` : '';
}

function getActivityCompanyNameKey(value: string | null | undefined): string {
  const normalized = normalizeActivityCompanyName(value);
  return normalized ? `name:${normalized}` : '';
}

function getBusinessActivityKeys(business: Business): string[] {
  return [
    getActivityCompanyIdKey(business.id),
    getActivityCompanySlugKey(business.slug, business.ville || business.city),
    getActivityCompanyNameKey(business.name),
  ].filter(Boolean);
}

function getActivitiesForBusiness(activitiesByKey: Record<string, BusinessActivity[]>, business: Business): BusinessActivity[] {
  for (const key of getBusinessActivityKeys(business)) {
    const activities = activitiesByKey[key];
    if (activities?.length) return activities;
  }

  return [];
}

function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function joinUnique(values: string[]): string {
  return Array.from(new Set(values)).join(', ');
}

function getSubCategoryLabel(item: Record<string, unknown>): string {
  return joinUnique([
    ...toTextList(item.sous_categories_texte),
    ...toTextList(item.sous_categories_clean),
  ]);
}

function getCategoryLabel(item: Record<string, unknown>): string {
  return getSubCategoryLabel(item) || joinUnique(toTextList(item.categorie));
}

function getSectorLabel(item: Record<string, unknown>): string {
  return joinUnique([
    ...toTextList(item.categorie),
    ...toTextList(item.sous_categories_texte),
    ...toTextList(item.sous_categories_clean),
  ]);
}

function isCertifiedDalilTounes(statut_carte: string | null | undefined): boolean {
  if (!statut_carte) return false;
  const upper = statut_carte.toUpperCase();
  return upper.includes('CERTIF') && !upper.includes('NON CERTIF');
}

function isPaidSubscription(statut_abonnement: string | null | undefined): boolean {
  if (!statut_abonnement) return false;
  const s = statut_abonnement.toLowerCase().trim();
  return s.includes('artisan') || s.includes('premium') || s.includes('elite') || s.includes('custom') || s.includes('personnalis');
}

function hasActivity(business: Record<string, any>): boolean {
  return !!(business.imageUrl || business.logoUrl || (business.description && business.description.trim()) || business.horaires_ok);
}

function getBusinessSortScore(business: Record<string, any>): number {
  const certified = isCertifiedDalilTounes(business.statut_carte);
  const premium = isPaidSubscription(business.statut_abonnement);
  if (certified && premium) return 5;
  if (certified) return 4;
  if (premium) return 3;
  if (hasActivity(business)) return 2;
  return 1;
}

export const Businesses = ({
  showSuggestionForm = false,
  onCloseSuggestionForm,
  onNavigate,
  initialSearchKeyword = '',
  initialSearchCity = '',
  onClearSearch
}: BusinessesProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const t = useTranslation(language);
  const _initCache = readBusinessesCache();
  const [businesses, setBusinesses] = useState<Business[]>((_initCache?.businesses as unknown as Business[]) ?? []);
  const [loading, setLoading] = useState(_initCache === null);
  const [searchTerm, setSearchTerm] = useState(initialSearchKeyword || '');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialSearchCity || '');
  const [pageCategorie, setPageCategorie] = useState<string | null>(null);
  const [showSuggestForm, setShowSuggestForm] = useState(showSuggestionForm);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [preselectedBusinessId, setPreselectedBusinessId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(false);
  const pendingSearchRef = useRef(false);
  const [premiumJobs, setPremiumJobs] = useState<any[]>(_initCache?.premiumJobs ?? []);
  const [loadingPremiumJobs, setLoadingPremiumJobs] = useState(false);
  const [filterPremium, setFilterPremium] = useState(false);
  const [filterCommerceLocal, setFilterCommerceLocal] = useState(false);
  const [filterStatutCarte, setFilterStatutCarte] = useState<'' | 'certifie' | 'non_certifie'>('');
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, label: string, count: number}>>([]);
  const [selectedChipCategories, setSelectedChipCategories] = useState<string[]>([]);
  const [businessActivitiesByCompany, setBusinessActivitiesByCompany] = useState<Record<string, BusinessActivity[]>>({});

  const resultsRef = useRef<HTMLDivElement>(null);

  // Protection anti-blocage : forcer arrêt du loading après 5s
  useEffect(() => {
    if (!loading && !searching) return;

    const timeout = setTimeout(() => {
      if (loading || searching) {
        console.warn('⚠️ [TIMEOUT] Loading bloqué > 5s, déblocage forcé');
        setLoading(false);
        setSearching(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [loading, searching]);

  const hasActiveSearch = !!selectedBusinessId || !!searchTerm || !!selectedCity || !!selectedCategory || !!pageCategorie || filterPremium || filterCommerceLocal || !!filterStatutCarte;

  useEffect(() => {
    if (!showDemoModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowDemoModal(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDemoModal]);

  useEffect(() => {
    let active = true;

    async function fetchBusinessNeedActivities() {
      const activitySelectWithCompanyId = 'id, type, title, company_id, description, company_name, budget_min, budget_max, currency, urgency, city, governorate, company_slug, company_city, published_at, created_at';
      const activitySelectPublic = 'id, type, title, description, company_name, budget_min, budget_max, currency, urgency, city, governorate, company_slug, company_city, published_at, created_at';
      const buildQuery = (selectFields: string) => supabase
        .from('business_needs')
        .select(selectFields)
        .eq('status', 'published')
        .eq('moderation_status', 'approved')
        .eq('visibility', 'public')
        .is('deleted_at', null)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(500);

      let { data, error } = await buildQuery(activitySelectWithCompanyId);

      if (error) {
        const fallbackResponse = await buildQuery(activitySelectPublic);
        data = fallbackResponse.data;
        error = fallbackResponse.error;
      }

      if (!active) return;

      if (error) {
        console.warn('[Businesses] Impossible de charger les activites business_needs:', error);
        setBusinessActivitiesByCompany({});
        return;
      }

      const grouped = ((data || []) as BusinessNeedActivityRow[]).reduce<Record<string, BusinessActivity[]>>((acc, row) => {
        if (!row.id || !row.type || !PUBLIC_BUSINESS_NEED_ACTIVITY_TYPES.has(row.type)) return acc;

        const activity: BusinessActivity = {
          id: row.id,
          type: row.type,
          title: row.title,
          companyId: row.company_id,
          description: row.description,
          budgetMin: row.budget_min,
          budgetMax: row.budget_max,
          currency: row.currency,
          urgency: row.urgency,
          city: row.city,
          governorate: row.governorate,
          companySlug: row.company_slug,
          companyCity: row.company_city,
          publishedAt: row.published_at || row.created_at,
        };

        const keys = [
          getActivityCompanyIdKey(row.company_id),
          getActivityCompanySlugKey(row.company_slug, row.company_city),
          getActivityCompanyNameKey(row.company_name),
        ].filter(Boolean);

        keys.forEach((key) => {
          acc[key] = acc[key] || [];
          acc[key].push(activity);
        });

        return acc;
      }, {});

      setBusinessActivitiesByCompany(grouped);
    }

    fetchBusinessNeedActivities();

    return () => {
      active = false;
    };
  }, []);

  // Extraire les catégories disponibles depuis les résultats
  useEffect(() => {
    if (businesses.length === 0 || !searchTerm) {
      setAvailableCategories([]);
      return;
    }

    const categoryCount = new Map<string, number>();

    businesses.forEach((biz) => {
      const categories = [
        biz.category,
        biz.secteur,
        ...(biz.subCategories?.split(',').map(s => s.trim()) || [])
      ].filter(Boolean);

      categories.forEach((cat) => {
        if (cat && cat.trim()) {
          const normalized = cat.trim();
          categoryCount.set(normalized, (categoryCount.get(normalized) || 0) + 1);
        }
      });
    });

    const chips = Array.from(categoryCount.entries())
      .map(([label, count]) => ({ id: label, label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setAvailableCategories(chips);
  }, [businesses, searchTerm]);

  // Handler pour les chips
  const handleToggleChipCategory = (categoryId: string) => {
    setSelectedChipCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleClearAllChips = () => {
    setSelectedChipCategories([]);
  };

  // Filtrer les résultats selon les chips sélectionnés
  const chipFilteredBusinesses = selectedChipCategories.length > 0
    ? businesses.filter((biz) => {
        const bizCategories = [
          biz.category,
          biz.secteur,
          ...(biz.subCategories?.split(',').map(s => s.trim()) || [])
        ].filter(Boolean).map(c => c.trim());

        return selectedChipCategories.some((chipCat) =>
          bizCategories.some((bizCat) => bizCat === chipCat)
        );
      })
    : businesses;

  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    phone: '',
    email: '',
    message: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    setShowSuggestForm(showSuggestionForm);
  }, [showSuggestionForm]);

  useEffect(() => {
    const loadUrlParams = () => {
      console.log('═══════════════════════════════════════');
      console.log('🌐 [DEBUG URL] Chargement des paramètres URL...');

      const params = readParams();
      console.log('[DEBUG URL] readParams() retourne:', params);

      const urlQ = params.q || initialSearchKeyword || '';
      const urlVille = params.ville || initialSearchCity || '';
      const urlCategorie = params.categorie || '';
      const urlSelectedId = params.selected_id || '';

      setSelectedBusinessId(null);

      const hashParams = getHashQueryParams();
      const pageCat = hashParams.get('page_categorie');
      const premiumParam = hashParams.get('premium');
      const commerceLocalParam = hashParams.get('commerce_local');

      // Détection de l'ancre #suggest-business pour ouvrir le formulaire de suggestion
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      if (currentPath.includes('suggest-business')) {
        setShowSuggestForm(true);
      }

      console.log('[DEBUG URL] Paramètres extraits:', {
        urlQ,
        urlVille,
        urlCategorie,
        urlSelectedId,
        pageCat,
        premiumParam,
        commerceLocalParam,
        suggestFormTrigger: currentPath.includes('suggest-business')
      });
      console.log('═══════════════════════════════════════\n');

      // Si les valeurs URL sont identiques à l'état courant (soumission répétée du même terme),
      // le useEffect[searchTerm] ne se déclenchera pas — on force performSearch directement.
      const urlMatchesCurrent =
        urlQ === searchTerm &&
        urlVille === selectedCity &&
        urlCategorie === selectedCategory;

      if (urlMatchesCurrent && (urlQ || urlVille || urlCategorie)) {
        performSearch();
        return;
      }

      if (urlQ !== searchTerm) {
        setSearchTerm(urlQ);
      }
      if (urlVille !== selectedCity) {
        setSelectedCity(urlVille);
      }
      if (urlCategorie !== selectedCategory) {
        setSelectedCategory(urlCategorie);
      }
      const newPreselected = urlSelectedId || null;
      if (newPreselected !== preselectedBusinessId) {
        console.log(`[DEBUG] Mise à jour preselectedBusinessId: "${preselectedBusinessId}" → "${newPreselected}"`);
        setPreselectedBusinessId(newPreselected);
        setSelectedBusinessId(newPreselected);
      }
      const newPremium = premiumParam === 'true';
      if (newPremium !== filterPremium) {
        console.log(`[DEBUG] Mise à jour filterPremium: ${filterPremium} → ${newPremium}`);
        setFilterPremium(newPremium);
      }
      const newCommerceLocal = commerceLocalParam === 'true';
      if (newCommerceLocal !== filterCommerceLocal) {
        console.log(`[DEBUG] Mise à jour filterCommerceLocal: ${filterCommerceLocal} → ${newCommerceLocal}`);
        setFilterCommerceLocal(newCommerceLocal);
      }

      const rawStatutCarte = params.statut_carte || '';
      const newStatutCarte = (rawStatutCarte === 'certifie' || rawStatutCarte === 'non_certifie') ? rawStatutCarte : '';
      if (newStatutCarte !== filterStatutCarte) {
        setFilterStatutCarte(newStatutCarte);
      }

      if (pageCat && pageCat !== pageCategorie) {
        console.log(`[DEBUG] Mise à jour pageCategorie: "${pageCategorie}" → "${pageCat}"`);
        setPageCategorie(pageCat);
      }
    };

    loadUrlParams();

    const handleHashChange = () => {
      console.log('[DEBUG] Hash changed, reloading params');
      loadUrlParams();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialSearchKeyword, initialSearchCity, location]);

  // Abonnement au cache — reçoit les données dès qu'elles arrivent (premier chargement ou invalidation)
  useEffect(() => {
    const unsub = subscribeBusinessesData((result) => {
      setBusinesses(result.businesses as unknown as Business[]);
      setPremiumJobs(result.premiumJobs);
      setLoading(false);
      setLoadingPremiumJobs(false);
    });

    const cached = readBusinessesCache();
    if (!cached?.fresh) {
      prefetchBusinessesData().then((result) => {
        setBusinesses(result.businesses as unknown as Business[]);
        setPremiumJobs(result.premiumJobs);
        setLoading(false);
        setLoadingPremiumJobs(false);
      }).catch(() => {
        setLoading(false);
        setLoadingPremiumJobs(false);
      });
    }

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPremiumJobs = async () => {
    try {
      setLoadingPremiumJobs(true);
      const { data, error } = await supabase
        .from(Tables.JOB_POSTINGS)
        .select('*')
        .eq('statut', 'active')
        .eq('est_premium', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPremiumJobs(data || []);
    } catch (error) {
      console.error('Error fetching premium jobs:', error);
    } finally {
      setLoadingPremiumJobs(false);
    }
  };

  // Garde anti-boucle : stocker les dernières valeurs
  const prevSearchRef = useRef({ selectedBusinessId: null as string | null, searchTerm: '', selectedCity: '', selectedCategory: '', pageCategorie: null as string | null, filterPremium: false, filterCommerceLocal: false, filterStatutCarte: '' as '' | 'certifie' | 'non_certifie' });
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Au premier render, déclencher la recherche appropriée
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('[DEBUG INIT] Premier mount, déclenchement recherche initiale');
      // Si aucun filtre, on charge toutes les entreprises
      if (!selectedBusinessId && !searchTerm && !selectedCity && !selectedCategory && !pageCategorie && !filterPremium && !filterCommerceLocal) {
        // Cache frais → affichage immédiat, pas de requête réseau
        const cached = readBusinessesCache();
        if (cached?.fresh) {
          console.log('[DEBUG INIT] Cache frais → skip fetchBusinesses()');
          setLoading(false);
        } else {
          console.log('[DEBUG INIT] Aucun filtre → fetchBusinesses()');
          fetchBusinesses();
        }
      } else {
        // Si des filtres sont présents (depuis URL), on lance la recherche filtrée
        console.log('[DEBUG INIT] Filtres présents → performSearch()');
        performSearch();
      }
      return;
    }

    // Ne déclencher que si les valeurs ont VRAIMENT changé
    const hasRealChange =
      prevSearchRef.current.searchTerm !== searchTerm ||
      prevSearchRef.current.selectedBusinessId !== selectedBusinessId ||
      prevSearchRef.current.selectedCity !== selectedCity ||
      prevSearchRef.current.selectedCategory !== selectedCategory ||
      prevSearchRef.current.pageCategorie !== pageCategorie ||
      prevSearchRef.current.filterPremium !== filterPremium ||
      prevSearchRef.current.filterCommerceLocal !== filterCommerceLocal ||
      prevSearchRef.current.filterStatutCarte !== filterStatutCarte;

    if (!hasRealChange) {
      console.log('⏭️ [SKIP] Aucun changement réel détecté, skip');
      return;
    }

    console.log('🔄 [DEBUG useEffect] Changement détecté:', {
      searchTerm,
      selectedBusinessId,
      selectedCity,
      selectedCategory,
      pageCategorie,
      filterPremium,
      filterCommerceLocal
    });

    // Mettre à jour les références
    prevSearchRef.current = { selectedBusinessId, searchTerm, selectedCity, selectedCategory, pageCategorie, filterPremium, filterCommerceLocal, filterStatutCarte };

    pendingSearchRef.current = true;
    setPendingSearch(true);
    const delayDebounceFn = setTimeout(() => {
      pendingSearchRef.current = false;
      setPendingSearch(false);
      if (selectedBusinessId || searchTerm.length >= 1 || selectedCity || selectedCategory || filterPremium || filterCommerceLocal || filterStatutCarte) {
        console.log('➡️ [DEBUG] Déclenchement de performSearch()');
        performSearch();
      } else {
        console.log('➡️ [DEBUG] Déclenchement de fetchBusinesses()');
        fetchBusinesses();
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      pendingSearchRef.current = false;
      setPendingSearch(false);
    };
  }, [selectedBusinessId, searchTerm, selectedCity, selectedCategory, pageCategorie, filterPremium, filterCommerceLocal, filterStatutCarte]);

  useEffect(() => {
    if (preselectedBusinessId && businesses.length > 0) {
      const found = businesses.find((b) => b.id === preselectedBusinessId);
      if (found) {
        setSelectedBusinessId(found.id);
        setSearchTerm(found.name || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedBusinessId, businesses]);

  const fetchBusinesses = async () => {
    console.log('═══════════════════════════════════════');
    console.log('🔍 [DEBUG fetchBusinesses] Démarrage...');
    console.log('═══════════════════════════════════════');

    setLoading(true);

    // Protection : forcer arrêt du loading après 10s max
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ [PROTECTION] fetchBusinesses timeout atteint, déblocage forcé');
      setLoading(false);
    }, 10000);

    try {
      let query = supabase
        .from(Tables.ENTREPRISE)
        .select(ENTREPRISE_SELECT_FIELDS)
        .not('nom', 'is', null)
        .neq('nom', '')
        .order('nom', { ascending: true })
        .limit(10);

      if (pageCategorie) {
        console.log(`[DEBUG] Filtre pageCategorie appliqué: "${pageCategorie}"`);
        query = query.or(`sous_categories_texte.ilike.%${pageCategorie}%,sous_categories_clean.ilike.%${pageCategorie}%`);
      }

      if (filterStatutCarte === 'certifie') {
        query = (query as any).ilike('statut_carte', '%CERTIF%').not('statut_carte', 'ilike', '%NON CERTIF%');
      } else if (filterStatutCarte === 'non_certifie') {
        query = (query as any).ilike('statut_carte', '%NON CERTIF%');
      }

      console.log('[DEBUG] Exécution de la requête Supabase...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ [ERREUR CRITIQUE] Échec de la requête Supabase:');
        console.error('Code erreur:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        setBusinesses([]);
        return;
      }

      console.log(`[DEBUG] ✅ Données reçues: ${data?.length || 0} entreprises`);

      if (data && data.length > 0) {
        console.log('[DEBUG] Colonnes disponibles dans data[0]:', Object.keys(data[0]));
        console.log('[DEBUG] Exemple première entreprise:', {
          id: data[0].id,
          nom: data[0].nom,
          sous_categories: data[0].sous_categories_texte,
          categorie: data[0].categorie,
          services: data[0].services?.substring(0, 50) + '...' || 'NULL',
          mots_cles_recherche: data[0]['mots cles recherche']?.substring(0, 100) + '...' || 'NULL',
          statut_abonnement: data[0].statut_abonnement,
          gouvernorat: data[0].gouvernorat,
          ville: data[0].ville
        });
      }

      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        name: extractFrenchName(item.nom),
        category: getCategoryLabel(item),
        subCategories: getSubCategoryLabel(item),
        gouvernorat: item.gouvernorat || '',
        secteur: getSectorLabel(item),
        city: item.ville || '',
        ville: item.ville || '',
        slug: item.slug || null,
        address: item.adresse || '',
        phone: item.telephone || '',
        email: item.email || '',
        website: item.site_web || '',
        description: item.description || '',
        a_propos: item.a_propos || null,
        services: item.services || '',
        imageUrl: item.image_url || null,
        logoUrl: item.logo_url || null,
        statut_abonnement: item.statut_abonnement || null,
        niveau_priorite_abonnement: null,
        badges: [],
        mots_cles_recherche: item['mots cles recherche'] || '',
        instagram: item['Lien Instagram'] || '',
        facebook: item['lien facebook'] || '',
        tiktok: item['Lien TikTok'] || '',
        linkedin: item['Lien LinkedIn'] || '',
        youtube: item['Lien YouTube'] || '',
        lien_x: item.lien_x || '',
        horaires_ok: item.horaires_ok || null,
        statut_carte: item.statut_carte || null,
        note_google: item['Note Google Globale'] ?? null,
        nombre_avis: item['Compteur Avis Google'] ?? null,
        'Note Google Globale': item['Note Google Globale'] ?? null,
        'Compteur Avis Google': item['Compteur Avis Google'] ?? null,
        name_ar: item.name_ar ? cleanArabicField(item.name_ar) : null,
        description_ar: item.description_ar ? cleanArabicField(item.description_ar) : null,
      }));

      mappedData.sort((a, b) => {
        const scoreA = getBusinessSortScore(a);
        const scoreB = getBusinessSortScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        const priorityA = getSubscriptionPriority(a.statut_abonnement);
        const priorityB = getSubscriptionPriority(b.statut_abonnement);
        return priorityB - priorityA;
      });

      console.log(`[DEBUG] ✅ Mapping terminé: ${mappedData.length} entreprises`);
      console.log('═══════════════════════════════════════\n');

      setLoading(false);
      setBusinesses(mappedData);
    } catch (error) {
      console.error('❌ [ERROR] fetchBusinesses:', error);
      setLoading(false);
      setBusinesses([]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const performSearch = async () => {
    console.log('═══════════════════════════════════════');
    console.log('🔍 [DEBUG performSearch] Démarrage...');
    console.log('Entreprise sélectionnée:', selectedBusinessId);
    console.log('Terme recherché:', searchTerm);
    console.log('Ville sélectionnée:', selectedCity);
    console.log('Catégorie sélectionnée:', selectedCategory);
    console.log('Filter Premium:', filterPremium);
    console.log('Filter Commerce Local:', filterCommerceLocal);
    console.log('═══════════════════════════════════════');

    if (!selectedBusinessId && searchTerm.length === 0 && !selectedCity && !selectedCategory && !filterPremium && !filterCommerceLocal) {
      console.log('[DEBUG] Aucun filtre actif, appel de fetchBusinesses()');
      fetchBusinesses();
      return;
    }

    setSearching(true);

    // Protection : forcer arrêt du searching après 10s max
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ [PROTECTION] performSearch timeout atteint, déblocage forcé');
      setSearching(false);
    }, 10000);
    try {
      let query = supabase
        .from(Tables.ENTREPRISE)
        .select(ENTREPRISE_SELECT_FIELDS)
        .not('nom', 'is', null)
        .neq('nom', '')
        .order('nom', { ascending: true })
        .limit(30);

      if (selectedBusinessId) {
        console.log(`[DEBUG] Filtre ID entreprise: "${selectedBusinessId}"`);
        query = query.eq('id', selectedBusinessId);
      } else if (searchTerm && cleanSearchTerm(searchTerm).length >= 2) {
        // Pour l'arabe : ne pas normaliser (removeArabicDiacritics altère les caractères)
        // Pour le latin : nettoyer seulement les guillemets parasites
        const cleaned = cleanSearchTerm(searchTerm);
        const searchPattern = `%${cleaned}%`;
        console.log(`[DEBUG] Filtre Recherche: "${searchTerm}" → nettoyé: "${cleaned}" (pattern: ${searchPattern})`);
        // Colonnes avec espaces ou accents passées via .filter() séparés pour éviter
        // les bugs de parsing de la syntaxe .or() string avec noms de colonnes complexes
        query = query.or(
          [
            `nom.ilike.${searchPattern}`,
            `name_ar.ilike.${searchPattern}`,
            `description.ilike.${searchPattern}`,
            `description_ar.ilike.${searchPattern}`,
            `ville.ilike.${searchPattern}`,
            `gouvernorat.ilike.${searchPattern}`,
            `sous_categories_texte.ilike.${searchPattern}`,
            `sous_categories_clean.ilike.${searchPattern}`,
          ].join(',')
        );
      }

      if (!selectedBusinessId && selectedCity) {
        console.log(`[DEBUG] Filtre Gouvernorat: "${selectedCity}"`);
        query = query.eq('gouvernorat', selectedCity);
      }

      if (!selectedBusinessId && selectedCategory === 'finance') {
        console.log(`[DEBUG] Filtre Finance avec sous_categories:`, FINANCE_SUBCATEGORIES);
        query = query.or(FINANCE_SUBCATEGORIES.map(c => `sous_categories_texte.ilike.%${c}%`).join(','));
      } else if (!selectedBusinessId && selectedCategory) {
        console.log(`[DEBUG] Filtre Catégorie: "${selectedCategory}"`);
        query = query.ilike('sous_categories_texte', `%${selectedCategory}%`);
      }

      if (!selectedBusinessId && filterPremium) {
        console.log(`[DEBUG] Filtre Premium activé (Elite/Premium/Artisan)`);
        query = query.or('statut_abonnement.ilike.*elite*,statut_abonnement.ilike.*premium*,statut_abonnement.ilike.*artisan*');
      }

      if (!selectedBusinessId && filterCommerceLocal) {
        console.log(`[DEBUG] Filtre Commerce Local activé`);
        query = query.eq('"page commerce local"', true);
      }

      if (!selectedBusinessId && filterStatutCarte === 'certifie') {
        query = (query as any).ilike('statut_carte', '%CERTIF%').not('statut_carte', 'ilike', '%NON CERTIF%');
      } else if (!selectedBusinessId && filterStatutCarte === 'non_certifie') {
        query = (query as any).ilike('statut_carte', '%NON CERTIF%');
      }

      console.log('[DEBUG] Exécution de la requête Supabase...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ [ERREUR CRITIQUE RECHERCHE] Échec de la requête Supabase:');
        console.error('Code erreur:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        console.error('Filtres appliqués:', {
          searchTerm,
          selectedCity,
          selectedCategory,
          filterPremium,
          selectedBusinessId,
        });
        throw error;
      }

      console.log(`[DEBUG] ✅ Données reçues: ${data?.length || 0} entreprises`);

      if (data && data.length > 0) {
        console.log('[DEBUG] Colonnes disponibles dans data[0]:', Object.keys(data[0]));
        console.log('[DEBUG] Exemple première entreprise:', {
          id: data[0].id,
          nom: data[0].nom,
          services: data[0].services?.substring(0, 50) + '...' || 'NULL',
          mots_cles_recherche: data[0]['mots cles recherche']?.substring(0, 100) + '...' || 'NULL',
          sous_categories: data[0].sous_categories_texte,
          categorie: data[0].categorie,
          statut_abonnement: data[0].statut_abonnement,
          gouvernorat: data[0].gouvernorat
        });
        console.log('[DEBUG] item.nom brut (toutes entreprises):', (data as any[]).map((d: any) => d.nom));
      }

      let mappedData = (data || []).map((item: any) => ({
        id: item.id,
        name: extractFrenchName(item.nom),
        category: getCategoryLabel(item),
        subCategories: getSubCategoryLabel(item),
        gouvernorat: item.gouvernorat || '',
        secteur: getSectorLabel(item),
        city: item.ville || '',
        ville: item.ville || '',
        slug: item.slug || null,
        address: item.adresse || '',
        phone: item.telephone || '',
        email: item.email || '',
        website: item.site_web || '',
        description: item.description || '',
        a_propos: item.a_propos || null,
        services: item.services || '',
        imageUrl: item.image_url || null,
        logoUrl: item.logo_url || null,
        statut_abonnement: item.statut_abonnement || null,
        niveau_priorite_abonnement: null,
        badges: [],
        mots_cles_recherche: item['mots cles recherche'] || '',
        instagram: item['Lien Instagram'] || '',
        facebook: item['lien facebook'] || '',
        tiktok: item['Lien TikTok'] || '',
        linkedin: item['Lien LinkedIn'] || '',
        youtube: item['Lien YouTube'] || '',
        horaires_ok: item.horaires_ok || null,
        statut_carte: item.statut_carte || null,
        note_google: item['Note Google Globale'] ?? null,
        nombre_avis: item['Compteur Avis Google'] ?? null,
        'Note Google Globale': item['Note Google Globale'] ?? null,
        'Compteur Avis Google': item['Compteur Avis Google'] ?? null,
        name_ar: item.name_ar ? cleanArabicField(item.name_ar) : null,
        description_ar: item.description_ar ? cleanArabicField(item.description_ar) : null,
      }));

      console.log(`[DEBUG] Mapping terminé: ${mappedData.length} entreprises`);

      if (!selectedBusinessId && searchTerm && searchTerm.length > 0) {
        const normalizedSearchTerm = normalizeText(searchTerm);
        console.log(`\n🔎 [Recherche Multi-colonnes] Terme recherché: "${searchTerm}"`);
        console.log(`🔎 [Recherche Multi-colonnes] Terme normalisé: "${normalizedSearchTerm}"`);
        console.log(`📊 [Debug] Nombre total avant filtre: ${mappedData.length}`);

        if (mappedData.length > 0) {
          console.log(`📋 [Debug] Exemple entreprise:`, {
            nom: mappedData[0].name,
            badges: mappedData[0].badges,
            mots_cles_recherche: mappedData[0].mots_cles_recherche?.substring(0, 100) || 'NULL',
            sous_categories: mappedData[0].category
          });
        }

        // Le filtre Supabase a déjà retourné les bons résultats via ILIKE.
        // Ce filtre JS est un garde-fou pour les colonnes non couvertes par le .or() Supabase.
        // IMPORTANT : pour l'arabe, on compare en lowercase sans normalisation agressive.
        const lowerTerm = normalizedSearchTerm.toLowerCase();
        mappedData = mappedData.filter((business) => {
          const matchNom = normalizeText(business.name || '').includes(lowerTerm);
          const matchNameAr = (business.name_ar || '').toLowerCase().includes(lowerTerm)
            || (business.name_ar || '').includes(searchTerm.trim());
          const matchDescAr = (business.description_ar || '').toLowerCase().includes(lowerTerm)
            || (business.description_ar || '').includes(searchTerm.trim());
          const matchSecteur = normalizeText(business.secteur || '').includes(lowerTerm);
          const matchMotsCles = normalizeText(business.mots_cles_recherche || '').includes(lowerTerm);
          const matchCategory = normalizeText(business.category || '').includes(lowerTerm);
          const matchServices = normalizeText(business.services || '').includes(lowerTerm);
          const matchVille = normalizeText(business.city || '').includes(lowerTerm);
          const matchGouvernorat = normalizeText(business.gouvernorat || '').includes(lowerTerm);

          return matchNom || matchNameAr || matchDescAr || matchSecteur
            || matchMotsCles || matchCategory || matchServices
            || matchVille || matchGouvernorat;
        });

        console.log(`\n[Recherche Multi-colonnes] ✅ Résultats filtrés: ${mappedData.length}`);
      }

      // Trier par priorité (Certifié+Premium > Certifié > Premium > Activité > Autres)
      mappedData.sort((a, b) => {
        const scoreA = getBusinessSortScore(a);
        const scoreB = getBusinessSortScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        const priorityA = getSubscriptionPriority(a.statut_abonnement);
        const priorityB = getSubscriptionPriority(b.statut_abonnement);
        return priorityB - priorityA;
      });

      console.log('═══════════════════════════════════════\n');

      // Mettre à jour businesses et searching dans le même batch React pour éviter
      // le flash "aucun résultat" entre les deux updates
      setSearching(false);
      setBusinesses(mappedData);

      setTimeout(() => {
        const resultsElement = resultsRef.current;
        if (!resultsElement) return;

        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (!isDesktop) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        const rect = resultsElement.getBoundingClientRect();
        const cardHeight = Math.min(rect.height, 400);
        const targetTop = rect.top + window.scrollY - (window.innerHeight / 2) + (cardHeight / 2);
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('❌ [ERROR] performSearch:', error);
      setSearching(false);
      setBusinesses([]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleSearchBarResultSelect = (item: { id?: string; nom?: string }) => {
    const selectedName = extractFrenchName(item.nom || '').trim();

    setSelectedBusinessId(item.id || null);
    setPreselectedBusinessId(null);
    setSearchTerm(selectedName);
    setSelectedCity('');
    setSelectedCategory('');
    setPageCategorie(null);
    setFilterPremium(false);
    setFilterCommerceLocal(false);
    setFilterStatutCarte('');
    setSelectedChipCategories([]);
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nom_entreprise: suggestionForm.title,
        secteur: 'Demande information / inscription',
        ville: null,
        contact_suggere: `${suggestionForm.phone || ''} ${suggestionForm.email ? `- ${suggestionForm.email}` : ''}`.trim(),
        raison_suggestion: suggestionForm.message,
        submission_lang: language,
      };

      const { data, error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        fetch(
          `${supabaseUrl}/functions/v1/sync-suggestion-to-airtable`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({ record: data }),
          }
        ).catch(() => {});
      }

      setToast({
        message: language === 'fr'
          ? 'Merci ! Votre demande a été envoyée avec succès. Nous vous recontacterons rapidement.'
          : language === 'ar'
          ? 'شكراً! تم إرسال طلبك بنجاح. سنتواصل معك قريباً.'
          : 'Thank you! Your request has been sent successfully. We will contact you soon.',
        type: 'success',
        isVisible: true,
      });

      setSuggestionForm({
        title: '',
        phone: '',
        email: '',
        message: '',
      });

      setTimeout(() => {
        setShowSuggestForm(false);
        if (onCloseSuggestionForm) onCloseSuggestionForm();
      }, 1500);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setToast({
        message: language === 'fr'
          ? 'Une erreur est survenue. Veuillez réessayer.'
          : language === 'ar'
          ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'
          : 'An error occurred. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const categories = Array.isArray(businesses) ? [...new Set(businesses.map((b) => b.category).filter(Boolean))].sort() : [];
  const cities = Array.isArray(businesses) ? [...new Set(businesses.map((b) => b.city).filter(Boolean))].sort() : [];

  const filteredBusinesses = Array.isArray(chipFilteredBusinesses) ? chipFilteredBusinesses : [];

  const businessListItems = Array.isArray(businesses) ? businesses.slice(0, 20).map(business => ({
    name: business.name || 'Sans nom',
    url: `${window.location.origin}/#/business/${business.id}`
  })) : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {Array.isArray(businesses) && businesses.length > 0 && (
        <StructuredData
          data={generateCollectionPageSchema(
            'Annuaire des Entreprises en Tunisie - Dalil Tounes',
            'Trouvez les meilleures entreprises et professionnels en Tunisie par secteur d\'activité',
            businessListItems
          )}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <section className="px-4 pt-8 pb-12">
          <div className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/40 bg-gradient-to-br from-[#4A1D43] via-[#6D2B58] to-[#0B5A45] shadow-[0_28px_80px_rgba(74,29,67,0.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(212,175,55,0.25),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.14),transparent_26%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
              <div className="text-white">
                <p className="mb-4 inline-flex rounded-full border border-[#D4AF37]/50 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F7D978]">
                  Professionnels
                </p>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Développez votre activité avec Dalil Tounes
                </h1>
                <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/88">
                  Présentez votre activité grâce à une fiche professionnelle complète, facilitez les contacts avec vos futurs clients et développez votre visibilité partout en Tunisie.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/subscription')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#4A1D43] shadow-lg transition hover:bg-[#F0CD5A]"
                  >
                    Découvrir les offres
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('business-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/18"
                  >
                    Rechercher une entreprise
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <GuideMascot
                variant="business"
                pose="hello"
                position="left"
                size="md"
                title="Bonjour !"
                message="Je vais vous montrer comment une fiche professionnelle peut aider votre activité à gagner en visibilité et inspirer confiance."
                className="bg-white/95 border-white/70 shadow-xl"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <SectionIntro
              eyebrow="Présence en ligne"
              title="Aujourd'hui, vos futurs clients recherchent d'abord sur Internet."
            >
              <p>Avant d'appeler, de se déplacer ou de réserver, beaucoup de personnes commencent par chercher une entreprise en ligne.</p>
              <p>Elles veulent vérifier les horaires, l'adresse, les avis, les photos, les coordonnées et comprendre rapidement si le professionnel correspond à leur besoin.</p>
              <p>Le bouche-à-oreille reste précieux. Beaucoup de personnes demandent encore conseil à leur entourage avant de choisir un artisan, un commerçant ou une entreprise.</p>
              <p>Mais une recommandation ne permet pas toujours de vérifier le nouveau numéro, la nouvelle adresse, les horaires, les avis récents, les photos ou les services proposés.</p>
              <p>Les citoyens souhaitent désormais compléter ces recommandations grâce à des informations fiables, cohérentes et régulièrement mises à jour. Quand ces informations sont faciles à retrouver, le premier contact devient naturellement plus simple.</p>
            </SectionIntro>
          </div>
        </section>

        <section className="px-4 py-10 bg-white">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_0.9fr] items-start">
            <SectionIntro
              eyebrow="Pourquoi une fiche ?"
              title="Pourquoi une fiche professionnelle est-elle importante ?"
            >
              <p>Beaucoup de professionnels possèdent un véritable savoir-faire. Pourtant, leurs informations sont parfois dispersées ou incomplètes.</p>
              <p>Une page Facebook peut afficher un ancien numéro. Google Business peut contenir des horaires non mis à jour. Instagram montre souvent de belles photos, mais peu d'informations pratiques.</p>
              <p>Une fiche professionnelle complète, cohérente et régulièrement mise à jour aide aussi les moteurs de recherche à mieux comprendre votre activité.</p>
              <p>Plus votre présence numérique est cohérente, plus vous augmentez vos chances d'être trouvé lors des recherches locales, sans jamais garantir une position précise sur Google.</p>
              <p>Une fiche professionnelle claire, complète et régulièrement mise à jour permet de rassurer les visiteurs et facilite le premier contact.</p>
            </SectionIntro>

            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FFFDF6] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-[#4A1D43]">Conseil de Dalil</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                Avant de chercher à être plus visible, assurez-vous que les informations de votre entreprise sont cohérentes partout où vos clients peuvent vous trouver.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pt-4 pb-2">
          <div className="max-w-5xl mx-auto">
            <GuideMascot
              variant="info"
              pose="point"
              position="left"
              size="sm"
              title="À vous d'explorer."
              message="Vous pouvez maintenant découvrir les professionnels déjà présents sur Dalil Tounes et voir comment leurs fiches sont présentées aux visiteurs."
              className="py-4 sm:py-5"
            />
          </div>
        </section>

        {/* SearchBar Entreprises */}
        <section id="business-search" className="py-6 px-4 relative z-0 scroll-mt-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-[#4A1D43]">Découvrez les entreprises déjà présentes sur Dalil Tounes.</h2>
              <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Vous pouvez rechercher une entreprise, un artisan, un commerçant ou un professionnel partout en Tunisie et découvrir leur fiche.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3">
              <SearchBar
                scope="global"
                intentEnabled={false}
                enabled
                resultMode="filterCards"
                onResultSelect={handleSearchBarResultSelect}
              />
            </div>
          </div>
        </section>

        {/* Tags de filtres actifs - Design Premium */}
        {(selectedCity || selectedCategory) && (
          <div className="mb-8 px-4 flex flex-wrap gap-2 items-center">
            {selectedCity && (
              <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#4A1D43] px-3 py-1.5 rounded-full text-sm font-medium" style={{ border: '1px solid #D4AF37' }}>
                <MapPin className="w-3.5 h-3.5" />
                {selectedCity}
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#4A1D43] px-3 py-1.5 rounded-full text-sm font-medium" style={{ border: '1px solid #D4AF37' }}>
                <Building2 className="w-3.5 h-3.5" />
                {selectedCategory}
              </span>
            )}
          </div>
        )}

        {pageCategorie && (
          <div className="mb-6 px-4 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm" style={{ border: '1px solid #D4AF37' }}>
              <span className="text-sm font-medium text-[#4A1D43]">
                {t.businesses.activeFilter}: {pageCategorie}
              </span>
              <button
                onClick={() => {
                  setPageCategorie(null);
                  navigate('/entreprises');
                }}
                className="text-[#4A1D43] hover:text-[#D4AF37] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Affichage des résultats : avec ou sans recherche active */}
        <div ref={resultsRef} className="relative z-10 mb-10 bg-[#F8F9FA]">
          {(loading || searching || pendingSearch) ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-600">{searching ? t.businesses.searching || t.common.loading : t.common.loading}</p>
            </div>
          ) : filteredBusinesses.length === 0 && hasActiveSearch ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">{t.common.noResults}</p>
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="px-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#4A1D43]">
                  {hasActiveSearch ? ((t as any).businessesExtra?.searchResults || 'Résultats de votre recherche') : ((t as any).businessesExtra?.featuredTitle || 'Entreprises en vedette')}
                  <span className="ms-2 text-sm text-gray-500 font-normal">
                    ({hasActiveSearch ? filteredBusinesses.length : Math.min(3, filteredBusinesses.length)} {filteredBusinesses.length > 1 ? ((t as any).businessesExtra?.businessPlur || 'entreprises') : ((t as any).businessesExtra?.businessSing || 'entreprise')})
                  </span>
                </h3>
                {hasActiveSearch && (
                  <button
                    onClick={() => {
                      setSelectedBusinessId(null);
                      setSearchTerm('');
                      setSelectedCity('');
                      setSelectedCategory('');
                      setPageCategorie(null);
                      setFilterPremium(false);
                      setFilterCommerceLocal(false);
                      setFilterStatutCarte('');
                      setSelectedChipCategories([]);
                      navigate('/entreprises', { replace: true });
                      window.setTimeout(() => {
                        document.getElementById('business-search')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }, 50);
                    }}
                    className="text-xs text-[#4A1D43] hover:text-[#D4AF37] font-medium"
                  >
                    {(t as any).businessesExtra?.reset || 'Réinitialiser'}
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(filteredBusinesses) && filteredBusinesses.slice(0, hasActiveSearch ? filteredBusinesses.length : 3).map((business) => {
                  if (!business || !business.id) return null;

                  return (
                    <BusinessCardWithActivity
                      key={business.id}
                      activities={getActivitiesForBusiness(businessActivitiesByCompany, business)}
                      business={{
                        id: business.id,
                        name: business.name,
                        category: business.category,
                        ville: business.city || null,
                        gouvernorat: business.gouvernorat,
                        statut_abonnement: business.statut_abonnement,
                        niveau_priorite_abonnement: business.niveau_priorite_abonnement,
                        badges: business.badges || [],
                        imageUrl: business.imageUrl,
                        logoUrl: business.logoUrl,
                        telephone: business.phone || null,
                        horaires_ok: business.horaires_ok,
                        statut_carte: business.statut_carte || null,
                        note_google: business.note_google ?? business['Note Google Globale'] ?? null,
                        nombre_avis: business.nombre_avis ?? business['Compteur Avis Google'] ?? null,
                        'Note Google Globale': business['Note Google Globale'] ?? business.note_google ?? null,
                        'Compteur Avis Google': business['Compteur Avis Google'] ?? business.nombre_avis ?? null,
                        name_ar: business.name_ar || null,
                        description_ar: business.description_ar || null,
                      }}
                      onClick={() => {
                        navigate(buildEntrepriseUrl({ slug: business.slug, nom: business.name, ville: business.ville || business.city, id: business.id }));
                      }}
                      variant="premium"
                    />
                  );
                })}
              </div>

              {!hasActiveSearch && filteredBusinesses.length > 3 && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 rounded-lg text-xs text-[#4A1D43]" style={{ border: '1px solid #D4AF37' }}>
                    <Search className="w-4 h-4" />
                    <span className="font-medium">Recherchez parmi les entreprises déjà présentes sur Dalil Tounes.</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <div>
              <SectionIntro eyebrow="Le CV Business" title="Une fiche qui devient le CV numérique de votre entreprise.">
                <p>Le CV Business rassemble les informations utiles pour présenter votre activité, expliquer votre savoir-faire et aider les visiteurs à comprendre rapidement qui vous êtes.</p>
                <p>Il ne s'agit pas seulement d'être visible. Il s'agit aussi d'inspirer confiance avec une fiche claire, complète et vérifiable.</p>
              </SectionIntro>
              <div className="mt-6 flex flex-wrap gap-2">
                <FeaturePill icon={Phone} label="Téléphone" />
                <FeaturePill icon={Mail} label="Description" />
                <FeaturePill icon={Award} label="Certificat" />
                <FeaturePill icon={Clock} label="Horaires" />
                <FeaturePill icon={Calendar} label="Réservation" />
                <FeaturePill icon={QrCode} label="QR Code" />
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <DemoCVBusinessPreview />
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-white px-5 py-2.5 text-sm font-bold text-[#4A1D43] shadow-sm transition hover:bg-[#FFF8E1] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
              >
                Voir la fiche en grand
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionIntro
              eyebrow="Cohérence"
              title="Une présence en ligne cohérente inspire confiance."
            >
              <p>Google Business, Facebook, Instagram, LinkedIn et votre site web restent utiles. Dalil Tounes ne les remplace pas : il les complète en rassemblant les informations importantes dans une fiche claire.</p>
              <p>Un client peut voir un ancien numéro sur Facebook, des horaires différents sur Google et peu d'informations pratiques sur Instagram. Dans ce cas, il hésite ou passe à une autre entreprise.</p>
              <p>Une fiche vérifiée et mise à jour aide à rendre vos informations plus cohérentes, plus faciles à consulter et plus rassurantes au moment de vous contacter.</p>
            </SectionIntro>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {['Centraliser les informations utiles', 'Éviter les informations contradictoires', 'Faciliter le premier contact'].map((item) => (
                <div key={item} className="rounded-2xl border border-[#D4AF37]/20 bg-[#FFFDF6] px-4 py-3 text-sm font-semibold text-[#4A1D43]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] items-start">
              <SectionIntro
                eyebrow="Parcours client"
                title="Comment un citoyen découvre votre entreprise ?"
              >
                <p>La fiche entreprise devient le point de rencontre entre les citoyens qui cherchent un professionnel et les professionnels qui souhaitent être trouvés.</p>
                <div className="mt-5 rounded-2xl border border-[#D4AF37]/25 bg-white p-4 text-sm text-gray-700 shadow-sm">
                  <span className="font-bold text-[#4A1D43]">Message de Dalil : </span>
                  quand les informations sont claires, le visiteur hésite moins. Il comprend mieux votre activité et sait comment vous contacter.
                </div>
              </SectionIntro>

              <div className="space-y-3">
                {[
                  'Le citoyen recherche un professionnel, une entreprise ou un service.',
                  'Il consulte une fiche claire avec les informations utiles pour se faire une première idée.',
                  'Il contacte, réserve ou partage la fiche quand il pense avoir trouvé le bon professionnel.',
                ].map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-sm font-bold text-[#4A1D43]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-3">FAQ</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A1D43]">Questions fréquentes des professionnels</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {PROFESSIONAL_FAQ.map((item) => (
                <div key={item.question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-bold text-[#4A1D43]">{item.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="max-w-5xl mx-auto rounded-3xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#4A1D43] to-[#0B5A45] p-7 md:p-10 text-center text-white shadow-[0_22px_60px_rgba(74,29,67,0.2)]">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F7D978]">Avec Dalil</p>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold">Prêt à développer votre activité ?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-white/85">
              Découvrez les différentes offres proposées par Dalil Tounes et choisissez la solution la plus adaptée à votre activité.
            </p>
            <p className="mt-4 text-sm text-white/75">
              Dalil vous accompagne étape par étape, avec une approche simple, utile et progressive.
            </p>
            <button
              type="button"
              onClick={() => navigate('/subscription')}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-bold text-[#4A1D43] shadow-lg transition hover:bg-[#F0CD5A]"
            >
              Découvrir les offres
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {showDemoModal && (
          <div
            className="fixed inset-0 z-[120000] flex items-center justify-center bg-black/75 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-demo-modal-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) setShowDemoModal(false);
            }}
          >
            <div className="relative max-h-[calc(100vh-32px)] w-fit max-w-[95vw] overflow-y-auto overflow-x-hidden">
              <div className="relative mb-3 rounded-2xl border border-white/70 bg-white/95 px-12 py-4 text-center shadow-2xl backdrop-blur">
                <div className="mx-auto max-w-sm">
                  <h2 id="business-demo-modal-title" className="text-lg font-bold text-[#4A1D43]">
                    Exemple de fiche professionnelle Dalil Tounes
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Cette démonstration vous permet de découvrir les principales fonctionnalités d'une fiche professionnelle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-[#4A1D43] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                  aria-label="Fermer la démonstration"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <DemoCVBusinessLargePreview />
            </div>
          </div>
        )}

        {showSuggestForm && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowSuggestForm(false)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[100000]">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Demande d’information / inscription</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Une question ou une demande d’inscription ? Envoyez-nous votre demande, nous vous recontactons rapidement.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSuggestForm(false);
                    if (onCloseSuggestionForm) onCloseSuggestionForm();
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSuggestionSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de votre demande *</label>
                  <input
                    type="text"
                    required
                    value={suggestionForm.title}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, title: e.target.value })}
                    placeholder="Ex : inscription entreprise, chauffeur privé, professeur, candidat emploi..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={suggestionForm.phone}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={suggestionForm.email}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={suggestionForm.message}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, message: e.target.value })}
                    placeholder="Expliquez brièvement votre demande."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestForm(false);
                      if (onCloseSuggestionForm) onCloseSuggestionForm();
                    }}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-[#4A1D43] text-white rounded-md hover:bg-[#5A2D53]"
                    style={{ border: '1px solid #D4AF37' }}
                  >
                    {t.businesses.form.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <BusinessNeedForm isOpen={showNeedForm} onClose={() => setShowNeedForm(false)} />

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast({ ...toast, isVisible: false })}
          duration={4000}
        />
      </div>
    </div>
  );
};
