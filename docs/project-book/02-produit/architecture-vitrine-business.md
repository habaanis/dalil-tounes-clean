# Architecture de la Vitrine Business Dalil Tounes

Version : 1.0

## Décision officielle

Dalil Tounes utilise une seule architecture technique de vitrine.

Cette architecture adapte automatiquement le contenu et les fonctions selon l'offre de l'entreprise.

```text
Moteur commun Vitrine Business
        ├── Fiche annuaire gratuite
        ├── Vitrine Business Artisan
        └── CV Business Premium
```

Le CV Business complet correspond à l'offre Premium.

L'offre Artisan utilise le même moteur, mais avec une présentation plus simple et un nombre de fonctions limité.

---

## Principes

1. Une seule base de code doit gérer les offres.
2. Les différences entre Artisan et Premium sont contrôlées par une configuration centrale.
3. Le visuel général du site Dalil Tounes n'est pas refait dans ce chantier.
4. Les améliorations visuelles concernent d'abord l'intérieur de la vitrine.
5. L'identité Dalil Tounes est conservée.
6. Lienora sert de référence pour les mécanismes, la qualité du contenu et le SEO, pas comme modèle visuel à copier.
7. Les bases SEO techniques doivent être correctes pour toutes les fiches indexables.
8. La richesse du contenu et les fonctions commerciales distinguent les offres.

---

## Socle commun

Toutes les variantes peuvent partager :

- identité de l'entreprise ;
- nom et logo ;
- métier et spécialités ;
- ville et gouvernorat ;
- adresse et itinéraire ;
- horaires ;
- téléphone et moyens de contact autorisés ;
- URL officielle ;
- données structurées ;
- connexion aux pages métier, ville, gouvernorat et secteur ;
- entreprises similaires ;
- avis lorsque disponibles.

---

## Fiche annuaire gratuite

La fiche gratuite reste une présence d'annuaire, et non un CV Business complet.

Elle doit néanmoins être utile et ne pas paraître vide.

Fonctions prévues :

- nom ;
- logo ;
- activité ;
- localisation ;
- horaires ;
- contact essentiel ;
- avis ;
- liens vers la plateforme.

La galerie, les réseaux sociaux, la réservation et les fonctions commerciales avancées ne sont pas inclus.

---

## Vitrine Business Artisan

La version Artisan est une vitrine professionnelle essentielle.

Fonctions prévues :

- présentation de l'activité ;
- services ;
- section à propos ;
- jusqu'à 3 photos ;
- horaires ;
- adresse et GPS ;
- téléphone, WhatsApp, email et site web selon les données disponibles ;
- avis ;
- QR code ;
- partage ;
- connexion à la plateforme ;
- entreprises similaires.

La vidéo, les réseaux sociaux complets et la réservation ne sont pas inclus par défaut.

---

## CV Business Premium

Le Premium est le véritable CV Business vivant complet de Dalil Tounes.

Fonctions prévues :

- présentation détaillée ;
- services et spécialités ;
- section à propos ;
- réalisations ;
- galerie enrichie ;
- jusqu'à 5 photos ;
- une vidéo ;
- horaires ;
- adresse, carte et itinéraire ;
- téléphone, WhatsApp, emails et site web ;
- réseaux sociaux ;
- avis ;
- réservation ;
- QR code ;
- outils de partage ;
- connexion complète à la plateforme ;
- entreprises similaires.

L'offre Elite Pro peut utiliser la même architecture Premium avec des limites médias et fonctions supplémentaires.

---

## Référence Lienora

Les mécanismes utiles à reprendre et adapter sont :

- sections de contenu clairement organisées ;
- gestion propre des champs absents ;
- contenu utile visible directement ;
- présentation, services, réalisations, photos, horaires et informations pratiques ;
- métadonnées propres à chaque entreprise ;
- canonical individuel ;
- HTML initial exploitable par les moteurs ;
- données structurées ;
- sitemap des vitrines publiées ;
- partage et QR code.

Ces mécanismes doivent être adaptés à Airtable, Supabase, ImageKit et aux composants existants de Dalil Tounes.

---

## Ordre de construction

1. Centraliser les fonctions par offre.
2. Cartographier les champs et composants existants.
3. Construire le CV Business Premium sur SKILA Mahdia.
4. Désactiver proprement les modules Premium pour obtenir la variante Artisan.
5. Vérifier la fiche gratuite.
6. Ajouter le moteur SEO serveur.
7. Raccorder la vitrine aux pages de la plateforme.

---

## Règle de validation

Aucune modification de l'apparence générale de Dalil Tounes ne sera engagée avant la validation des vitrines pilotes.

Le premier objectif est un moteur commun fiable, puis une excellente expérience intérieure pour la Vitrine Artisan et le CV Business Premium.
