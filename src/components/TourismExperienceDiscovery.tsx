import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UNESCO_TUNISIA_WORLD_HERITAGE, UNESCO_TUNISIA_INTANGIBLE, UNESCO_SOURCES } from '../data/tunisiaUnesco';

type LocalExperience = {
  id: string; nom: string | null; ville: string | null; gouvernorat: string | null;
  description: string | null; a_propos: string | null; image_url: string | null;
};
const PAGE_SIZE = 6;
// UNESCO status is recorded only for individually verified experiences, never inferred from a governorate.
const verifiedUnescoExperienceIds = new Set<string>();
function uniqueExperiences(rows: LocalExperience[]) {
  const byName = new Map<string, LocalExperience>();
  for (const item of rows) {
    const key = (item.nom || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
    if (!key) continue;
    const existing = byName.get(key);
    if (!existing || (item.id.startsWith('rec') && !existing.id.startsWith('rec'))) byName.set(key, item);
  }
  return [...byName.values()];
}
const categories = [
  ['all', 'Toutes les expériences'], ['artisanat', 'Artisanat'], ['nature', 'Nature et randonnées'],
  ['gastronomie', 'Gastronomie'], ['agriculture', 'Fermes et terroir'],
  ['patrimoine', 'Patrimoine'], ['hebergement', 'Hébergements']
] as const;
function classify(e: LocalExperience) {
  const v = [e.nom, e.description, e.a_propos].filter(Boolean).join(' ').toLocaleLowerCase();
  if (/h.bergement|g.te|maison d.h.te|colodge|campement/.test(v)) return 'hebergement';
  if (/randonn|guide|trek|montagne|sp.l.olog|for.t|excursion/.test(v)) return 'nature';
  if (/cuisine|gastronom|repas|restaurant|table d.h.te|p.tisser/.test(v)) return 'gastronomie';
  if (/ferme|ol.iv|agricol|oasis|palmeraie|dattes|apicult|terroir/.test(v)) return 'agriculture';
  if (/artisan|tiss|poterie|laine|atelier|alfa|calligraph/.test(v)) return 'artisanat';
  return 'patrimoine';
}
export default function TourismExperienceDiscovery() {
  const [items, setItems] = useState<LocalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [kind, setKind] = useState('all');
  const [page, setPage] = useState(1);
  const [unescoOnly, setUnescoOnly] = useState(false);
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase.from('entreprise')
        .select('id,nom,ville,gouvernorat,description,a_propos,image_url')
        .contains('liste_pages', ['tourisme local & expatriation'])
        .contains('categorie', ['tourisme&expatriation'])
        .eq('approved', true).eq('statut_publication', 'Publié')
        .order('nom', { ascending: true }).limit(500);
      if (!active) return;
      setItems(uniqueExperiences((data || []) as LocalExperience[]));
      setError(Boolean(error));
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);
  const regions = useMemo(() => [...new Set(items.map(i => i.gouvernorat).filter((x): x is string => !!x))].sort((a,b)=>a.localeCompare(b, 'fr')), [items]);
  const matches = useMemo(() => items.filter(item => {
    if (region && item.gouvernorat !== region) return false;
    if (unescoOnly && !verifiedUnescoExperienceIds.has(item.id)) return false;
    if (kind !== 'all' && classify(item) !== kind) return false;
    const text = [item.nom,item.ville,item.gouvernorat,item.description,item.a_propos].filter(Boolean).join(' ').toLocaleLowerCase();
    return !query.trim() || text.includes(query.trim().toLocaleLowerCase());
  }), [items, query, region, kind, unescoOnly]);
  useEffect(() => { setPage(1); }, [query, region, kind, unescoOnly]);
  const totalPages = Math.ceil(matches.length / PAGE_SIZE);
  const pageItems = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <section className="mx-auto max-w-5xl px-4 py-7" aria-label="Découvrir les expériences locales">
    <div className="rounded-2xl border border-[#D4AF37]/60 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-[#4A0404]">Rencontrez la Tunisie autrement</h2>
      <p className="mt-1 text-sm text-gray-600">Artisans, producteurs, guides et expériences authentiques.</p>
      <label htmlFor="local-search" className="mt-4 block text-sm font-medium">Que souhaitez-vous découvrir ?</label>
      <input id="local-search" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3" placeholder="Artisan, village, savoir-faire..." value={query} onChange={e=>setQuery(e.target.value)} />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Région<select value={region} onChange={e=>setRegion(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-3"><option value="">Toute la Tunisie</option>{regions.map(r=><option key={r} value={r}>{r}</option>)}</select></label>
        <label className="text-sm">Type d'expérience<select value={kind} onChange={e=>setKind(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-3">{categories.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={unescoOnly} onChange={e=>setUnescoOnly(e.target.checked)} className="h-4 w-4" />Patrimoine UNESCO vérifié uniquement</label>
      {unescoOnly && <p className="mt-2 text-xs text-gray-600">Seules les expériences dont le lien avec une inscription UNESCO a été confirmé apparaissent. Aucune fiche du lot actuel n’a encore ce statut.</p>
      <details className="mt-3 text-sm text-gray-700">
        <summary className="cursor-pointer text-[#4A1D43] underline">Consulter les patrimoines UNESCO vérifiés en Tunisie</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><strong>Patrimoine mondial</strong><p className="mt-1 text-xs">{UNESCO_TUNISIA_WORLD_HERITAGE.map(x => x.name).join(' · ')}</p><a href={UNESCO_SOURCES.world} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs underline">Liste officielle UNESCO</a></div>
          <div><strong>Patrimoine immatériel</strong><p className="mt-1 text-xs">{UNESCO_TUNISIA_INTANGIBLE.map(x => x.name).join(' · ')}</p><a href={UNESCO_SOURCES.intangible} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs underline">Liste officielle UNESCO</a></div>
        </div>
        <p className="mt-2 text-xs text-gray-600">Une inscription concerne un site ou un savoir-faire, pas automatiquement une entreprise proche ou un artisan pratiquant un métier similaire.</p>
      </details>}
    </div>
    <h3 className="mt-7 mb-4 text-xl font-semibold text-[#4A0404]">Expériences locales {!loading && !error && '(' + matches.length + ')'}</h3>
    {loading ? <p className="py-8 text-gray-600">Chargement des expériences…</p> : error ? <p role="alert" className="py-8 text-red-700">Le répertoire n'est pas disponible pour le moment.</p> : matches.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">Aucune expérience publiée ne correspond à ces critères.</p> :
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{pageItems.map(item=><article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex h-28 items-center justify-center bg-[#e6eae3]">{item.image_url ? <img src={item.image_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span role="img" aria-label="Drapeau tunisien" className="text-5xl">🇹🇳</span>}</div>
      <div className="p-4"><p className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={13}/>{[item.ville,item.gouvernorat].filter(Boolean).join(' · ')}</p><h4 className="mt-2 font-semibold">{item.nom}</h4><p className="mt-2 line-clamp-3 text-sm text-gray-700">{item.description || item.a_propos || 'Découvrez ce savoir-faire local.'}</p><p className="mt-3 text-xs font-medium text-[#7C591E]">À contacter à l'avance avant tout déplacement</p><Link to={'/business/'+encodeURIComponent(item.id)} className="mt-3 inline-block text-sm font-semibold text-[#4A1D43] underline">Découvrir la fiche</Link></div>
    </article>)}</div>}
    {!loading && !error && totalPages > 1 && <nav aria-label="Pages des expériences" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg border border-[#D4AF37] px-3 py-2 text-sm disabled:opacity-40">Précédent</button>
      <span className="px-2 text-sm text-gray-600">Page {page} sur {totalPages}</span>
      <button type="button" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="rounded-lg border border-[#D4AF37] px-3 py-2 text-sm disabled:opacity-40">Suivant</button>
    </nav>}
  </section>;
}
