const SITE = 'Dalil Tounes';
const DOMAIN = 'https://dalil-tounes.com';

interface SeoMeta {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}

function cap(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '\u2026';
}

export function getHomeSeoMeta(): SeoMeta {
  return {
    title: `Annuaire Entreprises Tunisie | ${SITE}`,
    description: truncate(
      'Trouvez les meilleurs professionnels, commerces et services en Tunisie. Avis, horaires et coordonnees sur Dalil Tounes, annuaire de reference.',
      160,
    ),
    keywords: 'annuaire tunisie, entreprises tunisie, professionnels tunisie, commerces tunisie, services tunisie',
    canonical: DOMAIN,
  };
}

export function getVilleSeoMeta(villeLabel: string, villeSlug: string): SeoMeta {
  return {
    title: truncate(`Annuaire ${cap(villeLabel)} - Entreprises et pros | ${SITE}`, 65),
    description: truncate(
      `Decouvrez les entreprises, medecins, restaurants et services a ${cap(villeLabel)}. Avis verifies, horaires et coordonnees sur ${SITE}.`,
      160,
    ),
    keywords: `entreprise ${villeLabel}, annuaire ${villeLabel}, professionnel ${villeLabel}, services ${villeLabel} tunisie`,
    canonical: `${DOMAIN}/ville/${villeSlug}`,
  };
}

export function getMetierSeoMeta(metierLabel: string, metierSlug: string, secteur?: string): SeoMeta {
  const ml = metierLabel.toLowerCase();
  return {
    title: truncate(`${cap(metierLabel)} en Tunisie - Annuaire et avis | ${SITE}`, 65),
    description: truncate(
      `Trouvez un ${ml} de confiance en Tunisie. Annuaire complet avec avis clients, horaires et coordonnees.`,
      160,
    ),
    keywords: `${ml} tunisie, meilleur ${ml}, annuaire ${ml}${secteur ? `, ${secteur} tunisie` : ''}`,
    canonical: `${DOMAIN}/metier/${metierSlug}`,
  };
}

export function getMetierVilleSeoMeta(
  metierLabel: string,
  villeLabel: string,
  slug: string,
  secteur?: string,
): SeoMeta {
  const ml = metierLabel.toLowerCase();
  return {
    title: truncate(`${cap(metierLabel)} a ${cap(villeLabel)} - Adresses et avis | ${SITE}`, 65),
    description: truncate(
      `Les meilleurs ${ml}s a ${cap(villeLabel)}. Consultez avis, horaires et coordonnees sur ${SITE}.`,
      160,
    ),
    keywords: `${ml} ${villeLabel}, ${ml} ${villeLabel} tunisie${secteur ? `, ${secteur} ${villeLabel}` : ''}`,
    canonical: `${DOMAIN}/${slug}`,
  };
}

export function getMetierSousCatVilleSeoMeta(
  metierLabel: string,
  sousCatLabel: string | null,
  villeLabel: string,
  slug: string,
  secteur?: string,
): SeoMeta {
  const ml = metierLabel.toLowerCase();
  if (sousCatLabel) {
    const scl = sousCatLabel.toLowerCase();
    return {
      title: truncate(`${cap(metierLabel)} ${scl} a ${cap(villeLabel)} | ${SITE}`, 65),
      description: truncate(
        `${cap(metierLabel)} specialise en ${scl} a ${cap(villeLabel)}. Avis, coordonnees et horaires sur ${SITE}.`,
        160,
      ),
      keywords: `${ml} ${scl} ${villeLabel}, ${ml} ${scl} tunisie${secteur ? `, ${secteur} ${villeLabel}` : ''}`,
      canonical: `${DOMAIN}/${slug}`,
    };
  }
  return getMetierVilleSeoMeta(metierLabel, villeLabel, slug, secteur);
}

export function getSecteurSeoMeta(
  secteurLabel: string,
  secteurSlug: string,
  description?: string,
  keywords?: string[],
): SeoMeta {
  return {
    title: truncate(`${cap(secteurLabel)} en Tunisie - Pros et entreprises | ${SITE}`, 65),
    description: truncate(
      description || `Annuaire des professionnels du secteur ${secteurLabel.toLowerCase()} en Tunisie. Trouvez les meilleures entreprises avec avis et coordonnees.`,
      160,
    ),
    keywords: keywords?.join(', ') || `${secteurLabel.toLowerCase()} tunisie, entreprise ${secteurLabel.toLowerCase()}, professionnel ${secteurLabel.toLowerCase()}`,
    canonical: `${DOMAIN}/secteur/${secteurSlug}`,
  };
}

export function getGouvernoratSeoMeta(
  gouvernoratLabel: string,
  gouvernoratSlug: string,
  description?: string,
  keywords?: string[],
): SeoMeta {
  return {
    title: truncate(`Entreprises gouvernorat ${cap(gouvernoratLabel)} | ${SITE}`, 65),
    description: truncate(
      description || `Toutes les entreprises et professionnels du gouvernorat de ${cap(gouvernoratLabel)}. Avis, horaires et coordonnees sur ${SITE}.`,
      160,
    ),
    keywords: keywords?.join(', ') || `entreprise ${gouvernoratLabel}, annuaire ${gouvernoratLabel}, gouvernorat ${gouvernoratLabel} tunisie`,
    canonical: `${DOMAIN}/gouvernorat/${gouvernoratSlug}`,
  };
}

export function getBusinessSeoMeta(business: {
  nom: string;
  ville?: string | null;
  telephone?: string | null;
  categorie?: string;
  description?: string | null;
}, canonicalUrl: string): SeoMeta {
  const cat = business.categorie || '';
  const ville = business.ville || 'Tunisie';
  return {
    title: truncate(`${business.nom}${cat ? ` - ${cat}` : ''} a ${ville} | ${SITE}`, 65),
    description: truncate(
      business.description || `${business.nom} a ${ville}. ${cat ? cat + '. ' : ''}Avis, horaires et coordonnees sur ${SITE}.`,
      160,
    ),
    keywords: [business.nom, cat, ville, 'Tunisie'].filter(Boolean).join(', '),
    canonical: canonicalUrl,
  };
}

export function getBlogSeoMeta(): SeoMeta {
  return {
    title: `Blog et actualites Tunisie | ${SITE}`,
    description: truncate(
      'Articles, guides et actualites sur les entreprises et services en Tunisie. Conseils pratiques par Dalil Tounes.',
      160,
    ),
    keywords: 'blog tunisie, actualites entreprises tunisie, guides professionnels tunisie',
    canonical: `${DOMAIN}/blog`,
  };
}

export function getBlogPostSeoMeta(postTitle: string, excerpt: string, slug: string): SeoMeta {
  return {
    title: truncate(`${postTitle} | Blog ${SITE}`, 65),
    description: truncate(excerpt || `${postTitle}. Lisez cet article sur le blog de ${SITE}.`, 160),
    keywords: '',
    canonical: `${DOMAIN}/blog/${slug}`,
  };
}

export function getConceptSeoMeta(): SeoMeta {
  return {
    title: `Notre concept - Vision et mission | ${SITE}`,
    description: truncate(
      "Decouvrez la vision de Dalil Tounes : l'Humain, le Digital et le Patrimoine reunis pour booster la visibilite des entreprises tunisiennes.",
      160,
    ),
    keywords: 'dalil tounes concept, annuaire tunisie vision, entreprises tunisiennes visibilite',
    canonical: `${DOMAIN}/notre-concept`,
  };
}
