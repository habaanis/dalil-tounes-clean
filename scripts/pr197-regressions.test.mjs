import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
async function loadTs(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { buildEssentialRegistrationMessage } = await loadTs('../src/lib/businessRegistrationValidation.ts');
const { default: transport } = await loadTs('../api/preview-company-registration.ts');
test('Opening hours survive the deployed 1,200 character message cap', () => {
  const hours = 'Lun–Ven 09:00–17:30 ; samedi 09:00–12:00';
  const result = buildEssentialRegistrationMessage('D'.repeat(1200), hours, 'Horaires d’ouverture');
  assert.equal(result.length, 1200);
  assert.ok(result.includes(hours));
  assert.equal(result.slice(0,1200), result);
});
test('Arabic hours remain readable and a request without hours retains its message', () => {
  assert.equal(buildEssentialRegistrationMessage('تفاصيل', '09:00–17:30', 'أوقات العمل'), 'أوقات العمل: 09:00–17:30\n\nتفاصيل');
  assert.equal(buildEssentialRegistrationMessage('Message existant', '', 'Horaires'), 'Message existant');
});
test('Preview transport keeps production closed and rejects cross-origin requests', async () => {
  const previousEnv = process.env.VERCEL_ENV;
  const previousFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => { called = true; throw Error('Unexpected forwarding'); };
  const makeResponse = () => ({ statusCode:0, body:null, setHeader(){}, status(code){this.statusCode=code;return this;},json(body){this.body=body;} });
  try {
    process.env.VERCEL_ENV = 'production';
    const production = makeResponse(); await transport({method:'POST',headers:{}},production);
    assert.equal(production.statusCode,404);
    process.env.VERCEL_ENV = 'preview';
    const external = makeResponse(); await transport({method:'POST',headers:{origin:'https://example.org',host:'preview.vercel.app'}},external);
    assert.equal(external.statusCode,403);
    assert.equal(called,false);
  } finally { globalThis.fetch=previousFetch; if(previousEnv===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previousEnv; }
});
test('Preview transport forwards only the supplied public key and keeps upstream validation errors', async () => {
  const previousEnv=process.env.VERCEL_ENV; const previousFetch=globalThis.fetch;
  const response={statusCode:0,body:null,setHeader(){},status(code){this.statusCode=code;return this;},json(body){this.body=body;}};
  try {
    process.env.VERCEL_ENV='preview';
    globalThis.fetch=async (url,init) => {
      assert.equal(url,'https://kmvjegbtroksjqaqliyv.supabase.co/functions/v1/submit-company-registration');
      assert.equal(init.headers.apikey,'public-test-key');
      assert.equal(init.headers.Authorization,'Bearer public-test-key');
      assert.equal(init.headers.Origin,undefined);
      assert.equal(JSON.parse(init.body).mode,'company_registration');
      return Response.json({success:false,code:'validation_error',field:'companyName'},{status:422});
    };
    await transport({method:'POST',headers:{origin:'https://preview.vercel.app',host:'preview.vercel.app','sec-fetch-site':'same-origin','content-type':'application/json',apikey:'public-test-key'},body:{mode:'company_registration'}},response);
    assert.equal(response.statusCode,422);assert.equal(response.body.field,'companyName');
  } finally { globalThis.fetch=previousFetch; if(previousEnv===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previousEnv; }
});
