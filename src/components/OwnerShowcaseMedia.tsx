import {useEffect,useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import {parseImageUrls} from '../lib/imagekitUtils';

type Item={src:string;file?:File;uploaded?:string};
function Picture({item}:{item:Item}){
 const [url,setUrl]=useState('');
 useEffect(()=>{if(!item.file){setUrl(item.src);return}const local=URL.createObjectURL(item.file);setUrl(local);return ()=>URL.revokeObjectURL(local)},[item]);
 return url?<img src={url} alt="Aperçu" className="h-20 w-24 rounded object-cover"/>:null;
}
export default function OwnerShowcaseMedia({id,field}:{id:string;field:'logo_url'|'image_url'}){
 const [before,setBefore]=useState<string|null>(null),[items,setItems]=useState<Item[]>([]),[busy,setBusy]=useState(false),[note,setNote]=useState('');
 const logo=field==='logo_url';
 useEffect(()=>{let live=true;setBefore(null);setNote('');supabase.from('entreprise').select('image_url,logo_url').eq('id',id).single().then(({data,error})=>{
 if(!live)return;if(error||!data){setNote('Lecture des images impossible.');return}const raw=data[field]||'';setBefore(raw);setItems(parseImageUrls(raw).map(src=>({src})));
 });return ()=>{live=false}},[id,field]);
 function select(files:File[],index?:number){
 if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5242880)){setNote('Choisissez un JPG, PNG ou WebP de 5 Mo maximum.');return}
 if(!files.length)return;const additions=files.map(file=>({src:crypto.randomUUID(),file}));
 setItems(old=>index===undefined?[...old,...additions]:old.map((v,j)=>j===index?additions[0]:v));setNote('');
 }
 async function save(){
 if(before===null||busy)return;setBusy(true);setNote('');
 try{const urls:string[]=[];for(const item of items){
 if(!item.file){urls.push(item.src);continue}
 const bucket=supabase.storage.from('dalil-owner-showcase');
 if(!item.uploaded){
 const ext=item.file.type==='image/png'?'png':item.file.type==='image/webp'?'webp':'jpg';
 const path=id+'/'+item.src+'.'+ext;
 const {error}=await bucket.upload(path,item.file,{contentType:item.file.type});if(error)throw error;
 item.uploaded=bucket.getPublicUrl(path).data.publicUrl;
 }
 urls.push(item.uploaded);
 }
 const {data,error}=await supabase.rpc('dalil_save_my_showcase_images',{p_id:id,p_field:field,p_before:before,p_images:urls});
 if(error)throw error;if(typeof data!=='string'||JSON.stringify(parseImageUrls(data))!==JSON.stringify(urls))throw Error('Publication non confirmée.');
 setBefore(data);setItems(urls.map(src=>({src})));setNote('Images enregistrées.');
 }catch(e){setNote((e as {message?:string}).message||'Enregistrement impossible.')}finally{setBusy(false)}
 }
 return <details className="mt-3 rounded-xl border bg-white p-3"><summary className="cursor-pointer font-semibold">{logo?'Mon logo':'Photos de présentation'}</summary>
 {before!==null&&<fieldset disabled={busy} className="mt-2 grid gap-3 text-sm"><div className="grid grid-cols-2 gap-2">{items.map((item,i)=><div key={item.src+'-'+i} className="min-w-0"><Picture item={item}/>
 <label className="block">Remplacer<input aria-label={'Remplacer image '+(i+1)} type="file" accept="image/jpeg,image/png,image/webp" className="w-full" onChange={e=>{select(Array.from(e.target.files||[]),i);e.target.value=''}}/></label>
 <button type="button" onClick={()=>setItems(old=>old.filter((_,j)=>j!==i))}>Retirer</button></div>)}</div>
 {(!logo||!items.length)&&<label>Ajouter {logo?'un logo':'des photos'}<input className="block w-full" type="file" multiple={!logo} accept="image/jpeg,image/png,image/webp" onChange={e=>{select(Array.from(e.target.files||[]));e.target.value=''}}/></label>}
 <button type="button" onClick={()=>void save()} disabled={JSON.stringify(items.map(i=>i.src))===JSON.stringify(parseImageUrls(before))} className="rounded-lg bg-[#62212a] p-2 text-white">{busy?'Enregistrement…':'Enregistrer'}</button></fieldset>}
 <p role="status">{note}</p></details>
}