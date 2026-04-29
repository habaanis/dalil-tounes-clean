import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, Trash2, RefreshCw, Star, Loader2 } from 'lucide-react';

interface Avis {
  id: string;
  entreprise_id: string | null;
  note: number;
  commentaire: string;
  status: string;
  created_at: string;
}

export default function SuperModeration() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [entrepriseNames, setEntrepriseNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('avis_entreprise')
      .select('id, entreprise_id, note, commentaire, status, created_at')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err);
      setAvis([]);
      setLoading(false);
      return;
    }

    const rows = (data as Avis[]) || [];
    setAvis(rows);

    const ids = Array.from(new Set(rows.map(r => r.entreprise_id).filter((x): x is string => !!x)));
    if (ids.length > 0) {
      const { data: ents } = await supabase
        .from('entreprise')
        .select('id, nom')
        .in('id', ids);
      const map: Record<string, string> = {};
      (ents || []).forEach((e: any) => { if (e?.id) map[e.id] = e.nom || ''; });
      setEntrepriseNames(map);
    } else {
      setEntrepriseNames({});
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    setActionId(id);
    const { error: err } = await supabase
      .from('avis_entreprise')
      .update({ status: 'approved' })
      .eq('id', id);
    if (err) {
      alert('Erreur update :\n' + JSON.stringify(err, null, 2));
    } else {
      setAvis(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    }
    setActionId(null);
  };

  const reject = async (id: string) => {
    setActionId(id);
    const { error: err } = await supabase
      .from('avis_entreprise')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (err) {
      alert('Erreur update :\n' + JSON.stringify(err, null, 2));
    } else {
      setAvis(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    }
    setActionId(null);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cet avis ?')) return;
    setActionId(id);
    const { error: err } = await supabase
      .from('avis_entreprise')
      .delete()
      .eq('id', id);
    if (err) {
      alert('Erreur delete :\n' + JSON.stringify(err, null, 2));
    } else {
      setAvis(prev => prev.filter(a => a.id !== id));
    }
    setActionId(null);
  };

  const filtered = filter === 'all' ? avis : avis.filter(a => a.status === filter);
  const counts = {
    all: avis.length,
    pending: avis.filter(a => a.status === 'pending').length,
    approved: avis.filter(a => a.status === 'approved').length,
    rejected: avis.filter(a => a.status === 'rejected').length,
  };

  const statusBadge = (s: string) => {
    if (s === 'approved') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Approuvé</span>;
    if (s === 'rejected') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejeté</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">En attente</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Super Modération des Avis</h1>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Erreur brute JSON */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-bold text-red-700 mb-2">Erreur Supabase — JSON brut :</p>
            <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap bg-red-100 rounded p-3">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvés' : 'Rejetés'}
              <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 size={32} className="animate-spin text-gray-500" />
            <p className="text-sm">Chargement des avis depuis Supabase...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold">Échec de la requête — voir l'erreur ci-dessus.</p>
            <p className="text-sm text-gray-500 mt-1">Vérifiez les politiques RLS et la connexion réseau.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
            <p className="text-base font-medium">Aucun avis pour le moment</p>
            <p className="text-sm text-gray-400">
              {filter !== 'all'
                ? `Aucun avis avec le statut "${filter}". Essayez le filtre "Tous".`
                : 'Aucun avis soumis pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Statut</th>
                    <th className="text-left px-3 py-2 font-semibold">Note</th>
                    <th className="text-left px-3 py-2 font-semibold">Auteur</th>
                    <th className="text-left px-3 py-2 font-semibold w-[40%]">Commentaire</th>
                    <th className="text-left px-3 py-2 font-semibold">Entreprise</th>
                    <th className="text-left px-3 py-2 font-semibold">Date</th>
                    <th className="text-right px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(a => (
                    <tr key={a.id} className="align-top hover:bg-gray-50/60">
                      <td className="px-3 py-3">{statusBadge(a.status)}</td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-0.5 text-amber-500 font-medium whitespace-nowrap">
                          <Star size={13} fill="currentColor" />
                          {a.note}/5
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-gray-900 font-medium whitespace-nowrap">Utilisateur Dalil</p>
                      </td>
                      <td className="px-3 py-3">
                        {a.commentaire ? (
                          <p className="text-gray-800 leading-snug whitespace-pre-wrap break-words">
                            {a.commentaire}
                          </p>
                        ) : (
                          <em className="text-gray-400">Pas de commentaire</em>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {a.entreprise_id ? (
                          <span className="text-xs text-gray-800 font-medium break-words">
                            {entrepriseNames[a.entreprise_id] || <em className="text-gray-400">Entreprise inconnue</em>}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 whitespace-nowrap">
                            SITE GENERAL
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                        {new Date(a.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {a.status !== 'approved' && (
                            <button
                              onClick={() => approve(a.id)}
                              disabled={actionId === a.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {actionId === a.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                              Approuver
                            </button>
                          )}
                          {a.status !== 'rejected' && (
                            <button
                              onClick={() => reject(a.id)}
                              disabled={actionId === a.id}
                              className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              Rejeter
                            </button>
                          )}
                          <button
                            onClick={() => remove(a.id)}
                            disabled={actionId === a.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                          >
                            {actionId === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
