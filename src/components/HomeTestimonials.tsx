import { useEffect, useState } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

interface Testimonial {
  id: string;
  note: number;
  commentaire: string;
  created_at: string;
  auteur: string | null;
}

export default function HomeTestimonials() {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('avis_entreprise')
        .select('id, note, commentaire, created_at, auteur')
        .is('entreprise_id', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (cancelled) return;

      if (err) {
        setError(err.message || 'Erreur de chargement');
        setTestimonials([]);
      } else {
        setTestimonials((data as Testimonial[]) || []);
      }
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="ml-2 text-sm">{language === 'fr' ? 'Chargement des témoignages...' : language === 'ar' ? 'جارٍ تحميل الشهادات...' : language === 'en' ? 'Loading testimonials...' : language === 'it' ? 'Caricamento testimonianze...' : 'Загрузка отзывов...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        {language === 'fr' ? 'Témoignages momentanément indisponibles.' : language === 'ar' ? 'الشهادات غير متاحة مؤقتاً.' : language === 'en' ? 'Testimonials temporarily unavailable.' : language === 'it' ? 'Testimonianze temporaneamente non disponibili.' : 'Отзывы временно недоступны.'}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        {language === 'fr' ? 'Aucun témoignage pour le moment.' : language === 'ar' ? 'لا توجد شهادات حالياً.' : language === 'en' ? 'No testimonials yet.' : language === 'it' ? 'Nessuna testimonianza per ora.' : 'Пока нет отзывов.'}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map(t => (
        <article
          key={t.id}
          className="relative bg-white rounded-xl border border-[#D4AF37]/40 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(74,29,67,0.08)] transition-all duration-300"
        >
          <Quote className="absolute top-3 right-3 w-5 h-5 text-[#D4AF37]/30" />
          <div className="mb-3">{renderStars(t.note)}</div>
          <p className="text-sm text-gray-700 leading-relaxed italic mb-4 line-clamp-4">
            « {t.commentaire} »
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-[#4A1D43]">
              {t.auteur && t.auteur.trim() ? t.auteur : (language === 'fr' ? 'Anonyme' : language === 'ar' ? 'مجهول' : language === 'en' ? 'Anonymous' : language === 'it' ? 'Anonimo' : 'Аноним')}
            </p>
            <time className="text-[11px] text-gray-400">
              {new Date(t.created_at).toLocaleDateString('fr-FR', {
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </div>
        </article>
      ))}
    </div>
  );
}
