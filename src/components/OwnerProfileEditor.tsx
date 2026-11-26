import {useEffect,useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import {useLanguage} from '../context/LanguageContext';
import {professionalRightsText} from '../lib/professionalRightsTranslations';
import {isProfessionalEntitlements,type ProfessionalEntitlements} from '../lib/professionalEntitlements';
import {invalidateShowcaseRecord} from '../lib/showcaseRecordCache';

const contacts={adresse:'Adresse',telephone:'Téléphone',whatsapp:'WhatsApp',email:'E-mail professionnel',site_web:'Site Internet',BTN_Maps:'Lien GPS / Google Maps','Lien Avis Google':'Lien pour recevoir des avis Google'};
const socials={'lien facebook':'Facebook','Lien Instagram':'Instagram','Lien TikTok':'TikTok','Lien LinkedIn':'LinkedIn','Lien YouTube':'YouTube',lien_x:'X'};
const keys=[...Object.keys(contacts),...Object.keys(socials),'a_propos','horaires_ok'];
const days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
type Values=Record<string,string>;
type Day={open:boolean;start:string;end:string;split:boolean;second:string;last:string};
const empty=():Day=>({open:false,start:'09:00',end:'18:00',split:false,second:'14:00',last:'18:00'});
function parseHours(raw:string){
 const week=days.map(empty);let parsed=true;
 for(const line of raw.split('\n').filter(v=>v.trim())){
  const [name,...parts]=line.split(':');const i=days.findIndex(d=>d.toLowerCase()===name.trim().toLowerCase());
  const value=parts.join(':').trim().replace(/(\d)[hH](\d)/g,'$1:$2');
  if(i<0){parsed=false;continue}if(/^ferm[ée]/i.test(value))continue;
  const times=value.match(/\d{1,2}:\d{2}/g)?.map(t=>t.padStart(5,'0'));
  if(!times||![2,4].includes(times.length)){parsed=false;continue}
  week[i]={open:true,start:times[0],end:times[1],split:times.length===4,second:times[2]||'14:00',last:times[3]||'18:00'};
 }
 return {week,parsed};
}
export default function OwnerProfileEditor({id,section}:{id:string;section:'infos'|'presentation'}){
 const {language}=useLanguage();const copyRights=professionalRightsText(language);
 const [rights,setRights]=useState<ProfessionalEntitlements|null>(null),[rightsFailed,setRightsFailed]=useState(false);
 const [original,setOriginal]=useState<Values|null>(null),[form,setForm]=useState<Values>({});
 const [networks,setNetworks]=useState<string[]>([]),[hours,setHours]=useState<Day[]>(days.map(empty));
 const [hoursChanged,setHoursChanged]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [copy,setCopy]=useState<number|null>(null),[targets,setTargets]=useState<number[]>([]);
 useEffect(()=>{let live=true;setOriginal(null);setMessage('');setHoursChanged(false);
 supabase.from('entreprise').select(keys.map(k=>'"'+k+'"').join(',')).eq('id',id).single().then(({data,error})=>{
 if(!live)return;if(error||!data){setMessage('Lecture impossible.');return}
 const row=data as unknown as Values;const values=Object.fromEntries(keys.map(k=>[k,row[k]||'']));
 setForm(values);setOriginal(values);setNetworks(Object.keys(socials).filter(k=>values[k]));setHours(parseHours(values.horaires_ok).week);
 });return ()=>{live=false}},[id]);
 useEffect(()=>{let live=true;setRights(null);setRightsFailed(false);
 if(section==='infos')void Promise.resolve(supabase.rpc('dalil_get_my_showcase_entitlements',{p_id:id})).then(({data,error})=>{
  if(!live)return;if(error||!isProfessionalEntitlements(data)){setRightsFailed(true);return}setRights(data);
 }).catch(()=>{if(live)setRightsFailed(true)});
 return ()=>{live=false};},[id,section]);
 const networkLimit=rights?.social_limit??Object.keys(socials).filter(k=>original?.[k]).length;
 function change(k:string,v:string){setForm(prev=>({...prev,[k]:v}));setMessage('')}
 function editDay(i:number,patch:Partial<Day>){setHours(h=>h.map((d,j)=>j===i?{...d,...patch}:d));setHoursChanged(true);setMessage('')}
 async function save(){
 if(!original||busy)return;
 const next={...form};
 if(hoursChanged){
 if(hours.some(d=>d.open&&(!d.start||!d.end||d.start>=d.end||(d.split&&(!d.second||!d.last||d.end>d.second||d.second>=d.last))))){setMessage('Vérifiez les heures et les chevauchements.');return}
 next.horaires_ok=hours.map((d,i)=>days[i]+' : '+(d.open?d.start+'–'+d.end+(d.split?' / '+d.second+'–'+d.last:''):'Fermé')).join('\n');
 }
 if(section==='infos'&&Object.keys(socials).filter(k=>next[k]?.trim()).length>networkLimit){setMessage(copyRights.networkLimit);return}
 const changed=keys.filter(k=>next[k]!==original[k]);if(!changed.length){setMessage('Aucune modification.');return}
 const changes=Object.fromEntries(changed.map(k=>[k,next[k]]));
 setBusy(true);try{const {data,error}=await supabase.rpc('dalil_save_my_profile_fields',{p_id:id,p_before:Object.fromEntries(changed.map(k=>[k,original[k]])),p_changes:changes});
 if(error)throw error;if(!data||changed.some(k=>data[k]!==next[k]))throw Error('Enregistrement non confirmé.');
 invalidateShowcaseRecord(id);setForm(next);setOriginal(next);setHoursChanged(false);setMessage('Modifications enregistrées.');
 }catch(e){setMessage((e as {message?:string}).message||'Échec de l’enregistrement.')}finally{setBusy(false)}
 }
 const input=(k:string,label:string)=><label key={k} className="grid gap-1">{label}<input className="rounded-lg border p-2" type={k==='email'?'email':k==='telephone'||k==='whatsapp'?'tel':k==='adresse'?'text':'url'} value={form[k]||''} onChange={e=>change(k,e.target.value)}/></label>;
 return <details className="mt-3 rounded-xl border bg-white p-3"><summary className="cursor-pointer font-semibold">{section==='infos'?'Mes informations':'Texte de présentation'}</summary>
 {original&&<form className="mt-3 grid gap-3 text-sm" onSubmit={e=>{e.preventDefault();void save()}}><fieldset disabled={busy} className="grid gap-3">
 {section==='presentation'?<label>Présentation de mon activité<textarea className="block w-full rounded-lg border p-2" maxLength={10000} value={form.a_propos} onChange={e=>change('a_propos',e.target.value)}/></label>:<>
 {Object.entries(contacts).map(([k,l])=>input(k,l))}
 <details><summary>Aide pour les liens Google</summary><p>Dans Google Maps, ouvrez votre fiche, puis Partager → Copier le lien. Pour les avis, ouvrez votre fiche d’établissement Google, choisissez Demander des avis et copiez le lien proposé.</p></details>
 <details><summary>{copyRights.networks}</summary><p className="my-2 text-xs text-gray-600">{copyRights.networkCount.replace('{count}',String(networks.length)).replace('{limit}',String(networkLimit))}</p>{!rights&&<p role="status" className="mb-2 text-xs text-gray-600">{rightsFailed?copyRights.rightsError:copyRights.loadingNetworks}</p>}{Object.entries(socials).map(([k,l])=><div key={k}><label><input type="checkbox" checked={networks.includes(k)} disabled={!networks.includes(k)&&networks.length>=networkLimit} onChange={e=>{if(e.target.checked){if(networks.length>=networkLimit){setMessage(copyRights.networkLimit);return}setNetworks([...networks,k]);}else{setNetworks(networks.filter(n=>n!==k));change(k,'')}}}/> {l}</label>{networks.includes(k)&&input(k,'Lien '+l)}</div>)}</details>
 <details><summary>Horaires d’ouverture</summary>{!parseHours(original.horaires_ok).parsed&&<p>Horaires actuels : {original.horaires_ok}. Modifier la grille remplacera ce texte.</p>}
 {hours.map((d,i)=><div key={days[i]} className="my-2 border-b pb-2"><label><input type="checkbox" checked={d.open} onChange={e=>editDay(i,{open:e.target.checked})}/> {days[i]} · {d.open?'Ouvert':'Fermé'}</label>
 {d.open&&<div className="flex flex-wrap items-center gap-2">{(['start','end'] as const).map((k,j)=><input key={k} aria-label={days[i]+(j?' fermeture':' ouverture')} type="time" value={d[k]} onChange={e=>editDay(i,{[k]:e.target.value})}/>)}
 <label><input type="checkbox" checked={d.split} onChange={e=>editDay(i,{split:e.target.checked})}/> Deuxième créneau</label>{d.split&&(['second','last'] as const).map((k,j)=><input key={k} aria-label={days[i]+(j?' deuxième fermeture':' deuxième ouverture')} type="time" value={d[k]} onChange={e=>editDay(i,{[k]:e.target.value})}/>)}</div>}
 <button type="button" onClick={()=>{setCopy(i);setTargets([])}}>Copier ce jour</button>
 {copy===i&&<div>{days.map((name,j)=>j!==i&&<label key={name} className="mr-2"><input type="checkbox" checked={targets.includes(j)} onChange={e=>setTargets(e.target.checked?[...targets,j]:targets.filter(x=>x!==j))}/> {name}</label>)}<button type="button" disabled={!targets.length} onClick={()=>{setHours(h=>h.map((v,j)=>targets.includes(j)?{...h[i]}:v));setHoursChanged(true);setCopy(null)}}>Appliquer</button></div>}</div>)}</details></>}
 <button type="submit" className="rounded-lg bg-[#62212a] p-2 text-white">{busy?'Enregistrement…':'Enregistrer'}</button></fieldset></form>}
 <p role="status">{message||(!original?'Chargement…':'')}</p></details>
}
