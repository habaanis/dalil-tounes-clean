import { useEffect, useState } from 'react';

const UPDATE_KEY = 'dalil-tounes-pwa-update-ready';
const COPY: Record<string, { title: string; detail: string; action: string }> = {
  fr: { title: 'Nouvelle version disponible', detail: 'Actualisez Dalil Tounes pour profiter des dernières améliorations.', action: 'Actualiser maintenant' },
  en: { title: 'New version available', detail: 'Update Dalil Tounes to get the latest improvements.', action: 'Update now' },
  it: { title: 'Nuova versione disponibile', detail: 'Aggiorna Dalil Tounes per ottenere gli ultimi miglioramenti.', action: 'Aggiorna ora' },
  ar: { title: 'إصدار جديد متاح', detail: 'حدّث دليل تونس للاستفادة من أحدث التحسينات.', action: 'تحديث الآن' },
  ru: { title: 'Доступна новая версия', detail: 'Обновите Dalil Tounes, чтобы получить последние улучшения.', action: 'Обновить' },
};

export function PwaUpdatePrompt() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(UPDATE_KEY) === '1');

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener('pwa-update-ready', show);
    return () => window.removeEventListener('pwa-update-ready', show);
  }, []);

  if (!visible) return null;

  const language = (document.documentElement.lang || 'fr').slice(0, 2);
  const copy = COPY[language] || COPY.fr;
  const refresh = () => {
    sessionStorage.removeItem(UPDATE_KEY);
    window.location.reload();
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[10000] flex w-[min(92vw,640px)] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-[#D4AF37] bg-[#063D32] p-4 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="grid gap-1">
        <strong className="text-sm font-bold">{copy.title}</strong>
        <span className="text-xs text-white/90">{copy.detail}</span>
      </div>
      <button
        type="button"
        onClick={refresh}
        className="shrink-0 rounded-full bg-[#D4AF37] px-4 py-3 text-sm font-extrabold text-[#063D32] transition hover:bg-[#E6C75B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#063D32]"
      >
        {copy.action}
      </button>
    </aside>
  );
}
