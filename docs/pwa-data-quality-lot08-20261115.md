# Lot 08 — Qualité des données métier, 15/11/2026

## Objectif et protections
Retrouver la classification de fiches sans catégorie en recoupant leurs propres données Airtable/Supabase et, quand disponible, les sites web d'établissements. Ne jamais créer/supprimer une fiche, changer un statut de publication ou déclencher la publication depuis une simple catégorie.

## État avant le lot
- Supabase `public.entreprise` : **2487** fiches.
- **1399** fiches sans `liste_pages`, dont **1359** également sans `categorie`.
- Parmi les 1359 : **1162** avec nom, **867** avec téléphone, **377** avec site web, seulement **10** avec description, **0** avec sous-catégorie. Il faut donc faire une revue documentaire, pas deviner pour la majorité.

## Lot de 12 fiches écrites dans Airtable, synchronisées Supabase
Trois dossiers initialement catégorisés mais sans pages :
- `recv3uiF0liuNfws5` Centre Beauté Zen (`Beauté & Bien-être`) → `entreprises`, `services citoyens`.
- `rec36TiK3nW1Io8pJ` Carrefour Express Hammam-Lif RN1 (`Supérette`, sous-catégorie 'Home goods store' contradictoire, laissée inchangée) → `commerces & magasins`, `services citoyens`.
- `recZjnCakEd4kRqmq` SOKAMAR Agency (`Expert.e maritime`) → `entreprises`.

Cinq fiches sans catégorie, métier documenté par site officiel :
- `rec25wapz7uFVu5dA` Amideast Lac 2, `recqL8h2KFUfCa1vK` Amideast Sousse, `receSfzOIADnCtXOf` Amideast Tunisia → `Education & Formation`, `éducation` + `entreprises`. Source : https://www.amideast.org/tunisia ; les sites officiels citent les bureaux Lac 2, Sousse, Tunis et l'activité de formation. `Amideast Monastir` exclu car localisation non confirmée sur le site officiel.
- `recgCvygzxM8CM72j` APAC — Académie Pilote des Arts et de la Création → `Education & Formation`, `éducation` + `loisirs & évènements`. Source : https://apac.tn/.
- `recqjRzEYvMdExwSl` Art Tattoo Monastir → `Beauté & Bien-être`, `entreprises` + `services citoyens`. Source : https://arttattoomonastir.com/.

Trois autres sites recoupés :
- `recmrU94Tb5kxbp8I` agence Kontrast Design → `entreprises` + `services citoyens`. Source : https://kontrast744124643.wordpress.com/ (agence d'architecture d'intérieur à Mahdia). **Catégorie laissée vide** faute de libellé existant sûr correspondant à l'architecture d'intérieur, à corriger par enrichissement du référentiel.
- `recYAzzi82qlX9pJF` ARCHIVART GALLERY → `Loisirs & Divertissement`, `loisirs & évènements` + `commerces & magasins` + `tourisme local & expatriation`. Source : https://archivart.co/ (galerie d'art, œuvres et événements).
- `rec9bWzoAOXq4V6ER` ADMISSION Centre Allemand Sousse → `Education & Formation`, `éducation` + `tourisme local & expatriation` + `entreprises`. Source : https://admission.tn/ et https://telc.admission.tn/ (formations, examens de langue et accompagnement).
- `recfzQd3fuoc1jlLL` Amir Palace → `Hébergement & Séjour`, `tourisme local & expatriation` + `entreprises` + `loisirs & évènements`. Source : https://amirpalace.com.tn/ (hôtel à Skanes, hébergement et conférences).

## Validation après la dernière synchronisation
- **12/12** enregistrées dans Airtable et synchronisées dans Supabase.
- **0** statut `publie`, **0** `statut_publication` non NULL et aucune approbation TRUE sur ces douze dossiers.
- **2487** fiches totales (compteur accueil préservé), **1387** sans liste de pages, **1350** sans page ni catégorie. Les écarts de catégories peuvent aussi inclure d'autres synchronisations concomitantes ; la validation de ce lot repose sur les 12 IDs précis.
- Total des lots de correction connus avant ce lot : **70**, soit **82** affectations répertoriées après ce lot.
- Retour arrière : remettre les 12 champs `liste pages` à leurs valeurs initiales (tous vides) et, pour les dossiers catégorisés ici, remettre `categorie` vide ; vérifier le retour SQL. Ne pas rétablir les catégories existantes des trois premiers ni supprimer de fiches.

## Restes à traiter
- `Lessing-Institut` : ligne publiée héritée, ID Airtable absent, distincte d'une fiche `Lessing Institute` en préparation. **Ne pas fusionner sans historique**.
- Catégorie spécifique à l'architecture/intérieur à définir ; fiche Kontrast reste sans `categorie`.
- Les **1350** sans page ni catégorie demandent une récupération des métiers documentés. Les **37** sans page mais catégorie nécessitent revue manuelle (bâtiments, importations contradictoires, noms génériques).
- Typecheck global et tests des écrans historiques du site restent hors lot ; ils doivent être traités de manière isolée.

**Aucun déploiement de nouveau code PWA dans ce lot : données synchronisées directement, le site et les mini-apps non modifiés.**
