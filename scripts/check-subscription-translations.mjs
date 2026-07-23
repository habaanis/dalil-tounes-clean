import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const LANGUAGES = ['fr', 'ar', 'en', 'it', 'ru'];
const SOURCES = [
  ['src/pages/Subscription.tsx', 'subscriptionCopy'],
  ['src/components/SubscriptionRequestForm.tsx', 'COPY'],
];
const ALLOWED_SHARED_PATHS = new Set([
  'artisan',
  'premium',
  'flyers',
  'payThreeTimes',
  'contactEmail',
  'contactWhatsApp',
  'facebook',
  'instagram',
  'whatsapp',
  'platformLabels.facebook',
  'platformLabels.google_business',
  'platformLabels.instagram',
  'platformLabels.whatsapp_business',
]);
const FRENCH_MARKERS = [
  /\bAperçu\b/i,
  /\bPrésence\b/i,
  /\bFermer\b/i,
  /\bAnnuler\b/i,
  /\bContinuer\b/i,
  /\bContacter\b/i,
  /\bAppeler\b/i,
  /\bOuvert\b/i,
  /\bAujourd'hui\b/i,
  /\bhoraires?\b/i,
  /\bdemande\b/i,
  /\babonnement\b/i,
  /\baucun(?:e)?\b/i,
  /\bgratuit(?:e)?\b/i,
  /\bpaiement\b/i,
  /\bVotre\b/i,
  /\bSélectionnez\b/i,
  /\bIndiquez\b/i,
  /\bVeuillez\b/i,
  /\bréessayez\b/i,
];

function readStaticValue(node) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return readStaticValue(node.expression);
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(readStaticValue);
  }
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.filter(ts.isPropertyAssignment).map((property) => {
        const key = property.name.getText().replace(/^['"]|['"]$/g, '');
        return [key, readStaticValue(property.initializer)];
      }),
    );
  }
  throw new Error(`Unsupported translation value: ${node.getText()}`);
}

function readDictionary(relativeFile, variableName) {
  const file = path.resolve(relativeFile);
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let dictionary;

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (declaration.name.getText() === variableName && declaration.initializer) {
        dictionary = readStaticValue(declaration.initializer);
      }
    }
  });

  if (!dictionary) throw new Error(`${variableName} not found in ${relativeFile}`);
  return dictionary;
}

function flatten(value, prefix = '') {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.flatMap((item, index) => Object.entries(flatten(item, `${prefix}[${index}]`))),
    );
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) =>
        Object.entries(flatten(item, prefix ? `${prefix}.${key}` : key))),
    );
  }
  return { [prefix]: value };
}

function shapeOf(value) {
  if (Array.isArray(value)) return ['array', value.length];
  if (value && typeof value === 'object') return ['object', Object.keys(value).sort()];
  return [typeof value];
}

function compareShape(reference, candidate, prefix, issues) {
  if (JSON.stringify(shapeOf(reference)) !== JSON.stringify(shapeOf(candidate))) {
    issues.push(`${prefix}: incompatible structure`);
    return;
  }
  if (Array.isArray(reference)) {
    reference.forEach((item, index) => compareShape(item, candidate[index], `${prefix}[${index}]`, issues));
  } else if (reference && typeof reference === 'object') {
    Object.keys(reference).forEach((key) =>
      compareShape(reference[key], candidate[key], prefix ? `${prefix}.${key}` : key, issues));
  }
}

let hasIssues = false;

for (const [file, variableName] of SOURCES) {
  const dictionary = readDictionary(file, variableName);
  const reference = dictionary.fr;
  const referenceFlat = flatten(reference);
  const report = {};

  for (const language of LANGUAGES) {
    const issues = [];
    const candidate = dictionary[language];
    if (!candidate) {
      issues.push('missing dictionary');
    } else {
      compareShape(reference, candidate, '', issues);
      const candidateFlat = flatten(candidate);
      for (const [key, value] of Object.entries(candidateFlat)) {
        if (typeof value !== 'string' || !value.trim()) {
          issues.push(`${key}: empty or non-text translation`);
          continue;
        }
        if (
          language !== 'fr' &&
          value === referenceFlat[key] &&
          !ALLOWED_SHARED_PATHS.has(key)
        ) {
          issues.push(`${key}: identical to French`);
        }
        if (
          ['en', 'it', 'ru'].includes(language) &&
          FRENCH_MARKERS.some((marker) => marker.test(value))
        ) {
          issues.push(`${key}: possible French residue`);
        }
      }
    }
    report[language] = {
      keys: candidate ? Object.keys(flatten(candidate)).length : 0,
      issues,
    };
    hasIssues ||= issues.length > 0;
  }

  console.log(JSON.stringify({ file, variableName, report }, null, 2));
}

if (hasIssues) process.exitCode = 1;
