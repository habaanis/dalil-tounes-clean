import CountUp from 'react-countup';
import { Language } from '../lib/i18n';

interface CompanyCountCardProps {
  language: Language;
  totalCount: number;
  loading: boolean;
}

const translations = {
  fr: {
    before: '',
    after: ' entreprises tunisiennes font déjà partie du réseau Dalil Tounes.',
    sub: 'Un réseau qui grandit chaque jour',
  },
  en: {
    before: '',
    after: ' Tunisian companies are already part of the Dalil Tounes network.',
    sub: 'A network that grows every day',
  },
  ar: {
    before: 'انضمت بالفعل ',
    after: ' شركة تونسية إلى شبكة دليل تونس.',
    sub: 'شبكة تنمو كل يوم',
  },
  it: {
    before: '',
    after: ' aziende tunisine fanno già parte della rete Dalil Tounes.',
    sub: 'Una rete che cresce ogni giorno',
  },
  ru: {
    before: 'Уже ',
    after: ' тунисских компаний являются частью сети Dalil Tounes.',
    sub: 'Сеть, которая растёт каждый день',
  },
};

export default function CompanyCountCard({ language, totalCount, loading }: CompanyCountCardProps) {

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <div className="relative w-full flex flex-col items-center justify-center text-center py-6 my-4 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full" />

      <h3
        className={`text-xl md:text-2xl font-medium text-[#4A1D43] leading-snug max-w-3xl transition-all duration-500 ${
          isRTL ? 'text-right' : 'text-center'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {t.before}
        {loading
          ? <span className="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse align-middle" />
          : <CountUp end={totalCount} duration={2.5} separator=" " />
        }
        {t.after}
      </h3>

      <p
        className={`text-gray-600 text-sm md:text-base mt-2 ${
          isRTL ? 'text-right' : 'text-center'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {t.sub}
      </p>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full" />
    </div>
  );
}
