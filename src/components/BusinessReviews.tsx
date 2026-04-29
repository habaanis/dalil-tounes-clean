import { useEffect, useState } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Review {
  id: string;
  note: number;
  commentaire: string;
  auteur: string;
  created_at: string;
}

interface BusinessReviewsProps {
  entrepriseId: string;
}

export default function BusinessReviews({ entrepriseId }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entrepriseId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('avis_entreprise')
        .select('id, note, commentaire, auteur, created_at')
        .eq('entreprise_id', entrepriseId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;
      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [entrepriseId]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const average = reviews.length
    ? reviews.reduce((s, r) => s + (r.note || 0), 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="ml-2 text-xs">Chargement des avis...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <h3
            className="text-sm font-semibold text-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Avis clients
          </h3>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            {renderStars(Math.round(average))}
            <span className="text-xs text-gray-300">
              {average.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-4 italic">
          Aucun avis pour le moment.
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {reviews.map(r => (
            <article
              key={r.id}
              className="bg-black/20 rounded-lg p-3 border border-[#D4AF37]/10"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <p
                  className="text-xs font-bold text-[#D4AF37]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {r.auteur || 'Anonyme'}
                </p>
                {renderStars(r.note)}
              </div>
              {r.commentaire && (
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  « {r.commentaire} »
                </p>
              )}
              <time className="text-[10px] text-gray-500 mt-2 block">
                {new Date(r.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
