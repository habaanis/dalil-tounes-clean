import CvBusinessJourney from '../components/CvBusinessJourney';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { BusinessCardPreviewLanguage } from '../components/BusinessCardPreview';
import { Subscription } from './Subscription';

export default function SubscriptionWithJourney() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as BusinessCardPreviewLanguage;
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateDesktop = () => setIsDesktop(desktopQuery.matches);
    updateDesktop();
    desktopQuery.addEventListener('change', updateDesktop);
    return () => desktopQuery.removeEventListener('change', updateDesktop);
  }, []);

  return (
    <>
      {isDesktop && <CvBusinessJourney language={lang} />}
      <Subscription showMobileJourney={!isDesktop} />
    </>
  );
}
