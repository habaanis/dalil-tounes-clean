import type { NormalizedRegistrationRequest } from './companyRegistration.ts';

export function buildSuggestionRow(form: NormalizedRegistrationRequest): Record<string, unknown> {
  const details = buildDetailedMessage(form);

  if (form.mode === 'legacy_suggestion') {
    const isMedical = form.legacyType === 'medical_transport';
    return {
      titre_demande: form.title,
      telephone: form.phone || null,
      email: form.email || null,
      message: details,
      type_demande: isMedical ? 'transport' : 'demande_information',
      source_page: form.sourcePage,
      langue: form.language,
      priorite: 'Normale',
      statut: 'en_attente',
      nom_entreprise: form.title,
      secteur: isMedical
        ? 'Transport médical / demande d’information'
        : 'Demande information / inscription',
      ville: null,
      contact_suggere: [form.phone, form.email].filter(Boolean).join(' - '),
      email_suggesteur: form.email || null,
      raison_suggestion: details,
      submission_lang: form.language,
    };
  }

  if (form.mode === 'subscription') {
    return {
      titre_demande: form.title,
      telephone: form.phone,
      email: form.email || null,
      message: details,
      type_demande: 'demande_abonnement',
      source_page: 'subscription',
      langue: form.language,
      priorite: 'Normale',
      statut: 'en_attente',
      nom_entreprise: form.companyName,
      secteur: form.sector,
      ville: form.city,
      contact_suggere: [
        `Téléphone: ${form.phone}`,
        form.whatsapp ? `WhatsApp: ${form.whatsapp}` : '',
        `Responsable: ${form.managerName}`,
        `Contact préféré: ${contactMethodLabel(form.preferredContactMethod)}`,
      ].filter(Boolean).join(' | '),
      email_suggesteur: form.email || null,
      raison_suggestion: details,
      pack_type: form.selectedPlan || null,
      facebook_url: form.facebook || null,
      instagram_url: form.instagram || null,
      submission_lang: form.language,
    };
  }

  return {
    titre_demande: form.companyName,
    telephone: form.phone,
    email: form.email || null,
    message: details,
    type_demande: 'inscription_entreprise',
    source_page: 'inscription-entreprise',
    langue: form.language,
    priorite: 'Normale',
    statut: 'en_attente',
    nom_entreprise: form.companyName,
    secteur: form.sector,
    ville: form.city,
    contact_suggere: [
      `Téléphone: ${form.phone}`,
      form.whatsapp ? `WhatsApp: ${form.whatsapp}` : '',
      `Responsable: ${form.managerName}`,
    ].filter(Boolean).join(' | '),
    email_suggesteur: form.email || null,
    raison_suggestion: details,
    facebook_url: form.facebook || null,
    instagram_url: form.instagram || null,
    submission_lang: form.language,
  };
}

export function buildDetailedMessage(form: NormalizedRegistrationRequest): string {
  if (form.mode === 'legacy_suggestion') {
    return [
      `Request-ID: ${form.requestId}`,
      form.legacyType === 'medical_transport'
        ? 'Demande d’information / inscription transport médical'
        : 'Demande information / inscription',
      `Titre: ${form.title}`,
      form.phone ? `Téléphone: ${form.phone}` : '',
      form.email ? `Email: ${form.email}` : '',
      form.message,
    ].filter(Boolean).join('\n');
  }
  if (form.mode === 'subscription') {
    return [
      `Request-ID: ${form.requestId}`,
      'Demande depuis la page abonnement',
      form.selectedPlan ? `Formule choisie: ${form.selectedPlan}` : '',
      `Titre interne: ${form.title}`,
      `Activité: ${form.companyName}`,
      `Responsable: ${form.managerName}`,
      `Secteur: ${form.sector}`,
      `Gouvernorat: ${form.governorate}`,
      `Ville: ${form.city}`,
      `Téléphone / WhatsApp: ${form.phone}`,
      form.email ? `Email: ${form.email}` : '',
      form.selectedPlatforms.length
        ? `Plateformes existantes: ${form.selectedPlatforms.map(platformLabel).join(', ')}`
        : 'Plateformes existantes: Non renseignées',
      form.website ? `Site web: ${form.website}` : '',
      form.facebook ? `Facebook: ${form.facebook}` : '',
      form.instagram ? `Instagram: ${form.instagram}` : '',
      form.whatsapp ? `WhatsApp complémentaire: ${form.whatsapp}` : '',
      form.requestedBillingPeriod
        ? `Période demandée: ${billingPeriodLabel(form.requestedBillingPeriod)}`
        : '',
      form.requestedPaymentSchedule
        ? `Paiement souhaité: ${paymentScheduleLabel(form.requestedPaymentSchedule, form.selectedPlan)}`
        : '',
      hasPremiumAnnualFlyers(form)
        ? 'Avantage interne: 500 flyers inclus avec le Premium annuel après paiement complet et validation du modèle'
        : '',
      `Contact préféré: ${contactMethodLabel(form.preferredContactMethod)}`,
      `Moment préféré: ${contactTimeLabel(form.preferredContactTime)}`,
      form.message ? `Précision: ${form.message}` : 'Précision: Aucune',
      'Consentement: Oui',
    ].filter(Boolean).join('\n');
  }

  return [
    `Request-ID: ${form.requestId}`,
    "Demande d'inscription entreprise",
    `Entreprise: ${form.companyName}`,
    `Responsable: ${form.managerName}`,
    `Téléphone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : '',
    form.whatsapp ? `WhatsApp: ${form.whatsapp}` : '',
    `Gouvernorat: ${form.governorate}`,
    `Ville: ${form.city}`,
    `Secteur: ${form.sector}`,
    form.address ? `Adresse: ${form.address}` : '',
    form.website ? `Site web: ${form.website}` : '',
    form.facebook ? `Facebook: ${form.facebook}` : '',
    form.instagram ? `Instagram: ${form.instagram}` : '',
    form.description ? `Description: ${form.description}` : '',
    form.message ? `Besoin particulier: ${form.message}` : '',
    'Consentement: Oui',
  ].filter(Boolean).join('\n');
}

export function buildNotificationPayload(form: NormalizedRegistrationRequest, id: string) {
  if (form.mode === 'legacy_suggestion') {
    return {
      type: form.legacyType === 'medical_transport'
        ? 'Nouvelle demande transport médical'
        : 'Nouvelle demande entreprise',
      data: {
        'ID Supabase': id,
        Titre: form.title,
        Téléphone: form.phone || 'Non renseigné',
        Email: form.email || 'Non renseigné',
        Message: form.message,
        Langue: form.language,
      },
      admin_url: '/admin/sourcing',
    };
  }
  if (form.mode === 'subscription') {
    return {
      type: 'Nouvelle demande abonnement',
      data: {
        'ID Supabase': id,
        Plan: form.selectedPlan || 'Non renseigné',
        'Titre interne': form.title,
        Activité: form.companyName,
        Responsable: form.managerName,
        Secteur: form.sector,
        Gouvernorat: form.governorate,
        Ville: form.city,
        'Téléphone / WhatsApp': form.phone,
        Email: form.email || 'Non renseigné',
        Plateformes: form.selectedPlatforms.length
          ? form.selectedPlatforms.map(platformLabel).join(', ')
          : 'Non renseignées',
        'Site web': form.website || 'Non renseigné',
        Facebook: form.facebook || 'Non renseigné',
        Instagram: form.instagram || 'Non renseigné',
        WhatsApp: form.whatsapp || 'Identique ou non renseigné',
        'Période demandée': form.requestedBillingPeriod
          ? billingPeriodLabel(form.requestedBillingPeriod)
          : 'Non applicable',
        'Paiement souhaité': paymentScheduleLabel(form.requestedPaymentSchedule, form.selectedPlan),
        Flyers: hasPremiumAnnualFlyers(form)
          ? '500 flyers — Premium annuel uniquement, après paiement complet et validation du modèle'
          : 'Non inclus',
        'Contact préféré': contactMethodLabel(form.preferredContactMethod),
        'Moment préféré': contactTimeLabel(form.preferredContactTime),
        Message: form.message || 'Aucune précision complémentaire',
        Consentement: form.consent ? 'Oui' : 'Non',
        Langue: form.language,
      },
      admin_url: '/admin/premium',
    };
  }

  return {
    type: 'Nouvelle inscription entreprise',
    data: {
      'ID Supabase': id,
      Entreprise: form.companyName,
      Responsable: form.managerName,
      Téléphone: form.phone,
      Email: form.email || 'Non renseigné',
      Gouvernorat: form.governorate,
      Ville: form.city,
      Secteur: form.sector,
      WhatsApp: form.whatsapp || 'Identique ou non renseigné',
      Message: form.message || form.description || 'Aucun message complémentaire',
      Langue: form.language,
    },
    admin_url: '/admin/premium',
  };
}

function platformLabel(value: string): string {
  return {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp_business: 'WhatsApp Business',
    google_business: 'Google Business',
    website: 'Site Internet',
    other: 'Autre',
    none: 'Aucune pour le moment',
  }[value] || value;
}

function billingPeriodLabel(value: string): string {
  return {
    monthly: 'Mensuel',
    annual: 'Annuel',
    advice: 'Conseil demandé',
  }[value] || value;
}

function paymentScheduleLabel(value: string, selectedPlan: string): string {
  if (selectedPlan === 'cv_business') {
    return {
      one_payment: '199 TND en une fois',
      two_installments: '100 TND puis 99 TND',
      three_installments: '67 TND puis 66 TND puis 66 TND',
      advice: 'Conseil demandé',
    }[value] || 'Non renseigné';
  }
  return {
    advice: 'Conseil demandé',
    one_payment: 'Annuel en une fois',
    three_installments: 'Annuel en trois fois',
  }[value] || 'Non renseigné';
}

function contactMethodLabel(value: string): string {
  return {
    whatsapp: 'WhatsApp',
    phone: 'Téléphone',
    email: 'Email',
  }[value] || value;
}

function contactTimeLabel(value: string): string {
  return {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
    anytime: 'Peu importe',
  }[value] || value;
}

function hasPremiumAnnualFlyers(form: NormalizedRegistrationRequest): boolean {
  return form.requestedBillingPeriod === 'annual' &&
    form.selectedPlan === 'premium';
}
