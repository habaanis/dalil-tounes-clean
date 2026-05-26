import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';
import {
  Ambulance,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface FormData {
  title: string;
  email: string;
  phone: string;
  message: string;
}

export default function TransportInscription() {
  const [form, setForm] = useState<FormData>({
    title: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      setErrorMsg('Le titre de votre demande est obligatoire');
      return false;
    }

    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMsg('Veuillez indiquer au moins un téléphone ou un email');
      return false;
    }

    if (form.email.trim() && !form.email.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse email valide');
      return false;
    }

    if (!form.message.trim()) {
      setErrorMsg('Merci de décrire brièvement votre demande');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nom_entreprise: form.title.trim(),
        secteur: 'Transport médical / demande d’information',
        ville: null,
        contact_suggere: `${form.phone.trim() || ''}${form.phone.trim() && form.email.trim() ? ' - ' : ''}${form.email.trim() || ''}`.trim(),
        raison_suggestion: `Demande d’information / inscription\n\n${form.message.trim()}`,
        submission_lang: 'fr',
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.error('Supabase error:', error);
        setErrorMsg('Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
      } else {
        setSuccess(true);

        notifyAdmin('Nouvelle demande transport médical', {
          Titre: form.title,
          Email: form.email || 'Non renseigné',
          Telephone: form.phone || 'Non renseigné',
          Message: form.message,
        });

        setForm({
          title: '',
          email: '',
          phone: '',
          message: '',
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white border border-green-200 rounded-3xl p-8 md:p-12 shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Demande envoyée !
            </h1>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                Merci, votre demande a bien été transmise à notre équipe.
              </p>
              <p className="text-sm text-gray-600">
                Nous vous contacterons rapidement pour finaliser les informations nécessaires.
              </p>
            </div>

            <button
              onClick={() => setSuccess(false)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Ambulance className="w-5 h-5" />
              Nouvelle demande
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Ambulance className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-4">
            Demande d’information / inscription
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une inscription ou une demande professionnelle ?
            Envoyez-nous votre demande, notre équipe vous contactera rapidement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                Vos coordonnées
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de votre demande <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ex : Inscription transport médical, demande d'information, partenariat..."
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+216 XX XXX XXX"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Indiquez au moins un moyen de contact : téléphone ou email.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                Description de votre demande
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Décrivez votre demande, votre activité, votre besoin ou votre question..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errorMsg}</p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Ambulance className="w-5 h-5" />
                    Envoyer ma demande
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Votre demande sera examinée par l’équipe Dalil Tounes. Nous vous contacterons rapidement.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

