import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Change = {
 id:string; entreprise_id:string; product_id:string; user_id:string; action:'edit'|'archive'|'reorder';
 title:string|null; description:string|null; category:string|null; mode:'quote'|'order'|null;
 price:number|null; requested_position:number|null; created_at:string;
};
type Item = {id:string;title:string;entreprise_id:string};

export default function AdminBoutiqueChanges() {
 const [rows,setRows]=useState<Change[]>([]);
 const [products,setProducts]=useState<Record<string,string>>({});
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);
 const load=useCallback(async()=>{
   setLoading(true);
   const {data,error:readError}=await supabase.from('dalil_boutique_change_requests')
     .select('id,entreprise_id,product_id,user_id,action,title,description,category,mode,price,requested_position,created_at')
     .eq('status','pending').order('created_at',{ascending:true}).limit(100);
   if(readError){setError('Impossible de charger les demandes de modification.');setLoading(false);return;}
   const items=(data??[]) as Change[];
   setRows(items);setError('');
   const ids=[...new Set(items.map(item=>item.product_id))];
   if(ids.length){
     const {data:prods}=await supabase.from('dalil_boutique_products')
       .select('id,title,entreprise_id').in('id',ids);
     setProducts(Object.fromEntries(((prods??[]) as Item[]).map(item=>[item.id,item.title])));
   }else setProducts({});
   setLoading(false);
 },[]);
 useEffect(()=>{void load()},[load]);
 const decide=async (row:Change,approve:boolean)=>{
   const kind=row.action==='edit'?'la modification':row.action==='archive'?'le retrait':'le nouvel ordre';
   if(!window.confirm(approve?`Valider ${kind} pour ce produit ?`:`Refuser ${kind} ?`))return;
   setBusy(row.id);setMessage('');
   try{
     const {error:rpcError}=await supabase.rpc('dalil_review_boutique_change',{
       p_request_id:row.id,p_approve:approve
     });
     if(rpcError)throw rpcError;
     setMessage(approve?'Changement appliqué et demande validée.':'Demande refusée. Produit inchangé.');
     await load();
   }catch{setMessage('Traitement impossible. Vérifiez le statut du produit et les autorisations.');}
   finally{setBusy(null)}
 };
 return <section className="mt-8 border-t border-[#dec9a3] pt-5">
   <h2 className="text-lg font-semibold text-[#642e31]">Demandes de modification des produits</h2>
   <p className="mt-2 text-sm text-gray-700">Validation manuelle des modifications, retraits et changements d’ordre. Aucun de ces changements n’envoie d’annonce de nouveau produit.</p>
   <button type="button" onClick={()=>void load()} className="mt-3 rounded-lg border border-[#d9c39a] bg-white px-4 py-2 text-sm">Actualiser les demandes</button>
   {message&&<p role="status" className="mt-3 text-sm">{message}</p>}
   {error&&<p role="alert" className="mt-3 text-sm">{error}</p>}
   {loading?<p role="status" className="mt-3 text-sm">Chargement…</p>:rows.length===0
     ?<p className="mt-3 rounded-xl bg-white p-4 text-sm">Aucune modification en attente.</p>
     :<div className="mt-4 space-y-3">{rows.map(row=><article key={row.id} className="rounded-xl border border-[#dfcda8] bg-white p-4">
        <h3 className="font-semibold text-[#642e31]">{products[row.product_id]||'Produit'} — {row.action==='edit'?'Modification':row.action==='archive'?'Retrait':'Réorganisation'}</h3>
        <p className="mt-1 break-all text-xs text-gray-600">Établissement : {row.entreprise_id}</p>
        {row.action==='edit'&&<div className="mt-2 space-y-1 text-sm">
          <p>Nom proposé : {row.title}</p>
          {row.category&&<p>Catégorie : {row.category}</p>}
          <p className="whitespace-pre-wrap">Description : {row.description||'—'}</p>
          <p>{row.mode==='order'?`Prix proposé : ${row.price} TND`:'Sur devis'}</p>
        </div>}
        {row.action==='reorder'&&<p className="mt-2 text-sm">Nouvelle position : {row.requested_position}</p>}
        {row.action==='archive'&&<p className="mt-2 text-sm">Retrait du catalogue public après validation.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={busy===row.id} onClick={()=>void decide(row,true)}
            className="rounded-lg bg-[#8f2530] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Valider</button>
          <button type="button" disabled={busy===row.id} onClick={()=>void decide(row,false)}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800 disabled:opacity-50">Refuser</button>
        </div>
     </article>)}</div>}
 </section>;
}
