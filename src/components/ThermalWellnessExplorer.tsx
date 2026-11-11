import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { isPlatformAppMode } from '../lib/platformAppMode';

type ThermalKind = 'thermalisme' | 'sources-naturelles' | 'bien-etre';
type ThermalPlace = { id: string; nom: string; ville: string | null; gouvernorat: string | null; description: string | null; slug: string | null };
const THERMAL_SLUGS = [
  'station-thermale-de-korbous',
  'royal-tulip-korbous-bay-thalasso-springs',
  'el-mouradi-hammam-bourguiba-centre-thermal',
  'station-thermale-de-djebel-oust',
  'station-thermale-chanchou',
  'hammam-bent-jedidi-bains-thermaux',
];
const NATURAL_SOURCES = [
  'Aïn El Atrous · Korbous',
  'Aïn Echfa · Korbous',
  'Aïn Fakroun · Korbous',
  'Hammam Zriba · Zaghouan',
  'Hammam Mellegue · Le Kef',
  'Hammam Trozza · Kairouan',
];
const labels = {
  fr: { title: 'Thermalisme, sources naturelles et bien-être', intro: 'Découvrez les établissements et les sources thermales de Tunisie.', kind: 'Type de recherche', thermal: 'Thermalisme', natural: 'Sources naturelles', wellness: 'Bien-être', all: 'Toutes les régions', region: 'Région', search: 'Rechercher un lieu', loading: 'Chargement des lieux…', none: 'Aucun établissement publié ne correspond à ces critères.', naturalNote: 'Ces sources naturelles sont identifiées mais leur accès, leur sécurité et leurs conditions de visite sont encore en vérification. Elles ne sont pas présentées comme des centres médicaux.', caution: 'Vérifiez les horaires, les conditions d’accès et les prestations auprès du gestionnaire. Les eaux chaudes ne remplacent pas un avis médical.', detail: 'Voir la fiche' },
  ar: { title: 'المياه المعدنية الحارة والعيون الطبيعية والرفاه', intro: 'اكتشف المحطات الحرارية والعيون الطبيعية في تونس.', kind: 'نوع البحث', thermal: 'الحمامات المعدنية', natural: 'العيون الطبيعية', wellness: 'العناية والاسترخاء', all: 'كل المناطق', region: 'المنطقة', search: 'ابحث عن مكان', loading: 'جار التحميل…', none: 'لا توجد مؤسسات منشورة بهذه المعايير.', naturalNote: 'هذه العيون الطبيعية قيد التحقق من إمكانية الوصول إليها وسلامتها وشروط زيارتها. ليست مراكز طبية.', caution: 'تأكد من المواعيد وشروط الدخول والخدمات مباشرة. المياه الساخنة لا تعوض الاستشارة الطبية.', detail: 'عرض البطاقة' },
  en: { title: 'Thermal baths, natural springs and wellness', intro: 'Discover thermal facilities and natural hot springs in Tunisia.', kind: 'Search type', thermal: 'Thermal baths', natural: 'Natural springs', wellness: 'Wellness', all: 'All regions', region: 'Region', search: 'Search for a place', loading: 'Loading places…', none: 'No published facility matches your criteria.', naturalNote: 'These natural springs are being checked for access, safety and visiting conditions. They are not medical facilities.', caution: 'Confirm opening times, access and services with the operator. Hot springs do not replace medical advice.', detail: 'View details' },
  it: { title: 'Terme, sorgenti naturali e benessere', intro: 'Scopri le strutture termali e le sorgenti calde in Tunisia.', kind: 'Tipo di ricerca', thermal: 'Terme', natural: 'Sorgenti naturali', wellness: 'Benessere', all: 'Tutte le regioni', region: 'Regione', search: 'Cerca un luogo', loading: 'Caricamento…', none: 'Nessuna struttura pubblicata corrisponde alla ricerca.', naturalNote: 'Accesso, sicurezza e condizioni di visita di queste sorgenti sono in verifica. Non sono centri medici.', caution: 'Verifica orari e condizioni con il gestore. Le acque calde non sostituiscono un parere medico.', detail: 'Vedi scheda' },
  ru: { title: 'Термальные купальни, природные источники и отдых', intro: 'Откройте термальные комплексы и природные источники Туниса.', kind: 'Тип поиска', thermal: 'Термальные купальни', natural: 'Природные источники', wellness: 'Отдых и спа', all: 'Все регионы', region: 'Регион', search: 'Поиск места', loading: 'Загрузка…', none: 'Подходящих опубликованных объектов нет.', naturalNote: 'Доступ, безопасность и условия посещения этих источников проверяются. Это не медицинские центры.', caution: 'Уточняйте часы работы, условия и услуги у оператора. Горячие источники не заменяют консультацию врача.', detail: 'Подробнее' },
} as const;

const kindOf = (place: ThermalPlace): ThermalKind =>
  /royal.tulip/i.test(place.nom) ? 'bien-etre' : 'thermalisme';

export default function ThermalWellnessExplorer({ initialKind = 'thermalisme' }: { initialKind?: ThermalKind }) {
  const { language } = useLanguage();
  const lang = (language in labels ? language : 'fr') as keyof typeof labels;
  const text = labels[lang];
  const [kind, setKind] = useState<ThermalKind>(initialKind);
  useEffect(() => { setKind(initialKind); }, [initialKind]);
  const [region, setRegion] = useState('');
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<ThermalPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    void supabase.from('entreprise')
      .select('id,nom,ville,gouvernorat,description,slug')
      .in('slug', THERMAL_SLUGS)
      .eq('approved', true).eq('statut_publication', 'Publié')
      .then(({ data, error: failure }) => {
        if (!alive) return;
        setPlaces((data || []) as ThermalPlace[]);
        setError(Boolean(failure));
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);
  const regions = useMemo(() => [...new Set(places.map(p => p.gouvernorat).filter((x): x is string => !!x))].sort(), [places]);
  const filtered = useMemo(() => places.filter(p => kindOf(p) === kind && (!region || p.gouvernorat === region) &&
    (!query || [p.nom,p.ville,p.gouvernorat,p.description].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()))), [places,kind,region,query]);
  if (isPlatformAppMode()) {
    const categories = [
      { key: 'thermalisme' as const, label: text.thermal },
      { key: 'sources-naturelles' as const, label: text.natural },
      { key: 'bien-etre' as const, label: text.wellness },
    ];
    const filterLabel = lang === 'fr' ? 'Affiner la recherche' : lang === 'ar' ? 'تصفية البحث' : lang === 'en' ? 'Refine search' : lang === 'it' ? 'Filtra la ricerca' : 'Уточнить поиск';
    const openLabel = lang === 'fr' ? 'Ouvrir la fiche' : text.detail;
    const naturalList = NATURAL_SOURCES.filter(name => !query || name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    return <section data-platform-thermalism className="space-y-3 px-3 py-3" dir={lang === 'ar' ? 'rtl' : 'ltr'} aria-label={text.title}>
      <div role="group" aria-label={text.kind} className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#F5EEDF] p-1.5">
        {categories.map(c => <button key={c.key} type="button" onClick={() => { setKind(c.key); setRegion(''); setQuery(''); }}
          aria-pressed={kind === c.key}
          className={`min-h-12 rounded-lg px-1 py-2 text-center text-[11px] font-medium leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36] ${kind === c.key ? 'bg-[#4A1D43] text-white shadow-sm' : 'bg-white text-[#4A1D43]'}`}>{c.label}</button>)}
      </div>
      <details className="group rounded-xl border border-[#D4AF37]/45 bg-white px-3 py-2">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#4A1D43] [&::-webkit-details-marker]:hidden">
          {filterLabel}<span aria-hidden="true" className="text-[#A17D36] group-open:rotate-180">⌄</span>
        </summary>
        <div className="space-y-2 border-t border-[#E9DBC4] pb-1 pt-3">
          {kind !== 'sources-naturelles' && <label className="block text-xs font-medium text-[#4A1D43]">{text.region}
            <select value={region} onChange={e => setRegion(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-[#D4AF37]/60 bg-white px-3 text-sm">
              <option value="">{text.all}</option>{regions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>}
          <label className="block text-xs font-medium text-[#4A1D43]">{text.search}
            <input value={query} onChange={e => setQuery(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-[#D4AF37]/60 px-3 text-sm" placeholder={text.search} />
          </label>
        </div>
      </details>
      {kind === 'sources-naturelles' ? <>
        <div className="rounded-xl bg-[#FFF8E9] p-3 text-xs leading-5 text-[#6F5D43]">{text.naturalNote}</div>
        <div className="space-y-2">{naturalList.map(name => <div key={name} className="rounded-xl border border-[#E6D6B9] bg-white p-3 text-sm font-medium text-[#4A1D43]">♨️ {name}</div>)}</div>
      </> : loading ? <p role="status" className="p-3 text-sm text-[#594052]">{text.loading}</p>
        : error ? <p role="alert" className="p-3 text-sm text-[#594052]">{text.none}</p>
        : filtered.length === 0 ? <p className="rounded-xl border border-[#D4AF37]/40 bg-white p-3 text-sm text-[#594052]">{text.none}</p>
        : <div className="space-y-2" aria-live="polite">
          {filtered.map(place => <article key={place.id} className="rounded-xl border border-[#E6D6B9] bg-white p-3">
            <Link to={'/entreprise/id/' + encodeURIComponent(place.id)} className="flex min-h-12 items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-5 text-[#4A1D43]">{place.nom}</span>
                <span className="mt-1 block text-xs text-[#756B70]">{[place.ville, place.gouvernorat].filter(Boolean).join(' · ')}</span>
              </span>
              <span aria-label={openLabel} className="shrink-0 text-lg text-[#A17D36]" aria-hidden="true">›</span>
            </Link>
          </article>)}
        </div>}
      <p className="rounded-xl bg-[#F8F2E6] p-3 text-xs leading-5 text-[#675B61]">{text.caution}</p>
    </section>;
  }
  return <section dir={lang === 'ar' ? 'rtl' : 'ltr'} className="mx-auto my-5 max-w-5xl rounded-2xl border border-[#D4AF37]/60 bg-white p-4 shadow-sm sm:p-6" aria-label={text.title}>
    <h2 className="text-lg font-semibold text-[#4A1D43]">♨️ {text.title}</h2>
    <p className="mt-1 text-sm text-gray-600">{text.intro}</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <label className="text-sm font-medium text-[#4A1D43]">{text.kind}
        <select value={kind} onChange={e=>setKind(e.target.value as ThermalKind)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2">
          <option value="thermalisme">{text.thermal}</option>
          <option value="sources-naturelles">{text.natural}</option>
          <option value="bien-etre">{text.wellness}</option>
        </select>
      </label>
      <label className="text-sm font-medium text-[#4A1D43]">{text.region}
        <select value={region} onChange={e=>setRegion(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2">
          <option value="">{text.all}</option>{regions.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-[#4A1D43]">{text.search}
        <input value={query} onChange={e=>setQuery(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2" placeholder={text.search}/>
      </label>
    </div>
    {kind === 'sources-naturelles' ? <div className="mt-4 rounded-xl bg-amber-50 p-3">
      <p className="mb-2 text-sm text-amber-950">{text.naturalNote}</p>
      <ul className="grid gap-1 text-sm text-gray-700 sm:grid-cols-2">{NATURAL_SOURCES.filter(s=>!query || s.toLocaleLowerCase().includes(query.toLocaleLowerCase())).map(s=><li key={s}>• {s}</li>)}</ul>
    </div> : loading ? <p className="mt-4 text-sm">{text.loading}</p> : error ? <p role="alert" className="mt-4 text-sm text-red-700">{text.none}</p> :
      filtered.length === 0 ? <p className="mt-4 text-sm text-gray-600">{text.none}</p> :
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{filtered.map(p=><article key={p.id} className="rounded-xl border border-[#D4AF37]/40 p-3">
        <p className="font-semibold text-[#4A1D43]">{p.nom}</p><p className="mt-1 text-xs text-gray-500">{[p.ville,p.gouvernorat].filter(Boolean).join(' · ')}</p>
        {p.description && <p className="mt-2 line-clamp-3 text-sm text-gray-700">{p.description}</p>}
        <Link to={'/entreprise/id/' + encodeURIComponent(p.id)} className="mt-3 inline-block text-sm font-semibold text-[#4A1D43] underline">{text.detail}</Link>
      </article>)}</div>}
    <p className="mt-4 text-xs text-gray-500">{text.caution}</p>
  </section>;
}
