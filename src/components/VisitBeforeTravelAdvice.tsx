import { PhoneCall } from 'lucide-react';

type BusinessLike = {
  nom?: string | null;
  categorie?: string | string[] | null;
  sous_categories?: string | string[] | null;
  description?: string | null;
  liste_pages?: string | string[] | null;
  telephone?: string | null;
};

const normalize = (value: unknown): string => {
  const text = Array.isArray(value) ? value.join(' ') : String(value || '');
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const visitType = (business: BusinessLike): 'artisan' | 'activity' | 'lodging' | 'site' | null => {
  const tags = normalize([business.nom, business.categorie, business.sous_categories, business.description, business.liste_pages].join(' '));
  if (/artisan|artisanat|atelier|tissage|poterie|vannerie|tressage|producteur|ferme|apicult|huilerie|palmeraie|terroir/.test(tags)) return 'artisan';
  if (/guide local|guide touristique|plongee|randonnee|experience locale|excursion/.test(tags)) return 'activity';
  if (/gite|maison d.hotes|ecolodge|hebergement rural|campement/.test(tags)) return 'lodging';
  if (/musee|site archeologique|site culturel|festival/.test(tags)) return 'site';
  return null;
};

export default function VisitBeforeTravelAdvice({ business, language }: { business: BusinessLike; language: string }) {
  const type = visitType(business);
  if (!type) return null;
  const ar = language === 'ar';
  const message = ar
    ? type === 'site'
      ? 'تحقّق من مواعيد الزيارة وشروط الدخول قبل التنقّل.'
      : type === 'lodging'
        ? 'يرجى الاتصال مسبقاً للتأكد من توفر الإقامة والحجز قبل التنقّل.'
        : type === 'activity'
          ? 'يرجى الاتصال مسبقاً للتأكد من توفر النشاط وشروط الحجز قبل التنقّل.'
          : 'يُفضّل الاتصال بالحرفي أو المسؤول قبل أي زيارة للتأكد من المواعيد وإمكانية استقبال الزوار.'
    : type === 'site'
      ? 'Vérifiez les horaires et conditions d’accès avant de vous déplacer.'
      : type === 'lodging'
        ? 'Contactez l’hébergement avant votre déplacement pour confirmer les disponibilités et la réservation.'
        : type === 'activity'
          ? 'Contactez l’organisateur avant votre déplacement pour confirmer la disponibilité et les conditions de réservation.'
          : 'Avant toute visite, téléphonez à l’artisan ou au responsable pour confirmer les horaires et les possibilités d’accueil.';
  const phone = String(business.telephone || '').trim();
  const callable = /^\+?[\d\s().-]{7,25}$/.test(phone);
  return (
    <aside dir={ar ? 'rtl' : 'ltr'} className="mx-auto my-4 w-full max-w-md rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-3 text-sm text-amber-950">
      <div className="flex items-start gap-2">
        <PhoneCall className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{ar ? 'قبل الزيارة' : 'Avant votre visite'}</p>
          <p className="mt-1 leading-relaxed">{message}</p>
          {callable && type !== 'site' && (
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="mt-2 inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100">
              {ar ? 'اتصال' : 'Appeler'}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
