# Dalil Tounes — Feuille de route produit (29 octobre 2026)

## Décision validée — « Visiter autrement »
Conserver les fiches, modèles et parcours existants, sans reconstruction ni doublons.
1. Terminer l'enrichissement et la vérification des expériences locales de Siliana, Kasserine puis Gafsa; priorité aux personnes, artisans, agriculteurs, guides et producteurs, avec sources fiables et contacts vérifiables.
2. Améliorer progressivement le parcours actuel : découverte par gouvernorat et type d'expérience, sans saisie inutile.
3. Distinguer clairement les statuts « expérience confirmée » (preuve récente), « contacter avant la visite » (pas de visite garantie) et « établissement référencé ».
4. Améliorer les fiches avec photographies authentiques réutilisables, contexte de la rencontre, coordonnées, informations pratiques sourcées; ne jamais inventer prix, horaires, durées ou possibilités de visite.
5. Proposer des découvertes pertinentes à proximité et des itinéraires, puis des favoris et du partage mobile, enfin mesurer vues et clics utiles, dans le respect de la confidentialité.
6. Pas de réservation ni paiement en ligne à court terme. Préserver la simplicité mobile et les cinq langues FR/AR/EN/IT/RU.

## Carte GPS « autour de moi » : EXISTANTE — ne pas recréer
- Routes déjà branchées : /around-me et /autour-de-moi dans src/AppRouter.tsx.
- Page existante : src/pages/AroundMe.tsx, basée sur React Leaflet / OpenStreetMap, geolocation navigateur, marqueurs et directions Google Maps.
- Audit fonctionnel à effectuer avant tout changement : source Supabase, coordonnées réelles, filtres des fiches approuvées/publiées, permissions de localisation, accès depuis les rubriques Tourisme et S'installer.
- Pour « Visiter autrement », réutiliser ce composant/cette page et connecter uniquement les expériences locales publiées avec coordonnées fiables. Ne pas créer une deuxième carte.

## Phase suivante après tourisme : « S'installer en Tunisie »
Réutiliser les fiches Dalil Tounes existantes dans les rubriques logement, formalités, banque/assurances, santé, éducation, transport, travail/entrepreneuriat et vie quotidienne, avec « une entreprise, plusieurs rubriques ». Classer par ville/gouvernorat et besoin ; éviter les doublons, vérifier l'information administrative et utiliser la carte « autour de moi ».

## Règles permanentes de réalisation
Avant toute création/modification : auditer Airtable, Supabase, GitHub, Vercel et les fonctions existantes.
Ne pas publier les brouillons faute de preuve actuelle de visite; garder les contacts à confirmer.
Ne pas prétendre qu'une modification est en production sans vérifier le déploiement.
Maintenir un bilan des travaux terminés et des dépendances restantes.

## Réutilisation sur les autres rubriques — décision confirmée
Le parcours découverte (filtres, géolocalisation, suggestions à proximité, statut de fiabilité, favoris et partage) doit être conçu comme des composants réutilisables, et déployé progressivement sur S'installer en Tunisie, Loisirs & événements et les services citoyens lorsque c'est pertinent. Ne pas créer de carte GPS ou de système de favoris parallèle ; auditer les composants existants avant tout développement.

## Contrôle du 29 octobre 2026 — Siliana / Kasserine / Gafsa
Six anciennes copies Supabase sans identifiant Airtable, auparavant approuvées, ont été désactivées pour éviter les doublons : ZINA Oliveraie, Esparto, Artisan'Art by Hermassi, Salha Tounsi, Visit Siliana et Association 2AS. Les fiches synchronisées Airtable restent les références. Gafsa nécessite encore une recherche de contacts fiables avant toute publication.

## Clôture de la première phase — 29 octobre 2026
Bilan vérifié des fiches principales liées à Airtable pour Siliana/Kasserine/Gafsa : 6 publiées, 6 en brouillon (Siliana 4/3, Kasserine 2/1, Gafsa 0/2). Les anciennes copies non reliées à Airtable ne sont pas comptées. La synchronisation du téléphone du Hub Design Gafsa (+216 22 182 112) a été confirmée dans Supabase. **Clôture de la phase de collecte initiale seulement** : ne pas publier les brouillons sans preuve de contact et de conditions d'accueil. Conserver une liste des contacts manquants et des photos authentiques à ajouter.

## Démarrage de « S'installer en Tunisie » — audit préalable
Le routeur src/AppRouter.tsx expose déjà /citizens, /citizens/services, /citizens/health, /citizens/shops, /citizens/leisure et /citizens/tourism. La carte /around-me existe également. Avant toute nouvelle page ou rubrique : examiner les composants et données existants, choisir le point d'entrée le plus pertinent et construire une classification des besoins (logement, démarches, banque, santé, éducation, mobilité, entrepreneuriat, quotidien) fondée sur les entreprises vérifiées. Les pages existantes restent intactes jusqu'à audit UX et affectations Airtable/Supabase.

## Architecture confirmée : liste_pages, catégories et rubriques
**Décision produit : conserver impérativement le fonctionnement multi-affectation existant.** `liste_pages` détermine les pages sur lesquelles une fiche unique est visible (plusieurs valeurs possibles). `categorie` identifie les activités/métiers (également multi-valeurs). Les rubriques ou sous-catégories servent à affiner la découverte par besoin (ex. S'installer en Tunisie > Logement > Agences immobilières). Ne pas confondre ces trois niveaux, ne pas cloner les entreprises pour les faire apparaître ailleurs et ne pas créer un second annuaire. L'audit SQL du 29/10/2026 confirme que `categorie` et `liste_pages` sont des tableaux; `sous_categories_clean` est souvent vide : auditer les champs natifs Airtable et leurs valeurs avant d'implémenter un filtre de sous-rubrique. Éviter d'ajouter des libellés arbitraires aux sélections Airtable sans contrôler les options existantes et les consommateurs du champ. Réutiliser les composants de recherche et la carte GPS existants. Priorité immédiate : auditer la structure actuelle de S'installer en Tunisie et établir une correspondance pages > rubriques > catégories avant tout changement de production.

## Audit initial « S'installer en Tunisie » — 29 octobre 2026
Le routeur ne possède pas encore de page dédiée explicite « S'installer en Tunisie » ; il expose déjà `/citizens/services`, `/citizens/health`, `/citizens/shops`, `/citizens/leisure` et `/around-me`. `CitizensServicesLocalized.tsx` est une page de **services citoyens** centrée sur les démarches et organismes publics ; ne pas la renommer ni remplacer : l'installation est un parcours transversal distinct qui devra réutiliser ces pages. L'inventaire des catégories publiées est majoritairement touristique (`tourisme&expatriation`, `Artisanal & Terroir`, etc.) : ne pas supposer que les organismes logement/banque/santé sont déjà publiés. **Première étape d'implémentation** : auditer les enregistrements existants et les options Airtable, puis créer une navigation d'installation réutilisant les pages existantes, sans assignations automatiques approximatives ni faux établissements. Préserver multi-valeurs `liste_pages` et `categorie`, sous-rubriques sous forme de taxonomie de besoins plutôt que duplication de fiches. Mesurer ensuite la pertinence des recherches et les lacunes régionales.

## Rectification après capture utilisateur — 29 octobre 2026
« S'installer en Tunisie » **existe déjà** comme onglet `settle` dans `src/pages/CitizensTourism.tsx` (parcours Tourisme & Expatriation), avec 8 accordéons et 5 langues. Ne surtout pas créer une nouvelle page autonome ni dupliquer ce parcours. La page est volontairement proche des services citoyens mais a un usage distinct : accompagner l'installation en renvoyant aux services et fiches pertinentes. Les 8 rubriques déjà présentes comprennent Visa/séjour/résidence, Logement/déménagement, Santé/assurance, École/scolarité, Banque/change/fiscalité, Véhicule/biens/douane, Travail/création, Vie quotidienne. Pour « Banque », ne pas accumuler les banques disponibles : préférer un guide pratique de choix selon le besoin (compte résident/non-résident, transferts, change, frais, documents, services aux entreprises) avec renvoi vers les sources réglementaires officielles, puis recherche locale d'agences uniquement si utile. Conserver `liste_pages` multi-affectations et vérifier les liens internes et accordéons avant tout changement. Rectification de l'audit précédent qui disait, à tort, qu'aucun parcours S'installer n'existait.

## Idée mise de côté — guide PDF payant « S'installer en Tunisie » (à reprendre plus tard)
Décision utilisateur : conserver l'idée en backlog, **ne pas la développer maintenant**. Concept : guide complet téléchargeable, huit chapitres correspondant aux rubriques existantes, démarches détaillées et sourcées, checklists, formalités de santé/assurance/rapatriement et remboursements selon le statut, liens officiels et date de vérification. Prix de lancement évoqué : 14,90 € (simple hypothèse, non validée). Ne pas créer pour l'instant de PDF, de paiement ni de lien d'achat. Garder gratuitement les informations essentielles et d'urgence. Priorité immédiate : poursuivre les améliorations des huit accordéons de la page existante « S'installer en Tunisie » et leurs redirections explicites.


### Guide PDF « S’installer en Tunisie » — idée retenue (30 octobre 2026)
- Ajouter une rubrique **« Acheter un bien immobilier en Tunisie »** dans le futur guide PDF, sans lancer la production du PDF maintenant.
- Contenu envisagé : étapes de l'achat, rôle du notaire et de l'agence, titres fonciers, vérifications juridiques, frais et taxes, particularités pour les étrangers/non-résidents, financement et transfert des fonds, recours aux sources administratives officielles actualisées. Ne pas présenter un conseil juridique comme universel ; vérifier selon nationalité, statut et nature du terrain.
- Relier à l'annuaire immobilier existant ; ne pas créer de doublon de section/site.


### Guide PDF immobilier — parcours documentaire acheteur (décision du 30/10/2026)
- Concevoir à terme un **parcours opérationnel d'achat immobilier en Tunisie**, plutôt qu'un exposé général : intervenants (agence, avocat, professionnel chargé de l'acte, expert immobilier, banque, administrations), ordre des démarches et rôles respectifs.
- Chaque étape précise les **documents à fournir**, **par qui**, **à qui**, **qui les contrôle/valide**, **où les obtenir**, **durées de validité ou ancienneté demandée lorsque vérifiable**, et **moment de présentation**.
- Inclure une checklist « dossier prêt avant le premier rendez-vous à l'agence », **avec son accord**, et distinguer pièces acheteur, vendeur et bien immobilier. Exemples à étudier : titre foncier / « titre bleu », identité, preuve d'origine des fonds, documents bancaires, procuration, attestations, autorisations administratives selon situation.
- Séparer obligations légales selon nationalité, résidence, zone/type de bien et exigences propres aux professionnels ; sourcer auprès des autorités tunisiennes et professionnels compétents. Ne pas inventer de durées ni proposer le dépôt centralisé de documents sensibles sur Dalil Tounes sans protection adaptée.
- **Ne pas produire le PDF maintenant** : idée et cahier des charges conservés pour une phase ultérieure.


### Principe de prudence du futur PDF immobilier — validé le 30/10/2026
- Le PDF est un **guide pratique d'orientation**, non un avis juridique, fiscal ou bancaire et non une garantie d'exhaustivité.
- Afficher clairement une **date de mise à jour** et avertir que les lois, autorisations, procédures, pièces exigées, tarifs et délais peuvent changer.
- Préciser que **toute décision finale et toute information déterminante doivent être vérifiées** auprès des administrations tunisiennes compétentes et des professionnels concernés (agence, avocat, notaire, banque, expert), selon le profil de l'acheteur et le bien.
- Pour les pièces documentaires, ne fournir une durée de validité que si elle est sourcée et datée ; sinon indiquer « à confirmer auprès du service compétent ».
- Prévoir cet avertissement en introduction et au niveau des étapes sensibles, sans rendre le guide alarmiste. **Production du PDF toujours reportée**.


### Guide PDF — expérience ludique, utile et prudence documentaire (validation du 30/10/2026)
- Le futur guide **ne doit pas être seulement lisible** : concevoir une expérience pratique, visuelle et engageante, avec parcours étape par étape, checklists à cocher, tableaux « qui fait quoi », schémas de décision, exemples concrets, espaces pour noter ses démarches et éventuellement liens/QR vers sources officielles ou annuaire Dalil Tounes.
- Pour l'achat immobilier, faciliter un **dossier préparatoire à remettre à une agence avec son accord**, sans inciter à envoyer spontanément des pièces personnelles sensibles ; distinguer clairement pièces de l'acheteur, du vendeur et du bien.
- **Prudence juridique et administrative obligatoire :** toujours signaler que réglementation, frais, exigences, délais, documents et décisions définitives peuvent varier ou évoluer ; inviter le lecteur à **revérifier les informations les plus récentes auprès des autorités et professionnels compétents avant toute décision, signature ou paiement**.
- Indiquer date de dernière vérification, sources officielles et limites du guide ; ne jamais présenter les durées de validité ou obligations comme acquises sans source fiable. Adapter le parcours au statut (nationalité/résidence), au type de bien et à l'opération.
- **Ne pas lancer la réalisation du PDF à ce stade** ; conserver ces critères pour la phase dédiée.


### Règle transversale pour TOUTES les rubriques du futur PDF (30/10/2026)
- Appliquer à chaque rubrique (santé, scolarité, banque, fiscalité, logement, travail, véhicule, vie quotidienne, etc.) la même approche **utile, ludique et prudente** que pour l'achat immobilier.
- Prévoir deux profondeurs de lecture (parcours rapide et parcours détaillé), étapes concrètes, listes à cocher, « qui contacter / quels documents / où les obtenir / qui vérifie / quand », exemples, liens et QR utiles, section « Mon prochain pas ».
- Signaler systématiquement que les démarches, pièces, règles, tarifs, délais et décisions peuvent évoluer et doivent être **confirmés auprès des organismes officiels et professionnels compétents avant engagement** ; dates de vérification et sources.
- Ne pas héberger les dossiers sensibles sans dispositif approprié. La rédaction et la production du PDF sont différées.


### Banque, change et fiscalité — priorité aux démarches (30/10/2026)
- Le cœur de la rubrique « S’installer en Tunisie » doit être **l'accompagnement dans les démarches**, et non une accumulation de banques et bureaux de change.
- **Ne pas supprimer** les banques et bureaux de change : garder une sélection utile et géographiquement accessible, en privilégiant les établissements bien renseignés et dont les avis sont suffisamment nombreux et fiables (contrôle des notes et volumes d'avis, sans présenter les avis comme une garantie).
- Mettre en avant : ouverture de comptes selon le statut (résident, non-résident, TRE), transferts de fonds internationaux, justificatifs, change réglementé, financement immobilier et formalités fiscales ; distinguer les règles selon situation et citer les sources officielles actualisées.
- Garder des liens vers les établissements sélectionnés en complément des explications. Vérifier les fiches existantes Airtable avant tout ajout et ne pas créer de doublons.
- Présentation envisagée : démarche expliquée en premier, puis « Où effectuer cette démarche ? » avec liens pertinents vers les banques/bureaux de change.


### Futur PDF — importer véhicule, meubles et matériel professionnel (validation du 30/10/2026)
- Développer la rubrique « Véhicule, biens et douane » en trois parcours interactifs : (1) venir avec sa voiture / importation ou admission temporaire, (2) déménager des meubles et effets personnels, (3) transporter du matériel et des équipements professionnels.
- Pour les véhicules : présenter les conditions selon la nationalité, résidence et statut (notamment TRE/FCR le cas échéant), limites d'âge du véhicule **uniquement après vérification officielle et datée**, propriété, durée de présence autorisée, réexportation, immatriculation, fiscalité, permis et assurance.
- Pour les meubles : conditions du déménagement, inventaire détaillé, justificatifs de résidence, documents du transporteur, éventuelles franchises, restrictions et formalités à l'arrivée.
- Pour le matériel professionnel : distinguer usage personnel/professionnel, importation temporaire/définitive, statut de l'activité, documents, autorisations spécifiques, taxes et contraintes réglementaires.
- Même méthode ludique que le reste du guide : question initiale « que souhaitez-vous faire venir ? », étapes, tableau qui fait quoi, documents/validité/organisme, checklist imprimable, erreurs fréquentes, coûts à vérifier et bloc « Mon prochain pas ».
- Ne jamais promettre une exonération, une limite d'âge ou un avantage fiscal sans vérifier les conditions exactes auprès de la Douane tunisienne et autorités compétentes au moment de l'opération ; avertir que règles et seuils peuvent évoluer. Inclure les sources officielles et dates de mise à jour.
- La rédaction du PDF reste différée ; conserver cette spécification pour sa conception ultérieure.
