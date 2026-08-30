import { Component, type ReactNode } from 'react';

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
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFFCF7] px-4 text-center">
          <img src="/images/logo_dalil_tounes_crop.png" alt="Dalil Tounes" className="h-16 w-16 rounded-full" />
          <h1 className="text-xl font-bold text-[#4A123F]">Une erreur est survenue</h1>
          <p className="max-w-md text-sm text-slate-600">
            Nous sommes désolés pour ce désagrément. Veuillez recharger la page pour continuer.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#07543F] px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
