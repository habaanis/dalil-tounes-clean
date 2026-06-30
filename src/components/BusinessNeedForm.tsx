import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { notifyAdmin } from '../lib/notifyAdmin';
import { GOUVERNORATS_TUNISIE } from '../lib/tunisiaLocations';

interface BusinessNeedFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEED_TYPES = [
  { value: 'supplier_search', label: 'Recherche fournisseur' },
  { value: 'service_provider_search', label: 'Recherche prestataire' },
  { value: 'equipment_purchase', label: 'Achat de materiel' },
  { value: 'equipment_sale', label: 'Vente de materiel' },
  { value: 'liquidation', label: 'Liquidation de materiel' },
  { value: 'partnership', label: 'Partenariat' },
  { value: 'business_opportunity', label: "Opportunite d'affaires" },
  { value: 'other', label: 'Autre' },
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Faible' },
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
];

export default function BusinessNeedForm({ isOpen, onClose }: BusinessNeedFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    city: '',
    governorate: '',
    category: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    urgency: 'normal',
    zone_intervention: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim(),
      company_name: formData.company_name.trim(),
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim(),
      contact_phone: formData.contact_phone.trim(),
      city: formData.city.trim(),
      governorate: formData.governorate,
      category: formData.category.trim() || null,
      budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
      deadline: formData.deadline || null,
      urgency: formData.urgency,
      zone_intervention: formData.zone_intervention.trim() || null,
      status: 'pending_review' as const,
      moderation_status: 'pending' as const,
      visibility: 'private' as const,
    };

    const { error: insertError } = await supabase
      .from('business_needs')
      .insert([payload]);

    setLoading(false);

    if (insertError) {
      console.error('BusinessNeedForm insert error:', insertError);
      setError(insertError.message || "Une erreur est survenue. Veuillez reessayer.");
      return;
    }

    const typeLabel = NEED_TYPES.find(t => t.value === formData.type)?.label || formData.type;
    notifyAdmin(
      'Nouveau besoin professionnel a valider',
      {
        'Type de besoin': typeLabel,
        'Titre': payload.title,
        'Description': payload.description,
        'Entreprise': payload.company_name,
        'Contact': payload.contact_name,
        'Email': payload.contact_email,
        'Telephone': payload.contact_phone,
        'Ville': payload.city,
        'Gouvernorat': payload.governorate,
        'Budget': payload.budget_min || payload.budget_max
          ? `${payload.budget_min ?? '—'} - ${payload.budget_max ?? '—'} TND`
          : 'Non renseigne',
        'Delai': payload.deadline || 'Non renseigne',
        'Urgence': payload.urgency,
        'Statut': 'pending_review — en attente de validation',
      },
      '/admin/business-needs'
    ).catch(err => console.error('Notification email failed (non-blocking):', err));

    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setFormData({
      type: '', title: '', description: '', company_name: '',
      contact_name: '', contact_email: '', contact_phone: '',
      city: '', governorate: '', category: '', budget_min: '',
      budget_max: '', deadline: '', urgency: 'normal', zone_intervention: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={success ? undefined : handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[100000]"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium text-gray-900">Publier un besoin professionnel</h2>
            <p className="text-sm text-gray-600 mt-1">
              Decrivez votre besoin. Il sera verifie avant publication.
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#4A1D43] mb-3">Besoin envoye avec succes !</h3>
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
                Votre besoin professionnel a bien ete envoye.<br />
                Il sera verifie avant publication.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Vous serez contacte si votre besoin est valide.
              </p>
              <button
                onClick={handleClose}
                className="mt-8 px-8 py-3 bg-[#4A1D43] text-white rounded-lg hover:bg-[#5A2D53] transition-colors text-sm font-semibold shadow-sm"
                style={{ border: '1px solid #D4AF37' }}
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de besoin *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                >
                  <option value="">Selectionnez un type</option>
                  {NEED_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du besoin *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Recherche fournisseur de cartons d'emballage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description detaillee *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Decrivez precisement votre besoin, les quantites, les specifications..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none resize-y"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations de contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom de l'entreprise *</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom du contact *</label>
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Telephone *</label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Localisation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Gouvernorat *</label>
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    >
                      <option value="">Selectionnez</option>
                      {GOUVERNORATS_TUNISIE.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Tunis, Sousse..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Zone d'intervention (optionnel)</label>
                    <input
                      type="text"
                      name="zone_intervention"
                      value={formData.zone_intervention}
                      onChange={handleChange}
                      placeholder="Ex: Grand Tunis, Tout le pays..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Details complementaires (optionnel)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Categorie</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Ex: BTP, Informatique..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Urgence</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    >
                      {URGENCY_OPTIONS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Budget min (TND)</label>
                    <input
                      type="number"
                      name="budget_min"
                      value={formData.budget_min}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Budget max (TND)</label>
                    <input
                      type="number"
                      name="budget_max"
                      value={formData.budget_max}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Delai souhaite</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A1D43] rounded-lg hover:bg-[#5A2D53] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer le besoin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
