import CountUp from 'react-countup';
import { Language } from '../lib/i18n';

interface CompanyCountCardProps {
  language: Language;
  totalCount: number;
  certifiedCount: number;
  loading: boolean;
}

const translations = {
  fr: {
    before: '',
    after: ' fiches enregistrées dans la base Dalil Tounes (publiées et en préparation).',
    certified: 'dont',
    certifiedAfter: ' certifiées',
    sub: 'Un réseau qui grandit chaque jour',
  },
  en: {
    before: '',
    after: ' records in the Dalil Tounes database (published and in preparation).',
    certified: 'including',
    certifiedAfter: ' certified',
    sub: 'A network that grows every day',
  },
  ar: {
    before: 'تم تسجيل ',
    after: ' بطاقة في قاعدة بيانات دليل تونس (منشورة أو قيد الإعداد).',
    certified: 'منها',
    certifiedAfter: ' معتمدة',
    sub: 'شبكة تنمو كل يوم',
  },
  it: {
    before: '',
    after: ' schede registrate nella banca dati Dalil Tounes (pubblicate e in preparazione).',
    certified: 'di cui',
    certifiedAfter: ' certificate',
    sub: 'Una rete che cresce ogni giorno',
  },
  ru: {
    before: 'Уже ',
    after: ' записей в базе Dalil Tounes (опубликованных и в подготовке).',
    certified: 'из них',
    certifiedAfter: ' сертифицированных',
    sub: 'Сеть, которая растёт каждый день',
  },
};

export default function CompanyCountCard({ language, totalCount, certifiedCount, loading }: CompanyCountCardProps) {
  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <div className="relative w-full flex flex-col items-center justify-center text-center py-6 my-4 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full" />

      <h3
        className={`text-xl md:text-2xl font-medium text-[#292725] leading-snug max-w-3xl transition-all duration-500 ${
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
        className={`text-[#292725]/70 text-base md:text-lg mt-1 font-medium ${
          isRTL ? 'text-right' : 'text-center'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {t.certified}{' '}
        {loading
          ? <span className="inline-block w-8 h-4 bg-gray-200 rounded animate-pulse align-middle" />
          : <span className="text-[#D4AF37] font-semibold"><CountUp end={certifiedCount} duration={2} separator=" " /></span>
        }
        {t.certifiedAfter}
      </p>

      <p
        className={`text-gray-600 text-sm md:text-base mt-1 ${
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
