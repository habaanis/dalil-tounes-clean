import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { useTranslationExtended } from '../lib/useTranslationExtended';
import { getFooterRequestTranslations } from '../lib/footerRequestTranslations';
import { useRTL } from '../lib/useRTL';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';

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

const footerLink = 'text-gray-400 hover:text-[#D4AF37] focus-visible:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded-sm transition-colors duration-200 text-sm leading-relaxed';

const footerStaticCopy = {
  fr: {
    discover: 'Découvrir Dalil Tounes',
    why: 'Pourquoi Dalil Tounes',
    how: 'Comment fonctionne Dalil Tounes',
    articles: 'Articles',
    professionals: 'Professionnels',
    offers: 'Nos offres',
    businesses: 'Entreprises',
    reviews: 'Avis & recommandations',
    rights: 'Tous droits réservés.',
    request: 'Demande d’information / inscription',
    slogan: 'Ne soyez pas seulement présent, soyez trouvable.',
  },
  ar: {
    discover: 'اكتشف Dalil Tounes',
    why: 'لماذا Dalil Tounes',
    how: 'كيف يعمل Dalil Tounes',
    articles: 'المقالات',
    professionals: 'المهنيون',
    offers: 'عروضنا',
    businesses: 'المؤسسات',
    reviews: 'الآراء والتوصيات',
    rights: 'جميع الحقوق محفوظة.',
    request: 'طلب معلومات / تسجيل',
    slogan: 'لا تكتفِ بالحضور، كن سهل العثور عليك.',
  },
  en: {
    discover: 'Discover Dalil Tounes',
    why: 'Why Dalil Tounes',
    how: 'How Dalil Tounes works',
    articles: 'Articles',
    professionals: 'Professionals',
    offers: 'Our offers',
    businesses: 'Businesses',
    reviews: 'Reviews & recommendations',
    rights: 'All rights reserved.',
    request: 'Information request / registration',
    slogan: 'Do not just be present, be easy to find.',
  },
  it: {
    discover: 'Scopri Dalil Tounes',
    why: 'Perché Dalil Tounes',
    how: 'Come funziona Dalil Tounes',
    articles: 'Articoli',
    professionals: 'Professionisti',
    offers: 'Le nostre offerte',
    businesses: 'Attività',
    reviews: 'Recensioni e raccomandazioni',
    rights: 'Tutti i diritti riservati.',
    request: 'Richiesta di informazioni / registrazione',
    slogan: 'Non limitarti a essere presente, fatti trovare.',
  },
  ru: {
    discover: 'Откройте для себя Dalil Tounes',
    why: 'Почему Dalil Tounes',
    how: 'Как работает Dalil Tounes',
    articles: 'Статьи',
    professionals: 'Профессионалам',
    offers: 'Наши предложения',
    businesses: 'Организации',
    reviews: 'Отзывы и рекомендации',
    rights: 'Все права защищены.',
    request: 'Запрос информации / регистрация',
    slogan: 'Не просто присутствуйте — будьте заметны и доступны для поиска.',
  },
} as const;

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const te = useTranslationExtended(language);
  const { isRTL } = useRTL();
  const staticCopy = footerStaticCopy[language] ?? footerStaticCopy.fr;
  const formT = getFooterRequestTranslations(language);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: '',
    phone: '',
    email: '',
    message: '',
  });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const openRequestForm = () => {
    setShowRequestForm(true);
    setRequestSuccess(false);
    setRequestError(null);
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setRequestSuccess(false);
    setRequestError(null);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess(false);
    setRequestError(null);

    try {
      const title = requestForm.title.trim();
      const phone = requestForm.phone.trim();
      const email = requestForm.email.trim();
      const message = requestForm.message.trim();

      if (!title) {
        setRequestError(formT.requiredTitle);
        setRequestSubmitting(false);
        return;
      }

      if (!phone && !email) {
        setRequestError(formT.requiredContact);
        setRequestSubmitting(false);
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setRequestError(formT.invalidEmail);
          setRequestSubmitting(false);
          return;
        }
      }

      if (!message) {
        setRequestError(formT.requiredMessage);
        setRequestSubmitting(false);
        return;
      }

      const payload = {
        nom_entreprise: title,
        secteur: 'Demande information / inscription',
        ville: null,
        contact_suggere: `${phone || ''}${phone && email ? ' - ' : ''}${email || ''}`.trim(),
        raison_suggestion: `Demande depuis le footer\n\n${message}`,
        submission_lang: language,
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.error('Erreur Supabase footer:', error);
        setRequestError(formT.submitError);
        return;
      }

      notifyAdmin('Nouvelle demande depuis le footer', {
        Titre: title,
        Telephone: phone || 'Non renseigné',
        Email: email || 'Non renseigné',
        Message: message,
        Langue: language,
      });

      setRequestSuccess(true);
      setRequestForm({
        title: '',
        phone: '',
        email: '',
        message: '',
      });

      setTimeout(() => {
        closeRequestForm();
      }, 1800);
    } catch (error) {
      console.error('Erreur demande footer:', error);
      setRequestError(formT.unexpectedError);
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#111111] text-white pt-14 pb-8 border-t border-gray-800/60">
      <div className="container mx-auto px-4">

        <div className="bg-gradient-to-r from-[#4A1D43]/80 to-[#5A2D53]/80 rounded-lg p-3.5 mb-12 border border-[#D4AF37]/50 shadow-[0_2px_20px_rgba(212,175,55,0.12)]">
          <p className="text-center text-white text-sm md:text-base font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {staticCopy.slogan}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-10 ${isRTL ? 'text-right' : 'text-left'}`}>

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
                aria-label={te.footer?.followFacebook || 'Suivez-nous sur Facebook'}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-xs"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/dalil.tounes/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={te.footer?.followInstagram || 'Suivez-nous sur Instagram'}
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
              <li><Link to="/blog" className={footerLink}>{te.footer?.blog || 'Articles'}</Link></li>
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
              {staticCopy.discover}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/pourquoi-dalil-tounes" className={footerLink}>{staticCopy.why}</Link></li>
              <li><Link to="/concept" className={footerLink}>{staticCopy.how}</Link></li>
              <li><Link to="/blog" className={footerLink}>{staticCopy.articles}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              {staticCopy.professionals}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/subscription" className={footerLink}>{staticCopy.offers}</Link></li>
              <li><Link to="/businesses" className={footerLink}>{staticCopy.businesses}</Link></li>
              {/* Future link: "Pourquoi créer une fiche professionnelle" */}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 text-gray-300 uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              {te.footer?.legalInfo || 'Informations légales'}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/mentions-legales" className={footerLink}>{te.footer?.legalNotice || 'Mentions légales'}</Link></li>
              <li><Link to="/cgu" className={footerLink}>{te.footer?.cgu || 'CGU'}</Link></li>
              <li><Link to="/politique-confidentialite" className={footerLink}>{te.footer?.privacy || 'Confidentialité'}</Link></li>
              <li><Link to="/plan-du-site" className={footerLink}>{te.footer?.sitemap || 'Plan du site'}</Link></li>
              <li><Link to="/info-avis" className={footerLink}>{staticCopy.reviews}</Link></li>
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
              © 2025 Dalil Tounes. {staticCopy.rights}
            </p>
            <button
              type="button"
              onClick={openRequestForm}
              className="inline-block px-6 py-2.5 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-medium text-sm rounded-lg transition-all duration-200 border border-[#D4AF37]/60 hover:border-[#D4AF37]"
              style={{ letterSpacing: '0.03em' }}
            >
              {staticCopy.request}
            </button>
          </div>
        </div>

        {showRequestForm && (
          <div
            className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeRequestForm()}
          >
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D4AF37]">
              <div className="sticky top-0 bg-white border-b border-[#D4AF37]/40 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-semibold text-[#4A1D43]">
                    {formT.heading}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {formT.intro}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeRequestForm}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label={formT.close}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="p-6 space-y-5">
                {requestSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                    {formT.success}
                  </div>
                )}

                {requestError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {requestError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formT.title} <span className="text-[#800020]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.title}
                    onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                    placeholder={formT.titlePlaceholder}
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formT.phone}
                    </label>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formT.email}
                    </label>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      placeholder={formT.emailPlaceholder}
                      className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {formT.contactHint}
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formT.message} <span className="text-[#800020]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    placeholder={formT.messagePlaceholder}
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeRequestForm}
                    className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    {formT.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="flex-1 px-5 py-3 bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#5A2D53] transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {requestSubmitting ? formT.sending : formT.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </footer>
  );
};

export default Footer;
