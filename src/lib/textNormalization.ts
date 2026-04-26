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
