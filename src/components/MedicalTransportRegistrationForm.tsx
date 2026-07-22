import { useRef, useState } from 'react';
import { Check, Loader, X } from 'lucide-react';
import { Toast } from './Toast';
import { submitLegacySuggestion } from '../lib/businessRegistration';

interface MedicalTransportRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface RequestFormData {
  title: string;
  phone: string;
  email: string;
  message: string;
}

export default function MedicalTransportRegistrationForm({
  onSuccess,
  onCancel,
}: MedicalTransportRegistrationFormProps) {
  const startedAtRef = useRef(Date.now());
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const [formData, setFormData] = useState<RequestFormData>({
    title: '',
    phone: '',
    email: '',
    message: '',
  });

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const validateForm = () => {
    const title = formData.title.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!title) {
      showNotification('Le titre de votre demande est obligatoire.', 'error');
      return false;
    }

    if (!phone && !email) {
      showNotification('Merci d’indiquer au moins un téléphone ou un email.', 'error');
      return false;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Format email invalide.', 'error');
        return false;
      }
    }

    if (!message) {
      showNotification('Merci de décrire brièvement votre demande.', 'error');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      phone: '',
      email: '',
      message: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const title = formData.title.trim();
      const phone = formData.phone.trim();
      const email = formData.email.trim();
      const message = formData.message.trim();

      await submitLegacySuggestion({
        language: 'fr',
        sourcePage: 'medical-transport',
        legacyType: 'medical_transport',
        title,
        phone,
        email,
        message,
        elapsedMs: Date.now() - startedAtRef.current,
      });

      showNotification(
        'Demande envoyée avec succès ! Notre équipe vous contactera rapidement.',
        'success'
      );

      resetForm();
      startedAtRef.current = Date.now();

      setTimeout(() => {
        onSuccess?.();
      }, 1800);
    } catch (err) {
      console.error('[MedicalTransportRegistrationForm] Error:', err);
      showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Demande d’information / inscription
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Une question, une inscription comme prestataire de transport médical ou une demande professionnelle ?
            Envoyez-nous votre demande, notre équipe vous contactera rapidement.
          </p>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 mx-auto max-w-lg">
            <p className="text-sm font-medium text-blue-800">
              Remplissez cette demande rapide. Les informations détaillées seront finalisées avec notre équipe.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Votre demande
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de votre demande *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex : inscription transport médical, ambulance privée, taxi médical..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Merci d’indiquer au moins un moyen de contact : téléphone ou email.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez votre demande, votre activité, votre véhicule, votre zone de service ou votre question..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Envoyer ma demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
