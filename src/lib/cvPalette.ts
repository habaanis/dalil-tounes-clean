export type CvPaletteId = 'prestige' | 'ivory' | 'night';

export type CvPaletteTheme = {
  id: CvPaletteId;
  page: string;
  surface: string;
  surfaceAlt: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
  qrForeground: string;
  qrBackground: string;
};

export const CV_PALETTE_THEMES: Record<CvPaletteId, CvPaletteTheme> = {
  prestige: {
    id: 'prestige',
    page: '#032D21',
    surface: '#032D21',
    surfaceAlt: '#062D24',
    accent: '#D5B257',
    text: '#FFFDF7',
    muted: '#E3ECE8',
    border: '#D5B257',
    qrForeground: '#032D21',
    qrBackground: '#FFFFFF',
  },
  ivory: {
    id: 'ivory',
    page: '#FFF8E7',
    surface: '#FFF8E7',
    surfaceAlt: '#F3E7CC',
    accent: '#B3871F',
    text: '#3B3126',
    muted: '#695B4B',
    border: '#D4AF37',
    qrForeground: '#3B3126',
    qrBackground: '#FFFFFF',
  },
  night: {
    id: 'night',
    page: '#10243A',
    surface: '#10243A',
    surfaceAlt: '#172F49',
    accent: '#E5C486',
    text: '#F8F1E4',
    muted: '#D7D5D0',
    border: '#E5C486',
    qrForeground: '#10243A',
    qrBackground: '#FFFFFF',
  },
};

export function resolveCvPalette(value?: string | null): CvPaletteId {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalized.includes('ivoire') || normalized.includes('ivory')) return 'ivory';
  if (normalized.includes('nuit') || normalized.includes('night') || normalized.includes('bleu')) return 'night';
  return 'prestige';
}

export function getCvPaletteTheme(value?: string | null): CvPaletteTheme {
  return CV_PALETTE_THEMES[resolveCvPalette(value)];
}
