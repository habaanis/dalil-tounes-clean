import { useState } from 'react';
import { Bell, Mail, MapPin, Tag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { useLanguage } from '../context/LanguageContext';
import CityAutocomplete from './CityAutocomplete';

const copy = {
  fr: {
    title: 'Créer une alerte',
    subtitle: 'Soyez notifié des nouvelles annonces qui vous intéressent',
    emailLabel: 'Email *',
    emailPlaceholder: 'votre@email.com',
    keywordLabel: 'Mot-clé',
    keywordPlaceholder: 'Ex: iPhone, appartement...',
    cityLabel: 'Ville',
    cityPlaceholder: 'Sélectionnez une ville',
    categoryLabel: 'Catégorie',
    allCategories: 'Toutes les catégories',
    typeLabel: 'Type d'annonce',
    allTypes: 'Tous les types',
    sell: 'À vendre',
    buy: 'Recherche',
    exchange: 'Échange',
    submit: 'Créer l'alerte',
    creating: 'Création...',
    hint: '💡 Vous recevrez un email à chaque nouvelle annonce correspondant à vos critères',
    errorEmail: 'Veuillez entrer votre email',
    errorCriteria: 'Veuillez renseigner au moins un critère de recherche',
    errorEmailInvalid: 'Email invalide',
    success: 'Alerte créée avec succès ! Vous serez notifié par email.',
    errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
    categories: [
      { value: 'Véhicules', label: 'Véhicules' },
      { value: 'Maison & Jardin', label: 'Maison & Jardin' },
      { value: 'Électronique', label: 'Électronique' },
      { value: 'Immobilier', label: 'Immobilier' },
      { value: 'Sport & Loisirs', label: 'Sport & Loisirs' },
      { value: 'Vêtements', label: 'Vêtements' },
      { value: 'Services', label: 'Services' },
    ],
  },
  en: {
    title: 'Create an alert',
    subtitle: 'Get notified about new ads that interest you',
    emailLabel: 'Email *',
    emailPlaceholder: 'your@email.com',
    keywordLabel: 'Keyword',
    keywordPlaceholder: 'e.g. iPhone, apartment...',
    cityLabel: 'City',
    cityPlaceholder: 'Select a city',
    categoryLabel: 'Category',
    allCategories: 'All categories',
    typeLabel: 'Ad type',
    allTypes: 'All types',
    sell: 'For sale',
    buy: 'Looking for',
    exchange: 'Exchange',
    submit: 'Create alert',
    creating: 'Creating...',
    hint: '💡 You will receive an email for each new ad matching your criteria',
    errorEmail: 'Please enter your email',
    errorCriteria: 'Please provide at least one search criterion',
    errorEmailInvalid: 'Invalid email',
    success: 'Alert created successfully! You will be notified by email.',
    errorOccurred: 'An error occurred. Please try again.',
    categories: [
      { value: 'Véhicules', label: 'Vehicles' },
      { value: 'Maison & Jardin', label: 'House & Garden' },
      { value: 'Électronique', label: 'Electronics' },
      { value: 'Immobilier', label: 'Real Estate' },
      { value: 'Sport & Loisirs', label: 'Sports & Leisure' },
      { value: 'Vêtements', label: 'Clothing' },
      { value: 'Services', label: 'Services' },
    ],
  },
  ar: {
    title: 'إنشاء تنبيه',
    subtitle: 'كن على اطلاع بالإعلانات الجديدة التي تهمك',
    emailLabel: 'البريد الإلكتروني *',
    emailPlaceholder: 'your@email.com',
    keywordLabel: 'كلمة مفتاحية',
    keywordPlaceholder: 'مثال: آيفون، شقة...',
    cityLabel: 'المدينة',
    cityPlaceholder: 'اختر مدينة',
    categoryLabel: 'الفئة',
    allCategories: 'جميع الفئات',
    typeLabel: 'نوع الإعلان',
    allTypes: 'جميع الأنواع',
    sell: 'للبيع',
    buy: 'أبحث عن',
    exchange: 'تبادل',
    submit: 'إنشاء التنبيه',
    creating: 'جاري الإنشاء...',
    hint: '💡 ستتلقى رسالة بريد إلكتروني لكل إعلان جديد يطابق معاييرك',
    errorEmail: 'يرجى إدخال بريدك الإلكتروني',
    errorCriteria: 'يرجى تقديم معيار بحث واحد على الأقل',
    errorEmailInvalid: 'بريد إلكتروني غير صالح',
    success: 'تم إنشاء التنبيه بنجاح! سيتم إشعارك عبر البريد الإلكتروني.',
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    categories: [
      { value: 'Véhicules', label: 'المركبات' },
      { value: 'Maison & Jardin', label: 'المنزل والحديقة' },
      { value: 'Électronique', label: 'الإلكترونيات' },
      { value: 'Immobilier', label: 'العقارات' },
      { value: 'Sport & Loisirs', label: 'الرياضة والترفيه' },
      { value: 'Vêtements', label: 'الملابس' },
      { value: 'Services', label: 'الخدمات' },
    ],
  },
  it: {
    title: 'Crea un avviso',
    subtitle: 'Ricevi notifiche sui nuovi annunci che ti interessano',
    emailLabel: 'Email *',
    emailPlaceholder: 'your@email.com',
    keywordLabel: 'Parola chiave',
    keywordPlaceholder: 'es. iPhone, appartamento...',
    cityLabel: 'Città',
    cityPlaceholder: 'Seleziona una città',
    categoryLabel: 'Categoria',
    allCategories: 'Tutte le categorie',
    typeLabel: 'Tipo di annuncio',
    allTypes: 'Tutti i tipi',
    sell: 'In vendita',
    buy: 'Cerco',
    exchange: 'Scambio',
    submit: 'Crea avviso',
    creating: 'Creazione...',
    hint: '💡 Riceverai un'email per ogni nuovo annuncio che corrisponde ai tuoi criteri',
    errorEmail: 'Inserisci la tua email',
    errorCriteria: 'Fornisci almeno un criterio di ricerca',
    errorEmailInvalid: 'Email non valida',
    success: 'Avviso creato con successo! Riceverai notifiche via email.',
    errorOccurred: 'Si è verificato un errore. Riprova.',
    categories: [
      { value: 'Véhicules', label: 'Veicoli' },
      { value: 'Maison & Jardin', label: 'Casa e Giardino' },
      { value: 'Électronique', label: 'Elettronica' },
      { value: 'Immobilier', label: 'Immobiliare' },
      { value: 'Sport & Loisirs', label: 'Sport e Tempo Libero' },
      { value: 'Vêtements', label: 'Abbigliamento' },
      { value: 'Services', label: 'Servizi' },
    ],
  },
  ru: {
    title: 'Создать оповещение',
    subtitle: 'Получайте уведомления о новых объявлениях, которые вас интересуют',
    emailLabel: 'Email *',
    emailPlaceholder: 'your@email.com',
    keywordLabel: 'Ключевое слово',
    keywordPlaceholder: 'напр. iPhone, квартира...',
    cityLabel: 'Город',
    cityPlaceholder: 'Выберите город',
    categoryLabel: 'Категория',
    allCategories: 'Все категории',
    typeLabel: 'Тип объявления',
    allTypes: 'Все типы',
    sell: 'Продается',
    buy: 'Ищу',
    exchange: 'Обмен',
    submit: 'Создать оповещение',
    creating: 'Создание...',
    hint: '💡 Вы будете получать email за каждое новое объявление, соответствующее вашим критериям',
    errorEmail: 'Пожалуйста, введите ваш email',
    errorCriteria: 'Укажите хотя бы один критерий поиска',
    errorEmailInvalid: 'Неверный email',
    success: 'Оповещение успешно создано! Вы будете уведомлены по email.',
    errorOccurred: 'Произошла ошибка. Попробуйте снова.',
    categories: [
      { value: 'Véhicules', label: 'Транспорт' },
      { value: 'Maison & Jardin', label: 'Дом и сад' },
      { value: 'Électronique', label: 'Электроника' },
      { value: 'Immobilier', label: 'Недвижимость' },
      { value: 'Sport & Loisirs', label: 'Спорт и досуг' },
      { value: 'Vêtements', label: 'Одежда' },
      { value: 'Services', label: 'Услуги' },
    ],
  },
};

type Lang = keyof typeof copy;

export default function AlerteRechercheForm() {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    user_email: '',
    mot_cle: '',
    ville: '',
    categorie: '',
    type_annonce: ''
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_email) {
      showToastMessage('error', t.errorEmail);
      return;
    }

    if (!formData.mot_cle && !formData.ville && !formData.categorie) {
      showToastMessage('error', t.errorCriteria);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
      showToastMessage('error', t.errorEmailInvalid);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('alertes_recherche')
        .insert([{
          user_email: formData.user_email,
          mot_cle: formData.mot_cle || null,
          ville: formData.ville || null,
          categorie: formData.categorie || null,
          type_annonce: formData.type_annonce || null,
          actif: true
        }]);

      if (error) throw error;

      showToastMessage('success', t.success);

      setFormData({
        user_email: '',
        mot_cle: '',
        ville: '',
        categorie: '',
        type_annonce: ''
      });
    } catch (error: any) {
      console.error('Erreur création alerte:', error);
      showToastMessage('error', t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl border-2 border-blue-200 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                {t.emailLabel}
              </label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.keywordLabel}
              </label>
              <input
                type="text"
                value={formData.mot_cle}
                onChange={(e) => setFormData({ ...formData, mot_cle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder={t.keywordPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t.cityLabel}
              </label>
              <CityAutocomplete
                value={formData.ville}
                onChange={(city) => setFormData({ ...formData, ville: city })}
                placeholder={t.cityPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                {t.categoryLabel}
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">{t.allCategories}</option>
                {t.categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.typeLabel}
              </label>
              <select
                value={formData.type_annonce}
                onChange={(e) => setFormData({ ...formData, type_annonce: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">{t.allTypes}</option>
                <option value="sell">{t.sell}</option>
                <option value="buy">{t.buy}</option>
                <option value="exchange">{t.exchange}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.creating}
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    {t.submit}
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t.hint}
          </p>
        </form>
      </div>

      {showToast && (
        <div className={`fixed ${isRTL ? 'left-8' : 'right-8'} bottom-8 z-[100] animate-slide-up`}>
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
              toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
