import { useEffect, useState } from 'react';

// Vite replaces this constant with the Git commit SHA in every production bundle.
declare const __DALIL_BUILD_VERSION__: string;

const UPDATE_KEY = 'dalil-tounes-pwa-update-ready';
const COPY: Record<string, { title: string; detail: string; action: string }> = {
  fr: { title: 'Nouvelle version disponible', detail: 'Actualisez Dalil Tounes pour profiter des dernières améliorations.', action: 'Actualiser maintenant' },
  en: { title: 'New version available', detail: 'Update Dalil Tounes to get the latest improvements.', action: 'Update now' },
  it: { title: 'Nuova versione disponibile', detail: 'Aggiorna Dalil Tounes per ottenere gli ultimi miglioramenti.', action: 'Aggiorna ora' },
  ar: { title: 'إصدار جديد متاح', detail: 'حدّث دليل تونس للاستفادة من أحدث التحسينات.', action: 'تحديث الآن' },
  ru: { title: 'Доступна новая версия', detail: 'Обновите Dalil Tounes, чтобы получить последние улучшения.', action: 'Обновить' },
};

export function PwaUpdatePrompt() {
  const [visible, setVisible] = useState(() => { try { return sessionStorage.getItem(UPDATE_KEY) === '1'; } catch { return false; } });

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener('pwa-update-ready', show);

    // A new web bundle does not always change the service-worker script itself.
    // Compare the per-deployment version manifest when the app is reopened or resumed.
    // Never reload a visitor in the middle of filling an order or contact form.
    let active = true;
    let checking = false;
    const checkVersion = async () => {
      if (checking || document.visibilityState === 'hidden') return;
      checking = true;
      try {
        const response = await fetch('/version.json', { cache: 'no-store' });
        if (!response.ok) return;
        const payload: unknown = await response.json();
        const latest = payload && typeof payload === 'object' && 'version' in payload
          ? (payload as { version?: unknown }).version : null;
        if (active && typeof latest === 'string' && latest !== __DALIL_BUILD_VERSION__) show();
      } catch {
        // Offline use remains available; recheck on the next focus/visibility event.
      } finally {
        checking = false;
      }
    };
    void checkVersion();
    const onFocus = () => { void checkVersion(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') void checkVersion(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(() => { void checkVersion(); }, 10 * 60 * 1000);
    return () => {
      active = false;
      window.removeEventListener('pwa-update-ready', show);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const language = (document.documentElement.lang || 'fr').slice(0, 2);
  const copy = COPY[language] || COPY.fr;
  const refresh = () => {
    // Avoid losing unsaved information from forms, reservations or client edits.
    const hasPotentialUnsavedChanges = Array.from(document.querySelectorAll('input, textarea, select')).some((element) => {
      if (element instanceof HTMLTextAreaElement) return element.value.trim().length > 0;
      if (element instanceof HTMLInputElement) {
        if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file'].includes(element.type)) return false;
        return element.value.trim().length > 0 && element.value !== element.defaultValue;
      }
      return element instanceof HTMLSelectElement && element.value !== Array.from(element.options).find(o => o.defaultSelected)?.value;
    });
    if (hasPotentialUnsavedChanges && !window.confirm(language === 'ar'
      ? 'قد تفقد المعلومات غير المحفوظة. هل تريد تحديث الصفحة؟'
      : language === 'en' ? 'Unsaved information may be lost. Refresh now?'
      : 'Des informations non enregistrées risquent d’être perdues. Actualiser maintenant ?')) return;
    try { sessionStorage.removeItem(UPDATE_KEY); } catch { /* Storage disabled */ }
    // Reload only on the user's explicit click; fetch new HTML and hashed assets.
    window.location.reload();
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[10000] flex w-[min(92vw,640px)] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-[#C9A65D] bg-[#FFF9ED] p-4 text-[#292725] shadow-2xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="grid gap-1">
        <strong className="text-sm font-bold">{copy.title}</strong>
        <span className="text-xs text-[#59534A]">{copy.detail}</span>
      </div>
      <button
        type="button"
        onClick={refresh}
        className="shrink-0 rounded-full border border-[#B68C3B] bg-[#D6B86D] px-4 py-3 text-sm font-extrabold text-[#292725] transition hover:bg-[#E4CB91] focus:outline-none focus:ring-2 focus:ring-[#C9A65D] focus:ring-offset-2"
      >
        {copy.action}
      </button>
    </aside>
  );
}
