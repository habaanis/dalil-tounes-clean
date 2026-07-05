import { QRCodeCanvas } from 'qrcode.react';

interface BusinessQRCodeProps {
  id: string;
  slug?: string | null;
  size?: number;
  className?: string;
}

const DALIL_GOLD = '#D4AF37';
const PUBLIC_BASE = 'https://daliltounes.com/etablissement/';
const LOGO_SRC = '/images/logo_dalil_tounes_sceau_luxe.png';

export function buildEntrepriseUrl(id: string, slug?: string | null): string {
  const key = (slug && slug.trim().length > 0) ? slug.trim() : id;
  return `${PUBLIC_BASE}${encodeURIComponent(key)}`;
}

export default function BusinessQRCode({ id, slug, size = 500, className }: BusinessQRCodeProps) {
  const url = buildEntrepriseUrl(id, slug);
  const logoSize = Math.round(size * 0.22);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        border: `2px solid ${DALIL_GOLD}`,
        display: 'inline-block',
      }}
    >
      <QRCodeCanvas
        value={url}
        size={size - 32}
        bgColor="#FFFFFF"
        fgColor={DALIL_GOLD}
        level="Q"
        includeMargin={false}
        imageSettings={{
          src: LOGO_SRC,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }}
      />
    </div>
  );
}
