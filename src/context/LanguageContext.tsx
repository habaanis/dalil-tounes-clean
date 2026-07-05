import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language } from '../lib/i18n';
import { getLanguageFromUrl } from '../hooks/useHreflangPath';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES: Language[] = ['fr', 'ar', 'it', 'ru', 'en'];
const LANGUAGE_STORAGE_KEY = 'dalilTounes_language';
const DEFAULT_LANGUAGE: Language = 'ar';

const getBrowserLanguage = (): Language | null => {
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const browserLanguage of browserLanguages) {
    const baseLanguage = browserLanguage.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(baseLanguage as Language)) {
      return baseLanguage as Language;
    }
  }

  return null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Détecte la langue depuis l'URL au chargement initial
    const urlLang = getLanguageFromUrl();
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as Language)) {
      return urlLang as Language;
    }

    // Sinon, utilise la langue sauvegardée
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang as Language)) {
      return savedLang as Language;
    }

    const detectedLanguage = getBrowserLanguage();
    if (detectedLanguage) {
      return detectedLanguage;
    }

    return DEFAULT_LANGUAGE;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // localStorage can be unavailable in private browsing contexts.
    }
  };

  useEffect(() => {
    // Mettre à jour l'URL si nécessaire
    const urlLang = getLanguageFromUrl();
    if (urlLang !== language) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
