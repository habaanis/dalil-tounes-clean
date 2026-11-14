import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Building2, Settings, LogOut, Store, Package, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import JobPostForm from '../components/forms/JobPostForm';

type ScopedBoutiqueStats = { entreprise_id: string; push_subscriptions: number; published_products: number; draft_products: number };
interface CompanyDashboardProps {
  onNavigate?: (page: any) => void;
}

export default function CompanyDashboard({ onNavigate }: CompanyDashboardProps) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'settings' | 'showcase' | 'boutique' | 'stats'>('showcase');
  const [showWelcome, setShowWelcome] = useState(false);
  const [stats, setStats] = useState<ScopedBoutiqueStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setStats([]);
      setStatsError(false);
      return;
    }
    let cancelled = false;
    setStatsLoading(true);
    setStatsError(false);
    // The database RPC scopes all results to auth.uid(); never accept an entreprise_id from the browser.
    import('../lib/supabaseClient')
      .then(({ supabase }: { supabase: SupabaseClient }) => supabase.rpc('dalil_professional_boutique_stats'))
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setStatsError(true); setStats([]); return; }
        setStats((data ?? []) as ScopedBoutiqueStats[]);
      })
      .catch(() => { if (!cancelled) { setStatsError(true); setStats([]); } })
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  useEffect(() => {
    const isNewUser = localStorage.getItem(`newUser_${user?.id}`);
    if (isNewUser) {
      setShowWelcome(true);
      localStorage.removeItem(`newUser_${user?.id}`);
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    if (onNavigate) onNavigate('home');
    else navigate('/');
  };

  if (loading) return <main className="min-h-screen bg-[#fbf8f0] p-8 text-center" role="status">Vérification de votre session…</main>;
  if (!user) return <main className="min-h-screen bg-[#fbf8f0] p-8"><section className="mx-auto max-w-md rounded-2xl border border-[#dac59b] bg-white p-6 text-center"><ShieldCheck className="mx-auto mb-3 text-[#8f2530]" /><h1 className="text-xl font-semibold text-[#62212a]">Espace professionnel</h1><p className="my-4 text-sm text-gray-700">Connectez-vous pour accéder à votre espace privé.</p><a className="inline-block rounded-full bg-[#8f2530] px-5 py-3 text-sm font-semibold text-white" href="/connexion">Se connecter</a></section></main>;

  return (
    <div className="min-h-screen bg-[#fbf8f0]">
      {showWelcome && (
        <div className="fixed top-4 right-4 z-50 bg-[#8f2530] text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <div className="font-bold text-lg">Bienvenue sur Dalil Tounes !</div>
              <div className="text-sm text-white/80">Votre compte entreprise a été créé avec succès</div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-[#e8d9bd] bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbf1df]">
                <Building2 className="h-6 w-6 text-[#8f2530]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Mon espace professionnel
                </h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-5 max-w-2xl text-sm text-[#684d47]">Retrouvez vos services professionnels dans un seul espace. L’accès aux informations d’une fiche nécessite une attribution vérifiée.</p>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full flex-shrink-0 lg:w-60">
            <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-[#e8d9bd] bg-white p-3 shadow-sm sm:grid-cols-3 lg:flex lg:flex-col" aria-label="Rubriques professionnelles">
              {([
                { id: 'showcase', label: 'Ma vitrine', Icon: Store },
                { id: 'boutique', label: 'Ma boutique', Icon: Package },
                { id: 'stats', label: 'Mes statistiques', Icon: BarChart3 },
              ] as const).map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm transition-colors ${activeTab === id ? 'bg-[#fbf1df] font-semibold text-[#8f2530]' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Icon className="h-5 w-5 shrink-0" /><span>{label}</span>
                </button>
              ))}
              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm transition-colors ${
                  activeTab === 'jobs'
                    ? 'bg-[#fbf1df] text-[#8f2530]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Mes offres</span>
              </button>
              <button
                onClick={() => setActiveTab('candidates')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm transition-colors ${
                  activeTab === 'candidates'
                    ? 'bg-[#fbf1df] text-[#8f2530]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Candidats</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#fbf1df] text-[#8f2530]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Paramètres</span>
              </button>
            </nav>
          </div>

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-[#e8d9bd] bg-white p-4 shadow-sm sm:p-6">
              {(['showcase', 'boutique', 'stats'] as const).includes(activeTab as 'showcase' | 'boutique' | 'stats') && (
                <section aria-live="polite">
                  <div className="mb-4 flex items-center gap-3">
                    {activeTab === 'showcase' ? <Store className="text-[#8f2530]" /> : activeTab === 'boutique' ? <Package className="text-[#8f2530]" /> : <BarChart3 className="text-[#8f2530]" />}
                    <h2 className="text-xl font-semibold text-[#62212a]">{activeTab === 'showcase' ? 'Ma vitrine' : activeTab === 'boutique' ? 'Ma boutique' : 'Mes statistiques'}</h2>
                  </div>
                  {statsLoading ? <p role="status" className="text-sm text-gray-700">Vérification des droits et chargement…</p>
                    : statsError ? <p role="alert" className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-4 text-sm">Informations temporairement indisponibles. Veuillez réessayer ultérieurement.</p>
                    : stats.length === 0 ? <div className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-5">
                      <p className="font-semibold text-[#62212a]">Établissement non encore associé à votre compte</p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">Pour protéger les données professionnelles, Dalil Tounes doit vérifier votre établissement avant de vous donner accès à sa vitrine, sa boutique et ses statistiques.</p>
                    </div>
                    : <div className="space-y-4">{stats.map((record) => <div key={record.entreprise_id} className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-4 sm:p-5">
                      <p className="mb-3 break-all text-xs text-[#684d47]">Établissement vérifié : {record.entreprise_id}</p>
                      {activeTab === 'stats' ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {([
                          ['Abonnements nouveautés', record.push_subscriptions],
                          ['Produits publiés', record.published_products],
                          ['Produits en attente', record.draft_products],
                          ['Visites', null],
                          ['Demandes reçues', null],
                        ] as const).map(([label, value]) => <div key={label} className="rounded-xl border border-[#e7d7b8] bg-white p-3">
                          <p className="min-h-9 text-xs text-gray-600">{label}</p>
                          <strong className="text-2xl text-[#8f2530]">{value ?? '—'}</strong>
                        </div>)}
                      </div> : <p className="text-sm leading-6 text-gray-700">{activeTab === 'boutique'
                        ? 'Votre Boutique est associée à votre établissement. La modification des produits sera activée après validation du parcours de soumission.'
                        : 'Votre établissement est identifié. Les modifications de vitrine seront activées après validation et modération.'}</p>}
                    </div>)}</div>}
                  {activeTab === 'stats' && <p className="mt-3 text-xs text-gray-600">Un abonnement représente un appareil ou navigateur, pas nécessairement une personne. Les visites et demandes non suivies affichent « — ».</p>}

                </section>
              )}
              {activeTab === 'jobs' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-[#62212a]">Publier une offre d'emploi</h2>
                  {user && <JobPostForm userId={user.id} />}
                </div>
              )}

              {activeTab === 'candidates' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-[#62212a]">Candidats disponibles</h2>
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Aucun candidat pour le moment</p>
                    <button
                      onClick={() => onNavigate ? onNavigate('candidateList') : navigate('/candidats')}
                      className="mt-4 px-6 py-2 bg-[#8f2530] text-white rounded-lg hover:bg-[#73202a] transition-colors"
                    >
                      Voir les candidats
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-[#62212a]">Paramètres</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Type de compte</h3>
                      <p className="text-gray-600">Entreprise</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
