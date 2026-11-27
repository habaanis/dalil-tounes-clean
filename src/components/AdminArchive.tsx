import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type ArchiveSource = 'partner_requests' | 'inscriptions_loisirs' | 'business_needs' | 'registrations';

export function useAdminArchive(source: ArchiveSource) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const pending = useRef(false);
  const generation = useRef(0);

  const reload = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true); setError('');
    try {
      const next = new Set<string>();
      const pageSize = 500;
      for (let offset = 0; ; offset += pageSize) {
        const { data, error: failure } = await supabase.from('dalil_admin_archives')
          .select('record_id').eq('source', source).order('record_id').range(offset, offset + pageSize - 1);
        if (failure) throw failure;
        if (current !== generation.current) return;
        for (const row of data || []) next.add(String(row.record_id));
        if (!data || data.length < pageSize) break;
      }
      if (current === generation.current) { setIds(next); setReady(true); }
    } catch {
      if (current === generation.current) { setReady(false); setError('Archives indisponibles. Aucune fiche n’a été supprimée.'); }
    } finally { if (current === generation.current) setLoading(false); }
  }, [source]);

  useEffect(() => {
    setReady(false); setIds(new Set()); setShowArchived(false);
    void reload();
    return () => { generation.current++; };
  }, [reload]);

  const change = async (id: string, restore: boolean) => {
    if (!ready || loading || pending.current || !id) return;
    if (!window.confirm(restore ? 'Restaurer cette fiche dans la liste active ?' : 'Archiver cette fiche dans votre administration ? Les données et la publication restent inchangées.')) return;
    pending.current = true; setBusy(id); setError('');
    try {
      const result = restore
        ? await supabase.from('dalil_admin_archives').delete().eq('source', source).eq('record_id', id).select('record_id').maybeSingle()
        : await supabase.from('dalil_admin_archives').insert({ source, record_id: id }).select('record_id').maybeSingle();
      if (result.error || result.data?.record_id !== id) throw new Error('archive_not_confirmed');
      setIds(previous => { const next = new Set(previous); if (restore) next.delete(id); else next.add(id); return next; });
    } catch { setError('Action non confirmée. Actualisez les archives puis réessayez.'); }
    finally { pending.current = false; setBusy(null); }
  };

  const isArchived = (id: string) => ready && ids.has(id);
  const matches = (id: string, eligible = true) => showArchived === (eligible && isArchived(id));

  return { ids, showArchived, setShowArchived, isArchived, matches, ready, loading, error, busy, reload, change };
}

export type AdminArchive = ReturnType<typeof useAdminArchive>;

export function ArchiveControls({ archive, onSwitch }: { archive: AdminArchive; onSwitch?: () => void }) {
  const choose = (value: boolean) => { archive.setShowArchived(value); onSwitch?.(); };
  return <div className="my-3 rounded-lg border border-[#dfd6c0] bg-white p-3 text-sm text-[#292725]">
    <div className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!archive.showArchived} disabled={archive.busy !== null} onClick={() => choose(false)} className={'rounded-lg border px-3 py-2 ' + (!archive.showArchived ? 'bg-[#292725] text-white' : '')}>Fiches actives</button>
      <button type="button" aria-pressed={archive.showArchived} disabled={!archive.ready || archive.loading || archive.busy !== null} onClick={() => choose(true)} className={'rounded-lg border px-3 py-2 disabled:opacity-50 ' + (archive.showArchived ? 'bg-[#292725] text-white' : '')}>Archives</button>
      <button type="button" disabled={archive.loading || archive.busy !== null} className="rounded-lg border px-3 py-2 disabled:opacity-50" onClick={() => void archive.reload()}>Actualiser les archives</button>
    </div>
    <p className="mt-2 text-xs text-gray-600">Archivage interne uniquement. Les données, statuts et publications restent inchangés.</p>
    {archive.loading && <p role="status" className="mt-1 text-xs">Vérification des archives…</p>}
    {archive.error && <p role="alert" className="mt-1 text-red-700">{archive.error}</p>}
  </div>;
}

export function ArchiveButton({ archive, id, disabled = false, eligible = true }: { archive: AdminArchive; id: string; disabled?: boolean; eligible?: boolean }) {
  if (!eligible) return null;
  const archived = archive.isArchived(id);
  return <button type="button" disabled={disabled || !archive.ready || archive.loading || archive.busy !== null} onClick={() => void archive.change(id, archived)} className="rounded-lg border border-[#dfd6c0] bg-white px-3 py-2 text-xs font-medium text-[#292725] disabled:opacity-50">{archive.busy === id ? 'Enregistrement…' : archived ? 'Restaurer' : 'Archiver'}</button>;
}
