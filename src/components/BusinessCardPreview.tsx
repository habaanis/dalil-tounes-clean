import { useState } from 'react';
import { X } from 'lucide-react';
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
  galleryTitle: string;
}> = {
  fr: {
    name: "Aux saveurs d'Anis",
    category: 'Traiteur événementiel',
    city: '49260 Montreuil-Bellay, France',
    status: 'Sur réservation',
    hours: 'Lun–Sam : 10:00–18:00',
    reviews: 'Avis clients',
    gallery: 'Buffets et créations culinaires',
    galleryTitle: 'Galerie',
  },
  ar: {
    name: "Aux saveurs d'Anis",
    category: 'متعهد حفلات وتموين',
    city: '49260 مونتروي-بيلي، فرنسا',
    status: 'بالحجز',
    hours: 'الاثنين–السبت: 10:00–18:00',
    reviews: 'آراء العملاء',
    gallery: 'بوفيهات وإبداعات في فن الطبخ',
    galleryTitle: 'الصور',
  },
  en: {
    name: "Aux saveurs d'Anis",
    category: 'Event caterer',
    city: '49260 Montreuil-Bellay, France',
    status: 'By reservation',
    hours: 'Mon–Sat: 10:00–18:00',
    reviews: 'Customer reviews',
    gallery: 'Buffets and culinary creations',
    galleryTitle: 'Gallery',
  },
  it: {
    name: "Aux saveurs d'Anis",
    category: 'Catering per eventi',
    city: '49260 Montreuil-Bellay, Francia',
    status: 'Su prenotazione',
    hours: 'Lun–Sab: 10:00–18:00',
    reviews: 'Recensioni clienti',
    gallery: 'Buffet e creazioni culinarie',
    galleryTitle: 'Galleria',
  },
  ru: {
    name: "Aux saveurs d'Anis",
    category: 'Выездной кейтеринг',
    city: '49260 Монтрёй-Белле, Франция',
    status: 'По бронированию',
    hours: 'Пн–Сб: 10:00–18:00',
    reviews: 'Отзывы клиентов',
    gallery: 'Банкеты и кулинарные работы',
    galleryTitle: 'Галерея',
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
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
const AUX_SAVEURS_LOGO =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const AUX_SAVEURS_GALLERY = [
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/Aux-saveurs-danis-dessert-assiette?updatedAt=1787090066955',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-mariage?updatedAt=1787090066964',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-evenement.jpg?updatedAt=1787090429737',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-plat-emporter.jpg?updatedAt=1787090477302',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-amuse-bouche.jpg?updatedAt=1787090516040',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-creation-menu.jpg?updatedAt=1787090578091',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/Aux-saveurs-danis-logo?updatedAt=1787090066957',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-tradition?updatedAt=1787096633576',
];

const GALLERY_LABELS = ['Galerie', 'الصور', 'Gallery', 'Galleria', 'Галерея'];

export function BusinessCardPreview(props: BusinessCardPreviewProps) {
  const language = props.language ?? 'fr';
  const preview = AUX_SAVEURS_PREVIEW[language];
  const usesGenericName = !props.name || GENERIC_DEMO_NAMES.has(props.name);
  const usesGenericCategory = !props.category || GENERIC_DEMO_CATEGORIES.has(props.category);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const imageLimit = props.variant === 'premium' ? 10 : 5;
  const galleryImages = AUX_SAVEURS_GALLERY.slice(0, imageLimit);

  const handlePreviewClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;
    const label = button.textContent?.trim() ?? '';
    if (GALLERY_LABELS.some((galleryLabel) => label.includes(galleryLabel))) {
      setGalleryOpen(true);
    }
  };

  return (
    <>
      <div onClickCapture={handlePreviewClickCapture}>
        <LegacyBusinessCardPreview
          {...props}
          name={usesGenericName ? preview.name : props.name}
          category={usesGenericCategory ? preview.category : props.category}
          city={props.city ?? preview.city}
          status={props.status ?? preview.status}
          hours={props.hours ?? preview.hours}
          reviews={props.reviews ?? preview.reviews}
          gallery={props.gallery ?? `${preview.gallery} · ${galleryImages.length} photo${galleryImages.length > 1 ? 's' : ''}`}
          logo={props.logo ?? AUX_SAVEURS_LOGO}
          coverImage={props.coverImage ?? AUX_SAVEURS_COVER}
        />
      </div>

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.galleryTitle} — ${preview.name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGalleryOpen(false);
          }}
        >
          <div className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-[#D6AF2E] bg-[#032A22] p-4 shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#D6AF2E]/70 bg-[#011B17] text-[#F4CE55] shadow-lg transition hover:bg-[#063D31] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="pr-12">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#D6AF2E]">
                {props.variant === 'premium' ? 'CV Business Premium' : 'Vitrine Business Artisan'}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                {preview.galleryTitle} — {preview.name}
              </h3>
              <p className="mt-1 text-sm text-emerald-100/80">
                {galleryImages.length} photo{galleryImages.length > 1 ? 's' : ''} réelle{galleryImages.length > 1 ? 's' : ''} de la vitrine Lienora
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {galleryImages.map((src, index) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden rounded-xl border border-[#D6AF2E]/35 bg-black/20 ${index === 0 ? 'col-span-2 aspect-[16/10] sm:col-span-2' : 'aspect-square'}`}
                >
                  <img
                    src={src}
                    alt={`${preview.name} — réalisation ${index + 1}`}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BusinessCardPreview;
