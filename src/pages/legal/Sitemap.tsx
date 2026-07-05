import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Navigation principale',
    links: [
      { label: 'Accueil', to: '/' },
      { label: 'Entreprises', to: '/entreprises' },
      { label: 'Emplois', to: '/emplois' },
      { label: 'Notre Concept', to: '/notre-concept' },
      { label: 'Blog', to: '/blog' },
      { label: 'Abonnements', to: '/abonnement' },
    ],
  },
  {
    title: 'Espace Citoyens',
    links: [
      { label: 'Santé', to: '/citizens/health' },
      { label: 'Éducation', to: '/education' },
      { label: 'Services Publics', to: '/citizens/admin' },
      { label: 'Commerces & Magasins', to: '/citizens/magasins' },
      { label: 'Loisirs & Événements', to: '/citizens/leisure' },
      { label: 'Marché Local', to: '/marketplace' },
    ],
  },
  {
    title: 'Informations légales',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: "Conditions Générales d'Utilisation", to: '/cgu' },
      { label: 'Politique de confidentialité', to: '/politique-confidentialite' },
    ],
  },
];

const Sitemap: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111111] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase"
            style={{ letterSpacing: '0.15em' }}
          >
            Plan du site
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Plan du site
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4" style={{ letterSpacing: '0.1em' }}>
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-200"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
