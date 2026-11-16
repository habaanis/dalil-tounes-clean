# Dalil Tounes — grand lot de classement de 15 fiches — 16 novembre 2026

## Périmètre et sécurité
Base Airtable `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`; base Supabase `kmvjegbtroksjqaqliyv`, `public.entreprise`. Seuls les champs Airtable `fldIIcE1DPdcwm40B` (catégorie) et `fld4CGEZ8oLqMsdvx` (liste_pages) ont été modifiés, sans approbation, publication, migrations, Boutique, QR, code du site ou PWA.

## Lot écrit : 15 identifiants, synchronisation confirmée 15/15
| Fiche / ID Airtable | Catégorie ajoutée | Rubrique(s) |
| --- | --- | --- |
| Yasso Design / recjVoIB5hDub4OrA | Education & Formation | éducation ; entreprises |
| Move Design / recaeFLByhUKT5TVn | inchangée (aucune catégorie précise confirmée dans taxonomie) | entreprises |
| Atelier creativo / recxfNYTlFFI87yhr | Métiers Artisanaux (générique) | entreprises |
| Atelier mouna / rec0g1VSzhAyRi7vE | Métiers Artisanaux (générique) | entreprises |
| Atelier Nour gzara / reckkZKsF5yJwZLJT | Métiers Artisanaux (générique) | entreprises |
| Atelier_al_raida / receX7VtntQP9yeCe | Métiers Artisanaux (générique) | entreprises |
| Jana art design / recuIfVSfC1N52LyX | inchangée | entreprises |
| Jasmin's workshop / recUyko43ab5MEH2A | Métiers Artisanaux (générique) | entreprises |
| Arrahma store / recklObe4PdfZn2Hy | inchangée | commerces & magasins |
| FLAKs / recvEBEGF2MEA2ntX | inchangée | commerces & magasins |
| Klarity - visual services / recVGuxkR5CV4S0Fh | inchangée | entreprises |
| Ozva design / rec5GNLneYSHI8mtv | inchangée | entreprises |
| Next Studio / recawx4b53lbNw8Vg | inchangée | entreprises |
| Y Studio / rec8gvraV5tNAQo7F | inchangée | entreprises |
| Bureau d'étude et de conseil / recrZFvZneP9RwHtP | inchangée | entreprises |

## Justification
- Yasso Design : site officiel `https://yassodesign.tn/p/contact` confirme nom et téléphone +216 29 411 849 identiques à Airtable. Formations en architecture et design documentées `https://yassodesign.tn/p/home`.
- Move Design : annuaire `https://www.goafricaonline.com/tn/698388-move-design` confirme Sousse, marketing digital et téléphone 22 68 22 70, correspondant au +216 22 682 270 Airtable. Rubrique Entreprises uniquement, sans assimiler agence marketing à agence d'architecture ou télécom.
- Atelier / workshop, design, studio, bureau d'étude et store : attribution **conservatrice d'une rubrique générique** tirée de la désignation, avec catégorie générique `Métiers Artisanaux` pour 5 ateliers identifiés par ce terme. Leur spécialité précise, adresse et statut commercial restent à vérifier. Ce n'est pas une vérification documentaire individuelle complète.
- FLAKs : rubrique commerce d'après nom et compte Facebook FlakStore.tn renseigné dans Airtable, sans assimilation à des homonymes ni ajout de catégorie spécifique.
- Aucun profil au nom trop vague, simple lieu ou doublon historique n'a été classé.

## Chiffres de production — SQL relu
| Mesure | Avant | Après |
| --- | ---: | ---: |
| Nombre de fiches | 2293 | 2293 |
| Sans rubrique | 130 | **115** |
| Sans catégorie | 119 | **113** |
| Approbations historiques à examiner | 132 | **132** |
| Fiches éligibles au public selon RLS | 560 | **560** |

L'écriture Airtable est confirmée pour 15/15 fiches. Synchronisation Supabase confirmée pour **15/15** par relecture individuelle, dont les trois derniers dossiers Next Studio, Y Studio et Bureau d'étude après propagation.

## Autres observations
- 7 lignes sans rubrique possèdent un ancien `id_airtable` introuvable parmi les 2255 entrées Airtable, dont les doublons historiques Bouzguenda, Clinique les Violettes, École des Langues et Wall Street English. Ces cas restent réservés au chantier de rapprochement.
- Les 115 lignes restantes sans rubrique ne doivent pas toutes devenir des pages publiques : plusieurs ont des noms de lieux, des identités vagues ou des brouillons.
- Aucun déploiement Vercel nécessaire pour les seules données synchronisées en production. Aucune modification sur les PR commerciales/commandes.
