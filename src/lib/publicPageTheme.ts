/** Presentation boundary only: never changes routing or client palettes. */
export function usesPublicPageTheme(pathname: string, dedicatedClientHost = false): boolean {
  if (dedicatedClientHost) return false;
  const path = pathname.replace(/\/+$/, '') || '/';
  if (/^\/(?:entreprise|business|cv|p|qr-business)(?:\/|$)/.test(path)) return false;
  if (/^\/entreprises\/.+/.test(path) || /^\/[^/]+\/cv$/.test(path)) return false;
  if (/^\/(?:admin|debug|dashboard|commercial|preview)(?:\/|$)/.test(path)) return false;
  if (['/searchDebug', '/card-preview', '/apercu-ouverture-prestige'].includes(path)) return false;
  if (/^\/emplois\/(?:mes-recommandations|[^/]+\/candidats)$/.test(path)) return false;
  return true;
}
