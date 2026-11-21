import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Kind = 'offer' | 'loyalty' | 'gift_card';
type Program = { id:string; entreprise_id:string; kind:Kind; title:string; description:string; value:number; weekday:number|null; begins_at:string|null; ends_at:string|null; active:boolean; created_at:string };
type LoyaltyCard = { id:string;entreprise_id:string;program_id:string;customer_label:string;public_code:string;stamps:number;rewards_given:number;archived_at:string|null };
type LoyaltyOperation = {id:number;card_id:string;action:string;amount:number;created_at:string};
type GiftCard = { id:string;entreprise_id:string;program_id:string;recipient_label:string;face_value:number;balance:number;state:'pending'|'active'|'spent'|'cancelled' };
const days=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const fields='min-h-11 w-full rounded-xl border border-[#d7c7ab] bg-white p-3 text-sm text-gray-900';
const tile='rounded-xl border border-[#dfcda8] bg-white p-3';
const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'TND'}).format(n);
const shortCode=(id:string)=>id.slice(0,8).toUpperCase();
const panelNames:{id:Kind;label:string;hint:string}[]=[
 {id:'offer',label:'🏷️ Offres & réductions',hint:'Choisissez le pourcentage, le jour et la période. La remise est une annonce : le montant de la commande reste calculé par la Boutique existante.'},
 {id:'loyalty',label:'⭐ Fidélité',hint:'Choisissez le nombre d’achats et la récompense. Vous validez les passages et remettez le cadeau manuellement.'},
 {id:'gift_card',label:'🎁 Cartes cadeaux',hint:'Choisissez les montants. Les clients peuvent commander une carte via la Boutique. Après vérification du paiement, créez et activez ici son code.'}
];

export default function SalesLoyaltyManagement({entrepriseIds}:{entrepriseIds:string[]}) {
 const [company,setCompany]=useState(entrepriseIds[0]||'');
 const [merchantAppSlug,setMerchantAppSlug]=useState('');
 const [section,setSection]=useState<Kind|null>(null);
 const [programs,setPrograms]=useState<Program[]>([]);
 const [loyalty,setLoyalty]=useState<LoyaltyCard[]>([]);
 const [gifts,setGifts]=useState<GiftCard[]>([]);
 const [operations,setOperations]=useState<LoyaltyOperation[]>([]);
 const [showArchived,setShowArchived]=useState(false);
 const [batchCount,setBatchCount]=useState<Record<string,string>>({});
 const [historyOpen,setHistoryOpen]=useState(false);
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
  setMerchantAppSlug('');
  void supabase.from('entreprise').select('slug_court,slug').eq('id',company).maybeSingle()
   .then(({data})=>{if(live)setMerchantAppSlug(String(data?.slug_court||data?.slug||''));});
  return ()=>{live=false;};
 },[company]);
 const loyaltyShareMessage=(card:LoyaltyCard)=>{
  const appLink=merchantAppSlug
   ? 'https://app.dalil-tounes.com/'+encodeURIComponent(merchantAppSlug)
   : 'https://app.dalil-tounes.com';
  return 'Bonjour '+card.customer_label+', votre carte de fidélité est prête !\\n'
   +'Code à 4 chiffres : '+card.public_code+'\\n'
   +'Ouvrez votre mini-appli : '+appLink+'\\n'
   +'Puis Boutique → Consulter ma fidélité → Voir ma carte.\\n'
   +'Ce code affiche uniquement votre progression fidélité, pas vos commandes.';
 };
 const shareLoyaltyCard=(card:LoyaltyCard)=>{
  const message=loyaltyShareMessage(card);
  window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 };
 useEffect(()=>{
  let live=true;
  setLoading(true);setError('');
  void Promise.all([
   supabase.from('dalil_sales_programs').select('id,entreprise_id,kind,title,description,value,weekday,begins_at,ends_at,active,created_at').eq('entreprise_id',company).order('created_at',{ascending:false}),
   supabase.from('dalil_sales_loyalty_cards').select('id,entreprise_id,program_id,customer_label,public_code,stamps,rewards_given,archived_at').eq('entreprise_id',company).order('created_at',{ascending:false}).limit(60),
   supabase.from('dalil_sales_gift_cards').select('id,entreprise_id,program_id,recipient_label,face_value,balance,state').eq('entreprise_id',company).order('issued_at',{ascending:false}).limit(60),
   supabase.from('dalil_sales_operations').select('id,card_id,action,amount,created_at').eq('entreprise_id',company).eq('kind','loyalty').order('created_at',{ascending:false}).limit(100)
  ]).then(([a,b,c,d])=>{
   if(!live)return;
   if(a.error||b.error||c.error||d.error){setError('Chargement impossible. Vérifiez que votre compte professionnel est autorisé.');return;}
   setPrograms((a.data||[]) as Program[]);
   setLoyalty((b.data||[]) as LoyaltyCard[]);
   setGifts((c.data||[]) as GiftCard[]);
   setOperations((d.data||[]) as LoyaltyOperation[]);
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
 const sendPromo=async(p:Program)=>{
  if(busy||!p.active)return;
  if(!window.confirm('Envoyer cette offre uniquement aux clients ayant accepté les notifications promotionnelles ?'))return;
  setBusy(true);setError('');setMessage('');
  const {data,error:e}=await supabase.functions.invoke('dalil-sales-promos',{body:{action:'send',programId:p.id}});
  setBusy(false);
  if(e||data?.error){setError(data?.error||'Envoi impossible. Réessayez plus tard.');return;}
  setMessage(String(data.sent||0)+' notification(s) envoyée(s) · '+String(data.failed||0)+' échec(s).'+(data.pending?' Relancez pour le lot suivant.':''));
 };
 const issue=async(kind:'loyalty'|'gift_card')=>{
  if(!chosenProgram||customer.trim().length<2||busy){setError('Choisissez un programme et indiquez le client ou bénéficiaire.');return;}
  const p=programs.find(x=>x.id===chosenProgram&&x.kind===kind&&x.entreprise_id===company);
  if(!p||!p.active){setError('Programme inactif ou invalide.');return;}
  setBusy(true);setError('');setMessage('');
  const {error:e}=kind==='loyalty'
   ?await supabase.from('dalil_sales_loyalty_cards').insert({entreprise_id:company,program_id:p.id,customer_label:customer.trim()})
   :await supabase.from('dalil_sales_gift_cards').insert({entreprise_id:company,program_id:p.id,recipient_label:customer.trim(),face_value:p.value,balance:p.value,state:'pending'});
  setBusy(false);if(e){setError('Création refusée. Vérifiez votre compte professionnel.');return;}
  setCustomer('');setMessage(kind==='loyalty'?'Carte créée. Retrouvez-la ci-dessous et choisissez Partager au client via WhatsApp, ou Copier le message. Aucun envoi automatique n’est effectué.':'Carte cadeau créée en attente de paiement.');reload();
 };
 const stamp=async(card:LoyaltyCard,reward:boolean)=>{
  if(busy)return;
  if(reward&&!window.confirm('Confirmer la remise effective de la récompense au client ?'))return;
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.rpc('dalil_sales_stamp',{p_card:card.id,p_reward:reward});
  setBusy(false);if(e){setError(e.message||'Action impossible.');return;}
  setMessage(reward?'Récompense remise et enregistrée.':'Achat comptabilisé.');reload();
 };
 const archiveCard=async(card:LoyaltyCard,archive:boolean)=>{
  if(busy)return;
  if(!window.confirm(archive
   ?'Archiver la carte de '+card.customer_label+' ? Elle ne sera plus consultable avec son code. L historique des récompenses sera conservé.'
   :'Réactiver la carte de '+card.customer_label+' ?'))return;
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.rpc('dalil_sales_archive_loyalty',{p_card:card.id,p_archive:archive});
  setBusy(false);
  if(e){setError(e.message||'Archivage impossible.');return;}
  setMessage(archive?'Carte archivée, historique conservé.':'Carte réactivée.');reload();
 };
 const deleteCard=async(card:LoyaltyCard)=>{
  if(busy||!card.archived_at)return;
  const confirmed=window.confirm('Supprimer définitivement la carte de '+card.customer_label+' ?\\n\\nLe code à 4 chiffres, les achats, les récompenses et leur historique seront effacés. Cette action est irréversible. Les commandes restent inchangées.');
  if(!confirmed)return;
  if(window.prompt('Pour confirmer la suppression définitive, écrivez SUPPRIMER :')!=='SUPPRIMER')return;
  setBusy(true);setError('');setMessage('');
  const {data,error:e}=await supabase.rpc('dalil_sales_delete_loyalty_card',{p_card:card.id});
  setBusy(false);
  if(e||data!==true){setError(e?.message||'Suppression refusée.');return;}
  setMessage('Carte client et historique de fidélité supprimés définitivement. Les commandes restent inchangées.');reload();
 };
 const stampMultiple=async(card:LoyaltyCard)=>{
  const count=Number(batchCount[card.id]);
  const program=programs.find(p=>p.id===card.program_id);
  if(busy||!program||!Number.isInteger(count)||count<1||count>30||card.stamps+count>program.value){
   setError('Choisissez un nombre entier sans dépasser les achats restants avant le cadeau.');return;
  }
  if(!window.confirm('Valider '+count+' achat(s) pour '+card.customer_label+' ? Cette action sera enregistrée.'))return;
  setBusy(true);setError('');setMessage('');
  const {error:e}=await supabase.rpc('dalil_sales_stamp_batch',{p_card:card.id,p_count:count});
  setBusy(false);
  if(e){setError(e.message||'Validation impossible.');return;}
  setBatchCount(old=>({...old,[card.id]:''}));
  setMessage(count+' achat(s) comptabilisé(s).');reload();
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
  <h3 className="font-semibold text-[#252525]">Ventes & Fidélité</h3>
  <p className="mt-1 text-xs text-gray-600">Tout au même endroit, sans nouvelles pages. Les prix et les récompenses sont choisis par le commerçant.</p>
  {entrepriseIds.length>1&&<label className="mt-3 block text-xs">Établissement
   <select className={fields} value={company} onChange={e=>{setCompany(e.target.value);setSection(null);}}>{entrepriseIds.map(id=><option key={id} value={id}>{id}</option>)}</select>
  </label>}
  <div className="mt-3 grid gap-2">{panelNames.map(item=><div key={item.id} className={tile}>
   <button type="button" aria-expanded={section===item.id} onClick={()=>choose(item.id)}
    className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-sm font-semibold text-[#252525]">
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
     <button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#252525] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Enregistrer</button>
    </form>
    <div className="grid gap-2">
     <strong className="text-xs text-[#252525]">Mes {item.id==='offer'?'offres':item.id==='loyalty'?'programmes de fidélité':'montants de cartes cadeaux'}</strong>
     {programs.filter(p=>p.kind===item.id).length===0&&<p className="text-xs text-gray-600">Aucune configuration enregistrée.</p>}
     {programs.filter(p=>p.kind===item.id).map(p=><div key={p.id} className="rounded-xl border border-[#e8d9bd] bg-[#fffdf8] p-3 text-xs">
      <div className="flex items-start justify-between gap-2"><strong>{p.title}</strong><strong>{p.kind==='offer'?p.value+' %':p.kind==='loyalty'?p.value+' achats':money(p.value)}</strong></div>
      {p.description&&<p className="mt-1 text-gray-600">{p.description}</p>}
      {p.kind==='loyalty'&&<div className="mt-2 flex items-center justify-between gap-2"><span>{p.active?'Actif':'Suspendu'}</span><button type="button" disabled={busy} onClick={()=>void changeActive(p)} className="min-h-10 rounded-lg border border-[#d5bd8b] px-3 font-semibold">{p.active?'Suspendre':'Réactiver'}</button></div>}
      {p.kind==='offer'&&<div className="mt-2 flex items-center justify-between gap-2">
       <span>{p.active?'Publiée selon ses dates':'Désactivée'}{p.weekday!==null?' · '+days[p.weekday]:''}</span>
       <div className="flex flex-wrap gap-1">
        <button type="button" disabled={busy} onClick={()=>void changeActive(p)} className="min-h-10 rounded-lg border border-[#d5bd8b] px-3 font-semibold">{p.active?'Suspendre':'Activer'}</button>
        {p.active&&<button type="button" disabled={busy} onClick={()=>void sendPromo(p)} className="min-h-10 rounded-lg border border-[#d5bd8b] bg-[#fbf1df] px-3 font-semibold">🔔 Prévenir les abonnés</button>}
       </div>
      </div>}
     </div>)}
    </div>
    {item.id!=='offer'&&<>
     <div className="grid gap-2 rounded-xl border border-[#e8d9bd] bg-white p-3">
      <strong className="text-sm">{item.id==='loyalty'?'Créer une carte client':'Préparer une carte cadeau'}</strong>
      <label className="grid gap-1 text-xs">Programme
       <select className={fields} value={chosenProgram} onChange={e=>setChosenProgram(e.target.value)}><option value="">Choisir…</option>{programs.filter(p=>p.kind===item.id&&p.active).map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select>
      </label>
      <label className="grid gap-1 text-xs">{item.id==='loyalty'?'Nom du client':'Nom du bénéficiaire'}
       <input className={fields} maxLength={120} value={customer} onChange={e=>setCustomer(e.target.value)}/>
      </label>
      <button type="button" disabled={busy||!chosenProgram} onClick={()=>void issue(item.id as 'loyalty'|'gift_card')} className="min-h-11 rounded-xl border border-[#d5bd8b] bg-[#fbf1df] text-sm font-semibold text-[#252525] disabled:opacity-50">Créer la carte</button>
      {item.id==='gift_card'&&<p className="text-xs text-gray-600">Aucun paiement n’est encaissé ici. Carte inactive tant que vous n’avez pas confirmé le paiement.</p>}
     </div>
     <div className="flex flex-wrap items-center justify-between gap-2">
      <strong className="text-xs">{item.id==='loyalty'?'Cartes de fidélité':'Cartes cadeaux émises'}</strong>
      {item.id==='loyalty'&&<button type="button" onClick={()=>setShowArchived(x=>!x)} className="min-h-10 rounded-lg border border-[#d5bd8b] bg-white px-3 text-xs font-semibold">{showArchived?'Voir les cartes en cours':'Voir les archives'}</button>}
     </div>
     {item.id==='loyalty'&&<p className="text-xs text-gray-600">{showArchived?'Cartes archivées : code inactif, historique conservé jusqu’à une éventuelle suppression définitive.':'Communiquez le code à 4 chiffres au client. Il le saisit dans Boutique → Consulter ma fidélité → Voir ma carte.'}</p>}
     {item.id==='loyalty'?loyalty.filter(c=>programs.some(p=>p.id===c.program_id)&&Boolean(c.archived_at)===showArchived).map(c=>{
      const p=programs.find(p=>p.id===c.program_id)!;
      return <div key={c.id} className="rounded-xl border border-[#e8d9bd] bg-white p-3 text-xs">
       <div className="flex justify-between gap-2"><strong>{c.customer_label}</strong><span>Fidélité</span></div>
       <div className="my-2 flex flex-wrap items-center justify-between gap-1">
        <span className="text-lg font-bold tracking-[.2em] text-[#252525]">{c.public_code}</span>
        <button type="button" className="min-h-9 rounded-lg border border-[#d5bd8b] px-2" onClick={()=>void navigator.clipboard?.writeText(c.public_code)}>Copier les 4 chiffres</button>
        {!showArchived&&<button type="button" onClick={()=>shareLoyaltyCard(c)} className="min-h-9 rounded-lg border border-[#d5bd8b] bg-[#fbf1df] px-2 font-semibold">Partager au client via WhatsApp</button>}
        {!showArchived&&<button type="button" onClick={()=>void navigator.clipboard?.writeText(loyaltyShareMessage(c))} className="min-h-9 rounded-lg border border-[#d5bd8b] px-2">Copier le message</button>}
       </div>
       <p className="my-2">{c.stamps} / {p.value} achats · {c.rewards_given} récompense(s) remise(s)</p>
       {!showArchived&&p.active&&<div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={busy||c.stamps>=p.value} onClick={()=>void stamp(c,false)} className="min-h-11 rounded-xl border border-[#d5bd8b] px-2 disabled:opacity-50">＋ Valider un achat</button>
        <button type="button" disabled={busy||c.stamps<p.value} onClick={()=>void stamp(c,true)} className="min-h-11 rounded-xl border border-[#d5bd8b] px-2 disabled:opacity-50">🎁 Remettre le cadeau</button>
       </div>}
       {!showArchived&&p.active&&<div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-xs">Plusieurs achats <input type="number" min="1" max={Math.min(30,Math.max(0,p.value-c.stamps))} step="1" inputMode="numeric" className="ml-2 w-16 rounded-lg border border-[#d5bd8b] p-2" value={batchCount[c.id]||''} onChange={e=>setBatchCount(old=>({...old,[c.id]:e.target.value}))}/></label>
        <button type="button" disabled={busy||c.stamps>=p.value} onClick={()=>void stampMultiple(c)} className="min-h-10 rounded-lg border border-[#d5bd8b] px-3 font-semibold disabled:opacity-50">Valider le lot</button>
       </div>}
       <button type="button" disabled={busy} onClick={()=>void archiveCard(c,!showArchived)} className="mt-2 min-h-10 rounded-lg border border-[#d5bd8b] bg-[#fff9ee] px-3 font-semibold">{showArchived?'Réactiver la carte':'Archiver la carte'}</button>
       {showArchived&&<button type="button" disabled={busy} onClick={()=>void deleteCard(c)} className="ml-2 mt-2 min-h-10 rounded-lg border border-[#9f3c37] bg-white px-3 font-semibold text-[#9f3c37] disabled:opacity-50">Supprimer définitivement</button>}
      </div>;
     }):gifts.map(c=><div key={c.id} className="rounded-xl border border-[#e8d9bd] bg-white p-3 text-xs">
      <div className="flex justify-between gap-2"><strong>{c.recipient_label}</strong><span>Réf. {shortCode(c.id)}</span></div>
      <p className="mt-1">Solde : {money(c.balance)} / {money(c.face_value)} · {c.state==='pending'?'À activer après paiement':c.state==='active'?'Active':c.state==='spent'?'Utilisée':'Annulée'}</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
       <span className="break-all text-[10px] text-gray-500">Code complet : {c.id}</span>
       <button type="button" className="min-h-9 rounded-lg border border-[#d5bd8b] px-2" onClick={()=>void navigator.clipboard?.writeText(c.id)}>Copier</button>
      </div>
      {c.state==='pending'&&<button type="button" disabled={busy} onClick={()=>void giftAction(c,'activate')} className="mt-2 min-h-11 rounded-xl border border-[#d5bd8b] px-3">Paiement vérifié → Activer</button>}
      {c.state==='active'&&<div className="mt-2 flex gap-2"><input aria-label="Montant utilisé en DT" className={fields} type="number" min="0.001" step="0.001" max={c.balance} placeholder="DT utilisés" value={redeemAmount[c.id]||''} onChange={e=>setRedeemAmount(old=>({...old,[c.id]:e.target.value}))}/>
       <button type="button" disabled={busy} onClick={()=>void giftAction(c,'redeem')} className="rounded-xl border border-[#d5bd8b] px-3 font-semibold">Déduire</button></div>}
     </div>)}
     {item.id==='loyalty'&&<div className="rounded-xl border border-[#e8d9bd] bg-white p-3">
      <button type="button" className="min-h-10 text-left text-xs font-semibold" onClick={()=>setHistoryOpen(v=>!v)} aria-expanded={historyOpen}>{historyOpen?'− Masquer':'＋ Afficher'} l’historique des récompenses</button>
      {historyOpen&&<div className="mt-2 grid gap-1">
       {operations.filter(op=>op.action==='reward').length===0?<p className="text-xs text-gray-600">Aucune récompense remise.</p>:
       operations.filter(op=>op.action==='reward').map(op=><p key={op.id} className="text-xs text-gray-700">{new Date(op.created_at).toLocaleDateString('fr-FR')} · {loyalty.find(card=>card.id===op.card_id)?.customer_label||'Carte ancienne'} · Cadeau remis</p>)}
      </div>}
     </div>}
    </>}
   </div>}
  </div>)}</div>
  {loading&&<p role="status" className="mt-3 text-xs">Chargement…</p>}
  {error&&<p role="alert" className="mt-3 rounded-lg border border-[#d5bd8b] bg-white p-2 text-xs text-red-800">{error} <button type="button" className="underline" onClick={reload}>Réessayer</button></p>}
  {message&&<p role="status" className="mt-3 text-xs text-[#252525]">{message}</p>}
  <p className="mt-3 text-xs text-gray-600">Les promotions affichées ne modifient pas automatiquement le montant des commandes. Les cartes fidélité et cadeaux se valident au comptoir : pas encore de portefeuille client en libre-service.</p>
 </section>;
}
