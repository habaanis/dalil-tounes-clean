import CvBusinessJourney from '../components/CvBusinessJourney';
import { useLanguage } from '../context/LanguageContext';
import type { BusinessCardPreviewLanguage } from '../components/BusinessCardPreview';
import { Subscription } from './Subscription';

export default function SubscriptionWithJourney() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as BusinessCardPreviewLanguage;

  return (
    <>
      <Subscription />
      <CvBusinessJourney language={lang} />
    </>
  );
}
