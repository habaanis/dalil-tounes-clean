import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';

export const EducationEventForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    phone: '',
    email: '',
    message: '',
  });

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSubmitError(true);
      return false;
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setSubmitError(true);
      return false;
    }

    if (!formData.message.trim()) {
      setSubmitError(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitSuccess(false);
    setSubmitError(false);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nom_entreprise: formData.title,
        secteur: 'Événement / Éducation / Loisirs',
        ville: null,
        contact_suggere: `${formData.phone}${formData.phone && formData.email ? ' - ' : ''}${formData.email}`,
        raison_suggestion: formData.message,
        submission_lang: 'fr',
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.warn('⚠️ Cannot submit request:', error.message);
        setSubmitError(true);
        setSubmitting(false);
        return;
      }

      notifyAdmin('Nouvelle demande evenement / education', {
        Titre: formData.title,
        Telephone: formData.phone,
        Email: formData.email,
        Message: formData.message,
      });

      setSubmitSuccess(true);

      setFormData({
        title: '',
        phone: '',
        email: '',
        message: '',
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error submitting request:', err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-3xl font-light text-gray-900 mb-3">
              Demande d’information / inscription
            </h1>

            <p className="text-gray-600">
              Une question, un événement ou une demande professionnelle ?
              Envoyez-nous votre demande et notre équipe vous contactera rapidement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de votre demande *
              </label>

              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex : Organisation d’un événement scolaire, partenariat, sortie éducative..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre.email@exemple.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre demande *
              </label>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />

                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre événement, votre besoin, votre question ou votre demande..."
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Merci d’indiquer au moins un moyen de contact : téléphone ou email.
            </p>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Demande envoyée avec succès !
                  </p>

                  <p className="text-sm mt-1">
                    Notre équipe vous contactera rapidement.
                  </p>
                </div>
              </motion.div>
            )}

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />

                <div>
                  <p className="font-medium">
                    Une erreur est survenue
                  </p>

                  <p className="text-sm mt-1">
                    Vérifiez les informations puis réessayez.
                  </p>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer ma demande'
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationEventForm;
