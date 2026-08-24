import React from 'react';
import UnderConstruction from './UnderConstruction';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const COPY: Record<PublicLanguage, { title: string; subtitle: string }> = {
  fr: {
    title: 'Contact',
    subtitle: 'Notre équipe est disponible pour répondre à toutes vos questions via contact@dalil-tounes.com',
  },
  ar: {
    title: 'اتصل بنا',
    subtitle: 'فريقنا متاح للإجابة عن جميع أسئلتكم عبر contact@dalil-tounes.com',
  },
  en: {
    title: 'Contact',
    subtitle: 'Our team is available to answer all your questions at contact@dalil-tounes.com',
  },
  it: {
    title: 'Contatti',
    subtitle: 'Il nostro team è disponibile per rispondere a tutte le tue domande tramite contact@dalil-tounes.com',
  },
  ru: {
    title: 'Контакты',
    subtitle: 'Наша команда готова ответить на ваши вопросы по адресу contact@dalil-tounes.com',
  },
};

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];

  return <UnderConstruction title={copy.title} subtitle={copy.subtitle} />;
};

export default Contact;
