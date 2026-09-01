import BaseBusinessCardPreview, {
  type BusinessCardPreviewLanguage,
  type BusinessCardPreviewProps,
  type BusinessCardPreviewSize,
  type BusinessCardPreviewVariant,
} from './BusinessCardPreviewBase';
import { CvBusinessQrVisual } from './CvBusinessQrVisual';
import './businessCardPreviewCompact.css';

export type {
  BusinessCardPreviewLanguage,
  BusinessCardPreviewProps,
  BusinessCardPreviewSize,
  BusinessCardPreviewVariant,
};

const AUX_SAVEURS_COVER = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
const AUX_SAVEURS_LOGO = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';
const AUX_SAVEURS_GALLERY = [
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/Aux-saveurs-danis-dessert-assiette?updatedAt=1787090066955',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-mariage?updatedAt=1787090066964',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-evenement.jpg?updatedAt=1787090429737',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-plat-emporter.jpg?updatedAt=1787090477302',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-amuse-bouche.jpg?updatedAt=1787090516040',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-creation-menu.jpg?updatedAt=1787090578091',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-tradition?updatedAt=1787096633576',
];

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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const showQrBeside = props.size === 'compact' && (pathname === '/businesses' || pathname === '/entreprises');

  const preview = (
    <div className="dt-marketing-preview">
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
        gallery={props.gallery || AUX_SAVEURS_GALLERY}
      />
    </div>
  );

  if (!showQrBeside) return preview;

  return (
    <div className="flex flex-col items-start justify-center gap-4 md:flex-row md:gap-5">
      {preview}
      <div className="h-[570px] w-[286px] shrink-0 overflow-visible">
        <div className="origin-top-left scale-[0.80]">
          <CvBusinessQrVisual language={language} />
        </div>
      </div>
    </div>
  );
}

export default BusinessCardPreview;
