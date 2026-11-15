# Dalil Tounes — nettoyage 14 brouillons et reprise classement (15 novembre 2026)

## Suppression demandée et effectuée
- Base de données: Supabase projet kmvjegbtroksjqaqliyv; table public.entreprise.
- Avant: 2487 fiches, 197 sans nom, 394 sans rubrique, 371 sans catégorie.
- **14 lignes supprimées** via SQL, avec garde-fous sur leurs IDs exacts, nom vide, id_airtable NULL, slug hanine-pastry, brouillon, approved=false, et champs de contact/description vides.
- Aucune référence détectée dans public.business_needs (company_id), dalil_boutique_change_requests, dalil_boutique_products, dalil_boutique_push_subscriptions pour ces 14 UUID ; vérification des quatre clés étrangères.
- UUID supprimés: 01788f4b-6774-484f-8596-e50c82d760e3 1135d6cb-1f83-4527-b972-e61f62a9a359 2eb9d99f-bfe8-4268-9f21-be2869be940c 376658e2-6501-4f90-abcb-2b7417c8da17 4c766e55-32be-4579-9ee0-1b43553bc9e9 51994a54-6047-48cf-80c7-ec37848d175e 81ea0f71-7b10-4917-b49c-1623519c48b8 933bf7dc-3739-4483-bd7e-2529ebcae020 99a86892-4685-46cc-b5db-1e43b4604657 b4e27ad1-144f-48bc-823a-a0742da67bdc c1f1c4af-c3e0-4b2e-bb36-b9351b89d746 d826d6d2-ea12-4a46-b3d0-f309bda2b23c dbf9f4e4-2f9f-46f7-8034-8fd96755cc47 fb02332c-cd57-4715-add5-2c93255fedf8
- Contrôle SQL DELETE RETURNING: 14 lignes effectivement supprimées.
- Après: **2473 fiches**, 183 sans nom, 380 sans rubrique, 357 sans catégorie.
- Ne pas supprimer automatiquement les 183 fiches sans nom restantes : non vérifiées comme réellement vides.

## Classement de 5 fiches déjà catégorisées
Écritures Airtable base app9Q828Splwvm4jW, table tbl8B6aiFeUe0hoQS: uniquement le champ liste_pages fld4CGEZ8oLqMsdvx = entreprises (sans modifier catégorie, validation, publication).
- rec0C4PX1FVii96u2 — Vita Tunisie — catégorie Artisanal & Terroir.
- rec7Cr0XfDc3GLqLl — TILAPIA — catégorie Artisanal & Terroir.
- reclxyVxmg9vOKxdq — L'aise Sensoriel — catégorie Artisanal & Terroir.
- recSyl0b7VFkHLt0x — Black Bee — catégorie Alimentation.
- recxN6ebow8p5maM6 — Sou & Me Handmade — catégorie Alimentation.
Les descriptions Supabase décrivent une activité agricole/agroalimentaire de structures ESS; offre et coordonnées non confirmées ; aucune publication activée.
- Pré-contrôle: 5 IDs uniques dans Supabase et rubrique vide.
- Écriture Airtable 5/5.
- **Synchronisation Supabase confirmée 5/5**.
- Après lot: **2473 fiches, 375 sans rubrique, 357 sans catégorie**.
- Aucun déploiement Vercel nécessaire pour mises à jour des données ; état public et compteur frontend non vérifiés visuellement.

## Prochaine étape
Analyser les 375 fiches sans rubrique : 183 sans nom; cas restants classables à partir de descriptions / preuves vérifiées. Examiner séparément les anciens enregistrements à catégorie incohérente ; ne pas reclasser automatiquement.
