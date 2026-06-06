import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

const InfoAvis: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title="Informations sur les avis et recommandations — Dalil Tounes"
        description="Politique de Dalil Tounes concernant les avis, les recommandations et le classement des entreprises affichées sur la plateforme."
      />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            Informations légales
          </span>
          <h1
            className="text-3xl md:text-4xl font-light text-gray-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Informations sur les avis et recommandations
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            1. Critères de mise en avant
          </h2>
          <p>
            Les entreprises présentées sur Dalil Tounes peuvent être mises en avant selon des critères
            objectifs et automatisés tels que les avis publics, les notes disponibles sur Google, la
            complétude des informations de la fiche, la présence de photos, les horaires renseignés et
            la qualité des informations fournies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            2. Neutralité éditoriale
          </h2>
          <p>
            Dalil Tounes n'attribue aucune note, n'émet aucun jugement de valeur sur les établissements
            et n'effectue aucun classement éditorial. Les données affichées proviennent de sources
            publiques ou des informations communiquées par les entreprises elles-mêmes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            3. Mentions de recommandation
          </h2>
          <p>
            Les mentions telles que « Entreprises les plus recommandées par les clients »,
            « Établissements les plus appréciés » ou « Professionnels les mieux notés sur Google »
            ont uniquement pour objectif d'aider les utilisateurs à découvrir des établissements
            disposant d'avis publics positifs et ne constituent ni une certification officielle,
            ni un classement commercial.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-400">
            Dernière mise à jour : juin 2026
          </p>
          <p className="text-xs text-gray-500">
            Voir aussi :{' '}
            <Link to="/mentions-legales" className="text-[#D4AF37] hover:underline">Mentions légales</Link>
            {' '}&middot;{' '}
            <Link to="/cgu" className="text-[#D4AF37] hover:underline">CGU</Link>
            {' '}&middot;{' '}
            <Link to="/politique-confidentialite" className="text-[#D4AF37] hover:underline">Confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoAvis;
