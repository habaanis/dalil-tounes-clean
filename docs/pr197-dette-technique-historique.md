# Dette technique historique — hors périmètre de la PR #197

Référence : main `10fc772421960dad18ce1498a21d75a7ed6f5166`. Même installation de dépendances et mêmes commandes dans deux worktrees isolés.

## TypeScript

202 diagnostics syntaxiques, sortie strictement identique octet par octet. SHA-256 : `de09bf78f55320860f24bc6f46bfbccdc89b0c8393f925664bed9bd33c613db5`. Aucun nouveau diagnostic CLI. Contrôle sémantique explicite supplémentaire dans les composants et modules modifiés : 10 diagnostics sur main, 5 sur la branche, aucun nouveau.

## ESLint

368 erreurs / 44 avertissements sur main ; 363 / 44 après correction de la régression prefer-const. Comparaison par fichier, règle, message, sévérité et ligne source (indépendante des décalages de numéros de ligne). Aucun nouveau diagnostic ; cinq anciens diagnostics d’erreur de variables inutilisées ont disparu.

| Fichier | Erreurs main | Erreurs branche | Avertissements main | Avertissements branche |
|---|---:|---:|---:|---:|
| `src/AppRouter.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AdminDashboard.tsx` | 5 | 5 | 0 | 0 |
| `src/components/AdminNotifications.tsx` | 0 | 0 | 1 | 1 |
| `src/components/AlerteRechercheForm.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AnnouncementCard.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AnnouncementDetail.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AnnouncementForm.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AvisForm.tsx` | 1 | 1 | 0 | 0 |
| `src/components/AvisSection.tsx` | 0 | 0 | 1 | 1 |
| `src/components/BannerAdsCarousel.tsx` | 1 | 1 | 1 | 1 |
| `src/components/BonnesAffaires.tsx` | 1 | 1 | 0 | 0 |
| `src/components/BusinessCardWithActivity.tsx` | 1 | 1 | 0 | 0 |
| `src/components/BusinessDetail.tsx` | 11 | 11 | 3 | 3 |
| `src/components/BusinessQRCode.tsx` | 0 | 0 | 1 | 1 |
| `src/components/BusinessShowcaseDetail.tsx` | 0 | 0 | 1 | 1 |
| `src/components/CultureEventAgendaCard.tsx` | 1 | 1 | 0 | 0 |
| `src/components/CvPresentationModelSelector.tsx` | 0 | 0 | 4 | 4 |
| `src/components/DebugSearchPanel.tsx` | 5 | 5 | 0 | 0 |
| `src/components/EducationCompare.tsx` | 4 | 4 | 0 | 0 |
| `src/components/EntrepriseAvisForm.tsx` | 1 | 1 | 0 | 0 |
| `src/components/ErrorBoundary.tsx` | 1 | 1 | 0 | 0 |
| `src/components/GratuitCard.tsx` | 4 | 4 | 0 | 0 |
| `src/components/GuideMascot.tsx` | 0 | 0 | 1 | 1 |
| `src/components/HomeFeedbackWidget.tsx` | 1 | 1 | 0 | 0 |
| `src/components/ImageCarousel.tsx` | 0 | 0 | 1 | 1 |
| `src/components/ImageGallery.tsx` | 1 | 1 | 0 | 0 |
| `src/components/JobCard.tsx` | 1 | 1 | 0 | 0 |
| `src/components/Layout.tsx` | 3 | 3 | 0 | 0 |
| `src/components/LeisureEventsSection.tsx` | 2 | 2 | 0 | 0 |
| `src/components/LocalBusinessesSection.tsx` | 1 | 1 | 0 | 0 |
| `src/components/MarketplaceCard.tsx` | 1 | 1 | 0 | 0 |
| `src/components/MedicalTransportCard.tsx` | 1 | 1 | 0 | 0 |
| `src/components/MeilleursSection.tsx` | 20 | 20 | 0 | 0 |
| `src/components/NegotiationModal.tsx` | 1 | 1 | 0 | 0 |
| `src/components/ReportModal.tsx` | 1 | 1 | 0 | 0 |
| `src/components/SearchBar.tsx` | 48 | 48 | 2 | 2 |
| `src/components/SimpleJobCard.tsx` | 2 | 2 | 0 | 0 |
| `src/components/SpecialtyAutocomplete.tsx` | 1 | 1 | 0 | 0 |
| `src/components/StarNavigation.tsx` | 6 | 6 | 0 | 0 |
| `src/components/SuggestionEntrepriseModal.tsx` | 3 | 3 | 0 | 0 |
| `src/components/TourismExperienceDiscovery.tsx` | 0 | 0 | 1 | 1 |
| `src/components/VehicleTypeAutocomplete.tsx` | 1 | 1 | 0 | 0 |
| `src/components/WhatsAppSupport.tsx` | 1 | 1 | 0 | 0 |
| `src/components/auth/LoginForm.tsx` | 2 | 2 | 0 | 0 |
| `src/components/auth/SignupForm.tsx` | 2 | 2 | 0 | 0 |
| `src/components/business/BusinessDirectory.tsx` | 9 | 9 | 0 | 0 |
| `src/components/forms/CandidateForm.tsx` | 1 | 1 | 0 | 0 |
| `src/context/AuthContext.tsx` | 2 | 2 | 1 | 1 |
| `src/context/LanguageContext.tsx` | 0 | 0 | 2 | 2 |
| `src/hooks/useBusinessCategories.ts` | 1 | 1 | 0 | 0 |
| `src/hooks/useEntrepriseSuggest.ts` | 2 | 2 | 0 | 0 |
| `src/hooks/useFormSubmit.ts` | 2 | 2 | 0 | 0 |
| `src/hooks/useHomeData.ts` | 0 | 0 | 1 | 1 |
| `src/hooks/useJobSearch.ts` | 0 | 0 | 1 | 1 |
| `src/hooks/usePaginatedSeoBusinesses.ts` | 0 | 0 | 2 | 2 |
| `src/hooks/useSearch.ts` | 4 | 4 | 0 | 0 |
| `src/hooks/useSectorCategories.ts` | 2 | 2 | 1 | 1 |
| `src/hooks/useSimpleJobSearch.ts` | 0 | 0 | 1 | 1 |
| `src/hooks/useViewTracking.ts` | 3 | 3 | 0 | 0 |
| `src/lib/businessEventsPageTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/businessNeedFormTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/businessNeedsPublicTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/businessesPageTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/databaseI18n.ts` | 5 | 5 | 0 | 0 |
| `src/lib/footerRequestTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/formPersistence.ts` | 2 | 2 | 0 | 0 |
| `src/lib/homeJobsResidualTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/i18n.ts` | 12 | 12 | 0 | 0 |
| `src/lib/imageUtils.ts` | 3 | 3 | 0 | 0 |
| `src/lib/jobMatchPageTranslations.ts` | 2 | 2 | 0 | 0 |
| `src/lib/layoutPublicTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/navigationLogger.ts` | 5 | 5 | 0 | 0 |
| `src/lib/partnerSearchOfferTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/publicComponentTranslations.ts` | 1 | 1 | 0 | 0 |
| `src/lib/ratingUtils.ts` | 3 | 3 | 0 | 0 |
| `src/lib/registerServiceWorker.ts` | 3 | 3 | 0 | 0 |
| `src/lib/schemaTypeMapping.ts` | 2 | 2 | 0 | 0 |
| `src/lib/searchRelevance.ts` | 0 | 0 | 1 | 1 |
| `src/lib/searchSynonyms.ts` | 2 | 2 | 0 | 0 |
| `src/lib/seo/index.ts` | 1 | 1 | 0 | 0 |
| `src/lib/seo/metaTags.ts` | 2 | 2 | 0 | 0 |
| `src/lib/seo/sitemap.ts` | 1 | 1 | 0 | 0 |
| `src/lib/seoLandingData.ts` | 1 | 1 | 0 | 0 |
| `src/lib/services/searchService.ts` | 9 | 9 | 0 | 0 |
| `src/lib/slugify.test.ts` | 1 | 1 | 0 | 0 |
| `src/lib/structuredDataSchemas.ts` | 1 | 1 | 0 | 0 |
| `src/lib/supabaseCache.ts` | 6 | 6 | 0 | 0 |
| `src/lib/supabaseClient.ts` | 6 | 6 | 0 | 0 |
| `src/lib/textNormalization.ts` | 4 | 4 | 0 | 0 |
| `src/lib/useRTL.ts` | 2 | 2 | 0 | 0 |
| `src/lib/useTranslationExtended.ts` | 3 | 3 | 0 | 0 |
| `src/pages/AdminCommercial.tsx` | 5 | 5 | 1 | 1 |
| `src/pages/AdminSourcing.tsx` | 12 | 12 | 2 | 2 |
| `src/pages/AroundMe.tsx` | 8 | 8 | 3 | 3 |
| `src/pages/BusinessEvents.tsx` | 0 | 0 | 1 | 1 |
| `src/pages/Businesses.tsx` | 39 | 39 | 4 | 4 |
| `src/pages/CandidateDashboard.tsx` | 2 | 2 | 1 | 1 |
| `src/pages/CandidateJobMatches.tsx` | 2 | 2 | 1 | 1 |
| `src/pages/CandidateProfile.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/CertifiedBusinesses.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/CitizensAdmin.tsx` | 6 | 6 | 1 | 1 |
| `src/pages/CitizensHealth.tsx` | 3 | 3 | 0 | 0 |
| `src/pages/CitizensServices.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/CitizensTourism.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/CompanyDashboard.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/CultureEvents.tsx` | 2 | 2 | 1 | 1 |
| `src/pages/Entreprisespage.OLD.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/Home.tsx` | 8 | 8 | 0 | 0 |
| `src/pages/JobCandidateMatches.tsx` | 1 | 1 | 1 | 1 |
| `src/pages/JobDetail.tsx` | 0 | 0 | 1 | 1 |
| `src/pages/LocalMarketplace.tsx` | 2 | 2 | 0 | 0 |
| `src/pages/PartnerRequestsAdmin.tsx` | 3 | 3 | 0 | 0 |
| `src/pages/PartnerSearch.tsx` | 2 | 2 | 0 | 0 |
| `src/pages/PourquoiDalilTounes.tsx` | 2 | 2 | 0 | 0 |
| `src/pages/SeparationPreview.tsx` | 4 | 0 | 0 | 0 |
| `src/pages/Subscription.tsx` | 1 | 0 | 0 | 0 |
| `src/pages/SuperModeration.tsx` | 2 | 2 | 0 | 0 |
| `src/pages/blog/Blog.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/blog/BlogPost.tsx` | 2 | 2 | 0 | 0 |
| `src/pages/debug/EntrepriseDebug.tsx` | 1 | 1 | 0 | 0 |
| `src/pages/debug/I18nDebug.tsx` | 1 | 1 | 0 | 0 |
| `supabase/functions/admin-avis/index.ts` | 1 | 1 | 0 | 0 |
| `supabase/functions/notify-business-need/index.ts` | 1 | 1 | 0 | 0 |

## Travaux à traiter séparément

- Réparer les erreurs syntaxiques des composants historiques, puis relancer le contrôle TypeScript complet.
- Résorber les diagnostics lint historiques sans mélanger ce travail à la restructuration commerciale.
- Le domaine de prévisualisation est rejeté par la liste CORS existante du service d’inscription. La PR utilise un relais strictement limité à Vercel Preview ; aucune configuration ni fonction Supabase de production n’a été changée.
- Le parcours actuel Artisan/Premium demande le paiement BIAT manuellement après réception. Le code Stripe ancien reste hors parcours courant ; il n’a été ni modifié ni activé.

Ces diagnostics préexistants ne sont pas présentés comme une validation globale réussie. La décision de fusion porte sur l’absence de nouvelles erreurs et les parcours testés, pas sur un nettoyage général du dépôt.
