import {
  generateSlug,
  extractIdFromSlugUrl,
  extractShortIdFromSlug,
  isValidSlug,
  buildEntrepriseUrl,
} from './slugify';

function test(description: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`PASS: ${description}`);
    } else {
      console.error(`FAIL: ${description}`);
    }
  } catch (error) {
    console.error(`ERROR: ${description}`, error);
  }
}

console.group('Tests generateSlug()');

test('Supprime les accents', () => generateSlug('Cafe Elegant') === 'cafe-elegant');
test('Caracteres speciaux', () => generateSlug('Garage & Auto') === 'garage-auto');
test('Apostrophes', () => generateSlug("Cabinet d'Avocat") === 'cabinet-davocat');
test('Slashs', () => generateSlug('Garage 24/7') === 'garage-24-7');
test('Tirets multiples', () => generateSlug('Garage --- Auto') === 'garage-auto');
test('Minuscules', () => generateSlug('GARAGE AUTO') === 'garage-auto');

console.groupEnd();

console.group('Tests buildEntrepriseUrl()');

test('With slug and ville', () => {
  const url = buildEntrepriseUrl({ slug: 'golf-citrus', ville: 'Hammamet' });
  return url === '/entreprise/hammamet/golf-citrus';
});

test('With slug, no ville', () => {
  const url = buildEntrepriseUrl({ slug: 'golf-citrus' });
  return url === '/p/golf-citrus';
});

test('Fallback to nom when no slug', () => {
  const url = buildEntrepriseUrl({ nom: 'Golf Citrus', ville: 'Hammamet' });
  return url === '/entreprise/hammamet/golf-citrus';
});

test('No slug, no nom returns /', () => {
  const url = buildEntrepriseUrl({});
  return url === '/';
});

console.groupEnd();

console.group('Tests extractShortIdFromSlug()');

test('Extracts 8-char hex from end', () => extractShortIdFromSlug('golf-citrus-e27b5dd7') === 'e27b5dd7');
test('Returns null for clean slug', () => extractShortIdFromSlug('golf-citrus') === null);

console.groupEnd();

console.group('Tests isValidSlug()');

test('Valid slug', () => isValidSlug('garage-auto'));
test('Rejects spaces', () => !isValidSlug('garage auto'));
test('Rejects double hyphens', () => !isValidSlug('garage--auto'));
test('Rejects uppercase', () => !isValidSlug('Garage-Auto'));

console.groupEnd();

export { test };
