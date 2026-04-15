import React from 'react';

interface InfoModalProps {
  title: string;
  content: string;
  accentColor?: string;
  onClose: () => void;
}

export const InfoModal = ({ title, content, accentColor = '#D4AF37', onClose }: InfoModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', animation: 'infoFadeIn 0.2s ease' }}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <div
        className="relative w-full"
        style={{
          maxWidth: '420px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          padding: '28px 24px 24px',
          animation: 'infoScaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '0.02em', flex: 1, paddingRight: '12px' }}>
            {title}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', lineHeight: 1, color: '#aaa', padding: 0, fontWeight: '300', flexShrink: 0 }}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: accentColor, marginBottom: '16px', opacity: 0.5 }} />

        <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>
          {content}
        </p>

        <div style={{ height: '1px', backgroundColor: accentColor, marginTop: '20px', marginBottom: '16px', opacity: 0.3 }} />

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: `1.5px solid ${accentColor}`,
            background: 'none',
            color: accentColor,
            fontFamily: 'Playfair Display, serif',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Fermer
        </button>
      </div>

      <style>{`
        @keyframes infoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes infoScaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default InfoModal;
