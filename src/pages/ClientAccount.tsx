import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import CompanyDashboard from './CompanyDashboard';

function safeSlug(slug?:string) { return (slug || '').trim().toLowerCase(); }

// Respect the CV the professional actually came from, not a fixed Business link.
// The QR supplies ?cv=; the CV route remembers explicit Portfolio/Business selection.
// If neither is available, use the published default model when it is known.
type CvModel = 'business' | 'portfolio';
function selectedCvModel(slug:string|undefined,search:string,defaultModel:CvModel='business'):CvModel {
  const explicit=new URLSearchParams(search).get('cv');
  if(explicit==='business'||explicit==='portfolio')return explicit;
  try {
    const remembered=window.sessionStorage.getItem('dalil-return-cv:'+safeSlug(slug));
    if(remembered==='business'||remembered==='portfolio')return remembered;
  } catch { /* Private or embedded browsers can block storage. */ }
  return defaultModel;
}
function cvReturnPath(slug:string|undefined,model:CvModel):string {
  return '/' + encodeURIComponent(slug || '') + '/cv?preview-model=' + model + '&skip-opening=1';
}
function withCvContext(path:string,model:CvModel,search=''):string {
  const query=new URLSearchParams();
  query.set('cv',model);
  if(new URLSearchParams(search).get('tab')==='orders')query.set('tab','orders');
  return path + '?' + query.toString();
}

export function ClientAccountLogin() {
  const {slug} = useParams<{slug:string}>();
  const {user,loading}=useAuth();
  const navigate = useNavigate();
  const {search}=useLocation();
  const returnModel=selectedCvModel(slug,search);
  const [mode,setMode]=useState<'login'|'signup'>('login');
  const accountPath = withCvContext('/' + encodeURIComponent(slug || '') + '/compte',returnModel,search);
  const cvPath = cvReturnPath(slug,returnModel);
  if (!slug || window.location.hostname !== 'app.dalil-tounes.com') return <p>Page indisponible.</p>;
  if (loading) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification…</main>;
  if (user) return <div className="min-h-dvh bg-[#fbf8f0] p-5"><Link to={accountPath} className="inline-block rounded-xl border border-[#d7bf8a] bg-white px-4 py-3 text-[#552c30]">Ouvrir mon compte professionnel</Link></div>;
  return <main className="min-h-dvh bg-[#fbf8f0] px-4 py-6 text-[#4b302f]">
    <div className="mx-auto max-w-md">
      <Link to={cvPath} className="mb-5 inline-flex min-h-11 items-center text-sm underline">← Retour à mon CV {returnModel==='portfolio'?'Portfolio':'Business'}</Link>
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
  const {search}=useLocation();
  const [publishedModel,setPublishedModel]=useState<CvModel>('business');
  const [savedModel,setSavedModel]=useState<CvModel|null>(null);
  // Once the professional saves a choice, it wins over the old ?cv= return context.
  const returnModel=savedModel ?? selectedCvModel(slug,search,publishedModel);
  const onPresentationSaved=(model:CvModel)=>{
    setSavedModel(model);
    setPublishedModel(model);
    try { window.sessionStorage.setItem('dalil-return-cv:'+safeSlug(slug),model); }
    catch { /* storage may be unavailable in an embedded browser */ }
    // Keep browser history and subsequent account links aligned with the new model.
    const query=new URLSearchParams(search);
    query.set('cv',model);
    navigate({search:'?'+query.toString()},{replace:true});
  };
  const [state,setState]=useState<'checking'|'allowed'|'denied'|'error'>('checking');
  const [retry,setRetry]=useState(0);
  const [accountId,setAccountId]=useState('');
  const accountLogin=withCvContext('/' + encodeURIComponent(slug || '') + '/connexion',returnModel,search);
  const cvPath=cvReturnPath(slug,returnModel);
  useEffect(()=>{
    let active=true;
    setState('checking');
    if (!user?.id || !slug) return;
    const key=safeSlug(slug);
    void (async()=>{
      const [{data:short,error:shortError},{data:long,error:longError}] = await Promise.all([
        supabase.from('entreprise').select('id,modele_cv').eq('slug_court',key).maybeSingle(),
        supabase.from('entreprise').select('id,modele_cv').eq('slug',key).maybeSingle(),
      ]);
      if (shortError || longError) { if(active)setState('error'); return; }
      const businessId=short?.id || long?.id || (/^[0-9a-f-]{36}$/i.test(key)?key:null);
      const savedModel=String(short?.modele_cv || long?.modele_cv || '').toLowerCase();
      if(active && savedModel)setPublishedModel(savedModel.includes('portfolio')?'portfolio':'business');
      if (!businessId) { if(active)setState('denied'); return; }
      const {data,error}=await supabase.from('professional_profile_access')
        .select('entreprise_id').eq('user_id',user.id).eq('entreprise_id',businessId).maybeSingle();
      if(active){setAccountId(data ? businessId : '');setState(error ? 'error' : data ? 'allowed':'denied');}
    })().catch(()=>{if(active)setState('error')});
    return ()=>{active=false};
  },[slug,user?.id,retry]);
  if(!slug || window.location.hostname!=='app.dalil-tounes.com') return <p>Page indisponible.</p>;
  if(loading || (user && state==='checking')) return <main role="status" className="min-h-dvh bg-[#fbf8f0] p-6">Vérification de votre accès…</main>;
  if(!user) return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-[#4b302f]"><div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5 text-center"><h1 className="font-serif text-xl">Mon compte professionnel</h1><p className="my-4 text-sm">Connectez-vous pour retrouver votre espace privé.</p><Link className="inline-flex min-h-11 items-center rounded-full bg-[#8f2530] px-5 text-white" to={accountLogin}>Se connecter</Link></div></main>;
  if(state==='error')return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-center text-[#4b302f]">
    <div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5">
      <p role="alert">Le compte professionnel n’a pas pu être chargé. Vous pouvez réessayer sans quitter cet espace.</p>
      <button type="button" onClick={()=>setRetry(n=>n+1)} className="mt-4 min-h-11 rounded-xl bg-[#8f2530] px-5 text-white">Réessayer mon compte</button>
      <Link className="mt-3 block min-h-11 rounded-xl border border-[#d9c59d] px-4 py-3" to={accountLogin}>Revenir à la connexion professionnelle</Link>
      <Link className="mt-3 inline-block underline" to={cvPath}>Voir le CV</Link>
    </div>
  </main>;
  if(state!=='allowed')return <main className="min-h-dvh bg-[#fbf8f0] p-6 text-center text-[#4b302f]">
    <div className="mx-auto max-w-md rounded-2xl border border-[#d9c59d] bg-white p-5">
      <p>Ce compte n’est pas encore associé à cette vitrine.</p>
      <Link className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#8f2530] px-5 text-white" to={accountLogin}>Revenir à mon compte professionnel</Link>
      <Link className="mt-3 block underline" to={cvPath}>Voir le CV</Link>
    </div>
  </main>;
  return <div className="min-h-dvh bg-[#fbf8f0] pb-[env(safe-area-inset-bottom)]"><div className="mx-auto max-w-7xl px-4 pt-3"><Link className="inline-flex min-h-11 items-center text-sm underline" to={cvPath}>← Retour à mon CV {returnModel==='portfolio'?'Portfolio':'Business'}</Link></div><CompanyDashboard accountId={accountId} clientAppMode onPresentationSaved={onPresentationSaved} onNavigate={(page)=>{if(page==='home')navigate(cvReturnPath(slug, savedModel ?? returnModel));}} /></div>;
}
