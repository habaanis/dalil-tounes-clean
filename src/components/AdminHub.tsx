import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminAccess, useVerifiedAdmin } from '../lib/useVerifiedAdmin';
import { supabase } from '../lib/supabaseClient';

const adminLinks = [
  ['Gestion Emploi', '/admin/emploi', 'Offres, suivi et alertes emploi'],
  ['Gestion commerciale et financière', '/admin/commercial?tab=wallet', 'Commerciaux, commissions et versements'],
  ['Professionnels et abonnements', '/admin/abonnements', 'Gestion des offres professionnelles'],
  ['Modération', '/admin/super-moderation', 'Contrôle des contenus'],
  ['Avis', '/admin/avis', 'Gestion des avis'],
  ['Demandes de partenaires', '/admin/partner-requests', 'Demandes reçues'],
  ['Besoins professionnels', '/admin/business-needs', 'Demandes des entreprises'],
  ['Sourcing', '/admin/sourcing', 'Suivi des établissements'],
] as const;

export function AdminNavigation() {
  const verified = useVerifiedAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  if (!verified || !/^\/admin(?:\/|$)/.test(location.pathname)) return null;
  const logout = async () => {
    setBusy(true); setError(false);
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
      if (signOutError) throw signOutError;
      navigate('/login', { replace: true });
    } catch { setError(true); }
    finally { setBusy(false); }
  };
  return <div className="mx-auto max-w-6xl px-4 py-3 text-[#292725]">
    <nav aria-label="Navigation administrateur" className="flex flex-wrap items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#FFFCF7] p-3 text-sm">
      {location.pathname !== '/admin' && <Link className="font-semibold underline" to="/admin">← Retour à l’administration</Link>}
      <Link to="/" className="ml-auto rounded-lg border px-3 py-2">Retour au site public</Link>
      <button type="button" disabled={busy} onClick={() => void logout()} className="rounded-lg bg-[#292725] px-3 py-2 text-white">{busy ? 'Déconnexion…' : 'Déconnexion'}</button>
    </nav>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">Déconnexion impossible. Réessayez.</p>}
  </div>;
}

export function AdminRouteGuard() {
  const { user } = useAuth();
  const access = useAdminAccess();
  const location = useLocation();
  if (access === 'allowed') return <Outlet key={user?.id} />;
  if (access === 'checking') return <main className="mx-auto max-w-lg p-6" role="status">Vérification des droits…</main>;
  if (access === 'denied' && user && location.pathname === '/admin/commercial') {
    return <Navigate to={'/commercial' + location.search} replace />;
  }
  return <main className="mx-auto max-w-lg px-5 py-12">
    <h1 className="text-xl font-semibold">Accès administrateur réservé</h1>
    <p className="mt-3 text-sm" role="alert">{access === 'error' ? 'Impossible de vérifier vos droits. Réessayez en actualisant la page.' : 'Connectez-vous avec un compte administrateur autorisé.'}</p>
    {!user && <Link to="/login" state={{from:location.pathname + location.search}} className="mt-4 inline-block underline">Se connecter</Link>}
    <Link to="/" className="mt-4 block underline">Retour à l’accueil</Link>
  </main>;
}

export default function AdminHub() {
  const { user, loading } = useAuth();
  const verified = useVerifiedAdmin();
  return <main className="min-h-screen bg-[#FFFCF7] p-4 text-[#292725]">
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-xl font-semibold">Administration · Dalil Tounes</h1>
      {loading ? <p role="status">Chargement…</p> : !user ? <Link to="/login" state={{from:'/admin'}} className="underline">Se connecter</Link> : !verified ? <p role="status">Accès réservé aux administrateurs autorisés. Vérification des droits en cours ou accès non autorisé.</p> :
      <div className="grid gap-3 md:grid-cols-2">{adminLinks.map(([label, path, detail]) => <Link key={path} to={path} className="rounded-xl border border-[#D4AF37] bg-white p-4 hover:bg-[#FFF8EA]"><h2 className="font-semibold">{label} →</h2><p className="mt-1 text-sm text-gray-600">{detail}</p></Link>)}</div>}
    </div>
  </main>;
}
