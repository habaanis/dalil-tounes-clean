import React from 'react';
import { Link } from 'react-router-dom';

interface UnderConstructionProps {
  title: string;
  subtitle?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.15em' }}
        >
          Page en construction
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {subtitle}
          </p>
        )}

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />

        <p className="text-gray-500 text-sm mb-8">
          Cette page sera bientôt disponible. Merci pour votre patience.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-200"
          style={{ letterSpacing: '0.05em' }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default UnderConstruction;
