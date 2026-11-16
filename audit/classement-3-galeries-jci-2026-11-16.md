# Dalil Tounes — classement documentaire de 3 fiches — 16 novembre 2026

Périmètre exclusif : catégories et liste_pages Airtable dans la base app9Q828Splwvm4jW, table tbl8B6aiFeUe0hoQS; miroir Supabase kmvjegbtroksjqaqliyv, public.entreprise.

## Sources et affectations
- rec4imyjLi48Ke3ka, **Espace 4022** (Akouda). Source: https://fr.cybo.com/TN/sousse/galeries-d%27art . Activité galerie d'art. Catégorie `Loisirs & Divertissement`; rubriques `loisirs & évènements` et `tourisme local & expatriation`.
- recaLfD4YKerLUwbJ, **Drawtastic** (Sousse). Même source Cybo, galerie d'art liée à son Linktree. Catégorie `Loisirs & Divertissement`; rubriques `loisirs & évènements` et `tourisme local & expatriation`.
- recCEwZil6meMoPhN, **JCI SOUSSE**. Sources: https://www.linkedin.com/company/jci-sousse et https://jamaity.org/association/jeune-chambre-internationale-de-sousse/ ; formation au leadership, engagement citoyen, développement des compétences. Catégorie `Education & Formation`; rubriques `entreprises`, `éducation`, `loisirs & évènements`. L'absence de catégorie métier « associations » dans les choix actuels limite la finesse de ce classement; ne pas transformer la JCI en entreprise commerciale.

## Contrôle
Les trois fiches avaient leur catégorie et leur liste_pages vides. Les modifications Airtable ont porté uniquement sur les champs `fldIIcE1DPdcwm40B` et `fld4CGEZ8oLqMsdvx`. Synchronisation Supabase 3/3 relue.
Avant: 2293 fiches, 138 sans pages, 127 sans catégorie. Après: **2293 fiches, 135 sans pages, 124 sans catégorie**.
Aucun statut d'approbation/publication, aucune boutique, PR, migration ou branche PWA modifié. Aucune livraison Vercel nécessaire.

## Risque de données à traiter dans un autre lot
Plusieurs lignes sans classement possèdent un ancien `id_airtable` qui n'est plus présent dans la table Airtable (ex. Inspila `recuSzuIQkaLNJGRG`), donc toute correction Airtable nécessite la résolution des sources avant une synchronisation sûre. Ne pas inventer ou reconstituer des IDs Airtable.

## Coordination
La page d'accueil, Maison Dalil, Citoyens/Tourisme/Loisirs/Services et les présentations Pros appartiennent à l'autre chantier de pages générales. La boutique, les devis/commandes, Edge Functions et PR #278/#281-286 appartiennent au chantier Boutique. Ici : classement et qualité des données uniquement.
