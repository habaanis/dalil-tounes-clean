import { useEffect, useState } from 'react';

export type BoutiqueProduct = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  price?: number;
  currency: 'EUR' | 'TND';
  mode: 'order' | 'quote';
  // URL created by the merchant's own payment provider, for exactly one unit.
  merchantPaymentUrl?: string;
};

export type BoutiqueConfig = {
  merchantName: string;
  whatsapp: string; // International number, without '+'.
  products: BoutiqueProduct[];
  paymentsVerified?: boolean; // Set only after merchant account and destination verification.
};

const formatPrice = (product: BoutiqueProduct) =>
  typeof product.price === 'number'
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: product.currency }).format(product.price)
    : 'Prix sur demande';

const safePaymentUrl = (value: string | undefined) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
};

export function BoutiqueInteractive({ config }: { config: BoutiqueConfig }) {
  const [selected, setSelected] = useState<BoutiqueProduct | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const phone = config.whatsapp.replace(/\D/g, '');
  const canWhatsApp = /^\d{8,15}$/.test(phone);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  if (config.products.length === 0) return null;

  const open = (product: BoutiqueProduct) => {
    setQuantity(1);
    setMessage('');
    setError('');
    setSelected(product);
  };

  const send = () => {
    if (!selected) return;
    if (!name.trim() || !contact.trim()) {
      setError('Indiquez votre nom et un moyen de contact.');
      return;
    }
    if (!canWhatsApp) {
      setError('Le professionnel doit configurer son numéro WhatsApp.');
      return;
    }
    const action = selected.mode === 'quote' ? 'Demande de devis' : 'Demande de commande';
    const content = [
      action + ' via la vitrine',
      'Professionnel : ' + config.merchantName,
      'Article : ' + selected.title,
      'Quantité : ' + quantity,
      'Prix affiché : ' + formatPrice(selected),
      'Nom : ' + name.trim(),
      'Contact : ' + contact.trim(),
      message.trim() ? 'Précisions : ' + message.trim() : '',
      'Lien : ' + window.location.href,
      'À confirmer par le professionnel. Aucun paiement effectué.',
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(content), '_blank', 'noopener,noreferrer');
  };

  const paymentUrl = selected?.mode === 'order' && quantity === 1 && config.paymentsVerified
    ? safePaymentUrl(selected.merchantPaymentUrl)
    : '';

  return (
    <section aria-label="Boutique du professionnel" style={{ padding: '16px 0' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Boutique & créations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(145px,1fr))', gap: 12 }}>
        {config.products.filter(product => product.id && product.title && product.imageUrl).map(product => (
          <button key={product.id} type="button" onClick={() => open(product)}
            style={{ textAlign: 'left', border: '1px solid #d8c8ad', borderRadius: 14, overflow: 'hidden', background: '#fffdf8', color: '#342b25', cursor: 'pointer' }}>
            <img src={product.imageUrl} alt={product.title} loading="lazy"
              style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }} />
            <span style={{ display: 'block', padding: 10 }}>
              <strong style={{ display: 'block' }}>{product.title}</strong>
              <small>{product.mode === 'quote' ? 'Demander un devis' : formatPrice(product)}</small>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div role="presentation" onMouseDown={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0009', display: 'grid', placeItems: 'center', padding: 16 }}>
          <section role="dialog" aria-modal="true" aria-label={'Commander ' + selected.title}
            onMouseDown={event => event.stopPropagation()}
            style={{ width: 'min(100%, 430px)', maxHeight: '90vh', overflowY: 'auto', background: '#fffdf8', borderRadius: 18, padding: 20, color: '#342b25' }}>
            <button type="button" onClick={() => setSelected(null)} aria-label="Fermer"
              style={{ float: 'right', border: 0, background: 'transparent', fontSize: 24, cursor: 'pointer' }}>×</button>
            <img src={selected.imageUrl} alt="" style={{ width: '100%', maxHeight: 210, objectFit: 'cover', borderRadius: 12 }} />
            <h3 style={{ fontSize: '1.3rem', margin: '12px 0 4px' }}>{selected.title}</h3>
            {selected.description && <p>{selected.description}</p>}
            <p><strong>{formatPrice(selected)}</strong></p>
            <label style={{ display: 'block', marginTop: 10 }}>Quantité
              <input type="number" min={1} max={99} value={quantity}
                onChange={event => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))}
                style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #d8c8ad', borderRadius: 8 }} />
            </label>
            <label style={{ display: 'block', marginTop: 10 }}>Votre nom
              <input value={name} onChange={event => setName(event.target.value)} maxLength={120}
                style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #d8c8ad', borderRadius: 8 }} />
            </label>
            <label style={{ display: 'block', marginTop: 10 }}>Téléphone ou e-mail
              <input value={contact} onChange={event => setContact(event.target.value)} maxLength={150}
                style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #d8c8ad', borderRadius: 8 }} />
            </label>
            <label style={{ display: 'block', marginTop: 10 }}>Précisions (facultatif)
              <textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={1000} rows={2}
                style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #d8c8ad', borderRadius: 8 }} />
            </label>
            {error && <p role="alert" style={{ color: '#a32626' }}>{error}</p>}
            <button type="button" onClick={send}
              style={{ marginTop: 14, padding: 12, width: '100%', borderRadius: 10, border: 0, background: '#4a1d43', color: 'white', cursor: 'pointer' }}>
              {selected.mode === 'quote' ? 'Demander un devis sur WhatsApp' : 'Commander sur WhatsApp'}
            </button>
            {paymentUrl && (
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', marginTop: 12, padding: 12, textAlign: 'center', borderRadius: 10, background: '#f4e9cd', color: '#342b25' }}>
                Payer directement le professionnel (1 article)
              </a>
            )}
            <p style={{ fontSize: 12, marginTop: 12 }}>
              La demande WhatsApp n'est pas une commande payée. Tout règlement utilise exclusivement le compte marchand vérifié du professionnel.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}
