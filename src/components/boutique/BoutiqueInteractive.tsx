import { useEffect, useState } from 'react';

export type BoutiqueProduct = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  price?: number;
  currency: 'EUR' | 'TND';
  mode: 'order' | 'quote';
  merchantPaymentUrl?: string;
};

export type BoutiqueConfig = {
  merchantName: string;
  whatsapp: string;
  products: BoutiqueProduct[];
  paymentsVerified?: boolean;
  demoMode?: boolean;
};

const priceText = (product: BoutiqueProduct) =>
  typeof product.price === 'number'
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: product.currency }).format(product.price)
    : 'Sur devis';

const merchantPaymentLink = (value?: string) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
};

const labelStyle = { display: 'grid', gap: 4, fontSize: 12, fontWeight: 500 } as const;
const fieldStyle = { boxSizing: 'border-box', width: '100%', minWidth: 0, border: '1px solid #d7c7ae', borderRadius: 9, padding: '9px 10px', fontSize: 14, background: '#fff' } as const;
const iconButton = { background: '#fffaf3', border: '1px solid #d7c7ae', borderRadius: 24, height: 34, minWidth: 34, cursor: 'pointer', color: '#4c3046', fontSize: 20 } as const;

export function BoutiqueInteractive({ config }: { config: BoutiqueConfig }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BoutiqueProduct | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const products = config.products.filter(product => Boolean(product.id && product.title && product.imageUrl));
  const phone = config.whatsapp.replace(/\D/g, '');
  const canWhatsApp = /^\d{8,15}$/.test(phone);

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

  const close = () => { setOpen(false); setSelected(null); setRequestOpen(false); setError(''); };
  const showProduct = (product: BoutiqueProduct) => {
    setSelected(product); setRequestOpen(false); setQuantity(1);
    setName(''); setContact(''); setDetails(''); setError('');
  };
  const send = () => {
    if (!selected) return;
    if (config.demoMode) { setError('Démonstration : aucun devis, message ou paiement réel n’est envoyé.'); return; }
    if (!name.trim() || !contact.trim()) { setError('Indiquez votre nom et votre contact.'); return; }
    if (!canWhatsApp) { setError('WhatsApp doit être configuré par le professionnel.'); return; }
    const text = [
      selected.mode === 'quote' ? 'Demande de devis' : 'Demande de commande',
      'Professionnel : ' + config.merchantName,
      'Article : ' + selected.title,
      'Quantité : ' + quantity,
      'Prix : ' + priceText(selected),
      'Nom : ' + name.trim(),
      'Contact : ' + contact.trim(),
      details.trim() ? 'Précisions : ' + details.trim() : '',
      'Vitrine : ' + window.location.href,
      'À confirmer par le professionnel. Aucun paiement effectué.',
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  };
  const payLink = selected?.mode === 'order' && config.paymentsVerified && !config.demoMode && quantity === 1
    ? merchantPaymentLink(selected.merchantPaymentUrl)
    : '';

  return <>
    <button type="button" onClick={() => { setOpen(true); setSelected(null); setRequestOpen(false); }}
      aria-haspopup="dialog"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 15px', border: '1px solid #d2b276', background: '#fffaf2', color: '#5a3a52', borderRadius: 24, fontSize: 13, fontWeight: 600, lineHeight: 1.2, cursor: 'pointer' }}>
      <span aria-hidden="true">✦</span> Boutique
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
            {products.map(product => <button type="button" key={product.id} onClick={() => showProduct(product)}
              style={{ display: 'grid', gap: 5, textAlign: 'left', padding: 5, background: '#fff', color: '#382d2c', border: '1px solid #e1d4c3', borderRadius: 12, minWidth: 0, cursor: 'pointer' }}>
              <img src={product.imageUrl} alt={product.title} loading="lazy"
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 8 }} />
              <span style={{ padding: '0 4px', fontSize: 12, fontWeight: 600, overflowWrap: 'anywhere' }}>{product.title}</span>
              <span style={{ padding: '0 4px 3px', fontSize: 11, color: '#8c713f' }}>Voir les détails ›</span>
            </button>)}
          </div>
        </> : <>
          <button type="button" onClick={() => { setSelected(null); setRequestOpen(false); setError(''); }}
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
              <label style={labelStyle}>Nom<input value={name} onChange={event => setName(event.target.value)} maxLength={120} placeholder="Votre nom" style={fieldStyle}/></label>
              <label style={labelStyle}>Qté<input type="number" min="1" max="99" value={quantity} onChange={event => setQuantity(Math.max(1,Math.min(99,Number(event.target.value)||1)))} style={fieldStyle}/></label>
            </div>
            <label style={labelStyle}>Téléphone ou e-mail<input value={contact} onChange={event => setContact(event.target.value)} maxLength={150} placeholder="Vos coordonnées" style={fieldStyle}/></label>
            <label style={labelStyle}>Précisions (facultatif)<textarea value={details} onChange={event => setDetails(event.target.value)} maxLength={1000} rows={2} placeholder="Date, nombre de personnes, livraison…" style={{...fieldStyle, resize: 'vertical'}}/></label>
            {error && <p role="alert" style={{ fontSize: 12, color: '#9e2828', margin: 0 }}>{error}</p>}
            <button type="button" onClick={send} style={{ width: '100%', padding: 10, border: 0, borderRadius: 10, background: '#4d2a47', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {config.demoMode ? 'Tester la demande (simulation)' : selected.mode === 'quote' ? 'Envoyer la demande de devis' : 'Envoyer la commande'}
            </button>
            {payLink && <a href={payLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#765421', textAlign: 'center' }}>Payer directement le professionnel (1 article)</a>}
          </div>}
        </>}
        {config.demoMode && <p style={{ fontSize: 10, margin: '10px 0 0', color: '#796d5f' }}>Aperçu uniquement — aucune demande ou paiement n'est envoyé.</p>}
      </section>
    </div>}
  </>;
}
