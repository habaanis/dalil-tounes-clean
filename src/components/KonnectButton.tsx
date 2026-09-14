import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  label,
  disabled = false,
  onInitiate,
}: KonnectButtonProps) {
  const { language } = useLanguage();
  const defaultLabel = language === 'fr' ? 'Payer avec Konnect' : language === 'ar' ? 'ادفع مع Konnect' : language === 'en' ? 'Pay with Konnect' : language === 'it' ? 'Paga con Konnect' : 'Оплатить через Konnect';
  const btnLabel = label || defaultLabel;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading || disabled) return;
    setError(null);
    setLoading(true);

    try {
      if (!onInitiate) {
  setError(language === 'fr' ? 'Konnect sera disponible prochainement.' : language === 'ar' ? 'Konnect سيكون متاحاً قريباً.' : language === 'en' ? 'Konnect will be available soon.' : language === 'it' ? 'Konnect sarà disponibile a breve.' : 'Konnect скоро будет доступен.');
        return;
      }
      const redirectUrl = await onInitiate({ amount, entrepriseId, plan });
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
setError(language === 'fr' ? "Impossible d'initialiser le paiement." : language === 'ar' ? 'تعذير تهيئة الدفع.' : language === 'en' ? 'Unable to initialize payment.' : language === 'it' ? 'Impossibile inizializzare il pagamento.' : 'Не удалось инициализировать оплату.');
    } catch {
setError(language === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : language === 'en' ? 'An error occurred. Please try again.' : language === 'it' ? 'Si è verificato un errore. Riprova.' : 'Произошла ошибка. Попробуйте ещё раз.');
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
            <span>{language === 'fr' ? 'Initialisation...' : language === 'ar' ? 'جارٍ التهيئة...' : language === 'en' ? 'Initializing...' : language === 'it' ? 'Inizializzazione...' : 'Инициализация...'}</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            <span>{btnLabel}</span>
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
