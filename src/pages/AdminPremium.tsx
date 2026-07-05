import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, CheckCircle2, XCircle, Loader2, Crown } from 'lucide-react';

// Back-office : liste les entreprises et permet d'activer manuellement
// l'abonnement Premium (après réception de la preuve de paiement sur WhatsApp).
//
// Mise à jour effectuée sur la table `entreprise` :
//   - is_premium = true
//   - subscription_tier = <tier choisi>
//   - "statut abonnement" = <tier choisi>  (colonne legacy utilisée ailleurs)

type Tier = 'decouverte' | 'artisan' | 'premium' | 'elite';

interface EntrepriseRow {
  id: string;
  nom: string | null;
  ville: string | null;
  telephone: string | null;
  is_premium: boolean | null;
  subscription_tier: string | null;
  'statut abonnement': string | null;
}

const TIER_LABELS: Record<Tier, string> = {
  decouverte: 'Découverte',
  artisan: 'Artisan',
  premium: 'Premium',
  elite: 'Elite',
};

const TIER_COLORS: Record<Tier, string> = {
  decouverte: 'bg-gray-100 text-gray-700',
  artisan: 'bg-[#FFF8E7] text-[#4A1D43] border border-[#D4AF37]',
  premium: 'bg-[#ECFDF5] text-[#064E3B] border border-[#059669]',
  elite: 'bg-[#121212] text-[#D4AF37] border border-[#D4AF37]',
};

export default function AdminPremium() {
  const [rows, setRows] = useState<EntrepriseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; ok: boolean; msg: string } | null>(null);

  const loadBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entreprise')
      .select('id, nom, ville, telephone, is_premium, subscription_tier, "statut abonnement"')
      .order('nom', { ascending: true })
      .limit(500);

    if (error) {
      console.error('[AdminPremium] load error:', error);
      setRows([]);
    } else {
      setRows((data || []) as EntrepriseRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.nom, r.ville, r.telephone].some((v) => (v ?? '').toLowerCase().includes(q))
    );
  }, [rows, search]);

  const activateTier = async (row: EntrepriseRow, tier: Tier) => {
    setActivatingId(row.id);
    setFeedback(null);

    const isPaid = tier !== 'decouverte';
    const { error } = await supabase
      .from('entreprise')
      .update({
        is_premium: isPaid,
        subscription_tier: tier,
        'statut abonnement': TIER_LABELS[tier],
      })
      .eq('id', row.id);

    if (error) {
      console.error('[AdminPremium] update error:', error);
      setFeedback({ id: row.id, ok: false, msg: error.message });
    } else {
      setFeedback({ id: row.id, ok: true, msg: `Abonnement ${TIER_LABELS[tier]} activé.` });
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                is_premium: isPaid,
                subscription_tier: tier,
                'statut abonnement': TIER_LABELS[tier],
              }
            : r
        )
      );
    }

    setActivatingId(null);
    setTimeout(() => setFeedback((f) => (f?.id === row.id ? null : f)), 3000);
  };

  const currentTier = (row: EntrepriseRow): Tier => {
    const s = (row.subscription_tier || row['statut abonnement'] || '').toLowerCase();
    if (s.includes('elite')) return 'elite';
    if (s.includes('premium')) return 'premium';
    if (s.includes('artisan')) return 'artisan';
    return 'decouverte';
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#4A1D43] flex items-center justify-center">
            <Crown className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activation manuelle des abonnements</h1>
            <p className="text-sm text-gray-600">
              Passez une entreprise en Premium après réception de la preuve de paiement sur WhatsApp.
            </p>
          </div>
        </div>

        <div className="mb-5 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, ville ou téléphone"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Entreprise</th>
                  <th className="text-left px-4 py-3 font-semibold">Ville</th>
                  <th className="text-left px-4 py-3 font-semibold">Téléphone</th>
                  <th className="text-left px-4 py-3 font-semibold">Abonnement</th>
                  <th className="text-right px-4 py-3 font-semibold">Activer manuellement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                      Chargement…
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                      Aucune entreprise trouvée.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtered.map((row) => {
                    const tier = currentTier(row);
                    const isActivating = activatingId === row.id;
                    const fb = feedback?.id === row.id ? feedback : null;

                    return (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{row.nom || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{row.ville || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.telephone || '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${TIER_COLORS[tier]}`}
                          >
                            {TIER_LABELS[tier]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            {(['artisan', 'premium', 'elite'] as Tier[]).map((t) => (
                              <button
                                key={t}
                                type="button"
                                disabled={isActivating || tier === t}
                                onClick={() => activateTier(row, t)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                  tier === t
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#4A1D43] text-white hover:bg-[#5A2D53] active:scale-95'
                                }`}
                              >
                                {isActivating ? '…' : TIER_LABELS[t]}
                              </button>
                            ))}
                            <button
                              type="button"
                              disabled={isActivating || tier === 'decouverte'}
                              onClick={() => activateTier(row, 'decouverte')}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                tier === 'decouverte'
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 active:scale-95'
                              }`}
                            >
                              Rétrograder
                            </button>
                          </div>
                          {fb && (
                            <div
                              className={`mt-1.5 text-xs flex items-center justify-end gap-1 ${
                                fb.ok ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {fb.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {fb.msg}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
