import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Briefcase, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobAlerts from '../components/JobAlerts';


export default function AdminEmploi() {
  const [state, setState] = useState<'loading' | 'denied' | 'error' | 'ready'>('loading');
  const [counts, setCounts] = useState<number[]>([]);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => refresh());
    return () => subscription.unsubscribe();
  }, [refresh]);
  useEffect(() => {
    let cancelled = false;
    setState('loading'); setCounts([]);
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
        ] as const);
        if (results.some(r => r.error)) throw new Error('Lecture impossible');
        if (!cancelled) {
          setCounts(results.map(r => r.count ?? 0));
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
          {['Annonces enregistrées','Offres actives','En cours de vérification'].map((label,i)=><div key={label} className="rounded-xl border border-[#D4AF37]/50 bg-white p-3"><p className="text-xs text-gray-600">{label}</p><p className="text-2xl font-semibold">{counts[i]}</p></div>)}
        </div>
      </>}
    </div>
  </main>;
}
