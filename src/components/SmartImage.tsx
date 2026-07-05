import { ImgHTMLAttributes, useState } from 'react';
import {
  altFromImageKitUrl,
  buildResponsiveSrcSet,
  isImageKitUrl,
  getDefaultImagePath,
} from '../lib/imagekitUtils';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'src'> {
  src: string | null | undefined;
  alt?: string;
  altContext?: string;
  widths?: number[];
  sizes?: string;
  fallback?: string;
}

/**
 * Composant d'image intelligent :
 *  - srcSet responsive pour images ImageKit
 *  - alt auto-généré depuis le nom de fichier si non fourni
 *  - width/height pour éviter le CLS
 *  - decoding=async + loading=lazy par défaut
 */
export default function SmartImage({
  src,
  alt,
  altContext,
  widths = [320, 640, 960, 1280],
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  fallback,
  loading = 'lazy',
  decoding = 'async',
  width,
  height,
  ...rest
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const finalFallback = fallback || getDefaultImagePath();
  const resolvedSrc = !src || hasError ? finalFallback : src;

  const resolvedAlt =
    alt && alt.trim().length > 0
      ? alt
      : altFromImageKitUrl(src, altContext) || altContext || '';

  const srcSet = isImageKitUrl(resolvedSrc)
    ? buildResponsiveSrcSet(resolvedSrc, widths)
    : undefined;

  return (
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={resolvedAlt}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
