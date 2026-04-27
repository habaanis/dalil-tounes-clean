import { useState } from 'react';
import { Facebook, Twitter, Instagram, Link2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SocialShareButtonsProps {
  title: string;
  url?: string;
}

export const SocialShareButtons = ({ title, url }: SocialShareButtonsProps) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState<'link' | 'instagram' | false>(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const labels = {
    fr: {
      heading: 'Partager cet article',
      copyLink: 'Copier le lien',
      copied: 'Lien copié !',
      instagram: 'Instagram',
      instagramCopied: 'Lien copié ! Ouvrez Instagram et collez-le dans votre story ou message.',
    },
    en: {
      heading: 'Share this article',
      copyLink: 'Copy link',
      copied: 'Link copied!',
      instagram: 'Instagram',
      instagramCopied: 'Link copied! Open Instagram and paste it in your story or message.',
    },
    ar: {
      heading: 'شارك هذا المقال',
      copyLink: 'نسخ الرابط',
      copied: 'تم نسخ الرابط!',
      instagram: 'إنستغرام',
      instagramCopied: 'تم نسخ الرابط! افتح إنستغرام والصقه في قصتك أو رسالتك.',
    },
    it: {
      heading: 'Condividi questo articolo',
      copyLink: 'Copia link',
      copied: 'Link copiato!',
      instagram: 'Instagram',
      instagramCopied: 'Link copiato! Apri Instagram e incollalo nella storia o nel messaggio.',
    },
  };

  const l = labels[language as keyof typeof labels] || labels.fr;

  const copyToClipboard = async (platform: 'link' | 'instagram') => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(platform);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silent
    }
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;

  const btnBase =
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5';

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-5 text-center">
        {l.heading}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-[#1877F2] hover:bg-[#0C63D4] text-white`}
          aria-label="Facebook"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-[#25D366] hover:bg-[#128C7E] text-white`}
          aria-label="WhatsApp"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-black hover:bg-gray-800 text-white`}
          aria-label="Twitter"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </a>

        <button
          onClick={() => copyToClipboard('link')}
          className={`${btnBase} ${
            copied === 'link'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          aria-label={l.copyLink}
        >
          {copied === 'link' ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {copied === 'link' ? l.copied : l.copyLink}
        </button>

        <button
          onClick={() => copyToClipboard('instagram')}
          className={`${btnBase} ${
            copied === 'instagram'
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-[#E4405F] via-[#F77737] to-[#FCAF45] hover:opacity-90 text-white'
          }`}
          aria-label={l.instagram}
        >
          <Instagram className="w-4 h-4" />
          {copied === 'instagram' ? l.instagramCopied : l.instagram}
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
