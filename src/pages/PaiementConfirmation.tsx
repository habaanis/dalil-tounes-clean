import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, QrCode, Smartphone, XCircle } from 'lucide-react';
import { checkPaymentStatus, pollPaymentStatus, PaymentStatus } from '../lib/konnect';
import { useLanguage } from '../context/LanguageContext';

type UiState = 'checking' | 'success' | 'pending' | 'failed';

type StripeVerification = {
  paid?: boolean;
  paymentStatus?: string;
  checkoutStatus?: string;
  orderRef?: string;
  offer?: string;
  email?: string;
};

const copy = {
  fr: {
    checking: 'Vérification du paiement…',
    checkingHint: 'Nous confirmons votre paiement sécurisé. Merci de patienter.',
    confirmed: 'Paiement confirmé',
    cvOrderRecorded: 'Votre commande de CV Business est bien enregistrée. Notre équipe prépare maintenant votre présentation professionnelle avec vos informations, vos services, vos photos et vos liens.',
    orderRef: 'Référence de commande',
    step1Title: 'Création',
    step1Text: 'Nous construisons votre CV Business à partir des éléments validés avec vous.',
    step2Title: 'Validation',
    step2Text: 'Vous recevez un aperçu avant publication afin de vérifier votre présentation.',
    step3Title: 'Livraison',
    step3Text: 'Après publication, nous vous envoyons votre lien personnel QR Business.',
    qrBusiness: 'Votre QR Business',
    qrBusinessHint: 'À télécharger et partager',
    pwaApp: 'Votre application PWA',
    pwaAppHint: 'À ajouter sur l\'écran d\'accueil',
    linkExplainer: 'Le même lien personnel vous permettra d\'ouvrir votre CV Business, télécharger votre QR, le partager et installer votre accès comme une application sur votre téléphone.',
    discoverCv: 'Découvrir le CV Business',
    paymentFor: 'Votre paiement {tier} a bien été confirmé.',
    backHome: 'Retour à l\'accueil',
    pendingTitle: 'Paiement en cours de traitement',
    pendingText: 'Votre paiement n\'a pas encore été confirmé. Cela peut prendre quelques minutes.',
    refresh: 'Actualiser',
    failedTitle: 'Paiement non confirmé',
    failedText: 'Nous n\'avons pas pu confirmer votre paiement. Si un montant a été débité, contactez notre équipe avant de recommencer.',
    backToOffers: 'Revenir aux offres',
  },
  en: {
    checking: 'Payment verification…',
    checkingHint: 'We are confirming your secure payment. Please wait.',
    confirmed: 'Payment confirmed',
    cvOrderRecorded: 'Your CV Business order has been recorded. Our team is now preparing your professional presentation with your information, services, photos and links.',
    orderRef: 'Order reference',
    step1Title: 'Creation',
    step1Text: 'We build your CV Business from the elements validated with you.',
    step2Title: 'Validation',
    step2Text: 'You receive a preview before publication to verify your presentation.',
    step3Title: 'Delivery',
    step3Text: 'After publication, we send you your personal QR Business link.',
    qrBusiness: 'Your QR Business',
    qrBusinessHint: 'To download and share',
    pwaApp: 'Your PWA app',
    pwaAppHint: 'Add to home screen',
    linkExplainer: 'The same personal link lets you open your CV Business, download your QR, share it and install your access as an app on your phone.',
    discoverCv: 'Discover CV Business',
    paymentFor: 'Your payment {tier} has been confirmed.',
    backHome: 'Back to home',
    pendingTitle: 'Payment processing',
    pendingText: 'Your payment has not been confirmed yet. This may take a few minutes.',
    refresh: 'Refresh',
    failedTitle: 'Payment not confirmed',
    failedText: 'We could not confirm your payment. If an amount was charged, contact our team before trying again.',
    backToOffers: 'Back to offers',
  },
  ar: {
    checking: 'جاري التحقق من الدفع…',
    checkingHint: 'نؤكد دفعك الآمن. يرجى الانتظار.',
    confirmed: 'تم تأكيد الدفع',
    cvOrderRecorded: 'تم تسجيل طلب السيرة الذاتية المهنية. فريقنا الآن يجهز عرضك المهني بمعلوماتك وخدماتك وصورك وروابطك.',
    orderRef: 'مرجع الطلب',
    step1Title: 'الإنشاء',
    step1Text: 'نبني سيرتك الذاتية المهنية من العناصر المعتمدة معك.',
    step2Title: 'التحقق',
    step2Text: 'تستلم معاينة قبل النشر للتحقق من عرضك.',
    step3Title: 'التسليم',
    step3Text: 'بعد النشر، نرسل لك رابطك الشخصي لرمز QR المهني.',
    qrBusiness: 'رمز QR المهني الخاص بك',
    qrBusinessHint: 'للتحميل والمشاركة',
    pwaApp: 'تطبيق PWA الخاص بك',
    pwaAppHint: 'أضفه إلى الشاشة الرئيسية',
    linkExplainer: 'نفس الرابط الشخصي يتيح لك فتح سيرتك الذاتية المهنية وتحميل رمز QR ومشاركته وتثبيت وصولك كتطبيق على هاتفك.',
    discoverCv: 'اكتشف السيرة الذاتية المهنية',
    paymentFor: 'تم تأكيد دفعك {tier}.',
    backHome: 'العودة إلى الرئيسية',
    pendingTitle: 'جاري معالجة الدفع',
    pendingText: 'لم يتم تأكيد دفعك بعد. قد يستغرق ذلك بضع دقائق.',
    refresh: 'تحديث',
    failedTitle: 'لم يتم تأكيد الدفع',
    failedText: 'تعذر علينا تأكيد دفعك. إذا تم خصم مبلغ، تواصل مع فريقنا قبل إعادة المحاولة.',
    backToOffers: 'العودة إلى العروض',
  },
  it: {
    checking: 'Verifica del pagamento…',
    checkingHint: 'Stiamo confermando il tuo pagamento sicuro. Attendi.',
    confirmed: 'Pagamento confermato',
    cvOrderRecorded: 'Il tuo ordine CV Business è stato registrato. Il nostro team sta ora preparando la tua presentazione professionale con le tue informazioni, servizi, foto e link.',
    orderRef: 'Riferimento ordine',
    step1Title: 'Creazione',
    step1Text: 'Costruiamo il tuo CV Business dagli elementi convalidati con te.',
    step2Title: 'Validazione',
    step2Text: 'Ricevi un\'anteprima prima della pubblicazione per verificare la tua presentazione.',
    step3Title: 'Consegna',
    step3Text: 'Dopo la pubblicazione, ti inviamo il tuo link personale QR Business.',
    qrBusiness: 'Il tuo QR Business',
    qrBusinessHint: 'Da scaricare e condividere',
    pwaApp: 'La tua app PWA',
    pwaAppHint: 'Aggiungi alla schermata principale',
    linkExplainer: 'Lo stesso link personale ti permette di aprire il tuo CV Business, scaricare il QR, condividerlo e installare l\'accesso come app sul telefono.',
    discoverCv: 'Scopri CV Business',
    paymentFor: 'Il tuo pagamento {tier} è stato confermato.',
    backHome: 'Torna alla home',
    pendingTitle: 'Pagamento in elaborazione',
    pendingText: 'Il tuo pagamento non è ancora stato confermato. Potrebbe volerci qualche minuto.',
    refresh: 'Aggiorna',
    failedTitle: 'Pagamento non confermato',
    failedText: 'Non siamo riusciti a confermare il tuo pagamento. Se è stato addebitato un importo, contatta il nostro team prima di riprovare.',
    backToOffers: 'Torna alle offerte',
  },
  ru: {
    checking: 'Проверка платежа…',
    checkingHint: 'Мы подтверждаем ваш безопасный платёж. Пожалуйста, подождите.',
    confirmed: 'Платёж подтверждён',
    cvOrderRecorded: 'Ваш заказ CV Business зарегистрирован. Наша команда готовит вашу профессиональную презентацию с вашей информацией, услугами, фото и ссылками.',
    orderRef: 'Номер заказа',
    step1Title: 'Создание',
    step1Text: 'Мы создаём ваш CV Business из элементов, согласованных с вами.',
    step2Title: 'Проверка',
    step2Text: 'Вы получаете предпросмотр перед публикацией для проверки презентации.',
    step3Title: 'Доставка',
    step3Text: 'После публикации мы отправляем вашу личную ссылку QR Business.',
    qrBusiness: 'Ваш QR Business',
    qrBusinessHint: 'Скачать и поделиться',
    pwaApp: 'Ваше PWA-приложение',
    pwaAppHint: 'Добавить на главный экран',
    linkExplainer: 'По той же личной ссылке вы можете открыть свой CV Business, скачать QR, поделиться им и установить доступ как приложение на телефоне.',
    discoverCv: 'Открыть CV Business',
    paymentFor: 'Ваш платёж {tier} подтверждён.',
    backHome: 'На главную',
    pendingTitle: 'Платёж обрабатывается',
    pendingText: 'Ваш платёж ещё не подтверждён. Это может занять несколько минут.',
    refresh: 'Обновить',
    failedTitle: 'Платёж не подтверждён',
    failedText: 'Не удалось подтвердить платёж. Если сумма была списана, свяжитесь с нашей командой перед повторной попыткой.',
    backToOffers: 'Вернуться к предложениям',
  },
};

type Lang = keyof typeof copy;

export default function PaiementConfirmation() {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-2xl rounded-3xl border border-[#D4AF37]/35 bg-white p-7 shadow-lg sm:p-9">
        {state === 'checking' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">{t.checking}</h1>
            <p className="text-sm text-gray-600">{t.checkingHint}</p>
          </div>
        )}

        {state === 'success' && isCvBusiness && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
            <h1 className="mt-4 text-3xl font-bold text-[#4A1D43]">{t.confirmed}</h1>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              {t.cvOrderRecorded}
            </p>

            {orderRef && (
              <p className="mt-4 text-xs text-gray-500">{t.orderRef} : <strong className="font-mono text-gray-700">{orderRef}</strong></p>
            )}

            <div className={`mt-7 grid gap-3 ${isRTL ? 'text-right' : 'text-left'} sm:grid-cols-3`}>
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">1</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">{t.step1Title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{t.step1Text}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">2</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">{t.step2Title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{t.step2Text}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#FFFDF7] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3CC] text-[#4A1D43]">3</span>
                <h2 className="mt-3 font-bold text-[#4A1D43]">{t.step3Title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{t.step3Text}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4AF37]/35 bg-[#032D21] p-5 text-white">
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                <div className={`flex items-center gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <QrCode className="h-8 w-8 text-[#D5B257]" aria-hidden="true" />
                  <div><strong className="block">{t.qrBusiness}</strong><span className="text-sm text-white/70">{t.qrBusinessHint}</span></div>
                </div>
                <div className="hidden h-10 w-px bg-white/15 sm:block" />
                <div className={`flex items-center gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Smartphone className="h-8 w-8 text-[#D5B257]" aria-hidden="true" />
                  <div><strong className="block">{t.pwaApp}</strong><span className="text-sm text-white/70">{t.pwaAppHint}</span></div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/75">
                {t.linkExplainer}
              </p>
            </div>

            <Link to="/businesses" className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">
              {t.discoverCv}
            </Link>
          </div>
        )}

        {state === 'success' && !isCvBusiness && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">{t.confirmed}</h1>
            <p className="text-sm text-gray-600">{tier ? t.paymentFor.replace('{tier}', <strong>{tier}</strong> as unknown as string) : t.paymentFor.replace('{tier}', '')}</p>
            <Link to="/" className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">{t.backHome}</Link>
          </div>
        )}

        {state === 'pending' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <h1 className="text-xl font-semibold text-gray-900">{t.pendingTitle}</h1>
            <p className="text-sm text-gray-600">{t.pendingText}{paymentRef && <> {t.orderRef} : <code className="font-mono">{paymentRef}</code>.</>}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-2 inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50">{t.refresh}</button>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-gray-900">{t.failedTitle}</h1>
            <p className="text-sm text-gray-600">{t.failedText}</p>
            <Link to="/subscription" className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-[#1a0a18] hover:bg-[#c9a030]">{t.backToOffers}</Link>
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
