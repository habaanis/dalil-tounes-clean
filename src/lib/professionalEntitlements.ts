export interface ProfessionalEntitlements {
  plan: 'artisan' | 'premium' | 'legacy' | 'unconfirmed';
  source: string;
  confirmation_required: boolean;
  photo_limit: number;
  photo_count: number;
  social_limit: number;
  social_count: number;
  models: Array<'business' | 'portfolio'>;
  palettes: Array<'prestige' | 'ivory' | 'night'>;
  openings: Array<'photo' | 'framed'>;
  current_model: 'business' | 'portfolio';
  current_palette: 'prestige' | 'ivory' | 'night';
  current_opening: 'photo' | 'framed';
}

// Rights are supplied by the same server resolver that validates every save.
// Missing/failed rights reads must leave additional choices disabled.
export function isProfessionalEntitlements(value: unknown): value is ProfessionalEntitlements {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return ['business', 'portfolio'].includes(String(row.current_model))
    && ['prestige', 'ivory', 'night'].includes(String(row.current_palette))
    && ['photo', 'framed'].includes(String(row.current_opening))
    && ['artisan', 'premium', 'legacy', 'unconfirmed'].includes(String(row.plan))
    && ['photo_limit', 'photo_count', 'social_limit', 'social_count'].every(key =>
      Number.isInteger(row[key]) && Number(row[key]) >= 0)
    && Array.isArray(row.models) && row.models.length > 0 && row.models.every(v => ['business', 'portfolio'].includes(v))
    && Array.isArray(row.palettes) && row.palettes.length > 0 && row.palettes.every(v => ['prestige', 'ivory', 'night'].includes(v))
    && Array.isArray(row.openings) && row.openings.length > 0 && row.openings.every(v => ['photo', 'framed'].includes(v));
}
