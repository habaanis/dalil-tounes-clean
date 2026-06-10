import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { detectIntent, getCategoryRoute, getCategoryDisplayName, PageCategorie } from '../lib/intentDetection';
import { FORCE_ENTERPRISE_ONLY } from '../config/searchMode';
import { expandQuery, rankItemByQuery, MIN_CHARS } from '../lib/searchSynonyms';
import { expandCityVariants } from '../lib/geoAliases';
import { buildEntrepriseUrl } from '../lib/url';
import { useLanguage } from '../context/LanguageContext';
import { t, isRTL, type Lang } from '../lib/i18n';
import { normalizeText } from '../lib/textNormalization';
import LocationSelectTunisie from './LocationSelectTunisie';

type CertFilter = '' | 'certifie' | 'non_certifie';

type Scope = 'global' | 'sante' | 'education' | 'administration' | 'loisirs' | 'magasin' | 'marche_local' | 'tourism' | 'services';
type Mode = 'entreprises' | 'annonces' | 'evenements';

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
};

export default function SearchBar({
  scope,
  mode = 'entreprises',
  intentEnabled = false,
  showSeeAllItem = true,
  className = '',
  enabled = true,
  autoSearch = false,
}: Props) {
  if (!enabled) return null;

  mode = 'entreprises';
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dir = isRTL(language as Lang) ? 'rtl' : 'ltr';

  const [q, setQ] = React.useState('');
  const [city, setCity] = React.useState('');
  const [metier] = React.useState('');
  const [certFilter, setCertFilter] = React.useState<CertFilter>('');
  const [ent, setEnt] = React.useState<ResultItem[]>([]);
  const [villes, setVilles] = React.useState<VilleItem[]>([]);
  const [loadingEnt, setLoadingEnt] = React.useState(false);
  const [loadingVille, setLoadingVille] = React.useState(false);
  const [errEnt, setErrEnt] = React.useState<string | null>(null);
  const [errVille, setErrVille] = React.useState<string | null>(null);
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

  // Only simple-name TEXT columns -- no ARRAY columns, no spaces in names.
  // ARRAY columns (categorie, sous_categories, secteur, tags, liste_pages)
  // and space-name columns (mots cles recherche) are handled in JS scoring only.
  const OR_SAFE_FIELDS = [
    'nom', 'ville', 'gouvernorat', 'adresse', 'description',
    'sous_categories_texte', 'sous_categories_clean',
    'name_ar', 'services',
  ];

  function rowToSearchableText(row: any): string {
    const textFields = [
      row.nom, row.ville, row.gouvernorat, row.adresse,
      row.description, row.sous_categories_texte, row.sous_categories_clean,
      row.name_ar, row.services, row.statut_carte,
      row['mots cles recherche'],
    ];
    const arrayFields = [row.categorie, row.sous_categories, row.secteur, row.tags];
    for (const arr of arrayFields) {
      if (Array.isArray(arr)) textFields.push(arr.join(' '));
      else if (typeof arr === 'string') textFields.push(arr);
    }
    return normalizeText(textFields.filter(Boolean).join(' '));
  }

  function scoreResult(row: any, words: string[]): number {
    const nom = normalizeText(row.nom || '');
    const fullQ = words.join(' ');
    let score = 0;

    if (nom === fullQ) score += 100;
    else if (nom.startsWith(fullQ)) score += 80;
    else if (nom.includes(fullQ)) score += 60;

    const geoText = normalizeText([row.ville, row.gouvernorat, row.adresse].filter(Boolean).join(' '));
    const catText = normalizeText([
      row.sous_categories_texte, row.sous_categories_clean, row.services,
      row['mots cles recherche'],
      Array.isArray(row.categorie) ? row.categorie.join(' ') : row.categorie,
      Array.isArray(row.tags) ? row.tags.join(' ') : row.tags,
    ].filter(Boolean).join(' '));

    for (const w of words) {
      if (nom.startsWith(w)) score += 40;
      else if (nom.includes(w)) score += 25;

      if (geoText.startsWith(w) || geoText.includes(` ${w}`)) score += 20;
      else if (geoText.includes(w)) score += 12;

      if (catText.includes(w)) score += 15;

      if (normalizeText(row.description || '').includes(w)) score += 5;
    }

    const sc = normalizeText(row.statut_carte || '');
    if (sc.includes('certifie') && !sc.includes('non')) score += 3;
    if (row.is_premium) score += 2;

    return score;
  }

  const runSearch = React.useCallback(async (qValue: string, cityValue: string, cert: CertFilter) => {
    const trimmedValue = qValue.trim();

    if (trimmedValue.length < MIN_CHARS) {
      setEnt([]);
      return;
    }

    const cacheKey = `${normalizeText(trimmedValue)}-${cityValue}-${scope}-${cert}`;
    if (cache.current.has(cacheKey)) {
      setEnt(cache.current.get(cacheKey)!);
      return;
    }

    setLoadingEnt(true);
    setErrEnt(null);
    try {
      let allResults: any[] = [];

      if (scope === 'education') {
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
        allResults = resp.data || [];
      } else {
        const words = normalizeText(trimmedValue).split(/\s+/).filter(w => w.length >= 2);
        if (words.length === 0) {
          setEnt([]);
          setLoadingEnt(false);
          return;
        }

        // Build .or() using only safe text columns (no arrays, no space-names)
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
          .select('*')
          .or(orParts.join(','))
          .limit(40);

        if (cityTrimmed.length > 0) {
          const cityPattern = `%${cityTrimmed}%`;
          query = query.or(`gouvernorat.ilike.${cityPattern},ville.ilike.${cityPattern},adresse.ilike.${cityPattern}`);
        }

        if (scope === 'magasin') {
          query = query.eq('"page commerce local"', true);
        }

        const resp = await query;

        if (resp.error) {
          console.error('[Search] query error:', resp.error);
          setErrEnt(resp.error.message);
          setEnt([]);
          setLoadingEnt(false);
          return;
        }

        console.log('[Search] raw Supabase results:', resp.data?.length,
          resp.data?.slice(0, 5).map((r: any) => ({ nom: r.nom, ville: r.ville, gouvernorat: r.gouvernorat })));

        const rawRows = resp.data || [];

        let scored = rawRows.map((row: any) => {
          const s = scoreResult(row, words);
          return { ...row, _score: s, ville: row.ville || row.gouvernorat || '' };
        });

        if (words.length > 1) {
          const beforeFilter = scored.length;
          scored = scored.filter((r: any) => {
            const allText = rowToSearchableText(r);
            return words.every(w => allText.includes(w));
          });
          console.log('[Search] multi-word filter:', beforeFilter, '->', scored.length);
        }

        scored.sort((a: any, b: any) => b._score - a._score);

        if (cert) {
          scored = scored.filter((r: any) => {
            const sc = normalizeText(r.statut_carte || '');
            const isNon = sc.includes('non');
            if (cert === 'certifie') return sc.includes('certifie') && !isNon;
            if (cert === 'non_certifie') return !sc.includes('certifie') || isNon;
            return true;
          });
        }

        allResults = scored.slice(0, 8);
        console.log('[Search] scored results:', allResults.map((r: any) => ({ nom: r.nom, score: r._score, ville: r.ville })));
      }

      cache.current.set(cacheKey, allResults);
      if (cache.current.size > 50) {
        const firstKey = cache.current.keys().next().value;
        cache.current.delete(firstKey);
      }

      setEnt(allResults);
    } catch (err) {
      console.error('[Search] error:', err);
      setErrEnt(err instanceof Error ? err.message : 'Erreur de recherche');
      setEnt([]);
    } finally {
      setLoadingEnt(false);
    }
  }, [scope, metier]);

  const onChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value ?? '';
    setQ(v);
    if (tEnt.current) window.clearTimeout(tEnt.current);
    tEnt.current = window.setTimeout(() => {
      runSearch(v, city, certFilter);
    }, 100);
  };

  React.useEffect(() => {
    if (q.trim().length < MIN_CHARS) return;
    if (tEnt.current) window.clearTimeout(tEnt.current);
    tEnt.current = window.setTimeout(() => {
      runSearch(q, city, certFilter);
    }, 50);
  }, [certFilter, city]);

  const onChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value ?? '';
    setCity(v);
    if (tVille.current) window.clearTimeout(tVille.current);
    tVille.current = window.setTimeout(async () => {
      if (v.trim().length < MIN_CHARS) {
        setVilles([]);
        return;
      }
      setLoadingVille(true);
      setErrVille(null);
      try {
        const variants = expandCityVariants(v, language as Lang);
        const allCities: VilleItem[] = [];

        for (const variant of variants) {
          const resp = await supabase
            .from(Tables.CITIES)
            .select('ville')
            .ilike('ville', like(variant))
            .order('ville', { ascending: true })
            .limit(8);

          if (resp.data) {
            allCities.push(...resp.data);
          }
          if (resp.error) setErrVille(resp.error.message);
        }

        const seen = new Set<string>();
        const unique = allCities.filter(c => {
          const key = normalizeText(c.ville);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setVilles(unique.slice(0, 8));
      } finally {
        setLoadingVille(false);
      }
    }, 200);
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
            <span>Voir tout dans {label}</span>
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

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={`relative w-full ${className ?? ''}`}
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

      {hasResults && ReactDOM.createPortal(
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
                      onClick={() => goTo(`#/entreprises/${item.id}`)}
                    >
                      <div className="font-medium">
                        {typeof item.statut_carte === 'string' && normalizeText(item.statut_carte).includes('certifie dalil tounes') && (
                          <span className="mr-1 text-[#D4AF37]" aria-label="Certifié Dalil Tounes">⭐</span>
                        )}
                        {displayName}
                        {(() => {
                          const googleNote = item['Note Google Globale'] ?? item.note_google_globale;
                          const num = typeof googleNote === 'number' ? googleNote : googleNote != null ? parseFloat(googleNote) : null;
                          return typeof num === 'number' && Number.isFinite(num) && num >= 4 ? (
                            <span className="ml-1 text-[#D4AF37]" aria-label="Note Google >= 4">★</span>
                          ) : null;
                        })()}
                      </div>
                      <div className="text-xs text-gray-500">{item.ville} · {displayCategory}</div>
                    </li>
                  );
                })}
              </>
            ) : (
              !loadingEnt && q.trim().length >= MIN_CHARS && (
                <li className="py-4 text-center text-gray-500">
                  Aucun résultat trouvé
                </li>
              )
            )}
          </ul>
          <div className="text-xs text-gray-500 pt-1">
            {loadingEnt && <span>Chargement...</span>}
            {!loadingEnt && ent.length > 0 && <span>Entreprises: {ent.length}</span>}
            {errEnt && <span className="text-red-600">Erreur: {errEnt}</span>}
          </div>
        </div>,
        document.body
      )}

      <div className="mt-3 flex justify-center">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-[#4A1D43] text-white text-sm font-semibold hover:bg-[#5A2D53] transition-colors shadow-sm hover:shadow-md"
          style={{ border: '1px solid #D4AF37' }}
        >
          {t(language as Lang, 'search.searchBtn')}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[#4A1D43]">
          <span
            aria-hidden="true"
            style={{
              color: '#FFC107',
              fontSize: '1.5em',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >★</span> {t(language as Lang, 'search.preferredTitle')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {t(language as Lang, 'search.preferredSubtitle')}
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