alter table public.entreprise
  add column if not exists a_propos_ar text,
  add column if not exists services_ar text,
  add column if not exists categorie_ar text,
  add column if not exists ville_ar text,
  add column if not exists gouvernorat_ar text;
