import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { supabaseAnonKey, supabaseUrl } from '../lib/supabaseClient';

type Preview = {
  nom: string; categorie: string; description: string; services: string; a_propos: string;
  nom_ar?: string; categorie_ar?: string; description_ar?: string; services_ar?: string; a_propos_ar?: string;
  ville: string; gouvernorat: string; adresse: string; telephone: string; whatsapp: string;
  ville_ar?: string; gouvernorat_ar?: string;
  email: string; site_web: string; image_url: string; logo_url: string;
  lien_facebook: string; lien_instagram: string; modele_cv: string;
  palette_cv: string; formule_commerciale: string;
};

const link = (url: string) => {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
};

export default function BusinessPrivatePreview() {
  const { token } = useParams<{ token: string }>();
  const [query] = useSearchParams();
  const french = query.get('lang') === 'fr';
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const portfolio = /portfolio/i.test(preview?.modele_cv || '');
  const night = /night|nuit|bleu/i.test(preview?.palette_cv || '');
  const ivory = /ivory|ivoire/i.test(preview?.palette_cv || '');
  const background = night ? '#0f1f35' : ivory ? '#f6f1e6' : '#113f35';
  const foreground = ivory ? '#28332e' : '#ffffff';
  const accent = night ? '#b5d4ee' : ivory ? '#7c5e3c' : '#d5bd7b';

  useEffect(() => {
    document.title = french ? 'Aperçu privé — Dalil Tounes' : 'معاينة خاصة — دليل تونس';
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing || document.createElement('meta');
    const previous = meta.content;
    meta.name = 'robots';
    meta.content = 'noindex,nofollow,noarchive';
    if (!meta.isConnected) document.head.appendChild(meta);
    return () => { if (existing) meta.content = previous; else meta.remove(); };
  }, [french]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${supabaseUrl}/functions/v1/business-preview?token=${encodeURIComponent(token || '')}`, {
      headers: { apikey: supabaseAnonKey },
      cache: 'no-store',
    }).then(async response => {
      if (!response.ok) throw new Error('preview unavailable');
      return response.json();
    }).then(data => {
      if (!cancelled) setPreview(data.preview as Preview);
    }).catch(() => {
      if (!cancelled) setPreview(null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [token]);

  if (loading) return <main className="min-h-[70vh] p-12 text-center">{french ? 'Chargement de l’aperçu…' : 'جار تحميل المعاينة…'}</main>;
  if (!preview) return <main className="min-h-[70vh] p-12 text-center">{french ? 'Ce lien est invalide ou a expiré. Demandez un nouveau lien à Dalil Tounes.' : 'هذا الرابط غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً من دليل تونس.'}</main>;

  const local = (field: keyof Preview, arabicField: keyof Preview) =>
    (!french && preview[arabicField]) || preview[field] || '';
  const location = [preview.adresse, local('ville', 'ville_ar'), local('gouvernorat', 'gouvernorat_ar')].filter(Boolean).join('، ');
  const cards = [
    { href: preview.telephone ? `tel:${preview.telephone.replace(/[^+\d]/g, '')}` : '', icon: Phone, title: french ? 'Appeler' : 'اتصال' },
    { href: preview.whatsapp ? `https://wa.me/${preview.whatsapp.replace(/\D/g, '')}` : '', icon: MessageCircle, title: 'WhatsApp' },
    { href: preview.email ? `mailto:${preview.email}` : '', icon: Mail, title: french ? 'Email' : 'البريد الإلكتروني' },
    { href: link(preview.site_web), icon: Globe, title: french ? 'Site web' : 'الموقع الإلكتروني' },
  ].filter(item => item.href);
  return (
    <main dir={french ? 'ltr' : 'rtl'} className="min-h-screen bg-[#f7f5f0] pb-16 text-slate-800">
      <div className="bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-950">
        {french ? 'Aperçu privé • Présentation en préparation • Aucun paiement requis pour consulter'
          : 'معاينة خاصة • العرض قيد الإعداد • الاطلاع لا يتطلب الدفع'}
      </div>
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="mb-5 flex justify-end gap-3 text-sm">
          <a href={`?lang=ar`} className="rounded-full bg-white px-4 py-2">العربية</a>
          <a href={`?lang=fr`} className="rounded-full bg-white px-4 py-2">Français</a>
        </div>
        <section className={`overflow-hidden rounded-3xl shadow-xl ${portfolio ? 'md:grid md:grid-cols-2' : ''}`} style={{ background, color: foreground }}>
          {preview.image_url && <img src={link(preview.image_url)} alt="" className={`w-full object-cover ${portfolio ? 'h-full min-h-72' : 'h-64 md:h-80'}`} />}
          <div className="p-7 md:p-12">
            {preview.logo_url && <img src={link(preview.logo_url)} alt="" className="mb-5 h-20 w-20 rounded-2xl bg-white object-contain p-2" />}
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>
              {portfolio ? (french ? 'Modèle Portfolio' : 'نموذج Portfolio') : (french ? 'Modèle Professionnel' : 'النموذج المهني')}
            </p>
            <h1 className="text-4xl font-bold">{local('nom', 'nom_ar')}</h1>
            {local('categorie', 'categorie_ar') && <p className="mt-3 text-lg">{local('categorie', 'categorie_ar')}</p>}
            {local('description', 'description_ar') && <p className="mt-6 whitespace-pre-line leading-relaxed">{local('description', 'description_ar')}</p>}
          </div>
        </section>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {local('a_propos', 'a_propos_ar') && <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="mb-3 text-xl font-bold">{french ? 'À propos' : 'من نحن'}</h2><p className="whitespace-pre-line leading-relaxed">{local('a_propos', 'a_propos_ar')}</p></section>}
          {local('services', 'services_ar') && <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="mb-3 text-xl font-bold">{french ? 'Services' : 'الخدمات'}</h2><p className="whitespace-pre-line leading-relaxed">{local('services', 'services_ar')}</p></section>}
        </div>
        {location && <p className="mt-7 flex items-center gap-2 rounded-3xl bg-white p-6"><MapPin aria-hidden="true" />{location}</p>}
        {cards.length > 0 && <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map(({ href, icon: Icon, title }) => <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-white p-4 font-semibold shadow-sm"><Icon size={19} aria-hidden="true" />{title}</a>)}
        </div>}
        {(link(preview.lien_facebook) || link(preview.lien_instagram)) && <div className="mt-6 flex gap-5">
          {link(preview.lien_facebook) && <a href={link(preview.lien_facebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>}
          {link(preview.lien_instagram) && <a href={link(preview.lien_instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>}
        </div>}
        <p className="mt-10 text-center text-sm text-slate-600">{french ? 'Cet aperçu reste privé. Répondez au message reçu pour demander une correction ou donner votre accord.' : 'هذه المعاينة خاصة. يمكنكم الرد على الرسالة لطلب تعديل أو تأكيد موافقتكم.'}</p>
      </div>
    </main>
  );
}
