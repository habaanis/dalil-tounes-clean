import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

type Proposal = {
  id: string; user_id: string; entreprise_id: string; title: string;
  category: string | null; description: string; mode: 'quote'|'order';
  price: number|null; photo_path: string|null; status: 'pending'|'approved'|'rejected';
  created_at: string;
};

export default function AdminBoutiqueProposals() {
  const { user, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState<Proposal[]>([]);
  const [images, setImages] = useState<Record<string,string>>({});
  const [busy, setBusy] = useState<string|null>(null);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    if (!user?.id || !admin) return;
    const {data,error} = await supabase.from('dalil_boutique_product_requests')
      .select('id,user_id,entreprise_id,title,category,description,mode,price,photo_path,status,created_at')
      .eq('status','pending').order('created_at',{ascending:true}).limit(100);
    if (error) { setFeedback('Impossible de charger les propositions.'); return; }
    setRows((data ?? []) as Proposal[]);
  },[user?.id,admin]);

  useEffect(() => {
    let mounted=true;
    setChecking(true); setAdmin(false);
    if (authLoading || !user?.id) { setChecking(false); return; }
    void supabase.rpc('dalil_boutique_is_admin').then(({data,error}) => {
      if (!mounted) return;
      setAdmin(!error && data === true);setChecking(false);
    });
    return () => { mounted=false; };
  },[authLoading,user?.id]);
  useEffect(() => { void load(); },[load]);
  useEffect(() => {
    if (!admin) return;
    let active=true;
    const paths=rows.filter(row=>row.photo_path && !images[row.id]);
    if (paths.length === 0) return;
    void Promise.all(paths.map(async row => {
      const {data,error}=await supabase.storage.from('dalil-boutique-submissions')
        .createSignedUrl(row.photo_path!,60);
      return {id:row.id,url:!error ? data?.signedUrl : undefined};
    })).then(items => {
      if (active) setImages(current=>({
        ...current,...Object.fromEntries(items.filter(item=>item.url).map(item=>[item.id,item.url!]))
      }));
    });
    return () => {active=false;};
  },[admin,rows,images]);

  const reject = async (id:string) => {
    setBusy(id);setFeedback('');
    const {error} = await supabase.from('dalil_boutique_product_requests')
      .update({status:'rejected',reviewed_at:new Date().toISOString()})
      .eq('id',id).eq('status','pending');
    if (error) setFeedback('Refus non enregistré : vérifiez les droits administrateur.');
    else { setFeedback('Proposition refusée. Aucune publication.'); await load(); }
    setBusy(null);
  };

  if (authLoading || checking) return <main className="min-h-screen bg-[#fbf8f0] p-6" role="status">Vérification des droits…</main>;
  if (!user || !admin) return <main className="min-h-screen bg-[#fbf8f0] p-6">
    <h1 className="text-lg font-semibold">Accès réservé</h1>
    <p className="mt-2 text-sm">La modération de la Boutique est réservée aux administrateurs autorisés.</p>
    <Link to="/connexion" className="mt-4 inline-block underline">Connexion</Link>
  </main>;
  return <main className="min-h-screen bg-[#fbf8f0] px-4 py-7 text-[#452f2b]">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold">Modération des propositions Boutique</h1>
      <p className="my-3 text-sm text-gray-700">Les photos restent privées. Un refus est possible ici. La validation et la publication d'un produit restent dans le parcours administratif existant, après vérification des images et informations.</p>
      <button type="button" onClick={()=>void load()} className="mb-4 rounded-lg border border-[#d9c39a] bg-white px-4 py-2 text-sm">Actualiser</button>
      {feedback && <p role="status" className="mb-4 text-sm">{feedback}</p>}
      {rows.length===0 && <p className="rounded-xl bg-white p-5 text-sm">Aucune proposition en attente.</p>}
      <div className="space-y-4">{rows.map(row=><article key={row.id} className="rounded-xl border border-[#dfcda8] bg-white p-4">
        <h2 className="font-semibold text-[#642e31]">{row.title}</h2>
        <p className="mt-1 break-all text-xs text-gray-600">Entreprise : {row.entreprise_id}</p>
        {row.category && <p className="mt-2 text-sm">Catégorie : {row.category}</p>}
        <p className="mt-2 whitespace-pre-wrap text-sm">{row.description || 'Aucune description'}</p>
        <p className="mt-2 text-sm">{row.mode==='quote'?'Sur devis':`Prix proposé : ${row.price ?? '—'} TND`}</p>
        {row.photo_path && (images[row.id] ? <img src={images[row.id]} alt={`Photo proposée pour ${row.title}`} className="mt-3 max-h-64 w-full rounded-lg object-contain" /> : <p className="mt-3 text-xs">Photo privée en cours de chargement ou inaccessible</p>)}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={busy===row.id} onClick={()=>void reject(row.id)} className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800 disabled:opacity-60">
            {busy===row.id?'Traitement…':'Refuser la proposition'}
          </button>
          <span className="self-center text-xs text-gray-600">Publication manuelle uniquement</span>
        </div>
      </article>)}</div>
    </div>
  </main>;
}
