import { Component, Suspense, lazy, type ReactNode } from 'react';

type Props = {
  model: 'business' | 'portfolio';
  palette?: 'prestige' | 'ivory' | 'night';
  expanded?: boolean;
  language?: string;
};

// Load the live CV only inside the preview. A missing/stale PWA bundle must
// never prevent the professional page itself from opening.
const LiveCv = lazy(() => import('./BusinessShowcaseLienoraEnhanced'));

const fallbackPath = (model: Props['model'], language?: string) =>
  `/cv/aux-saveurs-anis?preview-model=${model}&boutique-demo=1&skip-opening=1${language ? `&lang=${language}` : ''}`;

class PreviewErrorBoundary extends Component<
  { children: ReactNode; model: Props['model']; language?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error) {
    console.error('[Dalil PWA CV preview] Isolated error:', error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-[#D6AF2E]/40 bg-[#F7F5EF] p-5 text-center text-sm text-[#143E31]">
          <p>Le modèle ne peut pas être affiché dans cet aperçu.</p>
          <a className="underline font-semibold" href={fallbackPath(this.props.model, this.props.language)}>
            Ouvrir le vrai CV {this.props.model === 'business' ? 'Business' : 'Portfolio'}
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CvEmbeddedPreviewSafe({ model, palette, language }: Props) {
  return (
    <PreviewErrorBoundary key={model + '-' + palette} model={model} language={language}>
      <Suspense fallback={<div className="flex min-h-48 items-center justify-center p-6 text-sm text-slate-500">Chargement du CV…</div>}>
        <LiveCv
          embeddedPreview
          previewSlug="aux-saveurs-d-anis"
          previewVilleSlug="sousse"
          previewPalette={palette}
          previewPresentationModel={model}
        />
      </Suspense>
    </PreviewErrorBoundary>
  );
}
