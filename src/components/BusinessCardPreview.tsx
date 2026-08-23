import { useEffect, useRef, useState } from 'react';
import { ChevronRight, QrCode, X } from 'lucide-react';
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
 * Exemple réel affiché uniquement dans les aperçus commerciaux.
 * La structure, les champs et les droits Artisan/Premium restent gérés
 * par le composant historique ; ce wrapper fournit le cas réel Aux saveurs d'Anis
 * et harmonise la présentation des aperçus avec le CV Business actuel.
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
  qrTitle: string;
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
    qrTitle: 'QR Code et partage',
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
    qrTitle: 'رمز QR والمشاركة',
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
    qrTitle: 'QR Code and sharing',
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
    qrTitle: 'QR Code e condivisione',
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
    qrTitle: 'QR-код и поделиться',
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
  'Piattaforma tunisiana',
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
const LEGACY_QR_LABELS = [
  'QR de partage professionnel',
  'رمز QR للمشاركة المهنية',
  'Professional sharing QR',
  'QR di condivisione professionale',
  'Профессиональный QR-код',
];

export function BusinessCardPreview(props: BusinessCardPreviewProps) {
  const language = props.language ?? 'fr';
  const preview = AUX_SAVEURS_PREVIEW[language];
  const usesGenericName = !props.name || GENERIC_DEMO_NAMES.has(props.name);
  const usesGenericCategory = !props.category || GENERIC_DEMO_CATEGORIES.has(props.category);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const legacyPreviewRef = useRef<HTMLDivElement>(null);
  const imageLimit = props.variant === 'premium' ? 10 : 5;
  const galleryImages = AUX_SAVEURS_GALLERY.slice(0, imageLimit);
  const previewWidthClass = props.variant === 'premium' ? 'max-w-[350px]' : 'max-w-[360px]';

  useEffect(() => {
    if (props.variant !== 'premium') return;
    const root = legacyPreviewRef.current;
    if (!root) return;

    const hideLegacyQr = () => {
      root.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        const label = button.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        if (LEGACY_QR_LABELS.some((qrLabel) => label.includes(qrLabel))) {
          button.style.display = 'none';
        }
      });
    };

    hideLegacyQr();
    const observer = new MutationObserver(hideLegacyQr);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, props.variant]);

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
      <div className={`mx-auto w-full ${previewWidthClass}`} onClickCapture={handlePreviewClickCapture}>
        <div ref={legacyPreviewRef}>
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

        {props.variant === 'premium' && (
          <div className="relative z-10 mx-1 -mt-3 rounded-b-[20px] border border-t-0 border-[#D9B43A]/70 bg-[linear-gradient(180deg,#032A22,#011B17)] px-2.5 pb-2 pt-4 shadow-[0_8px_16px_rgba(0,24,19,0.25)]">
            <button
              type="button"
              className="flex min-h-9 w-full items-center gap-2 rounded-lg border border-[#D9B43A]/60 bg-[linear-gradient(90deg,#042E25,#011F1A)] px-2.5 py-1 text-start text-[11px] font-bold text-white transition hover:bg-[#D6AF2E]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E]"
              aria-label={preview.qrTitle}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D6AF2E]/10 text-[#F4CE55]">
                <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="flex-1">{preview.qrTitle}</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#F4CE55] rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>
        )}
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
