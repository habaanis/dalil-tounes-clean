# Inventaire des routes — complément premium de #198

Inventaire des motifs déclarés dans AppRouter ; les pages dynamiques représentent plusieurs URLs. Aucun changement de route. Les pages client restent exclues du thème public, y compris sur hôtes dédiés.

| Route | Composant | Périmètre |
|---|---|---|
| / | PlatformHome | Public |
| /apercu-ouverture-prestige | PrestigeOpeningPreview | Démonstration — exclue |
| /citizens | Citizens | Public |
| /citizens/health | CitizensHealth | Public |
| /citizens/sante | CitizensHealth | Public |
| /citizens/health/thermalisme | ThermalismPage | Public |
| /citizens/tourism/thermalisme | ThermalismPage | Public |
| /citizens/admin | CitizenServicesRedirect | Redirection conservée |
| /citizens/leisure | CitizensLeisure | Public |
| /citizens/loisirs | CitizensLeisure | Public |
| /citizens/shops | CitizensShops | Public |
| /citizens/magasins | CitizenShopsRedirect | Redirection conservée |
| /citizens/services | CitizensServices | Public |
| /citizens/tourism | CitizensTourism | Public |
| /citizens/tourisme | CitizensTourism | Public |
| /citizens/tourism/guide/:slug | TourismGuideTopic | Public |
| /recherche | Businesses | Public |
| /businesses | Businesses | Public |
| /entreprises | Businesses | Public |
| /entreprises-certifiees | CertifiedBusinesses | Public |
| /business/:id/:slug? | LegacyBusinessRedirect | Client — exclu |
| /entreprises/:id/:slug? | LegacyBusinessRedirect | Client — exclu |
| /entreprise/id/:id | BusinessDetail | Client — exclu |
| /entreprise/:villeSlug/:slug | BusinessDetail | Client — exclu |
| /entreprise/:slug | BusinessDetail | Client — exclu |
| /cv/:slug | BusinessDetail | Client — exclu |
| /p/:slug | BusinessDetail | Client — exclu |
| /qr-business/:id/cv | BusinessDetail | Client — exclu |
| /qr-business/:id | BusinessQr | Client — exclu |
| /:slug/cv | ClientCvRoute | Client — exclu |
| /jobs | Jobs | Public |
| /emploi | Jobs | Public |
| /emplois | Jobs | Public |
| /emplois/publier | PublishJob | Public |
| /emplois/mes-recommandations | CandidateJobMatches | Privé — exclu |
| /emplois/:jobId/candidats | JobCandidateMatches | Privé — exclu |
| /education | Education | Public |
| /education-event-form | EducationEventForm | Public |
| /culture-events | CultureEvents | Public |
| /evenements | CultureEvents | Public |
| /marketplace | RetiredMarketplaceRedirect | Redirection conservée |
| /marche-local | RetiredMarketplaceRedirect | Redirection conservée |
| /local-marketplace | RetiredMarketplaceRedirect | Redirection conservée |
| /around-me | AroundMe | Public |
| /autour-de-moi | AroundMe | Public |
| /auth | Auth | Public |
| /login | Auth | Public |
| /signup | Auth | Public |
| /connexion | Auth | Public |
| /inscription | Auth | Public |
| /dashboard/candidat | CandidateDashboard | Privé / diagnostic — exclu |
| /dashboard/entreprise | CompanyDashboard | Privé / diagnostic — exclu |
| /inscription-entreprise | BusinessRegistration | Public |
| /subscription | Subscription | Public |
| /cv-business | CvBusinessHome | Public |
| /preview/separation-plateforme-cv | SeparationPreview | Démonstration — exclue |
| /abonnement | CommercialRedirect | Redirection conservée |
| /paiement/confirmation | PaiementConfirmation | Public |
| /concept | CommercialRedirect | Redirection conservée |
| /devenir-partenaire | BecomePartner | Public |
| /notre-concept | CommercialRedirect | Redirection conservée |
| /pourquoi-dalil-tounes | PourquoiDalilTounes | Public |
| /blog | Blog | Public |
| /blog/:slug | BlogPost | Public |
| /partner-search | PartnerSearch | Public |
| /partner-directory | PartnerDirectory | Public |
| /annuaire-partenaires | PartnerDirectory | Public |
| /business-events | BusinessEvents | Public |
| /besoins-professionnels | BusinessNeeds | Public |
| /besoins-professionnels/public | Navigate | Redirection conservée |
| /transport-inscription | TransportInscription | Public |
| /candidate-profile | CandidateProfile | Public |
| /candidates | CandidateList | Public |
| /candidats | CandidateList | Public |
| /business-list | BusinessList | Public |
| /suggest-business | SuggestBusiness | Public |
| /admin/partner-requests | PartnerRequestsAdmin | Privé / diagnostic — exclu |
| /admin/inscriptions-loisirs | AdminInscriptionsLoisirs | Privé / diagnostic — exclu |
| /admin/sourcing | AdminSourcing | Privé / diagnostic — exclu |
| /admin/avis | AdminAvis | Privé / diagnostic — exclu |
| /admin/super-moderation | SuperModeration | Privé / diagnostic — exclu |
| /admin/premium | AdminPremium | Privé / diagnostic — exclu |
| /admin/opening-models | AdminOpeningModels | Privé / diagnostic — exclu |
| /admin/abonnements | AdminPremium | Privé / diagnostic — exclu |
| /admin/commercial | AdminCommercial | Privé / diagnostic — exclu |
| /commercial | AdminCommercial | Privé / diagnostic — exclu |
| /admin/downloads | AdminDownloads | Privé / diagnostic — exclu |
| /admin/business-needs | AdminBusinessNeeds | Privé / diagnostic — exclu |
| /card-preview | CardPreview | Démonstration — exclue |
| /searchDebug | SearchDebug | Privé / diagnostic — exclu |
| /debug/entreprise | EntrepriseDebug | Privé / diagnostic — exclu |
| /debug/i18n | I18nDebug | Privé / diagnostic — exclu |
| /contact | Contact | Public |
| /mentions-legales | MentionsLegales | Public |
| /cgu | CGU | Public |
| /politique-confidentialite | PrivacyPolicy | Public |
| /plan-du-site | SitemapPage | Public |
| /info-avis | InfoAvis | Public |
| /ville/:villeSlug | VillePage | Public |
| /secteur/:secteurSlug | SecteurPage | Public |
| /gouvernorat/:gouvernoratSlug | GouvernoratPage | Public |
| /metier/:metierSlug | MetierPage | Public |
| /:slug | RootSlugRoute | Public |
| /#/* | Navigate | Redirection conservée |
| * | NotFound | Public |
