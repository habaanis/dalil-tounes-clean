import React from 'react';
import { isImageKitUrl } from '../lib/imagekitUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

function toWebp(src: string, width?: number): string {
  if (!src) return src;
  if (isImageKitUrl(src)) {
    const hasQuery = src.includes('?');
    const tr = width ? `tr=w-${width},f-auto,q-85` : `tr=f-auto,q-85`;
    if (src.includes('tr=')) return src;
    return `${src}${hasQuery ? '&' : '?'}${tr}`;
  }
  if (src.includes('supabase.co')) {
    const hasQuery = src.includes('?');
    return `${src}${hasQuery ? '&' : '?'}format=webp`;
  }
  return src;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  onError,
}) => {
  const optimizedSrc = toWebp(src, width);
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...{ fetchpriority: priority ? 'high' : 'auto' }}
      onError={onError}
    />
  );
};

export default OptimizedImage;
