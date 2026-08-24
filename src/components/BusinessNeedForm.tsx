import { useEffect, useState } from 'react';
import { X, Send, Loader2, Building2, CheckCircle2, Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GOUVERNORATS_TUNISIE } from '../lib/tunisiaLocations';
import { useLanguage } from '../context/LanguageContext';
import { getBusinessNeedFormTranslations } from '../lib/businessNeedFormTranslations';

interface BusinessNeedFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MatchedCompany {
  id: string;
  nom: string | null;
  slug: string | null;
  ville: string | null;
}

const NEED_TYPE_VALUES = ['supplier_search','service_provider_search','equipment_purchase','equipment_sale','liquidation','partnership','business_opportunity','other'] as const;
const URGENCY_VALUES = ['low','normal','urgent'] as const;

export default function BusinessNeedForm({ isOpen, onClose }: BusinessNeedFormProps) {
  const { language } = useLanguage();
  const t = getBusinessNeedFormTranslations(language);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyResults, setCompanyResults] = useState<MatchedCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<MatchedCompany | null>(null);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [companySearchError, setCompanySearchError] = useState('');
  const [hasSearchedCompany, setHasSearchedCompany] = useState(false);

  const [formData, setFormData] = useState({
    type: '', title: '', description: '', company_name: '', contact_name: '', contact_email: '', contact_phone: '', city: '', governorate: '', category: '', budget_min: '', budget_max: '', deadline: '', urgency: 'normal', zone_intervention: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const query = formData.company_name.trim();
    if (selectedCompany && query !== (selectedCompany.nom || '').trim()) setSelectedCompany(null);
    if (selectedCompany && query === (selectedCompany.nom || '').trim()) {
      setCompanyResults([]); setCompanySearchLoading(false); setCompanySearchError(''); setHasSearchedCompany(false); return;
    }
    if (query.length < 2) {
      setCompanyResults([]); setCompanySearchLoading(false); setCompanySearchError(''); setHasSearchedCompany(false); return;
    }
    let active = true;
    setCompanySearchLoading(true); setCompanySearchError('');
    const timer = window.setTimeout(async () => {
      const { data, error: searchError } = await supabase.from('entreprise').select('id, nom, slug, ville').ilike('nom', `%${query}%`).order('nom', { ascending: true }).limit(6);
      if (!active) return;
      setCompanySearchLoading(false); setHasSearchedCompany(true);
      if (searchError) {
        console.warn('[BusinessNeedForm] Entreprise search failed:', searchError);
        setCompanySearchError(t.searchUnavailable); setCompanyResults([]); return;
      }
      setCompanyResults((data || []) as MatchedCompany[]);
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [formData.company_name, isOpen, selectedCompany, t.searchUnavailable]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCompanySelect = (company: MatchedCompany) => {
    setSelectedCompany(company); setCompanyResults([]); setHasSearchedCompany(false); setCompanySearchError('');
    setFormData(prev => ({ ...prev, company_name: company.nom || prev.company_name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const linkedCompany = selectedCompany && formData.company_name.trim() === (selectedCompany.nom || '').trim() ? selectedCompany : null;
    const payload = {
      type: formData.type, title: formData.title.trim(), description: formData.description.trim(), company_name: formData.company_name.trim(), company_id: linkedCompany?.id || null, company_slug: linkedCompany?.slug || null, company_city: linkedCompany?.ville || null, contact_name: formData.contact_name.trim(), contact_email: formData.contact_email.trim(), contact_phone: formData.contact_phone.trim(), city: formData.city.trim(), governorate: formData.governorate, category: formData.category.trim() || null, budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null, budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null, deadline: formData.deadline || null, urgency: formData.urgency, zone_intervention: formData.zone_intervention.trim() || null, status: 'pending_review' as const, moderation_status: 'pending' as const, visibility: 'private' as const,
    };
    const { error: insertError } = await supabase.from('business_needs').insert([payload]);
    setLoading(false);
    if (insertError) { console.error('BusinessNeedForm insert error:', insertError); setError(t.genericError); return; }
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false); setError(''); setSelectedCompany(null); setCompanyResults([]); setCompanySearchLoading(false); setCompanySearchError(''); setHasSearchedCompany(false);
    setFormData({ type:'', title:'', description:'', company_name:'', contact_name:'', contact_email:'', contact_phone:'', city:'', governorate:'', category:'', budget_min:'', budget_max:'', deadline:'', urgency:'normal', zone_intervention:'' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={success ? undefined : handleClose} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[100000]" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div><h2 className="text-xl font-medium text-gray-900">{t.title}</h2><p className="text-sm text-gray-600 mt-1">{t.subtitle}</p></div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label={t.close}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center"><Send className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-bold text-[#4A1D43] mb-3">{t.successTitle}</h3>
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed">{t.successText}</p>
              <p className="text-xs text-gray-500 mt-3">{t.successHint}</p>
              <button onClick={handleClose} className="mt-8 px-8 py-3 bg-[#4A1D43] text-white rounded-lg hover:bg-[#5A2D53] transition-colors text-sm font-semibold shadow-sm" style={{ border: '1px solid #D4AF37' }}>{t.close}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.type}</label>
                <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none">
                  <option value="">{t.selectType}</option>
                  {NEED_TYPE_VALUES.map(value => <option key={value} value={value}>{t.types[value]}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.needTitle}</label><input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder={t.titlePlaceholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder={t.descriptionPlaceholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none resize-y" /></div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">{t.contactInfo}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.companyName}</label>
                    <div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" /><input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required autoComplete="organization" placeholder={t.companyPlaceholder} className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                    {selectedCompany && <div className="mt-2 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" /><div><p className="font-semibold">{t.selectedCompany}</p><p>{selectedCompany.nom}{selectedCompany.ville ? ` - ${selectedCompany.ville}` : ''}</p></div></div>}
                    {!selectedCompany && companyResults.length > 0 && <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">{companyResults.map(company => <button key={company.id} type="button" onClick={() => handleCompanySelect(company)} className="flex w-full items-start gap-2 border-b border-gray-100 px-3 py-2 text-left text-xs transition hover:bg-[#D4AF37]/10 last:border-b-0"><Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" /><span><span className="block font-semibold text-gray-900">{company.nom}</span>{company.ville && <span className="block text-gray-600">{company.ville}</span>}</span></button>)}</div>}
                    {companySearchLoading && <p className="mt-2 flex items-center gap-2 text-xs text-gray-500"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />{t.searchingCompany}</p>}
                    {!selectedCompany && hasSearchedCompany && !companySearchLoading && companyResults.length === 0 && !companySearchError && <p className="mt-2 text-xs text-gray-500">{t.noCompany}</p>}
                    {companySearchError && <p className="mt-2 text-xs text-amber-700">{companySearchError}</p>}
                  </div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.contactName}</label><input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Email *</label><input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.phone}</label><input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">{t.location}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.governorate}</label><select name="governorate" value={formData.governorate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"><option value="">{t.select}</option>{GOUVERNORATS_TUNISIE.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.city}</label><input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Tunis, Sousse..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">{t.zone}</label><input type="text" name="zone_intervention" value={formData.zone_intervention} onChange={handleChange} placeholder={t.zonePlaceholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">{t.extra}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.category}</label><input type="text" name="category" value={formData.category} onChange={handleChange} placeholder={t.categoryPlaceholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.urgency}</label><select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none">{URGENCY_VALUES.map(value => <option key={value} value={value}>{t.urgencies[value]}</option>)}</select></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.minBudget}</label><input type="number" name="budget_min" value={formData.budget_min} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">{t.maxBudget}</label><input type="number" name="budget_max" value={formData.budget_max} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">{t.deadline}</label><input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" /></div>
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t.cancel}</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A1D43] rounded-lg hover:bg-[#5A2D53] transition-colors disabled:opacity-50 flex items-center gap-2">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{t.submit}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}