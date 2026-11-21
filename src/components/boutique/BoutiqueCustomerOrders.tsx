import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabaseClient';

type ProcessingStatus = 'received' | 'in_progress' | 'confirmed' | 'completed' | 'rejected' | 'cancelled';
type Order = {
  id: string;
  kind: 'quote' | 'order';
  product_title: string;
  quantity: number;
  currency: 'TND';
  unit_price: number | null;
  amount_total: number | null;
  customer_name: string;
  customer_contact: string;
  customer_note: string | null;
  status: ProcessingStatus;
  created_at: string;
};
const processingLabels: Record<ProcessingStatus, string> = {
  received:'Reçue', in_progress:'En cours', confirmed:'Confirmée',
  completed:'Terminée', rejected:'Refusée', cancelled:'Annulée',
};
const amount = (value:number | null, currency:string) =>
  value === null ? 'Sur devis' : new Intl.NumberFormat('fr-TN',{style:'currency',currency,minimumFractionDigits:3,maximumFractionDigits:3}).format(value);

export default function BoutiqueCustomerOrders({entrepriseIds}:{entrepriseIds:string[]}) {
  const [company,setCompany]=useState(entrepriseIds[0] || '');
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState('');
  const [refresh,setRefresh]=useState(0);
  const activeCompany=entrepriseIds.includes(company)?company:entrepriseIds[0];
  const call=useCallback(async (payload:Record<string,unknown>)=>{
    const {data:{session},error:authError}=await supabase.auth.getSession();
    if(authError||!session?.access_token)throw new Error('Votre session a expiré. Reconnectez-vous.');
    const response=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-merchant-orders',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':supabaseAnonKey,
        authorization:'Bearer '+session.access_token},
      body:JSON.stringify({profileId:payload.profileId,...payload}),
    });
    const data=await response.json().catch(()=>({error:'Réponse invalide'}));
    if(!response.ok||data.error)throw new Error(
      response.status===403?'Vous ne disposez pas des droits pour cet établissement.':
      response.status===503?'Le suivi des commandes n’est pas encore disponible.':
      typeof data.error==='string'?data.error:'Une erreur est survenue.'
    );
    return data;
  },[]);
  useEffect(()=>{
    let live=true;
    if(!activeCompany){setOrders([]);setLoading(false);return;}
    setLoading(true);setError('');
    void call({action:'list',profileId:activeCompany})
      .then(data=>{if(live)setOrders(Array.isArray(data.orders)?data.orders:[]);})
      .catch(err=>{if(live){setError(err instanceof Error?err.message:'Lecture indisponible.');setOrders([]);}})
      .finally(()=>{if(live)setLoading(false);});
    return()=>{live=false;};
  },[activeCompany,refresh,call]);
  // Refresh the private inbox while it is being viewed. This is a fallback for
  // professionals who have not yet enabled mobile push notifications.
  useEffect(()=>{
    if(!activeCompany || busy)return;
    let live=true;
    let pending=false;
    const check=()=>{
      if(document.visibilityState!=='visible' || pending)return;
      pending=true;
      void call({action:'list',profileId:activeCompany})
        .then(data=>{
          if(live && Array.isArray(data.orders))setOrders(data.orders);
        })
        .catch(()=>{/* Keep existing orders visible; manual refresh exposes errors. */})
        .finally(()=>{pending=false;});
    };
    const timer=window.setInterval(check,60000);
    const onVisible=()=>{if(document.visibilityState==='visible')check();};
    document.addEventListener('visibilitychange',onVisible);
    return()=>{live=false;window.clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);};
  },[activeCompany,busy,call]);
  const update=async (order:Order,status:ProcessingStatus)=>{
    if(busy||!activeCompany)return;
    const cancellationNotice = status==='cancelled' && order.kind==='order'
      ? 'Attention : l’annulation dans Dalil Tounes ne rembourse aucun paiement convenu directement avec le client.\\n\\n' : '';
    if(!window.confirm(cancellationNotice+'Changer le statut en « '+processingLabels[status]+' » ?'))return;
    setBusy(order.id);setError('');
    try{
      const data=await call({action:'update',profileId:activeCompany,id:order.id,status});
      if(data.order?.status!==status)throw new Error('Confirmation de modification absente.');
      setOrders(current=>current.map(item=>item.id===order.id?{...item,status}:item));
    }catch(err){setError(err instanceof Error?err.message:'Modification indisponible.');}
    finally{setBusy('');}
  };
  return <section aria-label="Mes commandes et devis" className="space-y-3">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-serif text-lg font-semibold text-[#62212a]">Mes commandes et devis</h3>
        <p className="mt-1 text-xs leading-5 text-[#655b51]">Demandes enregistrées sur Dalil Tounes, même sans WhatsApp. Le paiement se règle directement entre le client et le professionnel, hors Dalil Tounes.</p>
        <p className="mt-1 text-xs text-[#655b51]">Liste actualisée automatiquement lorsque cette page est ouverte. Pour une alerte lorsque l’application est fermée, activez les notifications professionnelles ci-dessus.</p>
      </div>
      <button type="button" onClick={()=>setRefresh(n=>n+1)} disabled={loading||Boolean(busy)}
        className="min-h-11 rounded-lg border border-[#d5bd8b] bg-white px-3 text-sm font-semibold text-[#62303a] disabled:opacity-50">Actualiser</button>
    </div>
    {entrepriseIds.length>1&&<label className="grid gap-1 text-xs text-[#594d43]">Établissement
      <select className="min-h-11 rounded-lg border border-[#d9c39b] bg-white p-2 text-sm" value={activeCompany} onChange={e=>setCompany(e.target.value)}>
        {entrepriseIds.map(id=><option key={id} value={id}>{id}</option>)}
      </select>
    </label>}
    {!loading && !error && <p role="status" className="rounded-lg border border-[#d6c29e] bg-[#fff9ec] px-3 py-2 text-sm font-semibold text-[#3b3328]">{orders.length} demande{orders.length!==1?'s':''} chargée{orders.length!==1?'s':''} (commandes et devis)</p>}
    {error&&<div role="alert" className="rounded-lg border border-[#e2c59e] bg-[#fff8eb] p-3 text-sm text-[#754024]">{error}</div>}
    {loading?<p role="status" className="text-sm text-gray-600">Chargement des commandes…</p>:
      !error&&orders.length===0?<p role="status" className="rounded-lg border border-[#e6d8bc] bg-[#fffcf8] p-4 text-sm text-[#62564a]">Aucune demande enregistrée pour cet établissement.</p>:
      !error&&<div className="grid gap-3">
        {orders.map(order=>{
          const closed=['completed','rejected','cancelled'].includes(order.status);
          const canConfirm=['received','in_progress'].includes(order.status);
          const canFinish=order.status==='confirmed';
          return <article key={order.id} className="min-w-0 rounded-xl border border-[#dfcfaf] bg-white p-3 text-sm shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <strong className="block text-[#562e38]">{order.kind==='quote'?'Devis':'Commande'} · {order.product_title}</strong>
                <span className="text-xs text-gray-600">Réf. {order.id.slice(0,8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <span className="rounded-full border border-[#dbc397] bg-[#fbf1df] px-2 py-1 text-xs font-semibold text-[#694932]">{processingLabels[order.status]||order.status}</span>
            </div>
            <dl className="mt-3 grid gap-1 text-xs text-[#4e4843]">
              <div><dt className="inline font-semibold">Client : </dt><dd className="inline break-words">{order.customer_name}</dd></div>
              <div><dt className="inline font-semibold">Contact : </dt><dd className="inline break-all">{order.customer_contact}</dd></div>
              <div><dt className="inline font-semibold">Quantité : </dt><dd className="inline">{order.quantity}</dd></div>
              <div><dt className="inline font-semibold">Montant des articles : </dt><dd className="inline font-semibold">{amount(order.amount_total,order.currency)}</dd></div>
              {order.customer_note&&<div><dt className="inline font-semibold">Précisions : </dt><dd className="inline whitespace-pre-wrap break-words">{order.customer_note}</dd></div>}
              <div><dt className="inline font-semibold">Règlement : </dt><dd className="inline">À convenir directement avec le client (WhatsApp ou autre moyen). Dalil Tounes n'encaisse pas.</dd></div>
              {order.kind==='quote'&&<p className="text-xs text-[#725b3e]">Le montant de ce devis sera convenu directement avec le client.</p>}
            </dl>
            {!closed&&<div className="mt-3 flex flex-wrap gap-2 border-t border-[#ede1c9] pt-3">
              {order.status==='received'&&<button type="button" disabled={Boolean(busy)} onClick={()=>void update(order,'in_progress')}
                className="min-h-11 rounded-lg border border-[#c9ae7b] bg-[#fbf3e6] px-3 text-xs font-semibold text-[#673a31] disabled:opacity-50">Prendre en charge</button>}
              {canConfirm&&<button type="button" disabled={Boolean(busy)}
                onClick={()=>void update(order,'confirmed')} className="min-h-11 rounded-lg border border-[#c6ad79] bg-[#fbf3e6] px-3 text-xs font-semibold text-[#64352f] disabled:opacity-50">Confirmer</button>}
              {canFinish&&<button type="button" disabled={Boolean(busy)} onClick={()=>void update(order,'completed')}
                className="min-h-11 rounded-lg border border-[#c6ad79] bg-[#fbf3e6] px-3 text-xs font-semibold text-[#64352f] disabled:opacity-50">Terminer</button>}
              {['received','in_progress'].includes(order.status)&&<button type="button" disabled={Boolean(busy)} onClick={()=>void update(order,'rejected')}
                className="min-h-11 rounded-lg border border-[#d8cbb5] bg-white px-3 text-xs font-semibold text-[#7b4141] disabled:opacity-50">Refuser</button>}
              {order.status==='confirmed'&&<button type="button" disabled={Boolean(busy)} onClick={()=>void update(order,'cancelled')}
                className="min-h-11 rounded-lg border border-[#d8cbb5] bg-white px-3 text-xs font-semibold text-[#7b4141] disabled:opacity-50">Annuler</button>}
            </div>}
            {order.kind==='order'&&<p className="mt-2 text-xs text-[#725b3e]">Les boutons confirment le traitement de la commande, pas la réception du paiement. Vérifiez directement avec le client les conditions convenues.</p>}
          </article>;
        })}
      </div>}
  </section>;
}
