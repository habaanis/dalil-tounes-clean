import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { useTranslationExtended } from '../lib/useTranslationExtended';
import { useRTL } from '../lib/useRTL';

const EmailContact: React.FC = () => {
  const { language } = useLanguage();
  const te = useTranslationExtended(language);
  const { isRTL } = useRTL();
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = 'contact@dalil-tounes.com';
  const subject = 'Demande de renseignements - Dalil Tounes';

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
        className={`flex items-center gap-2 group cursor-pointer hover:bg-gray-800 rounded-lg px-3 py-2 -mx-3 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <span className="text-gray-300 group-hover:text-[#D4AF37] group-hover:underline transition-all text-sm font-medium">
          {email}
        </span>
      </a>

      {showTooltip && (
        <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} bottom-full mb-2 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[280px]`}>
          <div className={`flex items-start justify-between gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <p className={`text-xs text-gray-400 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{te.footer?.email || 'Adresse e-mail :'}</p>
              <p className={`text-sm text-white font-medium break-all ${isRTL ? 'text-right' : 'text-left'}`}>{email}</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#4A1D43] hover:bg-[#D4AF37] text-white text-xs font-medium rounded transition-colors border border-[#D4AF37]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {te.footer?.copied || 'Copié !'}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {te.footer?.copyAddress || "Copier l'adresse"}
              </>
            )}
          </button>
          <div className={`absolute ${isRTL ? 'right-6' : 'left-6'} bottom-[-6px] w-3 h-3 bg-gray-900 border-r border-b border-gray-700 transform rotate-45`}></div>
        </div>
      )}
    </div>
  );
};

const footerLink = 'text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 text-sm leading-relaxed';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const te = useTranslationExtended(language);
  const { isRTL } = useRTL();

  return (
    <footer className="bg-[#111111] text-white pt-14 pb-8 border-t border-gray-800/60">
      <div className="container mx-auto px-4">

        <div className="bg-gradient-to-r from-[#4A1D43]/80 to-[#5A2D53]/80 rounded-lg p-3.5 mb-12 border border-[#D4AF37]/50 shadow-[0_2px_20px_rgba(212,175,55,0.12)]">
          <p className="text-center text-white text-sm md:text-base font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t.home.footerVisibility.text}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 ${isRTL ? 'text-right' : 'text-left'}`}>

          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-3 text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
              {te.footer?.dalilTounes || 'Dalil Tounes'}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {te.footer?.platformDescription || 'La plateforme de référence pour trouver tous les établissements et services en Tunisie.'}
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href="https://www.facebook.com/daliltounes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur Facebook"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-xs"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/dalil.tounes/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur Instagram"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-xs"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              {te.footer?.navigation || 'Navigation'}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className={footerLink}>{te.footer?.home || t.nav.home}</Link></li>
              <li><Link to="/entreprises" className={footerLink}>{te.footer?.businesses || t.nav.businesses}</Link></li>
              <li><Link to="/emplois" className={footerLink}>{te.footer?.jobs || t.nav.jobs}</Link></li>
              <li><Link to="/notre-concept" className={footerLink}>{te.footer?.concept || 'Notre Concept'}</Link></li>
              <li><Link to="/blog" className={footerLink}>Blog</Link></li>
              <li><Link to="/abonnement" className={footerLink}>{te.footer?.subscriptions || t.nav.subscription}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              {te.footer?.citizens || t.nav.citizens}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/citizens/health" className={footerLink}>{te.footer?.health || 'Santé'}</Link></li>
              <li><Link to="/education" className={footerLink}>{te.footer?.education || 'Éducation'}</Link></li>
              <li><Link to="/citizens/admin" className={footerLink}>{te.footer?.publicServices || 'Services Publics'}</Link></li>
              <li><Link to="/citizens/magasins" className={footerLink}>{te.footer?.shops || 'Commerces & Magasins'}</Link></li>
              <li><Link to="/citizens/leisure" className={footerLink}>{te.footer?.leisure || 'Loisirs & Événements'}</Link></li>
              <li><Link to="/marketplace" className={footerLink}>{te.footer?.localMarket || 'Marché Local'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              Informations légales
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/mentions-legales" className={footerLink}>Mentions légales</Link></li>
              <li><Link to="/cgu" className={footerLink}>CGU</Link></li>
              <li><Link to="/politique-confidentialite" className={footerLink}>Confidentialité</Link></li>
              <li><Link to="/plan-du-site" className={footerLink}>Plan du site</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              {te.footer?.contact || 'Contact'}
            </h4>
            <div className="space-y-3">
              <EmailContact />
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {te.footer?.digitalGuide || 'Le guide digital des établissements et services en Tunisie'}
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <p className="text-gray-600 text-xs">
              © 2025 Dalil Tounes. Tous droits réservés.
            </p>
            <Link
              to="/abonnement"
              className="inline-block px-6 py-2.5 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-medium text-sm rounded-lg transition-all duration-200 border border-[#D4AF37]/60 hover:border-[#D4AF37]"
              style={{ letterSpacing: '0.03em' }}
            >
              {te.footer?.registerEstablishment || 'Inscrire mon établissement'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
