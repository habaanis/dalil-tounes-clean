import { useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, Eye, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BusinessNeed {
  id: string;
  created_at: string;
  type: string;
  title: string;
  description: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  governorate: string;
  urgency: string;
  status: string;
  moderation_status: string;
  moderation_reason: string | null;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  zone_intervention: string | null;
  published_at: string | null;
}

type FilterStatus = 'all' | 'pending_review' | 'published' | 'rejected' | 'closed';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  draft:          { label: 'Brouillon',  color: '#6B7280', bg: '#F3F4F6' },
  pending_review: { label: 'En attente', color: '#92400E', bg: '#FEF3C7' },
  published:      { label: 'Publie',     color: '#065F46', bg: '#D1FAE5' },
  closed:         { label: 'Ferme',      color: '#1E40AF', bg: '#DBEAFE' },
  expired:        { label: 'Expire',     color: '#6B7280', bg: '#F3F4F6' },
  rejected:       { label: 'Refuse',     color: '#991B1B', bg: '#FEE2E2' },
};

const URGENCY_LABELS: Record<string, { label: string; color: string }> = {
  low:    { label: 'Faible',  color: '#6B7280' },
  normal: { label: 'Normal',  color: '#1E40AF' },
  urgent: { label: 'Urgent',  color: '#DC2626' },
};

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

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending_review', label: 'En attente' },
  { value: 'published', label: 'Publies' },
  { value: 'rejected', label: 'Refuses' },
  { value: 'closed', label: 'Fermes' },
];

export default function AdminBusinessNeeds() {
  const [needs, setNeeds] = useState<BusinessNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('pending_review');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<BusinessNeed | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await supabase
      .from('business_needs')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchErr) {
      setError(`Erreur : ${fetchErr.message}`);
      setLoading(false);
      return;
    }

    const rows = (data as BusinessNeed[]) || [];
    console.log('[AdminBusinessNeeds] rows received:', rows.length, rows);
    setNeeds(rows);

    const c: Record<string, number> = { all: rows.length };
    rows.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
    setCounts(c);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const approve = async (id: string) => {
    setActionLoading(id);
    const { error: err } = await supabase
      .from('business_needs')
      .update({
        status: 'published',
        moderation_status: 'approved',
        visibility: 'public',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (err) {
      showToast(`Erreur : ${err.message}`, false);
    } else {
      showToast('Le besoin professionnel a ete valide.');
      fetchAll();
    }
    setActionLoading(null);
  };

  const reject = async () => {
    if (!rejectId) return;
    setActionLoading(rejectId);
    const { error: err } = await supabase
      .from('business_needs')
      .update({
        status: 'rejected',
        moderation_status: 'rejected',
        moderation_reason: rejectReason.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rejectId);

    if (err) {
      showToast(`Erreur : ${err.message}`, false);
    } else {
      showToast('Le besoin professionnel a ete refuse.');
      fetchAll();
    }
    setActionLoading(null);
    setRejectId(null);
    setRejectReason('');
  };

  const filtered = filter === 'all' ? needs : needs.filter(n => n.status === filter);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#4A1D43] flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Besoins professionnels
            </h1>
            <p className="text-sm text-gray-600 mt-1">{needs.length} besoin(s) au total</p>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-[#4A1D43] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({counts[tab.value] || 0})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-gray-600">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Aucun besoin dans cette categorie.</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Entreprise</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ville</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Urgence</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(need => {
                    const st = STATUS_LABELS[need.status] || STATUS_LABELS.draft;
                    const urg = URGENCY_LABELS[need.urgency] || URGENCY_LABELS.normal;
                    return (
                      <tr key={need.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatDate(need.created_at)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[140px] truncate">{need.company_name}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{need.contact_name}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{TYPE_LABELS[need.type] || need.type}</td>
                        <td className="px-4 py-3 text-gray-900 max-w-[180px] truncate">{need.title}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{need.city}, {need.governorate}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium" style={{ color: urg.color }}>{urg.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ color: st.color, backgroundColor: st.bg }}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDetailItem(need)}
                              className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Voir le detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {need.status === 'pending_review' && (
                              <>
                                <button
                                  onClick={() => approve(need.id)}
                                  disabled={actionLoading === need.id}
                                  className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
                                  title="Valider"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setRejectId(need.id)}
                                  disabled={actionLoading === need.id}
                                  className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                                  title="Refuser"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative z-[100000] p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-[#4A1D43]">Detail du besoin</h3>
              <button onClick={() => setDetailItem(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="Titre" value={detailItem.title} />
              <Row label="Type" value={TYPE_LABELS[detailItem.type] || detailItem.type} />
              <Row label="Description" value={detailItem.description} multiline />
              <div className="border-t pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</p>
                <Row label="Entreprise" value={detailItem.company_name} />
                <Row label="Contact" value={detailItem.contact_name} />
                <Row label="Email" value={detailItem.contact_email} />
                <Row label="Telephone" value={detailItem.contact_phone} />
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Localisation</p>
                <Row label="Ville" value={detailItem.city} />
                <Row label="Gouvernorat" value={detailItem.governorate} />
                {detailItem.zone_intervention && <Row label="Zone" value={detailItem.zone_intervention} />}
              </div>
              {(detailItem.budget_min || detailItem.budget_max || detailItem.deadline) && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Details</p>
                  {detailItem.budget_min && <Row label="Budget min" value={`${detailItem.budget_min} TND`} />}
                  {detailItem.budget_max && <Row label="Budget max" value={`${detailItem.budget_max} TND`} />}
                  {detailItem.deadline && <Row label="Delai" value={detailItem.deadline} />}
                  {detailItem.category && <Row label="Categorie" value={detailItem.category} />}
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <Row label="Date d'envoi" value={formatDate(detailItem.created_at)} />
                <Row label="Statut" value={STATUS_LABELS[detailItem.status]?.label || detailItem.status} />
                {detailItem.moderation_reason && <Row label="Raison refus" value={detailItem.moderation_reason} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={() => { setRejectId(null); setRejectReason(''); }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full relative z-[100000] p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#4A1D43] mb-3">Refuser le besoin</h3>
            <p className="text-sm text-gray-600 mb-4">Indiquez une raison (optionnel) :</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Raison du refus..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none resize-y mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectId(null); setRejectReason(''); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={reject}
                disabled={actionLoading === rejectId}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100001] px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 font-medium min-w-[100px] flex-shrink-0">{label} :</span>
      <span className={`text-gray-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</span>
    </div>
  );
}
