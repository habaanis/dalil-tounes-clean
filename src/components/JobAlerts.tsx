import { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const texts = {
 fr:['Ne manquez plus une opportunité d’emploi !','Recevez gratuitement les nouvelles offres correspondant à votre métier et à votre région.','Créer mon alerte emploi gratuite','Métier ou mot-clé','Toute la Tunisie','Tous les contrats','Dès qu’une offre correspond','Chaque jour','Chaque semaine','Enregistrer et autoriser les notifications','Modifier ou gérer mon alerte','Suspendre','Supprimer','Tester la notification','Alerte enregistrée.','Notification de test acceptée par le service d’envoi.','Impossible de terminer cette action. Vérifiez les permissions de notification et réessayez.','Sur cet appareil uniquement. Modifiable et désactivable à tout moment.','Mode test administrateur','Alertes temporairement indisponibles.','Choisissez au moins un critère.','Alerte suspendue.','Alerte supprimée.','Notifications non autorisées sur cet appareil.'],
 ar:['لا تفوّت فرصة عمل!','تلقّ مجاناً عروض العمل الجديدة التي تناسب مهنتك ومنطقتك.','إنشاء تنبيه وظائف مجاني','المهنة أو كلمة مفتاحية','كل تونس','كل العقود','عند ظهور عرض مطابق','كل يوم','كل أسبوع','حفظ والسماح بالإشعارات','إدارة التنبيه','إيقاف مؤقت','حذف','اختبار الإشعار','تم حفظ التنبيه.','قبلت خدمة الإرسال إشعار الاختبار.','تعذّر إتمام العملية. تحقق من أذونات الإشعارات وأعد المحاولة.','على هذا الجهاز فقط. يمكنك التعديل أو الإيقاف في أي وقت.','وضع اختبار المسؤول','التنبيهات غير متاحة مؤقتاً.','اختر معياراً واحداً على الأقل.','تم إيقاف التنبيه.','تم حذف التنبيه.','الإشعارات غير مسموح بها على هذا الجهاز.'],
 en:['Never miss a job opportunity!','Get free alerts for new jobs matching your profession and region.','Create my free job alert','Job or keyword','All Tunisia','All contracts','When a job matches','Every day','Every week','Save and allow notifications','Manage my alert','Pause','Delete','Test notification','Alert saved.','Test notification accepted by the delivery service.','Unable to complete this action. Check notification permissions and try again.','On this device only. Edit or disable at any time.','Administrator test mode','Alerts temporarily unavailable.','Choose at least one criterion.','Alert paused.','Alert deleted.','Notifications are not allowed on this device.'],
 it:['Non perdere un’opportunità di lavoro!','Ricevi gratuitamente le nuove offerte per la tua professione e regione.','Crea il mio avviso gratuito','Professione o parola chiave','Tutta la Tunisia','Tutti i contratti','Quando un’offerta corrisponde','Ogni giorno','Ogni settimana','Salva e consenti notifiche','Gestisci avviso','Sospendi','Elimina','Prova notifica','Avviso salvato.','Notifica di prova accettata dal servizio.','Impossibile completare. Controlla i permessi e riprova.','Solo su questo dispositivo. Modificabile o disattivabile in ogni momento.','Modalità test amministratore','Avvisi temporaneamente non disponibili.','Scegli almeno un criterio.','Avviso sospeso.','Avviso eliminato.','Notifiche non consentite su questo dispositivo.'],
 ru:['Не пропустите возможность трудоустройства!','Получайте бесплатно новые вакансии по профессии и региону.','Создать бесплатное оповещение','Профессия или ключевое слово','Весь Тунис','Все договоры','При появлении подходящей вакансии','Каждый день','Каждую неделю','Сохранить и разрешить уведомления','Управлять оповещением','Приостановить','Удалить','Тестовое уведомление','Оповещение сохранено.','Тестовое уведомление принято сервисом.','Не удалось выполнить действие. Проверьте разрешения и повторите.','Только на этом устройстве. Можно изменить или отключить в любое время.','Режим тестирования администратора','Оповещения временно недоступны.','Выберите хотя бы один критерий.','Оповещение приостановлено.','Оповещение удалено.','Уведомления запрещены на этом устройстве.']
} as const;
const regions=['Ariana','Béja','Ben Arous','Bizerte','Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kébili','Le Kef','Mahdia','La Manouba','Médenine','Monastir','Nabeul','Sfax','Sidi Bouzid','Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan'];
const contracts=['CDI','CDD','SIVP','Stage','Saisonnier','Temps partiel'];
const storageKey='dalil-emploi-alert-token-v1';
type Alert = {id:string;keyword:string;governorate:string;contract:string;frequency:string;enabled:boolean};
type Config = {enabled:boolean;pilot?:boolean;publicKey?:string};
const inputClass='w-full rounded-lg border border-[#D4AF37] bg-white px-3 py-2 text-sm text-[#292725]';
const buttonClass='rounded-lg border border-[#D4AF37] bg-white px-3 py-2 text-sm font-medium text-[#292725] disabled:opacity-50';
const getToken=()=>localStorage.getItem(storageKey);
const makeToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
const call=async(body:Record<string,unknown>)=>{
 const {data,error}=await supabase.functions.invoke('dalil-emploi-alerts',{body});
 if(error||!data||data.error)throw new Error('request_failed');
 return data;
};
function keyBytes(v:string){
 const s=atob(v.replace(/-/g,'+').replace(/_/g,'/'));
 return Uint8Array.from(s,c=>c.charCodeAt(0));
}
export default function JobAlerts({initialKeyword='',initialRegion='',adminPanel=false}:{initialKeyword?:string;initialRegion?:string;adminPanel?:boolean}){
 const {language}=useLanguage(), t=texts[language];
 const [config,setConfig]=useState<Config|null>(null),[alert,setAlert]=useState<Alert|null>(null);
 const [open,setOpen]=useState(false),[keyword,setKeyword]=useState(''),[region,setRegion]=useState(''),[contract,setContract]=useState(''),[frequency,setFrequency]=useState('daily');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [hasToken,setHasToken]=useState(false);
 useEffect(()=>{let alive=true;const load=async()=>{try{
  const token=getToken();if(alive)setHasToken(!!token);
  const cfg=await call({action:'config'}) as Config;if(!alive)return;setConfig(cfg);
  if(token){const result=await call({action:'status',token});if(!alive)return;const a=result.alert as Alert|null;setAlert(a);if(a){setKeyword(a.keyword);setRegion(a.governorate);setContract(a.contract);setFrequency(a.frequency);}}
 }catch{if(alive)setConfig({enabled:false});}};void load();
 const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{setTimeout(()=>{if(alive)void load();},0)});
 return()=>{alive=false;subscription.unsubscribe();};},[]);
 if(!config?.enabled&&!hasToken)return adminPanel ? <p role="status" className="text-sm">{config ? t[19] : 'Chargement des alertes…'}</p> : null;
 const act=async(action:string)=>{
  if(busy)return;setBusy(true);setMessage('');
  try{
   let token=getToken();
   if(action==='save'){
    if(!keyword.trim()&&!region&&!contract){setMessage(t[20]);return;}
    if(!config?.publicKey||!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){setMessage(t[23]);return;}
    const permission=await Notification.requestPermission();
    if(permission!=='granted'){setMessage(t[23]);return;}
    // Use the service worker already installed by Dalil Tounes.
    const reg=await navigator.serviceWorker.getRegistration('/');
    if(!reg?.active)throw new Error('worker_not_ready');
    let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(config.publicKey)});
    // Store the token before submitting so a lost response can be retried.
    if(!token){token=makeToken();localStorage.setItem(storageKey,token);setHasToken(true);}
    const result=await call({action,token,subscription:sub.toJSON(),keyword,governorate:region,contract,frequency,language,consent:true});
    setAlert(result.alert);setMessage(t[14]);
   }else{
    if(!token)return;
    const result=await call({action,token});
    if(action==='test'){setMessage(result.accepted?t[15]:t[16]);}
    else if(action==='delete'){localStorage.removeItem(storageKey);setHasToken(false);setAlert(null);setMessage(t[22]);}
    else if(action==='pause'){setAlert(result.alert);setMessage(t[21]);}
   }
  }catch{setMessage(t[16]);}finally{setBusy(false);}
 };
 return <section className="mb-4 rounded-xl border border-[#D4AF37] bg-[#FFF8EA] px-3 py-3 text-[#292725]">
  <div className="flex items-start gap-2"><BellRing className="mt-0.5 h-5 w-5 shrink-0 text-[#9A7418]" aria-hidden="true"/><div className="flex-1"><h3 className="text-sm font-semibold">{t[0]}</h3><p className="text-xs leading-5">{t[1]}</p>{config?.pilot&&<p className="text-xs font-medium">{t[18]}</p>}</div></div>
  <button type="button" aria-expanded={open} className="mt-2 w-full rounded-lg bg-[#292725] px-3 py-2 text-sm font-medium text-white" onClick={()=>{if(!open&&!alert){setKeyword(initialKeyword.slice(0,120));setRegion(regions.includes(initialRegion)?initialRegion:'');}setOpen(!open);}}>{alert||hasToken?t[10]:t[2]}</button>
  {open&&<div className="mt-3 grid gap-2">
   {!config?.enabled&&<p className="text-xs">{t[19]}</p>}
   <input className={inputClass} aria-label={t[3]} placeholder={t[3]} maxLength={120} value={keyword} onChange={e=>setKeyword(e.target.value)}/>
   <select aria-label={t[4]} className={inputClass} value={region} onChange={e=>setRegion(e.target.value)}><option value="">{t[4]}</option>{regions.map(r=><option key={r}>{r}</option>)}</select>
   <select aria-label={t[5]} className={inputClass} value={contract} onChange={e=>setContract(e.target.value)}><option value="">{t[5]}</option>{contracts.map(r=><option key={r}>{r}</option>)}</select>
   <select aria-label={t[7]} className={inputClass} value={frequency} onChange={e=>setFrequency(e.target.value)}><option value="instant">{t[6]}</option><option value="daily">{t[7]}</option><option value="weekly">{t[8]}</option></select>
   <button type="button" disabled={busy||!config?.enabled} className={buttonClass} onClick={()=>void act('save')}>{t[9]}</button>
   {hasToken&&<div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} disabled={busy||!alert?.enabled} onClick={()=>void act('pause')}>{t[11]}</button><button type="button" className={buttonClass} disabled={busy} onClick={()=>void act('delete')}>{t[12]}</button>{alert?.enabled&&config?.enabled&&<button type="button" className={buttonClass} disabled={busy} onClick={()=>void act('test')}>{t[13]}</button>}</div>}
  </div>}
  {message&&<p role="status" className="mt-2 text-xs">{message}</p>}
  <p className="mt-2 text-[11px] text-[#514B43]">{t[17]}</p>
 </section>;
}
