# Dalil Tounes - Guide d'intervention

Ce fichier sert de guide permanent pour toute future intervention sur le projet Dalil Tounes.

## Regles generales

1. Toujours preserver le SEO existant.
2. Ne jamais supprimer ou modifier une route existante sans justification claire.
3. Preserver les URLs publiques actuelles.
4. Respecter les langues du projet : francais, arabe, anglais, italien, russe.
5. Ne jamais modifier `BusinessCard`, `BusinessDetail` ou les composants SEO sans expliquer l'impact.
6. Avant toute modification importante, expliquer le plan et les fichiers concernes.
7. Ne pas toucher aux fichiers Supabase, RLS ou Edge Functions sans demande explicite.
8. Ne jamais exposer de cles secretes.
9. Verifier TypeScript, lint et build quand l'environnement le permet.
10. Preserver la compatibilite Vercel.
11. Garder une approche progressive : petites modifications, testables facilement.
12. Pour les pages publiques, penser mobile, performance et accessibilite.
13. Pour les pages SEO, preserver `title`, `description`, `canonical`, `hreflang` et `structured data`.
14. Pour les donnees entreprises, ne jamais inventer de donnees.
15. En cas de doute, faire un diagnostic en lecture seule avant de modifier.
