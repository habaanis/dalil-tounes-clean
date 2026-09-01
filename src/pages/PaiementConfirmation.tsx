import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, QrCode, Smartphone, XCircle } from 'lucide-react';
import { checkPaymentStatus, pollPaymentStatus, PaymentStatus } from '../lib/konnect';

type UiState = 'checking' | 'success' | 'pending' | 'failed';

type StripeVerification = {
  paid?: boolean;
  paymentStatus?: string;
  checkoutStatus?: string;
  orderRef?: string;
  offer?: string;
  email?: string;
};

export default function PaiementConfirmation() {
  const [params] = useSearchParams();
  const provider = params.get('provider') || 'konnect';
  const sessionId = params.get('session_id') || '';
  const entrepriseId = params.get('entreprise_id') || params.get('entrepriseId') || '';
  const paymentRef = params.get('payment_ref') || params.get('paymentRef') || '';
  const queryOrderRef = params.get('order_ref') || '';

  const [state, setState] = useState<UiState>('checking');
  const [tier, setTier] = useState<string | null>(null);
  const [offer, setOffer] = useState('');
  const [orderRef, setOrderRef] = useState(queryOrderRef);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (provider === 'stripe') {
        if (!sessionId) {
          if (!cancelled) setState('failed');
          return;
        }

        try {
          const response = await fetch(`/api/verify-stripe-checkout?session_id=${encodeURIComponent(sessionId)}`);
          const body = await response.json() as StripeVerification;
          if (cancelled) return;
          if (!response.ok) {
            setState('failed');
            return;
          }
          setOffer(body.offer || '');
          setOrderRef(body.orderRef || queryOrderRef);
          setState(body.paid ? 'success' : body.checkoutStatus === 'open' ? 'pending' : 'failed');
        } catch {
          if (!cancelled) setState('failed');
        }
        return;
      }

      if (!entrepriseId) {
        if (!cancelled) setState('failed');
        return;
      }

      const first = await checkPaymentStatus(entrepriseId);
      if (cancelled) return;

      if (first.status === 'success') {
        setTier(first.tier);
        setState('success');
        return;
      }

      const polled = await pollPaymentStatus(entrepriseId, { intervalMs: 3000, timeoutMs: 60000 });
      if (cancelled) return;

      setTier(polled.tier);
      setState(mapStatus(polled.status));
    })();

    return () => {
      cancelled = true;
    };
  }, [provider, sessionId, entrepriseId, queryOrderRef]);

  const isCvBusiness = offer === 'cv_essential' || offer === 'cv_complete';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-[#D4AF37]/35 bg-white p-7 shadow-lg sm:p-9">
        {state === 'checking' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">Vérification du paiement…</h1>
            <p className="text-sm text-gray-600">Nous confirmons votre paiement sécurisé. Merci de patienter.</p>
          </div>
        )}

        {state === 'success' && isCvBusiness && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
            <h1 className="mt-4 text-3xl font-bold text-[#4A1D43]">Paiement confirmé</h1>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Votre commande de CV Business est bien enregistrée. Notre équipe prépare maintenant votre présentation professionnelle avec vos informations, vos services, vos photos et vos liens.
            </p>

            {orderRef && (
              <p className="mt-4 text-xs text-gray-500">Référence de commande : <strong className="font-mono text-gray-700">{orderRef}</strong></p>
            )}

            <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">1</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">Création</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Nous construisons votre CV Business à partir des éléments validés avec vous.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">2</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">Validation</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Vous recevez un aperçu avant publication afin de vérifier votre présentation.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">3</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">Livraison</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Après publication, nous vous envoyons votre lien personnel QR Business.</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4AF37]/35 bg-[#032D21] p-5 text-white">
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                <div className="flex items-center gap-3 text-left">
                  <QrCode className="h-8 w-8 text-[#D5B257]" aria-hidden="true" />
                  <div><strong className="block">Votre QR Business</strong><span className="text-sm text-white/70">À télécharger et partager</span></div>
                </div>
                <div className="hidden h-10 w-px bg-white/15 sm:block" />
                <div className="flex items-center gap-3 text-left">
                  <Smartphone className="h-8 w-8 text-[#D5B257]" aria-hidden="true" />
                  <div><strong className="block">Votre application PWA</strong><span className="text-sm text-white/70">À ajouter sur l’écran d’accueil</span></div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Le même lien personnel vous permettra d’ouvrir votre CV Business, télécharger votre QR, le partager et installer votre accès comme une application sur votre téléphone.
              </p>
            </div>

            <Link to="/businesses" className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">
              Découvrir le CV Business
            </Link>
          </div>
        )}

        {state === 'success' && !isCvBusiness && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">Paiement confirmé</h1>
            <p className="text-sm text-gray-600">Votre paiement {tier ? <>pour <strong>{tier}</strong></> : null} a bien été confirmé.</p>
            <Link to="/" className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">Retour à l’accueil</Link>
          </div>
        )}

        {state === 'pending' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">Paiement en cours de traitement</h1>
            <p className="text-sm text-gray-600">Votre paiement n’a pas encore été confirmé. Cela peut prendre quelques minutes.{paymentRef && <> Référence : <code className="font-mono">{paymentRef}</code>.</>}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-2 inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50">Actualiser</button>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">Paiement non confirmé</h1>
            <p className="text-sm text-gray-600">Nous n’avons pas pu confirmer votre paiement. Si un montant a été débité, contactez notre équipe avant de recommencer.</p>
            <Link to="/subscription" className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">Revenir aux offres</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function mapStatus(s: PaymentStatus): UiState {
  if (s === 'success') return 'success';
  if (s === 'failed' || s === 'not_found') return 'failed';
  return 'pending';
}
