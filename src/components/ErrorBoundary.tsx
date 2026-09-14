import { Component, type ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Application error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const lang = (typeof window !== 'undefined' && localStorage.getItem('dalil-lang')) || 'fr';
      const msgs: Record<string, { title: string; desc: string; btn: string }> = {
        fr: { title: 'Une erreur est survenue', desc: 'Nous sommes désolés pour ce désagrément. Veuillez recharger la page pour continuer.', btn: 'Recharger la page' },
        en: { title: 'An error occurred', desc: 'We apologize for the inconvenience. Please reload the page to continue.', btn: 'Reload page' },
        ar: { title: 'حدث خطأ', desc: 'نعتذر عن هذا الإزعاج. يرجى إعادة تحميل الصفحة للمتابعة.', btn: 'إعادة تحميل الصفحة' },
        it: { title: 'Si è verificato un errore', desc: 'Ci scusiamo per il disagio. Ricarica la pagina per continuare.', btn: 'Ricarica la pagina' },
        ru: { title: 'Произошла ошибка', desc: 'Приносим извинения за неудобства. Перезагрузите страницу, чтобы продолжить.', btn: 'Перезагрузить страницу' },
      };
      const m = msgs[lang] || msgs.fr;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFFCF7] px-4 text-center">
          <img src="/images/logo_dalil_tounes_crop.png" alt="Dalil Tounes" className="h-16 w-16 rounded-full" />
          <h1 className="text-xl font-bold text-[#4A123F]">{m.title}</h1>
          <p className="max-w-md text-sm text-slate-600">
            {m.desc}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#07543F] px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            {m.btn}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
