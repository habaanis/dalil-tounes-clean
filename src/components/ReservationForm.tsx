import React, { useState } from 'react';
import { CalendarDays, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export interface ReservationTranslations {
  title: string;
  formName: string;
  formPhone: string;
  formEmail: string;
  formDate: string;
  formTime: string;
  formMessage: string;
  formSubmit: string;
  success: string;
  notice: string;
  close: string;
  sending: string;
  error: string;
}

interface ReservationFormProps {
  businessId: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  accentColor?: string;
  translations: ReservationTranslations;
  isRTL?: boolean;
}

export default function ReservationForm({
  businessId,
  businessName,
  businessEmail,
  businessPhone,
  accentColor = '#D4AF37',
  translations: t,
  isRTL = false,
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
      setError(t.error);
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

  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1px solid ${accentColor}25`,
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = `${accentColor}60`);
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = `${accentColor}25`);

  if (success) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{
          backgroundColor: `${accentColor}08`,
          border: `1px solid ${accentColor}30`,
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <CheckCircle2 className="mx-auto mb-3" size={36} style={{ color: '#16a34a' }} />
        <p className="text-sm font-semibold text-white mb-1">{t.success}</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">{t.notice}</p>
        <button
          onClick={reset}
          className="text-xs font-medium transition-colors"
          style={{ color: accentColor }}
        >
          {t.close}
        </button>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
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
          <span>{t.title}</span>
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
          <p className="text-[11px] text-gray-500 leading-relaxed">{t.notice}</p>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder={`${t.formName} *`}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />

            <input
              type="tel"
              placeholder={`${t.formPhone} *`}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />

            <input
              type="email"
              placeholder={t.formEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
                title={t.formDate}
                className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />

              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
                title={t.formTime}
                className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>

            <textarea
              placeholder={t.formMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors resize-none"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: accentColor, color: '#000' }}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t.sending}
              </>
            ) : (
              t.formSubmit
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
