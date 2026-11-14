import { isCertifiedBusiness } from '../lib/businessCertification';
import GoogleRatingSummary from './GoogleRatingSummary';
import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

// Public search must not inherit a stale authenticated browser session.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
import { Tables } from '../lib/dbTables';
import { detectIntent, getCategoryRoute, getCategoryDisplayName, PageCategorie } from '../lib/intentDetection';
import { FORCE_ENTERPRISE_ONLY } from '../config/searchMode';
import { expandQuery, rankItemByQuery, MIN_CHARS } from '../lib/searchSynonyms';
import { businessQueryTerms, rankBusinessSearchRows } from '../lib/businessSearchRelevance';
import { expandCityVariants } from '../lib/geoAliases';
import { buildEntrepriseUrl } from '../lib/url';
import { useLanguage } from '../context/LanguageContext';
import { t, isRTL, type Lang } from '../lib/i18n';
import { normalizeText } from '../lib/textNormalization';
import { dedupeByAirtableId } from '../lib/dedupeByAirtableId';
import LocationSelectTunisie from './LocationSelectTunisie';

type CertFilter = '' | 'certifie' | 'non_certifie';

type Scope = 'global' | 'sante' | 'education' | 'administration' | 'loisirs' | 'magasin' | 'marche_local' | 'tourism' | 'services';
type Mode = 'entreprises' | 'annonces' | 'evenements';
type ResultMode = 'redirectToDetail' | 'filterCards' | 'redirectToResults';

interface EntrepriseItem {
  id: string;
  nom?: string;
  ville: string;
  categorie?: string;
  matiere?: string;
  _rank?: number;
}

interface AnnonceItem {
  id: string;
  titre: string;
  ville: string;
  categorie: string;
  urgent?: boolean;
  prix?: number;
}

interface EventItem {
  id: string;
  titre: string;
  ville: string;
  categorie: string;
  date_debut?: string;
  date_fin?: string;
}

type ResultItem = EntrepriseItem | AnnonceItem | EventItem;

type ResultSelectContext = {
  query: string;
  city: string;
  certFilter: CertFilter;
  resultMode: ResultMode;
};

interface VilleItem {
  ville: string;
}

type Props = {
  scope: Scope;
  mode?: Mode;
  intentEnabled?: boolean;
  showSeeAllItem?: boolean;
  className?: string;
  enabled?: boolean;
  autoSearch?: boolean;
  resultMode?: ResultMode;
  onResultSelect?: (item: ResultItem, context: ResultSelectContext) => void;
  preferredTitle?: string;
  preferredSubtitle?: string;
  appliedCertificationFilter?: CertFilter;
};

export default function SearchBar({
  scope,
  mode = 'entreprises',
  intentEnabled = false,
  showSeeAllItem = true,
  className = '',
  enabled = true,
  autoSearch = false,
  resultMode = 'redirectToDetail',
  onResultSelect,
  preferredTitle,
  preferredSubtitle,
  appliedCertificationFilter,
}: Props) {
  if (!enabled) return null;

  mode = 'entreprises';
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dir = isRTL(language as Lang) ? 'rtl' : 'ltr';

  const [q, setQ] = React.useState('');
  const [city, setCity] = React.useState('');
  const [metier] = React.useState('');
  const [certSelection, setCertSelection] = React.useState(() => ({
    applied: appliedCertificationFilter,
    value: appliedCertificationFilter ?? '' as CertFilter,
  }));
  // Reset the local draft only when the applied page filter changes.
  if (certSelection.applied !== appliedCertificationFilter) {
    setCertSelection({ applied: appliedCertificationFilter, value: appliedCertificationFilter ?? '' });
  }
  const certFilter = certSelection.value;
  const setCertFilter = (value: CertFilter) => setCertSelection({ applied: appliedCertificationFilter, value });
  const [ent, setEnt] = React.useState<ResultItem[]>([]);
  const [villes, setVilles] = React.useState<VilleItem[]>([]);
  const [loadingEnt, setLoadingEnt] = React.useState(false);
  const [loadingVille, setLoadingVille] = React.useState(false);
  const [errEnt, setErrEnt] = React.useState<string | null>(null);
  const [errVille, setErrVille] = React.useState<string | null>(null);
  const searchSequence = React.useRef(0);
  const citySequence = React.useRef(0);
  const tEnt = React.useRef<number | null>(null);
  const tVille = React.useRef<number | null>(null);
  const tAutoSearch = React.useRef<number | null>(null);
  const cache = React.useRef<Map<string, ResultItem[]>>(new Map());
  const formRef = React.useRef<HTMLFormElement>(null);
  const [dropdownRect, setDropdownRect] = React.useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const syncDropdownPos = React.useCallback(() => {
    if (formRef.current) {
      const r = formRef.current.getBoundingClientRect();
      setDropdownRect({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  }, []);

  React.useEffect(() => {
    syncDropdownPos();
    window.addEventListener('scroll', syncDropdownPos, true);
    window.addEventListener('resize', syncDropdownPos);
    return () => {
      window.removeEventListener('scroll', syncDropdownPos, true);
      window.removeEventListener('resize', syncDropdownPos);
    };
  }, [syncDropdownPos]);

  const isGlobal = scope === 'global';
  const pageLabel = isGlobal ? null : getCategoryDisplayName(scope as PageCategorie);
  const like = (s: string) => `%${(s || '').trim()}%`;
  // Fetch enough candidates to rank by business activity on the client.
  // The old 40-row scope cap omitted schools, laboratories and services.
  const GLOBAL_RAW_RESULT_LIMIT = 400;
  const CATEGORY_RAW_RESULT_LIMIT = 160;

  const OR_SAFE_FIELDS = ['nom', 'sous_categories_texte', 'sous_categories_clean', 'services', 'keywords_fr', 'search_text', 'description'];

  function trustPriority(row: any): number {
    if (String(row.cv_business_status || '').toLowerCase() === 'published' || row.cv_business_published_at) return 2;
    const rating = Number(row['Note Google Globale'] || 0);
    const reviews = Number(row['Compteur Avis Google'] || 0);
    return rating >= 4 && reviews >= 5 ? 1 : 0;
  }

  const runSearch = React.useCallback(async (qValue: string, cityValue: string, cert: CertFilter) => {
    const requestId = ++searchSequence.current;
    const trimmedValue = qValue.trim();

    if (trimmedValue.length < MIN_CHARS) {
      setEnt([]);
      setLoadingEnt(false);
      return;
    }

    const cacheKey = `${normalizeText(trimmedValue)}-${cityValue}-${scope}-${cert}`;
    if (cache.current.has(cacheKey)) {
      setEnt(cache.current.get(cacheKey)!);
      setLoadingEnt(false);
      return;
    }

    setLoadingEnt(true);
    setErrEnt(null);
    try {
      let allResults: any[] = [];

      if (scope === 'education' && /(?:professeur|enseignant|cours particuliers?|tuteur|teacher)/i.test(trimmedValue)) {
        const searchPattern = `%${trimmedValue}%`;
        let query = supabase
          .from(Tables.PROFESSEURS)
          .select('id, nom, ville, matiere')
          .or(`nom.ilike.${searchPattern},matiere.ilike.${searchPattern}`)
          .order('nom', { ascending: true })
          .limit(12);

        if (cityValue && cityValue.trim().length > 0) {
          query = query.eq('gouvernorat', cityValue);
        }

        const resp = await query;
        if (requestId !== searchSequence.current) return;
        if (resp.error) throw resp.error;
        allResults = resp.data || [];
      } else {
        const words = businessQueryTerms(trimmedValue);
        if (words.length === 0) {
          setEnt([]);
          setLoadingEnt(false);
          return;
        }

        const orParts: string[] = [];
        for (const word of words) {
          const escaped = word.replace(/[%_]/g, (c) => `\\${c}`);
          for (const field of OR_SAFE_FIELDS) {
            orParts.push(`${field}.ilike.%${escaped}%`);
          }
        }

        const cityTrimmed = cityValue ? cityValue.trim() : '';
        console.log('[Search] query:', trimmedValue, '| city:', cityTrimmed, '| or fields:', OR_SAFE_FIELDS.join(', '));

        let query = supabase
          .from(Tables.ENTREPRISE)
          .select('id, id_airtable, nom, ville, gouvernorat, adresse, description, sous_categories_texte, sous_categories_clean, categorie, name_ar, services, keywords_fr, search_text, statut_carte, cv_business_status, cv_business_published_at, "Note Google Globale", "Compteur Avis Google"')
          .not('nom', 'is', null)
          .neq('nom', '')
          .or('statut_publication.is.null,statut_publication.eq.Publié')
          .or(orParts.join(','))
          .order('cv_business_status', { ascending: false, nullsFirst: false })
          .order('"Compteur Avis Google"', { ascending: false, nullsFirst: false })
          .limit(isGlobal ? GLOBAL_RAW_RESULT_LIMIT : CATEGORY_RAW_RESULT_LIMIT);

        if (cityTrimmed.length > 0) {
          const cityPattern = `%${cityTrimmed}%`;
          query = query.or(`gouvernorat.ilike.${cityPattern},ville.ilike.${cityPattern},adresse.ilike.${cityPattern}`);
        }

        if (scope === 'magasin') {
          // Public autocomplete should not fail if optional commerce flag differs.
          // Filtering is applied by the destination page.
        }

        const resp = await query;
        if (requestId !== searchSequence.current) return;

        // Keep name suggestions available when the broad multi-column query fails.
        // Avoid empty autocomplete due to one malformed/unsupported searchable field.
        let searchRows = resp.data || [];
        if (resp.error) {
          console.error('[Search] broad query error, attempting safe name fallback:', resp.error);
          const fallback = await supabase
            .from(Tables.ENTREPRISE)
            .select('id, id_airtable, nom, ville, gouvernorat, categorie, statut_carte, cv_business_status, cv_business_published_at, "Note Google Globale", "Compteur Avis Google"')
            .not('nom', 'is', null)
            .or('statut_publication.is.null,statut_publication.eq.Publié')
            .ilike('nom', `%${trimmedValue}%`)
            .order('cv_business_status', { ascending: false, nullsFirst: false })
            .order('"Compteur Avis Google"', { ascending: false, nullsFirst: false })
            .limit(50);
          if (requestId !== searchSequence.current) return;
          if (fallback.error) {
            setErrEnt(fallback.error.message);
            setEnt([]);
            setLoadingEnt(false);
            return;
          }
          searchRows = fallback.data || [];
        }

        console.log('[Search] raw Supabase results:', searchRows.length,
          resp.data?.slice(0, 5).map((r: any) => ({ nom: r.nom, ville: r.ville, gouvernorat: r.gouvernorat })));

        const rawRows = dedupeByAirtableId(searchRows as { id: string; id_airtable?: string | null }[]);

        let scored = rankBusinessSearchRows(rawRows, trimmedValue).map((row: any) => ({
          ...row,
          _score: row._searchRelevance,
          ville: row.ville || row.gouvernorat || '',
        }));

        scored.sort((a: any, b: any) => {
          const relevanceDiff = b._score - a._score;
          if (relevanceDiff) return relevanceDiff;
          const trustDiff = trustPriority(b) - trustPriority(a);
          if (trustDiff) return trustDiff;
          return Number(b['Compteur Avis Google'] || 0) - Number(a['Compteur Avis Google'] || 0);
        });

        if (cert) {
          scored = scored.filter((r: any) => {
            if (cert === 'certifie') return isCertifiedBusiness(r);
            if (cert === 'non_certifie') return !isCertifiedBusiness(r);
            return true;
          });
        }

        allResults = scored.slice(0, 8);
        console.log('[Search] scored results:', allResults.map((r: any) => ({ nom: r.nom, score: r._score, ville: r.ville })));
      }

      if (requestId !== searchSequence.current) return;
      cache.current.set(cacheKey, allResults);
      if (cache.current.size > 50) {
        const firstKey = cache.current.keys().next().value;
        cache.current.delete(firstKey);
      }

      setEnt(allResults);
    } catch (err) {
      if (requestId !== searchSequence.current) return;
      console.error('[Search] error:', err);
      setErrEnt(err instanceof Error ? err.message : 'Erreur de recherche');
      setEnt([]);
    } finally {
      if (requestId === searchSequence.current) setLoadingEnt(false);
    }
  }, [scope, metier]);

  const onChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value ?? '';
    setQ(v);
    searchSequence.current += 1;
    setEnt([]);
    setLoadingEnt(false);
    setErrEnt(null);
    if (tEnt.current) window.clearTimeout(tEnt.current);
    tEnt.current = window.setTimeout(() => {
      runSearch(v, city, certFilter);
    }, 300);
  };

  React.useEffect(() => {
    if (q.trim().length < MIN_CHARS) return;
    if (tEnt.current) window.clearTimeout(tEnt.current);
    tEnt.current = window.setTimeout(() => {
      runSearch(q, city, certFilter);
    }, 250);
  }, [certFilter, city]);

  const onChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value ?? '';
    setCity(v);
    // A city change also invalidates any business suggestions for the previous city.
    searchSequence.current += 1;
    if (tEnt.current) window.clearTimeout(tEnt.current);
    setEnt([]);
    setLoadingEnt(false);
    const cityRequestId = ++citySequence.current;
    if (tVille.current) window.clearTimeout(tVille.current);
    // Hide outdated suggestions and loading state immediately while typing.
    setVilles([]);
    setLoadingVille(false);
    setErrVille(null);
    if (v.trim().length < MIN_CHARS) return;
    tVille.current = window.setTimeout(async () => {
      setLoadingVille(true);
      setErrVille(null);
      try {
        const variants = expandCityVariants(v, language as Lang);
        const allCities: VilleItem[] = [];

        // Resolve the spelling variants together rather than one network round-trip at a time.
        const responses = await Promise.all(variants.map((variant) =>
          supabase
            .from(Tables.CITIES)
            .select('nom')
            .ilike('nom', like(variant))
            .order('nom', { ascending: true })
            .limit(8)
        ));
        if (cityRequestId !== citySequence.current) return;
        for (const resp of responses) {
          if (resp.data) allCities.push(...resp.data.map((row: { nom: string }) => ({ ville: row.nom })));
          if (resp.error) setErrVille(resp.error.message);
        }

        const seen = new Set<string>();
        const unique = allCities.filter(c => {
          const key = normalizeText(c.ville);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (cityRequestId === citySequence.current) setVilles(unique.slice(0, 8));
      } catch (error) {
        if (cityRequestId === citySequence.current) {
          setErrVille(error instanceof Error ? error.message : 'Recherche de ville indisponible');
          setVilles([]);
        }
      } finally {
        if (cityRequestId === citySequence.current) setLoadingVille(false);
      }
    }, 350);
  };

  React.useEffect(() => {
    return () => {
      if (tEnt.current) window.clearTimeout(tEnt.current);
      if (tVille.current) window.clearTimeout(tVille.current);
    };
  }, []);

  const goTo = (path: string) => {
    const cleanPath = path.startsWith('#') ? path.substring(1) : path;
    navigate(cleanPath);
  };

  const getResultLabel = (item: ResultItem): string => {
    if ('nom' in item && item.nom) return item.nom;
    if ('titre' in item && item.titre) return item.titre;
    return q.trim();
  };

  const goToResults = (item?: ResultItem) => {
    const query = item ? getResultLabel(item) : q.trim();
    // Tourism experiences are catalogued separately from the general business results.
    if (scope === 'tourism' && /\b(plong\w*|plong[eé]e|diving|scuba|snorkel|sous[- ]marin\w*)\b/i.test(query)) {
      goTo('/citizens/tourism?type=plongee');
      return;
    }
    if (isGlobal && !item && query) {
      const intent = detectIntent(query);
      if (intent.categorie && intent.shouldRedirect) {
        const params = new URLSearchParams();
        params.set('q', query);
        if (city.trim()) params.set('ville', city.trim());
        goTo(`${getCategoryRoute(intent.categorie)}?${params.toString()}`);
        return;
      }
    }
    const url = buildEntrepriseUrl({
      q: item ? getResultLabel(item) : q.trim() || undefined,
      ville: city.trim() || undefined,
      statut_carte: certFilter || undefined,
    });
    goTo(url);
  };

  const handleResultClick = (item: ResultItem) => {
    if (resultMode === 'filterCards') {
      const selectedLabel = getResultLabel(item);
      setQ(selectedLabel);

      if (onResultSelect) {
        onResultSelect(item, {
          query: selectedLabel,
          city: city.trim(),
          certFilter,
          resultMode,
        });
        setEnt([]);
        return;
      }

      goToResults(item);
      return;
    }

    if (resultMode === 'redirectToResults') {
      goToResults(item);
      return;
    }

    goTo(`/entreprise/id/${encodeURIComponent(item.id)}`);
  };

  const triggerNavigation = (query: string, villeParam: string) => {
    if (!isGlobal) {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (villeParam) params.set('ville', villeParam);
      goTo(`/recherche?${params.toString()}`);
      return;
    }
    const url = buildEntrepriseUrl({
      q: query || undefined,
      ville: villeParam || undefined,
      statut_carte: certFilter || undefined
    });
    goTo(url);
  };

  void autoSearch;
  void triggerNavigation;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    const villeParam = city.trim();
    let detectedCategory: string | undefined;
    setEnt([]);
    setVilles([]);

    if (resultMode === 'redirectToResults') {
      goToResults();
      return;
    }

    if (isGlobal && intentEnabled) {
      const res = detectIntent(query);
      if (res.categorie && res.shouldRedirect) {
        const label = getCategoryDisplayName(res.categorie);
        if (confirm(`Aller directement vers la page ${label} ?`)) {
          const route = getCategoryRoute(res.categorie);
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (villeParam) params.set('ville', villeParam);
          goTo(`${route}?${params.toString()}`);
          return;
        }
        detectedCategory = res.categorie;
      }
    }

    if (!isGlobal) {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (villeParam) params.set('ville', villeParam);
      goTo(`/recherche?${params.toString()}`);
      return;
    }

    const url = buildEntrepriseUrl({
      q: query || undefined,
      ville: villeParam || undefined,
      categorie: detectedCategory,
      statut_carte: certFilter || undefined
    });
    goTo(url);
  };

  const renderSeeAll = () => {
    if (!showSeeAllItem) return null;

    if (resultMode === 'redirectToResults' && q.trim().length >= 2) {
      const intent = isGlobal ? detectIntent(q.trim()) : null;
      const categoryLabel = intent?.categorie && intent.shouldRedirect ? getCategoryDisplayName(intent.categorie) : null;
      return (
        <li
          className="py-2.5 px-2 font-medium cursor-pointer hover:bg-gray-50 rounded transition text-gray-700 flex items-center gap-2"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => goToResults()}
        >
          <span>➡️</span>
          <span>{categoryLabel ? (language === 'fr' ? `Voir dans ${categoryLabel}` : language === 'ar' ? `عرض في ${categoryLabel}` : language === 'en' ? `See in ${categoryLabel}` : t(language as Lang, 'search.seeAll')) : t(language as Lang, 'search.seeAll')}</span>
        </li>
      );
    }

    if (isGlobal && q.trim().length >= 2) {
      const res = detectIntent(q);
      if (res.categorie && res.confidence >= 0.75) {
        const label = getCategoryDisplayName(res.categorie);
        const url = buildEntrepriseUrl({
          q: q.trim(),
          ville: city.trim() || undefined,
          categorie: res.categorie
        });
        return (
          <li
            className="py-2.5 px-2 font-medium cursor-pointer hover:bg-blue-50 rounded transition text-blue-700 flex items-center gap-2"
            onClick={() => goTo(url)}
          >
            <span>➡️</span>
            <span>{language === 'fr' ? `Voir tout dans ${label}` : language === 'ar' ? `عرض الكل في ${label}` : language === 'en' ? `See all in ${label}` : language === 'it' ? `Vedi tutto in ${label}` : `Все в ${label}`}</span>
          </li>
        );
      }

      if (q.trim().length >= 2) {
        const url = buildEntrepriseUrl({
          q: q.trim(),
          ville: city.trim() || undefined
        });
        return (
          <li
            className="py-2.5 px-2 font-medium cursor-pointer hover:bg-gray-50 rounded transition text-gray-700 flex items-center gap-2"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => goTo(url)}
          >
            <span>➡️</span>
            <span>{t(language as Lang, 'search.seeAll')}</span>
          </li>
        );
      }
    }

    if (!isGlobal && q.trim().length >= 2) {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (city.trim()) params.set('ville', city.trim());
      return (
        <li
          className="py-2.5 px-2 font-medium cursor-pointer hover:bg-orange-50 rounded transition text-orange-700 flex items-center gap-2"
          onClick={() => goTo(`/recherche?${params.toString()}`)}
        >
          <span>➡️</span>
          <span>{t(language as Lang, 'search.seeAll')}</span>
        </li>
      );
    }

    return null;
  };

  const hasResults = q.trim().length >= MIN_CHARS && (ent.length > 0 || !loadingEnt || showSeeAllItem);
  const shouldRenderDropdown = hasResults;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={`public-search relative w-full ${className ?? ''}`}
      data-search-bar="true"
      data-search-scope={isGlobal ? 'entreprise-ville' : `entreprise-ville:${scope}`}
      data-component-name="SearchBar"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="relative z-10">
          <input
            type="search"
            inputMode="search"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            dir={dir}
            aria-label={t(language as Lang, 'search.placeholderQuery')}
            placeholder={t(language as Lang, 'search.placeholderQuery')}
            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37] bg-white text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
            value={q}
            onChange={onChangeQ}
            onFocus={() => q.trim().length >= MIN_CHARS && onChangeQ({ currentTarget: { value: q } } as any)}
          />
        </div>
        <div className="relative z-10">
          <LocationSelectTunisie
            value={city}
            onChange={setCity}
            placeholder={t(language as Lang, 'search.placeholderCity')}
            className="px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      {shouldRenderDropdown && ReactDOM.createPortal(
        <div
          className="rounded-xl border bg-white shadow-2xl p-3 space-y-3 max-h-[60vh] overflow-auto"
          style={{
            position: 'fixed',
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 999999,
            pointerEvents: 'auto',
          }}
        >
          <ul className="divide-y">
            {renderSeeAll()}
            {ent.length > 0 ? (
              <>
                <li className="py-1 text-xs font-semibold text-gray-500 sticky top-0 bg-white">
                  Entreprises
                </li>
                {ent.slice(0, 5).map((item: any) => {
                  const displayName = item.nom;
                  const displayCategory = item.matiere || item.categorie;
                  return (
                    <li
                      key={item.id}
                      className="py-2 cursor-pointer hover:bg-gray-50"
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => handleResultClick(item)}
                    >
                      <div className="font-medium">
                        {isCertifiedBusiness(item) && (
                          <span className="mr-1 text-[#D4AF37]" aria-label="Certifiée Dalil Tounes">⭐</span>
                        )}
                        {displayName}
                        <GoogleRatingSummary rating={item['Note Google Globale']} reviewCount={item['Compteur Avis Google']} language={language} />
                      </div>
                      <div className="text-xs text-gray-500">{item.ville} · {displayCategory}</div>
                    </li>
                  );
                })}
              </>
            ) : (
              !loadingEnt && q.trim().length >= MIN_CHARS && (
                <li className="py-4 text-center text-gray-500">
                  {language === 'fr' ? 'Aucun résultat trouvé' : language === 'ar' ? 'لم يتم العثور على نتائج' : language === 'en' ? 'No results found' : language === 'it' ? 'Nessun risultato trovato' : 'Результатов не найдено'}
                </li>
              )
            )}
          </ul>
          <div className="text-xs text-gray-500 pt-1">
            {loadingEnt && <span>{language === 'fr' ? 'Chargement...' : language === 'ar' ? 'جارٍ التحميل...' : language === 'en' ? 'Loading...' : language === 'it' ? 'Caricamento...' : 'Загрузка...'}</span>}
            {!loadingEnt && ent.length > 0 && <span>{language === 'fr' ? 'Entreprises' : language === 'ar' ? 'الشركات' : language === 'en' ? 'Businesses' : language === 'it' ? 'Aziende' : 'Компании'}: {ent.length}</span>}
            {errEnt && <span className="text-red-600">{language === 'fr' ? 'Erreur' : language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : language === 'it' ? 'Errore' : 'Ошибка'}</span>}
          </div>
        </div>,
        document.body
      )}

      <div className="mt-3 flex justify-center">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-[#B62226] text-white text-sm font-semibold hover:bg-[#931D23] transition-colors shadow-sm hover:shadow-md"
          style={{ border: '1px solid #D4AF37' }}
        >
          {t(language as Lang, 'search.searchBtn')}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[#292725]">
          <span
            aria-hidden="true"
            style={{
              color: '#FFC107',
              fontSize: '1.5em',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >★</span> {preferredTitle || t(language as Lang, 'search.preferredTitle')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {preferredSubtitle || t(language as Lang, 'search.preferredSubtitle')}
        </p>
      </div>

      <div className="mt-3 flex rounded-lg border border-[#D4AF37] bg-white overflow-hidden text-sm" dir={dir}>
        {([
          { value: '' as CertFilter, label: t(language as Lang, 'search.certAll') },
          { value: 'certifie' as CertFilter, label: t(language as Lang, 'search.certCertified') },
          { value: 'non_certifie' as CertFilter, label: t(language as Lang, 'search.certNonCertified') },
        ] as { value: CertFilter; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCertFilter(value)}
            aria-pressed={certFilter === value}
            className="flex-1 px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              backgroundColor: certFilter === value
                ? value === 'certifie' ? '#15803d' : value === 'non_certifie' ? '#c2410c' : '#D4AF37'
                : 'transparent',
              color: certFilter === value ? '#fff' : value === 'certifie' ? '#15803d' : value === 'non_certifie' ? '#c2410c' : '#6b7280',
              borderRight: value !== 'non_certifie' ? '1px solid #D4AF3740' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}
