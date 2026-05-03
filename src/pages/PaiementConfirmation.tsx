import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { checkPaymentStatus, pollPaymentStatus, PaymentStatus } from '../lib/konnect';

type UiState = 'checking' | 'success' | 'pending' | 'failed';

export default function PaiementConfirmation() {
  const [params] = useSearchParams();
  const entrepriseId = params.get('entreprise_id') || params.get('entrepriseId') || '';
  const paymentRef = params.get('payment_ref') || params.get('paymentRef') || '';

  const [state, setState] = useState<UiState>('checking');
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
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
  }, [entrepriseId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {state === 'checking' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">Verification du paiement...</h1>
            <p className="text-sm text-gray-600">
              Nous confirmons votre paiement aupres de Konnect. Merci de patienter.
            </p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">Paiement confirme</h1>
            <p className="text-sm text-gray-600">
              Votre abonnement {tier ? <strong>{tier}</strong> : null} est actif.
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]"
            >
              Retour a l'accueil
            </Link>
          </div>
        )}

        {state === 'pending' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">Paiement en cours de traitement</h1>
            <p className="text-sm text-gray-600">
              Votre paiement n'a pas encore ete confirme. Cela peut prendre quelques minutes.
              {paymentRef && <> Reference : <code className="font-mono">{paymentRef}</code>.</>}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50"
            >
              Actualiser
            </button>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">Paiement non confirme</h1>
            <p className="text-sm text-gray-600">
              Nous n'avons pas pu confirmer votre paiement. Si un montant a ete debite, contactez notre support.
            </p>
            <Link
              to="/subscription"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]"
            >
              Revenir aux abonnements
            </Link>
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
