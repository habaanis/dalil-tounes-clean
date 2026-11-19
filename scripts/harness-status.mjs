// Harness status snapshot. Reads GitHub metadata only; never deploys or merges.
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const tracker = Number(process.env.HARNESS_ISSUE_NUMBER);
if (!repo || !token || !Number.isSafeInteger(tracker) || tracker < 1) throw Error("Missing harness configuration");
const api = "https://api.github.com";
async function request(path, options={}) {
  const r = await fetch(api + path, {
    ...options,
    headers: {Authorization:"Bearer " + token, Accept:"application/vnd.github+json", "X-GitHub-Api-Version":"2022-11-28", ...options.headers}
  });
  if (!r.ok) throw Error(path + " HTTP " + r.status + ": " + (await r.text()).slice(0,250));
  return r.json();
}
const root = "/repos/" + repo;
const [issue, issues, prs, runs, deployments] = await Promise.all([
  request(root + "/issues/" + tracker),
  request(root + "/issues?state=open&per_page=100&sort=updated&direction=desc"),
  request(root + "/pulls?state=open&per_page=100&sort=updated&direction=desc"),
  request(root + "/actions/runs?per_page=10"),
  request(root + "/deployments?per_page=10")
]);
const clean = s => String(s || "").replace(/[\r\n|]/g, " ").slice(0,140);
const link = (x) => "[#" + x.number + " " + clean(x.title).replace(/\[/g,"(").replace(/\]/g,")") + "](" + x.html_url + ")";
const activeIssues = issues.filter(x=>!x.pull_request && x.number !== tracker);
const rows = (xs, max=25) => xs.slice(0,max).map(x=>"- " + link(x)).join("\n") || "- Aucun";
const runRows = runs.workflow_runs.slice(0,8).map(x=>"- " + clean(x.name) + " — " + clean(x.conclusion || x.status) + " — [exécution](" + x.html_url + ")").join("\n") || "- Aucun";
const depRows = deployments.slice(0,8).map(x=>"- " + clean(x.environment || "environnement non renseigné") + " — SHA `" + clean(x.sha).slice(0,12) + "` (statut réel de production non confirmé)").join("\n") || "- Aucun enregistrement GitHub";
const stamp = new Date().toISOString();
const generated = [
"<!-- HARNESS:START -->",
"### Instantané GitHub (mis à jour " + stamp + ")",
"",
"**Issues ouvertes (hors PR / ce tableau) :** " + activeIssues.length + (issues.length===100?" (au moins, pagination requise)":""),
"**PR ouvertes :** " + prs.length + (prs.length===100?" (au moins, pagination requise)":""),
"",
"#### Chantiers / incidents ouverts",
rows(activeIssues),
"",
"#### Modifications en attente de revue",
rows(prs),
"",
"#### Derniers contrôles GitHub Actions",
runRows,
"",
"#### Déploiements enregistrés sur GitHub",
depRows,
"",
"**Attention :** ceci n'est PAS une vérification de l'état réel de Vercel/Cloudflare, de Supabase ou de l'application installée. Une PR fusionnée ou un workflow réussi ne prouve pas un déploiement. Aucun état « en production » n'est déduit automatiquement.",
"<!-- HARNESS:END -->"
].join("\n");
const start = "<!-- HARNESS:START -->";
const end = "<!-- HARNESS:END -->";
let body = issue.body || "";
if (body.includes(start) && body.includes(end)) {
  body = body.slice(0,body.indexOf(start)) + generated + body.slice(body.indexOf(end)+end.length);
} else body = body.trimEnd() + "\n\n" + generated;
await request(root + "/issues/" + tracker, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({body})});
console.log("Harness issue updated: " + repo + "#" + tracker);
