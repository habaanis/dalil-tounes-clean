import BaseBusinessCardPreview, {
  type BusinessCardPreviewLanguage,
  type BusinessCardPreviewProps,
  type BusinessCardPreviewSize,
  type BusinessCardPreviewVariant,
} from './BusinessCardPreviewBase';

export type {
  BusinessCardPreviewLanguage,
  BusinessCardPreviewProps,
  BusinessCardPreviewSize,
  BusinessCardPreviewVariant,
};

const AUX_SAVEURS_COVER = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
const AUX_SAVEURS_LOGO = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const DEMO_COPY: Record<BusinessCardPreviewLanguage, {
  name: string;
  category: string;
  city: string;
  status: string;
  hours: string;
  reviews: string;
}> = {
  fr: {
    name: "Aux saveurs d'Anis",
    category: 'Traiteur événementiel',
    city: 'Sousse, Tunisie',
    status: 'Ouvert',
    hours: 'Lun–Sam : 10:00–18:00',
    reviews: '5.0 ★ · 27 avis',
  },
  ar: {
    name: "Aux saveurs d'Anis",
    category: 'متعهد حفلات وتموين',
    city: 'سوسة، تونس',
    status: 'مفتوح',
    hours: 'الاثنين–السبت: 10:00–18:00',
    reviews: '5.0 ★ · 27 رأيًا',
  },
  en: {
    name: "Aux saveurs d'Anis",
    category: 'Event caterer',
    city: 'Sousse, Tunisia',
    status: 'Open',
    hours: 'Mon–Sat: 10:00–18:00',
    reviews: '5.0 ★ · 27 reviews',
  },
  it: {
    name: "Aux saveurs d'Anis",
    category: 'Catering per eventi',
    city: 'Susa, Tunisia',
    status: 'Aperto',
    hours: 'Lun–Sab: 10:00–18:00',
    reviews: '5.0 ★ · 27 recensioni',
  },
  ru: {
    name: "Aux saveurs d'Anis",
    category: 'Выездной кейтеринг',
    city: 'Сус, Тунис',
    status: 'Открыто',
    hours: 'Пн–Сб: 10:00–18:00',
    reviews: '5.0 ★ · 27 отзывов',
  },
};

export function BusinessCardPreview(props: BusinessCardPreviewProps) {
  const language = props.language ?? 'fr';
  const demo = DEMO_COPY[language];

  return (
    <BaseBusinessCardPreview
      {...props}
      language={language}
      name={props.name || demo.name}
      category={props.category || demo.category}
      city={props.city || demo.city}
      status={props.status || demo.status}
      hours={props.hours || demo.hours}
      reviews={props.reviews || demo.reviews}
      logo={props.logo || AUX_SAVEURS_LOGO}
      coverImage={props.coverImage || AUX_SAVEURS_COVER}
    />
  );
}

export default BusinessCardPreview;
