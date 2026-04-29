import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { supabase, supabaseUrl } from '../lib/supabaseClient';
import { useFormTranslation } from '../hooks/useFormTranslation';

interface EntrepriseAvisFormProps {
  entrepriseId?: string | null;
  onSuccess?: () => void;
}

export default function EntrepriseAvisForm({ entrepriseId, onSuccess }: EntrepriseAvisFormProps) {
  const { label, placeholder, button, message, submission_lang } = useFormTranslation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [auteur, setAuteur] = useState('');
  const [auteurEmail, setAuteurEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('idle');
    setErrorDetail('');

    if (rating === 0 || !comment.trim()) {
      setSubmitState('error');
      setErrorDetail(message('champ_requis'));
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('avis_entreprise')
        .insert({
          entreprise_id: entrepriseId ?? null,
          note: rating,
          commentaire: comment.trim(),
          auteur: auteur.trim(),
          auteur_email: auteurEmail.trim(),
          status: 'pending',
          date: new Date().toISOString(),
          submission_lang,
        });

      if (insertError) {
        console.error('Erreur insertion:', insertError);
        setSubmitState('error');
        setErrorDetail(JSON.stringify(insertError, null, 2));
        return;
      }

      setSubmitState('success');
      setRating(0);
      setComment('');
      setAuteur('');
      setAuteurEmail('');

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2500);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setSubmitState('error');
      setErrorDetail(err?.message ?? JSON.stringify(err));
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
      {/* Diagnostic projet connecté */}
      <div style={{
        marginBottom: '6px',
        padding: '4px 6px',
        borderRadius: '4px',
        backgroundColor: 'rgba(30,58,138,0.5)',
        border: '1px solid #3B82F6',
        fontFamily: 'monospace',
      }}>
        <p style={{ fontSize: '8px', color: '#93C5FD', margin: 0 }}>
          Projet : <strong style={{ color: '#fff' }}>{supabaseUrl.replace('https://', '').split('.')[0]}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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

        {/* Nom (optionnel) */}
        <input
          type="text"
          value={auteur}
          onChange={(e) => setAuteur(e.target.value)}
          maxLength={80}
          placeholder="Votre nom (optionnel)"
          style={inputStyle}
        />

        {/* Email (optionnel) */}
        <input
          type="email"
          value={auteurEmail}
          onChange={(e) => setAuteurEmail(e.target.value)}
          maxLength={120}
          placeholder="Votre email (optionnel, non publié)"
          style={inputStyle}
        />

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
            minLength={3}
            maxLength={500}
            required
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
