// HTTP smoke checks for core public navigation. This does not test JS rendering.
const base = new URL(process.env.SMOKE_BASE_URL || 'https://dalil-tounes.com');
const routes = [
  "/",
  "/recherche",
  "/citizens",
  "/citizens/health",
  "/education",
  "/citizens/shops",
  "/citizens/services",
  "/citizens/tourism",
  "/citizens/tourism/guide/villages-patrimoine",
  "/citizens/tourism/guide/nature-randonnees",
  "/citizens/tourism/guide/artisanat-savoir-faire",
  "/citizens/tourism/guide/marches-gastronomie",
  "/citizens/tourism/guide/fetes-evenements",
  "/citizens/tourism/guide/hebergements-experiences",
  "/emplois",
  "/entreprises"
];
const failures = [];
for (const route of routes) {
 const url = new URL(route, base);
 const start = performance.now();
 try {
  const response = await fetch(url, {signal: AbortSignal.timeout(12000), redirect:'follow', headers:{Accept:'text/html'}});
  const body = await response.text();
  const type = response.headers.get('content-type') || '';
  const ok = response.ok && type.includes('text/html') && body.includes('<html') && (body.includes('id="root"') || body.includes("id='root'"));
  const ms = Math.round(performance.now()-start);
  console.log(`${ok?'PASS':'FAIL'} ${response.status} ${ms}ms ${route}`);
  if(!ok) failures.push(`${route}: ${response.status}, ${type}`);
 } catch(error) {console.log(`FAIL ${route}: ${error.message}`);failures.push(`${route}: ${error.message}`);}
}
console.log(`${routes.length-failures.length}/${routes.length} routes OK`);
if(failures.length) process.exitCode=1;
