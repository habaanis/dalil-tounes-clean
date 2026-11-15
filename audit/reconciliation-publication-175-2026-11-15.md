# Réconciliation des statuts de publication — Dalil Tounes — 15 novembre 2026

## Objet et preuves
Audit en lecture seule de Supabase `kmvjegbtroksjqaqliyv/public.entreprise` et Airtable `app9Q828Splwvm4jW/tbl8B6aiFeUe0hoQS`, 175 identifiants correspondant aux anomalies de la recette.

Les correspondances sont sur `id_airtable` (identifiant exact du record Airtable). **174/175 correspondances** trouvées; `recuc8IWvSa7vBFxW` (Lessing-Institut) n'est pas présent dans cette table et n'a pas été créé ni fusionné.

## Groupes confirmés
1. **148** fiches: Airtable statut_validation=`publie`, statut de publication=`Publié`, case `approved` non cochée ; Supabase approved=NULL, statut_validation=`publie`, statut_publication=`Publié`. La RLS actuelle donne l'accès public : `approved IS DISTINCT FROM false` n'exclut pas NULL. Cet historique pourrait être intentionnel : aucune décision d'approbation ne peut être inventée.
2. **6** fiches: Airtable statut_validation=`publie`, statut de publication vide et `approved` non coché ; Supabase approved=NULL et statut_publication=NULL. Également publiques selon la RLS actuelle.
3. **9** fiches: case Airtable `approved` cochée et publication=`Publié`, mais statut_validation=`terminer la saisi` dans les deux systèmes. La RLS publique les masque. Ne pas convertir en `publie` sans revue de la complétude.
4. **11** fiches: case Airtable `approved` cochée et publication=`Publié`, mais statut_validation vide. La RLS publique les masque. Ne pas déclarer publiées sans preuve de validation.
5. **1** fiche: absence de correspondance Airtable; vérifier la source et l'identifiant historique `recuc8IWvSa7vBFxW` (Lessing-Institut), sans fusion sur nom seulement.

### Identifiants par groupe (pour reprise sans nouveau balayage)
- Publié, approved vide (148): rec0Gqz2ecx66MMMB rec0jQKnXv5r1vHuI rec0pLFXgYBUzYC1h rec1eejPgde5azSzt rec1UdROssCjjlOk8 rec1VfQPHRrRTKUOH rec1wgzXaSufzFoQw rec2fd9pxiaGo3hOi rec5kG697MoEAoI1r rec5UGtf2GjV0c2Zp rec5YCGKfpqBw6X9z rec60sE04GojRo2Jq rec6K1gMWhIO9zo0l rec6Ou1jk2v7aPwcS rec6wKFIterbe31KO rec7fDLcQRUJkR0jx rec7y4LNwZX9kNR4A rec8bq8nh8KWGnsWN rec9fUKPVxEehBTm5 rec9Jx4q7YEwuqfll rec9scrIopo9iWgbG recAFBM6MlLVtZ7lI recAFRXk4bhGvTBeK recaIEuambcVKTDfs recAyRqVX2cub6Rxj recBcsO2S9cN81nrW recbDnW77SUCAx47J recbjAUg5eiNCoKrO recbJzJrm3uYX3Srw recBSoGIII0Eq4keB recBxV7fOXQ4yq4KD recByedwhVCympanA recC5bJebX1mUa6EW recc79ENqYnkbxssr recCeKLJgpeDBwn44 recCjYtUaYOT8dCw3 recctk3qOHJ4tMIs5 recCuHwGPkKSiMPsk recCwiQhsl6Ai1r4V recDKwkxZR7qCEVTO recDSFMWFGYrHupzh recdZonZVpmBFMRDQ recE7zxA5ywmYBA95 recec7IOOvUgmYBC7 receGcRBO3SZFnDRt recEKohWo2RM60dCn receMkzpB1oMx5Qvf recF0PF9AyRgM3Ab8 recF290sBqv2D1aAW recF3bRLDz4lLbcjw recF4HOiYi0SYhfkc recf5ZFx7ni03X2wv recfo2pWpbupyQXCu recFPlDJORSkB7oRV recg1QPIBTJLMYFZ6 recg5dPFwavC55Z1H recGg4CV01FfA73mg recGkfP5q6hpVPw60 recGOIFBmv2ykiN4w recGRB7w7lX6YOVTB recH1GnRRVO0y9DiO rech1TZkK00x9BjUx rech8Z7dE5lanY5I6 recHGROzkRQTwhmyh recHoHrjDhR7sBTLD reci3V2wtdTE38cju reciBlaqvbLUPu17P reciJLFyLg4GEuPFn recin467tyltFIOki recj8zyFQcPaSImF3 recjBk7NXm3jRdqGb recjGZv53j1p4XVch recJH83tTyPQw4bKF recjIM9KC5s5DYYKo recjmpte7reA83DPc recJSIzAdcYBbOb4q recjT0SshdQyTkz7B recJyURISmw3jrFGv recjzu1jl43qnP6rk recK9lclB0n5BOW4X recKi9nqaHveOobW3 recKLZGy1GzBBH0Qu recksD531Rq26Kviw reckUWaFGcEY1Krus reclgqraM4oZOfwzv reclhPsp0Ux7zRtqE reclI3TwZByn6aL9P recLRNeLcQxilJqps reclWGTY7M3LLaKTn recMGgdsmbVPylSLw recMhuJYPdIoUuacw recMr4mJwd9QzFvG8 recMZqemIb21etxKp recMzwdOil8Firs69 recN6IbBY2Saz6JZn recnahrsRrIclD9u3 recns37nnIOYNw303 reco1pujnK5rXbG3H recOinm3lvgAvCSOG recOJ6l6d2avz11j2 recOUCEgXS20Yg9he recOvTOYoCZNTETWp recOWNP12okEFZUiw recoyyHTRm4dZrUaq recP18cTweHPVWnFI recpkMaqdqfTaTN8S recpkQBPSRljvjpHr recQeRFdzstbumnYE recQIhSh2qZsHw2sr recqm8qtyGyDxESld recQpqwo2cGPdOU0s recr6EkdkIDoZcz1e recR7dFfv9PmidlbL recRXO15jT09h9dpA recrXtYWsuhoN1ipn recsGClFv9uQA3r2Q recSL7lSzx1ARCh59 recswS7KRk46O5k3j rectAf5vciXmfgg02 recTHiSIjLhqR0c01 recTi0281DdIRxlBO recUAcigdSVKOEa1d recufPJqsYzQevTP8 recugy4PkDreSmy5q recuumzuav6gLwf6t recvMkbly9y4bac1T recvnngw5nWYpnIZd recvSao1hSuWNx32t recW6EASoMbL1P6Wg recwHsvBFypVlOpXV recwrB7YMwxrps5Tj recwsq4lXw63gbEEB recX17ps0lYxkneaM recXK0HHrd0b1m5Tc recXTksGQ4sTlVqZf recY0OgNAQYKiyk5V recy4y16W9EopAdIB recyDPNCaepStaUxE recYjKEUgSXI0mRXP recyuehwMMKMDZNdT recYvMP5WkpPaFbYN recYX3bGd7nUQfmWS recyzoigbkN8bK4BC recZ1EsedGkScgyEj recZ6nl9wllG7gxKx recZmxspvsCufIXF9 recZR0C2CC8g8nyDs recZuGQtKoolNxSlX
- Publication vide, approved vide (6): rec87YWy8trIsGxvm recCst7vomkPR7yOW recF3dAAhQuh7issR recNDOaswHZX2TxuP recppIxboFSy2caVC rectHHPlhjIyNbjON
- Approved vrai, validation « terminer la saisi » (9): recATCDoiTCkIvrxM recBTG8fhwR8uNLaX recGFjy5SFVyS59Qb reckXzEIUWgm1XErn recn4RkyAVeTvLfib recQYPAKUKhcrUG3K recTb4godAYSBO4Kc recVyQOPPXTBTRJ7I recYiwGDkSkGi6yCz
- Approved vrai, validation absente (11): recbsH5km6FWZ7hKf recc0Wr2b25SoaRIk recCxl6mNiV7rESr3 recE9mNmn4XFW2jRw recjAs6rq7sKDqapf recqosuwoZoJH0mH8 recrjQu1Sp2l43kAh recSei7TmIP61m1LE recSOIaQK5oWHMR18 recsPGWyVVHSk8NOl recTRJCfJbMVOAtVb
- Inconnu Airtable (1): recuc8IWvSa7vBFxW

## Politique RLS actuelle : décompte
Le prédicat de lecture `anon/authenticated` permet 549 fiches : 394 approved=true et 155 approved=NULL. 404 fiches ont `approved=true` et `statut_publication='Publié'`, dont 20 non visibles en raison de `statut_validation` vide ou incomplet.

**Correction sans approbation artificielle proposée (non déployée)** :
- Préparer une revue administrative explicite des 154 cas `approved` vides; la décision métier doit trancher entre héritage autorisé et publication indue.
- Revoir les 20 cas approuvés et non visibles; vérifier que la saisie est terminée avant de renseigner `statut_validation`.
- Réparer la correspondance Lessing sans heuristique sur le nom.
- En cas de politique stricte `approved IS TRUE` et `statut_validation='publie'`, impact estimé **155 fiches publiques masquées** (549 -> 394) avant remédiation. Cet impact impose une validation et des tests d'interface préalables.
- **Aucun changement des valeurs approved, statut_validation, statut_publication ni des politiques RLS effectué pendant cette réconciliation.** Aucune création, suppression ou publication.

## Test site et application
Vercel site et PWA en état READY. Logs d'erreurs 24h précédents vides. Les requêtes HTTP navigateur directes n'ont pas abouti depuis l'environnement disponible (outil Web: aperçu statique du site, PWA et URLs de détail non accessibles; réseau local: résolution DNS impossible). Il est donc incorrect de déclarer la recette fonctionnelle E2E réussie.
Le commit site `82d436bf3c7cd2d415b20cc22552d0bde43d2af0` et le commit PWA `44299150534e6eca171eabe83fbdf6f4e8a461bc` ne présentent aucun status check individuel retourné par l'API GitHub combinée; cela ne constitue pas des tests passés.
Aucun déploiement supplémentaire n'a été lancé.

## Suites décidables
1. Valider administrativement les 154 héritages.
2. Contrôler les 20 dossiers réellement terminés.
3. Appliquer seulement ensuite une migration RLS revue et tester les recherches publiques, détails, CV, QR, boutique, compte, FR/AR et navigation mobile.
