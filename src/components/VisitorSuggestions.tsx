import { useState, type FormEvent } from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabaseUrl } from '../lib/supabaseClient';

type Visitor = 'visiteur'|'professionnel';
type Subject = 'idee'|'amelioration'|'probleme';

/** Same lightweight feedback form for website and app, with no account needed. */
export function VisitorSuggestions({source='site'}:{source?:'site'|'app'}) {
  const {language}=useLanguage();
  const ar=language==='ar';
  const t=(fr:string,arabic:string)=>ar?arabic:fr;
  const [open,setOpen]=useState(false);
  const [audience,setAudience]=useState<Visitor>('visiteur');
  const [category,setCategory]=useState<Subject>('idee');
  const [message,setMessage]=useState('');
  const [contact,setContact]=useState('');
  const [website,setWebsite]=useState('');
  const [loading,setLoading]=useState(false);
  const [notice,setNotice]=useState('');
  const [done,setDone]=useState(false);
  const send=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();if(loading)return;
    if(message.trim().length<10||message.trim().length>2000){setNotice(t('Décrivez votre idée en au moins 10 caractères.','صف فكرتك في 10 أحرف على الأقل.'));return;}
    setLoading(true);setNotice('');
    try{
      const response=await fetch(supabaseUrl+'/functions/v1/dalil-visitor-ideas-submit',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({source,audience,category,language,message:message.trim(),contact:contact.trim(),website})
      });
      if(!response.ok){
        setNotice(response.status===429?t('Vous avez envoyé plusieurs messages. Réessayez un peu plus tard.','لقد أرسلت عدة رسائل. حاول لاحقاً.'):t('Envoi indisponible. Votre texte est conservé, réessayez.','الإرسال غير متاح. تم الاحتفاظ بنصك، حاول مجدداً.'));
        return;
      }
      setDone(true);setMessage('');setContact('');
      setNotice(t('Merci ! Votre suggestion a bien été reçue.','شكراً! تم استلام اقتراحك بنجاح.'));
    }catch{setNotice(t('Connexion indisponible. Réessayez sans perdre votre texte.','الاتصال غير متاح. حاول مجدداً دون فقدان النص.'));}
    finally{setLoading(false);}
  };
  return <section id="suggestions" dir={ar?'rtl':'ltr'} className="scroll-mt-24 mx-auto max-w-xl rounded-2xl border border-[#d4af76] bg-[#fffaf0] text-[#272822] shadow-sm">
    <button type="button" aria-expanded={open} aria-controls="dalil-visitor-ideas-panel"
      onClick={()=>setOpen(v=>!v)}
      className="w-full flex items-center justify-between gap-3 px-4 py-4 text-start">
      <span className="inline-flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-5 w-5 text-[#a67c36]"/>
        {t('Vos idées pour Dalil Tounes','اقتراحاتكم لدليل تونس')}</span>
      <ChevronDown className={`h-4 w-4 transition-transform ${open?'rotate-180':''}`}/>
    </button>
    {open&&<div id="dalil-visitor-ideas-panel" className="border-t border-[#e8dac1] px-4 pb-4 pt-3">
      <p className="text-xs mb-3 text-[#59574f]">{t('Quelle fonction ou amélioration aimeriez-vous voir ? Aucun compte nécessaire.','ما الميزة أو التحسين الذي ترغب في رؤيته؟ دون إنشاء حساب.')}</p>
      <form onSubmit={send} className="space-y-3">
        <label className="block text-xs font-medium">{t('Vous êtes','أنت')}
          <select className="mt-1 block w-full rounded-lg border border-[#c8b68e] bg-white p-2 text-sm" value={audience}
           onChange={e=>setAudience(e.target.value as Visitor)}>
            <option value="visiteur">{t('Visiteur ou utilisateur','زائر أو مستخدم')}</option>
            <option value="professionnel">{t('Commerçant ou professionnel','تاجر أو مهني')}</option>
          </select>
        </label>
        <label className="block text-xs font-medium">{t('Votre retour concerne','نوع اقتراحك')}
          <select className="mt-1 block w-full rounded-lg border border-[#c8b68e] bg-white p-2 text-sm" value={category}
            onChange={e=>setCategory(e.target.value as Subject)}>
            <option value="idee">{t('Une nouvelle fonctionnalité','ميزة جديدة')}</option>
            <option value="amelioration">{t('Une amélioration','تحسين')}</option>
            <option value="probleme">{t('Un problème rencontré','مشكلة واجهتك')}</option>
          </select>
        </label>
        <label className="block text-xs font-medium">{t('Votre suggestion','اقتراحك')}
          <textarea required minLength={10} maxLength={2000} rows={3} value={message}
            onChange={e=>setMessage(e.target.value)}
            placeholder={t("Qu'aimeriez-vous améliorer sur Dalil Tounes ?",'ما الذي ترغب في تحسينه في دليل تونس؟')}
            className="mt-1 block w-full rounded-lg border border-[#c8b68e] bg-white p-2 text-sm"/>
        </label>
        <label className="block text-xs font-medium">{t('E-mail ou téléphone (facultatif)','البريد الإلكتروني أو الهاتف (اختياري)')}
          <input maxLength={160} value={contact} onChange={e=>setContact(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-[#c8b68e] bg-white p-2 text-sm"/>
        </label>
        <div className="hidden" aria-hidden="true"><label>Site web<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
        <p className="text-[11px] text-[#68665e]">{t('Votre contact est facultatif et ne servira qu’à répondre à votre suggestion.','معلومات التواصل اختيارية وتستخدم فقط للرد على اقتراحك.')}</p>
        <button type="submit" disabled={loading} className="rounded-xl bg-[#1d362f] px-5 py-2.5 font-semibold text-sm text-white disabled:opacity-60">
          {loading?t('Envoi…','جارٍ الإرسال…'):t('Envoyer ma suggestion','إرسال اقتراحي')}
        </button>
        {notice&&<p role="status" className={done?'text-sm text-green-800':'text-sm text-[#744e20]'}>{notice}</p>}
      </form>
    </div>}
  </section>;
}
