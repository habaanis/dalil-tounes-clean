import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Business = { id: string; nom: string | null; ville: string | null; opening_style: 'photo' | 'framed' };
export default function AdminOpeningModels() {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rows, setRows] = useState<Business[]>([]);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let live = true;
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      const access = user ? await supabase.from('admins').select('id').eq('id', user.id).maybeSingle() : null;
      if (!live) return;
      const ok = !!access?.data?.id;
      setAuthorized(ok); setChecked(true);
      if (!ok) return;
      const { data, error } = await supabase.from('entreprise').select('id,nom,ville,opening_style').order('nom').limit(1000);
      if (!live) return;
      if (error) setMessage(error.message);
      else setRows((data || []) as Business[]);
    };
    void load();
    return () => { live = false; };
  }, []);
  const filtered = useMemo(() => rows.filter(r => (r.nom + ' ' + (r.ville || '')).toLowerCase().includes(query.toLowerCase())), [query, rows]);
  const save = async (row: Business, style: 'photo' | 'framed') => {
    if (!authorized || saving || style === row.opening_style) return;
    setSaving(row.id); setMessage('');
    const { data, error } = await supabase.from('entreprise').update({opening_style:style}).eq('id',row.id).select('id,opening_style').maybeSingle();
    if (error || !data || data.opening_style !== style) setMessage(error?.message || 'Enregistrement non confirmé. Vérifiez vos droits.');
    else { setRows(old => old.map(r => r.id === row.id ? {...r,opening_style:style} : r)); setMessage('Modèle enregistré pour ' + (row.nom || 'cette entreprise')); }
    setSaving(null);
  };
  if (!checked) return <main className="p-8">Vérification des droits…</main>;
  if (!authorized) return <main className="mx-auto max-w-lg p-8"><h1 className="text-xl font-bold">Accès administrateur requis</h1><p className="mt-3">Connectez-vous avec un compte autorisé Dalil Tounes.</p></main>;
  return <main className="mx-auto max-w-5xl p-4 sm:p-8">
    <h1 className="text-2xl font-bold">Modèles d’ouverture des entreprises</h1>
    <p className="mt-2 text-sm text-gray-600">A : Photo · B : Prestige. Le choix est enregistré dans Supabase pour tous les visiteurs et futurs lancements.</p>
    <label className="mt-5 block text-sm">Rechercher une entreprise<input className="mt-1 w-full rounded-lg border p-3" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nom ou ville"/></label>
    {message && <p role="status" className="my-3 rounded-lg bg-gray-100 p-3 text-sm">{message}</p>}
    <div className="mt-4 divide-y rounded-xl border bg-white">{filtered.map(row=><div key={row.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div><strong>{row.nom || 'Entreprise'}</strong><p className="text-xs text-gray-500">{row.ville}</p></div>
      <div className="flex gap-2">
        {(['photo','framed'] as const).map((style,i)=><button key={style} type="button" disabled={saving===row.id} aria-pressed={row.opening_style===style} onClick={()=>void save(row,style)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${row.opening_style===style?'bg-[#032D21] text-white':'bg-white text-gray-700'}`}>{i===0?'A · Photo':'B · Prestige'}</button>)}
      </div>
    </div>)}</div>
  </main>;
}
