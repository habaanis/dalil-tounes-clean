import { useEffect, useState } from 'react';
import { supabaseUrl } from '../../lib/supabaseClient';

type PushConfig = { enabled?: boolean; publicKey?: string };
type PushResult = { subscribed?: boolean; error?: string };

const api = (action: string, payload: object = {}) => {
  const supabase = supabaseUrl;
  if (!supabase || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(supabase)) throw new Error('Notifications indisponibles.');
  return fetch(supabase + '/functions/v1/dalil-boutique-push', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
};
const toBytes = (key: string) => {
  const raw = atob(key.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - key.length % 4) % 4));
  return Uint8Array.from(raw, ch => ch.charCodeAt(0));
};

export function BoutiquePushFollow({ profileId, demoMode }: { profileId?: string; demoMode?: boolean }) {
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
          const check = await api('status', { profileId, subscription: existing.toJSON() });
          const result = await check.json() as PushResult;
          if (active && check.ok) {
            setSubscribed(result.subscribed === true);
            if (!result.subscribed) window.localStorage.removeItem('dalil:push:' + profileId);
          }
        }
      } catch { /* Do not advertise unavailable notifications. */ }
    })();
    return () => { active = false; };
  }, [profileId, demoMode]);

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
        window.localStorage.removeItem('dalil:push:' + profileId);
        throw new Error('Abonnement du navigateur expiré. Réessayez.');
      }
      if (subscribed && previous) {
        const response = await api('unsubscribe', { profileId, subscription: previous.toJSON() });
        const result = await response.json() as PushResult;
        if (!response.ok || result.error) throw new Error('Désabonnement indisponible.');
        window.localStorage.removeItem('dalil:push:' + profileId);
        setSubscribed(false);
        setNotice('Vous ne suivez plus cette boutique.');
      } else {
        if (Notification.permission === 'denied') throw new Error('Activez les notifications dans les réglages du navigateur.');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('Notifications non autorisées.');
        const subscription = previous || await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toBytes(key) as BufferSource,
        });
        const response = await api('subscribe', { profileId, subscription: subscription.toJSON() });
        const result = await response.json() as PushResult;
        if (!response.ok || !result.subscribed) throw new Error(result.error || 'Abonnement indisponible.');
        const verify = await api('status', { profileId, subscription: subscription.toJSON() });
        const verified = await verify.json() as PushResult;
        if (!verify.ok || verified.subscribed !== true) throw new Error('Inscription non confirmée. Réessayez.');
        window.localStorage.setItem('dalil:push:' + profileId, subscription.endpoint);
        setSubscribed(true);
        setNotice('Vous suivrez les nouveautés de cette boutique.');
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Notifications indisponibles.'); }
    finally { setBusy(false); }
  };
  return <div style={{ marginTop: 12, borderTop: '1px solid #e5d8c7', paddingTop: 11, textAlign: 'center' }}>
    <button type="button" onClick={() => void toggle()} disabled={busy}
      style={{ background: '#fffaf2', color: '#5e4731', border: '1px solid #d9bd88', padding: '8px 13px', fontSize: 12, borderRadius: 20, cursor: busy ? 'wait' : 'pointer', fontWeight: 600 }}>
      {subscribed ? '✓ Ne plus suivre les nouveautés' : '♧ Suivre les nouveautés'}
    </button>
    <p style={{ fontSize: 10, color: '#7e7668', margin: '6px 0 0' }}>Alertes volontaires lors de nouveaux produits validés. Désabonnement ici, à tout moment.</p>
    {notice && <p role="status" style={{ fontSize: 11, margin: '7px 0 0', color: '#5a5146' }}>{notice}</p>}
  </div>;
}
