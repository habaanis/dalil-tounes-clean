import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Product = {
  id:string; entreprise_id:string; title:string; description:string; category:string|null;
  mode:'quote'|'order'; price:number|null; position:number;
};
type Change = {id:string;product_id:string;action:'edit'|'archive'|'reorder';status:string;created_at:string};

export default function BoutiqueProductManagement({entrepriseIds,userId}:{entrepriseIds:string[];userId:string}) {
  const [products,setProducts]=useState<Product[]>([]);
  const [changes,setChanges]=useState<Change[]>([]);
  const [selected,setSelected]=useState('');
  const [action,setAction]=useState<'edit'|'archive'|'reorder'>('edit');
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [category,setCategory]=useState('');
  const [mode,setMode]=useState<'quote'|'order'>('quote');
  const [price,setPrice]=useState('');
  const [position,setPosition]=useState('0');
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(false);
  const [retryKey,setRetryKey]=useState(0);
  const [saving,setSaving]=useState(false);
  const businessIds=entrepriseIds.join(',');
  useEffect(()=>{
    let active=true;
    if(!userId || !businessIds) {setProducts([]);setChanges([]);setLoading(false);return;}
    setLoading(true);setLoadError(false);
    const ids=businessIds.split(',');
    void Promise.all([
      supabase.from('dalil_boutique_products').select('id,entreprise_id,title,description,category,mode,price,position')
        .in('entreprise_id',ids).eq('status','approved').order('position',{ascending:true}),
      supabase.from('dalil_boutique_change_requests').select('id,product_id,action,status,created_at')
        .in('entreprise_id',ids).order('created_at',{ascending:false}).limit(30)
    ]).then(([p,c])=>{
      if(!active)return;
      if(p.error || c.error){setLoadError(true);return;}
      setProducts((p.data??[]) as Product[]);
      setChanges((c.data??[]) as Change[]);
    }).catch(()=>{if(active)setLoadError(true);})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false};
  },[businessIds,userId,retryKey]);

  const choose=(id:string)=>{
    setSelected(id);setMessage('');
    const product=products.find(p=>p.id===id);
    if(!product)return;
    setTitle(product.title);setDescription(product.description);setCategory(product.category||'');
    setMode(product.mode);setPrice(product.price==null?'':String(product.price));
    setPosition(String(product.position));
  };
  const submit=async (event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(saving || !userId)return;
    const product=products.find(p=>p.id===selected);
    if(!product)return;
    if(changes.some(c=>c.product_id===product.id && c.status==='pending')) {
      setMessage('Une demande est déjà en cours pour ce produit.');return;
    }
    if(action==='archive' && !window.confirm('Retirer maintenant ce produit de la Boutique publique ?'))return;
    const normalized=title.trim(),desc=description.trim(),cat=category.trim();
    const numericPrice=Number(price);
    const numericPosition=Number(position);
    if(action==='edit' && (normalized.length<2||normalized.length>120||desc.length>800||cat.length>60||
      (mode==='order'&&(!Number.isFinite(numericPrice)||numericPrice<=0||numericPrice>100000)))) {
      setMessage('Vérifiez le nom, la description et le prix.');return;
    }
    if(action==='reorder' && (!Number.isInteger(numericPosition)||numericPosition<0||numericPosition>1000)) {
      setMessage('L’ordre doit être un nombre entier entre 0 et 1000.');return;
    }
    setSaving(true);setMessage('');
    const {data,error}=await supabase.rpc('dalil_owner_manage_published_product',{
      p_product_id:product.id,p_action:action,
      p_title:action==='edit'?normalized:null,
      p_description:action==='edit'?desc:null,
      p_category:action==='edit'?(cat||null):null,
      p_mode:action==='edit'?mode:null,
      p_price:action==='edit'&&mode==='order'?numericPrice:null,
      p_position:action==='reorder'?numericPosition:null
    });
    if(error || !data){
      setMessage('Modification impossible. Vérifiez vos droits ou une demande déjà en attente.');
    } else {
      setChanges(current=>[{id:data.id as string,product_id:product.id,action,status:'approved',created_at:new Date().toISOString()},...current]);
      if(action==='archive') {setProducts(current=>current.filter(p=>p.id!==product.id));setSelected('');}
      else setProducts(current=>current.map(p=>p.id!==product.id?p:{
        ...p,...(action==='edit'?{title:normalized,description:desc,category:cat||null,mode,price:mode==='order'?numericPrice:null}
          :{position:numericPosition})
      }));
      setMessage('Modification enregistrée et appliquée à votre Boutique.');
    }
    setSaving(false);
  };
  const current=products.find(p=>p.id===selected);
  const hasPending=current && changes.some(c=>c.product_id===current.id&&c.status==='pending');
  return <section className="mt-5 rounded-xl border border-[#dfcda8] bg-white p-4 sm:p-5">
    <h3 className="font-semibold text-[#62212a]">Gérer mes produits publiés</h3>
    <p className="mt-1 text-sm text-gray-600">Modifiez directement vos produits existants : nom, prix, description, ordre ou retrait. Votre compte doit être vérifié. Les nouveaux produits restent soumis à une première validation.</p>
    {loading?<p role="status" className="mt-3 text-sm">Chargement des produits…</p>:loadError?<div className="mt-3 text-sm" role="alert"><p>Le chargement des produits a échoué. Votre Boutique publique n'est pas modifiée.</p><button type="button" className="mt-2 min-h-11 rounded-xl border border-[#dfcda8] bg-white px-4 py-2 font-semibold" onClick={()=>setRetryKey(v=>v+1)}>Réessayer</button></div>:products.length===0
      ?<p className="mt-3 text-sm text-gray-600">Aucun produit publié à modifier pour le moment.</p>
      :<form onSubmit={submit} className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm">Produit
          <select required value={selected} onChange={event=>choose(event.target.value)}
            className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900">
            <option value="">Choisir un produit…</option>
            {products.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </label>
        {current&&<>
          <label className="grid gap-1 text-sm">Demande
            <select value={action} onChange={event=>{setAction(event.target.value as 'edit'|'archive'|'reorder');setMessage('');}}
              className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900">
              <option value="edit">Modifier le produit</option>
              <option value="reorder">Changer l’ordre d’affichage</option>
              <option value="archive">Retirer de la Boutique</option>
            </select>
          </label>
          {action==='edit'&&<>
            <label className="grid gap-1 text-sm">Nom
              <input required minLength={2} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)}
                className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" />
            </label>
            <label className="grid gap-1 text-sm">Catégorie
              <input maxLength={60} value={category} onChange={e=>setCategory(e.target.value)}
                className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" />
            </label>
            <label className="grid gap-1 text-sm">Description
              <textarea maxLength={800} rows={3} value={description} onChange={e=>setDescription(e.target.value)}
                className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900"/>
            </label>
            <label className="grid gap-1 text-sm">Type
              <select value={mode} onChange={e=>setMode(e.target.value as 'quote'|'order')}
                className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900">
                <option value="quote">Sur devis</option><option value="order">Prix indicatif</option>
              </select>
            </label>
            {mode==='order'&&<label className="grid gap-1 text-sm">Prix en TND
              <input required type="number" min="0.01" max="100000" step="0.01" value={price} onChange={e=>setPrice(e.target.value)}
                className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900"/>
            </label>}
          </>}
          {action==='reorder'&&<label className="grid gap-1 text-sm">Position (0 à 1000)
            <input required type="number" min={0} max={1000} step={1} value={position} onChange={e=>setPosition(e.target.value)}
              className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900"/>
          </label>}
          {action==='archive'&&<p className="text-sm text-gray-700">Le produit sera retiré immédiatement dès confirmation.</p>}
          <button type="submit" disabled={saving||Boolean(hasPending)} className="min-h-11 rounded-xl bg-[#8f2530] px-4 py-2 font-semibold text-white disabled:opacity-50">
            {saving?'Envoi…':hasPending?'Demande déjà en attente':'Enregistrer la modification'}
          </button>
        </>}
      </form>}
    {message&&<p role="status" className="mt-3 text-sm text-[#62212a]">{message}</p>}
    {changes.length>0&&<div className="mt-5 border-t border-[#dfcda8] pt-3">
      <h4 className="font-semibold text-[#62212a]">Historique des modifications</h4>
      <ul className="mt-2 space-y-2">{changes.map(c=><li key={c.id} className="flex flex-wrap justify-between gap-2 rounded-lg bg-[#fbf8f0] p-3 text-xs">
        <span>{products.find(p=>p.id===c.product_id)?.title||'Produit'} — {c.action==='edit'?'Modification':c.action==='archive'?'Retrait':'Ordre'}</span>
        <span>{c.status==='pending'?'En attente':c.status==='approved'?'Validée':'Refusée'}</span>
      </li>)}</ul>
    </div>}
  </section>;
}
