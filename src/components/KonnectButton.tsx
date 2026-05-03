import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';

interface KonnectButtonProps {
  amount: number;
  entrepriseId?: string;
  plan?: string;
  label?: string;
  disabled?: boolean;
  onInitiate?: (params: { amount: number; entrepriseId?: string; plan?: string }) => Promise<string | null>;
}

export function KonnectButton({
  amount,
  entrepriseId,
  plan,
  label = 'Payer avec Konnect',
  disabled = false,
  onInitiate,
}: KonnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading || disabled) return;
    setError(null);
    setLoading(true);

    try {
      if (!onInitiate) {
        setError('Konnect sera disponible prochainement.');
        return;
      }
      const redirectUrl = await onInitiate({ amount, entrepriseId, plan });
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      setError("Impossible d'initialiser le paiement.");
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] transition hover:bg-[#c9a030] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Initialisation...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
