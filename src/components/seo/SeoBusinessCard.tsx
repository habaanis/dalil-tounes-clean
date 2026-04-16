import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, ExternalLink } from 'lucide-react';
import { generateBusinessUrl } from '../../lib/slugify';

interface SeoBusinessCardProps {
  business: {
    id: string;
    nom: string;
    adresse?: string;
    ville?: string;
    gouvernorat?: string;
    telephone?: string;
    'catégorie'?: string[];
    'Note Google Globale'?: number | null;
    'Compteur Avis Google'?: number | null;
    logo_url?: string;
    description?: string;
    is_premium?: boolean;
  };
}

const SeoBusinessCard: React.FC<SeoBusinessCardProps> = ({ business }) => {
  const rating = business['Note Google Globale'];
  const reviewCount = business['Compteur Avis Google'];
  const location = [business.ville, business.gouvernorat].filter(Boolean).join(', ');
  const url = generateBusinessUrl(business.nom, business.id);

  return (
    <Link
      to={url}
      className="group block bg-[#1a1a1a] border border-gray-800 hover:border-[#D4AF37]/50 rounded-xl p-5 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(212,175,55,0.08)]"
    >
      <div className="flex items-start gap-4">
        {business.logo_url ? (
          <img
            src={business.logo_url}
            alt={`Logo ${business.nom}`}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-900"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-800 flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-600 text-lg font-semibold">
              {business.nom.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm group-hover:text-[#D4AF37] transition-colors truncate">
              {business.nom}
            </h3>
            {business.is_premium && (
              <span className="flex-shrink-0 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Premium
              </span>
            )}
          </div>

          {rating != null && rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-medium">{rating.toFixed(1)}</span>
              {reviewCount && reviewCount > 0 && (
                <span className="text-gray-600 text-xs">({reviewCount})</span>
              )}
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className="text-gray-500 text-xs truncate">{location}</span>
            </div>
          )}

          {business.telephone && (
            <div className="flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className="text-gray-500 text-xs">{business.telephone}</span>
            </div>
          )}

          {business.description && (
            <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          )}
        </div>

        <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-[#D4AF37]/60 flex-shrink-0 mt-0.5 transition-colors" />
      </div>
    </Link>
  );
};

export default SeoBusinessCard;
