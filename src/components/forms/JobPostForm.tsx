import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { notifyAdmin } from '../../lib/notifyAdmin';
import { useLanguage } from '../../context/LanguageContext';
import { useFormTranslation } from '../../hooks/useFormTranslation';

interface JobPostFormProps {
  userId: string;
  jobId?: string;
  onSuccess?: () => void;
}

interface SimpleRequestData {
  titre: string;
  telephone: string;
  email: string;
  message: string;
}

export default function JobPostForm({ userId, onSuccess }: JobPostFormProps) {
  const { language } = useLanguage();
  const { submission_lang } = useFormTranslation();

  const [saving, setSaving] = useState(false);
  const [messageState, setMessageState] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState<SimpleRequestData>({
    titre: '',
    telephone: '',
    email: '',
    message: '',
  });

  const resetForm = () => {
    setFormData({
      titre: '',
      telephone: '',
      email: '',
      message: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessageState(null);

    try {
      const titre = formData.titre.trim();
      const telephone = formData.telephone.trim();
      const email = formData.email.trim();
      const message = formData.message.trim();

      if (!titre) {
        setMessageState({
          type: 'error',
          text: 'Le titre de votre demande est obligatoire.',
        });
        setSaving(false);
        return;
      }

      if (!telephone && !email) {
        setMessageState({
          type: 'error',
          text: 'Merci d’indiquer au moins un téléphone ou un email.',
        });
        setSaving(false);
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setMessageState({
            type: 'error',
            text: 'Format email invalide.',
          });
          setSaving(false);
          return;
        }
      }

      const payload = {
        nom_entreprise: titre,
        secteur: 'Demande emploi / recrutement',
        ville: null,
        contact_suggere: `${telephone || ''}${telephone && email ? ' - ' : ''}${email || ''}`.trim(),
        raison_suggestion: `Demande d’information / inscription\n\n${message || 'Aucun message complémentaire.'}`,
        submission_lang,
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.error('❌ ERREUR Supabase:', error);
        setMessageState({
          type: 'error',
          text: `Erreur lors de l’envoi : ${error.message}`,
        });
        return;
      }

      notifyAdmin('Nouvelle demande emploi / recrutement', {
        Titre: titre,
        Telephone: telephone || 'Non renseigné',
        Email: email || 'Non renseigné',
        Message: message || 'Non renseigné',
        Langue: language,
        UserId: userId || 'Non connecté',
      }, '/admin/sourcing');

      setMessageState({
        type: 'success',
        text: 'Votre demande a été envoyée avec succès. Nous vous contacterons rapidement.',
      });

      setShowSuccessToast(true);
      resetForm();

      setTimeout(() => setShowSuccessToast(false), 5000);

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      console.error('❌ ERREUR INATTENDUE:', err);
      setMessageState({
        type: 'error',
        text: `Une erreur est survenue : ${err.message || 'veuillez réessayer.'}`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toast de succès en vert */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px] border-2 border-green-400">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-lg">Demande envoyée avec succès !</p>
              <p className="text-sm text-green-100">Nous vous contacterons rapidement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {messageState && (
        <div
          className={
            messageState.type === 'success'
              ? 'bg-green-900/30 border border-green-600 text-green-300 p-3 rounded-md mb-4'
              : 'bg-red-900/30 border border-red-600 text-red-300 p-3 rounded-md mb-4'
          }
        >
          {messageState.text}
        </div>
      )}

      <div className="bg-[#4A1D43]/20 border-2 border-[#D4AF37] rounded-lg p-4">
        <h3 className="text-lg font-semibold text-[#F5F5DC] mb-2">
          Demande d’information / inscription
        </h3>
        <p className="text-sm text-[#E8D5C4]">
          Envoyez-nous votre demande. Notre équipe vous contactera pour finaliser les informations.
        </p>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Titre de votre demande <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="text"
          value={formData.titre}
          onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder-gray-500"
          placeholder="Ex : Publier une offre d’emploi, recruter un candidat, demande de partenariat..."
          required
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder-gray-500"
          placeholder="Votre numéro de téléphone"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder-gray-500"
          placeholder="Votre adresse email"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] min-h-[150px] placeholder-gray-500"
          placeholder="Expliquez brièvement votre demande..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-white text-[#4A1D43] rounded-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#D4AF37] font-semibold transition-all"
        >
          {saving && <span className="inline-block w-4 h-4 border-2 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />}
          Envoyer ma demande
        </button>
      </div>
    </form>
  );
}
