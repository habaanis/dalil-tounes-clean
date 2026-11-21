import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Kind = 'offer' | 'loyalty' | 'gift_card';
type Program = { id:string; entreprise_id:string; kind:Kind; title:string; description:string; value:number; weekday:number|null; begins_at:string|null; ends_at:string|null; active:boolean; created_at:string };
type LoyaltyCard = { id:string;entreprise_id:string;program_id:string;customer_label:string;stamps:number;rewards_given:number };
type GiftCard = { id:string;entreprise_id:string;program_id:string;recipient_label:string;face_value:number;balance:number;state:'pending'|'active'|'spent'|'cancelled' };
const days=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const fields='min-h-11 w-full rounded-xl border border-[#d7c7ab] bg-white p-3 text-sm text-gray-900';
const tile='rounded-xl border border-[#dfcda8] bg-white p-3';
const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'TND'}).format(n);
const shortCode=(id:string)=>id.slice(0,8).toUpperCase();
const panelNames:{id:Kind;label:string;hint:string}[]=[
 {id:'offer',label:'🏷️ Offres & réductions',hint:'Choisissez le pourcentage, le jour et la période. La remise est une annonce : le montant de la commande reste calculé par la Boutique existante.'},
 {id:'loyalty',label:'⭐ Fidélité',hint:'Choisissez le nombre d’achats et la récompense. Vous validez les passages et remettez le cadeau manuellement.'},
 {id:'gift_card',label:'🎁 Cartes cadeaux',hint:'Choisissez les montants. Vérifiez d’abord le paiement avec le client avant d’activer une carte.'}
];

export default function SalesLoyaltyManagement({entrepriseIds}:{entrepriseIds:string[]}) {
 const [company,setCompany]=useState(entrepriseIds[0]||'');
 const [section,setSection]=useState<Kind|null>(null);
 const [programs,setPrograms]=useState<Program[]>([]);
 const [loyalty,setLoyalty]=useState<LoyaltyCard[]>([]);
 const [gifts,setGifts]=useState<GiftCard[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 const [refresh,setRefresh]=useState(0);
 const [title,setTitle]=useState('');
 const [description,setDescription]=useState('');
 const [value,setValue]=useState('');
 const [weekday,setWeekday]=useState('');
 const [start,setStart]=useState('');
 const [end,setEnd]=useState('');
 const [active,setActive]=useState(false);
 const [chosenProgram,setChosenProgram]=useState('');
 const [customer,setCustomer]=useState('');
 const [redeemAmount,setRedeemAmount]=useState<Record<string,string>>({});
 const reload=()=>setRefresh(v=>v+1);
 useEffect(()=>{
  let live=true;
  setLoading(true);setError('');
  void Promise.all([
   supabase.from('dalil_sales_programs').select('id,entreprise_id,kind,title,description,value,weekday,begins_at,ends_at,active,created_at').eq('entreprise_id',company).order('created_at',{ascending:false}),
   supabase.from('dalil_sales_loyalty_cards').select('id,entreprise_id,program_id,customer_label,stamps,rewards_given').eq('entreprise_id',company).order('created_at',{ascending:false}).limit(60),
   supabase.from('dalil_sales_gift_cards').select('id,entreprise_id,program_id,recipient_label,face_value,balance,state').eq('entreprise_id',company).order('issued_at',{ascending:false}).limit(60)
  ]).then(([a,b,c])=>{
   if(!live)return;
   if(a.error||b.error||c.error){setError('Chargement impossible. Vérifiez que votre compte professionnel est autorisé.');return;}
   setPrograms((a.data||[]) as Program[]);
   setLoyalty((b.data||[]) as LoyaltyCard[]);
   setGifts((c.data||[]) as GiftCard[]);
  }).catch(()=>{if(live)setError('Connexion impossible.');}).finally(()=>{if(live)setLoading(false);});
  return()=>{live=false};
 },[company,refresh]);
 const choose=(kind:Kind)=>{
  setSection(old=>old===kind?null:kind);setError('');setMessage('');
  setTitle('');setDescription('');setValue('');setWeekday('');setStart('');setEnd('');setActive(false);setChosenProgram('');setCustomer('');
 };
 const addProgram=async(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();if(busy||!section)return;
  const n=Number(value),name=title.trim();
  if(name.length<2||name.length>120||description.length>500||!Number.isFinite(n)||n<=0||n>100000||
    (section==='offer'&&n>100)||(section==='loyalty'&&(!Number.isInteger(n)||n<2||n>30))||
    (start&&end&&start>end)){setError('Vérifiez le nom, la valeur et les dates.');return;}
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.from('dalil_sales_programs').insert({
   entreprise_id:company,kind:section,title:name,description:description.trim(),value:n,
   weekday:section==='offer'&&weekday!==''?Number(weekday):null,
   begins_at:section==='offer'&&start?new Date(start+'T00:00:00').toISOString():null,
   ends_at:section==='offer'&&end?new Date(end+'T23:59:59').toISOString():null,
   active:section==='offer'?active:true
  });
  setBusy(false);
  if(e){setError('Enregistrement impossible. Vérifiez vos droits ou les informations saisies.');return;}
  setTitle('');setDescription('');setValue('');setStart('');setEnd('');setWeekday('');setActive(false);
  setMessage('Configuration enregistrée.');reload();
 };
 const changeActive=async(p:Program)=>{
  if(busy)return;setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.from('dalil_sales_programs').update({active:!p.active}).eq('id',p.id).eq('entreprise_id',company);
  setBusy(false);if(e)setError('La modification n’a pas été enregistrée.');else {setMessage('Statut enregistré.');reload();}
 };
 const issue=async(kind:'loyalty'|'gift_card')=>{
  if(!chosenProgram||customer.trim().length<2||busy){setError('Choisissez un programme et indiquez le client ou bénéficiaire.');return;}
  const p=programs.find(x=>x.id===chosenProgram&&x.kind===kind&&x.entreprise_id===company);
  if(!p){setError('Programme invalide.');return;}
  setBusy(true);setError('');setMessage('');
  const {error:e}=kind==='loyalty'
   ?await supabase.from('dalil_sales_loyalty_cards').insert({entreprise_id:company,program_id:p.id,customer_label:customer.trim()})
   :await supabase.from('dalil_sales_gift_cards').insert({entreprise_id:company,program_id:p.id,recipient_label:customer.trim(),face_value:p.value,balance:p.value,state:'pending'});
  setBusy(false);if(e){setError('Création refusée. Vérifiez votre compte professionnel.');return;}
  setCustomer('');setMessage(kind==='loyalty'?'Carte de fidélité créée.':'Carte cadeau créée en attente de paiement.');reload();
 };
 const stamp=async(card:LoyaltyCard,reward:boolean)=>{
  if(busy)return;
  if(reward&&!window.confirm('Confirmer la remise effective de la récompense au client ?'))return;
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.rpc('dalil_sales_stamp',{p_card:card.id,p_reward:reward});
  setBusy(false);if(e){setError(e.message||'Action impossible.');return;}
  setMessage(reward?'Récompense remise et enregistrée.':'Achat comptabilisé.');reload();
 };
 const giftAction=async(card:GiftCard,action:'activate'|'redeem')=>{
  if(busy)return;
  const amount=action==='redeem'?Number(redeemAmount[card.id]):null;
  if(action==='redeem'&&(!amount||!Number.isFinite(amount)||amount<=0||amount>card.balance)){setError('Indiquez un montant valide.');return;}
  if(!window.confirm(action==='activate'?'Avez-vous réellement vérifié le paiement avant d’activer cette carte ?':'Confirmer l’utilisation de '+money(amount!)+' sur cette carte cadeau ?'))return;
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.rpc('dalil_sales_gift_action',{p_card:card.id,p_action:action,p_amount:amount});
  setBusy(false);if(e){setError(e.message||'Action impossible.');return;}
  setRedeemAmount(old=>({...old,[card.id]:''}));setMessage(action==='activate'?'Carte activée après vérification du paiement.':'Montant déduit du solde.');reload();
 };
 return <section className="mt-3 rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-3 sm:p-4" aria-label="Ventes et fidélité">
  <h3 className="font-semibold text-[#62212a]">Ventes & Fidélité</h3>
  <p className="mt-1 text-xs text-gray-600">Tout au même endroit, sans nouvelles pages. Les prix et les récompenses sont choisis par le commerçant.</p>
  {entrepriseIds.length>1&&<label className="mt-3 block text-xs">Établissement
   <select className={fields} value={company} onChange={e=>{setCompany(e.target.value);setSection(null);}}>{entrepriseIds.map(id=><option key={id} value={id}>{id}</option>)}</select>
  </label>}
  <div className="mt-3 grid gap-2">{panelNames.map(item=><div key={item.id} className={tile}>
   <button type="button" aria-expanded={section===item.id} onClick={()=>choose(item.id)}
    className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-sm font-semibold text-[#62212a]">
    {item.label}<span aria-hidden="true">{section===item.id?'−':'＋'}</span>
   </button>
   {section===item.id&&<div className="mt-3 grid gap-3 border-t border-[#e8d9bd] pt-3">
    <p className="text-xs text-gray-600">{item.hint}</p>
    <form onSubmit={addProgram} className="grid gap-2">
     <label className="grid gap-1 text-xs">Nom de l’offre / du programme
      <input required minLength={2} maxLength={120} className={fields} value={title} onChange={e=>setTitle(e.target.value)} placeholder={item.id==='offer'?'Ex. Mardi gourmand':item.id==='loyalty'?'Ex. 5 achats = 1 cadeau':'Ex. Carte cadeau 50 DT'}/>
     </label>
     <label className="grid gap-1 text-xs">{item.id==='offer'?'Réduction en %':item.id==='loyalty'?'Nombre d’achats pour une récompense':'Montant de la carte en DT'}
      <input required className={fields} inputMode="decimal" type="number" min={item.id==='loyalty'?2:0.001} max={item.id==='offer'?100:item.id==='loyalty'?30:100000} step={item.id==='loyalty'?1:0.001} value={value} onChange={e=>setValue(e.target.value)}/>
     </label>
     <label className="grid gap-1 text-xs">{item.id==='loyalty'?'Récompense choisie par vous':'Description et conditions'}
      <textarea className={fields} rows={2} maxLength={500} value={description} onChange={e=>setDescription(e.target.value)} placeholder={item.id==='loyalty'?'Ex. Dessert offert au sixième achat':'Conditions fixées par le commerçant'}/>
     </label>
     {item.id==='offer'&&<>
      <label className="grid gap-1 text-xs">Jour de réduction (facultatif)
       <select className={fields} value={weekday} onChange={e=>setWeekday(e.target.value)}><option value="">Tous les jours</option>{days.map((day,i)=><option key={day} value={i}>{day}</option>)}</select>
      </label>
      <div className="grid grid-cols-2 gap-2">
       <label className="grid gap-1 text-xs">Début (facultatif)<input className={fields} type="date" value={start} onChange={e=>setStart(e.target.value)}/></label>
       <label className="grid gap-1 text-xs">Fin (facultatif)<input className={fields} type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label>
      </div>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Publier cette offre dès sa période de validité</label>
     </>}
     <button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#62212a] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Enregistrer</button>
    </form>
    <div className="grid gap-2">
     <strong className="text-xs text-[#62212a]">Mes {item.id==='offer'?'offres':item.id==='loyalty'?'programmes de fidélité':'montants de cartes cadeaux'}</strong>
     {programs.filter(p=>p.kind===item.id).length===0&&<p className="text-xs text-gray-600">Aucune configuration enregistrée.</p>}
     {programs.filter(p=>p.kind===item.id).map(p=><div key={p.id} className="rounded-xl border border-[#e8d9bd] bg-[#fffdf8] p-3 text-xs">
      <div className="flex items-start justify-between gap-2"><strong>{p.title}</strong><strong>{p.kind==='offer'?p.value+' %':p.kind==='loyalty'?p.value+' achats':money(p.value)}</strong></div>
      {p.description&&<p className="mt-1 text-gray-600">{p.description}</p>}
      {p.kind==='offer'&&<div className="mt-2 flex items-center justify-between gap-2">
       <span>{p.active?'Publiée selon ses dates':'Désactivée'}{p.weekday!==null?' · '+days[p.weekday]:''}</span>
       <button type="button" disabled={busy} onClick={()=>void changeActive(p)} className="min-h-10 rounded-lg border border-[#d5bd8b] px-3 font-semibold">{p.active?'Suspendre':'Activer'}</button>
      </div>}
     </div>)}
    </div>
    {item.id!=='offer'&&<>
     <div className="grid gap-2 rounded-xl border border-[#e8d9bd] bg-white p-3">
      <strong className="text-sm">{item.id==='loyalty'?'Créer une carte client':'Préparer une carte cadeau'}</strong>
      <label className="grid gap-1 text-xs">Programme
       <select className={fields} value={chosenProgram} onChange={e=>setChosenProgram(e.target.value)}><option value="">Choisir…</option>{programs.filter(p=>p.kind===item.id).map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select>
      </label>
      <label className="grid gap-1 text-xs">{item.id==='loyalty'?'Nom du client':'Nom du bénéficiaire'}
       <input className={fields} maxLength={120} value={customer} onChange={e=>setCustomer(e.target.value)}/>
      </label>
      <button type="button" disabled={busy||!chosenProgram} onClick={()=>void issue(item.id)} className="min-h-11 rounded-xl border border-[#d5bd8b] bg-[#fbf1df] text-sm font-semibold text-[#62212a] disabled:opacity-50">Créer la carte</button>
      {item.id==='gift_card'&&<p className="text-xs text-gray-600">Aucun paiement n’est encaissé ici. Carte inactive tant que vous n’avez pas confirmé le paiement.</p>}
     </div>
     <strong className="text-xs">{item.id==='loyalty'?'Cartes de fidélité en cours':'Cartes cadeaux émises'}</strong>
     {item.id==='loyalty'?loyalty.filter(c=>programs.some(p=>p.id===c.program_id)).map(c=>{
      const p=programs.find(p=>p.id===c.program_id)!;
      return <div key={c.id} className="rounded-xl border border-[#e8d9bd] bg-white p-3 text-xs">
       <div className="flex justify-between gap-2"><strong>{c.customer_label}</strong><span>Réf. {shortCode(c.id)}</span></div>
       <p className="my-2">{c.stamps} / {p.value} achats · {c.rewards_given} récompense(s) remise(s)</p>
       <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={busy||c.stamps>=p.value} onClick={()=>void stamp(c,false)} className="min-h-11 rounded-xl border border-[#d5bd8b] px-2 disabled:opacity-50">＋ Valider un achat</button>
        <button type="button" disabled={busy||c.stamps<p.value} onClick={()=>void stamp(c,true)} className="min-h-11 rounded-xl border border-[#d5bd8b] px-2 disabled:opacity-50">🎁 Remettre le cadeau</button>
       </div>
      </div>;
     }):gifts.map(c=><div key={c.id} className="rounded-xl border border-[#e8d9bd] bg-white p-3 text-xs">
      <div className="flex justify-between gap-2"><strong>{c.recipient_label}</strong><span>Réf. {shortCode(c.id)}</span></div>
      <p className="mt-1">Solde : {money(c.balance)} / {money(c.face_value)} · {c.state==='pending'?'À activer après paiement':c.state==='active'?'Active':c.state==='spent'?'Utilisée':'Annulée'}</p>
      <p className="mt-1 break-all text-[10px] text-gray-500">Code complet : {c.id}</p>
      {c.state==='pending'&&<button type="button" disabled={busy} onClick={()=>void giftAction(c,'activate')} className="mt-2 min-h-11 rounded-xl border border-[#d5bd8b] px-3">Paiement vérifié → Activer</button>}
      {c.state==='active'&&<div className="mt-2 flex gap-2"><input aria-label="Montant utilisé en DT" className={fields} type="number" min="0.001" step="0.001" max={c.balance} placeholder="DT utilisés" value={redeemAmount[c.id]||''} onChange={e=>setRedeemAmount(old=>({...old,[c.id]:e.target.value}))}/>
       <button type="button" disabled={busy} onClick={()=>void giftAction(c,'redeem')} className="rounded-xl border border-[#d5bd8b] px-3 font-semibold">Déduire</button></div>}
     </div>)}
    </>}
   </div>}
  </div>)}</div>
  {loading&&<p role="status" className="mt-3 text-xs">Chargement…</p>}
  {error&&<p role="alert" className="mt-3 rounded-lg border border-[#d5bd8b] bg-white p-2 text-xs text-red-800">{error} <button type="button" className="underline" onClick={reload}>Réessayer</button></p>}
  {message&&<p role="status" className="mt-3 text-xs text-[#62212a]">{message}</p>}
  <p className="mt-3 text-xs text-gray-600">Les promotions affichées ne modifient pas automatiquement le montant des commandes. Les notifications promotionnelles et le partage client des cartes nécessitent une activation distincte.</p>
 </section>;
}
