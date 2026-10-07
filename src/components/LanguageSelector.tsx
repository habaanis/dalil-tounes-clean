import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, Globe2 } from 'lucide-react';
import FlagIcon from './FlagIcon';

interface LanguageSelectorProps {
  clientApp?: boolean;
}

const LanguageSelector = ({ clientApp = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr' as const, label: 'FR' },
    { code: 'ar' as const, label: 'TN' },
    { code: 'en' as const, label: 'EN' },
    { code: 'it' as const, label: 'IT' },
    { code: 'ru' as const, label: 'RU' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Same language state and saved translations as the site. The native control
  // stays small, keyboard-accessible and usable inside an installed mini-app.
  if (clientApp) {
    const accessibleLabel = language === 'ar'
      ? 'لغة التطبيق'
      : language === 'en' ? 'App language' : 'Langue de l’application';
    const hasClientLanguage = language === 'fr' || language === 'ar' || language === 'en';

    return (
      <label
        data-client-language-selector
        dir="ltr"
        className="relative inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 text-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-[#D4AF37]"
        style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <Globe2 className="pointer-events-none h-4 w-4 shrink-0" aria-hidden="true" />
        <select
          aria-label={accessibleLabel}
          value={language}
          onChange={event => {
            const next = event.target.value;
            if (next === 'fr' || next === 'ar' || next === 'en') setLanguage(next);
          }}
          className="min-h-[44px] cursor-pointer appearance-none bg-transparent py-1.5 pr-5 text-sm font-medium text-gray-700 outline-none"
        >
          {!hasClientLanguage && <option value={language} disabled>{currentLang.label}</option>}
          <option value="fr" lang="fr">Français</option>
          <option value="ar" lang="ar" dir="rtl">العربية</option>
          <option value="en" lang="en">English</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
      </label>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-all duration-200 border border-gray-200"
        aria-label="Select language"
        style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <FlagIcon code={currentLang.code} size="sm" />
        <span className="text-sm font-medium text-gray-700 tracking-wide">{currentLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-all duration-150
                ${language === lang.code ? 'bg-orange-50' : ''}
              `}
              style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              <FlagIcon code={lang.code} size="sm" />
              <span className={`text-sm font-medium tracking-wide ${language === lang.code ? 'text-orange-600' : 'text-gray-700'}`}>
                {lang.label}
              </span>
              {language === lang.code && (
                <svg className="w-3.5 h-3.5 ml-auto text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
