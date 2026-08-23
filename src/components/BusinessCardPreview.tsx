import LegacyBusinessCardPreview, {
  type BusinessCardPreviewLanguage,
  type BusinessCardPreviewProps,
  type BusinessCardPreviewSize,
  type BusinessCardPreviewVariant,
} from './BusinessCardPreviewLegacy';

export type {
  BusinessCardPreviewLanguage,
  BusinessCardPreviewProps,
  BusinessCardPreviewSize,
  BusinessCardPreviewVariant,
};

/**
 * Exemple réel affiché uniquement dans les aperçus commerciaux de la page
 * Abonnement. La structure, les champs et les droits Artisan/Premium restent
 * entièrement gérés par le composant historique inchangé.
 */
const AUX_SAVEURS_PREVIEW: Record<BusinessCardPreviewLanguage, {
  name: string;
  category: string;
  city: string;
  status: string;
  hours: string;
  reviews: string;
  gallery: string;
}> = {
  fr: {
    name: "Aux saveurs d'Anis",
    category: 'Traiteur événementiel',
    city: '49260 Montreuil-Bellay, France',
    status: 'Sur réservation',
    hours: 'Lun–Sam : 10:00–18:00',
    reviews: '5,0 · Avis clients',
    gallery: 'Buffets et créations culinaires',
  },
  ar: {
    name: "Aux saveurs d'Anis",
    category: 'متعهد حفلات وتموين',
    city: '49260 مونتروي-بيلي، فرنسا',
    status: 'بالحجز',
    hours: 'الاثنين–السبت: 10:00–18:00',
    reviews: '5,0 · آراء العملاء',
    gallery: 'بوفيهات وإبداعات في فن الطبخ',
  },
  en: {
    name: "Aux saveurs d'Anis",
    category: 'Event caterer',
    city: '49260 Montreuil-Bellay, France',
    status: 'By reservation',
    hours: 'Mon–Sat: 10:00–18:00',
    reviews: '5.0 · Customer reviews',
    gallery: 'Buffets and culinary creations',
  },
  it: {
    name: "Aux saveurs d'Anis",
    category: 'Catering per eventi',
    city: '49260 Montreuil-Bellay, Francia',
    status: 'Su prenotazione',
    hours: 'Lun–Sab: 10:00–18:00',
    reviews: '5,0 · Recensioni clienti',
    gallery: 'Buffet e creazioni culinarie',
  },
  ru: {
    name: "Aux saveurs d'Anis",
    category: 'Выездной кейтеринг',
    city: '49260 Монтрёй-Белле, Франция',
    status: 'По бронированию',
    hours: 'Пн–Сб: 10:00–18:00',
    reviews: '5,0 · Отзывы клиентов',
    gallery: 'Банкеты и кулинарные работы',
  },
};

const GENERIC_DEMO_NAMES = new Set([
  'Fiche Démonstration Dalil Tounes',
  'بطاقة دليل تونس التجريبية',
  'Dalil Tounes Demonstration Profile',
  'Scheda dimostrativa Dalil Tounes',
  'Демонстрационный профиль Dalil Tounes',
]);

const GENERIC_DEMO_CATEGORIES = new Set([
  'Plateforme tunisienne',
  'منصة تونسية',
  'Tunisian platform',
  'Piattaforma tunisina',
  'Тунисская платформа',
]);

const AUX_SAVEURS_COVER =
  'https://static.wixstatic.com/media/33e072_d4c63a0f990b4b8f8c4c6e0522771f03~mv2.jpg';
const AUX_SAVEURS_LOGO =
  'https://static.wixstatic.com/media/33e072_ebf607de16d14907bc2b0857ef66bfd9~mv2.jpg';

export function BusinessCardPreview(props: BusinessCardPreviewProps) {
  const language = props.language ?? 'fr';
  const preview = AUX_SAVEURS_PREVIEW[language];
  const usesGenericName = !props.name || GENERIC_DEMO_NAMES.has(props.name);
  const usesGenericCategory = !props.category || GENERIC_DEMO_CATEGORIES.has(props.category);

  return (
    <LegacyBusinessCardPreview
      {...props}
      name={usesGenericName ? preview.name : props.name}
      category={usesGenericCategory ? preview.category : props.category}
      city={props.city ?? preview.city}
      status={props.status ?? preview.status}
      hours={props.hours ?? preview.hours}
      reviews={props.reviews ?? preview.reviews}
      gallery={props.gallery ?? preview.gallery}
      logo={props.logo ?? AUX_SAVEURS_LOGO}
      coverImage={props.coverImage ?? AUX_SAVEURS_COVER}
    />
  );
}

export default BusinessCardPreview;
