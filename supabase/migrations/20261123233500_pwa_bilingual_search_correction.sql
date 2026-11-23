-- French / Arabic spelling suggestions for the independent Dalil Tounes PWA.
-- Reads the existing Airtable-synced entreprise categories, subcategories,
-- services and search words with invoker RLS; no business rows are modified.
-- Apply before deploying the corresponding PWA client.
CREATE OR REPLACE FUNCTION public.dalil_search_normalize(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
 SET search_path TO 'public'
AS $function$
  select trim(regexp_replace(
    translate(lower(public.unaccent(coalesce(v, ''))),
      'إأآٱىة', 'اااايه'),
    '[ًٌٍَُِّْٰـ]', '', 'g'));
$function$;

CREATE OR REPLACE FUNCTION public.dalil_search_edit_distance(a text, b text)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE PARALLEL SAFE STRICT
 SET search_path TO 'public'
AS $function$
declare m integer:=char_length(a); n integer:=char_length(b); i integer; j integer; previous integer[]; current_row integer[]; cost integer;
begin
 if m>40 or n>40 then return 999; end if;
 previous := array_fill(0, array[m+1]);
 for i in 0..m loop previous[i+1]:=i; end loop;
 for j in 1..n loop
   current_row := array_fill(0, array[m+1]);
   current_row[1]:=j;
   for i in 1..m loop
     cost:=case when substring(a from i for 1)=substring(b from j for 1) then 0 else 1 end;
     current_row[i+1]:=least(previous[i+1]+1,current_row[i]+1,previous[i]+cost);
   end loop;
   previous:=current_row;
 end loop;
 return previous[m+1];
end;
$function$;

CREATE OR REPLACE FUNCTION public.dalil_search_suggest(p_query text)
 RETURNS TABLE(suggestion text, search_query text, confidence real, source text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with request as (
 select public.dalil_search_normalize(left(trim(p_query), 80)) as q
),
aliases(display_term, target) as (
 values
('مستشفى','hopital'),
('مستشفيات','hopital'),
('سبيطار','hopital'),
('كلينيك','clinique'),
('عيادة','clinique'),
('طبيب','medecin'),
('دكتور','medecin'),
('طبيب أسنان','dentiste'),
('طبيب اسنان','dentiste'),
('سنان','dentiste'),
('صيدلية','pharmacie'),
('فارماسي','pharmacie'),
('مدرسة','ecole'),
('مدرسه','ecole'),
('مكتب','bureau'),
('معهد','institut'),
('روضة','creche'),
('روضه','creche'),
('حضانة','creche'),
('حضانـة','creche'),
('كراس','creche'),
('ميكانيكي','mecanique'),
('ميكانيسيان','mecanique'),
('قاراج','garage'),
('كراج','garage'),
('مصلح سيارات','garage'),
('مطعم','restaurant'),
('ريسطو','restaurant'),
('مقهى','cafe'),
('قهوة','cafe'),
('نزل','hotel'),
('اوتيل','hotel'),
('فندق','hotel'),
('بيت ضيافة','gite'),
('دار ضيافة','gite'),
('حلاق','coiffure'),
('حلاقة','coiffure'),
('كوافور','coiffure'),
('سباك','plomberie'),
('بلومبي','plomberie'),
('كهربائي','electricite'),
('قهواجي','cafe'),
('حلويات','patisserie'),
('ترايتور','traiteur'),
('traiteur','traiteur'),
('garage', 'garage'), ('garagiste', 'garage'),
('mecano','mecanique'),
('mécano','mecanique'),
('plombier','plomberie'),
('electricien','electricite'),
('électricien','electricite'),
('coiffeur','coiffure'),
('coiffeur', 'coiffure'),
('dentist','dentiste'),
('dentiste', 'dentiste'),
('resto','restaurant'),
('restaurant','restaurant'),
('garderie','creche'),
('garderie scolaire','creche'),
('école','ecole'),
('crèche','creche'),
('hôpital','hopital'),
('gîte','gite')
),
available_terms as (
 select distinct trim(term) as term
 from public.entreprise e
 cross join lateral (
    select unnest(coalesce(e.categorie, array[]::text[])) as term
    union all
    select regexp_split_to_table(coalesce(e.sous_categories_texte,''), '[,;/&() —-]+')
    union all
    select regexp_split_to_table(coalesce(e.sous_categories_clean,''), '[,;/&() —-]+')
    union all
    select regexp_split_to_table(coalesce(e.services,''), '[,;/&() —-]+')
    union all
    select regexp_split_to_table(coalesce(e."mots cles recherche",''), '[,;/&() —-]+')
    union all
    select nullif(e.categorie_ar,'')
 ) words
 where char_length(trim(term)) between 4 and 35
),
candidates as (
 select a.display_term as suggestion, a.target as search_query,
   case when public.dalil_search_normalize(a.display_term)=r.q then 1.0
     else greatest(public.similarity(public.dalil_search_normalize(a.display_term), r.q), case when abs(char_length(public.dalil_search_normalize(a.display_term))-char_length(r.q))<=2 and public.similarity(public.dalil_search_normalize(a.display_term), r.q)>=.15 then case when public.dalil_search_edit_distance(public.dalil_search_normalize(a.display_term), r.q)<=1 then .92 when char_length(r.q)>=5 and public.dalil_search_edit_distance(public.dalil_search_normalize(a.display_term), r.q)<=2 then .72 else 0 end else 0 end) end::real as score,
   'alias'::text as source, 0 as priority
 from aliases a cross join request r
 where char_length(r.q)>=3
 union all
 select t.term,t.term,
   greatest(public.similarity(public.dalil_search_normalize(t.term), r.q), case when abs(char_length(public.dalil_search_normalize(t.term))-char_length(r.q))<=2 and public.similarity(public.dalil_search_normalize(t.term), r.q)>=.15 then case when public.dalil_search_edit_distance(public.dalil_search_normalize(t.term), r.q)<=1 then .92 when char_length(r.q)>=5 and public.dalil_search_edit_distance(public.dalil_search_normalize(t.term), r.q)<=2 then .72 else 0 end else 0 end)::real,
   'airtable'::text, 1
 from available_terms t cross join request r
 where char_length(r.q)>=3
)
select c.suggestion, c.search_query, c.score as confidence, c.source
from candidates c cross join request r
where (
 (public.dalil_search_normalize(c.suggestion)=r.q)
 or (c.score >= case when char_length(r.q)<=4 then .73 else .47 end
      and abs(char_length(public.dalil_search_normalize(c.suggestion))-char_length(r.q))<=2
      and (left(public.dalil_search_normalize(c.suggestion),1)=left(r.q,1) or c.score >= .70))
)
order by
 case when public.dalil_search_normalize(c.suggestion)=r.q then 0 else 1 end,
 c.priority, c.score desc, char_length(c.suggestion) asc
limit 1;
$function$;

revoke all on function public.dalil_search_suggest(text) from public;
grant execute on function public.dalil_search_suggest(text) to anon, authenticated;
