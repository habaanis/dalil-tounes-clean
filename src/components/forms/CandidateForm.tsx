import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { notifyAdmin } from '../../lib/notifyAdmin';
import { useLanguage } from '../../context/LanguageContext';
import { useFormTranslation } from '../../hooks/useFormTranslation';

interface CandidateFormProps {
  userId: string;
  onSuccess?: () => void;
}

interface RequestFormData {
  titre: string;
  telephone: string;
  email: string;
  message: string;
}

export default function CandidateForm({ userId, onSuccess }: CandidateFormProps) {
  const { language } = useLanguage();
  const { submission_lang } = useFormTranslation();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<RequestFormData>({
    titre: '',
    telephone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!formData.titre.trim()) {
        setMessage({ type: 'error', text: 'Le titre de votre demande est obligatoire.' });
        setSaving(false);
        return;
      }

      if (!formData.telephone.trim()) {
        setMessage({ type: 'error', text: 'Le téléphone est obligatoire.' });
        setSaving(false);
        return;
      }

      if (!formData.email.trim()) {
        setMessage({ type: 'error', text: 'L’email est obligatoire.' });
        setSaving(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setMessage({ type: 'error', text: 'Format email invalide.' });
        setSaving(false);
        return;
      }

      const payload = {
        nom_complet: formData.titre.trim(),
        prenom: '',
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        adresse: '',
        ville_residence: '',
        category: 'demande_information_inscription',
        diplome: '',
        competences: [],
        annees_experience: 0,
        languages: [],
        contrats_souhaites: [],
        visibility: 'private',
        cv_url: '',
        availability: formData.message.trim(),
        est_premium: false,
        created_by: userId,
        updated_at: new Date().toISOString(),
        submission_lang,
      };

      const { error } = await supabase.from('candidates').upsert(payload);

      if (error) {
        console.error('[CandidateForm] Supabase error:', error);
        setMessage({
          type: 'error',
          text: error.message || 'Une erreur est survenue. Veuillez réessayer.',
        });
        return;
      }

      notifyAdmin('Nouvelle demande candidat', {
        Titre: payload.nom_complet,
        Telephone: payload.telephone,
        Email: payload.email,
        Message: payload.availability,
      }, '/candidats');

      setMessage({
        type: 'success',
        text: 'Merci ! Votre demande a bien été envoyée. Notre équipe vous contactera rapidement.',
      });

      setFormData({
        titre: '',
        telephone: '',
        email: '',
        message: '',
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('[CandidateForm] Unexpected error:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-[#F5F5DC] mb-2">
          Demande d’information / inscription
        </h3>
        <p className="text-sm text-[#E8D5C4] leading-relaxed">
          Remplissez cette demande rapide. Notre équipe vous contactera pour finaliser votre inscription ou répondre à vos questions.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-900/30 border border-green-600 text-green-300'
              : 'bg-red-900/30 border border-red-600 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Titre de votre demande <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.titre}
          onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder="Ex : Candidat emploi, professeur privé, chauffeur privé..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Téléphone <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="tel"
          required
          value={formData.telephone}
          onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder="Votre numéro de téléphone"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Email <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder="Votre adresse email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          Message
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder-gray-500"
          placeholder="Expliquez brièvement votre demande..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-white text-[#4A1D43] rounded-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#D4AF37] font-semibold"
        >
          {saving && (
            <span className="inline-block w-4 h-4 border-2 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />
          )}
          Envoyer ma demande
        </button>
      </div>
    </form>
  );
}
