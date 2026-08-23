import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getOgImageUrl, isImageKitUrl } from '../lib/imagekitUtils';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  currentPath?: string;
}

const CANONICAL_ORIGIN = 'https://dalil-tounes.com';

/**
 * Construit l'URL canonique propre : toujours dalil-tounes.com, sans paramètres ?lang=
 * ni fragments hash.
 */
const buildCanonicalUrl = (pathname?: string): string => {
  const path = pathname || window.location.pathname || '/';
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
  return `${CANONICAL_ORIGIN}${clean}`;
};

export const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url = window.location.href,
  type = 'website',
  canonical,
  noindex = false,
  author = 'Dalil Tounes',
  publishedTime,
  modifiedTime,
  currentPath
}: SEOHeadProps) => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = language;

    const resolvedPath = currentPath || window.location.pathname || '/';
    const canonicalUrl = canonical || buildCanonicalUrl(resolvedPath);
    const DEFAULT_OG_IMAGE = 'https://dalil-tounes.com/images/logo_dalil_tounes_crop.png';
    const resolvedImage = image || DEFAULT_OG_IMAGE;
    const optimizedImage = isImageKitUrl(resolvedImage) ? getOgImageUrl(resolvedImage) : resolvedImage;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'author', content: author },
      { name: 'language', content: language },
      ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'googlebot', content: noindex ? 'noindex, nofollow' : 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: optimizedImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
      { property: 'og:url', content: canonical || url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Dalil Tounes' },
      { property: 'og:locale', content: language === 'ar' ? 'ar_TN' : language === 'fr' ? 'fr_TN' : `${language}_TN` },
      ...(type === 'article' && publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
      ...(type === 'article' && modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: optimizedImage },
      { name: 'twitter:image:alt', content: title },
      { name: 'twitter:site', content: '@daliltounes' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'geo.region', content: 'TN' },
      { name: 'geo.placename', content: 'Tunisia' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    });

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // Les variantes ?lang= sont rendues côté client et partagent encore le même canonical.
    // Tant qu'elles n'ont pas un HTML/canonical propre côté serveur, ne pas déclarer de
    // hreflang contradictoires à Google. On nettoie les anciennes balises éventuelles.
    const oldHreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    oldHreflangLinks.forEach(link => link.remove());

  }, [title, description, keywords, image, url, type, canonical, noindex, author, publishedTime, modifiedTime, language, currentPath]);

  return null;
};
