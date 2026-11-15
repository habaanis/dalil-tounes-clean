import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import CompanyDashboard from './CompanyDashboard';

function safeSlug(slug?:string) { return (slug || '').trim().toLowerCase(); }

export function ClientAccountLogin() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading}=useAuth();
  const navigate = useNavigate();
  const [mode,setMode]=useState<'login'|'signup'>('login');
  const accountPath = '/' + encodeURIComponent(slug || '') + '/compte';
  if (!slug || window.location.hostname !== 'app.dalil-tounes.com') return <p>Page indisponible.</p>;
  if (loading) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification…</main>;
  if (user) return <div className="min-h-dvh bg-[#fbf8f0] p-5"><Link to={accountPath} className="inline-block rounded-xl border border-[#d7bf8a] bg-white px-4 py-3 text-[#552c30]">Ouvrir mon compte professionnel</Link></div>;
  return <main className="min-h-dvh bg-[#fbf8f0] px-4 py-6 text-[#4b302f]">
    <div className="mx-auto max-w-md">
      <Link to={'/'+encodeURIComponent(slug)} className="mb-5 inline-flex min-h-11 items-center text-sm underline">← Retour à ma vitrine</Link>
      <div className="mb-4 text-center"><h1 className="font-serif text-xl font-semibold">Mon compte professionnel</h1><p className="mt-2 text-sm">Utilisez votre compte Dalil Tounes existant. Aucun nouveau compte n’est nécessaire.</p></div>
      {mode==='login'
        ? <LoginForm onSuccess={()=>navigate(accountPath,{replace:true})} onSwitchToSignup={()=>setMode('signup')} />
        : <SignupForm onSuccess={()=>navigate(accountPath,{replace:true})} onSwitchToLogin={()=>setMode('login')} />}
    </div>
  </main>;
}

export default function ClientAccount() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading}=useAuth();
  const navigate=useNavigate();
  const [state,setState]=useState<'checking'|'allowed'|'denied'>('checking');
  const accountLogin='/' + encodeURIComponent(slug || '') + '/connexion';
  useEffect(()=>{
    let active=true;
    setState('checking');
    if (!user?.id || !slug) return;
    const key=safeSlug(slug);
    void (async()=>{
      const [{data:short},{data:long}] = await Promise.all([
        supabase.from('entreprise').select('id').eq('slug_court',key).maybeSingle(),
        supabase.from('entreprise').select('id').eq('slug',key).maybeSingle(),
      ]);
      const businessId=short?.id || long?.id || (/^[0-9a-f-]{36}$/i.test(key)?key:null);
      if (!businessId) { if(active)setState('denied'); return; }
      const {data,error}=await supabase.from('professional_profile_access')
        .select('entreprise_id').eq('user_id',user.id).eq('entreprise_id',businessId).maybeSingle();
      if(active)setState(!error && data ? 'allowed':'denied');
    })().catch(()=>{if(active)setState('denied')});
    return ()=>{active=false};
  },[slug,user?.id]);
  if(!slug || window.location.hostname!=='app.dalil-tounes.com') return <p>Page indisponible.</p>;
  if(loading || (user && state==='checking')) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification de votre accès…</main>;
  if(!user) return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-[#4b302f]"><div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5 text-center"><h1 className="font-serif text-xl">Mon compte professionnel</h1><p className="my-4 text-sm">Connectez-vous pour retrouver votre espace privé.</p><Link className="inline-flex min-h-11 items-center rounded-full bg-[#8f2530] px-5 text-white" to={accountLogin}>Se connecter</Link></div></main>;
  if(state!=='allowed')return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-center text-[#4b302f]"><p>Ce compte n’est pas associé à cette vitrine.</p><Link className="mt-4 inline-block underline" to={'/'+encodeURIComponent(slug)}>Retour à la vitrine</Link></main>;
  return <div className="min-h-dvh bg-[#fbf8f0] pb-[env(safe-area-inset-bottom)]"><div className="mx-auto max-w-7xl px-4 pt-3"><Link className="inline-flex min-h-11 items-center text-sm underline" to={'/'+encodeURIComponent(slug)}>← Retour à ma vitrine</Link></div><CompanyDashboard clientAppMode onNavigate={(page)=>{if(page==='home')navigate('/'+encodeURIComponent(slug));}} /></div>;
}
