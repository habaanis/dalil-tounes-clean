import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabaseClient';

type ProcessingStatus = 'received' | 'in_progress' | 'confirmed' | 'completed' | 'rejected' | 'cancelled';
type OrderAction = 'archive' | 'restore' | 'delete';
type Order = {
  id: string;
  kind: 'quote' | 'order';
  product_title: string;
  quantity: number;
  currency: 'TND';
  unit_price: number | null;
  amount_total: number | null;
  customer_name: string;
  customer_contact: string;
  customer_note: string | null;
  status: ProcessingStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  can_archive: boolean;
  can_restore: boolean;
  can_delete: boolean;
};
type OrdersPage = { orders: Order[]; total: number; hasMore: boolean };
const processingLabels: Record<ProcessingStatus, string> = {
  received: 'Reçue', in_progress: 'En cours', confirmed: 'Confirmée',
  completed: 'Terminée', rejected: 'Refusée', cancelled: 'Annulée',
};
const amount = (value: number | null, currency: string) =>
  value === null ? 'Sur devis' : new Intl.NumberFormat('fr-TN', { style: 'currency', currency, minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
const buttonClass = 'min-h-11 rounded-lg border border-[#c6ad79] bg-[#fbf3e6] px-3 text-xs font-semibold text-[#4e4436] disabled:opacity-50';
const emptyPage: OrdersPage = { orders: [], total: 0, hasMore: false };

export default function BoutiqueCustomerOrders({ entrepriseIds }: { entrepriseIds: string[] }) {
  const [company, setCompany] = useState(entrepriseIds[0] || '');
  const [inbox, setInbox] = useState<OrdersPage>(emptyPage);
  const [archives, setArchives] = useState<OrdersPage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [refresh, setRefresh] = useState(0);
  const activeCompany = entrepriseIds.includes(company) ? company : entrepriseIds[0];
  const call = useCallback(async (payload: Record<string, unknown>) => {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session?.access_token) throw new Error('Votre session a expiré. Reconnectez-vous.');
    const response = await fetch(supabaseUrl + '/functions/v1/dalil-boutique-merchant-orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'apikey': supabaseAnonKey,
        authorization:'Bearer '+session.access_token },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({ error: 'Réponse invalide' }));
    if (!response.ok || data.error) throw new Error(
      response.status === 403 ? 'Vous ne disposez pas des droits pour cet établissement.' :
      response.status === 503 ? 'Le suivi des commandes est temporairement indisponible.' :
      typeof data.error === 'string' ? data.error : 'Une erreur est survenue.'
    );
    return data;
  }, []);
  const readPage = useCallback(async (profileId: string, archived: boolean, offset = 0): Promise<OrdersPage> => {
    const data = await call({ action: 'list', profileId, archived, offset });
    if (!Array.isArray(data.orders) || data.profileId !== profileId || data.archived !== archived) {
      throw new Error('La liste des commandes n’a pas pu être confirmée.');
    }
    return { orders: data.orders, total: data.total, hasMore: data.hasMore === true };
  }, [call]);

  useEffect(() => {
    let live = true;
    setInbox(emptyPage); setArchives(emptyPage); setError('');
    if (!activeCompany) { setLoading(false); return; }
    setLoading(true);
    void Promise.all([readPage(activeCompany, false), readPage(activeCompany, true)])
      .then(([current, archived]) => { if (live) { setInbox(current); setArchives(archived); } })
      .catch(err => { if (live) setError(err instanceof Error ? err.message : 'Lecture indisponible.'); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [activeCompany, refresh, readPage]);

  // Keep the first page fresh. When older pages are open, preserve that reading
  // position and let the professional use Actualiser explicitly.
  useEffect(() => {
    if (!activeCompany || busy || loading || inbox.orders.length > 50 || archives.orders.length > 50) return;
    let live = true;
    let pending = false;
    const check = () => {
      if (document.visibilityState !== 'visible' || pending) return;
      pending = true;
      void Promise.all([readPage(activeCompany, false), readPage(activeCompany, true)])
        .then(([current, archived]) => { if (live) { setInbox(current); setArchives(archived); } })
        .catch(() => { /* Preserve the last confirmed list during a transient outage. */ })
        .finally(() => { pending = false; });
    };
    const timer = window.setInterval(check, 60000);
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { live = false; window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [activeCompany, busy, loading, inbox.orders.length, archives.orders.length, readPage]);

  const loadMore = async (archived: boolean) => {
    if (busy || !activeCompany) return;
    const current = archived ? archives : inbox;
    setBusy(archived ? 'archives-page' : 'inbox-page'); setError('');
    try {
      const page = await readPage(activeCompany, archived, current.orders.length);
      const setter = archived ? setArchives : setInbox;
      setter(previous => ({ ...page, orders: [...previous.orders, ...page.orders.filter(order => !previous.orders.some(item => item.id === order.id))] }));
    } catch (err) { setError(err instanceof Error ? err.message : 'Lecture indisponible.'); }
    finally { setBusy(''); }
  };

  const update = async (order: Order, status: ProcessingStatus) => {
    if (busy || !activeCompany) return;
    const cancellationNotice = status === 'cancelled' && order.kind === 'order'
      ? 'Attention : l’annulation dans Dalil Tounes ne rembourse aucun paiement convenu directement avec le client.\n\n' : '';
    if (!window.confirm(cancellationNotice + 'Changer le statut en « ' + processingLabels[status] + ' » ?')) return;
    setBusy(order.id); setError(''); setNotice('');
    try {
      const data = await call({ action: 'update', profileId: activeCompany, id: order.id, status });
      if (data.order?.id !== order.id || data.order?.status !== status) throw new Error('Confirmation de modification absente.');
      setNotice('Statut enregistré.');
      setRefresh(n => n + 1);
    } catch (err) { setError(err instanceof Error ? err.message : 'Modification indisponible.'); }
    finally { setBusy(''); }
  };

  const manage = async (order: Order, action: OrderAction) => {
    if (busy || !activeCompany) return;
    const deletesActive = action === 'delete' && ['received', 'in_progress'].includes(order.status);
    if (action === 'delete' && !window.confirm(
      (deletesActive
        ? 'Supprimer définitivement cette demande ?\n\nElle sera annulée et retirée de vos listes en une seule action. Le client conservera sa référence avec le statut « Annulée ». '
        : 'Supprimer définitivement cette demande refusée ou annulée ?\n\nElle disparaîtra de vos listes. Le client conservera sa référence et son statut final. ') +
      'Confirmez qu’il s’agit d’un test, d’un doublon ou d’une demande sans transaction ni paiement à conserver. Ses coordonnées seront effacées. Cette action ne rembourse aucun paiement.'
    )) return;
    setBusy(order.id); setError(''); setNotice('');
    try {
      const data = await call({ action, profileId: activeCompany, id: order.id,
        expectedUpdatedAt: order.updated_at, confirmDelete: action === 'delete' });
      if (data.profileId !== activeCompany || data.order?.id !== order.id || data.order?.action !== action ||
        (action === 'archive' && !data.order.archived_at) ||
        (action === 'restore' && data.order.archived_at !== null) ||
        (action === 'delete' && (!data.order.deleted_at || data.order.status !== (deletesActive ? 'cancelled' : order.status)))) {
        throw new Error('Confirmation de modification absente. Actualisez la liste.');
      }
      setNotice(action === 'archive' ? 'Commande archivée. Son historique est conservé.' :
        action === 'restore' ? 'Commande restaurée dans la liste principale.' :
        deletesActive ? 'Demande annulée et supprimée de vos listes.' : 'Demande supprimée de vos listes.');
      setRefresh(n => n + 1);
    } catch (err) { setError(err instanceof Error ? err.message : 'Modification indisponible.'); }
    finally { setBusy(''); }
  };

  const renderOrder = (order: Order) => {
    const closed = ['completed', 'rejected', 'cancelled'].includes(order.status);
    const canConfirm = ['received', 'in_progress'].includes(order.status);
    const canFinish = order.status === 'confirmed';
    const hasActions = order.can_archive || order.can_restore || order.can_delete;
    return <article key={order.id} className="min-w-0 rounded-xl border border-[#dfcfaf] bg-white p-3 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <strong className="block text-[#4e4436]">{order.kind === 'quote' ? 'Devis' : 'Commande'} · {order.product_title}</strong>
          <span className="text-xs text-gray-600">Réf. {order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
        <span className="rounded-full border border-[#dbc397] bg-[#fbf1df] px-2 py-1 text-xs font-semibold text-[#694932]">{processingLabels[order.status] || order.status}</span>
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-[#4e4843]">
        <div><dt className="inline font-semibold">Client : </dt><dd className="inline break-words">{order.customer_name}</dd></div>
        <div><dt className="inline font-semibold">Contact : </dt><dd className="inline break-all">{order.customer_contact}</dd></div>
        <div><dt className="inline font-semibold">Quantité : </dt><dd className="inline">{order.quantity}</dd></div>
        <div><dt className="inline font-semibold">Montant des articles : </dt><dd className="inline font-semibold">{amount(order.amount_total, order.currency)}</dd></div>
        {order.customer_note && <div><dt className="inline font-semibold">Précisions : </dt><dd className="inline whitespace-pre-wrap break-words">{order.customer_note}</dd></div>}
        <div><dt className="inline font-semibold">Règlement : </dt><dd className="inline">À convenir directement avec le client. Dalil Tounes n'encaisse pas.</dd></div>
      </dl>
      {(!closed || hasActions) && <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#ede1c9] pt-3">
        {order.status === 'received' && <button type="button" disabled={Boolean(busy)} onClick={() => void update(order, 'in_progress')} className={buttonClass}>Prendre en charge</button>}
        {canConfirm && <button type="button" disabled={Boolean(busy)} onClick={() => void update(order, 'confirmed')} className={buttonClass}>Confirmer</button>}
        {canFinish && <button type="button" disabled={Boolean(busy)} onClick={() => void update(order, 'completed')} className={buttonClass}>Terminer</button>}
        {['received', 'in_progress'].includes(order.status) && <button type="button" disabled={Boolean(busy)} onClick={() => void update(order, 'rejected')} className={buttonClass}>Refuser</button>}
        {order.status === 'confirmed' && <button type="button" disabled={Boolean(busy)} onClick={() => void update(order, 'cancelled')} className={buttonClass}>Annuler</button>}
        {hasActions && <select aria-label={'Actions pour la demande ' + order.id.slice(0, 8).toUpperCase()}
          value="" disabled={Boolean(busy)} className={buttonClass}
          onChange={event => { const action = event.target.value as OrderAction; if (action) void manage(order, action); }}>
          <option value="" disabled>Actions…</option>
          {order.can_archive && <option value="archive">Archiver</option>}
          {order.can_restore && <option value="restore">Restaurer</option>}
          {order.can_delete && <option value="delete">Supprimer</option>}
        </select>}
        {closed && !order.can_delete && <span className="max-w-xs text-xs text-[#725b3e]">Historique protégé : suppression indisponible.</span>}
      </div>}
      {order.kind === 'order' && !closed && <p className="mt-2 text-xs text-[#725b3e]">Le statut confirme le traitement de la commande, pas la réception du paiement.</p>}
    </article>;
  };

  return <section aria-label="Mes commandes et devis" className="space-y-3">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-serif text-lg font-semibold text-[#4e4436]">Mes commandes et devis</h3>
        <p className="mt-1 text-xs leading-5 text-[#655b51]">Demandes enregistrées sur Dalil Tounes, même sans WhatsApp. Le paiement se règle directement avec le client.</p>
      </div>
      <button type="button" onClick={() => { setNotice(''); setRefresh(n => n + 1); }} disabled={loading || Boolean(busy)} className={buttonClass}>Actualiser</button>
    </div>
    {entrepriseIds.length > 1 && <label className="grid gap-1 text-xs text-[#594d43]">Établissement
      <select disabled={Boolean(busy)} className="min-h-11 rounded-lg border border-[#d9c39b] bg-white p-2 text-sm" value={activeCompany} onChange={event => { setCompany(event.target.value); setNotice(''); }}>
        {entrepriseIds.map(id => <option key={id} value={id}>{id}</option>)}
      </select>
    </label>}
    {error && <div role="alert" className="rounded-lg border border-[#e2c59e] bg-[#fff8eb] p-3 text-sm text-[#754024]">{error}</div>}
    {notice && <p role="status" className="text-sm text-[#37553e]">{notice}</p>}
    {loading ? <p role="status" className="text-sm text-gray-600">Chargement des commandes…</p> : <>
      <p className="text-xs text-[#655b51]">{inbox.total} demande{inbox.total !== 1 ? 's' : ''} dans la liste principale · {archives.total} archivée{archives.total !== 1 ? 's' : ''}</p>
      {inbox.orders.length === 0 && !error ? <p role="status" className="rounded-lg border border-[#e6d8bc] bg-[#fffcf8] p-3 text-sm text-[#62564a]">Aucune demande dans la liste principale.</p> :
        <div className="grid gap-3">{inbox.orders.map(renderOrder)}</div>}
      {inbox.hasMore && <button type="button" disabled={Boolean(busy)} onClick={() => void loadMore(false)} className={buttonClass}>Voir les demandes précédentes</button>}
      <details className="rounded-xl border border-[#dfcfaf] bg-[#fffcf8] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-[#4e4436]">Commandes archivées ({archives.total})</summary>
        <div className="mt-3 grid gap-3">
          {archives.orders.length ? archives.orders.map(renderOrder) : <p className="text-xs text-[#655b51]">Aucune commande archivée.</p>}
          {archives.hasMore && <button type="button" disabled={Boolean(busy)} onClick={() => void loadMore(true)} className={buttonClass}>Voir les archives précédentes</button>}
        </div>
      </details>
    </>}
  </section>;
}
