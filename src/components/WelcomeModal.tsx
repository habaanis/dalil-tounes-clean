import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../lib/i18n';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages: Array<{ code: Language; flag: string; label: string; featured?: boolean }> = [
  { code: 'ar', flag: '🇹🇳', label: 'تونسي', featured: true },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
];

const welcomeCopy: Record<Language, {
  eyebrow: string;
  title: string;
  description: string;
  detected: string;
  learnMore: string;
  choose: string;
  close: string;
}> = {
  fr: {
    eyebrow: 'Bienvenue chez vous.',
    title: 'Bienvenue sur Dalil Tounes',
    description: "Dalil Tounes aide les citoyens à trouver les bonnes entreprises et permet aux entreprises tunisiennes d'être plus visibles, plus facilement trouvées et contactées.",
    detected: 'Nous avons détecté votre langue. Vous pouvez la conserver ou en choisir une autre.',
    learnMore: 'À quoi sert Dalil Tounes ?',
    choose: 'Choisissez votre langue',
    close: "Fermer l'écran de bienvenue",
  },
  ar: {
    eyebrow: 'مرحباً بك في بلدك.',
    title: 'مرحباً بك في دليل تونس',
    description: 'يساعد دليل تونس المواطنين على العثور على المؤسسات المناسبة، ويساعد المؤسسات التونسية على زيادة ظهورها وتسهيل العثور عليها والتواصل معها.',
    detected: 'لقد اكتشفنا لغتك. يمكنك الاحتفاظ بها أو اختيار لغة أخرى.',
    learnMore: 'ما فائدة دليل تونس؟',
    choose: 'اختر لغتك',
    close: 'إغلاق شاشة الترحيب',
  },
  en: {
    eyebrow: 'Welcome home.',
    title: 'Welcome to Dalil Tounes',
    description: 'Dalil Tounes helps people find the right businesses and helps Tunisian businesses become more visible, easier to find and easier to contact.',
    detected: 'We detected your language. You can keep it or choose another one.',
    learnMore: 'What is Dalil Tounes for?',
    choose: 'Choose your language',
    close: 'Close the welcome screen',
  },
  it: {
    eyebrow: 'Benvenuto a casa.',
    title: 'Benvenuto su Dalil Tounes',
    description: 'Dalil Tounes aiuta le persone a trovare le imprese giuste e permette alle imprese tunisine di essere più visibili, facili da trovare e da contattare.',
    detected: 'Abbiamo rilevato la tua lingua. Puoi mantenerla o sceglierne un’altra.',
    learnMore: 'A cosa serve Dalil Tounes?',
    choose: 'Scegli la tua lingua',
    close: 'Chiudi la schermata di benvenuto',
  },
  ru: {
    eyebrow: 'Добро пожаловать.',
    title: 'Добро пожаловать в Dalil Tounes',
    description: 'Dalil Tounes помогает людям находить подходящие компании, а тунисским компаниям — становиться заметнее и доступнее для поиска и связи.',
    detected: 'Мы определили ваш язык. Вы можете оставить его или выбрать другой.',
    learnMore: 'Для чего нужен Dalil Tounes?',
    choose: 'Выберите язык',
    close: 'Закрыть экран приветствия',
  },
};

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const { language, setLanguage } = useLanguage();
  const copy = welcomeCopy[language];
  const firstLanguageButtonRef = useRef<HTMLButtonElement>(null);
  const showDetectedLanguageHint = useMemo(() => {
    if (!isOpen) {
      return false;
    }

    try {
      return !localStorage.getItem('dalilTounes_language');
    } catch {
      return false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => firstLanguageButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative max-h-[calc(100dvh-32px)] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_18px_55px_rgba(74,29,67,0.2)]"
            style={{ width: 'min(600px, calc(100vw - 32px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E70013] via-white to-[#E70013]" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 shadow-sm transition hover:border-[#D4AF37] hover:text-[#4A1D43] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
              aria-label={copy.close}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="overflow-y-auto px-5 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-8">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E70013] text-xl shadow-sm">
                🇹🇳
              </div>

              <div className="text-center">
                <p className="mb-1.5 text-xs font-semibold text-[#D4AF37]">{copy.eyebrow}</p>
                <h2
                  id="welcome-title"
                  className="text-xl font-semibold leading-snug text-[#4A1D43] sm:text-2xl"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {copy.title}
                </h2>
                <p className="mx-auto mt-3 max-w-[520px] text-xs leading-5 text-gray-600 sm:text-sm">
                  {copy.description}
                </p>
                {showDetectedLanguageHint && (
                  <p className="mx-auto mt-2 max-w-[430px] text-[11px] leading-4 text-gray-400">
                    {copy.detected}
                  </p>
                )}
              </div>

              <Link
                to="/pourquoi-dalil-tounes"
                onClick={onClose}
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFF8E6] px-3.5 py-1.5 text-xs font-semibold text-[#4A1D43] transition hover:border-[#D4AF37] hover:bg-[#FFF3CC] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
              >
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.learnMore}
              </Link>

              <div className="mt-4 border-t border-gray-100 pt-3.5">
                <p className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {copy.choose}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      ref={index === 0 ? firstLanguageButtonRef : undefined}
                      type="button"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex min-h-[46px] items-center justify-between rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 ${
                        lang.featured
                          ? 'border-[#D4AF37] bg-[#FFF8E6] shadow-sm hover:bg-[#FFF3CC]'
                          : 'border-gray-200 bg-white hover:border-[#D4AF37]/60 hover:bg-gray-50'
                      } ${language === lang.code ? 'ring-1 ring-[#D4AF37]' : ''}`}
                      aria-label={`Choisir ${lang.label}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-base" aria-hidden="true">{lang.flag}</span>
                        <span className="truncate text-sm font-medium text-gray-800">{lang.label}</span>
                      </span>
                      {lang.featured && (
                        <span className="ml-1 rounded-full bg-[#4A1D43] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          TN
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
