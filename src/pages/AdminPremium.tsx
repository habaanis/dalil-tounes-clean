import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { buildClientAppUrl } from '../lib/clientAppUrl';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { invalidateShowcaseRecord } from '../lib/showcaseRecordCache';
import {
  hasRetryableRegistrationIntegration, isRegistration, isRegistrationList, registrationTotal,
  reviewDossier, safeMiniappUrl, sameReviewedDossier,
  type CreationDossier, type IntegrationState, type Registration, type RegistrationBusiness,
  type RegistrationPlan, type RegistrationStatus,
} from '../lib/adminRegistration';
import { adminRegistrationCopy, type AdminRegistrationCopy } from '../lib/adminRegistrationI18n';

const control = 'mt-1 w-full rounded-lg border border-[#d9d6c8] bg-white px-3 py-2 text-sm disabled:bg-gray-100';
const primary = 'rounded-lg bg-[#07543F] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50';
const secondary = 'rounded-lg border border-[#d8c8a5] bg-white px-3 py-2 text-sm disabled:opacity-50';
const socialKeys = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'other'] as const;
const networkNames = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', whatsapp: 'WhatsApp' };
const integrationStates: IntegrationState[] = ['pending', 'running', 'ok', 'failed', 'unknown'];

function errorText(error: unknown, copy: AdminRegistrationCopy) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  if (code === '42501') return copy.denied;
  if (code === '40001') return copy.changed;
  if (code === '22023') return copy.invalid;
  return copy.saveError;
}

function webAddress(value: string): boolean {
  if (!value) return true;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}

function Field({ label, name, value, onChange, required = false, multiline = false, type = 'text' }: {
  label: string; name: string; value: string; onChange: (value: string) => void;
  required?: boolean; multiline?: boolean; type?: string;
}) {
  return <label className="block text-sm text-[#3d493e]">
    {label}{required && <span aria-hidden="true"> *</span>}
    {multiline
      ? <textarea name={name} value={value} onChange={event => onChange(event.target.value)} required={required} rows={3} className={control} />
      : <input name={name} type={type} value={value} onChange={event => onChange(event.target.value)} required={required} className={control} />}
  </label>;
}

interface DossierProps {
  row: Registration;
  businesses: RegistrationBusiness[];
  copy: AdminRegistrationCopy;
  onSaved: (row: Registration, message: string) => void;
  onBusy: (busy: boolean) => void;
  onReload: () => Promise<boolean>;
}

function RegistrationDossier({ row, businesses, copy: c, onSaved, onBusy, onReload }: DossierProps) {
  const [dossier, setDossier] = useState(() => reviewDossier(row));
  const [ownerEmail, setOwnerEmail] = useState(row.owner_email || row.email || '');
  const [businessId, setBusinessId] = useState(row.company_created ? '' : row.entreprise_id || '');
  const [editing, setEditing] = useState(row.status === 'received');
  const [reviewed, setReviewed] = useState(false);
  const [plan, setPlan] = useState<RegistrationPlan>(row.confirmed_plan || row.requested_plan);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [receivedAt, setReceivedAt] = useState('');
  const [transferChecked, setTransferChecked] = useState(false);
  const [publishChecked, setPublishChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [integrationMessage, setIntegrationMessage] = useState('');
  const pending = useRef(false);
  const persistedDossier = row.reviewed_dossier || row.creation_dossier;
  const needsAssets = !row.assets_ready;
  const expectedAmount = registrationTotal(plan, persistedDossier);
  const linkedBusiness = businesses.find(b => b.id === row.entreprise_id && b.approved);
  const publicUrl = safeMiniappUrl(row.public_url) || (linkedBusiness ? buildClientAppUrl(linkedBusiness) : null);
  const accountUrl = safeMiniappUrl(row.account_url);
  const baseArgs = { p_request_id: row.id, p_expected_version: row.version };

  const updateDossier = <K extends keyof CreationDossier>(key: K, value: CreationDossier[K]) => {
    setDossier(previous => ({ ...previous, [key]: value }));
    setReviewed(false);
  };

  const persist = async (rpc: string, args: Record<string, unknown>, verify: (next: Registration) => boolean, message: string) => {
    if (pending.current) return;
    pending.current = true; setBusy(true); onBusy(true); setError('');
    try {
      const { data, error: failure } = await supabase.rpc(rpc, args);
      if (failure) throw failure;
      if (!isRegistration(data) || data.id !== row.id || data.version < row.version || !verify(data)) {
        setError(c.saveError); return;
      }
      if (data.entreprise_id) invalidateShowcaseRecord(data.entreprise_id);
      onSaved(data, message);
    } catch (failure) { setError(errorText(failure, c)); }
    finally { pending.current = false; setBusy(false); onBusy(false); }
  };

  const prepare = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !reviewed || !['received', 'draft'].includes(row.status)) return;
    const email = ownerEmail.trim().toLowerCase();
    const next = {
      ...dossier, email,
      companyName: dossier.companyName.trim(), city: dossier.city.trim(), sector: dossier.sector.trim(), phone: dossier.phone.trim(),
      activityDescription: dossier.activityDescription.trim(), logoUrl: dossier.logoUrl.trim(),
      photoUrls: dossier.photoUrls.map(value => value.trim()).filter(Boolean),
      socialLinks: Object.fromEntries(Object.entries(dossier.socialLinks).map(([key, value]) => [key, value.trim()])) as CreationDossier['socialLinks'],
    };
    const urls = [next.logoUrl, next.googleMapsUrl, next.googleReviewsUrl, ...next.photoUrls,
      ...Object.entries(next.socialLinks).filter(([key]) => key !== 'whatsapp').map(([, value]) => value)];
    if (!next.companyName || !next.city || !next.sector || !next.phone || !next.activityDescription
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || next.activityDescription.length > 10000
      || next.photoUrls.length > (row.requested_plan === 'artisan' ? 5 : 10)
      || socialKeys.filter(key => next.socialLinks[key]).length > (row.requested_plan === 'artisan' ? 2 : 6)
      || urls.some(value => !webAddress(value))) { setError(c.invalid); return; }
    await persist('dalil_admin_registration_prepare', {
      ...baseArgs, p_business_id: businessId || null, p_owner_email: email, p_dossier: next,
    }, saved => saved.status === 'draft' && Boolean(saved.entreprise_id)
      && (!businessId || saved.entreprise_id === businessId) && saved.owner_email === email
      && sameReviewedDossier(saved.reviewed_dossier, next), c.draftSaved);
  };

  const confirmPayment = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !transferChecked || row.status !== 'draft') return;
    const date = new Date(receivedAt);
    if (!reference.trim() || !receivedAt || !Number.isFinite(date.getTime()) || Number(amount) !== expectedAmount) {
      setError(c.paymentInvalid); return;
    }
    const timestamp = date.toISOString();
    await persist('dalil_admin_registration_confirm_payment', {
      ...baseArgs, p_plan: plan, p_amount: Number(amount), p_reference: reference.trim(), p_received_at: timestamp,
    }, saved => saved.status === 'paid' && saved.entreprise_id === row.entreprise_id
      && saved.confirmed_plan === plan && saved.payment_amount === expectedAmount
      && saved.payment_reference === reference.trim() && Boolean(saved.payment_confirmed_at)
      && new Date(saved.payment_received_at || '').getTime() === date.getTime(), c.paymentSaved);
  };

  const finishAssets = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || row.status !== 'paid' || !needsAssets) return;
    const logo = dossier.logoUrl.trim();
    if (!logo || !webAddress(logo)) { setError(c.invalid); return; }
    await persist('dalil_admin_registration_finish_assets', { ...baseArgs, p_logo_url: logo },
      saved => saved.status === 'paid' && saved.entreprise_id === row.entreprise_id && saved.assets_ready
        && saved.reviewed_dossier?.logoUrl === logo, c.assetsSaved);
  };

  const publish = async () => {
    if (busy || row.status !== 'paid' || !publishChecked || needsAssets) return;
    await persist('dalil_admin_registration_publish', baseArgs,
      saved => ['published', 'active'].includes(saved.status) && saved.entreprise_id === row.entreprise_id
        && saved.assets_ready && Boolean(saved.published_at) && Boolean(safeMiniappUrl(saved.public_url)), c.publishedSaved);
  };

  const linkAccount = async () => {
    if (busy || row.status !== 'published' || row.account_status !== 'ready') return;
    await persist('dalil_admin_registration_link_account', baseArgs,
      saved => saved.status === 'active' && saved.account_status === 'linked'
        && saved.entreprise_id === row.entreprise_id && Boolean(saved.owner_linked_at), c.accountSaved);
  };

  const retryIntegrations = async () => {
    if (pending.current || !hasRetryableRegistrationIntegration(row) || !window.confirm(c.retryConfirm)) return;
    pending.current = true; setBusy(true); onBusy(true); setError(''); setIntegrationMessage('');
    try {
      const { data, error: failure } = await supabase.functions.invoke('retry-company-registration-integrations', { body: { id: row.id } });
      if (failure) throw failure;
      if (data?.success !== true || data.id !== row.id || !data.integration_status || !(await onReload())) {
        setError(c.saveError); return;
      }
      setIntegrationMessage(c.integrationsSaved);
    } catch (failure) { setError(errorText(failure, c)); }
    finally { pending.current = false; setBusy(false); onBusy(false); }
  };

  return <div className="border-t border-[#e3ddcc] p-4 sm:p-5">
    <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      <span>{row.email || '—'}</span><span>{row.phone || '—'}</span>
      {row.company_name && <span>{c.business}: {row.company_name}</span>}
    </div>
    {row.legacy && <p className="mb-3 text-sm text-amber-900">{c.legacy}</p>}
    <details className="mb-4 text-sm"><summary className="cursor-pointer text-[#07543F]">{c.source}</summary>
      <p className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f8f6ef] p-3" dir="auto">{row.source_message || '—'}</p>
    </details>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

    {editing && ['received', 'draft'].includes(row.status) ? <form onSubmit={event => void prepare(event)}>
      <fieldset disabled={busy} className="space-y-4">
        {row.status === 'received' && <label className="block text-sm">{c.business}
          <select name="business_id" value={businessId} onChange={event => { setBusinessId(event.target.value); setReviewed(false); }} className={control}>
            <option value="">{c.newBusiness}</option>
            {businesses.map(business => <option key={business.id} value={business.id}>{business.name} — {business.city || '—'}{business.plan ? ` · ${business.plan}` : ''}</option>)}
          </select>
        </label>}
        <p className="text-xs text-gray-600">{businessId ? c.preserve : c.privateDraft}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="companyName" label={c.companyName} value={dossier.companyName} onChange={value => updateDossier('companyName', value)} required />
          <Field name="managerName" label={c.manager} value={dossier.managerName} onChange={value => updateDossier('managerName', value)} />
          <Field name="sector" label={c.sector} value={dossier.sector} onChange={value => updateDossier('sector', value)} required />
          <Field name="governorate" label={c.governorate} value={dossier.governorate} onChange={value => updateDossier('governorate', value)} />
          <Field name="city" label={c.city} value={dossier.city} onChange={value => updateDossier('city', value)} required />
          <Field name="phone" label={c.phone} value={dossier.phone} onChange={value => updateDossier('phone', value)} type="tel" required />
        </div>
        <Field name="owner_email" label={c.ownerEmail} value={ownerEmail} onChange={value => { setOwnerEmail(value); setReviewed(false); }} type="email" required />
        <p className="-mt-2 text-xs text-gray-600">{c.ownerEmailHelp}</p>
        <Field name="activityDescription" label={c.description} value={dossier.activityDescription} onChange={value => updateDossier('activityDescription', value)} multiline required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="address" label={c.address} value={dossier.address} onChange={value => updateDossier('address', value)} />
          <Field name="openingHours" label={c.hours} value={dossier.openingHours} onChange={value => updateDossier('openingHours', value)} />
          <Field name="googleMapsUrl" label={c.maps} value={dossier.googleMapsUrl} onChange={value => updateDossier('googleMapsUrl', value)} type="url" />
          <Field name="googleReviewsUrl" label={c.reviews} value={dossier.googleReviewsUrl} onChange={value => updateDossier('googleReviewsUrl', value)} type="url" />
        </div>
        <details className="rounded-lg border border-[#e2ddcf] p-3"><summary className="cursor-pointer text-sm font-semibold">{c.media}</summary>
          <div className="mt-3 space-y-3">
            <label className="block text-sm">{c.logoChoice}<select name="logoChoice" value={dossier.logoChoice} onChange={event => updateDossier('logoChoice', event.target.value as CreationDossier['logoChoice'])} className={control}>
              <option value="none">{c.logoNone}</option><option value="existing">{c.logoExisting}</option><option value="create">{c.logoCreate}</option>
            </select></label>
            <Field name="logoUrl" label={c.logoUrl} value={dossier.logoUrl} onChange={value => updateDossier('logoUrl', value)} type="url" />
            <Field name="photoUrls" label={`${c.photos} (${dossier.photoUrls.filter(Boolean).length}/${row.requested_plan === 'artisan' ? 5 : 10})`} value={dossier.photoUrls.join('\n')} onChange={value => updateDossier('photoUrls', value.split(/\r?\n/))} multiline />
            <p className="text-xs text-gray-600">{c.photosHelp}</p>
          </div>
        </details>
        <details className="rounded-lg border border-[#e2ddcf] p-3"><summary className="cursor-pointer text-sm font-semibold">{c.networks} ({socialKeys.filter(key => dossier.socialLinks[key]).length}/{row.requested_plan === 'artisan' ? 2 : 6})</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">{Object.entries(dossier.socialLinks).map(([key, value]) => <Field key={key} name={`social_${key}`}
            label={key in networkNames ? networkNames[key as keyof typeof networkNames] : key === 'website' ? c.website : key === 'googleBusiness' ? c.googleBusiness : c.other}
            value={value} type={key === 'whatsapp' ? 'tel' : 'url'} onChange={next => updateDossier('socialLinks', { ...dossier.socialLinks, [key]: next })} />)}</div>
        </details>
        <fieldset className="rounded-lg border border-[#dfd4b9] p-3"><legend className="px-1 text-sm font-semibold">{c.presentation}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">{c.model}<select name="presentationModel" value={dossier.presentationModel || ''} onChange={event => updateDossier('presentationModel', event.target.value as CreationDossier['presentationModel'])} className={control}>
              <option value="business">{c.businessModel}</option><option value="portfolio">{c.portfolioModel}</option>
            </select></label>
            <label className="text-sm">{c.palette}<select name="palette" value={dossier.palette || ''} onChange={event => updateDossier('palette', event.target.value as CreationDossier['palette'])} className={control}>
              <option value="prestige">{c.prestige}</option><option value="ivory">{c.ivory}</option><option value="night">{c.night}</option>
            </select></label>
            <label className="text-sm">{c.opening}<select name="openingStyle" value={dossier.openingStyle || ''} onChange={event => updateDossier('openingStyle', event.target.value as CreationDossier['openingStyle'])} className={control}>
              <option value="photo">{c.photo}</option><option value="framed">{c.framed}</option>
            </select></label>
          </div>
          {row.requested_plan === 'premium' && <p className="mt-2 text-xs text-gray-600">{c.premiumChoices}</p>}
        </fieldset>
        <details className="rounded-lg border border-[#e2ddcf] p-3"><summary className="cursor-pointer text-sm font-semibold">{c.products}</summary><div className="mt-3 space-y-3">
          <Field name="productsDescription" label={c.products} value={dossier.productsDescription} onChange={value => updateDossier('productsDescription', value)} multiline />
          <Field name="notes" label={c.notes} value={dossier.notes} onChange={value => updateDossier('notes', value)} multiline />
        </div></details>
        <label className="flex items-start gap-2 text-sm"><input name="reviewed" type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} className="mt-1 accent-[#07543F]" />{c.reviewed}</label>
        <div className="flex flex-wrap gap-2"><button type="submit" disabled={busy || !reviewed} className={primary}>{busy ? c.working : row.status === 'received' ? c.prepare : c.saveDraft}</button>
          {row.status === 'draft' && <button type="button" disabled={busy} onClick={() => { setEditing(false); setDossier(reviewDossier(row)); setOwnerEmail(row.owner_email || row.email || ''); setReviewed(false); setError(''); }} className={secondary}>{c.cancel}</button>}
        </div>
      </fieldset>
    </form> : <div className="space-y-4">
      {row.owner_email && <p className="text-sm"><strong>{c.ownerEmail} :</strong> {row.owner_email}</p>}
      {row.status === 'draft' && <>
        <button type="button" disabled={busy} onClick={() => { setEditing(true); setError(''); }} className={secondary}>{c.revise}</button>
        <form onSubmit={event => void confirmPayment(event)}><fieldset disabled={busy} className="space-y-3 rounded-lg border border-[#e0d5bb] p-4">
          <legend className="px-1 font-semibold">{c.confirmPayment}</legend>
          <label className="block text-sm">{c.plan}<select name="plan" value={plan} onChange={event => { setPlan(event.target.value as RegistrationPlan); setTransferChecked(false); }} className={control}>
            <option value="artisan">{c.artisan}</option><option value="premium">{c.premium}</option>
          </select></label>
          <p className="text-sm font-semibold">{c.expectedAmount.replace('{amount}', String(expectedAmount))}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="amount" label={c.amount} value={amount} onChange={value => { setAmount(value); setTransferChecked(false); }} type="number" required />
            <Field name="reference" label={c.reference} value={reference} onChange={value => { setReference(value); setTransferChecked(false); }} required />
          </div>
          <Field name="received_at" label={c.receivedAt} value={receivedAt} onChange={value => { setReceivedAt(value); setTransferChecked(false); }} type="datetime-local" required />
          <label className="flex items-start gap-2 text-sm"><input name="transfer_checked" type="checkbox" checked={transferChecked} onChange={event => setTransferChecked(event.target.checked)} className="mt-1 accent-[#07543F]" />{c.transferChecked}</label>
          <button type="submit" disabled={busy || !transferChecked || Number(amount) !== expectedAmount || !reference.trim() || !receivedAt} className={primary}>{busy ? c.working : c.confirmPayment}</button>
        </fieldset></form>
      </>}
      {row.payment_confirmed_at && <div className="rounded-lg bg-[#f4f6ef] p-3 text-sm">
        <p><strong>{c.paid} :</strong> {row.payment_amount} TND · {row.payment_reference}</p>
        <p className="mt-1 text-xs text-gray-600">{c.paymentImmutable}</p>
      </div>}
      {row.status === 'paid' && (needsAssets ? <form onSubmit={event => void finishAssets(event)}>
        <fieldset disabled={busy} className="space-y-3"><p className="text-sm">{c.logoNeeded}</p>
          <Field name="delivered_logo" label={c.logoUrl} value={dossier.logoUrl} onChange={value => updateDossier('logoUrl', value)} type="url" required />
          <button type="submit" disabled={busy || !dossier.logoUrl.trim()} className={primary}>{busy ? c.working : c.finishAssets}</button>
        </fieldset>
      </form> : <div className="space-y-3">
        <label className="flex items-start gap-2 text-sm"><input name="publish_checked" type="checkbox" checked={publishChecked} disabled={busy} onChange={event => setPublishChecked(event.target.checked)} className="mt-1 accent-[#07543F]" />{c.publishChecked}</label>
        <button type="button" disabled={busy || !publishChecked} onClick={() => void publish()} className={primary}>{busy ? c.working : c.publish}</button>
      </div>)}
      {['published', 'active'].includes(row.status) && <div className="space-y-3">
        <p className={`text-sm ${row.account_status === 'conflict' ? 'text-red-800' : 'text-gray-700'}`} role={row.account_status === 'conflict' ? 'alert' : undefined}>{c[row.account_status]}</p>
        {row.status === 'published' && row.account_status === 'ready' && <button type="button" disabled={busy} onClick={() => void linkAccount()} className={primary}>{busy ? c.working : c.linkAccount}</button>}
        <div className="flex flex-wrap gap-4 text-sm">
          {publicUrl && <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-[#07543F] underline">{c.publicLink}</a>}
          {accountUrl && <a href={accountUrl} target="_blank" rel="noopener noreferrer" className="break-all text-[#07543F] underline">{c.accountLink}</a>}
        </div>
        {accountUrl && ['missing', 'unverified'].includes(row.account_status) && <p className="text-xs text-gray-600">{c.accountInstructions}<br /><span className="break-all">{accountUrl}</span></p>}
      </div>}
    </div>}

    <details className="mt-5 border-t border-[#e3ddcc] pt-3 text-sm"><summary className="cursor-pointer text-gray-700">{c.integrations}</summary>
      <div className="mt-3 flex flex-wrap gap-3">{(['airtable', 'notification'] as const).map(key => {
        const rawStatus = row.integration_status[key]?.status;
        const status = rawStatus && integrationStates.includes(rawStatus) ? rawStatus : 'unknown';
        return <span key={key}>{key === 'airtable' ? 'Airtable' : c.notification} : <strong>{c[status]}</strong></span>;
      })}</div>
      {(['airtable', 'notification'] as const).some(key => !row.integration_status[key] || row.integration_status[key]?.status === 'unknown') && <p className="mt-2 text-xs text-gray-600">{c.integrationUnknown}</p>}
      {hasRetryableRegistrationIntegration(row) && <><p className="mt-2 text-xs text-gray-600">{c.retryNotice}</p>
        <button type="button" disabled={busy} onClick={() => void retryIntegrations()} className={`${secondary} mt-2`}>{c.retryIntegrations}</button></>}
      {integrationMessage && <p role="status" className="mt-2 text-sm">{integrationMessage}</p>}
    </details>
  </div>;
}

export default function AdminPremium() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const c = adminRegistrationCopy[language] || adminRegistrationCopy.fr;
  const userId = user?.id || null;
  const currentUser = useRef(userId); currentUser.current = userId;
  const [authorizedUser, setAuthorizedUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState<Registration[]>([]);
  const [businesses, setBusinesses] = useState<RegistrationBusiness[]>([]);
  const [search, setSearch] = useState('');
  const appliedSearch = useRef('');
  const [filter, setFilter] = useState<RegistrationStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const loadSequence = useRef(0);
  const authorized = Boolean(userId && authorizedUser === userId);

  useEffect(() => {
    let live = true;
    setAuthorizedUser(null); setRows([]); setBusinesses([]); setSelectedId(null); setFeedback(''); setError(''); setBusy(false);
    if (authLoading) { setChecking(true); return () => { live = false; }; }
    if (!userId) { setChecking(false); return () => { live = false; }; }
    setChecking(true);
    void (async () => {
      try {
        const { data, error: failure } = await supabase.rpc('dalil_registration_is_admin');
        if (live && !failure && data === true) setAuthorizedUser(userId);
      } catch { /* Access stays closed when the server cannot verify it. */ }
      finally { if (live) setChecking(false); }
    })();
    return () => { live = false; };
  }, [authLoading, userId]);

  const load = useCallback(async (query = appliedSearch.current): Promise<boolean> => {
    if (!authorized || !userId) return false;
    const sequence = ++loadSequence.current;
    setLoading(true); setError('');
    try {
      const { data, error: failure } = await supabase.rpc('dalil_admin_registration_list', { p_search: query.trim(), p_limit: 100 });
      if (sequence !== loadSequence.current || currentUser.current !== userId) return false;
      if (failure || !isRegistrationList(data)) { setRows([]); setBusinesses([]); setError(c.loadError); return false; }
      setRows(data.dossiers); setBusinesses(data.businesses); appliedSearch.current = query.trim();
      return true;
    } catch {
      if (sequence === loadSequence.current && currentUser.current === userId) { setRows([]); setBusinesses([]); setError(c.loadError); }
      return false;
    } finally { if (sequence === loadSequence.current && currentUser.current === userId) setLoading(false); }
  }, [authorized, userId, c.loadError]);

  useEffect(() => { if (authorized) void load(); }, [authorized, load]);
  useEffect(() => {
    if (!authorized || busy || search.trim() === appliedSearch.current) return;
    const timer = window.setTimeout(() => { void load(search); }, 350);
    return () => window.clearTimeout(timer);
  }, [authorized, busy, search, load]);

  if (authLoading || checking) return <main className="min-h-screen bg-[#fbf8f0] p-6" role="status">{c.checking}</main>;
  if (!authorized) return <main className="mx-auto max-w-lg px-5 py-16">
    <h1 className="text-xl font-semibold">{c.denied}</h1><Link to="/auth" className="mt-4 inline-block text-[#07543F] underline">{c.login}</Link>
  </main>;

  const filtered = rows.filter(row => filter === 'all' || row.status === filter);
  const countsLabel = {fr:'Dossiers affichés',en:'Requests shown',ar:'الطلبات المعروضة',it:'Richieste visualizzate',ru:'Показано заявок'}[language];
  const resetLabel = {fr:'Effacer les filtres',en:'Clear filters',ar:'مسح الفلاتر',it:'Azzera filtri',ru:'Сбросить фильтры'}[language];
  return <main className="min-h-screen bg-[#fbf8f0] px-4 py-7 text-[#273b30]" dir={language === 'ar' ? 'rtl' : undefined}>
    <div className="mx-auto max-w-4xl space-y-5">
      <header><h1 className="font-serif text-3xl">{c.title}</h1><p className="mt-2 text-sm text-gray-600">{c.intro}</p></header>
      <form className="flex flex-wrap items-end gap-2" onSubmit={event => { event.preventDefault(); if (!busy) void load(search); }}>
        <label className="min-w-[180px] flex-1 text-sm">{c.search}<input type="search" value={search} disabled={busy} onChange={event => setSearch(event.target.value)} placeholder={c.searchPlaceholder} className={control} /></label>
        <button type="submit" disabled={busy || loading} className={secondary}>{c.search}</button>
        <button type="button" disabled={busy} onClick={() => { setSearch(''); setFilter('all'); setSelectedId(null); void load(''); }} className={secondary} aria-label={resetLabel}>× {resetLabel}</button>
        <button type="button" disabled={busy || loading} onClick={() => void load()} className={secondary}>{c.refresh}</button>
        <select aria-label={c.all} value={filter} disabled={busy} onChange={event => { setFilter(event.target.value as RegistrationStatus | 'all'); setSelectedId(null); }} className="rounded-lg border border-[#d9d6c8] bg-white px-3 py-2 text-sm">
          <option value="all">{c.all} ({rows.length})</option>{(['received', 'draft', 'paid', 'published', 'active'] as const).map(status => <option key={status} value={status}>{c[status]} ({rows.filter(row => row.status === status).length})</option>)}
        </select>
      </form>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {feedback && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-[#07543F]">{feedback}</p>}
      {loading && <p role="status" className="text-sm">{c.loading}</p>}
      {!loading && !error && <p role="status" className="text-sm">{countsLabel} : {filtered.length} / {rows.length}</p>}
      {!loading && !error && filtered.length === 0 && <p className="rounded-xl border border-[#e3ddcc] bg-white p-6 text-sm">{c.empty}</p>}
      <div className="space-y-3">{filtered.map(row => <article key={row.id} className="overflow-hidden rounded-xl border border-[#dfd6c0] bg-white">
        <button type="button" disabled={busy} aria-expanded={selectedId === row.id} aria-label={`${selectedId === row.id ? c.close : c.open} : ${row.name}`} onClick={() => { setSelectedId(selectedId === row.id ? null : row.id); setFeedback(''); }} className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-start disabled:opacity-60">
          <span><strong className="block">{row.name}</strong><span className="text-xs text-gray-600">{row.city || '—'} · {row.confirmed_plan === 'premium' || (!row.confirmed_plan && row.requested_plan === 'premium') ? c.premium : c.artisan}</span></span>
          <span className="rounded-full bg-[#f0f4ec] px-3 py-1 text-xs font-semibold">{c[row.status]}</span>
        </button>
        {selectedId === row.id && <RegistrationDossier key={`${row.id}:${row.version}`} row={row} businesses={businesses} copy={c} onBusy={setBusy} onReload={() => load()}
          onSaved={(saved, message) => {
            if (currentUser.current !== userId) return;
            setRows(previous => previous.map(item => item.id === saved.id ? saved : item)); setFeedback(message);
          }} />}
      </article>)}</div>
      <details className="rounded-xl border border-[#dfd6c0] bg-white p-4"><summary className="cursor-pointer text-sm font-semibold">{c.existing} ({businesses.length})</summary>
        <p className="mt-2 text-xs text-gray-600">{c.preserve}</p>
        <div className="mt-3 divide-y divide-[#eee8db]">{businesses.map(business => {
          const url = business.approved ? buildClientAppUrl(business) : null;
          return <div key={business.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <span>{business.name} <span className="text-xs text-gray-500">· {business.city || '—'}{business.plan ? ` · ${business.plan}` : ''}</span></span>
            {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#07543F] underline">{c.publicLink}</a> : <span className="text-xs text-gray-500">{c.draft}</span>}
          </div>;
        })}</div>
      </details>
      <p className="text-xs text-gray-500">{c.totalLimit}</p>
    </div>
  </main>;
}
