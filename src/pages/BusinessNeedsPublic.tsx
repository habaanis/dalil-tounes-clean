import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Tag, ArrowLeft, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PublicBusinessNeed {
  id: string;
  created_at: string;
  type: string;
  title: string;
  description: string;
  company_name: string;
  city: string;
  governorate: string;
  urgency: string;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  zone_intervention: string | null;
  published_at: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  supplier_search: 'Recherche fournisseur',
  service_provider_search: 'Recherche prestataire',
  equipment_purchase: 'Achat materiel',
  equipment_sale: 'Vente materiel',
  liquidation: 'Liquidation',
  partnership: 'Partenariat',
  business_opportunity: "Opportunite d'affaires",
  other: 'Autre',
};

const URGENCY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Pas urgent', color: '#065F46', bg: '#D1FAE5' },
  medium: { label: 'Moyen', color: '#92400E', bg: '#FEF3C7' },
  high: { label: 'Urgent', color: '#991B1B', bg: '#FEE2E2' },
  critical: { label: 'Tres urgent', color: '#7F1D1D', bg: '#FCA5A5' },
};

export default function BusinessNeedsPublic() {
  const navigate = useNavigate();
  const [needs, setNeeds] = useState<PublicBusinessNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchPublishedNeeds();
  }, []);

  async function fetchPublishedNeeds() {
    setLoading(true);
    const { data, error } = await supabase
      .from('business_needs')
      .select('id, created_at, type, title, description, company_name, city, governorate, urgency, category, budget_min, budget_max, deadline, zone_intervention, published_at')
      .eq('status', 'published')
      .eq('moderation_status', 'approved')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setNeeds(data);
    }
    setLoading(false);
  }

  const filtered = needs.filter((need) => {
    const matchesSearch = !searchTerm ||
      need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || need.type === filterType;
    return matchesSearch && matchesType;
  });

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatBudget(min: number | null, max: number | null) {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} TND`;
    if (min) return `A partir de ${min.toLocaleString()} TND`;
    return `Jusqu'a ${max!.toLocaleString()} TND`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/entreprises')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#4A1D43] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'affaires
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#4A1D43] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A1D43]">Besoins professionnels</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Decouvrez les besoins publies par les entreprises tunisiennes et identifiez de nouvelles opportunites.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un besoin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">Tous les types</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 mb-4">
          {filtered.length} besoin{filtered.length > 1 ? 's' : ''} publie{filtered.length > 1 ? 's' : ''}
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun besoin publie pour le moment.</p>
            <p className="text-gray-400 text-xs mt-1">Revenez bientot pour decouvrir de nouvelles opportunites.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4">
            {filtered.map((need) => {
              const urgencyInfo = URGENCY_LABELS[need.urgency] || URGENCY_LABELS.medium;
              const budget = formatBudget(need.budget_min, need.budget_max);
              return (
                <div key={need.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-semibold text-[#4A1D43] flex-1 min-w-0">{need.title}</h3>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ color: urgencyInfo.color, backgroundColor: urgencyInfo.bg }}
                    >
                      {urgencyInfo.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{need.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {need.company_name}
                    </span>
                    {(need.city || need.governorate) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {[need.city, need.governorate].filter(Boolean).join(', ')}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {TYPE_LABELS[need.type] || need.type}
                    </span>
                    {need.published_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(need.published_at)}
                      </span>
                    )}
                  </div>

                  {(budget || need.deadline || need.zone_intervention) && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
                      {budget && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700">{budget}</span>
                      )}
                      {need.deadline && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                          Echeance: {formatDate(need.deadline)}
                        </span>
                      )}
                      {need.zone_intervention && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-green-50 text-green-700">
                          Zone: {need.zone_intervention}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
