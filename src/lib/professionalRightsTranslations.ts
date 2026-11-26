import type { Language } from './i18n';

const fr = {
  loading: 'Vérification de votre formule…', unavailable: 'Vos droits sont temporairement indisponibles. Rechargez avant de modifier vos choix.',
  unconfirmed: 'Formule à confirmer : vos contenus et vos choix existants sont conservés.',
  legacy: 'Droits historiques conservés', artisan: 'Formule Artisan', premium: 'Formule Premium',
  choices: 'Choisissez parmi les modèles, palettes et ouvertures inclus dans votre formule.',
  single: 'Votre modèle, votre palette et votre ouverture actuels sont ceux inclus dans votre formule.',
  networks: 'Réseaux sociaux', networkCount: '{count}/{limit} réseaux sélectionnés',
  networkLimit: 'La limite de réseaux de votre formule est atteinte. Retirez un réseau pour le remplacer.',
  rightsError: 'Impossible de vérifier les droits de votre formule. Les réseaux actuels restent modifiables.',
  loadingNetworks: 'Vérification des réseaux autorisés…',
};
type Copy = { [K in keyof typeof fr]: string };
const texts: Record<Language, Copy> = {
  fr,
  en: {
    loading: 'Checking your plan…', unavailable: 'Your permissions are temporarily unavailable. Reload before changing your choices.',
    unconfirmed: 'Plan awaiting confirmation: your existing content and choices are preserved.', legacy: 'Existing entitlements preserved', artisan: 'Artisan plan', premium: 'Premium plan',
    choices: 'Choose from the layouts, palettes and openings included in your plan.', single: 'Your current layout, palette and opening are those included in your plan.',
    networks: 'Social networks', networkCount: '{count}/{limit} networks selected', networkLimit: 'Your plan’s network limit is reached. Remove a network to replace it.',
    rightsError: 'Your plan permissions could not be checked. Existing networks can still be edited.', loadingNetworks: 'Checking available networks…',
  },
  ar: {
    loading: 'جارٍ التحقق من باقتك…', unavailable: 'تعذر تحميل صلاحياتك مؤقتًا. أعد تحميل الصفحة قبل تغيير اختياراتك.',
    unconfirmed: 'الباقة في انتظار التأكيد: يتم الاحتفاظ بمحتواك واختياراتك الحالية.', legacy: 'تم الاحتفاظ بالحقوق السابقة', artisan: 'باقة Artisan', premium: 'باقة Premium',
    choices: 'اختر من النماذج والألوان وشاشات الافتتاح المشمولة في باقتك.', single: 'نموذجك وألوانك وشاشة الافتتاح الحالية هي المشمولة في باقتك.',
    networks: 'شبكات التواصل الاجتماعي', networkCount: 'تم اختيار {count}/{limit} شبكات', networkLimit: 'بلغت الحد الأقصى للشبكات في باقتك. احذف شبكة لاستبدالها.',
    rightsError: 'تعذر التحقق من صلاحيات باقتك. يمكنك تعديل الشبكات الحالية.', loadingNetworks: 'جارٍ التحقق من الشبكات المسموح بها…',
  },
  it: {
    loading: 'Verifica della formula…', unavailable: 'I tuoi diritti non sono disponibili al momento. Ricarica prima di cambiare le scelte.',
    unconfirmed: 'Formula da confermare: i contenuti e le scelte esistenti sono conservati.', legacy: 'Diritti precedenti conservati', artisan: 'Formula Artisan', premium: 'Formula Premium',
    choices: 'Scegli tra i modelli, i colori e le aperture inclusi nella tua formula.', single: 'Il modello, i colori e l’apertura attuali sono quelli inclusi nella tua formula.',
    networks: 'Social network', networkCount: '{count}/{limit} reti selezionate', networkLimit: 'Hai raggiunto il limite di social network. Rimuovine uno per sostituirlo.',
    rightsError: 'Impossibile verificare i diritti della formula. Le reti esistenti restano modificabili.', loadingNetworks: 'Verifica delle reti consentite…',
  },
  ru: {
    loading: 'Проверка вашего тарифа…', unavailable: 'Ваши права временно недоступны. Обновите страницу перед изменением настроек.',
    unconfirmed: 'Тариф требует подтверждения: существующие материалы и настройки сохранены.', legacy: 'Ранее полученные права сохранены', artisan: 'Тариф Artisan', premium: 'Тариф Premium',
    choices: 'Выберите модели, палитры и заставки, включённые в ваш тариф.', single: 'Текущие модель, палитра и заставка включены в ваш тариф.',
    networks: 'Социальные сети', networkCount: 'Выбрано сетей: {count}/{limit}', networkLimit: 'Достигнут лимит социальных сетей. Удалите одну, чтобы заменить её.',
    rightsError: 'Не удалось проверить права тарифа. Существующие сети можно редактировать.', loadingNetworks: 'Проверка доступных сетей…',
  },
};
export function professionalRightsText(language: Language): Copy { return texts[language] ?? fr; }
