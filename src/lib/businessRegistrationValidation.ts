export type RegistrationMode = 'company_registration' | 'subscription';

export interface SelectOption {
  value: string;
  labelFr: string;
  labelAr: string;
  labelEn?: string;
  labelIt?: string;
  labelRu?: string;
}

export const TUNISIA_GOVERNORATES: SelectOption[] = [
  { value: 'Ariana', labelFr: 'Ariana', labelAr: 'أريانة' },
  { value: 'Béja', labelFr: 'Béja', labelAr: 'باجة' },
  { value: 'Ben Arous', labelFr: 'Ben Arous', labelAr: 'بن عروس' },
  { value: 'Bizerte', labelFr: 'Bizerte', labelAr: 'بنزرت' },
  { value: 'Gabès', labelFr: 'Gabès', labelAr: 'قابس' },
  { value: 'Gafsa', labelFr: 'Gafsa', labelAr: 'قفصة' },
  { value: 'Jendouba', labelFr: 'Jendouba', labelAr: 'جندوبة' },
  { value: 'Kairouan', labelFr: 'Kairouan', labelAr: 'القيروان' },
  { value: 'Kasserine', labelFr: 'Kasserine', labelAr: 'القصرين' },
  { value: 'Kébili', labelFr: 'Kébili', labelAr: 'قبلي' },
  { value: 'Le Kef', labelFr: 'Le Kef', labelAr: 'الكاف' },
  { value: 'Mahdia', labelFr: 'Mahdia', labelAr: 'المهدية' },
  { value: 'La Manouba', labelFr: 'La Manouba', labelAr: 'منوبة' },
  { value: 'Médenine', labelFr: 'Médenine', labelAr: 'مدنين' },
  { value: 'Monastir', labelFr: 'Monastir', labelAr: 'المنستير' },
  { value: 'Nabeul', labelFr: 'Nabeul', labelAr: 'نابل' },
  { value: 'Sfax', labelFr: 'Sfax', labelAr: 'صفاقس' },
  { value: 'Sidi Bouzid', labelFr: 'Sidi Bouzid', labelAr: 'سيدي بوزيد' },
  { value: 'Siliana', labelFr: 'Siliana', labelAr: 'سليانة' },
  { value: 'Sousse', labelFr: 'Sousse', labelAr: 'سوسة' },
  { value: 'Tataouine', labelFr: 'Tataouine', labelAr: 'تطاوين' },
  { value: 'Tozeur', labelFr: 'Tozeur', labelAr: 'توزر' },
  { value: 'Tunis', labelFr: 'Tunis', labelAr: 'تونس' },
  { value: 'Zaghouan', labelFr: 'Zaghouan', labelAr: 'زغوان' },
];

export const BUSINESS_SECTORS: SelectOption[] = [
  { value: 'Artisanat', labelFr: 'Artisanat', labelAr: 'الصناعات التقليدية', labelEn: 'Crafts', labelIt: 'Artigianato', labelRu: 'Ремесла' },
  { value: 'Commerce', labelFr: 'Commerce', labelAr: 'التجارة', labelEn: 'Retail', labelIt: 'Commercio', labelRu: 'Торговля' },
  { value: 'Services aux particuliers', labelFr: 'Services aux particuliers', labelAr: 'خدمات للأفراد', labelEn: 'Personal services', labelIt: 'Servizi alla persona', labelRu: 'Услуги для частных лиц' },
  { value: 'Services aux entreprises', labelFr: 'Services aux entreprises', labelAr: 'خدمات للمؤسسات', labelEn: 'Business services', labelIt: 'Servizi alle imprese', labelRu: 'Услуги для бизнеса' },
  { value: 'Bâtiment et travaux', labelFr: 'Bâtiment et travaux', labelAr: 'البناء والأشغال', labelEn: 'Construction and works', labelIt: 'Edilizia e lavori', labelRu: 'Строительство и ремонт' },
  { value: 'Automobile', labelFr: 'Automobile', labelAr: 'السيارات', labelEn: 'Automotive', labelIt: 'Automotive', labelRu: 'Автомобили' },
  { value: 'Santé', labelFr: 'Santé', labelAr: 'الصحة', labelEn: 'Health', labelIt: 'Salute', labelRu: 'Здоровье' },
  { value: 'Beauté et bien-être', labelFr: 'Beauté et bien-être', labelAr: 'الجمال والرفاه', labelEn: 'Beauty and wellness', labelIt: 'Bellezza e benessere', labelRu: 'Красота и здоровье' },
  { value: 'Restauration et alimentation', labelFr: 'Restauration et alimentation', labelAr: 'المطاعم والأغذية', labelEn: 'Food and catering', labelIt: 'Ristorazione e alimentazione', labelRu: 'Питание и рестораны' },
  { value: 'Tourisme et loisirs', labelFr: 'Tourisme et loisirs', labelAr: 'السياحة والترفيه', labelEn: 'Tourism and leisure', labelIt: 'Turismo e tempo libero', labelRu: 'Туризм и досуг' },
  { value: 'Éducation et formation', labelFr: 'Éducation et formation', labelAr: 'التعليم والتكوين', labelEn: 'Education and training', labelIt: 'Istruzione e formazione', labelRu: 'Образование и обучение' },
  { value: 'Transport et logistique', labelFr: 'Transport et logistique', labelAr: 'النقل والخدمات اللوجستية', labelEn: 'Transport and logistics', labelIt: 'Trasporti e logistica', labelRu: 'Транспорт и логистика' },
  { value: 'Informatique et numérique', labelFr: 'Informatique et numérique', labelAr: 'الإعلامية والرقمنة', labelEn: 'IT and digital', labelIt: 'Informatica e digitale', labelRu: 'ИТ и цифровые услуги' },
  { value: 'Finance, assurance et conseil', labelFr: 'Finance, assurance et conseil', labelAr: 'المالية والتأمين والاستشارة', labelEn: 'Finance, insurance and consulting', labelIt: 'Finanza, assicurazioni e consulenza', labelRu: 'Финансы, страхование и консалтинг' },
  { value: 'Agriculture et environnement', labelFr: 'Agriculture et environnement', labelAr: 'الفلاحة والبيئة', labelEn: 'Agriculture and environment', labelIt: 'Agricoltura e ambiente', labelRu: 'Сельское хозяйство и экология' },
  { value: 'Industrie', labelFr: 'Industrie', labelAr: 'الصناعة', labelEn: 'Industry', labelIt: 'Industria', labelRu: 'Промышленность' },
  { value: 'Profession libérale', labelFr: 'Profession libérale', labelAr: 'مهنة حرة', labelEn: 'Independent profession', labelIt: 'Libera professione', labelRu: 'Частная практика' },
  { value: 'Association ou organisation', labelFr: 'Association ou organisation', labelAr: 'جمعية أو منظمة', labelEn: 'Association or organization', labelIt: 'Associazione o organizzazione', labelRu: 'Ассоциация или организация' },
  { value: 'Autre', labelFr: 'Autre', labelAr: 'أخرى', labelEn: 'Other', labelIt: 'Altro', labelRu: 'Другое' },
];

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return `${hasLeadingPlus ? '+' : ''}${digits}`;
}

export function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value);
  const digits = normalized.replace(/\D/g, '');

  if (!digits) return false;
  if (normalized.startsWith('+216')) return digits.length === 11;
  if (!normalized.startsWith('+') && digits.length === 8) return true;

  return digits.length >= 8 && digits.length <= 15;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function normalizeWebAddress(value: string, network?: 'facebook' | 'instagram'): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (network && trimmed.startsWith('@')) {
    const handle = trimmed.slice(1).replace(/[^a-zA-Z0-9._-]/g, '');
    return handle ? `https://${network}.com/${handle}` : '';
  }

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebAddress(value: string, network?: 'facebook' | 'instagram'): boolean {
  if (!value.trim()) return true;

  try {
    const url = new URL(normalizeWebAddress(value, network));
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !hostname.includes('.')) return false;

    if (network === 'facebook') {
      return hostname === 'facebook.com' || hostname.endsWith('.facebook.com');
    }
    if (network === 'instagram') {
      return hostname === 'instagram.com' || hostname.endsWith('.instagram.com');
    }
    return true;
  } catch {
    return false;
  }
}

export function cleanSingleLine(value: string): string {
  return stripControlCharacters(value, false).replace(/\s+/g, ' ').trim();
}

export function cleanMultiline(value: string): string {
  return stripControlCharacters(value.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), true)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripControlCharacters(value: string, preserveLayout: boolean): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    if (preserveLayout && (code === 9 || code === 10 || code === 13)) return character;
    if (code <= 31 || code === 127) return preserveLayout ? '' : ' ';
    return character;
  }).join('');
}
