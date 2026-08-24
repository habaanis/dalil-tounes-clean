import { useLanguage } from '../context/LanguageContext';

const copy = {
  fr: { title: 'Suggérer un établissement', intro: "Formulaire de suggestion d'établissement à créer.", name: "Nom de l'établissement *", city: 'Ville *', address: 'Adresse', phone: 'Téléphone', email: 'Email', submit: 'Envoyer la suggestion' },
  en: { title: 'Suggest a business', intro: 'Form to suggest a business to add.', name: 'Business name *', city: 'City *', address: 'Address', phone: 'Phone', email: 'Email', submit: 'Send suggestion' },
  ar: { title: 'اقتراح مؤسسة', intro: 'استمارة لاقتراح مؤسسة لإضافتها.', name: 'اسم المؤسسة *', city: 'المدينة *', address: 'العنوان', phone: 'الهاتف', email: 'البريد الإلكتروني', submit: 'إرسال الاقتراح' },
  it: { title: 'Suggerisci un’attività', intro: 'Modulo per suggerire un’attività da aggiungere.', name: 'Nome dell’attività *', city: 'Città *', address: 'Indirizzo', phone: 'Telefono', email: 'Email', submit: 'Invia il suggerimento' },
  ru: { title: 'Предложить компанию', intro: 'Форма для предложения компании к добавлению.', name: 'Название компании *', city: 'Город *', address: 'Адрес', phone: 'Телефон', email: 'Email', submit: 'Отправить предложение' },
};

export const SuggestBusiness = () => {
  const { language } = useLanguage();
  const t = copy[language] || copy.fr;

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: '#F8F9FA' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#D4AF37] shadow-lg">
          <h1 className="text-2xl md:text-3xl font-light text-[#4A1D43] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.intro}</p>
          <form className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.city}</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.address}</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label><input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label><input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" /></div>
            <button type="submit" className="w-full px-6 py-3 bg-[#4A1D43] text-[#D4AF37] font-bold rounded-xl border border-[#D4AF37] hover:bg-[#5A2D53] transition-all">{t.submit}</button>
          </form>
        </div>
      </div>
    </div>
  );
};