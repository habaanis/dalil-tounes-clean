import {useCallback,useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {supabase,supabaseUrl} from '../lib/supabaseClient';
import {Lightbulb,ArrowLeft,RefreshCcw} from 'lucide-react';

type Status='nouveau'|'a_etudier'|'retenu'|'termine'|'classe';
type Item={id:string;created_at:string;source:string;audience:string;category:string;language:string;message:string;contact:string|null;status:Status};
const statusLabels:Record<Status,string>={
  nouveau:'Nouveau',a_etudier:'À étudier',retenu:'Retenu',termine:'Terminé',classe:'Classé'
};
const categoryLabels:Record<string,string>={idee:'Idée',amelioration:'Amélioration',probleme:'Problème'};
const sourceLabels:Record<string,string>={site:'Site',app:'Application'};
const adminEmails=new Set(['contact@dalil-tounes.com','zenanis75@hotmail.com']);

export default function AdminSuggestions(){
 const {user,loading:authLoading}=useAuth();
 const allowed=Boolean(user?.email&&adminEmails.has(user.email.toLowerCase()));
 const [items,setItems]=useState<Item[]>([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [filter,setFilter]=useState('all');
 const [search,setSearch]=useState('');
 const [busy,setBusy]=useState<string|null>(null);
 const load=useCallback(async()=>{
   if(!allowed)return;
   setLoading(true);setError('');
   try{
     const {data:{session}}=await supabase.auth.getSession();
     if(!session?.access_token)throw Error('Connectez-vous pour consulter cet espace.');
     const res=await fetch(supabaseUrl+'/functions/v1/dalil-admin-visitor-ideas',{
       headers:{authorization:'Bearer '+session.access_token}
     });
     if(!res.ok)throw Error(res.status===403?'Accès administrateur requis.':'Impossible de charger les suggestions.');
     const json=await res.json();
     setItems(Array.isArray(json.items)?json.items:[]);
   }catch(e){setError(e instanceof Error?e.message:'Chargement indisponible.');}
   finally{setLoading(false);}
 },[allowed]);
 useEffect(()=>{void load();},[load]);
 const filtered=useMemo(()=>items.filter(item=>{
   if(filter!=='all'&&item.status!==filter)return false;
   const q=search.trim().toLocaleLowerCase('fr');
   return !q||[item.message,item.contact,item.category,item.source,item.audience].some(x=>String(x||'').toLocaleLowerCase('fr').includes(q));
 }),[items,filter,search]);
 const update=async(id:string,status:Status)=>{
   if(!allowed||busy)return;
   setBusy(id);setError('');
   try{
     const {data:{session}}=await supabase.auth.getSession();
     if(!session?.access_token)throw Error('Session expirée. Reconnectez-vous.');
     const res=await fetch(supabaseUrl+'/functions/v1/dalil-admin-visitor-ideas',{
       method:'PATCH',headers:{authorization:'Bearer '+session.access_token,'content-type':'application/json'},body:JSON.stringify({id,status})
     });
     if(!res.ok)throw Error('Modification indisponible. Réessayez.');
     setItems(rows=>rows.map(item=>item.id===id?{...item,status}:item));
   }catch(e){setError(e instanceof Error?e.message:'Modification indisponible.');}
   finally{setBusy(null);}
 };
 if(authLoading)return <main className="mx-auto max-w-4xl p-6 text-gray-700">Vérification des accès…</main>;
 if(!user||!allowed)return <main className="mx-auto max-w-lg px-5 py-16 text-gray-800">
   <h1 className="font-serif text-2xl">Espace privé — Suggestions</h1>
   <p className="mt-3 text-sm">Cet espace est réservé à l'administration de Dalil Tounes.</p>
   <Link to="/auth" className="mt-5 inline-block rounded-lg bg-[#25372e] px-4 py-2 text-white">Se connecter</Link>
 </main>;
 return <main className="min-h-screen bg-[#fbf8f1] px-4 py-8 text-[#282820]">
   <div className="mx-auto max-w-5xl space-y-5">
     <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#78684c]"><ArrowLeft className="h-4 w-4"/> Retour au site</Link>
     <header className="border-b border-[#dcca9f] pb-5">
       <div className="flex items-center gap-2 text-[#947c40]"><Lightbulb className="h-5 w-5"/><span className="text-xs uppercase tracking-widest">Administration Dalil Tounes</span></div>
       <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
         <div><h1 className="font-serif text-3xl">Suggestions reçues</h1><p className="mt-1 text-sm text-[#777265]">Idées, améliorations et problèmes signalés par les utilisateurs.</p></div>
         <button type="button" onClick={()=>void load()} className="inline-flex items-center gap-2 rounded-lg border border-[#c7ae75] bg-white px-3 py-2 text-xs"><RefreshCcw className="h-4 w-4"/> Actualiser</button>
       </div>
     </header>
     <div className="flex flex-wrap gap-2 text-xs">
       <span className="rounded-lg bg-white px-4 py-3 border border-[#e6ddc9]">Total <strong className="ml-2">{items.length}</strong></span>
       <span className="rounded-lg bg-white px-4 py-3 border border-[#e6ddc9]">Nouvelles <strong className="ml-2">{items.filter(x=>x.status==='nouveau').length}</strong></span>
       <span className="rounded-lg bg-white px-4 py-3 border border-[#e6ddc9]">Retenues <strong className="ml-2">{items.filter(x=>x.status==='retenu').length}</strong></span>
     </div>
     <div className="flex flex-wrap gap-3">
       <label className="text-xs flex-1 min-w-[180px]">Rechercher<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Mot-clé, contact…" className="mt-1 w-full rounded-lg border border-[#e1d4b6] bg-white px-3 py-2 text-sm"/></label>
       <label className="text-xs min-w-[160px]">Statut<select value={filter} onChange={e=>setFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-[#e1d4b6] bg-white px-3 py-2 text-sm"><option value="all">Tous les statuts</option>{Object.entries(statusLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
     </div>
     {error&&<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
     {loading?<p className="text-sm">Chargement…</p>:filtered.length===0?<div className="rounded-xl border border-[#e3d7b7] bg-white p-9 text-center"><Lightbulb className="mx-auto mb-3 h-7 w-7 text-[#a7894a]"/><p className="font-serif text-lg">Aucune suggestion pour le moment</p><p className="mt-1 text-sm text-gray-500">Les messages envoyés depuis le site ou l'application apparaîtront ici.</p></div>:
       <div className="space-y-3">{filtered.map(item=><article key={item.id} className="rounded-xl border border-[#e4d9c2] bg-white p-4 shadow-sm">
         <div className="flex flex-wrap items-center justify-between gap-3">
           <div className="flex flex-wrap gap-2 text-xs text-[#706c64]"><span className="font-semibold text-[#9c783f]">{categoryLabels[item.category]||item.category}</span><span>· {sourceLabels[item.source]||item.source}</span><span>· {item.audience==='professionnel'?'Professionnel':'Visiteur'}</span><span>· {new Date(item.created_at).toLocaleString('fr-FR')}</span><span>· {item.language.toUpperCase()}</span></div>
           <label className="text-xs">Statut <select aria-label="Statut de la suggestion" disabled={busy===item.id} value={item.status} onChange={e=>void update(item.id,e.target.value as Status)} className="ml-2 rounded-lg border border-[#ddcba3] bg-[#fbf7ed] px-2 py-2 text-xs">{Object.entries(statusLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
         </div>
         <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed" dir="auto">{item.message}</p>
         {item.contact&&<p className="mt-3 border-t border-[#f0e8d5] pt-2 text-xs text-gray-600">Contact : {item.contact}</p>}
       </article>)}</div>}
     <p className="text-xs text-[#837b6e]">Consultation privée des messages enregistrés dans Supabase. La table Airtable « Suggestions — Dalil Tounes » sert au classement manuel tant que la synchronisation automatique n'est pas configurée.</p>
   </div>
 </main>;
}