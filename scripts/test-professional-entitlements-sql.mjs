import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Run with PGLITE_MODULE=/absolute/path/to/@electric-sql/pglite/dist/index.js.
// An isolated PostgreSQL engine exercises the real migration and RPCs, never production data.
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create schema storage;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;
create function storage.filename(text) returns text language sql immutable as $$select (string_to_array($1,'/'))[array_length(string_to_array($1,'/'),1)]$$;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
create table public.entreprise(
 id text primary key,approved boolean default true,image_url text,logo_url text,
 formule_commerciale text,statut_abonnement text,modele_cv text default 'business',opening_style text default 'photo',
 palette_cv text default 'prestige',palette_cv_user_selected boolean default true,statut_carte text,updated_at timestamptz,
 adresse text,telephone text,whatsapp text,email text,site_web text,"BTN_Maps" text,"Lien Avis Google" text,horaires_ok text,
 "lien facebook" text,"Lien Instagram" text,"Lien TikTok" text,"Lien LinkedIn" text,"Lien YouTube" text,lien_x text,a_propos text);
create table public.professional_profile_access(user_id uuid,entreprise_id text references public.entreprise(id));
alter table public.professional_profile_access enable row level security;
create policy own_access on public.professional_profile_access for select to authenticated using(user_id=auth.uid());
grant select on public.professional_profile_access,public.entreprise to authenticated;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
alter table storage.objects enable row level security;
grant insert,select on storage.objects to authenticated;
`);
for (const name of [
  '20261126082500_dalil_owner_profile_fields.sql',
  '20261126082600_dalil_owner_showcase_images.sql',
  '20261126095319_dalil_professional_entitlements_and_gallery.sql',
]) await db.exec(await readFile(new URL('../supabase/migrations/' + name, import.meta.url), 'utf8'));

const owner='00000000-0000-4000-8000-000000000001';
const other='00000000-0000-4000-8000-000000000002';
let passed=0;
function ok(name, condition) { assert.ok(condition, name); console.log('PASS',name); passed++; }
async function scalar(sql,values=[]) { return (await db.query(sql,values)).rows[0]?.result; }
async function asOwner(user=owner) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${user}',false); set role authenticated;`); }
async function rejects(name,fn,pattern) { await assert.rejects(fn,pattern); console.log('PASS',name); passed++; }
async function rights(id) { return scalar('select public.dalil_get_my_showcase_entitlements($1) result',[id]); }
async function imageString(id) { return scalar('select coalesce(image_url,\'\') result from public.entreprise where id=$1',[id]); }
async function save(id,urls,before) { return scalar('select public.dalil_save_my_showcase_images($1,\'image_url\',$2,$3) result',[id,before??await imageString(id),urls]); }
const url=(id,n)=>`https://kmvjegbtroksjqaqliyv.supabase.co/storage/v1/object/public/dalil-owner-showcase/${id}/00000000-0000-4000-8000-${String(n).padStart(12,'0')}.jpg`;
const existing=Array.from({length:8},(_,i)=>`https://images.example/photo-${i}.jpg`);
await db.query(`insert into public.entreprise(id,formule_commerciale,statut_abonnement,image_url) values
 ('artisan','Artisan — 30 TND','Actif',''),('premium','Premium — 59 TND','Premium',$1),
 ('historical',null,'premium 99TND',''),('unknown',null,'Actif',$2),
 ('conflict','Artisan — 30 TND','Premium',''),('other','Premium — 59 TND','Premium',''),
 ('grandfather','Artisan — 30 TND','Artisan',$3)`,[existing.join(',\n')+',',existing.slice(0,2).join(',\n'),existing.join(',\n')]);
await db.query('insert into public.professional_profile_access select $1,id from public.entreprise where id<>\'other\'',[owner]);
await db.query('insert into public.professional_profile_access values($1,\'other\')',[other]);
await asOwner();
const artisan=await rights('artisan'), premium=await rights('premium');
ok('Artisan commercial formula with generic status yields 5 photos, 2 socials and one choice',artisan.photo_limit===5&&artisan.social_limit===2&&artisan.models.length===1&&artisan.palettes.length===1&&artisan.openings.length===1);
ok('Premium retains 10 photos and all model/palette/opening choices',premium.photo_limit===10&&premium.models.length===2&&premium.palettes.length===3&&premium.openings.length===2);
ok('Historical premium label retains ten photos',(await rights('historical')).photo_limit===10);
ok('Unknown plan receives no invented paid rights',(await rights('unknown')).confirmation_required&&(await rights('unknown')).photo_limit===2);
ok('Conflicting plan labels require confirmation',(await rights('conflict')).plan==='unconfirmed');
await rejects('Another professional cannot read entitlements',()=>rights('other'),/Accès refusé/);
await rejects('Another professional cannot save photos',()=>save('other',[url('other',1)],''),/Accès refusé/);
await rejects('Protected entitlement snapshot cannot be changed directly',()=>db.exec("update public.dalil_owner_profile_fields set preserved_rights='{}'"),/permission denied/);
await rejects('Direct commercial plan changes cannot bypass RPC',()=>db.exec("update public.entreprise set formule_commerciale='Premium — 59 TND' where id='artisan'"),/permission denied/);
for(const id of ['artisan','premium','unknown','grandfather']) for(let n=1;n<=12;n++) {
  await db.query('insert into storage.objects(bucket_id,name) values(\'dalil-owner-showcase\',$1)',[`${id}/00000000-0000-4000-8000-${String(n).padStart(12,'0')}.jpg`]);
}
await rejects('Storage refuses another establishment path',()=>db.query('insert into storage.objects(bucket_id,name) values(\'dalil-owner-showcase\',$1)',['other/00000000-0000-4000-8000-000000000001.jpg']),/row-level security/);
let artisanPhotos=Array.from({length:5},(_,i)=>url('artisan',i+1));
await save('artisan',artisanPhotos);ok('Artisan fifth photo is persisted',(await rights('artisan')).photo_count===5);
await rejects('Artisan sixth photo is rejected',()=>save('artisan',[...artisanPhotos,url('artisan',6)]),/Limite de photos/);
artisanPhotos=[...artisanPhotos.slice(0,4),url('artisan',6)];await save('artisan',artisanPhotos);
ok('Replacement works at quota',(await imageString('artisan')).includes(url('artisan',6)));
await save('artisan',artisanPhotos.slice(0,4));ok('Explicit photo deletion works',(await rights('artisan')).photo_count===4);
await save('artisan',artisanPhotos);ok('Deleted slot can be reused',(await rights('artisan')).photo_count===5);
await save('premium',[...existing,url('premium',9)]);ok('Ninth Premium photo persists',(await rights('premium')).photo_count===9);
await save('premium',[...existing,url('premium',9),url('premium',10)]);ok('Tenth Premium photo persists',(await rights('premium')).photo_count===10);
await rejects('Eleventh Premium photo is rejected',()=>save('premium',[...existing,url('premium',9),url('premium',10),url('premium',11)]),/Limite de photos/);
await rejects('Stale photo edit cannot overwrite current photos',()=>save('premium',existing,''),/Les images ont changé/);
await rejects('Unuploaded photo never returns success',()=>save('premium',[...existing,url('premium',999)]),/Image non rattachée/);
await rejects('Image from another owner cannot be attached',()=>save('artisan',[url('premium',1)]),/Image non rattachée/);
await rejects('Unknown plan can replace but cannot add photo',()=>save('unknown',[...existing.slice(0,2),url('unknown',1)]),/Limite de photos/);
await save('unknown',[existing[0],url('unknown',1)]);ok('Unknown plan preserves replacement of existing assets',(await rights('unknown')).photo_count===2);
ok('Legacy Artisan eight photos are preserved',(await rights('grandfather')).photo_limit===8);
await save('grandfather',existing.slice(0,7));ok('Removing a grandfathered photo does not destroy acquired capacity',(await rights('grandfather')).photo_limit===8);
await save('grandfather',[...existing.slice(0,7),url('grandfather',9)]);ok('Grandfathered slot may be replaced',(await rights('grandfather')).photo_count===8);
await rejects('Artisan cannot switch to a second model',()=>scalar("select public.dalil_update_my_cv_presentation('artisan','portfolio','photo') result"),/droits actuels/);
await rejects('Artisan cannot switch to a second opening',()=>scalar("select public.dalil_update_my_cv_presentation('artisan','business','framed') result"),/droits actuels/);
await rejects('Artisan cannot switch to a second palette',()=>scalar("select public.dalil_update_my_cv_palette('artisan','night') result"),/droits actuels/);
await scalar("select public.dalil_update_my_cv_presentation('premium','portfolio','framed') result");
await scalar("select public.dalil_update_my_cv_palette('premium','night') result");
ok('Premium model/opening/palette choices persist',(await rights('premium')).current_model==='portfolio'&&(await rights('premium')).current_palette==='night');
await scalar("select public.dalil_save_my_profile_fields('artisan',$1,$2) result",[{'lien facebook':'','Lien Instagram':''},{'lien facebook':'https://facebook.com/test','Lien Instagram':'https://instagram.com/test'}]);
await rejects('Third Artisan social network is rejected',()=>scalar("select public.dalil_save_my_profile_fields('artisan',$1,$2) result",[{'Lien TikTok':''},{'Lien TikTok':'https://tiktok.com/test'}]),/Limite de réseaux/);
await db.exec('reset role');
await db.exec("update public.entreprise set image_url='stale-airtable-images',modele_cv='business',palette_cv='ivory',opening_style='photo' where id='premium'");
await asOwner();
ok('Airtable-like stale update preserves saved photos and presentation',(await rights('premium')).photo_count===10&&(await rights('premium')).current_model==='portfolio'&&(await rights('premium')).current_palette==='night');
await db.exec('reset role');
const parsed=await scalar('select public.dalil_showcase_image_urls($1) result',['https://example.com/a,b.jpg,\\nhttps://example.com/c.jpg,']);
ok('Canonical parser preserves URL commas and removes trailing separators',parsed.length===2&&parsed[0]==='https://example.com/a,b.jpg'&&parsed[1]==='https://example.com/c.jpg');
await db.close();
console.log(`PASS ${passed} PostgreSQL entitlement/gallery/security checks`);
