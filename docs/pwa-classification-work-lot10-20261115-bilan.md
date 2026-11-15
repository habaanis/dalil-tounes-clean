# Bilan final — Mission Work classement, lot 10 — 15 novembre 2026

## Résultat
**426 fiches corrigées dans Airtable et 426/426 synchronisées dans Supabase.**
Le total des lignes et le compteur public restent **2487**. Airtable contient **2255** fiches avant/après. Mission de classement partielle achevée pour ce lot ; le classement global reste incomplet.

| Indicateur Supabase | Avant | Après |
|---|---:|---:|
| Total de fiches | 2487 | 2487 |
| Avec au moins une rubrique | 1156 | 1582 |
| Sans rubrique | 1331 | 905 |
| Sans catégorie | 1299 | 873 |
| Sans catégorie ni rubrique | 1294 | 868 |
| Sans catégorie ou sans rubrique (union) | 1336 | 910 |
| Compteur get_enterprise_record_count() | 2487 | 2487 |

Les **1156** fiches déjà affectées avant intervention n'ont pas été réauditées individuellement : ce chiffre ne prouve pas qu'elles étaient toutes correctement classées. Les lots antérieurs clos n'ont pas été réécrits.

## Périmètre vérifié et modifications
- Inventaire de 2487 lignes Supabase et 2255 fiches Airtable, rapprochement des identifiants.
- Revue métier détaillée et correction de **426** dossiers, initialement sans catégorie et sans rubrique des deux côtés.
- **582 affectations de rubriques** ajoutées ; **137 fiches multipages**, soit **156 affectations au-delà de la première rubrique**.
- Éducation générale/formation/langues : 289 ; écoles artistiques/sportives : 6 ; photographie : 19 ; architecture : 27 ; couture : 57 ; auto-écoles : 17 ; petite enfance : 11.
- Écritures en **9 sous-lots** : 8 × 50, puis 26. Les limites actuelles du connecteur autorisent 50 mises à jour par requête.
- Seulement les champs Airtable `categorie` (`fldIIcE1DPdcwm40B`) et `liste pages` (`fld4CGEZ8oLqMsdvx`) modifiés. Options exactes déjà existantes ; aucun nouveau libellé.
- Critère : profession/établissement explicitement nommé dans les données Airtable et Supabase concordantes, selon le critère du lot 09 ; relecture et exclusion des noms génériques, contradictions, institutions non commerciales prises pour agences, identifiants non rapprochés. Ce classement ne valide ni l'existence actuelle, ni les coordonnées, ni l'autorisation de publication.
- Sites disponibles consultés pour compléter le contrôle. Les échecs de consultation ne sont pas présentés comme des preuves ; aucun métier supplémentaire n'en a été déduit.
- Les sous-catégories restent inchangées. Aucun statut privé/public, niveau d'enseignement absent, spécialité médicale ou activité ambiguë n'a été inventé.

### Rubriques utilisées
- Éducation : `éducation`.
- Écoles artistiques et arts martiaux : `éducation`, `loisirs & évènements `.
- Photographes : `entreprises `, `loisirs & évènements `.
- Agences d'architecture et couture : `entreprises `, `services citoyens`. La rubrique `commerces & magasins` est ajoutée aux deux enseignes de couture explicitement boutique/store.
- Auto-écoles : `éducation`, `entreprises `, `services citoyens`.
- Crèches, jardins d'enfants et garderies : `éducation`, `services citoyens`.
Les espaces finaux Airtable ont été conservés dans les écritures ; Supabase les normalise. Comparaison des ensembles après trim lors de la recette.

## Contrôles terminaux
- Relecture Airtable des **426** fiches : catégories/rubriques attendues et statuts initiaux conservés, **0 anomalie**.
- Relecture Supabase des **2487** lignes : **426/426** conformes au plan, **0** changement des champs `statut_validation`, `statut_publication`, `approved` sur l'ensemble de la table.
- **0** changement d'identifiant, de rattachement Airtable ou de nom ; ensembles d'IDs avant/après identiques.
- **0** création, suppression, fusion ou nouveau doublon produit par le lot. Les 29 paires préexistantes n'ont pas été touchées.
- **0** changement de catégorie/rubrique hors des 426 IDs ciblés.
- Aucun passage à `Prêt à publier`, aucune approbation client, aucune publication.
- Aucun changement RLS, Edge Function, automatisation, code PWA, site officiel ou mini-CV. Aucun déploiement demandé.
- Synchronisation automatique Airtable → Supabase observée jusqu'à confirmation complète avant de passer au sous-lot suivant ; aucune écriture SQL de correction.

## Restes à traiter et anomalies préexistantes
La liste exhaustive des **910** lignes encore incomplètes est dans [restants.csv](pwa-classification-work-lot10-20261115-restants.csv), avec ID Supabase, ID Airtable disponible et motif :
- 664 : activité à documenter ;
- 197 : nom absent, revue humaine nécessaire ;
- 37 : catégorie présente, rubriques à justifier ;
- 7 : fiche incomplète sans correspondance Airtable, rapprochement humain ;
- 5 : rubrique présente, catégorie à justifier.

La revue d'identité porte au total sur **269 lignes Supabase distinctes** : 197 sans nom, 14 nommées sans correspondance Airtable, 58 lignes en 29 paires de rapprochement. **204** de ces lignes font aussi partie des 910 dossiers incomplets ; ne pas additionner les deux listes. Union classement incomplet/revue d'identité : **975 lignes Supabase**.

Voir [identites.md](pwa-classification-work-lot10-20261115-identites.md) pour les IDs complets :
- 210 lignes Supabase non retrouvées dans Airtable (196 sans nom et 14 nommées).
- 29 paires préexistantes utilisant, pour un même rattachement, une ligne UUID et une ligne ID rec. Doublons potentiels de synchronisation, sans autorisation de fusion.
- 7 fiches Airtable non retrouvées dans Supabase (6 fleuristes et une ligne sans nom), laissées intactes.
- Ces groupes expliquent l'écart de volume : 2255 − 7 + 210 + 29 = 2487.
- Lessing-Institut reste exclu : `recuc8IWvSa7vBFxW`, distinct de `rec5nQWWUvSnByaTU` sans preuve contraire.
Aucune de ces anomalies n'a été créée par le lot ; leur résolution peut affecter l'identité/compteur et nécessite un chantier distinct autorisé.

## Vérification du référentiel PWA
Lecture de `businessPageClassification.ts`, `educationCategories.ts`, `entrepriseCategories.ts`, `magasinCategories.ts`, `santeCategories.ts`, `loisirCategories.ts` et de la page EducationNew.
Les rubriques écrites correspondent aux scopes PWA existants.
Point à transmettre au chantier développement : plusieurs sous-catégories Airtable (par exemple `Université / Faculté`, `Collège`, `Lycée`) ne reprennent pas littéralement les valeurs de `educationCategories.ts` (`Universités & Instituts`, `Collège privée`, `Lycée privée`). La compatibilité de chaque filtre de sous-page reste à tester ; aucune catégorie n'a été créée pour contourner cet écart. Ce lot garantit les affectations de rubriques, pas une recette exhaustive de chaque sous-filtre.

## Sources complémentaires consultées avec contenu exploitable
- https://www.tandem-tunisie.com/ : formation linguistique.
- https://joyschool.tn/ : enseignement préparatoire et primaire.
- https://www.sousseinternationalschool.com/ : école, redirection vers son site académique.
- https://www.lfisousse.com/ : enseignement scolaire.
- https://netlangues.com/ : école de langues.
- https://ups.ens.tn/ : université.
- https://www.issca.tn/ : enseignement supérieur.
- https://www.amed-sahline.tn/ et https://www.amed-khezama.tn/ : école/collège.
- https://esstssousse.tn/ : école supérieure.
- https://atelier6a.com/ : agence d'architecture.
- https://mm.tn/ : réalisations architecturales ; contenu parasite observé, ne pas reprendre ses liens annexes.
- https://narcisse.com.tn/ : commerce de vêtements.
- https://marthegautier.school/ : groupe scolaire.
Les autres sites non accessibles/illisibles ne sont pas des confirmations externes. Les fiches classées sur dénomination explicite conservent ce niveau de preuve.

## Journal et retour arrière
Les trois plans précisent les affectations et valeurs initiales vides :
- [Plan initial 314](pwa-classification-work-lot10-20261115-plan.md)
- [Complément 84](pwa-classification-work-lot10-20261115-complement.md)
- [Complément 28](pwa-classification-work-lot10-20261115-complement-education.md)

Pour un ID effectivement écrit ci-dessous : restaurer uniquement categorie et liste pages vides dans Airtable, attendre et vérifier Supabase, ne jamais toucher aux statuts ni supprimer de ligne. Avant un éventuel retour arrière futur, vérifier l'absence de modifications métier intervenues depuis cette mission.
La sauvegarde détaillée avec métadonnées internes a été refusée par le contrôle automatique ; elle n'a pas été exportée. Le journal réduit aux identifiants, affectations et contrôles a été enregistré avec succès.

## REPRISE PROCHAINE MISSION WORK
1. Lire ce bilan et les listes restants/identites sur `audit/pwa-classification-multipages-20261114`.
2. Point de départ vérifié : Supabase 2487, 1582 avec rubrique, 905 sans rubrique, 873 sans catégorie ; Airtable 2255.
3. Les **426 IDs ci-dessous sont clos**, synchronisés, statuts conservés. Ne pas les retraiter ni relancer les 138 affectations historiques.
4. Reprendre le CSV par groupes de 100–200 candidats : privilégier les 664 dossiers nécessitant une preuve d'activité, sites professionnels et champs existants, puis les 37 catégories sans rubriques et les 5 catégories manquantes. Ne pas considérer toute ligne restante comme automatiquement classable.
5. Mettre à part les anomalies d'identité ; conserver Lessing-Institut et les paires sans fusion/suppression.
6. Avant chaque écriture, relire les valeurs et statuts ; ne modifier que les catégories/rubriques justifiées. Contrôler la synchronisation jusqu'à réception complète. Le compteur doit rester indépendant de la publication.
7. Aucun déploiement Vercel nécessaire. Transmettre séparément les écarts de sous-filtres au chantier PWA.
8. Les contrôles de cette mission ne prouvent pas la pertinence de chacune des 1156 fiches précédemment affectées ; ne pas les déclarer toutes réauditées.

### 426 identifiants effectivement corrigés et synchronisés
rec08kEoRoLP0COZ4, rec0BBeNfAlh6bSfy, rec0TPUeHhDC2ujeI, rec0XK6gFmC3sJNDw, rec0YoPMua0rXA5sO, rec0bTBFbUvUrGPJB, rec1alNpmQtpClrL5, rec2V1q4e7T5BtK0c, rec2YIzF2nOsOP2Zd, rec2YW8kaIW1UobOT, rec2Zmd1W4JgkylY4, rec2nkbNfSM7M3nfK, rec2x7iby03fYo4R6, rec3vd3LNE6C51kHP, rec4f3Gu4i1bHJBEi, rec55GlJQ2lR70kR1, rec5No0VUnGNYhXrt, rec5dOzG6KJsoTfu8, rec5fMPAizYpAwcoj, rec5g0wzSw3ZWLBak, rec5xKVRtMceZgPcr, rec67qkY5kG2tHTr0, rec6VSKpJbyxiIM0H, rec6c2tBQ9W5Nj5MW, rec6xU3gXV9JfNf1U, rec70yT0tx4Zu9U9s, rec752rRsIoPOCC2f, rec7IwdFUNbAH0s8W, rec7JIdh7dRJTdc0o, rec7OgwuL6XUFcOnT, rec7PYV8DTuPvnPV6, rec7jS8Irp8LVxfcW, rec7o0AsJ2uzyDRWP, rec7w3fmgtSfolxGu, rec81Gf8oi4DyHvsG, rec8A9earGhtoVEnC, rec8IlbI5l7ejD1Eg, rec8o2WRgYh0Sy0Li, rec8zmb6lU1JQekDp, rec95MPCueeqmF9RA, rec9AwdFSU8xzUs5v, rec9ITLWYf0YSLyT9, rec9JgimeAxNownnX, rec9JkbPIT6kfZkdv, rec9KQFum6IDsS9lF, rec9eqHBlahwvQ9uE, rec9xMfXMo8MVaHEK, recA5qRvt3dT8b3fC, recAQUNFFaxAissZN, recAue8q04V4kYTGh, recB74L3FIMZOBmDj, recBHMSrb79mYHmzU, recBSfRLsp4iM6L0K, recBfnY4Kb79rzuIJ, recBjUkBrxuaWLGc6, recBsJ6x2NVbFZa6N, recC0dBK6q8EcspTb, recCR7iCXgqIafo3P, recCacheJvRarHyAv, recCcmr3tkEm4cQfG, recD013jfEullHxto, recD6doq6IL4WGHfI, recDmWgHhRQ3hYWSV, recE7P604BLORkKgq, recEHrKUJvBchFZIC, recFJZIrDLITgwwoe, recFWoGFJSYaUP0ci, recFfiEQWODAbxfuf, recFiL7vpY7NAumkx, recFjTGJwY1JnJPuP, recGDvpn00p8EXIUM, recGhfwzftzqjfDWr, recGtRRFH4jhEt1f4, recGwHyvVXi0msT08, recHEJZo25NsRiBYa, recHLjtJ3rnUrhEow, recHg5GLD0geCtqF3, recHqqj334R1yAAzx, recHusPWuvD6VGruR, recIAbtCPxWQ409bf, recIBBPGfWCEA99Y7, recIWVc95HLN1e1Z2, recIcDjmCoBD66RYL, recIhTsub1Fx601uD, recJKbIgLZh9mcTbC, recJityQ10Mgao7qB, recKC0gnKwXuW4Pbz, recKDDsUcHoMOLiGo, recKNFwOGr5UfNeJh, recKWczO1tQt5DiE2, recKhOnE3hSeeqrss, recKrkpXuXq38Eqyc, recLEahqEXnnW5eKw, recLF8uHKTgzNr8gF, recLNSHANKSCwNLAj, recLj5ozGhpvQvtjy, recLvcO5XRMi3uxIr, recMgZC0bBKMMZrO5, recN1j0w1OcxIv4KX, recN7IOyi0NElbahA, recNMWwelQP4leM1v, recNgzYAvxQSMNLHJ, recNrrFbKKgTGADkz, recNvo0KyrH4XWRoi, recODA6q7wjMQ1LjO, recOkOXKoods99Q5f, recOmjCvHx7U3jvgD, recOwl8VAoBVstYzs, recP3TmlMjdVOQIUu, recP5KAqEezqAT7A7, recPPTo10sPUsd7Ai, recPSvltE9l3PFZvC, recPTYC7mGfjqzItE, recPzk4IwsmfxvN99, recQvypZDEOsYJjUk, recR1qd19FM8l6ETZ, recR2Qnfbic5DWEjm, recRPN2XFCQKiiN8w, recRU8kJ4M5N0LtLt, recSXqIwmQvUipP2j, recSqRsy78SZWGSrN, recT3TQdWjg3PQLd6, recTH6EGMTa5DqIxU, recTZPaoGh6QRhFev, recTrbX8URi5yGG87, recTzwWComhKH60bL, recU7nXsqo1WCSOrL, recUI7Gg3CBRoJfva, recUb1c5slGFQUA7o, recUc3u5ZulepQVIx, recUue5rvfzmT0DZw, recV6FLSK2RBmuSyB, recW7jehJkbOfIXtU, recWFxeO23KSow0V9, recWsxjlXOOlPVsae, recX9WIQsRXkdvop2, recXLSqNN2NlS5MDg, recXbbetuuuGOmMde, recXsY0B1mnvjY1Kf, recY6505kLchlKsUe, recYRMW5yEnrwNswc, recYZMNCYHwolEElB, recYk6XawJmXZjZYd, recZLqoBn4upJPCqh, recZWseXALh8g14FV, recZYguy4HbI8o6Om, recZbnjkj0frsrvTa, recZixY0QWPYzIylB, recZkPo4nsE1ZOYuz, recaBsCQY01NJRN8V, recaD9diXeOEQCxkF, recajxYmGAnCYEVGS, recaksttBj4HkQ4J5, recbQVVk7xZ0S0yTL, recbeG16qRQbYzR9o, recbry5iDf86Miz7k, recbuUWFbTvyclCSN, reccB7A3gQDDMArAx, reccOF6jatWBcW14f, recca174tZX50MFJe, reccifOTpuz42Qhw7, recd1UDJa1aq5akf2, recdHf6FVjSqCBMOc, recdb48x4d6x9cUww, recdl2WoxjlQXzU9D, recdl5jzH9wevbmHn, recdlllNLT72Mr29S, reced7ocziXArmgqj, recef9QRty2ccr3Zd, recenwoDfkRDy8Hwn, recerFXSbC0aVrCNm, recf1O03taLmBSITk, recfwzaODqW9IHUno, recg5giPh7VN1OEUS, recgcAbqlKV6fPdUn, recgiptnanmzIVOFS, recgj1qCsadQSjux3, recgqk9z2HLMAngzy, recgrG3r3sM8l1C5q, rechasTMETqpaGnSx, rechoVcqhff4UtwXK, rechpKO9vIxuic2yL, rechvWkO2kvnFMdtN, reciTO3qfsMBwrR2r, reciqPWEsug5jeLYS, reciyW9Sei6yvcpJl, recj7IHA4WSro0heF, recj8hvlkBVZ573SP, recjAElvyl0jCoQLM, recjFH4RCGc1QSqOS, recjSYRfDwjkS4zdG, recjV4pov5m2wPdoI, recjqUMBcASaaSKMo, reckC3xtb9QBe4qjT, reckOhf64qloq4ZjL, recklO8pBjrq9ue8q, recksmqgmkdR0WMpe, recl8XLDec0bol1Us, reclIc9quAagQJ2ek, recldzCdJ66x92Zc6, reclgZaHdGpL5Njnl, reclut7ipbpvwPF37, recm4a1ZYfxu6BRaT, recm5YDHDJQQZbdBy, recmGt2cyS9drTT6K, recmJ4G9QuiydzuwV, recmT6rSjgS2UVQIZ, recmqI16OM3h9q80A, recmrXWDJcRDa3QAg, recmrcJQRRB6No2gm, recmxTwZRCuMeiUna, recnUH0rv7Y5wqxoA, recncRxXeopFr3j3w, recnkHbkaieqcMEu3, recog7srfsjvbY5Wo, recp0t2VvhQ8fqBgc, recp6jD8WAQkLukkr, recpOlTsAc9xF676y, recpYSvnRHEUWK5DR, recpfkVOcEXgCQGsw, recpmb64avFs3is3V, recpn3j1aCh40orPH, recqW7YahqJ9u1ooM, recqekAIOJtWefVv4, recqjllukKJ1Zran3, recqoXLiJwzStQZ2u, recqpd7QrSfq4bCSi, recqwoisfJmnglp2b, recr8QMgB1o9NODf9, recrLC8Ey428FEO5I, recrQR5VEiUWDdvZa, recrU50vPkMuTZKty, recrgOiJY7XYkQq0G, recroWLZDLLjqyxgF, recs5rgISooX42zAf, recsLIChaf71ho0cR, recsMBZRH4Qo66Ujp, recsXccRcc6niRCHv, recsc6TSDE8zMpGrE, recsqTI8DQOJBLzyk, rect6wu6tZYsWAeDG, rectqRTC1clKF2f6f, recttCLWTZxNM33HV, recu0y8Y7oIYGco56, recuT6Ts2gY31meZh, recuXYvJ7NWLjyy6z, recuZz2WbriLbs8zC, recuxDLMXqDV00UBc, recvH0E9qui8xHmaH, recvYhsAzYelxGwU2, recw1rzx3gnpY1AqR, recw6rGqJPn3ifZSZ, recwBPQd8xvnsgEHA, recwCs73PQZ0foCf5, recwkkXlkWtg8NGyr, recwrP39xgeK46ZCQ, recx1zfzwpIc2LMZt, recxwsghzTQkyRl0Z, recy5h4H5ybUQJk7S, recy8omO9t3jsZiwd, recyEHO16sIofM5pC, recyW7BcVvO6q0dw7, recyix6WOZxWLFFMM, recynaNA15nelKfka, recysfEx3jWAeKXOJ, recz9wpC24XYD8TWi, reczPXZe1FssGGd08, reczr7ciZp6tL52XG, rec2lUUGVEW4UdYxt, rec6UQEBaObwIXKur, rec7eBbZHIgNFndNr, recB9SnsBKjihBdUk, recC8r0mSj3oZaEWk, reca2spUXMgOqtAG7, recaAjMf11alVHGgm, recbSMPdRO47JxpqD, reciUHdZd1NnTMcom, recihk9hgUFMntS38, recl7t8XD9eg4BDVZ, recpwPaQlakef15hD, recq1oT7KtdpT3AGA, rectLVCA1B7sSWKNj, rectPO9PeyFCtdWEP, rectSfyagWVoKj6Z4, recueNICcYENrDz6V, recvGcmwdSNxq1FJy, recviIvK1d0vnulbk, rec0yyFnVGAUjNQaK, rec4lqDVwNWyV1Sov, rec4oCqcPWYsw7yur, rec5QlNVg1qzE7qK5, rec7jzkEdLnfr7qq0, rec7xJ3XxcldDMN5t, rec8PrTb7ilExzZVw, recBJGEdKxuTFFGOA, recHZMka1DdlyDvKz, recLyMFTDOCrIfLUk, recMUL5h1LtOYJAia, recNYehEdaZVrj1Pv, recODFIzsLiPcIJv0, recPKVnopVIDmn245, recUdanGWMaSuaAqX, recZeP3ONdnlR4iZh, receBooJbUlR8NjH3, recet5MbDwemkio7i, reclcjRv9iT1CqJBa, recll3YB4XxD11Za7, recmfd9iwxeAHgq22, recmrK5KwaF6rmwiQ, recqxwNicn3DBP8A1, recsIwa7JruQrWtYR, recuzFzSV9SBxbsNX, recv6rNfSt77ii7LN, recxh6TYsFWHpyb0G, rec24vX23H8dBjFkD, rec2X0Tj2WE2npueH, rec3lTppptSeTTL9S, rec4C2CptS4EuUqiX, rec4yBt5KykZRqmeV, rec8NvFWYXKSFal3Z, rec99Ux7tlBqRl1A1, rec9uXpoMhlElvVZX, recASoIpE7yYUexqe, recAi0x4KvnmJ376O, recAv9HC1fYhaMmfW, recAwzxl0n2NfRAR9, recBe6MAwqnj0FzSo, recC4h0j886CBCCWC, recDVORi5vbClda36, recEMK5EtoY7vZ5HF, recFkJ9ZagMtAeuif, recFlXeZMqvfvZMwJ, recG8xwMl56at8rjJ, recGfBybfPxFlQolE, recGkPRpHugBdr05a, recHiVnuXlgQNyrJg, recIaxhwnpgbHQ9PI, recId1VIGZapCJVLg, recJ3qab64BufiOHN, recJJAwFWva0rcyE0, recJzbyaknXHzo8yy, recKXJanOXn1jNlKQ, recKij9E9n5tz7Uf3, recLEVJaRpOsUNnJS, recLaUUHjPwTr99mN, recLu57HJH3JMnxRS, recM5FiaD88qYLQna, recMNXLUCTPhENAq1, recNujredodABItml, recOUhXvdGpLRJqws, recP1uRFLBBgSKtlS, recPNc5ZQuxYELVxb, recPVbjKbVqqJdS4X, recQ3cmzIzjq74dvD, recQw0v69bj2GHt7X, recRhtZOs1240XOus, recTJNUoOPSDkZ78e, recVrydKgq4qutMrs, recWDZmE6T5MV19XJ, recWSlS2HAZvght1A, recXJLMLv0sUqOq8P, recYOvfFOLWEVtdk3, recYtXXRZTIS7wKNz, recZTVJ02Dc0IWDNt, recZicxOZvaWTGUlv, recZo53cyAwvjFHqs, recbMaaLzIzAIgQmx, recc1Z5YoMejNYbXP, reccLA7jgIwyDrwll, recdIM5no4l5ppx2l, recf0UBEsR9v1MmlK, recflgUdzKreb7ZRO, recgVMcyzCNlWNRrJ, recgXaqeHbUo0BSu7, recggqzvS6Xrz0spH, recgyRjyXuIl6OcAn, rechEEXnG2pMV9MzM, rechzFjiOMlQrfVUx, recj4wEbM9qT0ojDp, recjS8USe9NzAk1LP, reclMSsg6PJulSKc0, reclePAJXnv1LmboI, recmjpwZZ8CM7TROQ, recngbfzYbVv6aNVV, recqyCWpJBQofCuY6, recrK6c23X8aL22Yc, recrbekOTSdPHvt2F, recu2JpMvf9lIPSRG, recupWpROjnNqUqCr, recuyY949KuZiMY8c, recwbEhVYsym0HkQU, recxOddDBvI0qUmmK, recxaDlbVHsAIqbat, recxcf31ShjxsRQdQ, recxhlFU645YwyGfE, recy7CShtWKgzRzFS, recyGXnN1Ub8v1e6Q, reczyzY7sUOwK818U, rec4mjYyKoPY389yP, rec6XE5Kav7RcHVOz, rec8HghNN8Kaj3xsp, rec9B2zCqCWEgewaj, recA7KFQXpnT810ae, recBHVUZXdjN3uYCZ, recCMUCSTGsqei5m4, recD9EiQXS4bN9FWe, recDJ6YGRwVTj9jp0, recELgzVq4tTuaLok, recEelT3hNJvl9Fg7, recG8aaFQl1VhCSt2, recGeJMCk8InGmekx, recIEh7BgxqAGaPym, recKMSwMzuCy4C2Xg, recXxAohjApIJfU6U, recYSoPnhDgDr1RAC, reca0XXVmJRsFYwmb, reccdyzoNOsXy7jO2, recg3H6uUIaMWoeyl, recgkKvMfD09jvLJY, rechxeTmeuYuVPEaK, recjJK2ynu8ZmjTJa, recoDbAUSYBofX1Lp, recopgiXm0wVWTOp4, recsTTYejhMrslGLl, recu5LaBdZPCvw2IC, recvQMaKCW8TJL5le
