import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { parseImageUrls } from '../lib/imagekitUtils';
import { invalidateShowcaseRecord } from '../lib/showcaseRecordCache';
import { ownerShowcaseMediaCopy } from '../lib/ownerShowcaseMediaI18n';

type Item = { src: string; file?: File; uploaded?: string };
type Rights = { photo_limit: number; photo_count: number; confirmation_required: boolean; base_photo_limit?: number | null };
type Note = { key: keyof typeof ownerShowcaseMediaCopy.fr; count?: number; error?: boolean };
const sameImages = (raw: string, urls: string[]) => JSON.stringify(parseImageUrls(raw)) === JSON.stringify(urls);

function readRights(value: unknown): Rights | null {
  if (!value || typeof value !== 'object') return null;
  const rights = value as Rights;
  return Number.isInteger(rights.photo_limit) && rights.photo_limit >= 0
    && Number.isInteger(rights.photo_count) && rights.photo_count >= 0 ? rights : null;
}

function Picture({ item, alt }: { item: Item; alt: string }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!item.file) { setUrl(item.src); return; }
    const local = URL.createObjectURL(item.file);
    setUrl(local);
    return () => URL.revokeObjectURL(local);
  }, [item]);
  return url ? <img src={url} alt={alt} className="h-20 w-full rounded-lg object-cover" /> : null;
}

export default function OwnerShowcaseMedia({ id, field }: { id: string; field: 'logo_url' | 'image_url' }) {
  const { language } = useLanguage();
  const text = ownerShowcaseMediaCopy[language];
  const [before, setBefore] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [rights, setRights] = useState<Rights | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [refresh, setRefresh] = useState(0);
  const logo = field === 'logo_url';

  useEffect(() => {
    let live = true;
    setBefore(null); setItems([]); setRights(null); setNote(null); setLoading(true);
    async function load() {
      try {
        const [recordResult, rightsResult] = await Promise.all([
          supabase.from('entreprise').select('image_url,logo_url').eq('id', id).single(),
          logo ? Promise.resolve(null) : supabase.rpc('dalil_get_my_showcase_entitlements', { p_id: id }),
        ]);
        if (!live) return;
        if (recordResult.error || !recordResult.data) {
          setNote({ key: 'loadError', error: true });
          return;
        }
        const raw = recordResult.data[field] || '';
        setBefore(raw); setItems(parseImageUrls(raw).map(src => ({ src })));
        if (!logo) {
          const available = !rightsResult?.error && readRights(rightsResult?.data);
          if (available) setRights(available);
          else setNote({ key: 'rightsError', error: true });
        }
      } catch {
        if (live) setNote({ key: 'loadError', error: true });
      } finally {
        if (live) setLoading(false);
      }
    }
    void load();
    return () => { live = false; };
  }, [id, field, logo, refresh]);

  const originalCount = parseImageUrls(before).length;
  const limit = logo ? Math.max(1, originalCount) : rights?.photo_limit ?? originalCount;
  const remaining = Math.max(0, limit - items.length);
  const canAdd = (logo || rights !== null) && remaining > 0;
  const changed = before !== null && !sameImages(before, items.map(item => item.src));

  function select(files: File[], index?: number) {
    if (!files.length || busy) return;
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5242880)) {
      setNote({ key: 'fileError', error: true }); return;
    }
    if (index === undefined && (!canAdd || files.length > remaining)) {
      setNote({ key: 'tooMany', count: remaining, error: true }); return;
    }
    const additions = files.map(file => ({ src: crypto.randomUUID(), file }));
    setItems(old => index === undefined ? [...old, ...additions] : old.map((item, j) => j === index ? additions[0] : item));
    setNote(null);
  }

  async function save() {
    if (before === null || busy || !changed) return;
    setBusy(true); setNote(null);
    let publicationAccepted = false;
    try {
      if (items.length > limit) { setNote({ key: 'tooMany', count: 0, error: true }); return; }
      const urls: string[] = [];
      for (const item of items) {
        if (!item.file) { urls.push(item.src); continue; }
        const bucket = supabase.storage.from('dalil-owner-showcase');
        if (!item.uploaded) {
          const ext = item.file.type === 'image/png' ? 'png' : item.file.type === 'image/webp' ? 'webp' : 'jpg';
          const path = `${id}/${item.src}.${ext}`;
          const { error } = await bucket.upload(path, item.file, { contentType: item.file.type });
          if (error) throw error;
          item.uploaded = bucket.getPublicUrl(path).data.publicUrl;
        }
        urls.push(item.uploaded);
      }
      const { data, error } = await supabase.rpc('dalil_save_my_showcase_images', {
        p_id: id, p_field: field, p_before: before, p_images: urls,
      });
      if (error) throw error;
      if (typeof data !== 'string' || !sameImages(data, urls)) {
        setNote({ key: 'notConfirmed', error: true }); return;
      }
      publicationAccepted = true;
      setBefore(data); setItems(urls.map(src => ({ src })));
      invalidateShowcaseRecord(id);
      // An upload alone is not a publication. Re-read the same source the
      // public Business and Portfolio galleries use before announcing success.
      const { data: persisted, error: readError } = await supabase.from('entreprise')
        .select('image_url,logo_url').eq('id', id).single();
      if (readError || !persisted || !sameImages(persisted[field] || '', urls)) {
        setNote({ key: 'notConfirmed', error: true }); return;
      }
      setBefore(persisted[field] || '');
      if (!logo) {
        const { data: updatedRights, error: rightsError } = await supabase.rpc('dalil_get_my_showcase_entitlements', { p_id: id });
        const available = !rightsError && readRights(updatedRights);
        setRights(available || null);
      }
      setNote({ key: 'saved' });
    } catch (error) {
      const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
      const key: Note['key'] = publicationAccepted ? 'notConfirmed'
        : /limite|photos maximum/i.test(message) ? 'limit'
          : /changé|changed/i.test(message) ? 'changed'
            : /accès refusé|permission|not authorized/i.test(message) ? 'denied'
              : /image non rattachée|image invalide/i.test(message) ? 'invalidImage' : 'saveError';
      setNote({ key, error: true });
    } finally { setBusy(false); }
  }

  return (
    <details className="mt-3 rounded-xl border bg-white p-3" dir={language === 'ar' ? 'rtl' : undefined}>
      <summary className="cursor-pointer text-sm font-semibold">
        {logo ? text.logo : text.photos}
        {!logo && before !== null && <span className="ms-2 text-xs font-normal text-gray-600" aria-live="polite">
          {items.length}/{rights?.photo_limit ?? '—'}
        </span>}
      </summary>
      {loading && <p className="mt-2 text-xs text-gray-600">{text.loading}</p>}
      {before !== null && <fieldset disabled={busy} className="mt-2 grid min-w-0 gap-3 text-sm">
        {!logo && <div className="text-xs text-gray-600">
          <p>{rights?.confirmation_required ? text.unconfirmed : rights ? (remaining > 0 ? text.remaining.replace('{count}', String(remaining)) : text.limit) : text.rightsError}</p>
          {rights?.base_photo_limit != null && originalCount > rights.base_photo_limit && <p>{text.legacy}</p>}
          <p className="mt-1">{text.productPhotos}</p>
        </div>}
        {items.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => <div key={`${item.src}-${index}`} className="min-w-0">
            <Picture item={item} alt={`${text.preview} ${index + 1}`} />
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <label className="relative cursor-pointer rounded px-1 py-2 text-[#154734] focus-within:outline focus-within:outline-2">
                {text.replace}
                <input aria-label={`${text.replace} ${index + 1}`} type="file" accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                  onChange={event => { select(Array.from(event.target.files || []), index); event.target.value = ''; }} />
              </label>
              <button type="button" className="rounded px-1 py-2 text-gray-600" onClick={() => { setItems(old => old.filter((_, j) => j !== index)); setNote(null); }}>
                {text.remove}
              </button>
            </div>
          </div>)}
        </div>}
        {(!logo || !items.length) && <label className={`block text-xs ${!canAdd ? 'text-gray-400' : ''}`}>
          {logo ? text.addLogo : text.addPhotos}
          <input aria-label={logo ? text.addLogo : text.addPhotos} className="mt-1 block w-full text-xs" type="file" multiple={!logo}
            disabled={!canAdd} accept="image/jpeg,image/png,image/webp"
            onChange={event => { select(Array.from(event.target.files || [])); event.target.value = ''; }} />
        </label>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => void save()} disabled={!changed}
            className="rounded-lg bg-[#154734] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
            {busy ? text.saving : text.save}
          </button>
          {changed && <span className="text-xs text-gray-500">{text.unsaved}</span>}
        </div>
      </fieldset>}
      {note && <p role={note.error ? 'alert' : 'status'} className={`mt-2 text-xs ${note.error ? 'text-red-700' : 'text-[#154734]'}`}>
        {text[note.key].replace('{count}', String(note.count ?? 0))}
      </p>}
      {!loading && (before === null || note?.key === 'rightsError' || note?.key === 'notConfirmed' || note?.key === 'changed') &&
        <button type="button" className="mt-2 rounded border px-3 py-2 text-xs" disabled={busy} onClick={() => setRefresh(value => value + 1)}>{text.retry}</button>}
    </details>
  );
}
