import { useEffect, useState, type ReactNode } from 'react';
import { BoutiquePushFollow } from './BoutiquePushFollow';
import { useLanguage } from '../../context/LanguageContext';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabaseClient';

export type BoutiqueProduct = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  price?: number;
  currency: 'EUR' | 'TND';
  mode: 'order' | 'quote';
  merchantPaymentUrl?: string;
  approvedAt?: string;
  updatedAt?: string;
};

export type BoutiqueConfig = {
  merchantName: string;
  profileId?: string;
  whatsapp: string;
  email?: string;
  products: BoutiqueProduct[];
  paymentsVerified?: boolean;
  demoMode?: boolean;
};

const recentLabel = (product: BoutiqueProduct): string | null => {
  const approved = Date.parse(product.approvedAt || '');
  const updated = Date.parse(product.updatedAt || '');
  const timestamp = Math.max(Number.isFinite(approved) ? approved : 0, Number.isFinite(updated) ? updated : 0);
  if (!timestamp || timestamp > Date.now() || Date.now() - timestamp >= 7 * 24 * 60 * 60 * 1000) return null;
  return Number.isFinite(approved) && Number.isFinite(updated) && updated > approved + 60_000
    ? 'Mis à jour' : 'Nouveau';
};
const isRecentProduct = (product: BoutiqueProduct) => recentLabel(product) !== null;

const priceText = (product: BoutiqueProduct) =>
  typeof product.price === 'number'
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: product.currency }).format(product.price)
    : 'Sur devis';

const labelStyle = { display: 'grid', gap: 4, fontSize: 12, fontWeight: 500 } as const;
const fieldStyle = { boxSizing: 'border-box', width: '100%', minWidth: 0, border: '1px solid var(--boutique-accent, #d7c7ae)', borderRadius: 9, padding: '9px 10px', fontSize: 14, background: 'var(--boutique-field, #fff)', color: 'var(--boutique-field-ink, #12372e)', colorScheme: 'light' } as const;
type LocalRequest = {reference:string; createdAt:string; kind:'quote'|'order';proof?:string};
type LiveOrderStatus = {reference:string;kind:'quote'|'order';status:string;createdAt:string;updatedAt:string;productTitle:string;quantity:number;requestedDate?:string|null};
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const customerStatusLabels:Record<string,string>={
  received:'Demande reçue',confirmed:'Confirmée',cancelled:'Annulée',
  completed:'Terminée',fulfilled:'Terminée',pending:'En attente',
  accepted:'Acceptée',rejected:'Refusée'
};
// Merchant-specific products without fixed prices that are accepted as orders,
// rather than price quotations. This changes customer wording only, never payment state.
const isUnpricedCustomerOrder=(profileId:string|undefined,title:string)=>
  profileId==='36f84b99-2c37-47d1-91ba-4c35cda8c1af'&&
  ['buffet de mariage','plateaux traiteur'].includes(title.trim().toLocaleLowerCase('fr'));
const savedLoyaltyKey=(id:string)=>'dalil-loyalty-local:'+id;
const localRequestKey=(profileId:string)=>'dalil-customer-requests:'+profileId;
const readLocalRequests=(profileId:string):LocalRequest[]=>{
  try {
    const raw=window.localStorage.getItem(localRequestKey(profileId));
    const entries=JSON.parse(raw||'[]') as unknown;
    return Array.isArray(entries)?entries.filter((x):x is LocalRequest=>
      Boolean(x&&typeof x==='object'&&'reference' in x&&
      typeof x.reference==='string'&&uuidPattern.test(x.reference)&&
      'createdAt' in x&&typeof x.createdAt==='string'&&
      'kind' in x&&(x.kind==='quote'||x.kind==='order'))).map(x=>({
        reference:x.reference,createdAt:x.createdAt,kind:x.kind,
        proof:typeof x.proof==='string'&&uuidPattern.test(x.proof)?x.proof:undefined
      })).slice(0,20):[];
  }catch{return [];}
};
const iconButton = { background: 'var(--boutique-button, #063b30)', border: '1px solid var(--boutique-accent, #d7c7ae)', borderRadius: 24, height: 34, minWidth: 34, cursor: 'pointer', color: 'var(--boutique-button-ink, #fff)', fontSize: 20 } as const;

export function BoutiqueInteractive({ config, triggerClassName, triggerLabel = 'Boutique', triggerIcon }: { config: BoutiqueConfig; triggerClassName?: string; triggerLabel?: string; triggerIcon?: ReactNode }) {
  const {language}=useLanguage();
  const ar=language==='ar';
  const t=(fr:string,arabic:string)=>ar?arabic:fr;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BoutiqueProduct | null>(null);
  const [offersOpen,setOffersOpen] = useState(false);
  const [cardLookupOpen,setCardLookupOpen] = useState(false);
  const [myFollowupOpen,setMyFollowupOpen] = useState(false);
  const [localRequests,setLocalRequests] = useState<LocalRequest[]>([]);
  const [liveStatuses,setLiveStatuses] = useState<Record<string,LiveOrderStatus>>({});
  const [statusChecking,setStatusChecking] = useState(false);
  const [statusNotice,setStatusNotice] = useState('');
  useEffect(()=>{
    setLocalRequests(config.profileId?readLocalRequests(config.profileId):[]);
    setLiveStatuses({});setStatusNotice('');
  },[config.profileId,open]);
  const [cardLookupKind,setCardLookupKind] = useState<'loyalty'|'gift_card'>('loyalty');
  const [cardCode,setCardCode] = useState('');
  const [savedLoyalty,setSavedLoyalty] = useState('');
  const [rememberLoyalty,setRememberLoyalty] = useState(true);
  useEffect(()=>{
    let code='';
    if(config.profileId){try{code=localStorage.getItem(savedLoyaltyKey(config.profileId))||'';}catch{/* unavailable */}}
    setSavedLoyalty(/^[0-9]{4}$/.test(code)?code:'');
  },[config.profileId,open]);
  const [cardInfo,setCardInfo] = useState<Record<string,unknown>|null>(null);
  const [cardNotice,setCardNotice] = useState('');
  const [cardChecking,setCardChecking] = useState(false);
  const [offers,setOffers] = useState<{id:string;title:string;description:string;value:number;weekday:number|null}[]>([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactChannel, setContactChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [merchantEmail, setMerchantEmail] = useState(config.email?.trim() || '');
  const [details, setDetails] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [customerPushOptIn, setCustomerPushOptIn] = useState(false);
  const [customerPushNotice, setCustomerPushNotice] = useState('');
  const [orderAvailability,setOrderAvailability] = useState<'checking'|'available'|'unavailable'>('checking');
  // Keep the same UUID across retries to prevent duplicates after network failure.
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const refreshCustomerStatuses=async()=>{
    if(statusChecking||!config.profileId)return;
    const entries=localRequests.filter(item=>item.proof&&uuidPattern.test(item.proof)).slice(0,20);
    if(entries.length===0){
      setStatusNotice('Les demandes déjà enregistrées sans clé sécurisée ne peuvent pas être consultées. Faites une nouvelle demande pour activer ce suivi.');
      return;
    }
    setStatusChecking(true);setStatusNotice('');
    try{
      const response=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-customer-status',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({profileId:config.profileId,
          entries:entries.map(item=>({reference:item.reference,proof:item.proof}))})
      });
      const result=await response.json() as {items?:LiveOrderStatus[];error?:string};
      if(!response.ok||!Array.isArray(result.items)){
        setStatusNotice(response.status===429?'Trop de vérifications. Réessayez plus tard.':'Vérification temporairement indisponible.');
        return;
      }
      const statuses:Record<string,LiveOrderStatus>={};
      for(const item of result.items){
        if(item&&typeof item.reference==='string'&&typeof item.status==='string')
          statuses[item.reference]=item;
      }
      setLiveStatuses(statuses);
      setStatusNotice(result.items.length?t('Votre suivi est à jour.','تم تحديث المتابعة.'):t('Aucune nouvelle information disponible pour ces demandes.','لا توجد معلومات جديدة.'));
    }catch{setStatusNotice('Connexion indisponible. Vos références locales sont conservées.');}
    finally{setStatusChecking(false);}
  };
  // A retry with unchanged data keeps the idempotency key. Editing a field
  // starts a new request so the server does not return 409 for changed details.
  const editRequest = () => { setRequestKey(crypto.randomUUID()); setError(''); };
  const [catalogueQuery, setCatalogueQuery] = useState('');
  const [catalogueCategory, setCatalogueCategory] = useState('');
  const [cataloguePage, setCataloguePage] = useState(1);
  useEffect(()=>{
    if(!open||!config.profileId||config.demoMode){setOffers([]);return;}
    let live=true;
    void supabase.from('dalil_sales_programs').select('id,title,description,value,weekday').eq('entreprise_id',config.profileId).eq('kind','offer').eq('active',true)
      .then(({data,error})=>{if(live)setOffers(error?[]:(data||[]).filter(row=>row.weekday==null||row.weekday===new Date().getDay()));});
    return()=>{live=false;};
  },[open,config.profileId,config.demoMode]);
  const products = config.products.filter(product => Boolean(product.id && product.title && product.imageUrl));
  // Keep the approved festive-menu order; any other category follows alphabetically.
  const preferredCategories = ['Menu des fêtes', 'Entrées', 'Plats', 'Fromages', 'Desserts', 'Packs cadeaux', 'Cartes cadeaux'];
  const rankCategory = (name: string) => preferredCategories.findIndex(
    preferred => preferred.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr')
  );
  const catalogueCategories = [...new Set(products.map(product => product.category?.trim()).filter((category): category is string => Boolean(category)))].sort((a,b) => {
    const aRank = rankCategory(a), bRank = rankCategory(b);
    if (aRank !== bRank) return aRank < 0 ? 1 : bRank < 0 ? -1 : aRank - bRank;
    return a.localeCompare(b, 'fr');
  });
  const filteredProducts = products.filter(product =>
    (!catalogueCategory || product.category?.trim() === catalogueCategory)
    && (!catalogueQuery.trim() || (product.title + ' ' + (product.description || '')).toLocaleLowerCase().includes(catalogueQuery.trim().toLocaleLowerCase()))
  ).sort((a,b) => {
    // Sort only across known festive-menu sections; retain the merchant's
    // published order within each section and for uncategorized products.
    if (catalogueCategory || catalogueQuery.trim()) return 0;
    const first = rankCategory(a.category?.trim() || ''), second = rankCategory(b.category?.trim() || '');
    if (first < 0 && second < 0) return 0;
    if (first < 0) return 1;
    if (second < 0) return -1;
    return first - second;
  });
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / 12));
  const safePage = Math.min(cataloguePage, pageCount);
  const pageProducts = filteredProducts.slice((safePage - 1) * 12, safePage * 12);
  const lookupCard=async(knownCode?:string)=>{
    const code=(knownCode??cardCode).trim();
    if(!config.profileId||(cardLookupKind==='loyalty'?!/^[0-9]{4}$/.test(code):
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code))){
      setCardInfo(null);setCardNotice(cardLookupKind==='loyalty'?'Saisissez les 4 chiffres de votre carte de fidélité.':'Saisissez le code complet de votre carte cadeau.');return;
    }
    setCardChecking(true);setCardNotice('');setCardInfo(null);
    if(cardLookupKind==='loyalty'){
      try{
        const response=await fetch(supabaseUrl+'/functions/v1/dalil-loyalty-check',{
          method:'POST',headers:{'content-type':'application/json'},
          body:JSON.stringify({profileId:config.profileId,code})
        });
        const result=await response.json() as {card?:Record<string,unknown>;error?:string};
        if(!response.ok||!result.card){
          setCardNotice(response.status===429?'Trop de vérifications. Réessayez dans une heure.':response.status===404?'Carte introuvable pour cette boutique.':'Vérification temporairement indisponible.');
          return;
        }
        setCardInfo(result.card);
        if(config.profileId&&rememberLoyalty){try{
          localStorage.setItem(savedLoyaltyKey(config.profileId),code);setSavedLoyalty(code);
        }catch{/* unavailable */}}
      }catch{setCardNotice('Vérification temporairement indisponible.');}
      finally{setCardChecking(false);}
      return;
    }
    const {data,error}=await supabase.rpc('dalil_sales_card_status',{p_business:config.profileId,p_kind:'gift_card',p_code:code});
    setCardChecking(false);
    if(error||!data){setCardNotice('Carte introuvable pour cette boutique. Vérifiez le code.');return;}
    setCardInfo(data as Record<string,unknown>);
  };
  const phone = config.whatsapp.replace(/\D/g, '');
  const canWhatsApp = /^\d{8,15}$/.test(phone);
  const canEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantEmail);
  useEffect(() => {
    setMerchantEmail(config.email?.trim() || '');
    if (!open || config.email?.trim() || !config.profileId || config.demoMode) return;
    let active = true;
    void supabase.from('entreprise').select('email').eq('id', config.profileId).maybeSingle().then(({ data }) => {
      if (active && typeof data?.email === 'string') setMerchantEmail(data.email.trim());
    });
    return () => { active = false; };
  }, [open, config.profileId, config.email, config.demoMode]);
  useEffect(() => {
    if(!open)return;
    if(config.demoMode){setOrderAvailability('available');return;}
    if(!config.profileId){setOrderAvailability('unavailable');return;}
    let active=true;
    setOrderAvailability('checking');
    void fetch(supabaseUrl+'/functions/v1/dalil-boutique-customer-submit?profileId='+encodeURIComponent(config.profileId),{
      method:'GET',headers:{apikey:supabaseAnonKey},cache:'no-store',
    }).then(async response=>{
      const data=await response.json().catch(()=>null);
      return response.ok && data?.available===true;
    }).then(available=>{
      if(active)setOrderAvailability(available?'available':'unavailable');
    }).catch(()=>{if(active)setOrderAvailability('unavailable');});
    return ()=>{active=false;};
  },[open,config.demoMode,config.profileId]);

  useEffect(() => {
    setSelected(current => {
      if (!current) return current;
      const latest = config.products.find(product => product.id === current.id);
      return latest ?? null;
    });
  }, [config.products]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (requestOpen) setRequestOpen(false);
      else if (selected) setSelected(null);
      else setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selected, requestOpen]);

  if (!products.length) return null;

  const close = () => {
    if (sending) return;
    setOpen(false); setSelected(null); setRequestOpen(false); setError('');
    setConfirmation(''); setCustomerPushOptIn(false); setCustomerPushNotice(''); setRequestKey(crypto.randomUUID());
  };
  const showProduct = (product: BoutiqueProduct) => {
    setSelected(product); setRequestOpen(false); setQuantity(1);
    setName(''); setContact(''); setContactChannel('whatsapp'); setDetails(''); setRequestedDate(''); setError('');
    setConfirmation(''); setCustomerPushOptIn(false); setCustomerPushNotice(''); setSending(false); setRequestKey(crypto.randomUUID());
  };
  const send = async () => {
    if (!selected || sending || confirmation) return;
    if (config.demoMode) { setError('Démonstration : aucune demande, message ou paiement réel n’est envoyé.'); return; }
    if(orderAvailability!=='available'){setError('Les commandes ne sont pas ouvertes. Contactez directement le professionnel. Aucune demande n’a été enregistrée.');return;}
    if (!config.profileId) { setError('Les demandes ne sont pas encore activées pour cet établissement.'); return; }
    // The current orders API validates only TND. Refuse EUR here rather than imply that an order was recorded.
    if (selected.currency !== 'TND') { setError('Les commandes en euros ne sont pas encore activées sur Dalil Tounes. Contactez directement le professionnel.'); return; }
    if (selected.mode === 'order' && (typeof selected.price !== 'number' || !Number.isFinite(selected.price) || selected.price <= 0)) {
      setError('Cet article n’a pas de prix valide pour une commande. Demandez un devis au professionnel.'); return;
    }
    if (name.trim().length < 2) { setError('Indiquez votre nom.'); return; }
    if (contactChannel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setError('Indiquez une adresse e-mail valide.'); return;
    }
    if (contactChannel === 'whatsapp' && !/^\+?[\d\s().-]{8,20}$/.test(contact.trim())) {
      setError('Indiquez un numéro de téléphone valide pour WhatsApp.'); return;
    }
    // The selected date is part of the stored note and therefore of the server's idempotency fingerprint.
    const today = new Date();
    const localToday = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
    if (requestedDate && (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate) || requestedDate < localToday)) {
      setError('Sélectionnez une date d’événement valide, aujourd’hui ou plus tard.'); return;
    }
    const note = ['Réponse souhaitée : '+(contactChannel === 'email' ? 'E-mail' : 'WhatsApp'),requestedDate ? 'Date souhaitée : '+requestedDate : '',details.trim()].filter(Boolean).join('\n');
    if (note.length > 1000) { setError('Les précisions sont trop longues. Raccourcissez votre message.'); return; }
    setSending(true);setError('');
    let customerPush: PushSubscriptionJSON | undefined;
    if (customerPushOptIn) {
      try {
        if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window) || !window.isSecureContext)
          throw new Error('Notifications non disponibles sur ce téléphone.');
        const permission=await Notification.requestPermission();
        if(permission!=='granted')throw new Error('Notifications non autorisées.');
        const settings=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-push',{
          method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'config'})
        });
        const configuration=await settings.json();
        if(!settings.ok||!configuration.enabled||typeof configuration.publicKey!=='string')
          throw new Error('Service de notifications indisponible.');
        const registration=await navigator.serviceWorker.ready;
        const publicKey=configuration.publicKey.replace(/-/g,'+').replace(/_/g,'/');
        const bytes=Uint8Array.from(atob(publicKey+'='.repeat((4-publicKey.length%4)%4)),ch=>ch.charCodeAt(0));
        const subscription=await registration.pushManager.getSubscription()
          || await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes as BufferSource});
        customerPush=subscription.toJSON();
        setCustomerPushNotice('');
      } catch {
        // An order must still be accepted when notifications are denied or unavailable.
        setCustomerPushNotice('La commande sera enregistrée sans notification sur ce téléphone.');
      }
    }
    try {
      const response=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-customer-submit',{
        method:'POST',
        headers:{'content-type':'application/json',apikey:supabaseAnonKey},
        body:JSON.stringify({profileId:config.profileId,productId:selected.id,quantity,
          name:name.trim(),contact:contact.trim(),note,
          idempotencyKey:requestKey,customerPush}),
      });
      const data=await response.json().catch(()=>({error:'Réponse invalide du serveur'}));
      if(!response.ok || data.accepted!==true || typeof data.reference!=='string') {
        throw new Error(response.status===503?'Enregistrement temporairement indisponible. Vos informations sont conservées.':
          typeof data.error==='string'?data.error:'Demande non enregistrée. Réessayez.');
      }
      // Only a positive acknowledgement from the server can display a confirmation.
      setConfirmation(data.reference);
      // A successful response binds this receipt to its original random
      // idempotency UUID. Never show full request details without that proof.
      if(config.profileId) {
        try{
          const old=readLocalRequests(config.profileId);
          const next=[{reference:data.reference,createdAt:new Date().toISOString(),
            kind:data.kind==='order'?'order' as const:'quote' as const,proof:requestKey},...old.filter(x=>x.reference!==data.reference)].slice(0,20);
          window.localStorage.setItem(localRequestKey(config.profileId),JSON.stringify(next));
          setLocalRequests(next);
        }catch{/* private storage unavailable: server receipt is still valid */}
      }
    } catch(err) {
      setError(err instanceof Error?err.message:'Demande non enregistrée. Réessayez.');
    } finally {setSending(false);}
  };
  const contactDirectWhatsApp=()=>{
    if(!canWhatsApp||!selected)return;
    const message=[
      'Bonjour, je vous contacte au sujet de : '+selected.title,
      'Je souhaite connaître les modalités de commande.',
      'Ce message est envoyé directement : aucune commande n’a été enregistrée sur Dalil Tounes.',
    ].join('\\n');
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  };
  const contactEmail=()=>{
    if(!confirmation || !canEmail || !selected)return;
    const subject='Demande Dalil Tounes '+confirmation.slice(0,8).toUpperCase()+' - '+selected.title;
    const body=['Bonjour,','Ma demande est déjà enregistrée sur Dalil Tounes.','Référence : '+confirmation,'Article : '+selected.title,'Quantité : '+quantity,...(requestedDate ? ['Date souhaitée : '+requestedDate] : []),'Nom : '+name.trim(),'E-mail : '+contact.trim()].join('\n');
    window.location.href='mailto:'+merchantEmail+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  };
  const contactWhatsApp=()=>{
    if(!confirmation || !canWhatsApp || !selected)return;
    const message=[
      'Bonjour, je vous contacte au sujet de ma demande enregistrée sur Dalil Tounes.',
      'Référence : '+confirmation,
      'Article : '+selected.title,
      'Quantité : '+quantity,
      ...(requestedDate ? ['Date souhaitée : '+requestedDate] : []),
      'Demande en attente de votre réponse. Nous convenons directement du paiement et de la livraison.',
    ].join('\n');
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  };
  return <>
    <button type="button" onClick={() => { setOpen(true); setSelected(null); setRequestOpen(false); setConfirmation(''); setCataloguePage(1); setCatalogueQuery(''); setCatalogueCategory(''); setOffersOpen(false); setCardLookupOpen(false); setCardInfo(null); }}
      aria-haspopup="dialog" className={triggerClassName}
      style={triggerClassName ? undefined : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 15px', border: '1px solid var(--boutique-accent, #e8bd43)', background: 'var(--boutique-button, #003c35)', color: 'var(--boutique-button-ink, #f7f4ec)', borderRadius: 24, fontSize: 13, fontWeight: 600, lineHeight: 1.2, cursor: 'pointer' }}>
      {triggerIcon ?? <span aria-hidden="true">✦</span>}<span>{triggerLabel}</span>{!config.demoMode && products.some(isRecentProduct) && <span aria-label="Nouveautés" style={{fontSize:10,color:'var(--boutique-accent, #e8bd43)',fontWeight:700,whiteSpace:'nowrap'}}>●</span>}
    </button>
    {open && <div role="presentation" onMouseDown={close}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, padding: 12, background: 'rgba(15,24,22,.67)', display: 'grid', placeItems: 'center' }}>
      <section role="dialog" aria-modal="true" className="dalil-boutique-dialog" aria-label={selected ? selected.title : 'Boutique'}
        onMouseDown={event => event.stopPropagation()}
        style={{ boxSizing: 'border-box', width: 'min(100%,450px)', maxHeight: 'min(87dvh,760px)', overflowY: 'auto', background: 'var(--boutique-surface, #003c35)', color: 'var(--boutique-ink, #f7f4ec)', borderRadius: 19, border: '1px solid var(--boutique-accent, #e8bd43)', boxShadow: '0 16px 55px #0005', padding: '14px 15px 17px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ color: 'var(--boutique-accent, #e8bd43)', fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase' }}>{config.merchantName}</span>
            <strong style={{ color: 'var(--boutique-ink, #063b30)', fontSize: 17 }}>{selected ? selected.title : 'Boutique'}</strong>
          </div>
          <button type="button" style={iconButton} onClick={close} aria-label="Fermer la boutique">×</button>
        </div>
        {!selected ? <>
          <p style={{ fontSize: 12, color: 'var(--boutique-muted, #d0ddd5)', margin: '0 0 12px' }}>Découvrez nos créations. Touchez une photo pour les détails.</p>
          {offers.length>0&&<>
            <button type="button" aria-expanded={offersOpen} onClick={()=>setOffersOpen(v=>!v)}
              style={{width:'100%',marginBottom:10,padding:'10px 12px',border:'1px solid var(--boutique-accent, #e8bd43)',borderRadius:11,
                background:'var(--boutique-card, #002f2b)',color:'var(--boutique-ink, #f7f4ec)',fontSize:12,fontWeight:700,textAlign:'left',cursor:'pointer'}}>
              🏷️ {offersOpen?'Fermer les offres':'Voir les offres du moment'} {offersOpen?'−':'＋'}
            </button>
            {offersOpen&&<div style={{display:'grid',gap:7,marginBottom:11}}>
              {offers.map(offer=><div key={offer.id} style={{border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-card, #002f2b)',padding:11,borderRadius:10}}>
                <strong style={{fontSize:12}}>{offer.title} · −{offer.value} %</strong>
                {offer.description&&<p style={{margin:'5px 0',fontSize:11}}>{offer.description}</p>}
              </div>)}
              <span style={{fontSize:10,color:'var(--boutique-muted, #d0ddd5)'}}>Réduction à confirmer directement avec le commerçant. Le total de la commande n’est pas recalculé automatiquement.</span>
            </div>}
          </>}
          {catalogueCategories.some(category=>category.toLowerCase()==='cartes cadeaux') && <button type="button"
            aria-pressed={catalogueCategory==='Cartes cadeaux'}
            onClick={()=>{setCatalogueCategory(current=>current==='Cartes cadeaux'?'':'Cartes cadeaux');setCataloguePage(1);}}
            style={{width:'100%',margin:'0 0 10px',padding:'10px 12px',border:'1px solid var(--boutique-accent, #e8bd43)',
              borderRadius:11,background:'var(--boutique-card, #002f2b)',color:'var(--boutique-ink, #f7f4ec)',fontSize:12,
              fontWeight:700,textAlign:'left',cursor:'pointer'}}>
            🎟️ {catalogueCategory==='Cartes cadeaux'?'Fermer les cartes cadeaux':'Découvrir les cartes cadeaux'}
          </button>}
          {catalogueCategories.some(category=>category.toLowerCase()==='packs cadeaux') && <button type="button"
            aria-pressed={catalogueCategory==='Packs cadeaux'}
            onClick={()=>{setCatalogueCategory(current=>current==='Packs cadeaux'?'':'Packs cadeaux');setCataloguePage(1);}}
            style={{width:'100%',margin:'0 0 10px',padding:'10px 12px',border:'1px solid var(--boutique-accent, #e8bd43)',
              borderRadius:11,background:'var(--boutique-card, #002f2b)',color:'var(--boutique-ink, #f7f4ec)',fontSize:12,
              fontWeight:700,textAlign:'left',cursor:'pointer'}}>
            🎁 {catalogueCategory==='Packs cadeaux'?'Fermer les packs cadeaux':'Découvrir les packs cadeaux'}
          </button>}
          {(products.length > 12 || catalogueCategories.length > 0) && <div style={{display:'grid',gap:8,margin:'0 0 12px'}}>
            <label style={{...labelStyle,color:'var(--boutique-ink, #f7f4ec)'}}>Rechercher une création
              <input type="search" value={catalogueQuery} onChange={event => {setCatalogueQuery(event.target.value);setCataloguePage(1);}} placeholder="Nom ou description" style={fieldStyle} />
            </label>
            {catalogueCategories.length > 0 && <label style={{...labelStyle,color:'var(--boutique-ink, #f7f4ec)'}}>Catégorie
              <select value={catalogueCategory} onChange={event => {setCatalogueCategory(event.target.value);setCataloguePage(1);}} style={fieldStyle}>
                <option value="">Toutes les catégories</option>
                {catalogueCategories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>}
          </div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
            {pageProducts.map(product => <button type="button" key={product.id} onClick={() => showProduct(product)}
              style={{ display: 'grid', gap: 5, textAlign: 'left', padding: 5, background: 'var(--boutique-card, #002f2b)', color: 'var(--boutique-ink, #f7f4ec)', border: '1px solid var(--boutique-accent, #e8bd43)', borderRadius: 12, minWidth: 0, cursor: 'pointer' }}>
              <img src={product.imageUrl} alt={product.title} loading="lazy"
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 8 }} />
              {!config.demoMode && isRecentProduct(product) && <span style={{justifySelf:'start',padding:'2px 7px',borderRadius:20,background:'var(--boutique-accent, #e8bd43)',color:'var(--boutique-button, #003c35)',fontSize:10,fontWeight:700}}>Nouveau</span>}
              {product.category?.trim().toLowerCase()==='packs cadeaux' && <span style={{padding:'0 4px',fontSize:10,color:'var(--boutique-accent, #e8bd43)'}}>🎁 Pack cadeau</span>}
              {product.category?.trim().toLowerCase()==='cartes cadeaux' && <span style={{padding:'0 4px',fontSize:10,color:'var(--boutique-accent, #e8bd43)'}}>🎟️ Carte cadeau</span>}
              <span style={{ padding: '0 4px', fontSize: 12, fontWeight: 600, overflowWrap: 'anywhere' }}>{product.title}</span>
              <span style={{ padding: '0 4px 3px', fontSize: 11, color: 'var(--boutique-accent, #e8bd43)' }}>Voir les détails ›</span>
            </button>)}
          </div>
          {filteredProducts.length === 0 && <p role="status" style={{fontSize:12,color:'var(--boutique-muted, #d0ddd5)',textAlign:'center',padding:'14px 0'}}>Aucun produit ne correspond à votre recherche.</p>}
          {pageCount > 1 && <nav aria-label="Pages du catalogue" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginTop:12}}>
            <button type="button" disabled={safePage <= 1} onClick={() => setCataloguePage(p => Math.max(1,p-1))} style={{...iconButton,padding:'0 12px',fontSize:12,opacity:safePage <= 1 ? .4 : 1}}>Précédent</button>
            <span style={{fontSize:12,color:'var(--boutique-muted, #d0ddd5)'}}>Page {safePage} / {pageCount}</span>
            <button type="button" disabled={safePage >= pageCount} onClick={() => setCataloguePage(p => Math.min(pageCount,p+1))} style={{...iconButton,padding:'0 12px',fontSize:12,opacity:safePage >= pageCount ? .4 : 1}}>Suivant</button>
          </nav>}
        </> : <>
          <button type="button" onClick={() => { if(sending)return; setSelected(null); setRequestOpen(false); setError(''); setConfirmation(''); }}
            style={{ border: 0, background: 'transparent', fontSize: 12, color: 'var(--boutique-accent, #e8bd43)', padding: '0 0 10px', cursor: 'pointer' }}>‹ Toutes les créations</button>
          <img src={selected.imageUrl} alt={selected.title} style={{ display: 'block', width: '100%', maxHeight: 190, aspectRatio: '16 / 9', objectFit: 'contain', background: 'var(--boutique-card, #002f2b)', borderRadius: 11 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
            <strong style={{ color: 'var(--boutique-ink, #f7f4ec)', fontSize: 16 }}>{selected.title}</strong>
            <span style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: 'var(--boutique-accent, #e8bd43)' }}>{priceText(selected)}</span>
          </div>
          {selected.category?.trim().toLowerCase()==='packs cadeaux' && <p style={{fontSize:11,color:'var(--boutique-accent, #e8bd43)',margin:'7px 0 0',fontWeight:700}}>🎁 Pack cadeau · prix fixé par le commerçant</p>}
          {selected.category?.trim().toLowerCase()==='cartes cadeaux' && <p style={{fontSize:11,color:'var(--boutique-accent, #e8bd43)',margin:'7px 0 0',fontWeight:700}}>🎟️ Carte cadeau · activée par le commerçant après vérification du paiement</p>}
          {selected.description && <p style={{ fontSize: 12, lineHeight: 1.5, margin: '6px 0 12px', color: 'var(--boutique-muted, #d0ddd5)' }}>{selected.description}</p>}
          {!requestOpen ? (orderAvailability==='available'||config.demoMode) ? <button type="button" onClick={() => setRequestOpen(true)}
            style={{ border: '1px solid var(--boutique-accent, #d4af37)', borderRadius: 10, background: 'var(--boutique-button, #063b30)', color: 'var(--boutique-button-ink, #fff)', fontSize: 13, fontWeight: 600, padding: '11px 14px', width: '100%', cursor: 'pointer' }}>
            {selected.mode === 'quote' ? 'Demander un devis' : 'Commander'}
          </button> : <div role="status" style={{display:'grid',gap:9,padding:12,border:'1px solid var(--boutique-accent, #e8bd43)',borderRadius:10,background:'var(--boutique-card, #002f2b)'}}>
            <p style={{margin:0,fontSize:12,color:'var(--boutique-muted, #d0ddd5)'}}>{orderAvailability==='checking'
              ? 'Vérification de la disponibilité des demandes…'
              : 'Les demandes via Dalil Tounes ne sont pas encore ouvertes. Aucun formulaire n’est envoyé ni enregistré.'}</p>
            {orderAvailability==='unavailable' && canWhatsApp && <button type="button" onClick={contactDirectWhatsApp}
              style={{border:'1px solid var(--boutique-accent, #e8bd43)',borderRadius:10,padding:'11px 12px',background:'var(--boutique-button, #003c35)',color:'var(--boutique-button-ink, #f7f4ec)',fontWeight:700}}>
              Contacter directement sur WhatsApp (sans enregistrement)
            </button>}
          </div> : <div style={{ display: 'grid', gap: 10, borderTop: '1px solid var(--boutique-accent, #e8bd43)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 13 }}>Votre demande</strong>
              <button type="button" onClick={() => setRequestOpen(false)} style={{ border: 0, color: 'var(--boutique-accent, #e8bd43)', background: 'transparent', fontSize: 12, cursor: 'pointer' }}>Réduire</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 9 }}>
              <label style={labelStyle}>Nom<input value={name} disabled={Boolean(confirmation)||sending} onChange={event => { setName(event.target.value); editRequest(); }} maxLength={120} placeholder="Votre nom" style={fieldStyle}/></label>
              <label style={labelStyle}>Qté<input type="number" min="1" max="99" value={quantity} disabled={Boolean(confirmation)||sending} onChange={event => { setQuantity(Math.max(1,Math.min(99,Number(event.target.value)||1))); editRequest(); }} style={fieldStyle}/></label>
            </div>
            <fieldset disabled={Boolean(confirmation)||sending} style={{border:0,padding:0,margin:0,display:'grid',gap:7}}>
              <legend style={{fontSize:12,fontWeight:600,marginBottom:5}}>Comment souhaitez-vous être contacté ?</legend>
              <div style={{display:'flex',gap:14,fontSize:12}}>
                <label><input type="radio" name="boutique-contact-channel" checked={contactChannel==='whatsapp'} onChange={() => {setContactChannel('whatsapp');setContact('');editRequest();}} /> WhatsApp</label>
                <label><input type="radio" name="boutique-contact-channel" checked={contactChannel==='email'} onChange={() => {setContactChannel('email');setContact('');editRequest();}} /> E-mail</label>
              </div>
            </fieldset>
            <label style={labelStyle}>{contactChannel==='email'?'Adresse e-mail':'Numéro de téléphone (WhatsApp)'}<input type={contactChannel==='email'?'email':'tel'} autoComplete={contactChannel==='email'?'email':'tel'} value={contact} disabled={Boolean(confirmation)||sending} onChange={event => { setContact(event.target.value); editRequest(); }} maxLength={150} placeholder={contactChannel==='email'?'nom@exemple.com':'+216 XX XXX XXX'} style={fieldStyle}/></label>
            <label style={labelStyle}>Date souhaitée (facultative)<input type="date" value={requestedDate} disabled={Boolean(confirmation)||sending} onChange={event => { setRequestedDate(event.target.value); editRequest(); }} min={new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10)} style={fieldStyle}/></label>
            <label style={labelStyle}>Précisions (facultatif)<textarea value={details} disabled={Boolean(confirmation)||sending} onChange={event => { setDetails(event.target.value); editRequest(); }} maxLength={960} rows={2} placeholder="Nombre de personnes, retrait ou livraison…" style={{...fieldStyle, resize: 'vertical'}}/></label>
            <label style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:11,lineHeight:1.4}}>
              <input type="checkbox" checked={customerPushOptIn} disabled={Boolean(confirmation)||sending}
                onChange={event=>{setCustomerPushOptIn(event.target.checked);setCustomerPushNotice('');}}
                style={{marginTop:2,flexShrink:0}}/>
              <span>Recevoir une notification sur ce téléphone quand ma commande sera confirmée (facultatif).</span>
            </label>
            {customerPushNotice && <p role="status" style={{margin:0,fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>{customerPushNotice}</p>}
            {selected.mode === 'order' && typeof selected.price === 'number' && Number.isFinite(selected.price) && selected.price > 0 && <p style={{margin:0,fontSize:12,fontWeight:600,color:'var(--boutique-muted, #d0ddd5)'}}>Total indicatif : {new Intl.NumberFormat('fr-FR',{style:'currency',currency:selected.currency}).format(Math.round(selected.price * quantity * (selected.currency === 'TND' ? 1000 : 100))/(selected.currency === 'TND' ? 1000 : 100))} · hors livraison éventuelle</p>}
            {selected.currency !== 'TND' && !config.demoMode && <p role="note" style={{margin:0,fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>Prise de commandes en euros indisponible pour le moment. Cette vitrine reste consultable.</p>}
            {selected.mode === 'order' && (typeof selected.price !== 'number' || !Number.isFinite(selected.price) || selected.price <= 0) && <p role="note" style={{margin:0,fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>Prix à confirmer par le professionnel : aucune commande ne peut être enregistrée sans prix valide.</p>}
            {error && <p role="alert" style={{ fontSize: 12, color: '#9e2828', margin: 0 }}>{error}</p>}
            {selected.mode==='order'&&<p style={{margin:0,fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>Votre demande est enregistrée sans paiement sur Dalil Tounes. Le professionnel vous contactera pour convenir directement des modalités de règlement et de livraison.</p>}
            <button type="button" onClick={()=>void send()} disabled={sending||Boolean(confirmation)}
              style={{ width: '100%', padding: 10, border: '1px solid var(--boutique-accent, #d4af37)', borderRadius: 10, background: 'var(--boutique-button, #063b30)', color: 'var(--boutique-button-ink, #fff)', cursor: sending||confirmation?'default':'pointer', fontSize: 13, fontWeight: 600, opacity:(sending || Boolean(confirmation)) ? 0.76 : 1 }}>
              {sending?'Enregistrement…':confirmation?'Demande enregistrée':config.demoMode?'Tester la demande (simulation)':selected.mode==='quote'&&!isUnpricedCustomerOrder(config.profileId,selected.title)?'Envoyer la demande de devis':'Envoyer ma commande'}
            </button>
            {confirmation&&<div role="status" style={{display:'grid',gap:8,background:'var(--boutique-button, #f3f6ea)',color:'var(--boutique-button-ink, #355535)',border:'1px solid var(--boutique-accent, #d4af37)',borderRadius:10,padding:12,fontSize:12}}>
              <strong>{selected&&isUnpricedCustomerOrder(config.profileId,selected.title)?'Merci pour votre commande ! Elle a bien été transmise au professionnel.':'Votre demande a bien été transmise au professionnel.'}</strong>
              <span>Référence : {confirmation.slice(0,8).toUpperCase()} · En attente de traitement · Aucun paiement enregistré.</span>
              {contactChannel==='email' && canEmail && <button type="button" onClick={contactEmail}
                style={{border:'1px solid var(--boutique-accent, #d4af37)',borderRadius:10,padding:'11px 12px',background:'var(--boutique-surface, #fff)',color:'var(--boutique-ink, #245c37)',fontWeight:700,cursor:'pointer'}}>
                Préparer un e-mail au professionnel
              </button>}
              {contactChannel==='whatsapp' && canWhatsApp&&<button type="button" onClick={contactWhatsApp}
                style={{border:'1px solid var(--boutique-accent, #d4af37)',borderRadius:10,padding:'11px 12px',background:'var(--boutique-surface, #fff)',color:'var(--boutique-ink, #245c37)',fontWeight:700,cursor:'pointer'}}>
                Contacter le professionnel sur WhatsApp
              </button>}
              <span>La demande reste enregistrée dans Dalil Tounes, même sans message supplémentaire. L'envoi d'un e-mail doit être confirmé dans votre messagerie.</span>
            </div>}
            {confirmation && selected.mode === 'order' && <p style={{margin:0,fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>Dalil Tounes ne collecte aucun paiement pour cette commande. Convenez directement du règlement avec le professionnel, par WhatsApp ou un autre moyen.</p>}
          </div>}
        </>}
        {!selected && <>
          {!config.demoMode && config.profileId && <div style={{marginTop:12,borderTop:'1px solid var(--boutique-accent, #e8bd43)',paddingTop:10}}>
            <button type="button" aria-expanded={myFollowupOpen} onClick={()=>setMyFollowupOpen(v=>!v)}
             style={{width:'100%',padding:11,marginBottom:8,borderRadius:10,border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-card, #002f2b)',color:'var(--boutique-ink, #f7f4ec)',cursor:'pointer',fontSize:12,fontWeight:700,textAlign:'left'}}>
             {t('📋 Mon suivi (sans compte)','📋 متابعتي دون حساب')} {myFollowupOpen?'−':'＋'}
            </button>
            {myFollowupOpen&&<div style={{display:'grid',gap:8,marginBottom:10,fontSize:12,color:'var(--boutique-ink, #f7f4ec)'}}>
             <p style={{margin:0}}>{t('Retrouvez vos demandes et leurs confirmations sur ce téléphone, sans créer de compte.','تابع طلباتك وتأكيداتها على هذا الهاتف دون إنشاء حساب.')}</p>
             {localRequests.some(item=>item.proof)&&<button type="button" disabled={statusChecking} onClick={()=>void refreshCustomerStatuses()}
              style={{padding:9,borderRadius:8,border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-button, #003c35)',color:'var(--boutique-button-ink, #fff)',fontWeight:700,opacity:statusChecking?0.7:1}}>
              {statusChecking?t('Actualisation…','جارٍ التحديث…'):t('Actualiser le statut de mes demandes','تحديث حالة الطلبات')}
             </button>}
             {statusNotice&&<p role="status" style={{margin:0}}>{statusNotice}</p>}
             {localRequests.length===0?<p style={{margin:0}}>{t('Aucune référence conservée sur cet appareil.','لا توجد طلبات محفوظة على هذا الجهاز.')}</p>:
              localRequests.map(item=><div key={item.reference} style={{display:'grid',gap:3,padding:9,border:'1px solid var(--boutique-accent, #e8bd43)',borderRadius:8}}>
               {liveStatuses[item.reference]?(()=>{
                 const detail=liveStatuses[item.reference];
                 const confirmed=detail.status==='confirmed';
                 const customerOrder=detail.kind==='order'||isUnpricedCustomerOrder(config.profileId,detail.productTitle);
                 const kind=customerOrder?t('commande','الطلب'):t('demande de devis','طلب عرض سعر');
                 const requested=detail.requestedDate&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(detail.requestedDate)?
                   detail.requestedDate.split('-').reverse().join('/'):null;
                 return <>
                   <strong style={{fontSize:15}}>{confirmed?
                     (ar?'تم تأكيد '+kind+' بنجاح.':'Votre '+kind+' a bien été confirmée.'):
                     detail.status==='received'?(ar?'تم استلام '+kind+' بنجاح.':'Votre '+kind+' a bien été reçue.'):
                     'Votre '+kind+' : '+(customerStatusLabels[detail.status]||'En cours de traitement')+'.'}</strong>
                   <span>{t('Numéro de suivi :','رقم المتابعة:')} <strong>{item.reference.slice(0,8).toUpperCase()}</strong></span>
                   <span>{t('Article :','المنتج:')} {detail.productTitle}</span>
                   <span>{t('Quantité :','الكمية:')} {detail.quantity}</span>
                   {requested&&<span>{t('Date souhaitée :','التاريخ المطلوب:')} {requested}</span>}
                   <span>{confirmed?(customerOrder?t('Merci pour votre commande et votre confiance !','شكراً على طلبكم وثقتكم!'):t('Merci pour votre confiance !','شكراً لثقتكم!')):t('Nous vous informerons de la suite de votre demande.','سنعلمكم بمستجدات طلبكم.')}</span>
                 </>;
               })():<>
                 <strong>{item.kind==='quote'?'Votre demande de devis':'Votre commande'} du {new Date(item.createdAt).toLocaleDateString('fr-FR')}</strong>
                 <span>Numéro de suivi : {item.reference.slice(0,8).toUpperCase()}</span>
                 <span>{item.proof?'Appuyez sur « Actualiser » pour retrouver les informations de votre demande.':'Le suivi de cette ancienne demande n’est pas disponible.'}</span>
               </>}
              </div>)}
             {localRequests.length>0&&<button type="button" onClick={()=>{
               if(!window.confirm('Effacer les références de ce téléphone ? Les demandes enregistrées chez le commerçant ne seront pas supprimées.'))return;
               try{window.localStorage.removeItem(localRequestKey(config.profileId!));}catch{/* ignored */}
               setLocalRequests([]);setLiveStatuses({});setStatusNotice('');
              }} style={{padding:9,borderRadius:8,border:'1px solid var(--boutique-accent, #e8bd43)',background:'transparent',color:'inherit'}}>{t('Effacer les références de cet appareil','حذف المراجع من هذا الجهاز')}</button>}
             <p style={{margin:0}}>{t('Votre carte de fidélité se consulte ici, avec le code remis par le commerçant.','يمكنك عرض بطاقة الوفاء هنا برمز التاجر.')}</p>
            </div>}

            {myFollowupOpen&&<>
            <button type="button" aria-expanded={cardLookupOpen} onClick={()=>{setCardLookupOpen(v=>!v);setCardInfo(null);setCardNotice('');}}
              style={{width:'100%',padding:11,borderRadius:10,border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-card, #002f2b)',color:'var(--boutique-ink, #f7f4ec)',cursor:'pointer',fontSize:12,fontWeight:700,textAlign:'left'}}>
              {t('⭐ Ma fidélité et mes cartes cadeaux','⭐ بطاقة الوفاء وبطاقات الهدايا')} {cardLookupOpen?'−':'＋'}
            </button>
            {cardLookupOpen&&<div dir={ar?'rtl':'ltr'} style={{display:'grid',gap:8,marginTop:9}}>
              {savedLoyalty&&cardLookupKind==='loyalty'&&<div style={{display:'grid',gap:6}}>
                <button type="button" disabled={cardChecking} onClick={()=>void lookupCard(savedLoyalty)} style={{padding:10,borderRadius:9,border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-button, #003c35)',color:'var(--boutique-button-ink, #fff)',fontWeight:700}}>
                  {t('Voir directement ma carte','عرض بطاقتي مباشرة')}
                </button>
                <button type="button" onClick={()=>{if(!config.profileId)return;try{localStorage.removeItem(savedLoyaltyKey(config.profileId));}catch{/* unavailable */}setSavedLoyalty('');setCardInfo(null);}} style={{padding:9,borderRadius:9,border:'1px solid var(--boutique-accent, #e8bd43)',background:'transparent',color:'inherit'}}>
                  {t('Oublier ma carte sur ce téléphone','حذف البطاقة المحفوظة من هذا الهاتف')}
                </button>
              </div>}
              <label style={labelStyle}>{t('Type de carte','نوع البطاقة')}
                <select style={fieldStyle} value={cardLookupKind} onChange={e=>{setCardLookupKind(e.target.value as 'loyalty'|'gift_card');setCardCode('');setCardInfo(null);setCardNotice('');}}>
                  <option value="loyalty">{t('Carte de fidélité','بطاقة الوفاء')}</option><option value="gift_card">{t('Carte cadeau','بطاقة هدية')}</option>
                </select>
              </label>
              <label style={labelStyle}>{cardLookupKind==='loyalty'?'Code de fidélité (4 chiffres)':'Code complet de la carte cadeau'}
                <input style={fieldStyle} value={cardCode} onChange={e=>{setCardCode(cardLookupKind==='loyalty'?e.target.value.replace(/\D/g,'').slice(0,4):e.target.value);setCardInfo(null);}}
                  placeholder={cardLookupKind==='loyalty'?'Ex. 0427':'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}
                  inputMode={cardLookupKind==='loyalty'?'numeric':'text'} autoComplete="off" maxLength={cardLookupKind==='loyalty'?4:36}/>
              </label>
              {cardLookupKind==='loyalty'&&<label style={{display:'flex',gap:6,fontSize:11,alignItems:'center'}}>
                <input type="checkbox" checked={rememberLoyalty} onChange={e=>setRememberLoyalty(e.target.checked)}/>
                {t('Garder ma carte sur ce téléphone (éviter les appareils partagés)','حفظ بطاقتي على هذا الهاتف (تجنب الأجهزة المشتركة)')}
              </label>}
              <button type="button" disabled={cardChecking} onClick={()=>void lookupCard()}
                style={{padding:11,borderRadius:10,border:'1px solid var(--boutique-accent, #e8bd43)',background:'var(--boutique-button, #003c35)',color:'var(--boutique-button-ink, #fff)',fontWeight:700}}>
                {cardChecking?t('Vérification…','جارٍ التحقق…'):t('Voir ma carte','عرض البطاقة')}
              </button>
              {cardNotice&&<p role="status" style={{fontSize:11,margin:0}}>{cardNotice}</p>}
              {cardInfo&&<div role="status" style={{border:'1px solid var(--boutique-accent, #e8bd43)',padding:10,borderRadius:9,fontSize:12}}>
                <strong>{String(cardInfo.title||'Ma carte')}</strong>
                {cardInfo.kind==='loyalty'&&<div style={{display:'grid',gap:4,marginTop:6}}>
                  <strong>{String(cardInfo.stamps)} achat(s) sur {String(cardInfo.target)} pour votre prochain cadeau</strong>
                  <span>{t('Votre cadeau :','هديتك:')} {String(cardInfo.reward||'à définir avec le commerçant')}</span>
                  <span>{t('Récompenses déjà remises :','الهدايا المستلمة:')} {Number.isFinite(Number(cardInfo.rewards_given))?Number(cardInfo.rewards_given):0}</span>
                  {Number(cardInfo.stamps)>=Number(cardInfo.target)&&<strong>{t('Votre cadeau est prêt ! Contactez le commerçant pour en profiter.','هديتك جاهزة! تواصل مع التاجر لاستلامها.')}</strong>}
                </div>}
                {cardInfo.kind==='gift_card'&&<p style={{margin:'5px 0 0'}}>Solde : {Number(cardInfo.balance).toFixed(3)} DT · {cardInfo.state==='active'?'Carte active':cardInfo.state==='pending'?'En attente d’activation':'Carte utilisée ou inactive'}</p>}
              </div>}
              <span style={{fontSize:11,color:'var(--boutique-muted, #d0ddd5)'}}>Vos achats sont ajoutés après validation par le commerçant. Une demande ou une commande confirmée ne donne pas automatiquement un point.</span>
            </div>}
            </>}
          </div>}
          <BoutiquePushFollow profileId={config.profileId} demoMode={config.demoMode} />
          <BoutiquePushFollow profileId={config.profileId} demoMode={config.demoMode} promotion />
        </>}
        {config.demoMode && <p style={{ fontSize: 10, margin: '10px 0 0', color: 'var(--boutique-muted, #d0ddd5)' }}>Aperçu uniquement — aucune demande ou paiement n'est envoyé.</p>}
      </section>
    </div>}
  </>;
}
