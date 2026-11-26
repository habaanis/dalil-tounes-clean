import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// Render the real component with React 18 and in-memory authentication responses.
// No Supabase signup, confirmation email or account mutation is performed.
const require = createRequire(import.meta.url);
let reactRequire = require;
try { require.resolve('react-test-renderer'); }
catch { reactRequire = createRequire(path.resolve(process.env.DALIL_QA_RUNTIME || '../qa-runtime', 'package.json')); }
const React = reactRequire('react');
const { act, create } = reactRequire('react-test-renderer');
const bundle = await build({
  entryPoints: ['src/components/auth/SignupForm.tsx'], bundle: true, write: false,
  format: 'cjs', platform: 'node', jsx: 'automatic', external: ['react', 'react/jsx-runtime'],
  plugins: [{ name: 'signup-fixture', setup(builder) {
    builder.onResolve({filter:/\/context\/AuthContext$/},()=>({path:'auth',namespace:'signup-fixture'}));
    builder.onResolve({filter:/\/context\/LanguageContext$/},()=>({path:'language',namespace:'signup-fixture'}));
    builder.onLoad({filter:/.*/,namespace:'signup-fixture'},({path})=>({contents:path==='auth'
      ? `export function useAuth(){return {signUp:async(...args)=>{globalThis.__signupFixture.calls.push(args);return globalThis.__signupFixture.result;}};}`
      : `export function useLanguage(){return {language:globalThis.__signupFixture.language||'fr'};}` }));
  }}],
});
const module = {exports:{}};
new Function('require','module','exports',bundle.outputFiles[0].text)(reactRequire,module,module.exports);
const Component=module.exports.default;
let renderer;
let passed=0;
const content=node=>typeof node==='string'?node:node.children.map(content).join('');
function ok(name,condition){assert.ok(condition,name);console.log('PASS',name);passed++;}
async function fixture({professional=true,language='fr',result}={}){
  if(renderer)await act(async()=>renderer.unmount());
  globalThis.__signupFixture={language,result,calls:[],success:[],login:0};
  await act(async()=>{renderer=create(React.createElement(Component,{
    professionalMode:professional,returnPath:professional?'/example/compte?cv=portfolio':undefined,
    onSuccess:value=>globalThis.__signupFixture.success.push(value),
    onSwitchToLogin:()=>{globalThis.__signupFixture.login++;},
  }));});
}
async function submit(){
  const inputs=renderer.root.findAllByType('input');
  await act(async()=>inputs[0].props.onChange({target:{value:'OWNER@example.invalid'}}));
  await act(async()=>inputs[1].props.onChange({target:{value:'fixture-password-123'}}));
  await act(async()=>inputs[2].props.onChange({target:{value:'fixture-password-123'}}));
  await act(async()=>renderer.root.findByType('form').props.onSubmit({preventDefault(){}}));
}
const status=()=>renderer.root.findAllByProps({role:'status'});
const submitButton=()=>renderer.root.findByProps({type:'submit'});
try {
  await fixture({result:{user:{id:'fixture'},session:null,error:null}});
  await submit();
  ok('Unconfirmed signup explicitly requests email confirmation',content(status()[0]).includes('Vérifiez votre email'));
  ok('Unconfirmed signup never calls authenticated success',globalThis.__signupFixture.success.length===0);
  ok('Professional signup defaults to company and retains account destination',globalThis.__signupFixture.calls[0][2]==='company'&&globalThis.__signupFixture.calls[0][3]==='/example/compte?cv=portfolio');
  ok('Professional signup hides candidate and recruitment choices',!content(renderer.root).includes('Je cherche un emploi')&&!content(renderer.root).includes('Je recrute'));
  ok('Signup email is normalized',globalThis.__signupFixture.calls[0][0]==='owner@example.invalid');
  ok('Pending confirmation has no permanent loading spinner',submitButton().findAllByType('span').length===0);
  await act(async()=>renderer.root.findAllByType('button').find(button=>content(button)==='Se connecter').props.onClick());
  ok('Pending users can return to sign-in',globalThis.__signupFixture.login===1);

  await fixture({result:{user:{id:'fixture'},session:{access_token:'fixture-only'},error:null}});
  await submit();
  ok('Authenticated signup invokes the supplied callback exactly once',globalThis.__signupFixture.success.length===1&&globalThis.__signupFixture.success[0]==='company');

  await fixture({result:{user:null,session:null,error:new Error('Fixture server failure')}});
  await submit();
  ok('Server failure is shown without false account success',content(renderer.root).includes('Fixture server failure')&&status().length===0&&globalThis.__signupFixture.success.length===0);
  ok('Failed signup remains retryable',submitButton().props.disabled===false);

  await fixture({professional:false,result:{user:{id:'fixture'},session:null,error:null}});
  await submit();
  ok('Existing candidate signup keeps its destination',globalThis.__signupFixture.calls[0][2]==='candidate'&&globalThis.__signupFixture.calls[0][3]==='/dashboard/candidat');
  ok('Candidate confirmation does not promise professional ownership',!content(status()[0]).includes('paiement'));
  for(const [language,title] of [['ar','تحقق من بريدك الإلكتروني'],['en','Check your email'],['it','Controlla la tua email'],['ru','Проверьте электронную почту']]){
    await fixture({language,result:{user:{id:'fixture'},session:null,error:null}});
    await submit();
    ok(`Confirmation is translated in ${language}`,content(status()[0]).includes(title));
  }
  console.log(`PASS ${passed} isolated signup component checks; no messages sent`);
} finally {
  if(renderer)await act(async()=>renderer.unmount());
  delete globalThis.__signupFixture;
}
