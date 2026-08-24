import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 500);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-[9998] inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37] bg-[#4A1D43] text-[#F4CE55] shadow-[0_8px_24px_rgba(74,29,67,0.28)] transition hover:-translate-y-0.5 hover:bg-[#5A2D53] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] md:bottom-6 md:right-6"
      aria-label="Remonter en haut de la page"
      title="Remonter en haut"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
