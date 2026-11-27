import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Briefcase, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobAlerts from '../components/JobAlerts';

type Run = { id: string; recorded_at: string; status: string; found: number; verified: number; published: number; rejected: number; pending: number; sources: string[]; details: string };
type Offer = { id: string; title: string; company: string; city: string; status: string; source_url: string; review_until: string | null };

export default function AdminEmploi() {
  const [state, setState] = useState<'loading' | 'denied' | 'error' | 'ready'>('loading');
  const [runs, setRuns] = useState<Run[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [lastComplete, setLastComplete] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => refresh());
    return () => subscription.unsubscribe();
  }, [refresh]);
  useEffect(() => {
    let cancelled = false;
    setState('loading'); setRuns([]); setOffers([]); setCounts([]); setLastComplete(null);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) setState('denied'); return; }
        const { data: admin, error: adminError } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
        if (adminError) throw adminError;
        if (!admin) { if (!cancelled) setState('denied'); return; }
        const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Tunis', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
        const today = ['year', 'month', 'day'].map(key => parts.find(p => p.type === key)?.value).join('-');
        const results = await Promise.all([
          supabase.from('verified_job_offers').select('id', { count: 'exact', head: true }),
          supabase.from('verified_job_offers').select('id', { count: 'exact', head: true }).eq('status', 'published').lte('verified_at', today).gte('review_until', today),
          supabase.from('verified_job_offers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('emploi_collection_runs').select('id', { count: 'exact', head: true }),
          supabase.from('emploi_collection_runs').select('id,recorded_at,status,found,verified,published,rejected,pending,sources,details').order('recorded_at', { ascending: false }).limit(30),
          supabase.from('verified_job_offers').select('id,title,company,city,status,source_url,review_until').eq('status', 'pending').order('created_at', { ascending: false }).limit(100),
          supabase.from('emploi_collection_runs').select('recorded_at').eq('status','completed').order('recorded_at',{ascending:false}).limit(1).maybeSingle(),
        ] as const);
        if (results.some(r => r.error)) throw new Error('Lecture impossible');
        if (!cancelled) {
          setCounts(results.slice(0,4).map(r => r.count ?? 0));
          setRuns((results[4].data ?? []) as Run[]);
          setOffers((results[5].data ?? []) as Offer[]);
          setLastComplete(results[6].data?.recorded_at ?? null);
          setState('ready');
        }
      } catch { if (!cancelled) setState('error'); }
    };
    void load();
    return () => { cancelled = true; };
  }, [revision]);
  useEffect(() => {
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex, nofollow'; document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  const stale = !lastComplete || Date.now() - new Date(lastComplete).getTime() > 48 * 3600000;
  const date = (value: string) => new Date(value).toLocaleString('fr-FR', { timeZone: 'Africa/Tunis' });
  return <main className="min-h-screen bg-[#FFFCF7] p-4 text-[#292725]">
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-xl font-semibold"><Briefcase className="h-5 w-5" /> Gestion Emploi</h1>
        <button onClick={refresh} className="flex items-center gap-2 rounded-lg border border-[#D4AF37] bg-white px-3 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Actualiser</button>
      </header>
      {state === 'loading' && <p role="status">Chargement…</p>}
      {state === 'denied' && <div className="rounded-xl border border-[#D4AF37]/50 bg-white p-4"><p role="alert" className="mb-3 text-sm">Accès réservé aux administrateurs autorisés. Connectez-vous avec votre compte administrateur.</p><Link to="/login" state={{from:'/admin/emploi'}} className="inline-flex rounded-lg bg-[#292725] px-4 py-2 text-sm font-medium text-white">Se connecter</Link></div>}
      {state === 'error' && <p role="alert">Lecture impossible. Veuillez réessayer.</p>}
      {state === 'ready' && <>
        <details className="rounded-xl border border-[#D4AF37]/40 bg-white p-3"><summary className="cursor-pointer font-semibold">Gérer et tester les alertes emploi</summary><div className="mt-3"><JobAlerts adminPanel /></div></details>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {['Annonces enregistrées','Offres actives','À vérifier','Bilans enregistrés'].map((label,i)=><div key={label} className="rounded-xl border border-[#D4AF37]/50 bg-white p-3"><p className="text-xs text-gray-600">{label}</p><p className="text-2xl font-semibold">{counts[i]}</p></div>)}
        </div>
        <p role="status" className="rounded-lg border border-[#D4AF37]/50 bg-white p-3 text-sm">{stale ? 'Attention : aucun bilan complet dans les dernières 48 heures.' : 'Dernier bilan complet : ' + date(lastComplete!)}</p>
        <details className="rounded-xl border border-[#D4AF37]/40 bg-white p-3">
          <summary className="cursor-pointer font-semibold">Historique des recherches (30 derniers bilans)</summary>
          {!runs.length && <p className="text-sm">Aucun bilan enregistré.</p>}
          {runs.map(run=><details key={run.id} className="border-b py-2 text-sm"><summary className="cursor-pointer font-medium">{date(run.recorded_at)} · {run.status === 'completed' ? 'Complet' : run.status === 'partial' ? 'Partiel' : 'Échec'} · {run.published} publiées</summary><p className="mt-2">Trouvées : {run.found} · Vérifiées : {run.verified} · Publiées : {run.published} · Rejetées : {run.rejected} · En attente : {run.pending}</p><p className="mt-1 break-words">Sources : {run.sources.join(', ') || 'Non renseignées'}</p><p className="mt-1 whitespace-pre-wrap break-words">{run.details}</p></details>)}
        </details>
        <details className="rounded-xl border border-[#D4AF37]/40 bg-white p-3">
          <summary className="cursor-pointer font-semibold">Annonces à contrôler ({counts[2] ?? 0})</summary><p className="mt-2 text-xs text-gray-600">Suivi des vérifications en cours. Aucune action manuelle obligatoire.</p>
          {!offers.length && <p className="text-sm">Aucune annonce en attente.</p>}
          {offers.map(offer=><div key={offer.id} className="border-b py-2 text-sm"><p className="font-medium">{offer.title} — {offer.company}</p><p>{offer.city} · En attente</p>{offer.source_url.startsWith('https://') && <a className="underline" href={offer.source_url} target="_blank" rel="noopener noreferrer">Vérifier la source</a>}</div>)}
        </details>
      </>}
    </div>
  </main>;
}
