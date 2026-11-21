import { useState, useEffect, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Building2, Settings, LogOut, Store, Package, BarChart3, ShieldCheck, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import JobPostForm from '../components/forms/JobPostForm';
import BoutiqueProductManagement from '../components/boutique/BoutiqueProductManagement';
import SalesLoyaltyManagement from '../components/boutique/SalesLoyaltyManagement';
import BoutiqueCustomerOrders from '../components/boutique/BoutiqueCustomerOrders';
import BoutiqueMerchantOrderAlerts from '../components/boutique/BoutiqueMerchantOrderAlerts';

type ScopedBoutiqueStats = { entreprise_id: string; push_subscriptions: number; published_products: number; draft_products: number };
interface CompanyDashboardProps {
  onNavigate?: (page: any) => void;
  clientAppMode?: boolean;
}

export default function CompanyDashboard({ onNavigate, clientAppMode = false }: CompanyDashboardProps) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'settings' | 'showcase' | 'boutique' | 'orders' | 'stats'>(() => new URLSearchParams(window.location.search).get('tab') === 'orders' ? 'orders' : clientAppMode ? 'boutique' : 'showcase');
  const [showWelcome, setShowWelcome] = useState(false);
  const [stats, setStats] = useState<ScopedBoutiqueStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);
  const [statsRetry, setStatsRetry] = useState(0);
  const [cvChoice, setCvChoice] = useState<'business'|'portfolio'>('portfolio');
  const [openingChoice, setOpeningChoice] = useState<'photo'|'framed'>('photo');
  const [paletteChoice, setPaletteChoice] = useState<'prestige'|'ivory'|'night'>('ivory');
  const [paletteSaving, setPaletteSaving] = useState(false);
  const [paletteFeedback, setPaletteFeedback] = useState('');
  const [presentationLoading, setPresentationLoading] = useState(false);
  const [presentationSaving, setPresentationSaving] = useState(false);
  const [presentationFeedback, setPresentationFeedback] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [boutiquePanel, setBoutiquePanel] = useState<'manage'|'create'|'sales'|null>(null);
  const [productKind, setProductKind] = useState<'product'|'gift_pack'>('product');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMode, setProductMode] = useState<'quote' | 'order'>('quote');
  const [productPrice, setProductPrice] = useState('');
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const [productPhotoInputKey, setProductPhotoInputKey] = useState(0);
  const [productBusiness, setProductBusiness] = useState('');
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState('');
  const [productRequests, setProductRequests] = useState<{id:string;entreprise_id:string;title:string;status:string;created_at:string}[]>([]);

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
  }, [user?.id,statsRetry]);

  useEffect(() => {
    if (!user?.id || stats.length === 0) { setProductRequests([]); return; }
    let cancelled = false;
    import('../lib/supabaseClient').then(({supabase}) =>
      supabase.from('dalil_boutique_product_requests')
        .select('id,entreprise_id,title,status,created_at')
        .order('created_at',{ascending:false}).limit(30)
    ).then(({data,error}) => {
      if (!cancelled && !error) setProductRequests(data ?? []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [user?.id, stats]);

  useEffect(() => {
    if (!clientAppMode || !user?.id || !stats[0]?.entreprise_id) return;
    let active=true;
    setPresentationLoading(true);
    void import('../lib/supabaseClient').then(({supabase}) =>
      supabase.from('entreprise').select('modele_cv,opening_style,palette_cv,palette_cv_user_selected,statut_carte')
        .eq('id',stats[0].entreprise_id).maybeSingle()
    ).then(({data,error})=>{
      if (!active) return;
      if (error || !data) {setPresentationFeedback('Présentation temporairement indisponible.');return;}
      setCvChoice(String(data.modele_cv || '').toLowerCase().includes('portfolio') ? 'portfolio' : 'business');
      setOpeningChoice(data.opening_style === 'framed' ? 'framed' : 'photo');
      const historicalIvory = data.statut_carte === '⭐ CERTIFIÉ DALIL TOUNES';
      const selected = data.palette_cv_user_selected === true;
      const palette = String(data.palette_cv || '').toLowerCase();
      setPaletteChoice(!selected && historicalIvory ? 'ivory' :
        palette === 'night' || palette === 'ivory' ? palette : 'prestige');
    }).catch(()=>{
      if (active) setPresentationFeedback('Présentation temporairement indisponible.');
    }).finally(()=>{if(active)setPresentationLoading(false)});
    return ()=>{active=false};
  },[clientAppMode,user?.id,stats]);

  const savePresentation = async () => {
    if (!user?.id || !stats[0]?.entreprise_id || presentationSaving) return;
    setPresentationSaving(true);setPresentationFeedback('');
    try {
      const {supabase} = await import('../lib/supabaseClient');
      const {error} = await supabase.rpc('dalil_update_my_cv_presentation',{
        p_entreprise_id:stats[0].entreprise_id,p_modele_cv:cvChoice,p_opening_style:openingChoice
      });
      if(error)throw error;
      setPresentationFeedback('Présentation enregistrée. Le modèle choisi est maintenant le modèle principal de votre CV.');
    } catch {
      setPresentationFeedback('Enregistrement impossible. Votre présentation actuelle est conservée.');
    } finally {setPresentationSaving(false);}
  };

  const savePalette = async () => {
    if (!user?.id || !stats[0]?.entreprise_id || paletteSaving) return;
    setPaletteSaving(true);setPaletteFeedback('');
    try {
      const {supabase} = await import('../lib/supabaseClient');
      const {error} = await supabase.rpc('dalil_update_my_cv_palette',{
        p_entreprise_id:stats[0].entreprise_id,p_palette:paletteChoice,
      });
      if (error) throw error;
      setPaletteFeedback('Couleur enregistrée pour le QR et les deux CV.');
    } catch {
      setPaletteFeedback('Couleur non enregistrée. La présentation actuelle est conservée.');
    } finally {setPaletteSaving(false);}
  };

  const submitProductProposal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id || productSaving) return;
    const entrepriseId = productBusiness || stats[0]?.entreprise_id;
    if (!entrepriseId || !stats.some(record => record.entreprise_id === entrepriseId)) return;
    const title = productTitle.trim();
    const category = productKind === 'gift_pack' ? 'Packs cadeaux' : productCategory.trim();
    const description = productDescription.trim();
    const price = Number(productPrice);
    if (!productPhoto) { setProductMessage('Ajoutez une photo pour proposer un article publiable.'); return; }
    if (!['image/jpeg','image/png','image/webp'].includes(productPhoto.type) || productPhoto.size > 5 * 1024 * 1024) {
      setProductMessage('Photo refusée : utilisez JPG, PNG ou WebP, 5 Mo maximum.'); return;
    }
    if (title.length < 2 || title.length > 120 || category.length > 60 || description.length > 800 ||
      (productKind === 'gift_pack' && (description.length < 5 || productMode !== 'order')) ||
      (productMode === 'order' && (!Number.isFinite(price) || price <= 0 || price > 100000))) {
      setProductMessage('Vérifiez le nom, la catégorie et le prix.'); return;
    }
    setProductSaving(true); setProductMessage('');
    let uploadedPath = '';
    try {
      const { supabase } = await import('../lib/supabaseClient');
      if (productPhoto) {
        const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'} as const)[productPhoto.type as 'image/jpeg'|'image/png'|'image/webp'];
        uploadedPath = user.id + '/' + crypto.randomUUID() + '.' + ext;
        const { error: uploadError } = await supabase.storage.from('dalil-boutique-submissions')
          .upload(uploadedPath,productPhoto,{upsert:false,contentType:productPhoto.type});
        if (uploadError) throw uploadError;
      }
      const {data,error} = await supabase.from('dalil_boutique_product_requests')
        .insert({user_id:user.id,entreprise_id:entrepriseId,title,description,category:category || null,
          mode:productMode,price:productMode === 'quote' ? null : price,photo_path:uploadedPath || null})
        .select('id,entreprise_id,title,status,created_at').single();
      if (error || !data) throw error ?? new Error('Insertion échouée');
      setProductRequests(current => [data,...current]);
      setProductTitle('');setProductCategory('');setProductDescription('');setProductPrice('');setProductPhoto(null);setProductPhotoInputKey(key => key + 1);
      setProductKind('product');
      setProductMessage('Proposition enregistrée. Elle reste en attente de validation avant toute publication.');
    } catch {
      if (uploadedPath) {
        try {
          const {supabase} = await import('../lib/supabaseClient');
          await supabase.storage.from('dalil-boutique-submissions').remove([uploadedPath]);
        } catch { /* Private orphan, never visible publicly */ }
      }
      setProductMessage('La proposition ou la photo n’a pas pu être enregistrée. Aucun produit n’a été publié.');
    } finally { setProductSaving(false); }
  };

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
    <div className={clientAppMode ? 'min-h-dvh bg-[#fbf8f0]' : 'min-h-screen bg-[#fbf8f0]'}>
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
        <div className={clientAppMode ? 'mx-auto max-w-xl px-4 py-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbf1df]">
                <Building2 className="h-6 w-6 text-[#8f2530]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {clientAppMode ? 'Mon compte' : 'Mon espace professionnel'}
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

      <div className={clientAppMode ? 'mx-auto max-w-xl px-3 py-3 pb-8' : 'mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'}>
        {!clientAppMode && <p className="mb-5 max-w-2xl text-sm text-[#684d47]">Retrouvez vos services professionnels dans un seul espace. L’accès aux informations d’une fiche nécessite une attribution vérifiée.</p>}
        <div className={clientAppMode ? 'flex flex-col gap-3' : 'flex flex-col gap-5 lg:flex-row'}>
          <div className={clientAppMode ? 'w-full' : 'w-full flex-shrink-0 lg:w-60'}>
            <nav className={clientAppMode ? 'grid grid-cols-2 gap-1 rounded-2xl border border-[#e8d9bd] bg-white p-2 shadow-sm' : 'grid grid-cols-2 gap-2 rounded-2xl border border-[#e8d9bd] bg-white p-3 shadow-sm sm:grid-cols-3 lg:flex lg:flex-col'} aria-label="Rubriques professionnelles">
              {([
                { id: 'showcase', label: 'Ma vitrine', Icon: Store },
                { id: 'boutique', label: 'Ma boutique', Icon: Package },
                { id: 'orders', label: 'Mes commandes', Icon: ClipboardList },
                { id: 'stats', label: 'Mes statistiques', Icon: BarChart3 },
              ] as const).map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm transition-colors ${clientAppMode ? 'flex-col justify-center px-1 py-2 text-center text-xs' : ''} ${activeTab === id ? 'bg-[#fbf1df] font-semibold text-[#8f2530]' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Icon className="h-5 w-5 shrink-0" /><span>{label}</span>
                </button>
              ))}
              {!clientAppMode && <>
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
              </>}
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
                    : statsError ? <div role="alert" className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-4 text-sm">
                        <p>Informations temporairement indisponibles. Votre compte professionnel reste accessible.</p>
                        <button type="button" onClick={()=>setStatsRetry(n=>n+1)} className="mt-3 min-h-11 rounded-xl border border-[#d8c394] bg-white px-4 py-2 font-semibold text-[#62212a]">Réessayer dans mon compte</button>
                      </div>
                    : stats.length === 0 ? <div className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-5">
                      <p className="font-semibold text-[#62212a]">Établissement non encore associé à votre compte</p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">Pour protéger les données professionnelles, Dalil Tounes doit vérifier votre établissement avant de vous donner accès à sa vitrine, sa boutique et ses statistiques.</p>
                    </div>
                    : <div className="space-y-4">{stats.map((record) => <div key={record.entreprise_id} className="rounded-xl border border-[#dfcda8] bg-[#fbf8f0] p-4 sm:p-5">
                      <p className="mb-3 break-all text-xs text-[#684d47]">{clientAppMode ? 'Établissement vérifié' : 'Établissement vérifié : ' + record.entreprise_id}</p>
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
                      </div> : activeTab === 'boutique'
                        ? <p className="text-sm leading-6 text-gray-700">Votre Boutique est identifiée. Proposez un produit dans le formulaire sécurisé ci-dessous ; aucune publication n'est automatique.</p>
                        : <p className="text-sm leading-6 text-gray-700">Votre établissement est identifié. Les modifications de vitrine seront activées après validation et modération.</p>}
                    </div>)}</div>}
                  {activeTab === 'showcase' && clientAppMode && stats.length > 0 && !statsLoading && !statsError && <div className="mt-4 rounded-xl border border-[#dfcda8] bg-white p-4">
                    <h3 className="font-semibold text-[#62212a]">Présentation de ma vitrine</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">Choisissez le CV principal et le style d'ouverture. Vous pouvez voir les deux modèles avant d'enregistrer.</p>
                    {presentationLoading ? <p role="status" className="mt-3 text-xs">Chargement…</p> : <>
                    <fieldset className="mt-4">
                      <legend className="mb-2 text-sm font-semibold text-[#513b37]">Modèle de CV</legend>
                      <div className="grid grid-cols-2 gap-2">
                        {(['portfolio','business'] as const).map(model=><button key={model} type="button" onClick={()=>{setCvChoice(model);setPresentationFeedback('')}}
                          aria-pressed={cvChoice===model} className={`min-h-11 rounded-xl border px-2 py-2 text-sm font-semibold ${cvChoice===model?'border-[#a88446] bg-[#fbf1df] text-[#62212a]':'border-[#dfcda8] bg-white text-gray-700'}`}>
                          {model==='portfolio'?'CV Portfolio':'CV Business'}
                        </button>)}
                      </div>
                    </fieldset>
                    <fieldset className="mt-4">
                      <legend className="mb-2 text-sm font-semibold text-[#513b37]">Couleur commune — QR et CV</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          ['prestige','Vert Prestige','#032D21','#fffdf7'],
                          ['ivory','Ivoire & Or','#FFF8E7','#3B3126'],
                          ['night','Bleu Nuit','#10243A','#F8F1E4'],
                        ] as const).map(([id,label,bg,fg])=><button key={id} type="button"
                          onClick={()=>{setPaletteChoice(id);setPaletteFeedback('')}}
                          aria-pressed={paletteChoice===id}
                          className={`min-h-12 rounded-xl border-2 px-2 py-2 text-xs font-semibold ${paletteChoice===id?'border-[#B3871F] ring-2 ring-[#B3871F]/35':'border-[#d7c7ab]'}`}
                          style={{backgroundColor:bg,color:fg}}>{label}</button>)}
                      </div>
                      <button type="button" onClick={()=>void savePalette()} disabled={paletteSaving}
                        className="mt-3 min-h-11 w-full rounded-xl border border-[#d8c394] bg-[#fbf1df] px-3 py-2 text-sm font-semibold text-[#62212a] disabled:opacity-50">
                        {paletteSaving?'Enregistrement…':'Appliquer cette couleur au QR et au CV'}
                      </button>
                      {paletteFeedback && <p role="status" className="mt-2 text-sm text-[#62212a]">{paletteFeedback}</p>}
                    </fieldset>
                    <fieldset className="mt-4">
                      <legend className="mb-2 text-sm font-semibold text-[#513b37]">Présentation du logo à l'ouverture</legend>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={()=>{setOpeningChoice('photo');setPresentationFeedback('')}} aria-pressed={openingChoice==='photo'}
                          className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-semibold ${openingChoice==='photo'?'border-[#a88446] bg-[#fbf1df] text-[#62212a]':'border-[#dfcda8] bg-white text-gray-700'}`}>
                          A — Photo + logo
                        </button>
                        <button type="button" onClick={()=>{setOpeningChoice('framed');setPresentationFeedback('')}} aria-pressed={openingChoice==='framed'}
                          className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-semibold ${openingChoice==='framed'?'border-[#a88446] bg-[#fbf1df] text-[#62212a]':'border-[#dfcda8] bg-white text-gray-700'}`}>
                          B — Logo encadré
                        </button>
                      </div>
                    </fieldset>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`/${encodeURIComponent(window.location.pathname.split('/')[1])}/cv?preview-model=${cvChoice}&palette=${paletteChoice}&skip-opening=1`}
                        className="inline-flex min-h-10 items-center rounded-xl border border-[#d8c394] px-3 py-2 text-xs font-semibold text-[#573e36]">Voir le CV</a>
                      <a href={`/${encodeURIComponent(window.location.pathname.split('/')[1])}?opening-preview=1&opening-style=${openingChoice}`}
                        className="inline-flex min-h-10 items-center rounded-xl border border-[#d8c394] px-3 py-2 text-xs font-semibold text-[#573e36]">Voir l'ouverture {openingChoice==='photo'?'A':'B'}</a>
                    </div>
                    <button type="button" onClick={()=>void savePresentation()} disabled={presentationSaving}
                      className="mt-4 min-h-11 w-full rounded-xl bg-[#8f2530] px-4 py-2 font-semibold text-white disabled:opacity-50">
                      {presentationSaving?'Enregistrement…':'Enregistrer mes choix'}
                    </button>
                    {presentationFeedback && <p role="status" className="mt-2 text-sm text-[#62212a]">{presentationFeedback}</p>}
                    </>}
                  </div>}
                  {activeTab === 'boutique' && stats.length > 0 && !statsLoading && !statsError && <>
                    <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Gestion de la boutique">
                      <button type="button" aria-expanded={boutiquePanel==='manage'}
                        onClick={()=>setBoutiquePanel(current=>current==='manage'?null:'manage')}
                        className="min-h-11 rounded-xl border border-[#dfcda8] bg-white px-3 py-2 text-sm font-semibold text-[#62212a]">
                        {boutiquePanel==='manage'?'− Fermer':'＋ Gérer mes articles'}
                      </button>
                      <button type="button" aria-expanded={boutiquePanel==='create'}
                        onClick={()=>setBoutiquePanel(current=>current==='create'?null:'create')}
                        className="min-h-11 rounded-xl border border-[#dfcda8] bg-white px-3 py-2 text-sm font-semibold text-[#62212a]">
                        {boutiquePanel==='create'?'− Fermer':'＋ Ajouter un article'}
                      </button>
                      <button type="button" aria-expanded={boutiquePanel==='sales'}
                        onClick={()=>setBoutiquePanel(current=>current==='sales'?null:'sales')}
                        className="col-span-2 min-h-11 rounded-xl border border-[#c6ad79] bg-[#fbf1df] px-3 py-2 text-sm font-semibold text-[#62212a]">
                        {boutiquePanel==='sales'?'− Fermer Ventes & Fidélité':'＋ Ventes & Fidélité'}
                      </button>
                    </div>
                    {boutiquePanel==='manage' && user &&
                      <BoutiqueProductManagement entrepriseIds={stats.map(record => record.entreprise_id)} userId={user.id} />}
                    {boutiquePanel==='sales' && <SalesLoyaltyManagement entrepriseIds={stats.map(record => record.entreprise_id)} />}
                  </>}
                  {activeTab === 'boutique' && boutiquePanel==='create' && stats.length > 0 && !statsLoading && !statsError && <div className="mt-3 rounded-xl border border-[#dfcda8] bg-white p-4 sm:p-5">
                    <h3 className="mb-2 font-semibold text-[#62212a]">Proposer un produit ou un pack cadeau</h3>
                    <p className="mb-4 text-sm text-gray-600">Même formulaire et même Boutique : le commerçant fixe librement son prix. Les nouveaux articles sont validés avant publication.</p>
                    <form onSubmit={submitProductProposal} className="grid gap-3">
                      <fieldset className="grid gap-2">
                        <legend className="mb-1 text-sm font-semibold text-[#62212a]">Je propose</legend>
                        <div className="grid grid-cols-2 gap-2">
                          {([['product','Un produit'],['gift_pack','Un pack cadeau']] as const).map(([value,label])=>
                            <button key={value} type="button" aria-pressed={productKind===value}
                              onClick={()=>{setProductKind(value);setProductMessage('');setProductMode('order');}}
                              className={`min-h-11 rounded-xl border px-2 py-2 text-sm ${productKind===value?'border-[#b28b43] bg-[#fbf1df] font-semibold text-[#62212a]':'border-[#dfcda8] bg-white text-gray-700'}`}>
                              {label}
                            </button>)}
                        </div>
                      </fieldset>
                      {stats.length > 1 && <label className="grid gap-1 text-sm">Établissement
                        <select className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productBusiness || stats[0].entreprise_id} onChange={e => setProductBusiness(e.target.value)}>
                          {stats.map(record => <option key={record.entreprise_id} value={record.entreprise_id}>{record.entreprise_id}</option>)}
                        </select>
                      </label>}
                      <label className="grid gap-1 text-sm">{productKind==='gift_pack'?'Nom du pack cadeau':'Nom du produit'}
                        <input required minLength={2} maxLength={120} className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productTitle} onChange={e => setProductTitle(e.target.value)} placeholder={productKind==='gift_pack'?'Ex. Coffret gourmand':'Ex. Plateaux traiteur'} />
                      </label>
                      {productKind==='product' && <label className="grid gap-1 text-sm">Catégorie (facultative)
                        <input maxLength={60} className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productCategory} onChange={e => setProductCategory(e.target.value)} placeholder="Ex. Traiteur, Desserts, Créations" />
                      </label>}
                      {productKind==='product' && <label className="grid gap-1 text-sm">Type de demande
                        <select className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productMode} onChange={e => setProductMode(e.target.value as 'quote'|'order')}>
                          <option value="quote">Sur devis</option><option value="order">Commande avec prix indicatif</option>
                        </select>
                      </label>}
                      {(productMode === 'order' || productKind==='gift_pack') && <label className="grid gap-1 text-sm">{productKind==='gift_pack'?'Prix du pack en TND (choisi par vous)':'Prix en TND'}
                        <input required type="number" min="0.01" max="100000" step="0.01" className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
                      </label>}
                      <label className="grid gap-1 text-sm">{productKind==='gift_pack'?'Contenu du pack (produits ou prestations inclus)':'Description'}
                        <textarea rows={3} required={productKind==='gift_pack'} minLength={productKind==='gift_pack'?5:undefined} maxLength={800} className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" value={productDescription} onChange={e => setProductDescription(e.target.value)} placeholder={productKind==='gift_pack'?'Ex. Pâtisseries, dattes et chocolats ; préciser les quantités.':''} />
                      </label>
                      <label className="grid gap-1 text-sm">Photo requise pour publication (JPG, PNG ou WebP, 5 Mo max.)
                        <input required key={productPhotoInputKey} type="file" accept="image/jpeg,image/png,image/webp" className="rounded-lg border border-[#dfcda8] bg-white p-3 text-gray-900" onChange={event => setProductPhoto(event.target.files?.[0] ?? null)} />
                      </label>
                      <button disabled={productSaving} className="rounded-xl bg-[#8f2530] p-3 font-semibold text-white disabled:opacity-50" type="submit">{productSaving ? 'Envoi…' : 'Soumettre à validation'}</button>
                      {productMessage && <p role="status" className="text-sm text-[#62212a]">{productMessage}</p>}
                    </form>
                    {productRequests.length > 0 && <div className="mt-5 border-t border-[#dfcda8] pt-4">
                      <h4 className="mb-2 font-semibold text-[#62212a]">Mes propositions récentes</h4>
                      <ul className="space-y-2">{productRequests.map(request => <li key={request.id} className="flex justify-between gap-3 rounded-lg bg-[#fbf8f0] p-3 text-sm">
                        <span className="break-words">{request.title}</span><span className="shrink-0 text-[#62212a]">{request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Validée' : 'Refusée'}</span>
                      </li>)}</ul>
                    </div>}
                  </div>}
                  {activeTab === 'stats' && <p className="mt-3 text-xs text-gray-600">Un abonnement représente un appareil ou navigateur, pas nécessairement une personne. Les visites et demandes non suivies affichent « — ».</p>}

                </section>
              )}
              {activeTab === 'orders' && (
                <section aria-live="polite">
                  {statsLoading ? <p role="status" className="text-sm text-gray-600">Vérification des droits d’accès…</p>
                    : statsError ? <div role="alert" className="rounded-xl bg-[#fff7e8] p-4 text-sm">Vérification des établissements momentanément indisponible.
                        <button type="button" onClick={()=>setStatsRetry(n=>n+1)} className="ml-2 underline">Réessayer</button>
                      </div>
                    : stats.length===0 ? <p className="rounded-xl bg-[#fbf8f0] p-4 text-sm text-[#684d47]">Aucun établissement encore associé à ce compte. L’accès aux commandes nécessite une attribution vérifiée.</p>
                    : <div className="space-y-4">
                        {stats.map(record => <BoutiqueMerchantOrderAlerts key={record.entreprise_id} profileId={record.entreprise_id}/>)}
                        <BoutiqueCustomerOrders entrepriseIds={stats.map(record=>record.entreprise_id)} />
                      </div>}
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
