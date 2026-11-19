import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import LoginForm from '../components/auth/LoginForm';
import CompanyDashboard from './CompanyDashboard';

function safeSlug(slug?:string) { return (slug || '').trim().toLowerCase(); }

export function ClientAccountLogin() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading}=useAuth();
  const navigate = useNavigate();
  const accountPath = '/' + encodeURIComponent(slug || '') + '/compte';
  const cvPath = '/' + encodeURIComponent(slug || '') + '/cv?preview-model=business&skip-opening=1';
  const qrPath = '/' + encodeURIComponent(slug || '');
  if (!slug || window.location.hostname !== 'app.dalil-tounes.com') return <p>Page indisponible.</p>;
  if (loading) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification…</main>;
  if (user) return <div className="min-h-dvh bg-[#fbf8f0] p-5"><Link to={accountPath} className="inline-block rounded-xl border border-[#d7bf8a] bg-white px-4 py-3 text-[#552c30]">Ouvrir mon compte professionnel</Link></div>;
  return <main className="min-h-dvh bg-[#fbf8f0] px-4 py-6 text-[#4b302f]">
    <div className="mx-auto max-w-md">
      <div className="mb-5 flex flex-wrap gap-4 text-sm"><Link to={cvPath} className="inline-flex min-h-11 items-center underline">← Retour à ma vitrine</Link><Link to={qrPath} className="inline-flex min-h-11 items-center underline">Retour au QR code</Link></div>
      <div className="mb-4 text-center"><h1 className="font-serif text-xl font-semibold">Mon compte professionnel</h1><p className="mt-2 text-sm">Utilisez votre compte Dalil Tounes existant. Aucun nouveau compte n’est nécessaire.</p></div>
      <LoginForm onSuccess={()=>navigate(accountPath,{replace:true})} onSwitchToSignup={()=>{}} allowSignup={false} />
    </div>
  </main>;
}

export default function ClientAccount() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading,signOut}=useAuth();
  const navigate=useNavigate();
  const [state,setState]=useState<'checking'|'allowed'|'denied'|'error'>('checking');
  const [retry,setRetry]=useState(0);
  const accountLogin='/' + encodeURIComponent(slug || '') + '/connexion';
  const cvPath='/' + encodeURIComponent(slug || '') + '/cv?preview-model=business&skip-opening=1';
  const qrPath='/' + encodeURIComponent(slug || '');
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
  if(!slug || window.location.hostname!=='app.dalil-tounes.com') return <p>Page indisponible.</p>;
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
      <p role="alert">Le compte actuellement connecté n’a pas accès à cette vitrine.</p>
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
