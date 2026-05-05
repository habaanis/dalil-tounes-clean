import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Receipt,
  Banknote,
  Copy,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  LogIn,
  Users,
} from 'lucide-react';

// Portail commercial — /admin/commercial
// Accessible :
//  - aux commerciaux (fiche dans `commerciaux`) : vue personnelle (portefeuille, encaissement, versements).
//  - aux admins (fiche dans `admins`) : vue globale de tous les commerciaux et leurs versements en attente.

const BANK_DETAILS = {
  beneficiaire: 'Mr HABA ANIS TAIEB',
  banque: 'BIAT - Agence Mahdia I (21)',
  rib: '08 501 000215099368049',
  iban: 'TN59 0850 1000 2150 9936 8049',
  swift: 'BIATTNTT',
};
const D17_PHONE = '+216 27 642 252';

// Emails autorisés en tant qu'admin principal.
// Si l'utilisateur connecté a l'un de ces emails, il est reconnu comme admin,
// même sans ligne dans la table `admins` (auto-insertion en base au 1er accès).
const ADMIN_EMAILS = [
  'contact@dalil-tounes.com',
];

const TIER_AMOUNTS: Record<string, number> = {
  artisan: 120,
  premium: 240,
  elite: 480,
};
const TIER_LABELS: Record<string, string> = {
  artisan: 'Artisan',
  premium: 'Premium',
  elite: 'Elite',
};

interface Encaissement {
  id: string;
  entreprise_id: string;
  tier: string;
  montant: number;
  recu_numero: string;
  verse: boolean;
  created_at: string;
}

interface Versement {
  id: string;
  montant: number;
  methode: string;
  preuve_url: string | null;
  statut: string;
  created_at: string;
}

interface Artisan {
  id: string;
  nom: string | null;
  ville: string | null;
  telephone: string | null;
  subscription_tier: string | null;
}

type Tab = 'wallet' | 'encaisser' | 'versements';

interface CommercialLite {
  id: string;
  nom: string;
  zone: string;
  actif: boolean;
  portefeuille: number;
  totalEncaisse: number;
  nbVersements: number;
}

interface VersementAdmin extends Versement {
  commercial_id: string;
  commercial_nom?: string;
}

export default function AdminCommercial() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('wallet');

  const [profil, setProfil] = useState<{ nom: string; zone: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [encaissements, setEncaissements] = useState<Encaissement[]>([]);
  const [versements, setVersements] = useState<Versement[]>([]);
  const [allCommerciaux, setAllCommerciaux] = useState<CommercialLite[]>([]);
  const [allVersements, setAllVersements] = useState<VersementAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [authzChecking, setAuthzChecking] = useState(true);
  const [authzDebug, setAuthzDebug] = useState<{
    userId?: string;
    email?: string;
    adminRowFound?: boolean;
    adminRowError?: string;
    commercialRowFound?: boolean;
    commercialRowError?: string;
    whitelisted?: boolean;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // onglet Encaisser
  const [search, setSearch] = useState('');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchingArt, setSearchingArt] = useState(false);
  const [encaissingId, setEncaissingId] = useState<string | null>(null);
  const [chosenTier, setChosenTier] = useState<'artisan' | 'premium' | 'elite'>('premium');

  // onglet Versements
  const [file, setFile] = useState<File | null>(null);
  const [methode, setMethode] = useState<'virement' | 'd17'>('virement');
  const [montantVersement, setMontantVersement] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    setAuthzChecking(true);

    const emailLc = (user.email || '').toLowerCase();
    const isWhitelistedAdmin = ADMIN_EMAILS.includes(emailLc);

    if (isWhitelistedAdmin) {
      const { error: upsertErr } = await supabase
        .from('admins')
        .upsert({ id: user.id, email: emailLc }, { onConflict: 'id' });
      if (upsertErr) {
        console.error('[admins.upsert] auto-provisioning échoué', upsertErr);
      }
    }

    const { data: adminRow, error: adminErr } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    if (adminErr) {
      console.error('[admins.select] erreur Supabase', { error: adminErr, userId: user.id });
    }
    const admin = !!adminRow || isWhitelistedAdmin;
    setIsAdmin(admin);

    const { data: comm, error: commErr } = await supabase
      .from('commerciaux')
      .select('nom, zone')
      .eq('id', user.id)
      .maybeSingle();
    if (commErr) {
      console.error('[commerciaux.select] erreur Supabase', { error: commErr, userId: user.id });
    }
    setProfil(comm ?? null);

    setAuthzDebug({
      userId: user.id,
      email: emailLc,
      adminRowFound: !!adminRow,
      adminRowError: adminErr?.message,
      commercialRowFound: !!comm,
      commercialRowError: commErr?.message,
      whitelisted: isWhitelistedAdmin,
    });
    setAuthzChecking(false);

    const { data: enc } = await supabase
      .from('encaissements_cash')
      .select('id, commercial_id, entreprise_id, tier, montant, recu_numero, verse, created_at')
      .eq('commercial_id', user.id)
      .order('created_at', { ascending: false });
    setEncaissements((enc || []) as Encaissement[]);

    const { data: vers } = await supabase
      .from('versements_commerciaux')
      .select('id, montant, methode, preuve_url, statut, created_at')
      .eq('commercial_id', user.id)
      .order('created_at', { ascending: false });
    setVersements((vers || []) as Versement[]);

    if (admin) {
      const [{ data: allComm }, { data: allEnc }, { data: allVers }] = await Promise.all([
        supabase.from('commerciaux').select('id, nom, zone, actif').order('nom'),
        supabase
          .from('encaissements_cash')
          .select('commercial_id, montant, verse'),
        supabase
          .from('versements_commerciaux')
          .select('id, commercial_id, montant, methode, preuve_url, statut, created_at')
          .order('created_at', { ascending: false }),
      ]);

      const byCommId: Record<string, { portefeuille: number; total: number }> = {};
      (allEnc || []).forEach((e: any) => {
        const b = (byCommId[e.commercial_id] ||= { portefeuille: 0, total: 0 });
        const m = Number(e.montant || 0);
        b.total += m;
        if (!e.verse) b.portefeuille += m;
      });
      const nbVersByComm: Record<string, number> = {};
      (allVers || []).forEach((v: any) => {
        nbVersByComm[v.commercial_id] = (nbVersByComm[v.commercial_id] || 0) + 1;
      });

      setAllCommerciaux(
        (allComm || []).map((c: any) => ({
          id: c.id,
          nom: c.nom || '—',
          zone: c.zone || '—',
          actif: c.actif,
          portefeuille: byCommId[c.id]?.portefeuille || 0,
          totalEncaisse: byCommId[c.id]?.total || 0,
          nbVersements: nbVersByComm[c.id] || 0,
        }))
      );

      const nomById: Record<string, string> = Object.fromEntries(
        (allComm || []).map((c: any) => [c.id, c.nom])
      );
      setAllVersements(
        (allVers || []).map((v: any) => ({
          ...v,
          commercial_nom: nomById[v.commercial_id] || v.commercial_id,
        })) as VersementAdmin[]
      );
    }

    setLoading(false);
  };

  const confirmerVersement = async (vId: string) => {
    const { error } = await supabase
      .from('versements_commerciaux')
      .update({ statut: 'confirme' })
      .eq('id', vId);
    if (error) {
      setFeedback({ ok: false, msg: error.message });
    } else {
      setFeedback({ ok: true, msg: 'Versement confirmé.' });
      await loadAll();
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const portefeuille = useMemo(
    () => encaissements.filter((e) => !e.verse).reduce((s, e) => s + Number(e.montant || 0), 0),
    [encaissements]
  );
  const totalEncaisse = useMemo(
    () => encaissements.reduce((s, e) => s + Number(e.montant || 0), 0),
    [encaissements]
  );

  const copy = async (value: string, f: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(f);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      /* noop */
    }
  };

  const doSearchArtisan = async () => {
    const q = search.trim();
    if (!q) {
      setArtisans([]);
      return;
    }
    setSearchingArt(true);
    const { data } = await supabase
      .from('entreprise')
      .select('id, nom, ville, telephone, subscription_tier')
      .or(`nom.ilike.%${q}%,ville.ilike.%${q}%,telephone.ilike.%${q}%`)
      .limit(20);
    setArtisans((data || []) as Artisan[]);
    setSearchingArt(false);
  };

  const encaisserCash = async (a: Artisan) => {
    if (!user) return;
    setEncaissingId(a.id);
    setFeedback(null);

    const tier = chosenTier;
    const montant = TIER_AMOUNTS[tier];
    const recuNumero = `RC-${Date.now().toString().slice(-8)}`;

    // 1) Passe l'entreprise en premium
    const { error: upErr } = await supabase
      .from('entreprise')
      .update({
        is_premium: true,
        subscription_tier: tier,
        'statut abonnement': TIER_LABELS[tier],
      })
      .eq('id', a.id);

    if (upErr) {
      setFeedback({ ok: false, msg: `Erreur MAJ entreprise : ${upErr.message}` });
      setEncaissingId(null);
      return;
    }

    // 2) Crée l'encaissement (alimente le portefeuille virtuel)
    const { error: insErr } = await supabase.from('encaissements_cash').insert({
      commercial_id: user.id,
      entreprise_id: a.id,
      tier,
      montant,
      recu_numero: recuNumero,
      verse: false,
    });

    if (insErr) {
      console.error('[encaissements_cash.insert] échec Supabase', {
        error: insErr,
        payload: {
          commercial_id: user.id,
          entreprise_id: a.id,
          tier,
          montant,
          recu_numero: recuNumero,
          verse: false,
        },
      });
      setFeedback({ ok: false, msg: `Erreur création reçu : ${insErr.message}` });
    } else {
      setFeedback({
        ok: true,
        msg: `Reçu ${recuNumero} généré — ${a.nom} activé en ${TIER_LABELS[tier]} (${montant} TND).`,
      });
      await loadAll();
    }

    setEncaissingId(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const uploadVersement = async () => {
    if (!user) return;
    if (!file) {
      setFeedback({ ok: false, msg: 'Choisissez la photo du reçu.' });
      return;
    }
    const montant = Number(montantVersement);
    if (!montant || montant <= 0) {
      setFeedback({ ok: false, msg: 'Montant invalide.' });
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('versements-preuves')
      .upload(path, file, { upsert: false });

    if (upErr) {
      setFeedback({ ok: false, msg: `Upload échoué : ${upErr.message}` });
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from('versements-preuves').getPublicUrl(path);

    const { data: created, error: insErr } = await supabase
      .from('versements_commerciaux')
      .insert({
        commercial_id: user.id,
        montant,
        methode,
        preuve_url: pub.publicUrl,
        statut: 'en_attente',
      })
      .select('id')
      .maybeSingle();

    if (insErr || !created) {
      console.error('[versements_commerciaux.insert] échec Supabase', {
        error: insErr,
        payload: {
          commercial_id: user.id,
          montant,
          methode,
          preuve_url: pub.publicUrl,
          statut: 'en_attente',
        },
      });
      setFeedback({ ok: false, msg: `Erreur création versement : ${insErr?.message}` });
      setUploading(false);
      return;
    }

    // Rattache les encaissements non versés (jusqu'au montant annoncé, FIFO)
    const nonVerses = encaissements.filter((e) => !e.verse);
    let restant = montant;
    const idsARattacher: string[] = [];
    for (const enc of nonVerses) {
      if (restant <= 0) break;
      idsARattacher.push(enc.id);
      restant -= Number(enc.montant || 0);
    }
    if (idsARattacher.length > 0) {
      const { error: updErr } = await supabase
        .from('encaissements_cash')
        .update({ verse: true, versement_id: created.id })
        .in('id', idsARattacher);
      if (updErr) {
        console.error('[encaissements_cash.update] rattachement versement échoué', {
          error: updErr,
          versement_id: created.id,
          ids: idsARattacher,
        });
      }
    }

    setFile(null);
    setMontantVersement('');
    setFeedback({
      ok: true,
      msg: `Versement enregistré. L'admin a été notifié avec la preuve.`,
    });
    setUploading(false);
    await loadAll();
    setTimeout(() => setFeedback(null), 4000);
  };

  if (authLoading || (user && authzChecking)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#4A1D43]" />
        <p className="text-sm text-gray-600">Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <LogIn className="w-10 h-10 text-[#4A1D43] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Espace Commercial</h1>
          <p className="text-sm text-gray-600 mb-5">
            Veuillez vous connecter pour accéder à votre portefeuille virtuel.
          </p>
          <Link
            to="/connexion"
            className="inline-block px-5 py-2.5 rounded-lg bg-[#4A1D43] text-white text-sm font-semibold hover:bg-[#5A2D53]"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (!profil && !isAdmin) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start gap-3 mb-6">
            <Users className="w-10 h-10 text-[#4A1D43] flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Compte non autorisé</h1>
              <p className="text-sm text-gray-600">
                Votre compte n'est pas enregistré comme commercial ni comme administrateur.
                La page reste affichée pour diagnostic (aucune redirection automatique).
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono space-y-1 text-gray-800">
            <div><span className="text-gray-500">user.id :</span> {authzDebug?.userId || '—'}</div>
            <div><span className="text-gray-500">email :</span> {authzDebug?.email || '—'}</div>
            <div><span className="text-gray-500">whitelisté (ADMIN_EMAILS) :</span> {String(authzDebug?.whitelisted)}</div>
            <div><span className="text-gray-500">ligne dans admins :</span> {String(authzDebug?.adminRowFound)}</div>
            {authzDebug?.adminRowError && (
              <div className="text-red-600">erreur admins : {authzDebug.adminRowError}</div>
            )}
            <div><span className="text-gray-500">ligne dans commerciaux :</span> {String(authzDebug?.commercialRowFound)}</div>
            {authzDebug?.commercialRowError && (
              <div className="text-red-600">erreur commerciaux : {authzDebug.commercialRowError}</div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Ouvrez la console (F12) pour le détail complet des erreurs Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {profil
              ? `Espace Commercial — ${profil.nom || user.email}`
              : `Gestion Terrain — Administrateur`}
          </h1>
          <p className="text-sm text-gray-600">
            {profil ? (
              <>Zone : <span className="font-semibold">{profil.zone || '—'}</span></>
            ) : (
              <>Vue globale des commerciaux de Sfax et Sousse.</>
            )}
            {isAdmin && <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-[#D4AF37] text-[#4A1D43]">ADMIN</span>}
          </p>
        </header>

        {isAdmin && (
          <section className="mb-6 bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">Mes commerciaux</h2>
            {allCommerciaux.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucun commercial enregistré. Ajoutez-les dans la table <code>commerciaux</code>.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2">Nom</th>
                      <th className="text-left px-3 py-2">Zone</th>
                      <th className="text-right px-3 py-2">Portefeuille</th>
                      <th className="text-right px-3 py-2">Total encaissé</th>
                      <th className="text-right px-3 py-2">Versements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allCommerciaux.map((c) => (
                      <tr key={c.id}>
                        <td className="px-3 py-2 font-semibold">{c.nom}</td>
                        <td className="px-3 py-2">{c.zone}</td>
                        <td className="px-3 py-2 text-right font-bold text-[#4A1D43]">
                          {Number(c.portefeuille || 0).toFixed(3)} TND
                        </td>
                        <td className="px-3 py-2 text-right">{Number(c.totalEncaisse || 0).toFixed(3)} TND</td>
                        <td className="px-3 py-2 text-right">{c.nbVersements || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h2 className="font-bold text-gray-900 mt-6 mb-3">Versements reçus (preuves)</h2>
            {allVersements.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun versement signalé pour l'instant.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {allVersements.map((v) => (
                  <li key={v.id} className="py-2 flex flex-wrap justify-between items-center gap-2 text-sm">
                    <div>
                      <div className="font-semibold">
                        {v.commercial_nom || '—'} · {Number(v.montant || 0).toFixed(3)} TND ·{' '}
                        {v.methode === 'd17' ? 'D17' : 'Virement'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(v.created_at).toLocaleString('fr-FR')} · statut :{' '}
                        <span className={`font-semibold ${v.statut === 'confirme' ? 'text-green-600' : 'text-amber-600'}`}>
                          {v.statut}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.preuve_url && (
                        <a
                          href={v.preuve_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#4A1D43] font-semibold hover:underline"
                        >
                          Voir reçu
                        </a>
                      )}
                      {v.statut !== 'confirme' && (
                        <button
                          onClick={() => confirmerVersement(v.id)}
                          className="px-3 py-1 rounded-md bg-[#059669] text-white text-xs font-bold hover:bg-[#047857]"
                        >
                          Confirmer
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {profil && (<>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Portefeuille virtuel"
            value={`${portefeuille.toFixed(3)} TND`}
            accent
          />
          <StatCard
            icon={<Receipt className="w-5 h-5" />}
            label="Total encaissé (historique)"
            value={`${totalEncaisse.toFixed(3)} TND`}
          />
          <StatCard
            icon={<Banknote className="w-5 h-5" />}
            label="Versements effectués"
            value={`${versements.length}`}
          />
        </div>

        <nav className="flex gap-2 mb-5 border-b border-gray-200">
          <TabButton active={tab === 'wallet'} onClick={() => setTab('wallet')} label="Portefeuille" />
          <TabButton active={tab === 'encaisser'} onClick={() => setTab('encaisser')} label="Encaisser Cash" />
          <TabButton active={tab === 'versements'} onClick={() => setTab('versements')} label="Mes Versements" />
        </nav>

        {feedback && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
              feedback.ok
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {feedback.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {feedback.msg}
          </div>
        )}

        {loading && (
          <div className="py-10 text-center text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            Chargement…
          </div>
        )}

        {!loading && tab === 'wallet' && (
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-4">Encaissements (en attente de versement)</h2>
            {encaissements.filter((e) => !e.verse).length === 0 ? (
              <p className="text-sm text-gray-500">Aucun encaissement en attente.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr>
                    <th className="text-left py-2">Reçu</th>
                    <th className="text-left py-2">Tier</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {encaissements
                    .filter((e) => !e.verse)
                    .map((e) => (
                      <tr key={e.id}>
                        <td className="py-2 font-mono text-xs">{e.recu_numero}</td>
                        <td className="py-2">{TIER_LABELS[e.tier] || e.tier}</td>
                        <td className="py-2 text-gray-600 text-xs">
                          {new Date(e.created_at).toLocaleString('fr-FR')}
                        </td>
                        <td className="py-2 text-right font-semibold">
                          {Number(e.montant).toFixed(3)} TND
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {!loading && tab === 'encaisser' && (
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-1">Encaisser un artisan</h2>
            <p className="text-xs text-gray-500 mb-4">
              Recherchez l'artisan, choisissez le tier, puis cliquez « Encaisser Cash ».
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(['artisan', 'premium', 'elite'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChosenTier(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${
                    chosenTier === t
                      ? 'bg-[#4A1D43] text-white border-[#4A1D43]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {TIER_LABELS[t]} — {TIER_AMOUNTS[t]} TND
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearchArtisan()}
                placeholder="Nom, ville ou téléphone…"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                onClick={doSearchArtisan}
                className="px-4 py-2 rounded-lg bg-[#4A1D43] text-white text-sm font-semibold hover:bg-[#5A2D53]"
              >
                Rechercher
              </button>
            </div>

            {searchingArt && (
              <div className="text-sm text-gray-500">
                <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                Recherche…
              </div>
            )}

            <div className="space-y-2">
              {artisans.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{a.nom}</div>
                    <div className="text-xs text-gray-500">
                      {a.ville || '—'} · {a.telephone || '—'} · Tier actuel :{' '}
                      <span className="font-semibold">{a.subscription_tier || 'decouverte'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => encaisserCash(a)}
                    disabled={encaissingId === a.id}
                    className="px-4 py-2 rounded-lg bg-[#059669] text-white text-xs font-bold hover:bg-[#047857] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {encaissingId === a.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Banknote className="w-4 h-4" />
                    )}
                    Encaisser Cash ({TIER_AMOUNTS[chosenTier]} TND)
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && tab === 'versements' && (
          <section className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-1">Instructions de versement</h2>
              <p className="text-xs text-gray-500 mb-4">
                Versez l'argent du portefeuille puis envoyez la preuve ci-dessous.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Virement en agence (RIB Convertible)
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <Row k="Bénéficiaire" v={BANK_DETAILS.beneficiaire} />
                    <Row k="Banque" v={BANK_DETAILS.banque} />
                    <CopyRow k="RIB" v={BANK_DETAILS.rib} onCopy={() => copy(BANK_DETAILS.rib, 'rib')} copied={copiedField === 'rib'} />
                    <CopyRow k="IBAN" v={BANK_DETAILS.iban} onCopy={() => copy(BANK_DETAILS.iban, 'iban')} copied={copiedField === 'iban'} />
                    <Row k="SWIFT" v={BANK_DETAILS.swift} />
                  </dl>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-[#FFF8E7] to-white">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Transfert rapide La Poste (D17)
                  </h3>
                  <CopyRow
                    k="Numéro D17"
                    v={D17_PHONE}
                    onCopy={() => copy(D17_PHONE, 'd17')}
                    copied={copiedField === 'd17'}
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Effectuez le transfert depuis votre application D17 vers ce numéro.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-1">J'ai versé l'argent</h2>
              <p className="text-xs text-gray-500 mb-4">
                Téléversez la photo du reçu. L'administration recevra immédiatement la notification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Méthode</label>
                  <select
                    value={methode}
                    onChange={(e) => setMethode(e.target.value as 'virement' | 'd17')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="virement">Virement bancaire</option>
                    <option value="d17">D17 / La Poste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Montant versé (TND)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={montantVersement}
                    onChange={(e) => setMontantVersement(e.target.value)}
                    placeholder={portefeuille.toFixed(3)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <label className="block text-xs font-semibold text-gray-600 mb-1">Photo du reçu</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#4A1D43] file:text-white hover:file:bg-[#5A2D53]"
              />

              <button
                onClick={uploadVersement}
                disabled={uploading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1EBE5D] disabled:opacity-60"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                J'ai versé l'argent (envoyer la preuve)
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Historique des versements</h2>
              {versements.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun versement enregistré.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {versements.map((v) => (
                    <li key={v.id} className="py-2 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-semibold">
                          {Number(v.montant).toFixed(3)} TND · {v.methode === 'd17' ? 'D17' : 'Virement'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(v.created_at).toLocaleString('fr-FR')} · statut :{' '}
                          <span className="font-semibold">{v.statut}</span>
                        </div>
                      </div>
                      {v.preuve_url && (
                        <a
                          href={v.preuve_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#4A1D43] font-semibold hover:underline"
                        >
                          Voir reçu
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
        </>)}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent ? 'bg-[#4A1D43] text-white border-[#4A1D43]' : 'bg-white text-gray-900 border-gray-200'
      }`}
    >
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${accent ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        active ? 'border-[#4A1D43] text-[#4A1D43]' : 'border-transparent text-gray-500 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <dt className="text-gray-600">{k}</dt>
      <dd className="font-semibold text-gray-900 text-right">{v}</dd>
    </div>
  );
}

function CopyRow({ k, v, onCopy, copied }: { k: string; v: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <dt className="text-gray-600">{k}</dt>
      <dd className="flex items-center gap-2">
        <span className="font-mono font-semibold text-gray-900 text-xs">{v}</span>
        <button onClick={onCopy} className="text-[#4A1D43] hover:text-[#D4AF37]" aria-label={`Copier ${k}`}>
          <Copy className="w-4 h-4" />
        </button>
        {copied && <span className="text-[10px] text-green-600 font-semibold">copié</span>}
      </dd>
    </div>
  );
}
