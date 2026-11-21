import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, Globe2 } from 'lucide-react';

interface LanguageSelectorProps {
  clientApp?: boolean;
}

const LanguageSelector = ({ clientApp = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr' as const, label: 'FR' },
    { code: 'ar' as const, label: 'TN' },
    { code: 'en' as const, label: 'EN' },
    { code: 'it' as const, label: 'IT' },
    { code: 'ru' as const, label: 'RU' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

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
        className="relative inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-1.5 text-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-[#D4AF37]"
        style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <Globe2 className="pointer-events-none h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <select
          aria-label={accessibleLabel}
          value={language}
          onChange={event => {
            const next = event.target.value;
            if (next === 'fr' || next === 'ar' || next === 'en') setLanguage(next);
          }}
          className="min-h-[38px] max-w-[76px] cursor-pointer appearance-none bg-transparent py-1 pr-3 text-[11px] font-semibold text-gray-700 outline-none"
        >
          {!hasClientLanguage && <option value={language} disabled>{currentLang.label}</option>}
          <option value="fr" lang="fr">FR</option>
          <option value="ar" lang="ar" dir="rtl">AR</option>
          <option value="en" lang="en">EN</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-1 h-3 w-3 text-gray-400" aria-hidden="true" />
      </label>
    );
  }

  // Native select avoids a hidden or clipped custom dropdown in mobile headers.
  // Both site and independent PWA use the shared language context.
  return (
    <label className="relative inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D5C6A7] bg-white px-2 text-gray-700 focus-within:ring-2 focus-within:ring-[#D4AF37]"
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <Globe2 className="pointer-events-none h-4 w-4" aria-hidden="true"/>
      <span className="sr-only">{language==='ar'?'اختيار اللغة':'Choisir la langue'}</span>
      <select aria-label={language==='ar'?'اختيار اللغة':'Choisir la langue'}
        value={language}
        onChange={e=>{const next=e.target.value;if(languages.some(item=>item.code===next))setLanguage(next as typeof language);}}
        className="min-h-10 cursor-pointer appearance-none bg-transparent py-1 pr-4 text-sm font-semibold text-gray-700 outline-none">
        {languages.map(item=><option key={item.code} value={item.code}>{item.code==='ar'?'AR':item.label}</option>)}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-1 h-3.5 w-3.5"/>
    </label>
  );
};

export default LanguageSelector;
