import { useEffect, useState, type ReactNode } from 'react';
import { BoutiquePushFollow } from './BoutiquePushFollow';
import { supabaseUrl, supabaseAnonKey } from '../../lib/supabaseClient';

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
const fieldStyle = { boxSizing: 'border-box', width: '100%', minWidth: 0, border: '1px solid #d7c7ae', borderRadius: 9, padding: '9px 10px', fontSize: 14, background: '#fff' } as const;
const iconButton = { background: '#fffaf3', border: '1px solid #d7c7ae', borderRadius: 24, height: 34, minWidth: 34, cursor: 'pointer', color: '#4c3046', fontSize: 20 } as const;

export function BoutiqueInteractive({ config, triggerClassName, triggerLabel = 'Boutique', triggerIcon }: { config: BoutiqueConfig; triggerClassName?: string; triggerLabel?: string; triggerIcon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BoutiqueProduct | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  // Keep the same UUID across retries to prevent duplicates after network failure.
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const [catalogueQuery, setCatalogueQuery] = useState('');
  const [catalogueCategory, setCatalogueCategory] = useState('');
  const [cataloguePage, setCataloguePage] = useState(1);
  const products = config.products.filter(product => Boolean(product.id && product.title && product.imageUrl));
  const catalogueCategories = [...new Set(products.map(product => product.category?.trim()).filter((category): category is string => Boolean(category)))].sort((a,b) => a.localeCompare(b,'fr'));
  const filteredProducts = products.filter(product =>
    (!catalogueCategory || product.category?.trim() === catalogueCategory)
    && (!catalogueQuery.trim() || (product.title + ' ' + (product.description || '')).toLocaleLowerCase().includes(catalogueQuery.trim().toLocaleLowerCase()))
  );
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / 12));
  const safePage = Math.min(cataloguePage, pageCount);
  const pageProducts = filteredProducts.slice((safePage - 1) * 12, safePage * 12);
  const phone = config.whatsapp.replace(/\D/g, '');
  const canWhatsApp = /^\d{8,15}$/.test(phone);
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
    setConfirmation(''); setRequestKey(crypto.randomUUID());
  };
  const showProduct = (product: BoutiqueProduct) => {
    setSelected(product); setRequestOpen(false); setQuantity(1);
    setName(''); setContact(''); setDetails(''); setError('');
    setConfirmation(''); setSending(false); setRequestKey(crypto.randomUUID());
  };
  const send = async () => {
    if (!selected || sending || confirmation) return;
    if (config.demoMode) { setError('Démonstration : aucune demande, message ou paiement réel n’est envoyé.'); return; }
    if (!config.profileId) { setError('Les demandes ne sont pas encore activées pour cet établissement.'); return; }
    // The current orders API validates only TND. Refuse EUR here rather than imply that an order was recorded.
    if (selected.currency !== 'TND') { setError('Les commandes en euros ne sont pas encore activées sur Dalil Tounes. Contactez directement le professionnel.'); return; }
    if (selected.mode === 'order' && (typeof selected.price !== 'number' || !Number.isFinite(selected.price) || selected.price <= 0)) {
      setError('Cet article n’a pas de prix valide pour une commande. Demandez un devis au professionnel.'); return;
    }
    if (name.trim().length < 2 || contact.trim().length < 3) {
      setError('Indiquez votre nom et vos coordonnées.'); return;
    }
    setSending(true);setError('');
    try {
      const response=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-customer-submit',{
        method:'POST',
        headers:{'content-type':'application/json',apikey:supabaseAnonKey},
        body:JSON.stringify({profileId:config.profileId,productId:selected.id,quantity,
          name:name.trim(),contact:contact.trim(),note:details.trim(),
          idempotencyKey:requestKey}),
      });
      const data=await response.json().catch(()=>({error:'Réponse invalide du serveur'}));
      if(!response.ok || data.accepted!==true || typeof data.reference!=='string') {
        throw new Error(response.status===503?'Enregistrement temporairement indisponible. Vos informations sont conservées.':
          typeof data.error==='string'?data.error:'Demande non enregistrée. Réessayez.');
      }
      // Only a positive acknowledgement from the server can display a confirmation.
      setConfirmation(data.reference);
    } catch(err) {
      setError(err instanceof Error?err.message:'Demande non enregistrée. Réessayez.');
    } finally {setSending(false);}
  };
  const contactWhatsApp=()=>{
    if(!confirmation || !canWhatsApp || !selected)return;
    const message=[
      'Bonjour, je vous contacte au sujet de ma demande enregistrée sur Dalil Tounes.',
      'Référence : '+confirmation,
      'Article : '+selected.title,
      'Quantité : '+quantity,
      'Demande en attente de votre réponse. Aucun paiement effectué.',
    ].join('\n');
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  };
  return <>
    <button type="button" onClick={() => { setOpen(true); setSelected(null); setRequestOpen(false); setConfirmation(''); setCataloguePage(1); setCatalogueQuery(''); setCatalogueCategory(''); }}
      aria-haspopup="dialog" className={triggerClassName}
      style={triggerClassName ? undefined : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 15px', border: '1px solid #d2b276', background: '#fffaf2', color: '#5a3a52', borderRadius: 24, fontSize: 13, fontWeight: 600, lineHeight: 1.2, cursor: 'pointer' }}>
      {triggerIcon ?? <span aria-hidden="true">✦</span>}<span>{triggerLabel}</span>{!config.demoMode && products.some(isRecentProduct) && <span aria-label="Nouveautés" style={{fontSize:10,color:'#9b773e',fontWeight:700,whiteSpace:'nowrap'}}>●</span>}
    </button>
    {open && <div role="presentation" onMouseDown={close}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, padding: 12, background: 'rgba(15,24,22,.67)', display: 'grid', placeItems: 'center' }}>
      <section role="dialog" aria-modal="true" aria-label={selected ? selected.title : 'Boutique'}
        onMouseDown={event => event.stopPropagation()}
        style={{ boxSizing: 'border-box', width: 'min(100%,450px)', maxHeight: 'min(87dvh,760px)', overflowY: 'auto', background: '#fffcf6', color: '#3c302e', borderRadius: 19, border: '1px solid #dfc699', boxShadow: '0 16px 55px #0005', padding: '14px 15px 17px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ color: '#947244', fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase' }}>{config.merchantName}</span>
            <strong style={{ color: '#4b2e47', fontSize: 17 }}>{selected ? selected.title : 'Boutique'}</strong>
          </div>
          <button type="button" style={iconButton} onClick={close} aria-label="Fermer la boutique">×</button>
        </div>
        {!selected ? <>
          <p style={{ fontSize: 12, color: '#74665e', margin: '0 0 12px' }}>Découvrez nos créations. Touchez une photo pour les détails.</p>
          {(products.length > 12 || catalogueCategories.length > 0) && <div style={{display:'grid',gap:8,margin:'0 0 12px'}}>
            <label style={{...labelStyle,color:'#594e45'}}>Rechercher une création
              <input type="search" value={catalogueQuery} onChange={event => {setCatalogueQuery(event.target.value);setCataloguePage(1);}} placeholder="Nom ou description" style={fieldStyle} />
            </label>
            {catalogueCategories.length > 0 && <label style={{...labelStyle,color:'#594e45'}}>Catégorie
              <select value={catalogueCategory} onChange={event => {setCatalogueCategory(event.target.value);setCataloguePage(1);}} style={fieldStyle}>
                <option value="">Toutes les catégories</option>
                {catalogueCategories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>}
          </div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
            {pageProducts.map(product => <button type="button" key={product.id} onClick={() => showProduct(product)}
              style={{ display: 'grid', gap: 5, textAlign: 'left', padding: 5, background: '#fff', color: '#382d2c', border: '1px solid #e1d4c3', borderRadius: 12, minWidth: 0, cursor: 'pointer' }}>
              <img src={product.imageUrl} alt={product.title} loading="lazy"
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 8 }} />
              {!config.demoMode && isRecentProduct(product) && <span style={{justifySelf:'start',padding:'2px 7px',borderRadius:20,background:'#f4ecd7',color:'#6d4f28',fontSize:10,fontWeight:700}}>Nouveau</span>}
              <span style={{ padding: '0 4px', fontSize: 12, fontWeight: 600, overflowWrap: 'anywhere' }}>{product.title}</span>
              <span style={{ padding: '0 4px 3px', fontSize: 11, color: '#8c713f' }}>Voir les détails ›</span>
            </button>)}
          </div>
          {filteredProducts.length === 0 && <p role="status" style={{fontSize:12,color:'#685c50',textAlign:'center',padding:'14px 0'}}>Aucun produit ne correspond à votre recherche.</p>}
          {pageCount > 1 && <nav aria-label="Pages du catalogue" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginTop:12}}>
            <button type="button" disabled={safePage <= 1} onClick={() => setCataloguePage(p => Math.max(1,p-1))} style={{...iconButton,padding:'0 12px',fontSize:12,opacity:safePage <= 1 ? .4 : 1}}>Précédent</button>
            <span style={{fontSize:12,color:'#615548'}}>Page {safePage} / {pageCount}</span>
            <button type="button" disabled={safePage >= pageCount} onClick={() => setCataloguePage(p => Math.min(pageCount,p+1))} style={{...iconButton,padding:'0 12px',fontSize:12,opacity:safePage >= pageCount ? .4 : 1}}>Suivant</button>
          </nav>}
        </> : <>
          <button type="button" onClick={() => { if(sending)return; setSelected(null); setRequestOpen(false); setError(''); setConfirmation(''); }}
            style={{ border: 0, background: 'transparent', fontSize: 12, color: '#806538', padding: '0 0 10px', cursor: 'pointer' }}>‹ Toutes les créations</button>
          <img src={selected.imageUrl} alt={selected.title} style={{ display: 'block', width: '100%', maxHeight: 190, aspectRatio: '16 / 9', objectFit: 'contain', background: '#f4eee5', borderRadius: 11 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
            <strong style={{ color: '#4b2e47', fontSize: 16 }}>{selected.title}</strong>
            <span style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: '#826332' }}>{priceText(selected)}</span>
          </div>
          {selected.description && <p style={{ fontSize: 12, lineHeight: 1.5, margin: '6px 0 12px', color: '#62574d' }}>{selected.description}</p>}
          {!requestOpen ? <button type="button" onClick={() => setRequestOpen(true)}
            style={{ border: 0, borderRadius: 10, background: '#4d2a47', color: '#fff', fontSize: 13, fontWeight: 600, padding: '11px 14px', width: '100%', cursor: 'pointer' }}>
            {selected.mode === 'quote' ? 'Demander un devis' : 'Commander'}
          </button> : <div style={{ display: 'grid', gap: 10, borderTop: '1px solid #e5d7c3', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 13 }}>Votre demande</strong>
              <button type="button" onClick={() => setRequestOpen(false)} style={{ border: 0, color: '#8a6a42', background: 'transparent', fontSize: 12, cursor: 'pointer' }}>Réduire</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 9 }}>
              <label style={labelStyle}>Nom<input value={name} disabled={Boolean(confirmation)||sending} onChange={event => setName(event.target.value)} maxLength={120} placeholder="Votre nom" style={fieldStyle}/></label>
              <label style={labelStyle}>Qté<input type="number" min="1" max="99" value={quantity} disabled={Boolean(confirmation)||sending} onChange={event => setQuantity(Math.max(1,Math.min(99,Number(event.target.value)||1)))} style={fieldStyle}/></label>
            </div>
            <label style={labelStyle}>Téléphone ou e-mail<input value={contact} disabled={Boolean(confirmation)||sending} onChange={event => setContact(event.target.value)} maxLength={150} placeholder="Vos coordonnées" style={fieldStyle}/></label>
            <label style={labelStyle}>Précisions (facultatif)<textarea value={details} disabled={Boolean(confirmation)||sending} onChange={event => setDetails(event.target.value)} maxLength={1000} rows={2} placeholder="Date, nombre de personnes, livraison…" style={{...fieldStyle, resize: 'vertical'}}/></label>
            {selected.mode === 'order' && typeof selected.price === 'number' && Number.isFinite(selected.price) && selected.price > 0 && <p style={{margin:0,fontSize:12,fontWeight:600,color:'#6d4d2b'}}>Total indicatif : {new Intl.NumberFormat('fr-FR',{style:'currency',currency:selected.currency}).format(Math.round(selected.price * quantity * (selected.currency === 'TND' ? 1000 : 100))/(selected.currency === 'TND' ? 1000 : 100))} · hors livraison éventuelle</p>}
            {selected.currency !== 'TND' && !config.demoMode && <p role="note" style={{margin:0,fontSize:11,color:'#88552a'}}>Prise de commandes en euros indisponible pour le moment. Cette vitrine reste consultable.</p>}
            {selected.mode === 'order' && (typeof selected.price !== 'number' || !Number.isFinite(selected.price) || selected.price <= 0) && <p role="note" style={{margin:0,fontSize:11,color:'#88552a'}}>Prix à confirmer par le professionnel : aucune commande ne peut être enregistrée sans prix valide.</p>}
            {error && <p role="alert" style={{ fontSize: 12, color: '#9e2828', margin: 0 }}>{error}</p>}
            {selected.mode==='order'&&<p style={{margin:0,fontSize:11,color:'#6c5945'}}>La commande n’est pas encore confirmée. Acompte ou paiement total obligatoire avant validation, selon les modalités du professionnel. Aucun paiement à la livraison.</p>}
            <button type="button" onClick={()=>void send()} disabled={sending||Boolean(confirmation)}
              style={{ width: '100%', padding: 10, border: 0, borderRadius: 10, background: '#4d2a47', color: '#fff', cursor: sending||confirmation?'default':'pointer', fontSize: 13, fontWeight: 600, opacity:(sending || Boolean(confirmation)) ? 0.76 : 1 }}>
              {sending?'Enregistrement…':confirmation?'Demande enregistrée':config.demoMode?'Tester la demande (simulation)':selected.mode === 'quote' ? 'Envoyer la demande de devis' : 'Enregistrer la demande de commande'}
            </button>
            {confirmation&&<div role="status" style={{display:'grid',gap:8,background:'#f3f6ea',color:'#355535',borderRadius:10,padding:12,fontSize:12}}>
              <strong>Demande enregistrée dans Mon compte du professionnel.</strong>
              <span>Référence : {confirmation.slice(0,8).toUpperCase()} · En attente de traitement · Aucun paiement enregistré.</span>
              {canWhatsApp&&<button type="button" onClick={contactWhatsApp}
                style={{border:'1px solid #b3c9b3',borderRadius:10,padding:'11px 12px',background:'#fff',color:'#245c37',fontWeight:700,cursor:'pointer'}}>
                Contacter le professionnel sur WhatsApp
              </button>}
              <span>WhatsApp est facultatif. Votre demande reste enregistrée même si vous ne l’ouvrez pas.</span>
            </div>}
            {confirmation && selected.mode === 'order' && <p style={{margin:0,fontSize:11,color:'#6c5945'}}>Aucun paiement n’a été effectué. Le règlement ne sera proposé qu’après validation d’un parcours de paiement vérifiable.</p>}
          </div>}
        </>}
        {!selected && <BoutiquePushFollow profileId={config.profileId} demoMode={config.demoMode} />}
        {config.demoMode && <p style={{ fontSize: 10, margin: '10px 0 0', color: '#796d5f' }}>Aperçu uniquement — aucune demande ou paiement n'est envoyé.</p>}
      </section>
    </div>}
  </>;
}
