import React, { useEffect, useState } from 'react';
import SeoBusinessCard from './SeoBusinessCard';
import { fetchSimilarBusinesses } from '../../lib/seoBusinessQueries';
import type { SeoBusiness } from '../../lib/seoBusinessQueries';

interface SimilarBusinessesProps {
  businessId: string;
  categorie?: string;
  ville?: string;
  gouvernorat?: string;
}

const SimilarBusinesses: React.FC<SimilarBusinessesProps> = ({
  businessId,
  categorie,
  ville,
  gouvernorat,
}) => {
  const [businesses, setBusinesses] = useState<SeoBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId || (!categorie && !ville)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchSimilarBusinesses({
      excludeId: businessId,
      categorie,
      ville,
      gouvernorat,
      limit: 4,
    }).then((data) => {
      if (!cancelled) {
        setBusinesses(data);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [businessId, categorie, ville, gouvernorat]);

  if (!loading && businesses.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-gray-800">
      <h2
        className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider"
        style={{ letterSpacing: '0.08em' }}
      >
        Entreprises similaires
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {businesses.map((b) => (
            <SeoBusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarBusinesses;
