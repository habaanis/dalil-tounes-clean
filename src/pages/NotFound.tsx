import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page introuvable | Dalil Tounes"
        description="Cette page n'existe pas ou n'est plus disponible sur Dalil Tounes."
        noindex
        currentPath={window.location.pathname}
      />
      <main className="min-h-[70vh] bg-white px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Erreur 404</div>
          <h1 className="mb-4 text-3xl font-bold text-[#4A1D43] md:text-5xl">Page introuvable</h1>
          <p className="mx-auto mb-8 max-w-xl text-gray-600">
            L'adresse demandée n'existe pas, a été déplacée ou n'est plus disponible.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-xl bg-[#4A1D43] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/businesses"
              className="rounded-xl border border-[#D4AF37] px-6 py-3 font-semibold text-[#4A1D43] transition hover:bg-[#FFF8E6]"
            >
              Rechercher un professionnel
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
