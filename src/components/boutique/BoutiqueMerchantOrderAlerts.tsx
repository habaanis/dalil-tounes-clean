import {useEffect,useState} from 'react';
import {supabase,supabaseUrl,supabaseAnonKey} from '../../lib/supabaseClient';

type PushConfig = {enabled?:boolean; publicKey?:string; subscribed?:boolean; error?:string};
const decodeKey = (value:string) => Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')+
  '='.repeat((4-value.length%4)%4)),character=>character.charCodeAt(0));

export default function BoutiqueMerchantOrderAlerts({profileId}:{profileId:string}) {
  const [publicKey,setPublicKey]=useState('');
  const [enabled,setEnabled]=useState(false);
  const [subscribed,setSubscribed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const supported=typeof navigator!=='undefined' &&
    'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window &&
    window.isSecureContext;
  const api=async(action:string,subscription?:PushSubscriptionJSON):Promise<PushConfig>=>{
    const {data:{session},error}=await supabase.auth.getSession();
    if(error||!session?.access_token)throw new Error('Reconnectez-vous pour activer les notifications.');
    const response=await fetch(supabaseUrl+'/functions/v1/dalil-boutique-merchant-push',{
      method:'POST',
      headers:{'content-type':'application/json',apikey:supabaseAnonKey,
        authorization:'Bearer '+session.access_token},
      body:JSON.stringify({action,profileId,subscription}),
    });
    const data=await response.json().catch(()=>({error:'Réponse invalide'}));
    if(!response.ok||data.error)throw new Error(response.status===403
      ? 'Ce compte ne peut pas recevoir les alertes de cet établissement.'
      : data.error || 'Notifications indisponibles.');
    return data;
  };
  useEffect(()=>{
    let active=true;
    setEnabled(false);setSubscribed(false);setMessage('');
    if(!supported || !profileId)return;
    void (async()=>{
      try {
        const config=await api('config');
        if(!active||!config.enabled||!config.publicKey)return;
        setPublicKey(config.publicKey);
        setEnabled(true);
        const registration=await navigator.serviceWorker.ready;
        const subscription=await registration.pushManager.getSubscription();
        if(subscription){
          const status=await api('status',subscription.toJSON());
          if(active)setSubscribed(status.subscribed===true);
        }
      } catch(err) {
        if(active)setMessage(err instanceof Error ? err.message : 'Notifications indisponibles.');
      }
    })();
    return ()=>{active=false;};
  },[profileId,supported]);
  if(!supported||!profileId)return <p className="text-xs text-[#6f5e51]">Les alertes mobiles ne sont pas disponibles sur ce navigateur.</p>;
  const toggle=async()=>{
    if(busy)return;
    setBusy(true);setMessage('');
    try{
      const registration=await navigator.serviceWorker.ready;
      let subscription=await registration.pushManager.getSubscription();
      if(subscribed){
        if(subscription)await api('unsubscribe',subscription.toJSON());
        setSubscribed(false);
        setMessage('Vous ne recevrez plus d’alertes de commandes pour cet établissement.');
        return;
      }
      if(Notification.permission==='denied')throw new Error('Autorisez les notifications dans les réglages du téléphone.');
      const permission=await Notification.requestPermission();
      if(permission!=='granted')throw new Error('Notifications non autorisées.');
      subscription ||= await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:decodeKey(publicKey) as BufferSource,
      });
      const result=await api('subscribe',subscription.toJSON());
      if(!result.subscribed)throw new Error('Abonnement non confirmé.');
      setSubscribed(true);
      setMessage('Alertes activées. Une nouvelle demande vous dirigera vers Mes commandes.');
    }catch(err){setMessage(err instanceof Error?err.message:'Notifications indisponibles.');}
    finally{setBusy(false);}
  };
  return <section aria-label="Alertes des commandes" className="rounded-xl border border-[#dfcfaf] bg-[#fffcf8] p-3">
    <p className="text-sm font-semibold text-[#563a2b]">Alertes de nouvelles commandes</p>
    <p className="mt-1 text-xs text-[#655b51]">Activation volontaire sur cet appareil. Les coordonnées clients ne figurent pas dans l’alerte.</p>
    <button type="button" onClick={()=>void toggle()} disabled={busy||!enabled}
      className="mt-3 min-h-11 rounded-xl border border-[#cbb485] bg-white px-4 text-sm font-semibold text-[#543b2e] disabled:opacity-50">
      {busy?'Vérification…':subscribed?'Désactiver les alertes':'Activer les alertes'}
    </button>
    {!enabled&&!message&&<p role="status" className="mt-2 text-xs">Vérification du service de notifications…</p>}
    {message&&<p role="status" className="mt-2 text-xs text-[#594b41]">{message}</p>}
  </section>;
}
