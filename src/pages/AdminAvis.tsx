import { useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, Star, RefreshCw, AlertTriangle, Database } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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
}

type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'En attente', color: '#92400E', bg: '#FEF3C7' },
  approved: { label: 'Approuvé',   color: '#065F46', bg: '#D1FAE5' },
  rejected: { label: 'Rejeté',     color: '#991B1B', bg: '#FEE2E2' },
};

export default function AdminAvis() {
  const [allAvis, setAllAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [rpcError, setRpcError] = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setRpcError(null);

    const { data, error } = await supabase.rpc('admin_get_all_avis');
    if (error) {
      console.error('[AdminAvis] RPC error:', error);
      setRpcError(`Erreur : ${error.message}`);
      setLoading(false);
      return;
    }
    const rows = (data as Avis[]) || [];
    setAllAvis(rows);
    setLastRefresh(new Date());
    const c = { pending: 0, approved: 0, rejected: 0, total: rows.length };
    rows.forEach(r => {
      if (r.status in c) c[r.status as 'pending' | 'approved' | 'rejected']++;
    });
    setCounts(c);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(id);

    const { error } = await supabase.rpc('admin_update_avis_status', {
      avis_id: id,
      new_status: newStatus,
    });
    if (error) {
      console.error('[AdminAvis] Update error:', error);
      showToast(`Erreur : ${error.message}`, false);
      setActionLoading(null);
      return;
    }
    {
      const label = newStatus === 'approved' ? 'Avis approuvé et publié' : 'Avis rejeté';
      showToast(label);
      // Mise à jour locale immédiate (sans re-fetch)
      setAllAvis(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
      setCounts(prev => {
        const next = { ...prev };
        const old = allAvis.find(a => a.id === id)?.status;
        if (old && old in next) next[old as 'pending' | 'approved' | 'rejected']--;
        next[newStatus]++;
        return next;
      });
    }
    setActionLoading(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const filtered = filter === 'all' ? allAvis : allAvis.filter(a => a.status === filter);

  const StarRow = ({ note }: { note: number }) => (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className="w-3.5 h-3.5" style={{
          fill: s <= note ? '#D4AF37' : '#E5E7EB',
          color: s <= note ? '#D4AF37' : '#D1D5DB',
        }} />
      ))}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Modération des avis</h1>
            {lastRefresh && (
              <p className="text-xs text-gray-400 mt-0.5">
                Dernière lecture : {lastRefresh.toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Badge total */}
            <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Database className="w-4 h-4" />
              {counts.total} avis total en base
            </span>

            {/* Bouton Actualiser */}
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Erreur RPC */}
        {rpcError && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Impossible de charger les avis</p>
              <p className="text-xs text-red-500 mt-0.5 font-mono">{rpcError}</p>
            </div>
          </div>
        )}

        {/* Compteurs par statut */}
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
              <p className="text-2xl font-bold" style={{ color: STATUS_LABELS[s].color }}>
                {counts[s]}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{STATUS_LABELS[s].label}</p>
            </button>
          ))}
        </div>

        {/* Filtre rapide */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500">Afficher :</span>
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
              {s === 'all' ? `Tous (${counts.total})` : `${STATUS_LABELS[s].label} (${counts[s]})`}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {counts.total === 0
                ? 'Aucun avis dans la base de données'
                : 'Aucun avis dans cette catégorie'}
            </p>
            {counts.total === 0 && (
              <p className="text-gray-400 text-sm mt-1">
                Les avis déposés sur les fiches entreprises apparaîtront ici
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
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
                        <span className="text-xs text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                          {a.submission_lang}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-800 leading-relaxed mb-2">
                      {a.commentaire || <em className="text-gray-400">Aucun commentaire</em>}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="font-medium text-gray-700">
                        {a.auteur || <em className="text-gray-400">Anonyme</em>}
                      </span>
                      {a.auteur_email ? (
                        <a href={`mailto:${a.auteur_email}`} className="text-blue-500 hover:underline">
                          {a.auteur_email}
                        </a>
                      ) : (
                        <span className="text-gray-300 italic text-[11px]">email non renseigné</span>
                      )}
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400 font-mono text-[11px]">
                        Entreprise : {a.entreprise_id}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {a.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(a.id, 'approved')}
                          disabled={actionLoading === a.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Valider
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, 'rejected')}
                          disabled={actionLoading === a.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Rejeter
                        </button>
                      </>
                    )}
                    {a.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(a.id, 'rejected')}
                        disabled={actionLoading === a.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Retirer
                      </button>
                    )}
                    {a.status === 'rejected' && (
                      <button
                        onClick={() => updateStatus(a.id, 'approved')}
                        disabled={actionLoading === a.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-medium rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Réapprouver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all animate-fade-in ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
