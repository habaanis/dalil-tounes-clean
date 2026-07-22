export type SuggestionRow = {
  id: string;
  created_at?: string | null;
  titre_demande?: string | null;
  telephone?: string | null;
  email?: string | null;
  message?: string | null;
  type_demande?: string | null;
  source_page?: string | null;
  langue?: string | null;
  priorite?: string | null;
  statut?: string | null;
  nom_entreprise?: string | null;
  contact_suggere?: string | null;
  email_suggesteur?: string | null;
  raison_suggestion?: string | null;
  secteur?: string | null;
  submission_lang?: string | null;
  synced_to_airtable?: boolean | null;
  airtable_record_id?: string | null;
};

export function buildAirtableFields(record: SuggestionRow): Record<string, unknown> {
  const title = cleanSingleLine(record.titre_demande || record.nom_entreprise || 'Demande sans titre', 180);
  const phone = cleanPhone(record.telephone) || extractPhone(record.contact_suggere) || '';
  const email = cleanEmail(record.email) || cleanEmail(record.email_suggesteur) || '';
  const message = cleanMultiline(record.message || record.raison_suggestion || '', 10_000);
  const typeContext = [
    record.type_demande,
    record.secteur,
    record.titre_demande,
    record.raison_suggestion,
  ].filter(Boolean).join(' ');
  const sourceContext = [record.source_page, record.raison_suggestion].filter(Boolean).join(' ');

  return {
    'Titre de la demande': title,
    Téléphone: phone || undefined,
    Email: email || undefined,
    Message: message,
    'Type de demande': normalizeType(typeContext),
    'Source page': normalizeSource(sourceContext),
    Langue: normalizeLang(record.langue || record.submission_lang),
    Statut: normalizeStatus(record.statut),
    Priorité: normalizePriority(record.priorite),
    'Date de réception': record.created_at || new Date().toISOString(),
    'Notes internes': `ID Supabase: ${record.id}`,
  };
}

export function normalizeLang(value?: string | null): string {
  const raw = (value || 'fr').toLowerCase();
  if (raw.startsWith('ar')) return 'Arabe';
  if (raw.startsWith('en')) return 'Anglais';
  if (raw.startsWith('it')) return 'Italien';
  if (raw.startsWith('ru')) return 'Russe';
  return 'Français';
}

export function normalizeType(value?: string | null): string {
  const raw = (value || '').toLowerCase();
  if (raw.includes('candidat')) return 'Candidat emploi';
  if (raw.includes('chauffeur')) return 'Chauffeur privé';
  if (raw.includes('professeur')) return 'Professeur privé';
  if (raw.includes('transport')) return 'Transport médical';
  if (raw.includes('ambul')) return 'Ambulancier';
  if (raw.includes('event') || raw.includes('événement') || raw.includes('evenement')) return 'Événement';
  if (
    raw.includes('abonnement') ||
    raw.includes('premium') ||
    raw.includes('elite pro') ||
    raw.includes('élite pro') ||
    raw.trim() === 'artisan' ||
    raw.includes('plan artisan')
  ) return 'Abonnement';
  if (raw.includes('parten')) return 'Partenariat';
  if (raw.includes('inscription') || raw.includes('entreprise') || raw.includes('business')) return 'Entreprise';
  if (raw.includes('info')) return 'Information générale';
  return 'Autre';
}

export function normalizeSource(value?: string | null): string {
  const raw = (value || '').toLowerCase();
  if (raw.includes('inscription-entreprise') || raw.includes('business') || raw.includes('entreprise')) return 'Business';
  if (raw.includes('home') || raw.includes('accueil')) return 'Home';
  if (raw.includes('footer')) return 'Footer';
  if (raw.includes('subscription') || raw.includes('abonnement')) return 'Subscription';
  if (raw.includes('candidate') || raw.includes('candidat')) return 'Candidate';
  if (raw.includes('health') || raw.includes('sant')) return 'Health';
  if (raw.includes('transport')) return 'Transport';
  if (raw.includes('education') || raw.includes('éducation')) return 'Education';
  if (raw.includes('event') || raw.includes('événement') || raw.includes('evenement')) return 'Events';
  if (raw.includes('contact')) return 'Contact';
  return 'Autre';
}

export function normalizePriority(value?: string | null): string {
  const raw = (value || 'Normale').toLowerCase();
  if (raw.includes('haut') || raw.includes('high')) return 'Haute';
  if (raw.includes('bas') || raw.includes('low')) return 'Basse';
  return 'Normale';
}

export function normalizeStatus(value?: string | null): string {
  const raw = (value || '').toLowerCase();
  if (!raw || raw === 'en_attente' || raw.includes('nouveau')) return 'Nouveau';
  if (raw.includes('a_contacter') || raw.includes('à contacter')) return 'À contacter';
  if (raw.includes('contacté') || raw.includes('contacte')) return 'Contacté';
  if (raw.includes('attente')) return 'En attente';
  if (raw.includes('information')) return 'Informations reçues';
  if (raw.includes('inscrit')) return 'Inscrit sur le site';
  if (raw.includes('valid')) return 'Validé';
  if (raw.includes('refus')) return 'Refusé';
  if (raw.includes('termin')) return 'Terminé';
  return 'Nouveau';
}

export function cleanPhone(value?: string | null): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const plus = raw.startsWith('+') ? '+' : '';
  const digits = raw.replace(/\D/g, '');
  return digits ? `${plus}${digits}` : '';
}

export function extractPhone(value?: string | null): string {
  const match = String(value || '').match(/(?:\+216\s*)?(?:\d[\s().-]*){8}/);
  return cleanPhone(match?.[0] || '');
}

export function cleanEmail(value?: string | null): string {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function cleanSingleLine(value: string, maxLength: number): string {
  return stripControlCharacters(value, false)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMultiline(value: string, maxLength: number): string {
  return stripControlCharacters(value.replace(/\r\n/g, '\n'), true)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
    .slice(0, maxLength);
}

function stripControlCharacters(value: string, preserveLayout: boolean): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    if (preserveLayout && (code === 9 || code === 10 || code === 13)) return character;
    if (code <= 31 || code === 127) return preserveLayout ? '' : ' ';
    return character;
  }).join('');
}
