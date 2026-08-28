export interface VerifiedJobOffer {
  id: string;
  title: string;
  company: string;
  city: string;
  contract: string;
  sector: string;
  experience: string;
  skills: string[];
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  reviewUntil: string;
}

export const VERIFIED_JOB_OFFERS: VerifiedJobOffer[] = [
  {
    id: 'septeo-salesforce-tunis',
    title: 'Développeur Salesforce H/F',
    company: 'Septeo',
    city: 'Tunis',
    contract: 'CDI · Temps complet',
    sector: 'Informatique',
    experience: '5 ans minimum',
    skills: ['Salesforce', 'Apex', 'LWC', 'API'],
    sourceName: 'Septeo / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/Septeo/744000138081619-developpeur-salesforce-h-f',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
  {
    id: 'mazarine-junior-it-tunis',
    title: 'Junior IT & Business Applications Associate',
    company: 'Mazarine Energy',
    city: 'Tunis',
    contract: 'Temps complet',
    sector: 'Informatique',
    experience: 'Débutant accepté',
    skills: ['Support IT', 'Cybersécurité', 'Microsoft 365', 'Réseaux'],
    sourceName: 'Mazarine Energy / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/MazarineEnergy/744000141192411-junior-it-business-applications-associate',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
  {
    id: 'lesaffre-technicien-maintenance-jendouba',
    title: 'Technicien de maintenance',
    company: 'Rayen Food Industries · Lesaffre',
    city: 'Jendouba',
    contract: 'Contrat permanent · Temps complet',
    sector: 'Industrie',
    experience: 'Licence technique',
    skills: ['Électromécanique', 'GMAO', 'Automatisme', 'Maintenance'],
    sourceName: 'Lesaffre / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/Lesaffre/744000144550619-technicien-de-maintenance',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
  {
    id: 'lesaffre-coordinateur-rh-jendouba',
    title: 'Coordinateur Ressources Humaines',
    company: 'Rayen Food Industries · Lesaffre',
    city: 'Jendouba',
    contract: 'Apprentissage · Temps complet',
    sector: 'Ressources humaines',
    experience: 'Jeune diplômé',
    skills: ['Administration RH', 'Paie', 'Excel', 'Français · Anglais'],
    sourceName: 'Lesaffre / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/Lesaffre/744000140887304-coordinateur-ressources-humaines',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
  {
    id: 'lacroix-technicien-process-mghira',
    title: 'Technicien Process H/F',
    company: 'LACROIX Electronics',
    city: 'Mghira',
    contract: 'Contrat · Horaires 2×8',
    sector: 'Industrie électronique',
    experience: '5 ans minimum',
    skills: ['Électronique', 'Process CMS', 'IPC A-610', 'Qualité'],
    sourceName: 'LACROIX / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/LACROIX1/744000127700209-technicien-process-h-f',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
  {
    id: 'leoni-specialist-production-concept',
    title: 'Specialist Production Concept',
    company: 'LEONI Wiring Systems Tunisia',
    city: 'Tunisie',
    contract: 'Temps complet · Sur site',
    sector: 'Industrie automobile',
    experience: '2 ans appréciés',
    skills: ['Production', 'Capacité', 'Gestion de projet', 'Français · Anglais'],
    sourceName: 'LEONI / SmartRecruiters',
    sourceUrl: 'https://jobs.smartrecruiters.com/LEONI1/744000142074259-1-specialist-production-concept',
    verifiedAt: '2026-08-28',
    reviewUntil: '2026-09-28',
  },
];

export function getCurrentVerifiedJobs(referenceDate = new Date()): VerifiedJobOffer[] {
  const day = referenceDate.toISOString().slice(0, 10);
  return VERIFIED_JOB_OFFERS.filter((offer) => offer.reviewUntil >= day);
}
