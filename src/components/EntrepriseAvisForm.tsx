import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useFormTranslation } from '../hooks/useFormTranslation';

interface EntrepriseAvisFormProps {
  entrepriseId?: string | null;
  onSuccess?: () => void;
}

export default function EntrepriseAvisForm({ entrepriseId, onSuccess }: EntrepriseAvisFormProps) {
  const { label, placeholder, button, message } = useFormTranslation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('idle');
    setErrorDetail('');

    const commentaireValue = (comment || '').trim();

    if (rating === 0) {
      alert('Merci de sélectionner une note.');
      return;
    }

    if (!commentaireValue) {
      alert("Merci d'écrire un commentaire");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        entreprise_id: entrepriseId ?? null,
        note: rating,
        commentaire: commentaireValue,
        status: 'approved',
      };
      const { error: insertError } = await supabase
        .from('avis_entreprise')
        .insert(payload);

      if (insertError) {
        setSubmitState('error');
        setErrorDetail(message('erreur_envoi') || 'Erreur — merci de réessayer.');
        return;
      }

      setSubmitState('success');
      setRating(0);
      setComment('');

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2500);
      }
    } catch (err: any) {
      setSubmitState('error');
      setErrorDetail(err?.message ?? 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px 6px',
    borderRadius: '4px',
    border: '1px solid #D4AF37',
    fontSize: '10px',
    outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#D4AF37',
    marginBottom: '3px',
  };

  return (
    <div
      style={{
        border: '1px solid #D4AF37',
        borderRadius: '6px',
        padding: '6px',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Étoiles */}
        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignItems: 'center', marginBottom: '3px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px' }}
            >
              <Star
                style={{
                  width: '14px',
                  height: '14px',
                  fill: star <= rating ? '#D4AF37' : '#E5E7EB',
                  color: star <= rating ? '#D4AF37' : '#D1D5DB',
                }}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p style={{ textAlign: 'center', fontSize: '9px', color: '#D4AF37', marginBottom: '3px' }}>
            {rating === 1 && 'Très mauvais'}
            {rating === 2 && 'Mauvais'}
            {rating === 3 && 'Moyen'}
            {rating === 4 && 'Bon'}
            {rating === 5 && 'Excellent'}
          </p>
        )}

        {/* Commentaire (obligatoire) */}
        <div style={{ marginBottom: '3px' }}>
          <label
            htmlFor="avis-commentaire"
            style={{ display: 'block', fontSize: '9px', color: '#D4AF37', marginBottom: '2px', fontWeight: 600 }}
          >
            {label('commentaire') || 'Commentaire'} <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            id="avis-commentaire"
            name="commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            aria-required="true"
            style={{ ...inputStyle, resize: 'vertical', marginBottom: '1px', minHeight: '60px' }}
            placeholder={placeholder('votre_commentaire')}
          />
          <p style={{ textAlign: 'right', fontSize: '8px', color: '#D4AF37' }}>
            {comment.length}/500
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              background: submitting ? '#374151' : '#064E3B',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              fontSize: '9px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.2s ease',
            }}
          >
            <Send style={{ width: '10px', height: '10px' }} />
            {submitting ? 'Envoi...' : button('envoyer')}
          </button>
        </div>

        {submitState === 'success' && (
          <div style={{
            marginTop: '6px',
            padding: '8px 10px',
            borderRadius: '6px',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid #34D399',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '10px', color: '#34D399', fontWeight: '700', margin: 0 }}>
              Avis envoyé !
            </p>
            <p style={{ fontSize: '9px', color: '#34D399', margin: '2px 0 0' }}>
              Votre avis est en cours de validation et sera publié prochainement.
            </p>
          </div>
        )}

        {submitState === 'error' && (
          <div style={{
            marginTop: '6px',
            padding: '8px 10px',
            borderRadius: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
          }}>
            <p style={{ fontSize: '10px', color: '#FCA5A5', fontWeight: '700', margin: '0 0 2px' }}>
              Erreur — avis non envoyé
            </p>
            {errorDetail && (
              <pre style={{ fontSize: '8px', color: '#FCA5A5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {errorDetail}
              </pre>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
