# Historique Abonnement — PR #197

Historique Git complet récupéré avec `git fetch --unshallow origin`. Comparaison avec production le 10 novembre 2026. Les décisions plus récentes remplacent les anciennes : ne pas réintroduire anciens tarifs, logo gratuit ou paiement Stripe retiré du parcours courant.

Analyse et conservation : [validation finale](pr197-validation-finale.md).

## Inventaire page et composants de présentation

```text
3b69357 2026-11-10 Fix model accessibility and static SEO; add structure regression checks
df8d871 2026-11-10 Simplify platform home and consolidate professional offers
6ad3f22 2026-10-14 Remove logo from essential presence subscription plan and preview
63c9361 2026-09-25 Fix CV palette actions and localized PWA
48fd972 2026-09-22 Clarifier les formules, le compteur et le parcours de commande
70d5cfc 2026-09-16 Afficher le vrai CV pour chaque palette
c1959a8 2026-09-16 Added migration-palette-cv.sql
46247e8 2026-09-14 Restore CV images on Subscription page
3246a44 2026-09-14 Replace CV preview iframes with React components
058a5d6 2026-09-14 Create multilingual CV preview
70053c0 2026-09-13 Rétablir la vraie capture Aux Saveurs d’Anis
5021471 2026-09-13 Mettre à jour les aperçus du modèle CV Business
b75da5b 2026-09-09 Corriger l’affichage vertical des vidéos
a95b870 2026-09-09 Add localized presentation video modal
cc776b1 2026-09-07 Permettre de tester les vrais boutons des modèles
40ef648 2026-09-06 Actualiser les dimensions mises en cache du Portfolio
27475dc 2026-09-06 Afficher l’image Portfolio sans iframe bloquée
9d075cd 2026-09-06 Restaurer le Portfolio initial dans la page Abonnement
5d29c11 2026-09-06 Réparer l’aperçu Portfolio de la page Abonnement
4f1035a 2026-09-06 Agrandir les modèles et afficher Ajouter aux contacts
ae588c5 2026-09-04 Simplifier le parcours de choix du CV Business
5e0b6f0 2026-09-02 Simplify desktop subscription choices
73d6b57 2026-09-02 Update src/pages/Subscription.tsx for mobile focus
7660a46 2026-09-02 Update src/components/CvPresentationModelSelector.tsx for mobile focus
ae11e75 2026-09-02 Update src/components/CvBusinessJourney.tsx for mobile focus
9c06ecc 2026-09-02 Align CV model selector images
72eebe0 2026-09-02 Correct CV model image mapping
12192da 2026-09-02 Show both CV models in customer journey
53938cf 2026-09-02 Prevent mobile journey preview overflow
b3b1fed 2026-09-02 Preserve CV presentation model in requests
3ce7641 2026-09-02 Fix enlarged PWA preview clipping
70b76c3 2026-09-02 Harden journey preview scroll lock
2af1fc0 2026-09-02 Add accessible CV journey previews
e1be27e 2026-09-02 Match CV Business journey visual height
4f6a690 2026-09-02 Align CV Business journey preview height
18436a3 2026-09-02 Fit QR journey preview within its frame
b6f629b 2026-09-02 Fix CV journey layout and add model choice
46e802e 2026-09-02 style: enlarge CV model previews for clearer comparison
0042338 2026-09-02 feat: add compact CV presentation model selector
c88eec0 2026-09-01 Publish CV Business QR and PWA flow
49009e5 2026-08-30 Updated main.tsx
86cd5ac 2026-08-29 Ajouter l’offre de bienvenue du CV Business (#99)
b9c271a 2026-08-25 UX: ajouter le QR Business Premium à présenter
1ada8ad 2026-08-25 Offer: simplify Premium benefits
95a01fb 2026-08-25 Offer: simplify CV Business creation and annual maintenance
e69acca 2026-08-24 ux: harmoniser les CTA professionnels
baabab6 2026-08-06 Codex/subscription auth hotfix (#23)
b58d9bd 2026-08-05 Codex/subscription auth hotfix (#21)
2d46837 2026-08-05 Codex/subscription auth hotfix (#20)
73c1b35 2026-08-05 Codex/subscription auth hotfix (#19)
d4140c8 2026-08-04 Codex/subscription auth hotfix (#18)
5761aba 2026-08-04 Codex/subscription auth hotfix (#17)
a16e6b9 2026-08-04 Codex/subscription auth hotfix (#16)
b079bc7 2026-08-04 Codex/subscription auth hotfix (#15)
f26a4ac 2026-08-04 Codex/subscription auth hotfix (#14)
06cdb90 2026-08-04 Codex/subscription auth hotfix (#12)
c12e554 2026-08-04 Codex/subscription auth hotfix (#11)
e992e1e 2026-08-04 Codex/subscription auth hotfix (#10)
728894c 2026-08-03 Finalise la page abonnement avec accordéons (#9)
568dd13 2026-08-03 Codex/subscription auth hotfix (#7)
d8be6c2 2026-07-27 Ajoute le formulaire de demande d’abonnement (#5)
63b86e0 2026-07-23 Refonte de la page Abonnement (#2)
6fe374e 2026-07-22 Ajout de la page publique d'inscription entreprise
21351b6 2026-07-15 Updated Subscription.tsx
e1d41a9 2026-07-10 Amélioration communication page d'accueil
e185216 2026-07-07 Correction modals et offre abonnement
5bec703 2026-07-07 Mise à jour offre de lancement
de13a2a 2026-07-07 Amélioration page abonnement
d83d4c2 2026-07-07 Amélioration de la page abonnement
3a31e1e 2026-07-05 Added playfair-display-700-latin.woff2
```
