import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, Trash2, RefreshCw, Star } from 'lucide-react';

interface Avis {
  id: string;
  entreprise_id: string;
  note: number;
  commentaire: string;
  auteur: string;
  auteur_email: string;
  status: string;
  date: string;
  created_at: string;
}

export default function SuperModeration() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('avis_entreprise')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (err) {
      setError(err);
    } else {
      setAvis((data as Avis[]) || []);
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
      alert('Erreur update : ' + JSON.stringify(err, null, 2));
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
      alert('Erreur update : ' + JSON.stringify(err, null, 2));
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
      alert('Erreur delete : ' + JSON.stringify(err, null, 2));
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Modération des Avis</h1>
            <p className="text-sm text-gray-500 mt-1">Requête directe — supabase.from('avis_entreprise').select('*')</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Erreur brute */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-semibold text-red-700 mb-2">Erreur Supabase :</p>
            <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap">
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
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {error ? 'Erreur — voir ci-dessus' : 'Aucun avis trouvé'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {statusBadge(a.status)}
                      <span className="flex items-center gap-0.5 text-amber-500 text-sm font-medium">
                        <Star size={13} fill="currentColor" />
                        {a.note}/5
                      </span>
                      <span className="text-xs text-gray-400 font-mono truncate">{a.entreprise_id}</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{a.commentaire || <em className="text-gray-400">Pas de commentaire</em>}</p>
                    <p className="text-xs text-gray-500">
                      Par <strong>{a.auteur || '—'}</strong>
                      {a.auteur_email ? ` (${a.auteur_email})` : ''}
                      {' · '}
                      {new Date(a.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.status !== 'approved' && (
                      <button
                        onClick={() => approve(a.id)}
                        disabled={actionId === a.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Check size={13} />
                        Approuver
                      </button>
                    )}
                    {a.status !== 'rejected' && (
                      <button
                        onClick={() => reject(a.id)}
                        disabled={actionId === a.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        Rejeter
                      </button>
                    )}
                    <button
                      onClick={() => remove(a.id)}
                      disabled={actionId === a.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
