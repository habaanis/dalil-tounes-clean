import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Share2, Search, HelpCircle, Compass } from 'lucide-react';
import { blogArticles, getArticleTranslation } from './blogData';
import { SEOHead } from '../../components/SEOHead';
import { SocialShareButtons } from '../../components/SocialShareButtons';
import StructuredData from '../../components/StructuredData';
import Breadcrumb from '../../components/seo/Breadcrumb';
import GuideMascot from '../../components/GuideMascot';
import { generateFAQSchema } from '../../lib/structuredDataSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../lib/i18n';

const DOMAIN = 'https://dalil-tounes.com';
const DEFAULT_SUMMARY = "Dans cet article, découvre des conseils simples pour mieux comprendre le sujet et avancer plus facilement avec Dalil Tounes.";
const TAKEAWAY_TEXT = "L’essentiel est de prendre le temps de vérifier les informations utiles avant de faire ton choix : avis, coordonnées, horaires, services proposés et moyens de contact.";

const PRACTICAL_CATEGORY_KEYWORDS = [
  'pratique',
  'conseil',
  'guide',
  'santé',
  'sante',
  'éducation',
  'education',
  'loisirs',
  'tourisme',
  'visibilité',
  'visibilite',
  'health',
  'education',
  'leisure',
  'tourism',
  'visibility',
];

type Lang = 'fr' | 'en' | 'ar';

const UI: Record<Lang, {
  home: string;
  articles: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  linksTitle: string;
  why: string;
  how: string;
  searchBiz: string;
  relatedTitle: string;
  faqTitle: string;
}> = {
  fr: {
    home: 'Accueil',
    articles: 'Articles',
    ctaTitle: 'Tu recherches un professionnel près de chez toi ?',
    ctaText: 'Découvre les fiches disponibles sur Dalil Tounes.',
    ctaButton: 'Rechercher un professionnel',
    linksTitle: 'Pour aller plus loin',
    why: 'Pourquoi Dalil Tounes ?',
    how: 'Comment fonctionne Dalil Tounes ?',
    searchBiz: 'Rechercher une entreprise',
    relatedTitle: 'Articles similaires',
    faqTitle: 'Questions frequentes',
  },
  en: {
    home: 'Home',
    articles: 'Articles',
    ctaTitle: 'Looking for a professional near you?',
    ctaText: 'Discover the profiles available on Dalil Tounes.',
    ctaButton: 'Find a professional',
    linksTitle: 'Go further',
    why: 'Why Dalil Tounes?',
    how: 'How Dalil Tounes works',
    searchBiz: 'Search a business',
    relatedTitle: 'Related articles',
    faqTitle: 'Frequently asked questions',
  },
  ar: {
    home: 'الرئيسية',
    articles: 'مقالات',
    ctaTitle: 'تبحث عن مهني قريب منك؟',
    ctaText: 'اكتشف البطاقات المتاحة على دليل تونس.',
    ctaButton: 'ابحث عن مهني',
    linksTitle: 'لمعرفة المزيد',
    why: 'لماذا دليل تونس؟',
    how: 'كيف يعمل دليل تونس',
    searchBiz: 'ابحث عن مؤسسة',
    relatedTitle: 'مقالات مشابهة',
    faqTitle: 'أسئلة شائعة',
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const isRTL = language === 'ar';
  const blog = (t as any).blog;
  const ui = UI[(language as Lang)] || UI.fr;

  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const tr = getArticleTranslation(article, language);
  const canonicalUrl = `${DOMAIN}/blog/${article.slug}`;

  // Corrige le double H1 : le seul H1 de la page est celui rendu ci-dessous.
  // On retire le H1 en tête du contenu HTML (titre dupliqué) sans toucher aux paragraphes.
  const contentHtml = tr.content.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');

  const seoTitle = article.seoTitle || `${tr.title} | Blog Dalil Tounes`;
  const seoDesc = article.seoDescription || tr.excerpt;
  const articleSummary = article.seoDescription || tr.excerpt || DEFAULT_SUMMARY;
  const showDalilTip = PRACTICAL_CATEGORY_KEYWORDS.some((keyword) =>
    tr.category.toLowerCase().includes(keyword)
  );

  const related = blogArticles
    .filter(a => a.slug !== article.slug)
    .map(a => ({ a, rtr: getArticleTranslation(a, language) }))
    .sort(
      (x, y) =>
        (y.rtr.category === tr.category ? 1 : 0) - (x.rtr.category === tr.category ? 1 : 0)
    )
    .slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: tr.title,
    description: seoDesc,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Dalil Tounes',
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/images/logo_dalil_tounes_crop.png` },
    },
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    ...(article.coverImage ? { image: article.coverImage } : {}),
    url: canonicalUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui.home, item: `${DOMAIN}/` },
      { '@type': 'ListItem', position: 2, name: ui.articles, item: `${DOMAIN}/blog` },
      { '@type': 'ListItem', position: 3, name: tr.title, item: canonicalUrl },
    ],
  };

  const schemas: any[] = [articleSchema, breadcrumbSchema];
  if (article.faq && article.faq.length > 0) {
    schemas.push(generateFAQSchema(article.faq));
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: tr.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        image={article.coverImage || undefined}
        canonical={canonicalUrl}
        currentPath={`/blog/${article.slug}`}
        type="article"
        author={article.author}
        publishedTime={article.publishedDate}
        modifiedTime={article.publishedDate}
      />
      <StructuredData data={schemas} />

      <div className="max-w-2xl mx-auto px-4 pt-10">
        <Breadcrumb
          items={[
            { label: ui.home, href: '/' },
            { label: ui.articles, href: '/blog' },
            { label: tr.title },
          ]}
        />
      </div>

      <div className="pb-10 px-4 border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            {tr.category}
          </span>
          <h1
            className="text-3xl md:text-4xl font-light text-gray-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {tr.title}
          </h1>
          {tr.subtitle && (
            <p className="mt-4 text-gray-500 text-lg font-light">{tr.subtitle}</p>
          )}
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className={`flex items-center justify-between py-6 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-5 text-xs text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1.5">
              <User aria-hidden="true" className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden="true" className="w-3 h-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden="true" className="w-3 h-3" />
              {article.readTime} {blog?.readTime || 'de lecture'}
            </span>
          </div>
          <button
            onClick={handleShare}
            aria-label={blog?.share || 'Partager'}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Share2 aria-hidden="true" className="w-3.5 h-3.5" />
            {blog?.share || 'Partager'}
          </button>
        </div>

        <section className="mt-8 rounded-2xl border border-[#D4AF37]/25 bg-[#FFFDF6] p-5 shadow-sm" aria-labelledby="article-summary-title">
          <h2 id="article-summary-title" className="text-sm font-semibold text-[#4A1D43]">
            Résumé
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-700 sm:text-base">
            {articleSummary}
          </p>
        </section>

        <div
          className="py-12 prose-blog"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          style={{ fontFamily: 'inherit' }}
        />

        {showDalilTip && (
          <div className="mb-12">
            <GuideMascot
              title="Le conseil de Dalil"
              message="Avant de choisir un professionnel, prends quelques secondes pour consulter les avis, les horaires et les informations disponibles sur sa fiche."
              variant="tip"
              pose="idea"
              position="left"
              size="sm"
            />
          </div>
        )}

        {article.faq && article.faq.length > 0 && (
          <div className="border-t border-gray-200 pt-8 pb-12">
            <h2
              className="text-lg font-semibold text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {ui.faqTitle}
            </h2>
            <div className="space-y-4">
              {article.faq.map((faq, i) => (
                <details key={i} className="group border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-gray-800 hover:text-[#D4AF37] transition-colors p-4 list-none flex items-start gap-2">
                    <span aria-hidden="true" className="text-[#D4AF37] mt-0.5 shrink-0 transition-transform group-open:rotate-90">&#9656;</span>
                    <span>{faq.question}</span>
                  </summary>
                  <p className="text-sm text-gray-600 leading-relaxed px-4 pb-4 pl-9">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-[#D4AF37]/25 bg-[#FFFDF6] p-5 sm:p-6" aria-labelledby="article-takeaway-title">
          <h2
            id="article-takeaway-title"
            className="text-xl font-light text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            À retenir
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-700 sm:text-base">
            {TAKEAWAY_TEXT}
          </p>
        </section>

        {/* CTA final réutilisable */}
        <div className={`rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#FFFDF6] to-[#FBF6E8] p-6 sm:p-8 text-center`}>
          <h2
            className="text-xl sm:text-2xl font-light text-gray-900 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {ui.ctaTitle}
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">{ui.ctaText}</p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-white font-semibold text-sm hover:bg-[#c9a42e] transition-colors shadow-sm hover:shadow-md"
            >
              <Search aria-hidden="true" className="w-4 h-4" />
              {ui.ctaButton}
            </Link>
          </div>
        </div>

        {/* Maillage interne */}
        <nav aria-label={ui.linksTitle} className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
            {ui.linksTitle}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li>
              <Link
                to="/pourquoi-dalil-tounes"
                className="group flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-700 hover:border-[#D4AF37]/40 hover:text-gray-900 transition-colors"
              >
                <HelpCircle aria-hidden="true" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{ui.why}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/concept"
                className="group flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-700 hover:border-[#D4AF37]/40 hover:text-gray-900 transition-colors"
              >
                <Compass aria-hidden="true" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{ui.how}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/businesses"
                className="group flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-700 hover:border-[#D4AF37]/40 hover:text-gray-900 transition-colors"
              >
                <Search aria-hidden="true" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{ui.searchBiz}</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Articles similaires */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-10">
            <h2
              className="text-lg font-semibold text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {ui.relatedTitle}
            </h2>
            <div className="space-y-1">
              {related.map(({ a, rtr }) => (
                <Link key={a.id} to={`/blog/${a.slug}`} className="group block">
                  <article className={`py-4 border-t border-gray-100 flex items-start gap-3 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="flex-1">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-medium">
                        {rtr.category}
                      </span>
                      <h3
                        className="mt-1 text-base font-light text-gray-900 group-hover:text-gray-700 transition-colors leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {rtr.title}
                      </h3>
                    </div>
                    <ArrowRight aria-hidden="true" className={`w-4 h-4 mt-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <SocialShareButtons title={tr.title} url={typeof window !== 'undefined' ? window.location.href : ''} articleCategory={tr.category} />
        </div>

        <div className="py-10">
          <Link
            to="/blog"
            className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft aria-hidden="true" className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {ui.articles}
          </Link>
        </div>
      </div>
    </div>
  );
}
