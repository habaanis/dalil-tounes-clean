import React, { useState } from 'react';
import { CalendarDays, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ReservationFormProps {
  businessId: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  accentColor?: string;
}

export default function ReservationForm({
  businessId,
  businessName,
  businessEmail,
  businessPhone,
  accentColor = '#D4AF37',
}: ReservationFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [message, setMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const canSubmit = nom.trim() && telephone.trim() && date && heure;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('reservations').insert({
      business_id: businessId,
      business_name: businessName,
      business_email: businessEmail || null,
      business_phone: businessPhone || null,
      customer_name: nom.trim(),
      customer_phone: telephone.trim(),
      customer_email: email.trim() || null,
      requested_date: date,
      requested_time: heure,
      message: message.trim() || null,
      source: 'business_detail',
      status: 'new',
    });

    setSubmitting(false);

    if (insertError) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      return;
    }

    setSuccess(true);
  };

  const reset = () => {
    setSuccess(false);
    setNom('');
    setTelephone('');
    setEmail('');
    setDate('');
    setHeure('');
    setMessage('');
    setOpen(false);
  };

  if (success) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{
          backgroundColor: `${accentColor}08`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <CheckCircle2
          className="mx-auto mb-3"
          size={36}
          style={{ color: '#16a34a' }}
        />
        <p className="text-sm font-semibold text-white mb-1">
          Demande envoyee avec succes !
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Votre demande de rendez-vous a ete transmise a {businessName}.
          L'etablissement vous contactera pour confirmer.
        </p>
        <button
          onClick={reset}
          className="text-xs font-medium transition-colors"
          style={{ color: accentColor }}
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
          border: `1px solid ${accentColor}40`,
        }}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>Prendre RDV / Reserver</span>
        </span>
        <ChevronDown
          size={14}
          className="transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
          opacity: open ? 1 : 0,
        }}
      >
        <form onSubmit={handleSubmit} className="pt-3 space-y-3">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Remplissez ce formulaire pour envoyer une demande de rendez-vous.
            L'etablissement vous recontactera pour confirmer.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Votre nom *"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${accentColor}25`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
            />

            <input
              type="tel"
              placeholder="Votre telephone *"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${accentColor}25`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
            />

            <input
              type="email"
              placeholder="Votre email (optionnel)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${accentColor}25`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
                className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${accentColor}25`,
                  colorScheme: 'dark',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
                onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
              />

              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${accentColor}25`,
                  colorScheme: 'dark',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
                onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
              />
            </div>

            <textarea
              placeholder="Message ou precisions (optionnel)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors resize-none"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${accentColor}25`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${accentColor}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${accentColor}25`)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
            style={{
              backgroundColor: accentColor,
              color: '#000',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer la demande'
            )}
          </button>

          <p className="text-[10px] text-gray-600 text-center leading-relaxed">
            Ce formulaire transmet une demande. La confirmation depend de l'etablissement.
          </p>
        </form>
      </div>
    </div>
  );
}
