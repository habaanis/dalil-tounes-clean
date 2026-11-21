import { useEffect, useState } from 'react';
import { supabaseUrl } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';

type PushConfig = { enabled?: boolean; publicKey?: string };
type PushResult = { subscribed?: boolean; error?: string };

const api = (action: string, payload: object = {}, promotion = false) => {
  const supabase = supabaseUrl;
  if (!supabase || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(supabase)) throw new Error('Notifications indisponibles.');
  return fetch(supabase + (promotion && action !== 'config' ? '/functions/v1/dalil-sales-promos' : '/functions/v1/dalil-boutique-push'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
};
const toBytes = (key: string) => {
  const raw = atob(key.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - key.length % 4) % 4));
  return Uint8Array.from(raw, ch => ch.charCodeAt(0));
};

export function BoutiquePushFollow({ profileId, demoMode, promotion = false }: { profileId?: string; demoMode?: boolean; promotion?: boolean }) {
  const {language}=useLanguage();
  const ar=language==='ar';
  const t=(fr:string,arabic:string)=>ar?arabic:fr;
  const [key, setKey] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    if (demoMode || !profileId || !/^[0-9a-f-]{36}$/i.test(profileId)
      || !('serviceWorker' in navigator) || !('PushManager' in window)
      || !('Notification' in window) || !window.isSecureContext) return;
    void (async () => {
      try {
        const response = await api('config');
        const result = await response.json() as PushConfig;
        if (!response.ok || !result.enabled || !result.publicKey || !active) return;
        setKey(result.publicKey);
        setAvailable(true);
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (active && existing) {
          const check = await api('status', { profileId, subscription: existing.toJSON() }, promotion);
          const result = await check.json() as PushResult;
          if (active && check.ok) {
            setSubscribed(result.subscribed === true);
            if (!result.subscribed) window.localStorage.removeItem('dalil:push:' + (promotion ? 'promo:' : '') + profileId);
          }
        }
      } catch { /* Do not advertise unavailable notifications. */ }
    })();
    return () => { active = false; };
  }, [profileId, demoMode, promotion]);

  if (!available || !profileId || demoMode) return null;

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      const registration = await navigator.serviceWorker.ready;
      const previous = await registration.pushManager.getSubscription();
      if (subscribed && !previous) {
        setSubscribed(false);
        window.localStorage.removeItem('dalil:push:' + (promotion ? 'promo:' : '') + profileId);
        throw new Error(t('Abonnement du navigateur expiré. Réessayez.','انتهى اشتراك المتصفح. حاول مجدداً.'));
      }
      if (subscribed && previous) {
        const response = await api('unsubscribe', { profileId, subscription: previous.toJSON() }, promotion);
        const result = await response.json() as PushResult;
        if (!response.ok || result.error) throw new Error(t('Désabonnement indisponible.','إلغاء الاشتراك غير متاح.'));
        window.localStorage.removeItem('dalil:push:' + (promotion ? 'promo:' : '') + profileId);
        setSubscribed(false);
        setNotice(promotion?t('Vous ne recevrez plus les offres promotionnelles.','لن تصلك العروض الترويجية بعد الآن.'):t('Vous ne suivez plus cette boutique.','لم تعد تتابع هذا المتجر.'));
      } else {
        if (Notification.permission === 'denied') throw new Error(t('Activez les notifications dans les réglages du navigateur.','فعّل الإشعارات من إعدادات المتصفح.'));
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error(t('Notifications non autorisées.','لم يتم السماح بالإشعارات.'));
        const subscription = previous || await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toBytes(key) as BufferSource,
        });
        const response = await api('subscribe', { profileId, subscription: subscription.toJSON() }, promotion);
        const result = await response.json() as PushResult;
        if (!response.ok || !result.subscribed) throw new Error(result.error || t('Abonnement indisponible.','الاشتراك غير متاح.'));
        const verify = await api('status', { profileId, subscription: subscription.toJSON() }, promotion);
        const verified = await verify.json() as PushResult;
        if (!verify.ok || verified.subscribed !== true) throw new Error(t('Inscription non confirmée. Réessayez.','لم يتأكد الاشتراك. حاول مجدداً.'));
        window.localStorage.setItem('dalil:push:' + (promotion ? 'promo:' : '') + profileId, subscription.endpoint);
        setSubscribed(true);
        setNotice(promotion?t('Vous recevrez les offres de cette boutique. Désabonnement possible ici.','ستصلك عروض هذا المتجر. يمكنك إلغاء الاشتراك هنا.'):t('Vous suivrez les nouveautés de cette boutique.','ستصلك أحدث منتجات هذا المتجر.'));
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Notifications indisponibles.'); }
    finally { setBusy(false); }
  };
  return <div style={{ marginTop: 8, borderTop: '1px solid var(--boutique-accent, #e8bd43)', paddingTop: 8, textAlign: ar?'right':'left' }}>
    <button type="button" onClick={() => void toggle()} disabled={busy}
      style={{ background: 'var(--boutique-button, #003c35)', color: 'var(--boutique-button-ink, #f7f4ec)', border: '1px solid var(--boutique-accent, #e8bd43)', padding: '8px 11px', fontSize: 11, borderRadius: 16, cursor: busy ? 'wait' : 'pointer', fontWeight: 600 }}>
      {promotion?(subscribed?t('✓ Ne plus recevoir les offres','✓ إيقاف العروض'):t('🔔 Recevoir les offres commerciales','🔔 تلقي العروض التجارية')):(subscribed?t('✓ Ne plus suivre les nouveautés','✓ إيقاف متابعة الجديد'):t('♧ Suivre les nouveautés','♧ متابعة الجديد'))}
    </button>
    <p style={{ fontSize: 10, color: 'var(--boutique-muted, #d0ddd5)', margin: '4px 0 0' }}>{promotion?t('Offres : abonnement facultatif et réversible.','العروض: الاشتراك اختياري ويمكن إلغاؤه.'):t('Nouveautés : abonnement facultatif et réversible.','الجديد: الاشتراك اختياري ويمكن إلغاؤه.')}</p>
    {notice && <p role="status" style={{ fontSize: 11, margin: '7px 0 0', color: 'var(--boutique-ink, #f7f4ec)' }}>{notice}</p>}
  </div>;
}
