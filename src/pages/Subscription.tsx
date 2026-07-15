import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';
import { Check, Star, CreditCard, Smartphone, X, Landmark, Copy, MessageCircle, Send, Mail } from 'lucide-react';

const STRIPE_LINKS: Record<string, { monthly: string; annual: string }> = {
  artisan: {
    monthly: 'https://buy.stripe.com/28E5kFaTVgIX7WO7Phbsc08',
    annual:  'https://buy.stripe.com/7sY8wRfab3Wb6SKfhJbsc09',
  },
  premium: {
    monthly: 'https://buy.stripe.com/eVqdRb2npfET3Gy3z1bsc0a',
    annual:  'https://buy.stripe.com/8x29AV9PRakz0um3z1bsc0b',
  },
  elitePro: {
    monthly: '',
    annual: '',
  },
};

type ModalType = 'paypal' | 'flouci' | 'manual' | null;

const SUBSCRIPTION_WELCOME_SEEN_KEY = 'dalilTounes_subscription_welcome_seen_v1';
const CONTACT_EMAIL = 'contact@dalil-tounes.com';

const subscriptionIntroText = {
  title: 'Une solution adaptée à ton entreprise',
  paragraphs: [
    'Chaque entreprise est différente.',
    "Que tu sois artisan, commerçant, profession libérale, PME ou grande entreprise, tes besoins et ton budget ne sont pas les mêmes.",
    "Chez Dalil Tounes, notre objectif est de te proposer une solution adaptée à ton activité, avec des offres accessibles, évolutives et pensées pour t'accompagner dans ton développement.",
    "Tu peux choisir de découvrir nos solutions ou nous contacter directement afin que nous échangions ensemble sur la solution la plus adaptée à ton entreprise.",
  ],
  primaryAction: 'Découvrir les solutions',
  secondaryAction: 'Nous contacter',
  hideLabel: 'Ne plus afficher cette fenêtre.',
};

const subscriptionContactText = {
  title: 'Échanger avec Dalil Tounes',
  subtitle: "Choisis le moyen le plus simple pour discuter de la solution adaptée à ton entreprise.",
  emailLabel: 'Contact par e-mail',
  whatsAppLabel: 'Contact WhatsApp',
};

const subscriptionPageMessaging = {
  heroTitle: 'Choisissez la solution adaptée à votre activité',
  heroDescription:
    "Dalil Tounes accompagne les professionnels dans le développement de leur présence sur Internet. L'objectif n'est pas de vendre un simple abonnement, mais de proposer une solution claire, utile et adaptée à chaque activité.",
  cards: [
    {
      icon: '🤝',
      title: 'Accompagnement humain',
      description: "Tu peux avancer à ton rythme, avec une solution adaptée à ton activité et à tes priorités.",
    },
    {
      icon: '🌱',
      title: 'Offres évolutives',
      description: "Commence simplement, puis fais évoluer ta visibilité lorsque ton entreprise en a besoin.",
    },
    {
      icon: '⭐',
      title: 'Présence rassurante',
      description: 'Présente tes informations essentielles pour aider les citoyens à te comprendre et à te contacter.',
    },
  ],
};

const planPresentation: Record<string, {
  name?: string;
  intro?: string;
  features?: string[];
  launchBonus?: string[];
}> = {
  decouverte: {
    intro: 'Pour découvrir Dalil Tounes et poser les premières bases de votre visibilité.',
    features: [
      'Consultation du répertoire Dalil Tounes',
      'Recherche de base',
      "Profil d'entreprise simple",
      'Support par email',
    ],
  },
  artisan: {
    intro: 'Pour lancer votre présence sur Internet.',
    features: [
      'Fiche professionnelle pour présenter votre activité',
      'Galerie de vos réalisations (3 photos)',
      'Badge "Dalil Tounes Vérifié"',
      'Liens vers vos réseaux sociaux',
      'QR Code personnalisé vers votre fiche',
      'Assistance prioritaire par email',
    ],
  },
  premium: {
    intro: 'Pour développer votre visibilité et attirer de nouveaux clients.',
    features: [
      'Toutes les fonctionnalités Artisan',
      'Mettez en valeur votre savoir-faire (5 photos)',
      'Entreprise certifiée par Dalil Tounes',
      'Mise en avant régionale',
      'Publicité ciblée',
      'Gestion multi-emplacements',
      'Rapport analytique détaillé',
      'Gestionnaire de compte',
      'Réservation en ligne',
    ],
    launchBonus: ['Création et impression de 500 flyers professionnels avec l’abonnement annuel.'],
  },
  elitePro: {
    name: 'Entreprise',
    intro: 'Une solution personnalisée pour les entreprises ayant des besoins spécifiques.',
    features: [
      'CV Business personnalisé',
      'Présentation complète de votre entreprise',
      'Galerie de réalisations',
      'Coordonnées centralisées',
      'Réseaux sociaux',
      'Réservation si activée',
      'Référencement sur Dalil Tounes',
      'Solution évolutive',
      'Étude personnalisée',
    ],
    launchBonus: ['Création et impression de flyers professionnels selon la formule retenue.'],
  },
  custom: {
    intro: 'Pour construire une solution adaptée à une organisation, un réseau ou un besoin particulier.',
    features: [
      'Solution personnalisée selon vos besoins',
      'Budget flexible et adapté à votre entreprise',
      'Accompagnement personnalisé',
      'Fonctionnalités à la carte',
    ],
  },
};

// Coordonnées bancaires affichées dans le modal "Paiement Manuel".
// Modifiable ici sans toucher au rendu.
const BANK_DETAILS = {
  beneficiaire: 'Mr HABA ANIS TAIEB',
  banque: 'BIAT - Agence Mahdia I (21)',
  rib: '08 501 000215099368049',
  iban: 'TN59 0850 1000 2150 9936 8049',
  swift: 'BIATTNTT',
};
const D17_PHONE = '+216 27 642 252';
const WHATSAPP_CONTACT = '21627642252'; // numéro principal clients (sans +)

export const Subscription = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hideWelcomeModal, setHideWelcomeModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  // Plan ciblé lors de l'ouverture du modal "Paiement Manuel" (pour personnaliser le message WhatsApp).
  const [manualPlanLabel, setManualPlanLabel] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    title: '',
    phone: '',
    email: '',
    message: '',
  });


  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // no-op
    }
  };

  const openWhatsAppReceipt = () => {
    const planPart = manualPlanLabel ? ` (${manualPlanLabel})` : '';
    const message =
      `Bonjour Dalil Tounes, j'ai effectué le paiement pour l'abonnement${planPart} de [Nom de l'entreprise]. Voici le reçu.`;
    const url = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openWhatsAppContact = () => {
    const message = "Bonjour Dalil Tounes, je souhaite échanger sur la solution la plus adaptée à mon entreprise.";
    const url = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const closeWelcomeModal = () => {
    localStorage.setItem(SUBSCRIPTION_WELCOME_SEEN_KEY, 'true');
    setShowWelcomeModal(false);
  };

  const openHumanContactModal = () => {
    localStorage.setItem(SUBSCRIPTION_WELCOME_SEEN_KEY, 'true');
    setShowWelcomeModal(false);
    setShowContactModal(true);
  };

  const openRequestForm = (planLabel: string) => {
    setSelectedPlan(planLabel);
    setRequestForm({
      title: planLabel ? `Demande abonnement ${planLabel}` : '',
      phone: '',
      email: '',
      message: '',
    });
    setRequestSuccess(false);
    setRequestError(null);
    setShowRequestForm(true);
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setRequestSuccess(false);
    setRequestError(null);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess(false);
    setRequestError(null);

    try {
      const title = requestForm.title.trim();
      const phone = requestForm.phone.trim();
      const email = requestForm.email.trim();
      const message = requestForm.message.trim();

      if (!title) {
        setRequestError('Le titre de votre demande est obligatoire.');
        setRequestSubmitting(false);
        return;
      }

      if (!phone && !email) {
        setRequestError('Merci d’indiquer au moins un téléphone ou un email.');
        setRequestSubmitting(false);
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setRequestError('Format email invalide.');
          setRequestSubmitting(false);
          return;
        }
      }

      if (!message) {
        setRequestError('Merci de décrire brièvement votre demande.');
        setRequestSubmitting(false);
        return;
      }

      const payload = {
        nom_entreprise: title,
        secteur: selectedPlan ? `Abonnement ${selectedPlan}` : 'Demande abonnement / inscription',
        ville: null,
        contact_suggere: `${phone || ''}${phone && email ? ' - ' : ''}${email || ''}`.trim(),
        raison_suggestion: `Demande depuis la page abonnement${selectedPlan ? ` - ${selectedPlan}` : ''}\n\n${message}`,
        submission_lang: language,
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.error('Erreur Supabase abonnement:', error);
        setRequestError('Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      notifyAdmin('Nouvelle demande abonnement', {
        Plan: selectedPlan || 'Non renseigné',
        Titre: title,
        Telephone: phone || 'Non renseigné',
        Email: email || 'Non renseigné',
        Message: message,
        Langue: language,
      });

      setRequestSuccess(true);
      setRequestForm({
        title: '',
        phone: '',
        email: '',
        message: '',
      });

      setTimeout(() => {
        closeRequestForm();
      }, 1800);
    } catch (error) {
      console.error('Erreur demande abonnement:', error);
      setRequestError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('#form-inscription-entreprise')) {
      setTimeout(() => {
        const element = document.getElementById('form-inscription-entreprise');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIPTION_WELCOME_SEEN_KEY) !== 'true') {
      setShowWelcomeModal(true);
    }
  }, []);

  const plansConfig = [
    {
      key: 'decouverte',
      bgColor: 'bg-[#F8FAFC]',
      headerColor: 'bg-gray-100',
      textColor: 'text-gray-900',
      bottomTriangleColor: '#6B7280',
      tier: 'decouverte' as const,
    },
    {
      key: 'artisan',
      bgColor: 'bg-[#4A1D43]',
      headerColor: 'bg-[#4A1D43]',
      textColor: 'text-white',
      popular: true,
      bottomTriangleColor: '#5A2D53',
      tier: 'artisan' as const,
    },
    {
      key: 'premium',
      bgColor: 'bg-[#064E3B]',
      headerColor: 'bg-[#064E3B]',
      textColor: 'text-white',
      bottomTriangleColor: '#065F46',
      tier: 'premium' as const,
    },
    {
      key: 'elitePro',
      bgColor: 'bg-[#121212]',
      headerColor: 'bg-[#121212]',
      textColor: 'text-[#D4AF37]',
      bottomTriangleColor: '#1E1E1E',
      isElite: true,
      tier: 'elite' as const,
    },
    {
      key: 'custom',
      bgColor: 'bg-gray-50',
      headerColor: 'bg-gray-200',
      textColor: 'text-gray-900',
      bottomTriangleColor: '#9CA3AF',
      isCustom: true,
      tier: 'custom' as const,
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-3 text-gray-900">
            Nos solutions pour développer votre présence en ligne
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Choisissez la solution adaptée à votre activité, votre budget et votre rythme de développement.
          </p>
        </div>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-10 md:p-14 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                {subscriptionPageMessaging.heroTitle}
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-800 text-base md:text-lg leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {subscriptionPageMessaging.heroDescription}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionPageMessaging.cards.map((card) => (
              <div key={card.title} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {card.description}
                </p>
              </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mx-auto max-w-3xl rounded-3xl border border-[#D4AF37]/35 bg-white px-6 py-7 text-center shadow-[0_6px_24px_rgba(74,29,67,0.08)]">
            <p className="text-base md:text-lg leading-relaxed text-[#4A1D43]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Chez Dalil Tounes, nous croyons que chaque professionnel mérite sa place sur Internet.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Parce qu'une petite entreprise d'aujourd'hui peut devenir la grande entreprise de demain.
            </p>
          </div>
        </section>

        <div
          id="form-inscription-entreprise"
          className="scroll-mt-32 bg-gradient-to-br from-[#4A1D43] to-[#5A2D53] rounded-[20px] border-2 border-[#D4AF37] overflow-hidden mb-12 shadow-[0_8px_32px_rgba(212,175,55,0.15),0_0_40px_rgba(212,175,55,0.08)]"
        >
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-xs font-bold mb-4 shadow-lg">
              <span>🎉</span>
              <span>Offre de lancement exceptionnelle</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              🎉 Offre de lancement exceptionnelle
            </h2>

            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-[#D4AF37]/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-lg font-bold text-white">
                    3 mois gratuits pour découvrir et tester Dalil Tounes
                  </p>
                </div>
              </div>

              <div className="bg-[#D4AF37] rounded-xl p-5 text-[#4A1D43] shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-lg font-bold">
                    + 6 mois offerts avec tout abonnement annuel
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-6">
              <p className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-2">
                🎁 Jusqu'à 9 mois offerts au total !
              </p>
              <p className="text-sm text-gray-300">
                Une occasion idéale pour développer sereinement votre visibilité en ligne.
              </p>
            </div>
            <button
              onClick={() => openRequestForm('Artisan')}
              className="px-8 py-3 bg-[#D4AF37] text-[#4A1D43] rounded-lg text-sm font-bold hover:bg-[#C4A027] transition-colors shadow-lg hover:shadow-xl"
            >
              Demande d’information / inscription
            </button>
          </div>
        </div>

        {/* Toggle Mensuel / Annuel */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.subscription.billing.monthly}
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.subscription.billing.annual}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-12 max-w-6xl mx-auto items-start">
          {plansConfig.map((planConfig) => {
            const plan = t.subscription.plans[planConfig.key];
            const presentation = planPresentation[planConfig.key] || {};
            const isArtisan = planConfig.key === 'artisan';
            const isPremium = planConfig.key === 'premium';
            const isElitePro = planConfig.isElite || false;
            const isCustom = planConfig.isCustom || false;
            const isDecouverte = planConfig.key === 'decouverte';
            const displayPlanName = presentation.name || plan.name;
            const displayFeatures = presentation.features || plan.features;
            const launchBonus = presentation.launchBonus || [];
            const displayPrice = isElitePro
              ? 'Solution sur mesure'
              : isPremium
              ? (billingPeriod === 'annual' ? '49 TND / mois en annuel' : '59 TND / mois')
              : billingPeriod === 'annual' && isArtisan
              ? (plan.annualPrice || plan.price)
              : plan.price;

            const hasPaidPayment = isArtisan || isPremium;
            const stripeLink = hasPaidPayment
              ? STRIPE_LINKS[planConfig.key]?.[billingPeriod] ?? '#'
              : '#';

            const borderStyle = isCustom
              ? '2px dashed #9CA3AF'
              : isDecouverte
              ? '1px solid #D4AF37'
              : '2px solid #D4AF37';

            const shadowStyle = (isArtisan || isPremium || isElitePro)
              ? '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.08)'
              : '0 2px 10px rgba(0,0,0,0.05)';

            return (
              <div
                key={planConfig.key}
                className={`relative rounded-[20px] transition-all ${planConfig.bgColor} flex flex-col h-full overflow-hidden group hover:-translate-y-1`}
                style={{
                  border: borderStyle,
                  boxShadow: shadowStyle
                }}
              >
                {planConfig.popular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 z-20 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{plan.popular}</span>
                  </div>
                )}

                {/* Glass shine effect for premium tiers */}
                {(isArtisan || isPremium || isElitePro) && (
                  <>
                    <div
                      className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                        animation: 'shine 1.5s ease-in-out',
                        transform: 'translateX(-100%)',
                      }}
                    />
                    <style>{`
                      @keyframes shine {
                        0% { transform: translateX(-100%) skewX(-15deg); }
                        100% { transform: translateX(200%) skewX(-15deg); }
                      }
                      .group:hover > div:nth-child(${planConfig.popular ? '3' : '2'}) {
                        animation: shine 1.5s ease-in-out;
                      }
                    `}</style>
                  </>
                )}

                {/* Triangle doré en position absolue au sommet de la carte */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-10"
                  style={{
                    top: '0',
                    width: 0,
                    height: 0,
                    borderLeft: '20px solid transparent',
                    borderRight: '20px solid transparent',
                    borderTop: '16px solid #D4AF37',
                  }}
                />

                {/* En-tête */}
                <div className={`${planConfig.headerColor} py-2.5 px-4`}>
                  <h3 className={`text-sm font-bold text-center tracking-wide uppercase ${
                    isElitePro ? 'text-[#D4AF37]' :
                    isArtisan || isPremium ? 'text-white' :
                    'text-gray-900'
                  }`}>
                    {displayPlanName}
                  </h3>
                </div>

                {/* Première ligne de séparation dorée fine sous le nom */}
                <div
                  className="w-full"
                  style={{ height: '1px', backgroundColor: '#D4AF37' }}
                />

                <div className={`px-5 pt-4 pb-4 flex flex-col flex-grow ${isElitePro ? 'text-[#D4AF37]' : isArtisan || isPremium ? 'text-white' : 'text-gray-900'}`}>
                  <div>
                    <div className="text-center mb-2">
                      {billingPeriod === 'annual' && (isArtisan || isPremium) && plan.annualSavings && (
                        <div className="mb-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {plan.annualSavings}
                        </div>
                      )}
                    {isCustom ? (
                      <>
                        <div className="text-2xl font-bold mb-1 text-gray-900">
                          {plan.subtitle}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 px-2">
                          {plan.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className={`text-3xl font-bold mb-1 ${
                          isElitePro ? 'text-[#D4AF37]' :
                          isArtisan || isPremium ? 'text-white' :
                          'text-gray-900'
                        }`}>
                          {displayPrice}
                        </div>
                        {displayPrice !== 'Gratuit' && displayPrice !== 'Free' && displayPrice !== 'مجاني' && displayPrice !== 'Gratuito' && displayPrice !== 'Бесплатно' && !isElitePro && (
                          <p className={`text-xs ${
                            isElitePro ? 'text-gray-400' :
                            isArtisan || isPremium ? 'text-gray-200' :
                            'text-gray-600'
                          }`}>
                            {t.subscription.perMonth}
                          </p>
                        )}
                        {isElitePro && (
                          <p className="text-xs text-gray-300 mt-2 px-2 leading-relaxed">
                            Étude personnalisée selon les besoins de ton entreprise.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                    {/* Deuxième ligne de séparation dorée épaisse sous le prix avec triangle */}
                    <div className="relative mb-3 -mx-6">
                      <div style={{ height: '3px', backgroundColor: '#D4AF37' }} />
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: '0',
                          width: 0,
                          height: 0,
                          borderLeft: '20px solid transparent',
                          borderRight: '20px solid transparent',
                          borderTop: `20px solid ${planConfig.bottomTriangleColor}`,
                        }}
                      />
                    </div>

                    {presentation.intro && (
                      <p className={`mb-3 rounded-xl px-3 py-2 text-center text-xs font-medium leading-relaxed ${
                        isElitePro
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : isArtisan || isPremium
                          ? 'bg-white/10 text-white'
                          : 'bg-[#D4AF37]/10 text-gray-700'
                      }`}>
                        {presentation.intro}
                      </p>
                    )}

                    <ul className="space-y-2">
                    {/* Bonus annuel pour Premium */}
                    {billingPeriod === 'annual' && isPremium && !isElitePro && plan.annualBonus && (
                      <>
                        <li className="flex items-start gap-2 pb-2 border-b border-gray-200">
                          <div
                            className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#D4AF37' }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-xs font-bold leading-relaxed text-orange-600">
                            {plan.annualBonus}
                          </span>
                        </li>
                      </>
                    )}
                    {displayFeatures.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div
                          className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#D4AF37' }}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className={`text-xs leading-relaxed ${
                          isElitePro ? 'text-gray-300' :
                          isArtisan || isPremium ? 'text-gray-200' :
                          'text-gray-700'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                    </ul>

                    {launchBonus.length > 0 && (
                      <div className={`mt-4 rounded-xl border p-3 ${
                        isElitePro
                          ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                          : isPremium
                          ? 'border-[#D4AF37]/45 bg-white/10'
                          : 'border-[#D4AF37]/35 bg-[#FFF8E7]'
                      }`}>
                        <p className={`mb-2 text-xs font-bold ${
                          isElitePro || isPremium ? 'text-[#D4AF37]' : 'text-[#4A1D43]'
                        }`}>
                          🎁 Bonus de lancement
                        </p>
                        {launchBonus.map((bonus) => (
                          <p key={bonus} className={`text-xs leading-relaxed ${
                            isElitePro ? 'text-gray-300' : isPremium ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            {bonus}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA principal */}
                  <button
                    onClick={() => {
                      if (isElitePro) {
                        setShowContactModal(true);
                        return;
                      }
                      const planNameMap: Record<string, string> = {
                        'decouverte': 'Découverte',
                        'artisan': 'Artisan',
                        'premium': 'Premium',
                        'elitePro': 'Entreprise',
                        'custom': 'Sur mesure'
                      };
                      openRequestForm(planNameMap[planConfig.key] || 'Premium');
                    }}
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-all mt-auto ${
                      isCustom
                        ? 'bg-gray-700 text-white hover:bg-gray-800 shadow-md hover:shadow-lg border-2 border-dashed border-gray-400'
                        : isElitePro
                        ? 'bg-[#D4AF37] text-[#121212] hover:bg-[#C4A027] shadow-md hover:shadow-lg'
                        : isArtisan
                        ? 'bg-[#D4AF37] text-[#4A1D43] hover:bg-[#C4A027] shadow-md hover:shadow-lg'
                        : isPremium
                        ? 'bg-[#D4AF37] text-[#064E3B] hover:bg-[#C4A027] shadow-md hover:shadow-lg'
                        : 'border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-gray-900 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isElitePro ? 'Nous contacter' : isCustom ? t.subscription.requestQuote : `${t.subscription.chooseButton} ${displayPlanName}`}
                  </button>

                  {/* Payment buttons — plans payants uniquement */}
                  {hasPaidPayment && (
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center gap-2 my-1">
                        <div className="flex-1 h-px bg-white/15" />
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">paiement</span>
                        <div className="flex-1 h-px bg-white/15" />
                      </div>

                      {/* Stripe */}
                      <a
                        href={stripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95 transition-all shadow-sm hover:shadow-md"
                      >
                        <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                        Payer par Carte (Stripe)
                      </a>

                      {/* PayPal — bientôt disponible */}
                      <button
                        type="button"
                        onClick={() => setActiveModal('paypal')}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#FFC439] text-[#003087] opacity-60 hover:opacity-75 transition-all cursor-not-allowed shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                        </svg>
                        PayPal (Bientôt disponible)
                      </button>

                      {/* Flouci */}
                      <button
                        type="button"
                        onClick={() => setActiveModal('flouci')}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#059669] text-white hover:bg-[#047857] active:scale-95 transition-all shadow-sm hover:shadow-md"
                      >
                        <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                        Payer en Dinars (Flouci)
                      </button>

                      {/* Paiement Manuel Sécurisé — Virement bancaire ou D17 */}
                      <button
                        type="button"
                        onClick={() => {
                          setManualPlanLabel(displayPlanName);
                          setActiveModal('manual');
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-white text-[#4A1D43] border-2 border-[#D4AF37] hover:bg-[#FFF8E7] active:scale-95 transition-all shadow-sm hover:shadow-md"
                      >
                        <Landmark className="w-3.5 h-3.5 flex-shrink-0" />
                        Payer par Virement Bancaire ou Versement (D17)
                      </button>

                      <p className="text-center text-[10px] text-white/40 pt-0.5 leading-tight">
                        Paiements sécurisés. Facture disponible après validation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showWelcomeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeWelcomeModal}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-[390px] w-full p-5 sm:p-6 border border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-welcome-title"
          >
            <button
              type="button"
              onClick={closeWelcomeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-[52px] h-[52px] bg-[#4A1D43] rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 id="subscription-welcome-title" className="text-xl sm:text-[22px] font-bold text-gray-900 mb-2 leading-tight">
                {subscriptionIntroText.title}
              </h2>
            </div>

            <div className="space-y-2.5 text-[15.5px] sm:text-base text-gray-600 leading-relaxed">
              {subscriptionIntroText.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <label className="mt-4 flex items-center gap-3 text-[15px] text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hideWelcomeModal}
                onChange={(e) => setHideWelcomeModal(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#4A1D43] focus:ring-[#4A1D43]"
              />
              <span>{subscriptionIntroText.hideLabel}</span>
            </label>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeWelcomeModal}
                className="flex-1 px-5 py-3 bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#5A2D53] transition-all text-sm font-semibold"
              >
                {subscriptionIntroText.primaryAction}
              </button>
              <button
                type="button"
                onClick={openHumanContactModal}
                className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                {subscriptionIntroText.secondaryAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 border border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-contact-title"
          >
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#4A1D43] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h2 id="subscription-contact-title" className="text-xl font-bold text-gray-900 mb-2">
                {subscriptionContactText.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {subscriptionContactText.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demande abonnement - Dalil Tounes')}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-[#D4AF37] hover:bg-[#FFF8E7] transition-all"
              >
                <Mail className="w-5 h-5 text-[#4A1D43]" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{subscriptionContactText.emailLabel}</span>
                  <span className="block text-xs text-gray-500">{CONTACT_EMAIL}</span>
                </span>
              </a>

              <button
                type="button"
                onClick={openWhatsAppContact}
                className="w-full flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left hover:border-[#25D366] hover:bg-green-50 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{subscriptionContactText.whatsAppLabel}</span>
                  <span className="block text-xs text-gray-500">+{WHATSAPP_CONTACT}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PayPal */}
      {activeModal === 'paypal' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-[#FFC439] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#003087]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">PayPal — Bientôt disponible</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              La validation PayPal est en cours. Veuillez utiliser le paiement par Carte pour le moment.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Modal Flouci */}
      {activeModal === 'flouci' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-5">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Payer en Dinars 🇹🇳</h3>
            <p className="text-xs text-[#059669] font-medium mb-4">via Flouci</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pour régler votre abonnement en Dinars via Flouci, contactez-nous directement sur{' '}
              <span className="font-semibold text-gray-800">WhatsApp</span> ou par{' '}
              <span className="font-semibold text-gray-800">téléphone</span> pour recevoir votre lien de paiement local.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] transition-colors shadow-sm"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}

      {/* Modal Paiement Manuel Sécurisé — Virement / D17 + validation WhatsApp */}
      {activeModal === 'manual' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-[#4A1D43] rounded-full flex items-center justify-center mx-auto mb-4">
                <Landmark className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Paiement Manuel Sécurisé</h3>
              <p className="text-sm text-gray-600">
                Virement bancaire ou versement D17 {manualPlanLabel ? `— ${manualPlanLabel}` : ''}
              </p>
            </div>

            {/* RIB / IBAN */}
            <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Coordonnées bancaires (Virement)
              </h4>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center gap-3">
                  <dt className="text-gray-600">Bénéficiaire</dt>
                  <dd className="font-semibold text-gray-900 text-right">{BANK_DETAILS.beneficiaire}</dd>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <dt className="text-gray-600">Banque</dt>
                  <dd className="font-semibold text-gray-900 text-right">{BANK_DETAILS.banque}</dd>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <dt className="text-gray-600">RIB</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">{BANK_DETAILS.rib}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.rib, 'rib')}
                      className="text-[#4A1D43] hover:text-[#D4AF37] transition-colors"
                      aria-label="Copier le RIB"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedField === 'rib' && <span className="text-[10px] text-green-600 font-semibold">copié</span>}
                  </dd>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <dt className="text-gray-600">IBAN</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">{BANK_DETAILS.iban}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.iban, 'iban')}
                      className="text-[#4A1D43] hover:text-[#D4AF37] transition-colors"
                      aria-label="Copier l'IBAN"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedField === 'iban' && <span className="text-[10px] text-green-600 font-semibold">copié</span>}
                  </dd>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <dt className="text-gray-600">SWIFT / BIC</dt>
                  <dd className="font-mono font-semibold text-gray-900">{BANK_DETAILS.swift}</dd>
                </div>
              </dl>
            </div>

            {/* D17 / transfert téléphone */}
            <div className="border border-gray-200 rounded-xl p-4 mb-5 bg-gradient-to-br from-[#FFF8E7] to-white">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Versement D17 (transfert par téléphone)
              </h4>
              <div className="flex justify-between items-center gap-3 text-sm">
                <span className="text-gray-600">Numéro D17</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-gray-900">{D17_PHONE}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(D17_PHONE, 'd17')}
                    className="text-[#4A1D43] hover:text-[#D4AF37] transition-colors"
                    aria-label="Copier le numéro D17"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copiedField === 'd17' && <span className="text-[10px] text-green-600 font-semibold">copié</span>}
                </div>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <button
              type="button"
              onClick={openWhatsAppReceipt}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#1EBE5D] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
              J'ai envoyé le paiement (Envoyer le reçu via WhatsApp)
            </button>

            <p className="text-center text-[11px] text-gray-500 mt-3 leading-relaxed">
              Votre abonnement sera activé sous 24h après réception de la preuve de paiement.
            </p>
          </div>
        </div>
      )}

      {showRequestForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeRequestForm()}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeRequestForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#4A1D43] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Demande d’information / inscription
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedPlan
                    ? `Vous avez choisi : ${selectedPlan}. Envoyez-nous votre demande, notre équipe vous contactera rapidement.`
                    : 'Envoyez-nous votre demande, notre équipe vous contactera rapidement.'}
                </p>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-5">
                {requestSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                    Merci ! Votre demande a été envoyée avec succès. Nous vous recontacterons rapidement.
                  </div>
                )}

                {requestError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {requestError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de votre demande <span className="text-[#800020]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.title}
                    onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                    placeholder="Ex : demande abonnement Premium, inscription entreprise..."
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Merci d’indiquer au moins un moyen de contact : téléphone ou email.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-[#800020]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    placeholder="Expliquez brièvement votre activité, votre besoin, votre demande d’abonnement ou votre question..."
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeRequestForm}
                    className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="flex-1 px-5 py-3 bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#5A2D53] transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {requestSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
