import { Phone } from 'lucide-react';

type AppLang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
const HELP_COPY: Record<AppLang, {
  heading: string; choose: string; french: string; tunisian: string;
  scope: string; exclusion: string; call: string;
}> = {
  fr: {
    heading: 'Besoin d’aide sur Dalil Tounes ?', choose: 'Appeler notre équipe',
    french: 'En français · Anis', tunisian: 'En tunisien · Azziz',
    scope: 'Inscriptions, mini-appli professionnelle et fonctionnement de Dalil Tounes.',
    exclusion: 'Pour les adresses et horaires des établissements, consultez directement leurs fiches.',
    call: 'Appeler',
  },
  ar: {
    heading: 'تحتاج مساعدة في دليل تونس؟', choose: 'اتصل بفريقنا',
    french: 'بالفرنسية · أنيس', tunisian: 'بالتونسي · عزيز',
    scope: 'لتسجيل المؤسسات والتطبيق المصغّر المهني وكيفاش تستعمل دليل تونس.',
    exclusion: 'لعناوين وأوقات خدمة المؤسسات، شوف بطاقاتهم مباشرة.',
    call: 'اتصل',
  },
  en: {
    heading: 'Need help with Dalil Tounes?', choose: 'Call our team',
    french: 'French-speaking · Anis', tunisian: 'Tunisian Arabic · Azziz',
    scope: 'Business registration, Business / Portfolio CVs and using Dalil Tounes.',
    exclusion: 'For business addresses and opening hours, check the business listing itself.',
    call: 'Call',
  },
  it: {
    heading: 'Serve aiuto con Dalil Tounes?', choose: 'Chiama il nostro team',
    french: 'In francese · Anis', tunisian: 'In tunisino · Azziz',
    scope: 'Registrazioni, mini-app professionale e utilizzo di Dalil Tounes.',
    exclusion: 'Per indirizzi e orari delle attività, consulta direttamente le loro schede.',
    call: 'Chiama',
  },
  ru: {
    heading: 'Нужна помощь с Dalil Tounes?', choose: 'Позвонить команде',
    french: 'На французском · Анис', tunisian: 'На тунисском арабском · Азиз',
    scope: 'Регистрация компаний, мини-приложение для бизнеса и работа с Dalil Tounes.',
    exclusion: 'Адреса и часы работы компаний смотрите в их карточках.',
    call: 'Позвонить',
  },
};

export default function PlatformAppHelp({ language }: { language: string }) {
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as AppLang;
  const helpCopy = HELP_COPY[lang];
  return (
<div data-app-help className="mx-auto max-w-xl px-3 pt-2">
        <details className="group rounded-xl border border-[#D4AF37]/40 bg-white px-3 py-2">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold text-[#45243A] [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-[#A17D36]" aria-hidden="true" />{helpCopy.heading}</span>
            <span className="inline-flex items-center gap-1 text-[#8B6C35]">{helpCopy.choose}<span className="text-base group-open:rotate-180" aria-hidden="true">⌄</span></span>
          </summary>
          <div className="mt-2 space-y-2 border-t border-[#E8DCC4] pt-3">
            <p className="text-xs leading-5 text-[#655661]">{helpCopy.scope}</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { label: helpCopy.french, phone: '+216 27 642 252', href: 'tel:+21627642252' },
                { label: helpCopy.tunisian, phone: '+216 24 225 585', href: 'tel:+21624225585' },
              ]).map(item => (
                <a key={item.href} href={item.href}
                  className="flex min-h-[78px] flex-col justify-center gap-1 rounded-xl border border-[#D4AF37]/50 bg-[#FFFAF0] px-2 py-2 text-center text-[#45243A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]"
                  aria-label={`${helpCopy.call} — ${item.label} : ${item.phone}`}>
                  <span className="text-[11px] font-medium leading-4">{item.label}</span>
                  <span className="text-xs font-semibold tabular-nums" dir="ltr">{item.phone}</span>
                </a>
              ))}
            </div>
            <p className="text-[11px] leading-5 text-[#756971]">{helpCopy.exclusion}</p>
          </div>
        </details>
      </div>
  );
}
