import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { notifyAdmin } from '../lib/notifyAdmin';
import { useFormTranslation } from '../hooks/useFormTranslation';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';

export const SuggestBusiness = () => {
  const navigate = useNavigate();
  const { label, placeholder, button, message, submission_lang } = useFormTranslation();
  const { getCategory } = useCategoryTranslation();

  const [formData, setFormData] = useState({
    nomEntreprise: '',
    secteur: '',
    ville: '',
    contactSuggere: '',
    contactSuggere2: '',
    emailSuggesteur: '',
    emailSuggesteur2: '',
    raisonSuggestion: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = (value: string) => value.replace(/[\s\-().]/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.nomEntreprise.trim() || !formData.secteur.trim()) {
        setError('Veuillez remplir les champs obligatoires (nom et secteur).');
        setIsSubmitting(false);
        return;
      }

      if (formData.emailSuggesteur) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emailSuggesteur.trim())) {
          setError('L\'adresse email n\'est pas valide.');
          setIsSubmitting(false);
          return;
        }
      }

      const suggestionData = {
        nom_entreprise: formData.nomEntreprise.trim(),
        secteur: formData.secteur.trim(),
        ville: formData.ville.trim() || null,
        contact_suggere: [
          formData.contactSuggere.trim() ? `${formData.contactSuggere.trim()} (clean: ${cleanPhone(formData.contactSuggere)})` : '',
          formData.contactSuggere2.trim() ? `${formData.contactSuggere2.trim()} (clean: ${cleanPhone(formData.contactSuggere2)})` : '',
        ].filter(Boolean).join(' / ') || null,
        email_suggesteur: formData.emailSuggesteur.trim() || null,
        raison_suggestion: formData.raisonSuggestion.trim() || null,
        type_demande: 'suggestion',
        submission_lang,
      };

      const { error: insertError } = await supabase
        .from('suggestions_entreprises')
        .insert([suggestionData]);

      if (insertError) {
        setError('Une erreur est survenue. Veuillez reessayer.');
        setIsSubmitting(false);
        return;
      }

      notifyAdmin('Nouvelle suggestion d\'etablissement', {
        Entreprise: formData.nomEntreprise,
        Secteur: formData.secteur,
        Ville: formData.ville || 'Non precise',
        Contact: formData.contactSuggere || 'Non precise',
        Email: formData.emailSuggesteur || 'Non precise',
        Raison: formData.raisonSuggestion || 'Non precise',
      });

      setIsSuccess(true);
    } catch {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-20 px-4" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl p-10 border border-green-200 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Merci pour votre suggestion !</h2>
            <p className="text-gray-600 mb-8">Votre suggestion a ete envoyee avec succes. Notre equipe la traitera dans les plus brefs delais.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#4A1D43] text-[#D4AF37] font-semibold rounded-xl border border-[#D4AF37] hover:bg-[#5A2D53] transition-all"
            >
              Retour a l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="bg-white rounded-2xl p-8 border border-[#D4AF37] shadow-lg">
          <h1 className="text-2xl md:text-3xl font-light text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Suggerer un etablissement
          </h1>
          <p className="text-gray-600 mb-8">
            Aidez-nous a enrichir l'annuaire en suggerant un etablissement que vous connaissez.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label('nom')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomEntreprise"
                  value={formData.nomEntreprise}
                  onChange={handleChange}
                  required
                  placeholder={placeholder('nom')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label('categorie')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                >
                  <option value="">{placeholder('categorie')}</option>
                  <option value="restauration">{getCategory('restaurant')}</option>
                  <option value="commerce">{getCategory('pret_a_porter')}</option>
                  <option value="services">{getCategory('services_aux_entreprises')}</option>
                  <option value="sante">{getCategory('centre_medical')}</option>
                  <option value="education">{getCategory('ecole_privee')}</option>
                  <option value="immobilier">{getCategory('services_aux_entreprises')}</option>
                  <option value="construction">{getCategory('btp_construction')}</option>
                  <option value="technologie">{getCategory('informatique_telecom')}</option>
                  <option value="tourisme">{getCategory('autre_activite_pro')}</option>
                  <option value="transport">{getCategory('transport_logistique')}</option>
                  <option value="autre">{getCategory('autre_activite_pro')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label('ville')}
              </label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                placeholder={placeholder('ville')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label('telephone')}
                </label>
                <input
                  type="text"
                  name="contactSuggere"
                  value={formData.contactSuggere}
                  onChange={handleChange}
                  placeholder={placeholder('telephone')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Telephone 2 (optionnel)
                </label>
                <input
                  type="text"
                  name="contactSuggere2"
                  value={formData.contactSuggere2}
                  onChange={handleChange}
                  placeholder={placeholder('telephone')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label('email')}
                </label>
                <input
                  type="email"
                  name="emailSuggesteur"
                  value={formData.emailSuggesteur}
                  onChange={handleChange}
                  placeholder={placeholder('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email 2 (optionnel)
                </label>
                <input
                  type="email"
                  name="emailSuggesteur2"
                  value={formData.emailSuggesteur2}
                  onChange={handleChange}
                  placeholder={placeholder('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pourquoi recommandez-vous cet etablissement ?
              </label>
              <textarea
                name="raisonSuggestion"
                value={formData.raisonSuggestion}
                onChange={handleChange}
                rows={3}
                placeholder="Decrivez brievement pourquoi vous recommandez cet etablissement..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-[#4A1D43] text-[#D4AF37] font-semibold rounded-xl border border-[#D4AF37] hover:bg-[#5A2D53] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer la suggestion</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
