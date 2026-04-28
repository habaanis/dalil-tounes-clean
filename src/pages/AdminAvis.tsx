import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, X, Clock, Star, RefreshCw, ChevronDown } from 'lucide-react';

interface Avis {
  id: string;
  entreprise_id: string;
  note: number;
  commentaire: string;
  auteur: string;
  auteur_email: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  submission_lang: string;
  entreprise?: { nom?: string; name?: string };
}

type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'En attente', color: '#92400E', bg: '#FEF3C7' },
  approved: { label: 'Approuvé',   color: '#065F46', bg: '#D1FAE5' },
  rejected: { label: 'Rejeté',     color: '#991B1B', bg: '#FEE2E2' },
};

export default function AdminAvis() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCounts = useCallback(async () => {
    const { data } = await supabase
      .from('avis_entreprise')
      .select('status');
    if (data) {
      const c = { pending: 0, approved: 0, rejected: 0 };
      data.forEach((r: { status: string }) => {
        if (r.status in c) c[r.status as keyof typeof c]++;
      });
      setCounts(c);
    }
  }, []);

  const fetchAvis = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('avis_entreprise')
      .select('*')
      .order('date', { ascending: false })
      .limit(100);

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (error) {
      showToast('Erreur de chargement', false);
    } else {
      setAvis((data as Avis[]) || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchAvis();
    fetchCounts();
  }, [fetchAvis, fetchCounts]);

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(id);
    const { error } = await supabase
      .from('avis_entreprise')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      showToast('Erreur lors de la mise à jour', false);
    } else {
      showToast(newStatus === 'approved' ? 'Avis approuvé et publié' : 'Avis rejeté');
      setAvis(prev => prev.filter(a => a.id !== id));
      fetchCounts();
    }
    setActionLoading(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const StarRow = ({ note }: { note: number }) => (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className="w-3.5 h-3.5" style={{ fill: s <= note ? '#D4AF37' : '#E5E7EB', color: s <= note ? '#D4AF37' : '#D1D5DB' }} />
      ))}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Modération des avis</h1>
            <p className="text-sm text-gray-500 mt-0.5">Validez ou rejetez les avis avant publication</p>
          </div>
          <button
            onClick={() => { fetchAvis(); fetchCounts(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Compteurs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                filter === s ? 'border-[#D4AF37] shadow-md' : 'border-transparent bg-white hover:border-gray-200'
              }`}
              style={{ background: filter === s ? STATUS_LABELS[s].bg : '#fff' }}
            >
              <p className="text-2xl font-bold" style={{ color: STATUS_LABELS[s].color }}>{counts[s]}</p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{STATUS_LABELS[s].label}</p>
            </button>
          ))}
        </div>

        {/* Filtre rapide */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Filtrer :</span>
          {(['pending', 'approved', 'rejected', 'all'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Tous' : STATUS_LABELS[s].label}
            </button>
          ))}
        </div>

        {/* Liste des avis */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : avis.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucun avis dans cette catégorie</p>
            <p className="text-gray-400 text-sm mt-1">Les nouveaux avis apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-3">
            {avis.map(a => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Infos avis */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <StarRow note={a.note} />
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: STATUS_LABELS[a.status].bg, color: STATUS_LABELS[a.status].color }}
                      >
                        {STATUS_LABELS[a.status].label}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(a.date)}</span>
                      {a.submission_lang && (
                        <span className="text-xs text-gray-400 uppercase">{a.submission_lang}</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-800 leading-relaxed mb-2">
                      {a.commentaire || <em className="text-gray-400">Aucun commentaire</em>}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="font-medium text-gray-700">
                        {a.auteur || 'Anonyme'}
                      </span>
                      {a.auteur_email && (
                        <a href={`mailto:${a.auteur_email}`} className="text-blue-500 hover:underline">
                          {a.auteur_email}
                        </a>
                      )}
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400 font-mono text-[11px]">
                        Entreprise : {a.entreprise_id}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {a.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateStatus(a.id, 'approved')}
                        disabled={actionLoading === a.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        title="Approuver et publier"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Valider
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'rejected')}
                        disabled={actionLoading === a.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        title="Rejeter"
                      >
                        <X className="w-3.5 h-3.5" />
                        Rejeter
                      </button>
                    </div>
                  )}

                  {a.status === 'approved' && (
                    <button
                      onClick={() => updateStatus(a.id, 'rejected')}
                      disabled={actionLoading === a.id}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Retirer
                    </button>
                  )}

                  {a.status === 'rejected' && (
                    <button
                      onClick={() => updateStatus(a.id, 'approved')}
                      disabled={actionLoading === a.id}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Réapprouver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
