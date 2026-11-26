import { readFile, readdir } from 'node:fs/promises';

// Isolated schema derived from the production column/policy inventory. No
// production records, network requests, emails or real accounts are used.
export async function createMiniappTestDatabase() {
  const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
  const db = new PGlite();
  await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create schema storage;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.role() returns text language sql stable as $$select nullif(current_setting('request.jwt.claim.role',true),'')$$;
create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;
create function storage.filename(text) returns text language sql immutable as $$select (string_to_array($1,'/'))[array_length(string_to_array($1,'/'),1)]$$;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz, created_at timestamptz default now(),
 is_anonymous boolean default false, deleted_at timestamptz, banned_until timestamptz);
create table public.profiles(id uuid primary key references auth.users(id),role text not null default 'user',display_name text,email text);
create table public.admins(id uuid primary key references auth.users(id),email text,role text);
create table public.commerciaux(id uuid primary key references auth.users(id),actif boolean);
alter table public.admins enable row level security;
create policy "Full access" on public.admins to authenticated using(true) with check(true);
alter table public.profiles enable row level security;
create policy own_profile on public.profiles to authenticated using(id=auth.uid()) with check(id=auth.uid());
grant all on public.admins,public.profiles,public.commerciaux to anon,authenticated,service_role;
create function public.is_admin() returns boolean language sql stable as $$select exists(select 1 from public.profiles where id=auth.uid() and role='admin')$$;
create table public.entreprise(
 id text primary key default gen_random_uuid()::text, nom text, adresse text,telephone text,email text,site_web text,
 description text,ville text,gouvernorat text,image_url text,logo_url text,id_airtable text unique,
 statut_validation text,approved boolean,status text,is_premium boolean,slug text,slug_court text,
 statut_abonnement text,formule_commerciale text,categorie text[],sous_categories_texte text,
 cv_business_status text not null default 'none',cv_business_paid_at timestamptz,cv_business_published_at timestamptz,
 modele_cv text,palette_cv text,statut_publication text default 'Brouillon',opening_style text not null default 'photo',
 palette_cv_user_selected boolean not null default false,statut_carte text,
 created_at timestamptz,updated_at timestamptz,whatsapp text,"BTN_Maps" text,"Lien Avis Google" text,horaires_ok text,
 "lien facebook" text,"Lien Instagram" text,"Lien TikTok" text,"Lien LinkedIn" text,"Lien YouTube" text,lien_x text,a_propos text,services text);
create unique index entreprise_slug_court_unique on public.entreprise(lower(slug_court)) where slug_court is not null and btrim(slug_court)<>'';
alter table public.entreprise enable row level security;
create policy published on public.entreprise for select to anon,authenticated
 using(approved is true and statut_validation='publie' and statut_publication='Publié');
create policy staff on public.entreprise to authenticated using(public.is_admin() or exists(select 1 from public.admins where id=auth.uid()))
 with check(public.is_admin() or exists(select 1 from public.admins where id=auth.uid()));
grant select on public.entreprise to anon;
grant select,insert,update on public.entreprise to authenticated;
grant all on public.entreprise to service_role;
create table public.professional_profile_access(user_id uuid references auth.users(id),entreprise_id text references public.entreprise(id),
 granted_at timestamptz not null default now(),granted_by uuid references auth.users(id),primary key(user_id,entreprise_id));
alter table public.professional_profile_access enable row level security;
create policy own_access on public.professional_profile_access for select to authenticated using(user_id=auth.uid());
grant select on public.professional_profile_access to authenticated;
grant all on public.professional_profile_access to service_role;
create table public.suggestions_entreprises(
 id uuid primary key default gen_random_uuid(),created_at timestamptz not null default now(),
 nom_entreprise text,secteur text,ville text,contact_suggere text,email_suggesteur text,raison_suggestion text,
 statut text default 'en_attente',type_demande text,capacite_vehicule text,type_evenement text,date_evenement text,
 video_url text,pack_type text,image_url text,facebook_url text,instagram_url text,linkedin_url text,tiktok_url text,youtube_url text,
 submission_lang text default 'fr',titre_demande text,telephone text,email text,message text,source_page text,langue text,
 priorite text default 'Normale',airtable_record_id text,synced_to_airtable boolean default false,synced_at timestamptz);
alter table public.suggestions_entreprises enable row level security;
create policy public_insert on public.suggestions_entreprises for insert to anon,authenticated with check(true);
grant all on public.suggestions_entreprises to anon,authenticated,service_role;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
alter table storage.objects enable row level security;
grant insert,select on storage.objects to authenticated;
`);
  const migrationDirectory = new URL('../../supabase/migrations/', import.meta.url);
  for (const name of [
    '20261126082500_dalil_owner_profile_fields.sql',
    '20261126082600_dalil_owner_showcase_images.sql',
    '20261126095319_dalil_professional_entitlements_and_gallery.sql',
  ]) await db.exec(await readFile(new URL(name,migrationDirectory),'utf8'));
  const added = (await readdir(migrationDirectory)).filter(name => /dalil_(registration_admin_authority|miniapp_onboarding_workflow|miniapp_owner_account_claim|registration_receipt_integrations)\.sql$/.test(name)).sort();
  for (const name of added) await db.exec(await readFile(new URL(name,migrationDirectory),'utf8'));
  if (!added.some(name=>name.includes('registration_receipt_integrations'))) throw new Error('Receipt migration is required');
  return db;
}

export const testIds = {
  admin: '00000000-0000-4000-8000-000000000001',
  owner: '00000000-0000-4000-8000-000000000002',
  other: '00000000-0000-4000-8000-000000000003',
  unverified: '00000000-0000-4000-8000-000000000004',
};

export async function asTestRole(db, user, role='authenticated') {
  if (!['authenticated','anon','service_role','postgres'].includes(role)) throw new Error('Unexpected test role');
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",[user||'',role]);
  if (role!=='postgres') await db.exec(`set role ${role}`);
}

export const testDossier = (plan='artisan',changes={})=>({
  schemaVersion:1,plan,companyName:'Dossier fictif Dalil',managerName:'Responsable fictif',
  phone:'+21600000000',email:'owner@example.invalid',sector:'Artisanat',city:'Tunis',governorate:'Tunis',
  assistance:'autonomous',presentationModel:'business',palette:'prestige',openingStyle:'photo',
  activityDescription:'Présentation fictive utilisée exclusivement dans un test isolé.',productsDescription:'',
  address:'Adresse fictive',openingHours:'',googleMapsUrl:'',googleReviewsUrl:'',logoChoice:'none',logoUrl:'',
  photoUrls:[],socialLinks:{facebook:'',instagram:'',tiktok:'',youtube:'',linkedin:'',website:'',other:'',whatsapp:'',googleBusiness:''},
  selectedPlatforms:[],preferredContactMethods:['email'],preferredContactTimes:['anytime'],...changes,
});

export async function seedTestUsers(db) {
  for(const [kind,id] of Object.entries(testIds)) await db.query(
    'insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)',
    [id,`${kind}@example.invalid`,kind==='unverified'?null:new Date().toISOString()]);
  await db.query("insert into public.admins(id,email,role) values($1,'admin@example.invalid','admin')",[testIds.admin]);
  await db.query('insert into public.profiles(id) select id from auth.users');
}

export async function seedTestRequest(db,id,dossier=testDossier()) {
  await db.exec('reset role');
  await db.query(`insert into public.suggestions_entreprises(id,nom_entreprise,ville,email,telephone,pack_type,source_page,type_demande,message,creation_dossier)
    values($1,$2,$3,$4,$5,$6,'subscription','demande_abonnement','Dossier de test isolé',$7)`,
    [id,dossier.companyName,dossier.city,dossier.email,dossier.phone,dossier.plan,dossier]);
}
