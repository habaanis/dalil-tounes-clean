import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';

export const SuggestBusiness = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#D4AF37] shadow-lg">
          <h1 className="text-2xl md:text-3xl font-light text-[#4A1D43] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Suggérer un établissement
          </h1>
          <p className="text-gray-600 mb-6">
            Formulaire de suggestion d'établissement à créer.
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#4A1D43] text-[#D4AF37] font-bold rounded-xl border border-[#D4AF37] hover:bg-[#5A2D53] transition-all"
            >
              Envoyer la suggestion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};