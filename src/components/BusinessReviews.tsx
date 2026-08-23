import { useEffect, useState } from 'react';
import { ExternalLink, Loader2, MessageSquare, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Review {
  id: string;
  note: number;
  commentaire: string;
  created_at: string;
  auteur: string | null;
}

interface GoogleReviewData {
  url: string;
  rating: number;
  count: number;
}

interface BusinessReviewsProps {
  entrepriseId: string;
}

const numericValue = (value: unknown): number => {
  const parsed = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function BusinessReviews({ entrepriseId }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [google, setGoogle] = useState<GoogleReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entrepriseId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const { data: business } = await supabase
        .from('entreprise')
        .select('google_url, "Note Google Globale", "Compteur Avis Google"')
        .eq('id', entrepriseId)
        .maybeSingle();

      if (cancelled) return;

      const googleUrl = String(business?.google_url || '').trim();
      if (googleUrl) {
        setGoogle({
          url: googleUrl,
          rating: numericValue(business?.['Note Google Globale']),
          count: Math.floor(numericValue(business?.['Compteur Avis Google'])),
        });
        setReviews([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('avis_entreprise')
        .select('id, note, commentaire, created_at, auteur')
        .eq('entreprise_id', entrepriseId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;
      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [entrepriseId]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'fill-[#D4AF37] text-[#D4AF37]'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-xs">Chargement des avis...</span>
      </div>
    );
  }

  if (google) {
    return (
      <a
        href={google.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 rounded-lg border border-[#D4AF37]/35 bg-black/15 p-3 text-white transition hover:border-[#D4AF37]/70 hover:bg-black/25"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 shrink-0 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#F4CE55]">Avis Google</span>
          </div>
          {(google.rating > 0 || google.count > 0) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {google.rating > 0 && renderStars(google.rating)}
              <span className="text-[11px] text-gray-300">
                {google.rating > 0 ? google.rating.toFixed(1) : ''}
                {google.count > 0 ? ` · ${google.count} avis` : ''}
              </span>
            </div>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#F4CE55]">
          Voir
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    );
  }

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + (review.note || 0), 0) / reviews.length
    : 0;

  return (
    <div className="rounded-xl border border-[#D4AF37]/30 bg-white/5 p-3">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold text-[#D4AF37]">Avis clients</h3>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            {renderStars(average)}
            <span className="text-[11px] text-gray-300">
              {average.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="py-2 text-center text-xs italic text-gray-400">
          Aucun avis pour le moment.
        </p>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {reviews.map(review => (
            <article
              key={review.id}
              className="rounded-lg border border-[#D4AF37]/10 bg-black/20 p-2.5"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-[#D4AF37]">
                  {review.auteur?.trim() || 'Anonyme'}
                </p>
                {renderStars(review.note)}
              </div>
              {review.commentaire && (
                <p className="text-xs leading-relaxed text-gray-200">« {review.commentaire} »</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
