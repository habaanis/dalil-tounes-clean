import { useState } from 'react';
import { Star, Send, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { useLanguage } from '../context/LanguageContext';

interface AvisFormProps {
  sellerId: string;
  announcementId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const copy = {
  fr: {
    ratingLabel: 'Votre note *',
    commentLabel: 'Votre commentaire *',
    commentPlaceholder: 'Partagez votre expérience avec ce vendeur... (500 caractères max)',
    charsCount: 'caractères',
    cancel: 'Annuler',
    publishing: 'Publication...',
    submit: 'Publier l'avis',
    errorSelectRating: 'Veuillez sélectionner une note',
    errorCommentRequired: 'Veuillez écrire un commentaire',
    errorLoginRequired: 'Vous devez être connecté pour laisser un avis',
    errorAlreadyReviewed: 'Vous avez déjà laissé un avis pour cette annonce',
    errorSelfReview: 'Vous ne pouvez pas noter votre propre annonce',
    errorInvalidRating: 'La note doit être entre 1 et 5',
    successPublished: 'Votre avis a été publié avec succès !',
    errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
    ratings: ['Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Excellent'],
  },
  en: {
    ratingLabel: 'Your rating *',
    commentLabel: 'Your comment *',
    commentPlaceholder: 'Share your experience with this seller... (500 characters max)',
    charsCount: 'characters',
    cancel: 'Cancel',
    publishing: 'Publishing...',
    submit: 'Publish review',
    errorSelectRating: 'Please select a rating',
    errorCommentRequired: 'Please write a comment',
    errorLoginRequired: 'You must be logged in to leave a review',
    errorAlreadyReviewed: 'You have already reviewed this ad',
    errorSelfReview: 'You cannot rate your own ad',
    errorInvalidRating: 'Rating must be between 1 and 5',
    successPublished: 'Your review has been published successfully!',
    errorOccurred: 'An error occurred. Please try again.',
    ratings: ['Very bad', 'Bad', 'Average', 'Good', 'Excellent'],
  },
  ar: {
    ratingLabel: 'تقييمك *',
    commentLabel: 'تعليقك *',
    commentPlaceholder: 'شارك تجربتك مع هذا البائع... (500 حرف كحد أقصى)',
    charsCount: 'حرف',
    cancel: 'إلغاء',
    publishing: 'جاري النشر...',
    submit: 'نشر التقييم',
    errorSelectRating: 'يرجى اختيار تقييم',
    errorCommentRequired: 'يرجى كتابة تعليق',
    errorLoginRequired: 'يجب تسجيل الدخول لترك تقييم',
    errorAlreadyReviewed: 'لقد قمت بالفعل بترك تقييم لهذا الإعلان',
    errorSelfReview: 'لا يمكنك تقييم إعلانك الخاص',
    errorInvalidRating: 'يجب أن يكون التقييم بين 1 و 5',
    successPublished: 'تم نشر تقييمك بنجاح!',
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    ratings: ['سيء جداً', 'سيء', 'متوسط', 'جيد', 'ممتاز'],
  },
  it: {
    ratingLabel: 'Il tuo voto *',
    commentLabel: 'Il tuo commento *',
    commentPlaceholder: 'Condividi la tua esperienza con questo venditore... (max 500 caratteri)',
    charsCount: 'caratteri',
    cancel: 'Annulla',
    publishing: 'Pubblicazione...',
    submit: 'Pubblica recensione',
    errorSelectRating: 'Seleziona un voto',
    errorCommentRequired: 'Scrivi un commento',
    errorLoginRequired: 'Devi essere loggato per lasciare una recensione',
    errorAlreadyReviewed: 'Hai già lasciato una recensione per questo annuncio',
    errorSelfReview: 'Non puoi valutare il tuo annuncio',
    errorInvalidRating: 'Il voto deve essere tra 1 e 5',
    successPublished: 'La tua recensione è stata pubblicata con successo!',
    errorOccurred: 'Si è verificato un errore. Riprova.',
    ratings: ['Pessimo', 'Brutto', 'Medio', 'Buono', 'Eccellente'],
  },
  ru: {
    ratingLabel: 'Ваша оценка *',
    commentLabel: 'Ваш комментарий *',
    commentPlaceholder: 'Поделитесь своим опытом работы с этим продавцом... (макс. 500 символов)',
    charsCount: 'символов',
    cancel: 'Отмена',
    publishing: 'Публикация...',
    submit: 'Опубликовать отзыв',
    errorSelectRating: 'Пожалуйста, выберите оценку',
    errorCommentRequired: 'Пожалуйста, напишите комментарий',
    errorLoginRequired: 'Вы должны войти, чтобы оставить отзыв',
    errorAlreadyReviewed: 'Вы уже оставили отзыв для этого объявления',
    errorSelfReview: 'Вы не можете оценить своё объявление',
    errorInvalidRating: 'Оценка должна быть от 1 до 5',
    successPublished: 'Ваш отзыв успешно опубликован!',
    errorOccurred: 'Произошла ошибка. Попробуйте снова.',
    ratings: ['Очень плохо', 'Плохо', 'Средне', 'Хорошо', 'Отлично'],
  },
};

type Lang = keyof typeof copy;

export default function AvisForm({ sellerId, announcementId, onSuccess, onCancel }: AvisFormProps) {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showToastMessage('error', t.errorSelectRating);
      return;
    }

    if (!comment.trim()) {
      showToastMessage('error', t.errorCommentRequired);
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showToastMessage('error', t.errorLoginRequired);
        setLoading(false);
        return;
      }

      const { data: existingReview } = await supabase
        .from('avis_vendeur')
        .select('id')
        .eq('annonce_id', announcementId)
        .eq('evaluateur_email', user.email)
        .single();

      if (existingReview) {
        showToastMessage('error', t.errorAlreadyReviewed);
        setLoading(false);
        return;
      }

      if (user.email === sellerId) {
        showToastMessage('error', t.errorSelfReview);
        setLoading(false);
        return;
      }

      const avisData = {
        annonce_id: announcementId,
        vendeur_email: sellerId,
        evaluateur_email: user.email || `user_${user.id}`,
        note: rating,
        commentaire: comment.trim()
      };

      if (avisData.note < 1 || avisData.note > 5) {
        showToastMessage('error', t.errorInvalidRating);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('avis_vendeur')
        .insert([avisData]);

      if (insertError) {
        throw insertError;
      }

      showToastMessage('success', t.successPublished);

      setRating(0);
      setComment('');

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error: any) {
      console.error('Erreur avis:', error);
      showToastMessage('error', t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-10 h-10 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t.ratingLabel}
          </label>
          {renderStars()}
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {'⭐'.repeat(rating)} {t.ratings[rating - 1]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.commentLabel}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
            placeholder={t.commentPlaceholder}
            required
          />
          <p className={`text-xs text-gray-500 mt-1 ${isRTL ? 'text-left' : 'text-right'}`}>
            {comment.length} / 500 {t.charsCount}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            disabled={loading}
          >
            <X className="w-5 h-5" />
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading || rating === 0 || !comment.trim()}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D62828] to-[#b91c1c] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.publishing}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t.submit}
              </>
            )}
          </button>
        </div>
      </form>

      {showToast && (
        <div className={`fixed ${isRTL ? 'left-8' : 'right-8'} bottom-8 z-[100] animate-slide-up`}>
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
              toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
