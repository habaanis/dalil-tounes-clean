import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const file = new URL('../src/lib/businessPageClassification.ts', import.meta.url);
const source = fs.readFileSync(file, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  reportDiagnostics: true,
});
assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
const sandbox = { exports: {} };
vm.runInNewContext(compiled.outputText, sandbox, { filename: 'businessPageClassification.js' });
const { canonicalPageId, assignedBusinessPages, suggestBusinessPages, missingSuggestedPages, getPlatformSearchScopePage } = sandbox.exports;

assert.equal(canonicalPageId(' accueil '), 'accueil');
assert.equal(canonicalPageId('SANTÉ'), 'santé');
assert.equal(canonicalPageId('loisirs & événements'), 'loisirs & évènements');
assert.equal(canonicalPageId('page inconnue'), null);
assert.deepEqual(Array.from(assignedBusinessPages({
  liste_pages: [' entreprises ', 'tourisme local & expatriation', 'entreprises'],
})), ['entreprises', 'tourisme local & expatriation']);

const realEstate = {
  categorie: ['Immobilier'],
  sous_categories_texte: 'Agence Immobilière, Promoteur Immobilier',
  liste_pages: [' entreprises '],
};
assert.deepEqual(
  Array.from(missingSuggestedPages(realEstate), x => x.page),
  ['tourisme local & expatriation', 'services citoyens']
);
assert.deepEqual(
  Array.from(suggestBusinessPages({
    categorie: ['Mode & Sport'],
    sous_categories_texte: 'Nutrition sportive & compléments',
  }), x => x.page),
  ['commerces & magasins']
);
assert.equal(suggestBusinessPages({
  categorie: ['Immobilier'],
  sous_categories_texte: 'Immeuble en copropriété',
}).length, 0);
assert.equal(suggestBusinessPages({
  categorie: ['Mode & Sport'],
  sous_categories_texte: 'Salle de sport / Fitness',
}).length, 0);
assert.equal(suggestBusinessPages({ categorie: [] }).length, 0);
assert.equal(suggestBusinessPages({ categorie: 'Alimentation' }).length, 0);
assert.deepEqual(Array.from(suggestBusinessPages({
  categorie: ['Maison de retraite'],
  sous_categories_texte: 'Retirement home',
}), x => x.page), ['santé', 'services citoyens']);
assert.deepEqual(Array.from(suggestBusinessPages({
  categorie: ['Casa di riposo'],
  sous_categories_texte: 'Assisted living facility',
}), x => x.page), ['santé', 'services citoyens']);
assert.deepEqual(Array.from(suggestBusinessPages({
  categorie: ['Automobile'],
  sous_categories_texte: 'Garage Mécanique, Pièces de rechange',
}), x => x.page), ['entreprises', 'services citoyens', 'commerces & magasins']);
assert.deepEqual(Array.from(suggestBusinessPages({
  categorie: ['Automobile'],
  sous_categories_texte: 'Location de Voitures',
}), x => x.page), ['entreprises', 'services citoyens', 'tourisme local & expatriation']);
assert.deepEqual(Array.from(suggestBusinessPages({
  categorie: ['Automobile'],
  sous_categories_texte: 'Lavage Auto',
}), x => x.page), ['entreprises', 'services citoyens']);
assert.equal(suggestBusinessPages({
  categorie: ['Automobile'],
  sous_categories_texte: 'Activité inconnue',
}).length, 0);
assert.ok(!suggestBusinessPages(realEstate).some(x => x.page === 'accueil'));
assert.equal(getPlatformSearchScopePage('sante'), 'santé');
assert.equal(getPlatformSearchScopePage('services'), 'services citoyens');
assert.equal(getPlatformSearchScopePage('magasin'), 'commerces & magasins');
assert.equal(getPlatformSearchScopePage('entreprises'), 'entreprises');
assert.equal(getPlatformSearchScopePage('tourisme'), 'tourisme local & expatriation');
assert.equal(getPlatformSearchScopePage('education'), 'éducation');
assert.equal(getPlatformSearchScopePage('loisirs'), 'loisirs & évènements');
assert.equal(getPlatformSearchScopePage('inconnue'), null);
assert.equal(getPlatformSearchScopePage(null), null);
console.log('OK: multipage classification and scoped navigation assertions');
