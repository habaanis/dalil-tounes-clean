import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useViewTracking } from '../hooks/useViewTracking';
import { getMultilingualField } from '../lib/databaseI18n';
import { getBusinessSeoMeta } from '../lib/seoMetaTemplates';
import {
  buildEntrepriseUrl,
  extractShortIdFromSlug,
  generateSlug,
} from '../lib/slugify';
import { supabase } from '../lib/supabaseClient';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { generateLocalBusinessSchema } from '../lib/structuredDataSchemas';
import GratuitCard from './GratuitCard';
import { SEOHead } from './SEOHead';
import StructuredData from './StructuredData';
import BusinessShowcaseLienoraDetail from './BusinessShowcaseLienoraDetail';
import './businessShowcaseUnifiedTheme.css';

interface BusinessRecord {
  id: string;
  nom: string;
  slug?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  telephone2?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  site_web?: string | null;
  categorie?: string | string[] | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_ru?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_it?: string | null;
  name_ru?: string | null;
  image_url?: string | null;
  logo_url?: string | null;
  horaires_ok?: string | null;
  statut_abonnement?: string | null;
  statut_validation?: string | null;
  statut_carte?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  id_airtable?: string | null;
  [key: string]: unknown;
}

const normalizeText = (value: unknown): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isPublished = (value: unknown): boolean => {
  const normalized = normalizeText(value);
  return normalized === 'publie' || normalized === 'published';
};

const listToText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean).join(', ');
  }
  return String(value || '').trim();
};

export default function BusinessShowcaseDetail() {
  const { id: urlId, slug: urlSlug, villeSlug: urlVilleSlug } = useParams<{
    id?: string;
    slug?: string;
    villeSlug?: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const tier = useMemo(
    () => mapSubscriptionToTier({ statut_abonnement: business?.statut_abonnement }),
    [business?.statut_abonnement, location.search],
  );

  useViewTracking(tier === 'gratuit' ? business?.id : undefined);

  useEffect(() => {
    let cancelled = false;

    const chooseByCity = (rows: BusinessRecord[]): BusinessRecord | null => {
      if (rows.length === 0) return null;
      if (!urlVilleSlug) return rows[0];
      return rows.find(row => generateSlug(String(row.ville || '')) === urlVilleSlug) || rows[0];
    };

    const loadBusiness = async () => {
      setLoading(true);
      setFailed(false);

      try {
        let record: BusinessRecord | null = null;
        const fullUuid = urlId || urlSlug?.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        )?.[0];

        if (fullUuid) {
          const { data } = await supabase
            .from('entreprise')
            .select('*')
            .eq('id', fullUuid)
            .maybeSingle();
          record = data as BusinessRecord | null;
        }

        if (!record && urlSlug) {
          const airtableId = urlSlug.match(/(rec[a-z0-9]+)$/i)?.[1];
          if (airtableId) {
            const { data } = await supabase
              .from('entreprise')
              .select('*')
              .eq('id_airtable', airtableId)
              .maybeSingle();
            record = data as BusinessRecord | null;
          }
        }

        if (!record && urlSlug) {
          const normalizedSlug = urlSlug.trim().toLowerCase();
          const { data } = await supabase
            .from('entreprise')
            .select('*')
            .eq('slug', normalizedSlug)
            .limit(20);
          record = chooseByCity((data || []) as BusinessRecord[]);
        }

        if (!record && urlSlug) {
          const shortId = extractShortIdFromSlug(urlSlug);
          if (shortId) {
            const { data } = await supabase.rpc('find_entreprise_by_id_prefix', {
              prefix: shortId,
            });
            record = Array.isArray(data) && data.length > 0
              ? data[0] as BusinessRecord
              : null;
          }
        }

        if (cancelled) return;

        if (!record) {
          setFailed(true);
          return;
        }

        setBusiness(record);

        const canonicalPath = buildEntrepriseUrl(record);
        if (canonicalPath !== '/' && location.pathname !== canonicalPath) {
          navigate(`${canonicalPath}${location.search}`, { replace: true });
        }
      } catch (error) {
        console.error('[BusinessShowcaseDetail] Unable to resolve business:', error);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBusiness();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate, urlId, urlSlug, urlVilleSlug]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#F5F5F5] px-4 py-12 text-center text-gray-600">
        <div className="mx-auto mt-20 h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        <p className="mt-4">Chargement de la fiche...</p>
      </main>
    );
  }

  if (failed || !business) {
    return <BusinessShowcaseLienoraDetail />;
  }

  if (tier !== 'gratuit') {
    return <BusinessShowcaseLienoraDetail />;
  }

  const displayName = String(
    getMultilingualField(business, 'nom', language, true) || business.nom || '',
  );
  const displayDescription = String(
    getMultilingualField(business, 'description', language, true) || business.description || '',
  );
  const categoryLabel = listToText(business.categorie);
  const canonicalPath = buildEntrepriseUrl(business);
  const canonicalUrl = `https://dalil-tounes.com${canonicalPath}`;
  const seo = getBusinessSeoMeta(
    {
      nom: displayName,
      ville: business.ville,
      telephone: business.telephone,
      categorie: categoryLabel,
      description: displayDescription,
    },
    canonicalUrl,
  );

  const structuredData = {
    ...generateLocalBusinessSchema({
      nom: displayName,
      ville: business.ville || undefined,
      gouvernorat: business.gouvernorat || undefined,
      adresse: business.adresse || undefined,
      telephone: business.telephone || undefined,
      site_web: canonicalUrl,
      photo_url: business.image_url || undefined,
      image_url: business.image_url || undefined,
      latitude: Number.isFinite(Number(business.latitude))
        ? Number(business.latitude)
        : undefined,
      longitude: Number.isFinite(Number(business.longitude))
        ? Number(business.longitude)
        : undefined,
      horaires: business.horaires_ok || undefined,
      categorie: categoryLabel,
      statut_abonnement: business.statut_abonnement || undefined,
      description: displayDescription,
    }),
    url: canonicalUrl,
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/entreprises');
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image={business.logo_url || business.image_url || undefined}
        canonical={canonicalUrl}
        currentPath={canonicalPath}
        type="website"
        author={displayName}
        noindex={!isPublished(business.statut_validation)}
      />
      <StructuredData data={structuredData} />

      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D4AF37]/60 bg-white px-4 py-2 text-sm font-bold text-[#4A1D43] shadow-sm"
        >
          <ArrowLeft size={17} />
          Retour
        </button>

        <section className="rounded-2xl border border-[#D4AF37]/25 bg-white p-4 shadow-xl">
          <p className="mb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#B8941F]">
            Fiche gratuite Dalil Tounes
          </p>

          <GratuitCard
            name={displayName}
            logoUrl={business.logo_url}
            category={categoryLabel}
            ville={business.ville}
            gouvernorat={business.gouvernorat}
            horaires_ok={business.horaires_ok}
            telephone={business.telephone}
            language={language}
            statut_carte={business.statut_carte}
            description_ar={business.description_ar}
          />

          {displayDescription && (
            <p className="mt-4 whitespace-pre-line rounded-xl bg-[#FAFAF7] p-3 text-sm leading-6 text-gray-700">
              {displayDescription}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
