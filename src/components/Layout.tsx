import { ReactNode, useEffect, useState, lazy, Suspense } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../lib/i18n';
import AdminNotifications from './AdminNotifications';

const ADMIN_EMAILS = ['contact@dalil-tounes.com', 'zenanis75@hotmail.com'];
import { Menu, X, ChevronDown, ChevronRight, Download, Share } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

// Tout ce qui est hors viewport initial est chargé paresseusement : ces
// composants ne doivent pas peser sur le premier bundle route-based.
const Footer = lazy(() => import('./Footer'));
const SocialBar = lazy(() => import('./SocialBar').then(m => ({ default: m.SocialBar })));
const PageHeader = lazy(() => import('./PageHeader').then(m => ({ default: m.PageHeader })));
const WhatsAppSupport = lazy(() => import('./WhatsAppSupport').then(m => ({ default: m.WhatsAppSupport })));

interface NavItem {
  label: string;
  path: string;
  children?: Array<{ label: string; path: string }>;
}

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const isRTL = language === 'ar';
  const { user } = useAuth();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  // PWA install banner state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  const pwaDetectPlatform = (): 'android' | 'ios' | 'other' => {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    return 'other';
  };

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setPwaInstalled(true);
      return;
    }
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setPwaInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    const platform = pwaDetectPlatform();
    if (platform === 'ios') { setShowIOSGuide(true); return; }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setPwaInstalled(true);
      setDeferredPrompt(null);
    } else {
      handleNavigateToSubscription();
    }
  };

  const showAdminLink = isAdmin || import.meta.env.DEV || import.meta.env.VITE_SHOW_ADMIN_LINK === 'true';

  const tx = t as any;
  const navigationStructure: NavItem[] = [
    {
      label: t.nav.home || 'Accueil',
      path: '/',
    },
    ...(isAdmin
      ? [
          {
            label: 'Espace Admin',
            path: '/admin/commercial',
            children: [
              { label: 'Gestion Commerciaux', path: '/admin/commercial?tab=wallet' },
              { label: 'Suivi des Versements', path: '/admin/commercial?tab=versements' },
            ],
          } as NavItem,
        ]
      : []),
    {
      label: t.nav.businesses || 'Entreprises',
      path: '/businesses',
      children: [
        { label: t.navMenu?.businesses?.directory || 'Annuaire', path: '/businesses' },
        { label: t.navMenu?.businesses?.partners || 'Partenaires', path: '/partner-search' },
        { label: tx.navExtra?.candidatesAvailable || 'Candidats disponibles', path: '/candidats' },
        { label: t.navMenu?.businesses?.events || 'Événements', path: '/business-events' },
      ],
    },
    {
      label: t.nav.citizens || 'Citoyens',
      path: '/citizens',
      children: [
        { label: t.navMenu?.citizens?.health || 'Santé', path: '/citizens/health' },
        { label: t.navMenu?.citizens?.education || 'Éducation', path: '/education' },
        { label: tx.navExtra?.servicesCitoyens || 'Services Citoyens', path: '/citizens/services' },
        { label: t.navMenu?.citizens?.shops || 'Commerces & Magasins', path: '/citizens/shops' },
        { label: t.navMenu?.citizens?.leisure || 'Loisirs & Événements', path: '/citizens/leisure' },
        { label: tx.navExtra?.tourism || 'Tourisme Local & Expatriation', path: '/citizens/tourism' },
      ],
    },
    ...(isAdmin
      ? []
      : [
          {
            label: t.nav.jobs || 'Emploi',
            path: '/jobs',
            children: [
              { label: t.navMenu?.jobs?.browse || 'Parcourir', path: '/jobs' },
              { label: t.navMenu?.jobs?.post || 'Publier', path: '/emplois/publier' },
            ],
          } as NavItem,
        ]),
    {
      label: t.nav.subscription || 'Abonnement',
      path: '/subscription',
    },
    {
      label: tx.navExtra?.concept || 'Notre Concept',
      path: '/concept',
    },
    {
      label: tx.navExtra?.blog || 'Blog',
      path: '/blog',
    },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleNavClick = (path: string) => {
    setOpenMenu(null);
    setShowMobileMenu(false);
    setMobileExpandedMenu(null);
    navigate(path);
  };

  const handleNavigateToSubscription = () => {
    navigate('/subscription');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prefetch des données home + businesses au ralenti après le premier rendu,
  // via un import dynamique pour sortir Supabase du bundle principal.
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    const run = () => {
      import('../lib/homeDataPrefetch').then((m) => m.prefetchHomeData().catch(() => {}));
      import('../lib/businessesCache').then((m) => m.prefetchBusinessesData().catch(() => {}));
    };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 500);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu && !(event.target as Element).closest('.nav-dropdown-container')) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenu]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                <picture>
                  <source srcSet="/images/logo_dalil_tounes_sceau_luxe.webp" type="image/webp" width="140" height="140" />
                  <img
                    src="/images/logo_dalil_tounes_sceau_luxe.png"
                    alt="Logo Dalil Tounes - Annuaire des établissements en Tunisie"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center', borderRadius: '50%' }}
                    width="140"
                    height="140"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Dalil Tounes
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navigationStructure.map((navItem, index) => (
                <div
                  key={index}
                  className="relative nav-dropdown-container"
                  onMouseEnter={() => navItem.children && setOpenMenu(navItem.label)}
                  onMouseLeave={() => navItem.children && setOpenMenu(null)}
                >
                  {navItem.children ? (
                    <button
                      onClick={() => handleNavClick(navItem.path)}
                      className={`text-sm transition-all flex items-center gap-1 ${
                        isActive(navItem.path)
                          ? 'text-orange-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {navItem.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openMenu === navItem.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={navItem.path}
                      className={`text-sm transition-all ${
                        isActive(navItem.path)
                          ? 'text-orange-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {navItem.label}
                    </Link>
                  )}

                  {navItem.children && openMenu === navItem.label && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-white rounded-lg shadow-xl py-2 min-w-[250px] border border-gray-200">
                        {navItem.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            onClick={() => {
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left text-sm px-4 py-2.5 hover:bg-orange-50 transition-colors text-gray-700 hover:text-orange-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <LanguageSelector />

              {showAdminLink && (
                <AdminNotifications variant="desktop" />
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-orange-600"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                {navigationStructure.map((navItem, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-1">
                      {navItem.children ? (
                        <button
                          onClick={() => handleNavClick(navItem.path)}
                          className={`flex-1 text-left px-4 py-2 rounded-lg transition-all ${
                            isActive(navItem.path) ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-orange-50'
                          }`}
                        >
                          {navItem.label}
                        </button>
                      ) : (
                        <Link
                          to={navItem.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex-1 text-left px-4 py-2 rounded-lg transition-all ${
                            isActive(navItem.path) ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-orange-50'
                          }`}
                        >
                          {navItem.label}
                        </Link>
                      )}
                      {navItem.children && (
                        <button
                          onClick={() => setMobileExpandedMenu(mobileExpandedMenu === navItem.label ? null : navItem.label)}
                          className="px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 transition-colors"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              mobileExpandedMenu === navItem.label ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {navItem.children && mobileExpandedMenu === navItem.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {navItem.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            onClick={() => {
                              setShowMobileMenu(false);
                              setMobileExpandedMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {showAdminLink && (
                  <div>
                    <button
                      onClick={() => {
                        setMobileExpandedMenu(mobileExpandedMenu === 'Admin' ? null : 'Admin');
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg transition-all flex items-center justify-between text-gray-700 hover:bg-orange-50"
                    >
                      <span>{tx.navExtra?.admin || 'Admin'}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          mobileExpandedMenu === 'Admin' ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {mobileExpandedMenu === 'Admin' && (
                      <div className="ml-4 mt-1">
                        <AdminNotifications
                          variant="mobile"
                          onNavigate={() => {
                            setShowMobileMenu(false);
                            setMobileExpandedMenu(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-2 px-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <Suspense fallback={null}>
        <PageHeader />
      </Suspense>

      {location.pathname === '/' && (
        <div className="bg-yellow-400 border-b border-yellow-500 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3">
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Download className="w-4 h-4 md:w-5 md:h-5 text-gray-900 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-bold text-gray-900 truncate md:whitespace-normal">
                    <button
                      type="button"
                      onClick={handleInstallApp}
                      className="underline decoration-2 decoration-gray-900/40 underline-offset-2 hover:decoration-gray-900 transition-colors cursor-pointer bg-transparent border-none p-0 m-0 font-bold text-gray-900 text-sm md:text-base"
                    >
                      Dalil Tounes
                    </button>
                    {' '}sur mobile + inscriptions gratuites !
                  </p>
                  <p className="hidden md:block text-xs text-gray-800">
                    Cliquez sur "Dalil Tounes" pour installer l'application sur votre mobile.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/concept')}
                className="flex-shrink-0 px-3 py-1.5 md:px-6 md:py-2.5 bg-gray-900 text-white text-sm md:text-base font-bold rounded-lg md:hover:bg-gray-800 md:hover:scale-105 md:transition-all md:duration-200 md:shadow-md whitespace-nowrap"
                aria-label="Venez nous connaître"
              >
                {language === 'ar' ? 'ايجاو تعرفوا علينا' : 'Venez nous connaître'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIOSGuide && (
        <div
          className="fixed inset-0 bg-black/70 z-[99999] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowIOSGuide(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-[#4A1D43] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#D4AF37]">
                Installer sur iPhone / iPad
              </h3>
              <button onClick={() => setShowIOSGuide(false)} className="p-1 text-gray-300 hover:text-white transition" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Appuyez sur le bouton Partager</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Share className="w-4 h-4 text-[#007AFF]" />
                    <span className="text-xs text-gray-500">en bas de Safari</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-sm font-medium text-gray-900">Choisissez "Sur l'ecran d'accueil"</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-sm font-medium text-gray-900">Confirmez en appuyant sur "Ajouter"</p>
              </div>
              <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">Fonctionne uniquement avec Safari</p>
            </div>
          </div>
        </div>
      )}

      <main className={`min-h-[calc(100vh-5rem)] overflow-x-hidden ${location.pathname === '/' ? '' : 'pt-[96px] sm:pt-[104px]'}`}>{children}</main>

      <Suspense fallback={null}>
        <SocialBar />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <WhatsAppSupport phoneNumber="+21627642252" />
      </Suspense>
    </div>
  );
};
