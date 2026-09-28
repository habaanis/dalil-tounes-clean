import { useEffect, useState, type FormEvent } from 'react';
import { supabase, supabaseAnonKey, supabaseUrl } from '../lib/supabaseClient';

type ClientRow = { id: string; name: string; email: string; stage: string; link: string };
type Draft = Record<string, string>;
const fields: { key: string; label: string; multiline?: boolean }[] = [
  { key: 'nom', label: 'Nom de l’établissement' },
  { key: 'categorie', label: 'Activité / catégorie' },
  { key: 'description', label: 'Présentation courte', multiline: true },
  { key: 'nom_ar', label: 'Nom en arabe' },
  { key: 'description_ar', label: 'Présentation en arabe', multiline: true },
  { key: 'a_propos', label: 'À propos', multiline: true },
  { key: 'a_propos_ar', label: 'À propos en arabe', multiline: true },
  { key: 'services', label: 'Services', multiline: true },
  { key: 'services_ar', label: 'Services en arabe', multiline: true },
  { key: 'categorie_ar', label: 'Activité en arabe' },
  { key: 'ville', label: 'Ville' },
  { key: 'ville_ar', label: 'Ville en arabe' },
  { key: 'gouvernorat', label: 'Gouvernorat' },
  { key: 'gouvernorat_ar', label: 'Gouvernorat en arabe' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email professionnel' },
  { key: 'site_web', label: 'Site web (URL)' },
  { key: 'image_url', label: 'Photo principale (URL)' },
  { key: 'logo_url', label: 'Logo (URL)' },
  { key: 'lien_facebook', label: 'Facebook (URL)' },
  { key: 'lien_instagram', label: 'Instagram (URL)' },
];

export default function AdminBusinessPreviews() {
  const [records, setRecords] = useState<ClientRow[]>([]);
  const [selected, setSelected] = useState<ClientRow | null>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [privateRequest, setPrivateRequest] = useState('');
  const [privatePhone, setPrivatePhone] = useState('');

  const call = async (path: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Connectez-vous avec votre compte administrateur.');
    const response = await fetch(`${supabaseUrl}/functions/v1/business-preview${path}`, {
      ...options,
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.access_token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur de connexion');
    return data;
  };

  useEffect(() => {
    call('?admin=list').then(data => setRecords(data.records))
      .catch(error => setStatus(error.message))
      .finally(() => setLoading(false));
  }, []);

  const choose = async (row: ClientRow) => {
    setStatus('');
    setBusy(true);
    try {
      const data = await call(`?record_id=${encodeURIComponent(row.id)}`);
      const item = data.record;
      setSelected({ ...row, stage: item.stage || row.stage });
      setLink(item.link || '');
      setPublishedUrl('');
      setPrivateRequest(item.request || '');
      setPrivatePhone(item.phone || '');
      setDraft(data.preview || {
        nom: item.name, modele_cv: item.model || 'Business',
        palette_cv: item.palette || 'Prestige', formule_commerciale: item.formula || '',
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    setStatus('');
    try {
      const data = await call('', { method: 'POST', body: JSON.stringify({ recordId: selected.id, preview: draft }) });
      setLink(data.link);
      if (!data.warning && selected.stage === 'Demande reçue') setSelected({ ...selected, stage: 'Fiche en préparation' });
      setStatus(data.warning || 'Aperçu enregistré. Le lien est aussi dans le dossier Airtable.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!selected || !window.confirm('Le paiement est vérifié et le client a donné son accord : publier cette fiche ?')) return;
    setBusy(true);
    setStatus('');
    try {
      const data = await call('?admin=publish', {
        method: 'POST', body: JSON.stringify({ recordId: selected.id }),
      });
      setPublishedUrl(data.url);
      setSelected({ ...selected, stage: 'Publié' });
      setStatus(data.warning || 'Fiche publiée. L’email de lancement attend toujours votre validation.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de publication');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Aperçus privés — Dalil Tounes</h1>
      <p className="mt-3 text-slate-600">Choisissez un dossier client, complétez sa présentation puis partagez le lien d’aperçu. La fiche publique se prépare après votre validation du paiement.</p>
      {status && <p role="status" className="my-5 rounded-xl bg-amber-100 p-4">{status}</p>}
      {loading ? <p className="mt-8">Chargement des dossiers…</p> : (
        <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
          <nav aria-label="Dossiers clients" className="max-h-[65vh] space-y-2 overflow-y-auto">
            {records.map(row => <button key={row.id} onClick={() => choose(row)} type="button" className="block w-full rounded-xl border bg-white p-3 text-left hover:border-amber-500">
              <strong className="block">{row.name || 'Sans nom'}</strong>
              <span className="text-xs text-slate-600">{row.stage || 'Demande reçue'}</span>
            </button>)}
            {!records.length && <p>Aucun dossier pour le moment.</p>}
          </nav>
          {selected ? <form onSubmit={save} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-sm font-semibold">Étape du dossier : {selected.stage || 'Demande reçue'}</p>
            <p className="text-sm text-slate-600">La présentation reste privée. Modifier une fiche conserve son lien si celui-ci est enregistré dans Airtable.</p>
            <p className="text-sm text-amber-800">Pour un aperçu en arabe, remplissez aussi les textes en arabe avant d’envoyer le lien.</p>
            <div className="rounded-xl bg-slate-100 p-4 text-sm">
              <strong>Informations reçues du client (internes)</strong>
              <p className="mt-2">Email : {selected.email || '—'} · Téléphone : {privatePhone || '—'}</p>
              {privateRequest && <p className="mt-2 whitespace-pre-line">{privateRequest}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map(({ key, label, multiline }) => <label key={key} className={`block text-sm font-medium ${multiline ? 'md:col-span-2' : ''}`}>
                {label}
                {multiline
                  ? <textarea className="mt-1 w-full rounded-lg border p-3" rows={4} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />
                  : <input className="mt-1 w-full rounded-lg border p-3" value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />}
              </label>)}
              <label className="block text-sm font-medium">Modèle
                <select className="mt-1 w-full rounded-lg border p-3" value={/portfolio/i.test(draft.modele_cv || '') ? 'Portfolio' : 'Business'} onChange={e => setDraft({ ...draft, modele_cv: e.target.value })}>
                  <option value="Business">Modèle Professionnel</option><option value="Portfolio">Modèle Portfolio</option>
                </select>
              </label>
              <label className="block text-sm font-medium">Palette
                <select className="mt-1 w-full rounded-lg border p-3" value={/ivory|ivoire/i.test(draft.palette_cv || '') ? 'Ivory' : /night|nuit|bleu/i.test(draft.palette_cv || '') ? 'Night' : 'Prestige'} onChange={e => setDraft({ ...draft, palette_cv: e.target.value })}>
                  <option value="Prestige">Prestige</option><option value="Ivory">Ivoire</option><option value="Night">Nuit</option>
                </select>
              </label>
            </div>
            <button disabled={busy} className="rounded-xl bg-emerald-900 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Enregistrement…' : 'Enregistrer et obtenir le lien'}</button>
            {link && <div className="break-all rounded-xl border border-emerald-300 bg-emerald-50 p-4"><p className="mb-2 font-semibold">Lien privé du client (valable 30 jours)</p><a className="text-blue-700 underline" href={link} target="_blank" rel="noopener noreferrer">{link}</a><p className="mt-2 text-sm">Le lien suit la langue choisie dans Airtable : ?lang=ar pour l’arabe, ?lang=fr pour le français.</p></div>}
            {['Paiement vérifié', 'Prêt à publier'].includes(selected.stage) && <div className="rounded-xl border border-blue-200 p-4">
              <p className="mb-3 text-sm">Publier après accord du client et paiement vérifié. Une fiche sera créée dans « entreprise » et liée à ce dossier.</p>
              <button type="button" disabled={busy} onClick={publish} className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white disabled:opacity-50">Publier la fiche</button>
            </div>}
            {publishedUrl && <p className="break-all text-sm">Fiche publiée : <a className="text-blue-700 underline" href={publishedUrl} target="_blank" rel="noopener noreferrer">{publishedUrl}</a></p>}
          </form> : <p className="text-slate-600">Sélectionnez un dossier pour préparer sa fiche.</p>}
        </div>
      )}
    </main>
  );
}
