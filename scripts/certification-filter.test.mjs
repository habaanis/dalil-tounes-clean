import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

// npm install --no-save --package-lock=false react-test-renderer@18.3.1
// Optional isolated test runtime, keeping application dependencies untouched.
const requireRuntime = createRequire(process.env.CERT_TEST_RUNTIME || import.meta.url);
const React = requireRuntime('react');
const { create, act } = requireRuntime('react-test-renderer');
const source = process.env.CERT_SOURCE_REF
  ? execFileSync('git', ['show', `${process.env.CERT_SOURCE_REF}:src/components/SearchBar.tsx`], { encoding: 'utf8' })
  : fs.readFileSync('src/components/SearchBar.tsx', 'utf8');
const page = fs.readFileSync('src/pages/Businesses.tsx', 'utf8');
const compile = code => ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
const urlModule = { exports: {} };
vm.runInNewContext(compile(fs.readFileSync('src/lib/url.ts', 'utf8')), { exports: urlModule.exports, URLSearchParams });
function mount(appliedCertificationFilter) {
  const navigations = [];
  const exports = {};
  const stubs = {
    react: React,
    'react-dom': { createPortal: node => node },
    'react-router-dom': { useNavigate: () => path => navigations.push(path) },
    '../lib/supabaseClient': { supabaseUrl: 'https://example.invalid', supabaseAnonKey: 'fixture' },
    '@supabase/supabase-js': { createClient: () => ({ from() { throw new Error('Unexpected provider call'); } }) },
    '../lib/dbTables': { Tables: {} },
    '../lib/intentDetection': { detectIntent: () => ({}), getCategoryDisplayName: x => x },
    '../config/searchMode': {},
    '../lib/searchSynonyms': { MIN_CHARS: 2 },
    '../lib/geoAliases': {},
    '../lib/url': urlModule.exports,
    '../context/LanguageContext': { useLanguage: () => ({ language: 'fr' }) },
    '../lib/i18n': { t: (_, key) => key, isRTL: () => false },
    '../lib/textNormalization': { normalizeText: x => x },
    '../lib/dedupeByAirtableId': {},
    '../lib/businessCertification': { isCertifiedBusiness: row => row.cv_business_status === 'published' },
    './GoogleRatingSummary': () => null,
    './LocationSelectTunisie': props => React.createElement('select', { value: props.value, onChange: props.onChange }),
  };
  vm.runInNewContext(compile(source), {
    exports, require: id => { assert.ok(id in stubs, id); return stubs[id]; }, URLSearchParams, console,
    window: { addEventListener() {}, removeEventListener() {}, setTimeout: () => 1, clearTimeout() {} },
    document: { body: {} },
  });
  const Component = exports.default;
  const props = { scope: 'global', resultMode: 'filterCards', intentEnabled: false, appliedCertificationFilter };
  let renderer;
  act(() => { renderer = create(React.createElement(Component, props)); });
  return {
    renderer, navigations,
    update(value) { act(() => renderer.update(React.createElement(Component, { ...props, appliedCertificationFilter: value }))); },
    button(key) { return renderer.root.findAllByType('button').find(b => b.props.children === `search.${key}`); },
    selected(key) {
      const buttons = ['certAll', 'certCertified', 'certNonCertified'].map(k => this.button(k));
      assert.equal(buttons.filter(b => b.props.style.color === '#fff').length, 1);
      assert.equal(this.button(key).props.style.color, '#fff', `Visible selection must be ${key}`);
      if (!process.env.CERT_SOURCE_REF) assert.equal(this.button(key).props['aria-pressed'], true);
    },
    submit() { act(() => renderer.root.findByType('form').props.onSubmit({ preventDefault() {} })); return new URL(navigations.at(-1), 'https://fixture.invalid'); },
    close() { act(() => renderer.unmount()); },
  };
}
function hydrate(search) {
  // Execute the real URL-to-filter assignment from Businesses (no duplicate parser).
  const start = page.indexOf('const rawStatutCarte =');
  const end = page.indexOf('\n\n', start);
  assert.ok(start > 0 && end > start);
  let applied = '';
  vm.runInNewContext(compile(page.slice(start, end)), { params: { statut_carte: new URLSearchParams(search).get('statut_carte') }, filterStatutCarte: '', setFilterStatutCarte: x => { applied = x; } });
  return applied;
}
for (const [value, label] of [['certifie', 'certCertified'], ['non_certifie', 'certNonCertified']]) {
  test(`${value}: navigation hydration selects the actual filter and preserves submission`, () => {
    const view = mount('');
    view.update(hydrate(`statut_carte=${value}`));
    view.selected(label);
    assert.equal(view.submit().searchParams.get('statut_carte'), value);
    view.close();
  });
}
test('Certifiés + Mahdia: selection and combined submitted parameters stay intact', () => {
  const view = mount(hydrate('ville=Mahdia&statut_carte=certifie'));
  act(() => view.renderer.root.findByType('select').props.onChange('Mahdia'));
  view.selected('certCertified');
  const params = view.submit().searchParams;
  assert.equal(params.get('ville'), 'Mahdia');
  assert.equal(params.get('statut_carte'), 'certifie');
  view.update('certifie');
  assert.equal(view.renderer.root.findByType('select').props.value, 'Mahdia');
  view.close();
});
test('Reload: fresh mounts restore both URL filters, including Mahdia combination', () => {
  for (const search of ['statut_carte=certifie', 'statut_carte=non_certifie', 'ville=Mahdia&statut_carte=certifie']) {
    const view = mount('');
    view.update(hydrate(search));
    view.selected(search.includes('non_certifie') ? 'certNonCertified' : 'certCertified');
    view.close();
  }
});
test('Reset: applied empty filter selects Tous and removes certification from next submit', () => {
  for (const value of ['certifie', 'non_certifie']) {
    const view = mount(value);
    view.update('');
    view.selected('certAll');
    assert.equal(view.submit().searchParams.has('statut_carte'), false);
    view.close();
  }
});
test('Draft selection remains interactive and is not overwritten by unrelated renders', () => {
  const view = mount('certifie');
  act(() => view.button('certNonCertified').props.onClick());
  view.update('certifie');
  view.selected('certNonCertified');
  assert.equal(view.submit().searchParams.get('statut_carte'), 'non_certifie');
  view.close();
});
test('Other SearchBars without applied filter retain the existing local selection', () => {
  const view = mount(undefined);
  view.selected('certAll');
  act(() => view.button('certCertified').props.onClick());
  view.update(undefined);
  view.selected('certCertified');
  view.close();
});
