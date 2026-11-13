import { cachedShowcaseRecord, rememberShowcaseRecord } from '../lib/showcaseRecordCache';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { getPublicComponentTranslations } from '../lib/publicComponentTranslations';
import { BoutiqueInteractive, type BoutiqueProduct } from './boutique/BoutiqueInteractive';
import BusinessShowcaseLienoraDetail from './BusinessShowcaseLienoraDetail';
import './businessShowcasePreviewEnhancements.css';

type BusinessRecord = {
  id?: string | null;
  slug?: string | null;
  slug_court?: string | null;
  nom?: string | null;
  ville?: string | null;
  google_url?: string | null;
  BTN_Maps?: string | null;
  [key: string]: unknown;
};

const normalizeUrl = (value: unknown): string => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

const strictHttpUrl = (value: unknown): string => {
  const raw = String(value || '').trim();
  return /^https?:\/\//i.test(raw) ? raw : '';
};

const getGoogleReviewsUrl = (business: BusinessRecord | null): string => {
  if (!business) return '';

  const dedicatedCandidates = [
    business['Voir les avis'],
    business['Lien avis Google'],
    business['Lien Avis Google'],
    business['Google Reviews'],
    business['google_reviews_url'],
  ];

  for (const candidate of dedicatedCandidates) {
    const url = normalizeUrl(candidate);
    if (url) return url;
  }

  const listingCandidates = [business.google_url, business.BTN_Maps];
  for (const candidate of listingCandidates) {
    const url = strictHttpUrl(candidate);
    if (url) return url;
  }

  const query = [business.nom, business.ville, 'avis Google'].filter(Boolean).join(' ');
  return query ? `https://www.google.com/search?q=${encodeURIComponent(query)}` : 'https://www.google.com/';
};

const isReviewsLabel = (label: string): boolean => {
  const normalized = label.toLowerCase();
  return (
    normalized.includes('avis client') ||
    normalized.includes('customer review') ||
    normalized.includes('recension') ||
    normalized.includes('отзыв') ||
    normalized.includes('آراء')
  );
};

export default function BusinessShowcaseLienoraEnhanced() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { language } = useLanguage();
  const text = getPublicComponentTranslations(language);
  const [business, setBusiness] = useState<BusinessRecord | null>(null);

  const reviewsUrl = useMemo(() => getGoogleReviewsUrl(business), [business]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let record: BusinessRecord | null = cachedShowcaseRecord(id || slug) as BusinessRecord | null;

      if (!record && id) {
        const { data } = await supabase.from('entreprise').select('*').eq('id', id).maybeSingle();
        record = data as BusinessRecord | null;
      }

      if (!record && slug) {
        const { data } = await supabase
          .from('entreprise')
          .select('*')
          .eq('slug_court', slug.trim().toLowerCase())
          .maybeSingle();
        record = data as BusinessRecord | null;
      }

      if (!record && slug) {
        const { data } = await supabase
          .from('entreprise')
          .select('*')
          .eq('slug', slug.trim().toLowerCase())
          .limit(1)
          .maybeSingle();
        record = data as BusinessRecord | null;
      }

      if (!cancelled) { if (record) rememberShowcaseRecord(record); setBusiness(record); }
    };

    // The detail component renders the CV immediately; its Google reviews
    // enhancement is secondary and must not compete for the initial network.
    const timer = window.setTimeout(() => { void load(); }, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id, slug]);

  useEffect(() => {
    const enhance = () => {
      if (!reviewsUrl) return;

      document.querySelectorAll<HTMLButtonElement>('.dt-accordion-trigger').forEach(button => {
        if (!isReviewsLabel(button.textContent || '')) return;

        button.dataset.googleReviewsUrl = reviewsUrl;
        if (button.dataset.googleReviewsLinked === 'true') return;

        button.dataset.googleReviewsLinked = 'true';
        button.title = text.googleReviews;
        button.addEventListener(
          'click',
          event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const target = button.dataset.googleReviewsUrl;
            if (target) window.open(target, '_blank', 'noopener,noreferrer');
          },
          true,
        );
      });
    };

    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [reviewsUrl, text.googleReviews]);

  const rawProducts = business?.['boutique_products'];
  const products: BoutiqueProduct[] = Array.isArray(rawProducts) ? rawProducts.filter((item): item is BoutiqueProduct => Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.imageUrl === 'string' && (item.mode === 'order' || item.mode === 'quote') && item.currency === 'TND')) : [];
  const boutiqueDemo = new URLSearchParams(window.location.search).get('boutique-demo') === '1'
    && (String(business?.nom || '').trim().toLowerCase() === "aux saveurs d'anis")
    && String(business?.ville || '').toLowerCase() === 'sousse';
  const images = (String(business?.['image_url'] || '').match(/https:\/\/[^\s,]+/g) || []).map(url => url.trim());
  const pilotProducts: BoutiqueProduct[] = boutiqueDemo
    ? [
      { id: 'mariage', title: 'Buffet de mariage', imageUrl: images[1], currency: 'TND', mode: 'quote', description: 'Prestation traiteur sur mesure — devis personnalisé.' },
      { id: 'plateaux', title: 'Plateaux traiteur', imageUrl: images[3], currency: 'TND', mode: 'quote', description: 'Pour vos événements et repas professionnels.' },
      { id: 'dessert', title: 'Desserts à l’assiette', imageUrl: images[0], currency: 'TND', mode: 'quote', description: 'Créations et desserts selon votre événement.' },
      { id: 'bouchees', title: 'Amuse-bouches', imageUrl: images[4], currency: 'TND', mode: 'quote', description: 'Pièces cocktail et propositions sur mesure.' },
    ].filter(product => Boolean(product.imageUrl))
    : [];
  const visibleProducts = boutiqueDemo ? pilotProducts : products;
  const boutiqueContent = visibleProducts.length > 0
    ? <BoutiqueInteractive config={{
        merchantName: String(business?.nom || ''),
        whatsapp: String(business?.['whatsapp'] || ''),
        products: visibleProducts,
        paymentsVerified: !boutiqueDemo && business?.['boutique_payments_verified'] === true,
        demoMode: boutiqueDemo,
      }} />
    : undefined;
  return <BusinessShowcaseLienoraDetail boutiqueContent={boutiqueContent} />;
}
