/**
 * Utilities for normalizing text for search operations
 * Used across job search, business search, and other search features
 */

/**
 * Removes accents from text
 * Example: "café" -> "cafe", "Tunisie" -> "Tunisie"
 */
export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Removes Arabic diacritics (harakat/tashkeel) from text
 * Example: "مَدرَسَة" -> "مدرسة"
 */
export function removeArabicDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '');
}

/**
 * Normalizes text for search by:
 * - Converting to lowercase
 * - Removing Latin accents
 * - Removing Arabic diacritics (harakat)
 * - Trimming whitespace
 */
export function normalizeText(text: string): string {
  return removeArabicDiacritics(removeAccents(text.toLowerCase().trim()));
}

/**
 * Checks if a text contains a search term (accent-insensitive, case-insensitive)
 */
export function textIncludes(text: string, searchTerm: string): boolean {
  return normalizeText(text).includes(normalizeText(searchTerm));
}

/**
 * Checks if a text matches a search term exactly (accent-insensitive, case-insensitive)
 */
export function textEquals(text: string, searchTerm: string): boolean {
  return normalizeText(text) === normalizeText(searchTerm);
}

/**
 * Strips quotes, extra whitespace, and control characters from a search term
 * before sending it to Supabase.
 */
export function cleanSearchTerm(value: string): string {
  return value
    .replace(/["""''`]/g, '')  // remove all quote variants
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim();
}

/**
 * Extracts the French (default) name from a field that may have been polluted
 * with multilingual variants like "Nom | name_ar: ... | name_en: ...".
 * Returns only the part before any language marker.
 */
export function extractFrenchName(value: string | null | undefined): string {
  if (!value) return '';
  // Cut at the first occurrence of a language tag pattern
  const idx = value.search(/\s*[\|,]\s*(name_ar|name_en|name_it|name_ru|nom_ar|nom_en|nom_it|nom_ru)\s*:/i);
  return (idx >= 0 ? value.slice(0, idx) : value).trim();
}

/**
 * Cleans an Arabic field value coming from Airtable that may contain polluted
 * multilingual markers like "كافيه | name_en: Coffee | name_it: Caffè".
 *
 * Rules:
 * - If the value contains a language marker (name_en:, name_it:, name_ru:,
 *   description_en:, etc.) → return everything BEFORE that marker, trimmed.
 * - Otherwise → return the first "word" (content before the first space or |),
 *   which is the pure Arabic term.
 */
export function cleanArabicField(value: string | null | undefined): string {
  if (!value) return '';

  // If the value starts with a language marker like "name_ar: ..." or "description_ar: ...",
  // extract the Arabic content after the marker and before the next marker
  const startsWithMarker = value.match(/^(name_ar|description_ar|nom_ar)\s*:\s*/i);
  if (startsWithMarker) {
    const afterMarker = value.slice(startsWithMarker[0].length);
    // Find the next language marker (with or without | separator)
    const nextMarkerIdx = afterMarker.search(/\s{2,}(name_en|name_it|name_ru|description_en|description_it|description_ru|nom_en|nom_it|nom_ru)\s*:/i);
    const pipeIdx = afterMarker.search(/\s*[\|,]\s*(name_en|name_it|name_ru|description_en|description_it|description_ru)\s*:/i);
    const cutIdx = pipeIdx >= 0 && nextMarkerIdx >= 0 ? Math.min(pipeIdx, nextMarkerIdx)
                 : pipeIdx >= 0 ? pipeIdx
                 : nextMarkerIdx >= 0 ? nextMarkerIdx
                 : -1;
    return (cutIdx >= 0 ? afterMarker.slice(0, cutIdx) : afterMarker).trim();
  }

  // Cut at pipe/comma separator before another language marker
  const markerIdx = value.search(/\s*[\|,]\s*(name_en|name_it|name_ru|nom_en|nom_it|nom_ru|description_en|description_it|description_ru)\s*:/i);
  if (markerIdx >= 0) {
    return value.slice(0, markerIdx).trim();
  }

  // Cut before a next-language marker separated by multiple spaces (no pipe)
  const spaceMarkerIdx = value.search(/\s{2,}(name_en|name_it|name_ru|nom_en|nom_it|nom_ru|description_en|description_it|description_ru)\s*:/i);
  if (spaceMarkerIdx >= 0) {
    return value.slice(0, spaceMarkerIdx).trim();
  }

  // No marker found — take everything up to the first pipe or comma separator
  const separatorIdx = value.search(/\s*[\|,]/);
  return (separatorIdx >= 0 ? value.slice(0, separatorIdx) : value).trim();
}

/**
 * Cleans a category/sous_categories string for use in alt attributes.
 * Removes PostgreSQL array syntax ({...}), quotes, and normalizes separators.
 * Example: {Lycée,"Collège"} → Lycée, Collège
 */
export function cleanAltText(value: string): string {
  return value
    .replace(/^\{|\}$/g, '')   // remove leading { and trailing }
    .replace(/"/g, '')          // remove double quotes
    .replace(/'/g, '')          // remove single quotes
    .replace(/,/g, ', ')        // add space after commas
    .replace(/\s{2,}/g, ' ')    // collapse multiple spaces
    .trim();
}
