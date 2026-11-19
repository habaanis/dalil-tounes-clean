import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { isDedicatedClientHostname } from '../lib/clientAppUrl';
import LoginForm from '../components/auth/LoginForm';
import CompanyDashboard from './CompanyDashboard';

function safeSlug(slug?:string) { return (slug || '').trim().toLowerCase(); }

export function ClientAccountLogin() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading,signUp,signOut}=useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetReturn = new URLSearchParams(location.search).get('reset') === '1';
  const [mode,setMode]=useState<'login'|'signup'|'recovery'>('login');
  const [recoverySent,setRecoverySent]=useState(false);
  const [switchingExistingAccount,setSwitchingExistingAccount]=useState(false);
  const [recoveryBusy,setRecoveryBusy]=useState(false);
  const [recoveryError,setRecoveryError]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [confirmNewPassword,setConfirmNewPassword]=useState('');
  const [resetBusy,setResetBusy]=useState(false);
  const [resetError,setResetError]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [signupError,setSignupError]=useState('');
  const [signupDone,setSignupDone]=useState(false);
  const returnModel = new URLSearchParams(location.search).get('return-model');
  const selectedModel = returnModel === 'portfolio' || returnModel === 'business' ? returnModel : null;
  // Explicitly preserve preview routing across full-page navigation (some mobile
  // browsers do not keep sessionStorage when switching between account and CV).
  const clientPreview = window.location.hostname !== 'app.dalil-tounes.com'
    && isDedicatedClientHostname(window.location.hostname);
  const previewQuery = clientPreview ? '&client-preview=1' : '';
  const accountPath = '/' + encodeURIComponent(slug || '') + '/compte'
    + '?return-model=' + (selectedModel || '') + previewQuery;
  // The account is not a model preview: return to the CV saved for this merchant.
  // Never replay an old Business selection from a QR/account URL.
  const cvPath = '/' + encodeURIComponent(slug || '') + '/cv?skip-opening=1' + previewQuery;
  const qrPath = '/' + encodeURIComponent(slug || '') + (clientPreview ? '?client-preview=1' : '');
  const navigation = <nav aria-label="Retour à ma mini-application" className="mb-5 flex flex-wrap gap-4 text-sm">
    <Link to={cvPath} className="inline-flex min-h-11 items-center underline">← Retour à ma vitrine</Link>
    <Link to={qrPath} className="inline-flex min-h-11 items-center underline">Retour au QR code</Link>
  </nav>;
  const createAccount = async(event:React.FormEvent)=>{
    event.preventDefault();
    if(submitting)return;
    setSignupError('');
    if(password.length<6){setSignupError('Le mot de passe doit comporter au moins 6 caractères.');return;}
    if(password!==confirm){setSignupError('Les deux mots de passe ne correspondent pas.');return;}
    setSubmitting(true);
    try{
      const {user:created,error}=await signUp(email.trim().toLowerCase(),password,'company');
      if(error)throw error;
      if(!created)throw new Error('La création du compte n’a pas pu être confirmée.');
      // A new identity must NEVER receive access to a business automatically.
      // The identity can later be approved by the existing professional-access process.
      setSignupDone(true);
    }catch(error){
      const message=error instanceof Error ? error.message : 'Inscription indisponible.';
      setSignupError(/already.registered|already.been.registered|user.already.exists/i.test(message)
        ? 'Cette adresse possède déjà un compte. Utilisez « Se connecter ».'
        : message);
    }finally{setSubmitting(false);}
  };
  const requestRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    if (recoveryBusy) return;
    setRecoveryBusy(true);
    setRecoveryError('');
    try {
      const recoveryUrl = new URL(location.pathname, window.location.origin);
      recoveryUrl.searchParams.set('reset', '1');
      const {error} = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: recoveryUrl.toString(),
      });
      if (error) throw error;
      // Deliberately do not reveal whether the address exists.
      setRecoverySent(true);
    } catch {
      setRecoveryError('Le lien ne peut pas être envoyé pour le moment. Réessayez plus tard.');
    } finally {
      setRecoveryBusy(false);
    }
  };
  const saveRecoveredPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (resetBusy) return;
    if (newPassword.length < 8) { setResetError('Choisissez au moins 8 caractères.'); return; }
    if (newPassword !== confirmNewPassword) { setResetError('Les mots de passe ne correspondent pas.'); return; }
    setResetBusy(true);
    setResetError('');
    try {
      const {error} = await supabase.auth.updateUser({password: newPassword});
      if (error) throw error;
      // Force a fresh sign-in to make the success state unambiguous.
      await signOut();
      navigate(location.pathname, {replace:true});
    } catch {
      setResetError('La modification a échoué. Le lien a peut-être expiré. Demandez-en un nouveau.');
    } finally {
      setResetBusy(false);
    }
  };
  if(!slug || !isDedicatedClientHostname(window.location.hostname))return <p>Page indisponible.</p>;
  if(loading)return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification de la session…</main>;
  if(isResetReturn)return <main className="min-h-dvh bg-[#fbf8f0] px-4 py-6 text-[#4b302f]">
    <div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5">
      <h1 className="font-serif text-xl font-semibold">Choisir un nouveau mot de passe</h1>
      {!user ? <p className="my-4 text-sm">Ce lien a expiré ou n'a pas ouvert de session. Retournez à la connexion pour demander un nouveau lien.</p> :
        <form onSubmit={e=>void saveRecoveredPassword(e)} className="mt-4 space-y-3">
          <label className="block text-sm">Nouveau mot de passe<input type="password" minLength={8} required autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
          <label className="block text-sm">Confirmer le mot de passe<input type="password" minLength={8} required autoComplete="new-password" value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
          {resetError&&<p role="alert" className="text-sm text-red-700">{resetError}</p>}
          <button type="submit" disabled={resetBusy} className="min-h-11 w-full rounded-xl bg-[#8f2530] px-4 text-white disabled:opacity-60">{resetBusy?'Enregistrement…':'Enregistrer le mot de passe'}</button>
        </form>}
      <Link to={location.pathname} className="mt-4 inline-flex min-h-11 items-center underline">Revenir à la connexion</Link>
    </div>
  </main>;
  if(user)return <main className="min-h-dvh bg-[#fbf8f0] p-5 text-[#4b302f]">
    <div className="mx-auto max-w-md">{navigation}
      <p className="mb-3 text-sm">Connecté : <strong className="break-all">{user.email || 'Compte actif'}</strong></p>
      <Link to={accountPath} className="inline-flex min-h-11 items-center rounded-xl bg-[#8f2530] px-5 text-white">Accéder à mon compte</Link>
      <button type="button" disabled={switchingExistingAccount} onClick={()=>{setSwitchingExistingAccount(true);void signOut().finally(()=>setSwitchingExistingAccount(false));}}
        className="mt-3 block min-h-11 text-sm underline disabled:opacity-60">{switchingExistingAccount?'Déconnexion…':'Se connecter avec un autre compte'}</button>
    </div>
  </main>;
  return <main className="min-h-dvh bg-[#fbf8f0] px-4 py-6 text-[#4b302f]">
    <div className="mx-auto max-w-md">{navigation}
      <h1 className="mb-2 text-center font-serif text-xl font-semibold">Mon compte professionnel</h1>
      <p className="mb-4 text-center text-sm">Un compte Dalil Tounes suffit. Connectez-vous avec celui déjà associé à votre activité.</p>
      <div className="mb-4 grid grid-cols-2 gap-2" aria-label="Choix du parcours">
        <button type="button" onClick={()=>{setMode('login');setSignupError('');}} aria-pressed={mode==='login'}
          className={mode==='login'?'rounded-xl bg-[#8f2530] px-3 py-3 text-white':'rounded-xl border border-[#d9c59d] bg-white px-3 py-3'}>Se connecter</button>
        <button type="button" onClick={()=>{setMode('signup');setSignupError('');}} aria-pressed={mode==='signup'}
          className={mode==='signup'?'rounded-xl bg-[#8f2530] px-3 py-3 text-white':'rounded-xl border border-[#d9c59d] bg-white px-3 py-3'}>Créer un compte</button>
      </div>
      {mode==='login' ? <div>
          <LoginForm onSuccess={()=>navigate(accountPath,{replace:true})} onSwitchToSignup={()=>setMode('signup')} allowSignup={false}/>
          <button type="button" onClick={()=>{setMode('recovery');setRecoverySent(false);setRecoveryError('');}}
            className="mt-3 min-h-11 w-full text-center text-sm underline">Mot de passe oublié ?</button>
        </div> : mode==='recovery' ?
        <div className="rounded-2xl border border-[#d9c59d] bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Retrouver mon compte</h2>
          {recoverySent ? <p role="status" className="mt-3 text-sm">Si cette adresse correspond à un compte, un lien de réinitialisation vous a été envoyé. Vérifiez également les courriers indésirables.</p> :
            <form onSubmit={e=>void requestRecovery(e)} className="mt-3 space-y-3">
              <label className="block text-sm">E-mail du compte<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
              {recoveryError&&<p role="alert" className="text-sm text-red-700">{recoveryError}</p>}
              <button type="submit" disabled={recoveryBusy} className="min-h-11 w-full rounded-xl bg-[#8f2530] px-4 text-white disabled:opacity-60">{recoveryBusy?'Envoi…':'Recevoir un lien par e-mail'}</button>
            </form>}
          <button type="button" onClick={()=>{setMode('login');setRecoverySent(false);}} className="mt-4 min-h-11 w-full text-sm underline">Retour à la connexion</button>
        </div> :
        signupDone ? <div role="status" className="rounded-2xl border border-[#d9c59d] bg-white p-5">
          <p className="font-semibold">Compte créé.</p>
          <p className="mt-2 text-sm">Vérifiez votre e-mail si une confirmation est demandée. Le compte n’est pas encore autorisé à gérer cette vitrine : le rattachement doit être vérifié. Vous pouvez revenir à la vitrine à tout moment.</p>
          <button type="button" onClick={()=>{setSignupDone(false);setMode('login');}} className="mt-4 min-h-11 rounded-xl bg-[#8f2530] px-4 text-white">Se connecter</button>
        </div> :
        <form onSubmit={e=>void createAccount(e)} className="space-y-3 rounded-2xl border border-[#d9c59d] bg-white p-5">
          <h2 className="font-semibold">Créer mon compte Dalil Tounes</h2>
          <p className="text-sm">Si votre entreprise possède déjà un compte, utilisez plutôt « Se connecter ». Une nouvelle inscription ne rattache pas automatiquement une vitrine existante.</p>
          <label className="block text-sm">E-mail<input autoComplete="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
          <label className="block text-sm">Mot de passe<input autoComplete="new-password" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
          <label className="block text-sm">Confirmer le mot de passe<input autoComplete="new-password" type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9c59d] px-3"/></label>
          {signupError&&<p role="alert" className="text-sm text-red-700">{signupError}</p>}
          <button type="submit" disabled={submitting} className="min-h-11 w-full rounded-xl bg-[#8f2530] px-4 text-white disabled:opacity-60">{submitting?'Création…':'Créer mon compte'}</button>
        </form>}
    </div>
  </main>;
}

export default function ClientAccount() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading,signOut}=useAuth();
  const navigate=useNavigate();
  const location = useLocation();
  const returnModel = new URLSearchParams(location.search).get('return-model');
  const selectedModel = returnModel === 'portfolio' || returnModel === 'business' ? returnModel : null;
  const clientPreview = window.location.hostname !== 'app.dalil-tounes.com'
    && isDedicatedClientHostname(window.location.hostname);
  const previewQuery = clientPreview ? '&client-preview=1' : '';
  const preservedModel = '?return-model=' + (selectedModel || '') + previewQuery;
  const [state,setState]=useState<'checking'|'allowed'|'denied'|'error'>('checking');
  const [retry,setRetry]=useState(0);
  const accountLogin='/' + encodeURIComponent(slug || '') + '/connexion' + preservedModel;
  // The saved business model wins on return (Portfolio for Aux Saveurs d'Anis).
  const cvPath='/' + encodeURIComponent(slug || '') + '/cv?skip-opening=1' + previewQuery;
  const qrPath='/' + encodeURIComponent(slug || '') + (clientPreview ? '?client-preview=1' : '');
  const returnLinks=(<nav aria-label="Retour à la mini-application" className="mt-4 flex flex-wrap justify-center gap-4 text-sm"><Link className="inline-flex min-h-11 items-center underline" to={cvPath}>Retour à ma vitrine</Link><Link className="inline-flex min-h-11 items-center underline" to={qrPath}>Retour au QR code</Link></nav>);
  const [switchingAccount,setSwitchingAccount]=useState(false);
  const switchAccount=async()=>{
    if(switchingAccount)return;
    setSwitchingAccount(true);
    try{
      await signOut();
      navigate(accountLogin,{replace:true});
    }catch{
      setState('error');
    }finally{
      setSwitchingAccount(false);
    }
  };
  useEffect(()=>{
    let active=true;
    setState('checking');
    if (!user?.id || !slug) return;
    const key=safeSlug(slug);
    void (async()=>{
      const [{data:short,error:shortError},{data:long,error:longError}] = await Promise.all([
        supabase.from('entreprise').select('id').eq('slug_court',key).maybeSingle(),
        supabase.from('entreprise').select('id').eq('slug',key).maybeSingle(),
      ]);
      if (shortError || longError) { if(active)setState('error'); return; }
      const businessId=short?.id || long?.id || (/^[0-9a-f-]{36}$/i.test(key)?key:null);
      if (!businessId) { if(active)setState('denied'); return; }
      const {data,error}=await supabase.from('professional_profile_access')
        .select('entreprise_id').eq('user_id',user.id).eq('entreprise_id',businessId).maybeSingle();
      if(active)setState(error ? 'error' : data ? 'allowed':'denied');
    })().catch(()=>{if(active)setState('error')});
    return ()=>{active=false};
  },[slug,user?.id,retry]);
  if(!slug || !isDedicatedClientHostname(window.location.hostname)) return <p>Page indisponible.</p>;
  if(loading || (user && state==='checking')) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification de votre accès…</main>;
  if(!user) return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-[#4b302f]"><div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5 text-center"><h1 className="font-serif text-xl">Mon compte professionnel</h1><p className="my-4 text-sm">Connectez-vous pour retrouver votre espace privé.</p><Link className="inline-flex min-h-11 items-center rounded-full bg-[#8f2530] px-5 text-white" to={accountLogin}>Se connecter</Link>{returnLinks}</div></main>;
  if(state==='error')return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-center text-[#4b302f]">
    <div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5">
      <p role="alert">Le compte professionnel n’a pas pu être chargé. Vous pouvez réessayer sans quitter cet espace.</p>
      <button type="button" onClick={()=>setRetry(n=>n+1)} className="mt-4 min-h-11 rounded-xl bg-[#8f2530] px-5 text-white">Réessayer mon compte</button>
      <Link className="mt-3 block min-h-11 rounded-xl border border-[#d9c59d] px-4 py-3" to={accountLogin}>Revenir à la connexion professionnelle</Link>
      {returnLinks}
    </div>
  </main>;
  if(state!=='allowed')return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-center text-[#4b302f]">
    <div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5">
      <p role="alert">Ce compte n’est pas encore autorisé à gérer cette vitrine.</p>
      <p className="mt-2 break-all text-xs">Compte connecté : <strong>{user.email || 'compte sans e-mail disponible'}</strong></p>
      <p className="mt-2 text-sm text-[#655b51]">Si vous avez plusieurs comptes Dalil Tounes, connectez-vous avec celui associé à cet établissement. Aucune nouvelle inscription n’est nécessaire.</p>
      <button type="button" disabled={switchingAccount} onClick={()=>void switchAccount()}
        className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#8f2530] px-5 text-white disabled:opacity-60">
        {switchingAccount?'Déconnexion…':'Se connecter avec un autre compte'}
      </button>
      {returnLinks}
    </div>
  </main>;
  return <div className="min-h-dvh bg-[#fbf8f0] pb-[env(safe-area-inset-bottom)]"><div className="mx-auto max-w-7xl px-4 pt-3">{returnLinks}</div><CompanyDashboard clientAppMode onNavigate={(page)=>{if(page==='home')navigate(cvPath);}} /></div>;
}
