import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin } from 'lucide-react';
import { openCraftPhotoCatalog } from '../data/openCraftPhotoCatalog';
import { supabase } from '../lib/supabaseClient';
import { UNESCO_TUNISIA_WORLD_HERITAGE, UNESCO_TUNISIA_INTANGIBLE, UNESCO_SOURCES } from '../data/tunisiaUnesco';

const translations = {"fr":{"all":"Toutes les expériences","artisanat":"Artisanat","nature":"Nature et randonnées","gastronomie":"Gastronomie","agriculture":"Fermes et terroir","patrimoine":"Patrimoine","festival":"Festivals culturels","plongee":"Plongée sous-marine","hebergement":"Hébergements","title":"Rencontrez la Tunisie autrement","subtitle":"Artisans, producteurs, guides et expériences authentiques.","searchLabel":"Que souhaitez-vous découvrir ?","placeholder":"Artisan, festival, plongée sous-marine, village...","region":"Région","allTunisia":"Toute la Tunisie","kind":"Type d'expérience","experiences":"Expériences locales","discoverExperience":"Découvrir l'expérience","contactAhead":"À contacter à l'avance avant tout déplacement","localDiscovery":"Découverte locale","businessPhoto":"Photo de la fiche","regionPhoto":"Vue de la région · illustration","loading":"Chargement des expériences…","none":"Aucune expérience publiée ne correspond à ces critères.","previous":"Précédent","next":"Suivant","page":"Page","of":"sur","unescoOnly":"Patrimoine UNESCO vérifié uniquement","unescoView":"Consulter les patrimoines UNESCO vérifiés en Tunisie","worldHeritage":"Patrimoine mondial","intangible":"Patrimoine immatériel","officialList":"Liste officielle UNESCO","pause":"Mettre en pause","resume":"Reprendre le défilement","gallery":"À découvrir dans notre répertoire","discover":"Découvrir","craftGallery":"Savoir-faire en images","modalLabel":"Visiter autrement · Expérience locale","story":"L'expérience et son histoire","about":"À propos","contacts":"Voir la fiche essentielle et les contacts","close":"Fermer"},"ar":{"all":"جميع التجارب","artisanat":"الحرف التقليدية","nature":"الطبيعة والمشي","gastronomie":"فن الطهي","agriculture":"المزارع والمنتجات المحلية","patrimoine":"التراث","festival":"المهرجانات الثقافية","plongee":"الغوص تحت الماء","hebergement":"الإقامة","title":"اكتشف تونس بطريقة مختلفة","subtitle":"حرفيون ومنتجون ومرشدون وتجارب أصيلة.","searchLabel":"ماذا ترغب في اكتشافه؟","placeholder":"حرفي، مهرجان، غوص، قرية...","region":"المنطقة","allTunisia":"كل تونس","kind":"نوع التجربة","experiences":"تجارب محلية","discoverExperience":"اكتشف التجربة","contactAhead":"يُرجى الاتصال مسبقًا قبل الزيارة","localDiscovery":"اكتشاف محلي","businessPhoto":"صورة المنشأة","regionPhoto":"صورة توضيحية للمنطقة","loading":"جارٍ تحميل التجارب…","none":"لا توجد تجارب منشورة تطابق هذه المعايير.","previous":"السابق","next":"التالي","page":"الصفحة","of":"من","unescoOnly":"التراث المعتمد من اليونسكو فقط","unescoView":"اطّلع على مواقع التراث المعتمدة لدى اليونسكو في تونس","worldHeritage":"التراث العالمي","intangible":"التراث غير المادي","officialList":"قائمة اليونسكو الرسمية","pause":"إيقاف العرض","resume":"استئناف العرض","gallery":"اكتشف في دليلنا","discover":"اكتشف","craftGallery":"الحرف في صور","modalLabel":"اكتشف تونس بطريقة مختلفة · تجربة محلية","story":"التجربة وقصتها","about":"نبذة","contacts":"عرض بيانات المنشأة ووسائل الاتصال","close":"إغلاق"},"en":{"all":"All experiences","artisanat":"Crafts","nature":"Nature and hiking","gastronomie":"Food and gastronomy","agriculture":"Farms and local produce","patrimoine":"Heritage","festival":"Cultural festivals","plongee":"Scuba diving","hebergement":"Accommodation","title":"Experience Tunisia differently","subtitle":"Artisans, producers, guides and authentic experiences.","searchLabel":"What would you like to discover?","placeholder":"Artisan, festival, scuba diving, village...","region":"Region","allTunisia":"All Tunisia","kind":"Experience type","experiences":"Local experiences","discoverExperience":"Discover this experience","contactAhead":"Contact in advance before visiting","localDiscovery":"Local discovery","businessPhoto":"Business photo","regionPhoto":"Regional illustration","loading":"Loading experiences…","none":"No published experiences match these filters.","previous":"Previous","next":"Next","page":"Page","of":"of","unescoOnly":"Verified UNESCO heritage only","unescoView":"Explore verified UNESCO heritage in Tunisia","worldHeritage":"World Heritage","intangible":"Intangible heritage","officialList":"Official UNESCO list","pause":"Pause slideshow","resume":"Resume slideshow","gallery":"Discover in our directory","discover":"Discover","craftGallery":"Craftsmanship in pictures","modalLabel":"Discover differently · Local experience","story":"The experience and its story","about":"About","contacts":"View business details and contacts","close":"Close"},"it":{"all":"Tutte le esperienze","artisanat":"Artigianato","nature":"Natura ed escursioni","gastronomie":"Gastronomia","agriculture":"Fattorie e prodotti locali","patrimoine":"Patrimonio","festival":"Festival culturali","plongee":"Immersioni subacquee","hebergement":"Alloggi","title":"Scopri la Tunisia in modo diverso","subtitle":"Artigiani, produttori, guide ed esperienze autentiche.","searchLabel":"Che cosa desideri scoprire?","placeholder":"Artigiano, festival, immersioni, villaggio...","region":"Regione","allTunisia":"Tutta la Tunisia","kind":"Tipo di esperienza","experiences":"Esperienze locali","discoverExperience":"Scopri l'esperienza","contactAhead":"Contatta la struttura prima della visita","localDiscovery":"Scoperta locale","businessPhoto":"Foto dell'attività","regionPhoto":"Illustrazione della regione","loading":"Caricamento esperienze…","none":"Nessuna esperienza pubblicata corrisponde ai filtri.","previous":"Precedente","next":"Successivo","page":"Pagina","of":"di","unescoOnly":"Solo patrimonio UNESCO verificato","unescoView":"Esplora il patrimonio UNESCO verificato in Tunisia","worldHeritage":"Patrimonio mondiale","intangible":"Patrimonio immateriale","officialList":"Elenco ufficiale UNESCO","pause":"Metti in pausa","resume":"Riprendi","gallery":"Da scoprire nella nostra guida","discover":"Scopri","craftGallery":"Artigianato in immagini","modalLabel":"Scoprire diversamente · Esperienza locale","story":"L'esperienza e la sua storia","about":"Informazioni","contacts":"Vedi scheda e contatti","close":"Chiudi"},"ru":{"all":"Все впечатления","artisanat":"Ремёсла","nature":"Природа и походы","gastronomie":"Гастрономия","agriculture":"Фермы и местные продукты","patrimoine":"Наследие","festival":"Культурные фестивали","plongee":"Дайвинг","hebergement":"Размещение","title":"Откройте Тунис по-новому","subtitle":"Мастера, производители, гиды и подлинные впечатления.","searchLabel":"Что вы хотите открыть?","placeholder":"Ремесленник, фестиваль, дайвинг, деревня...","region":"Регион","allTunisia":"Весь Тунис","kind":"Тип впечатления","experiences":"Местные впечатления","discoverExperience":"Узнать подробнее","contactAhead":"Свяжитесь заранее перед посещением","localDiscovery":"Местное открытие","businessPhoto":"Фото организации","regionPhoto":"Иллюстрация региона","loading":"Загрузка впечатлений…","none":"Опубликованных впечатлений по этим фильтрам нет.","previous":"Назад","next":"Далее","page":"Страница","of":"из","unescoOnly":"Только проверенное наследие ЮНЕСКО","unescoView":"Изучить проверенное наследие ЮНЕСКО в Тунисе","worldHeritage":"Всемирное наследие","intangible":"Нематериальное наследие","officialList":"Официальный список ЮНЕСКО","pause":"Приостановить","resume":"Продолжить","gallery":"В нашем каталоге","discover":"Открыть","craftGallery":"Ремёсла в фотографиях","modalLabel":"Увидеть иначе · Местное впечатление","story":"Впечатление и его история","about":"О нас","contacts":"Карточка и контакты","close":"Закрыть"}};

const additionalTranslations = {"fr":{"fallback":"Découvrez cette expérience locale.","unavailable":"Le répertoire est momentanément indisponible.","note":"Les paysages illustrent les régions et ne représentent pas nécessairement les établissements.","verification":"Le lien UNESCO est confirmé uniquement pour les expériences vérifiées.","before":"Contactez l'établissement pour confirmer les horaires et les activités.","ready":"Présentation à compléter."},"ar":{"fallback":"اكتشف هذه التجربة المحلية.","unavailable":"الدليل غير متاح مؤقتًا.","note":"الصور توضح المناطق ولا تمثل بالضرورة المنشآت.","verification":"لا يُنسب تصنيف اليونسكو إلا إلى التجارب التي تم التحقق منها.","before":"اتصل بالمنشأة للتأكد من المواعيد والأنشطة.","ready":"التعريف قيد الاستكمال."},"en":{"fallback":"Discover this local experience.","unavailable":"The directory is temporarily unavailable.","note":"Regional landscapes do not necessarily depict the listed businesses.","verification":"UNESCO status is assigned only to verified experiences.","before":"Contact the business to confirm opening times and activities.","ready":"Description to be completed."},"it":{"fallback":"Scopri questa esperienza locale.","unavailable":"La guida non è temporaneamente disponibile.","note":"Le immagini regionali non rappresentano necessariamente le attività elencate.","verification":"Il riconoscimento UNESCO riguarda solo esperienze verificate.","before":"Contatta la struttura per confermare orari e attività.","ready":"Descrizione da completare."},"ru":{"fallback":"Откройте для себя местный опыт.","unavailable":"Каталог временно недоступен.","note":"Пейзажи региона не обязательно изображают указанные организации.","verification":"Статус ЮНЕСКО указывается только для проверенных объектов.","before":"Уточните время и мероприятия у организации.","ready":"Описание будет добавлено."}};

type LocalExperience = {
  id: string; nom: string | null; ville: string | null; gouvernorat: string | null;
  description: string | null; description_ar?: string | null; description_en?: string | null; description_it?: string | null; description_ru?: string | null; name_ar?: string | null; name_en?: string | null; name_it?: string | null; name_ru?: string | null; a_propos: string | null; image_url: string | null;
};

const CRAFT_PHOTOS = [
  { test: /groupement du tourisme alternatif.*kairouan/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tisserande_Kairouan.jpg?width=900', label: 'Tisserande traditionnelle de Kairouan · illustration du savoir-faire régional', credit: 'Photo publiée sur Wikimedia Commons · licence indiquée sur la source', source: 'https://commons.wikimedia.org/wiki/File:Tisserande_Kairouan.jpg' },
  { test: /etnafes/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kerwen_04.jpg?width=900', label: 'Artisanat du tapis à Kairouan · illustration régionale', credit: 'Hommi2020 · Wikimedia Commons', source: 'https://commons.wikimedia.org/wiki/File:Kerwen_04.jpg' },
  { test: /jebel oueslat/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kerwen_09.jpg?width=900', label: 'Savoir-faire des tapis dans les souks de Kairouan · illustration régionale', credit: 'Hommi2020 · Wikimedia Commons', source: 'https://commons.wikimedia.org/wiki/File:Kerwen_09.jpg' },
];
const ADDITIONAL_PHOTOS = [
  { test: /le r[eé]gal|kerkennah|el attaya/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Un_pecheur_pr%C3%A9pare_son_filet_%C3%A0_kerkennah_-_tunisie.jpg?width=900', label: 'Pêcheur préparant son filet à Kerkennah · scène régionale', credit: 'Skander zarrad · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Un_pecheur_pr%C3%A9pare_son_filet_%C3%A0_kerkennah_-_tunisie.jpg' },
  { test: /r[eé]serve familiale ben isma[iï]l|toukabeur/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dougga_site_arch%C3%A9ologique_en_Tunisie.jpg?width=900', label: 'Site de Dougga · patrimoine du gouvernorat de Béja', credit: 'Photographie Wikimedia Commons · attribution sur la source', source: 'https://commons.wikimedia.org/wiki/File:Dougga_site_arch%C3%A9ologique_en_Tunisie.jpg' },
  { test: /val.oasis|k[eé]bili/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Douz_Oasis.jpg?width=900', label: 'Palmeraie de Douz · paysage du gouvernorat de Kébili', credit: 'http2007 · Wikimedia Commons', source: 'https://commons.wikimedia.org/wiki/File:Douz_Oasis.jpg' },
  { test: /gie nefzaoua/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Douz_Tunisia.jpg?width=900', label: 'Paysage saharien de Douz · vue régionale', credit: 'Fatoumatouta12345 · Wikimedia Commons', source: 'https://commons.wikimedia.org/wiki/File:Douz_Tunisia.jpg' },
];
const REGION_PHOTOS = [
  { test: /a[iï]n draham|kroumirie/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest_A%C3%AFn_Draham.jpg?width=900', label: 'Forêt d’Aïn Draham · vue de la région', credit: 'Smailtn · CC0', source: 'https://commons.wikimedia.org/wiki/File:Forest_A%C3%AFn_Draham.jpg' },
  { test: /chenini|gab[eè]s/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%D9%88%D8%A7%D8%AD%D8%A9_%D8%B4%D9%86%D9%86%D9%8A_%D8%A8%D9%82%D8%A7%D8%A8%D8%B3.JPG?width=900', label: 'Oasis de Chenini (Gabès) · vue de la région', credit: 'Krimi awatef · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:%D9%88%D8%A7%D8%AD%D8%A9_%D8%B4%D9%86%D9%86%D9%8A_%D8%A8%D9%82%D8%A7%D8%A8%D8%B3.JPG' },
  { test: /makthar|maktar/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Site_archeologique_de_Makthar.jpg?width=900', label: 'Site archéologique de Makthar · vue de la région', credit: 'skander zarrad · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Site_archeologique_de_Makthar.jpg' },
  { test: /kesra/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/La_ville_de_kesra.jpg?width=900', label: 'Kesra · vue de la région', credit: 'Mohamedkouka · CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:La_ville_de_kesra.jpg' },

  { test: /nefta/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Oasis_Nefta.JPG?width=900', label: 'Oasis de Nefta · paysage régional', credit: 'Christian Cogneaux · CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Oasis_Nefta.JPG' },
  { test: /hamma dj[eé]rid|tozeur/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/ImmensityOasisNefta.JPG?width=900', label: 'Oasis de Nefta · paysage régional de Tozeur', credit: 'Citizen59 · CC BY-SA 2.5', source: 'https://commons.wikimedia.org/wiki/File:ImmensityOasisNefta.JPG' },
  { test: /tabarka|rissala/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C3%8Ele_de_Tabarka.jpg?width=900', label: 'Tabarka · paysage côtier régional', credit: 'Fatma Hamdi · licence Wikimedia Commons', source: 'https://commons.wikimedia.org/wiki/File:%C3%8Ele_de_Tabarka.jpg' },
  { test: /kairouan|oueslatia|jebel oueslat/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kairouan_medina_walls.jpg?width=900', label: 'Médina de Kairouan · vue du gouvernorat', credit: 'Auteur Wikimedia Commons · CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Kairouan_medina_walls.jpg' },
  { test: /sbe[iï]tla|esparto/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Site_arch%C3%A9ologique_de._Sbeitla.jpg?width=900', label: 'Sbeïtla · patrimoine de la région', credit: 'skander zarrad · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Site_arch%C3%A9ologique_de._Sbeitla.jpg' },
  { test: /tataouine|dahar/i, url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ksar_Hadada%2C_Tataouine.jpg?width=900', label: 'Ksar Hadada · patrimoine de Tataouine', credit: 'Smailtn · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ksar_Hadada,_Tataouine.jpg' },
];
function regionPhoto(item: LocalExperience) {
  const area = [item.nom,item.ville,item.gouvernorat].filter(Boolean).join(' ');
  return ADDITIONAL_PHOTOS.find(photo => photo.test.test(area)) || CRAFT_PHOTOS.find(photo => photo.test.test(area)) || REGION_PHOTOS.find(photo => photo.test.test(area));
}

// A verified regional illustration is acceptable on a discovery card, but never presented as a photo of the business.
const GOVERNORATE_PHOTOS: Record<string, typeof REGION_PHOTOS[number]> = {
  'Jendouba': REGION_PHOTOS[0], 'Gabès': REGION_PHOTOS[1], 'Siliana': REGION_PHOTOS[2],
  'Tozeur': REGION_PHOTOS[4], 'Kairouan': REGION_PHOTOS[7], 'Kasserine': REGION_PHOTOS[8],
  'Kébili': ADDITIONAL_PHOTOS[2], 'Béja': ADDITIONAL_PHOTOS[1], 'Sfax': ADDITIONAL_PHOTOS[0],
  'Tataouine': REGION_PHOTOS[9],
};
function cardPhoto(item: LocalExperience) {
  const image = businessPhoto(item.image_url);
  if (image) return { url: image, label: 'Photographie de la fiche', official: true };
  const regional = regionPhoto(item) || GOVERNORATE_PHOTOS[item.gouvernorat || ''];
  return regional ? { url: regional.url, label: regional.label, official: false } : null;
}

function businessPhoto(value: string | null) {
  const image = firstValidImage(value);
  return image && !/Design_Assets_Dalil_Tounes\/banner\/drapeau-tunisie/i.test(image) ? image : null;
}

function firstValidImage(value: string | null) {
  if (!value) return null;
  const match = value.match(/https?:\/\/[^\s,]+/);
  return match ? match[0].replace(/[\\]+$/, '') : null;
}

const PAGE_SIZE = 6;
// UNESCO status is recorded only for individually verified experiences, never inferred from a governorate.
const verifiedUnescoExperienceIds = new Set<string>();
function uniqueExperiences(rows: LocalExperience[]) {
  const byName = new Map<string, LocalExperience>();
  for (const item of rows) {
    const key = (item.nom || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
    if (!key) continue;
    const existing = byName.get(key);
    if (!existing || (item.id.startsWith('rec') && !existing.id.startsWith('rec'))) byName.set(key, item);
  }
  return [...byName.values()];
}
const categories = [
  ['all', 'all'], ['artisanat', 'artisanat'], ['nature', 'nature'],
  ['gastronomie', 'gastronomie'], ['agriculture', 'agriculture'],
  ['patrimoine', 'patrimoine'], ['festival', 'festival'], ['plongee', 'plongee'], ['hebergement', 'hebergement']
] as const;
function classify(e: LocalExperience) {
  const v = [e.nom, e.description, e.a_propos].filter(Boolean).join(' ').toLocaleLowerCase();
  if (/festival|fête culturelle|fete culturelle/.test(v)) return 'festival';
  if (/plong.e|diving|scuba|snorkel|bapt.me sous.marin|centre subaquatique|subway diving|immersion sous.marine/.test(v)) return 'plongee';
  if (/h.bergement|g.te|maison d.h.te|colodge|campement/.test(v)) return 'hebergement';
  if (/randonn|guide|trek|montagne|sp.l.olog|for.t|excursion/.test(v)) return 'nature';
  if (/cuisine|gastronom|repas|restaurant|table d.h.te|p.tisser/.test(v)) return 'gastronomie';
  if (/ferme|ol.iv|agricol|oasis|palmeraie|dattes|apicult|terroir/.test(v)) return 'agriculture';
  if (/artisan|tiss|poterie|laine|atelier|alfa|calligraph/.test(v)) return 'artisanat';
  return 'patrimoine';
}
export default function TourismExperienceDiscovery() {
  const { language } = useLanguage();
  const lang = (language in translations ? language : 'fr') as keyof typeof translations;
  const tr = translations[lang];
  const extra = additionalTranslations[lang];
  const rtl = lang === 'ar';
  const localizedName = (item: LocalExperience) => {
    const name = lang === 'fr' ? null : item[`name_${lang}` as keyof LocalExperience];
    return typeof name === 'string' && name.trim() ? name : (item.nom || '');
  };
  const localizedDescription = (item: LocalExperience) => {
    const translated = lang === 'fr' ? null : item[`description_${lang}` as keyof LocalExperience];
    return typeof translated === 'string' && translated.trim() ? translated : (item.description || item.a_propos || extra.fallback);
  };
  const [items, setItems] = useState<LocalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [kind, setKind] = useState(() => (['festival', 'plongee'].includes(new URLSearchParams(window.location.search).get('type') || '') ? new URLSearchParams(window.location.search).get('type')! : 'all'));
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<LocalExperience | null>(null);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const [unescoOnly, setUnescoOnly] = useState(false);
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase.from('entreprise')
        .select('id,nom,ville,gouvernorat,description,description_ar,description_en,description_it,description_ru,name_ar,name_en,name_it,name_ru,a_propos,image_url')
        .contains('liste_pages', ['tourisme local & expatriation'])
        .eq('approved', true).eq('statut_publication', 'Publié')
        .order('nom', { ascending: true }).limit(500);
      if (!active) return;
      setItems(uniqueExperiences((data || []) as LocalExperience[]));
      setError(Boolean(error));
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);
  // One photo per gallery slot: never repeat the same regional image.
  const gallery = useMemo(() => {
    const used = new Set<string>();
    return items.filter(item => {
      const photo = businessPhoto(item.image_url) || regionPhoto(item)?.url;
      if (!photo || used.has(photo)) return false;
      used.add(photo);
      return true;
    });
  }, [items]);
  useEffect(() => {
    if (paused || gallery.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => setRotation(n => n + 1), 12000);
    return () => window.clearInterval(interval);
  }, [paused, gallery.length]);
  const galleryItems = useMemo(() => {
    if (!gallery.length) return [];
    return Array.from({ length: Math.min(16, gallery.length) }, (_, n) => gallery[(rotation + n) % gallery.length]);
  }, [gallery, rotation]);
  const gallerySplit = Math.ceil(galleryItems.length / 2);
  const renderGalleryCard = (item: LocalExperience, index: number) => <button key={item.id + '-' + index} type="button" onClick={() => setSelected(item)} className={`group relative block w-full overflow-hidden rounded-2xl border-2 border-white shadow-lg transition-transform duration-300 hover:z-20 hover:scale-110 ${index === 0 ? "" : "-mt-4"} ${index % 2 ? "rotate-2" : "-rotate-2"} hover:rotate-0 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500` } aria-label={tr.discover + ' ' + localizedName(item)}>
    <img src={businessPhoto(item.image_url) || regionPhoto(item)?.url || ''} alt={businessPhoto(item.image_url) ? (item.nom || 'Expérience locale') : (regionPhoto(item)?.label || 'Paysage tunisien')} loading="lazy" className="h-32 w-full object-cover sm:h-40" />
    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-10 text-left text-xs font-semibold text-white">{localizedName(item)}<span className="mt-1 block text-[10px] font-normal">{businessPhoto(item.image_url) ? tr.businessPhoto : regionPhoto(item)?.label}</span></span>
  </button>;
  const regions = useMemo(() => [...new Set(items.map(i => i.gouvernorat).filter((x): x is string => !!x))].sort((a,b)=>a.localeCompare(b, 'fr')), [items]);
  const matches = useMemo(() => items.filter(item => {
    if (region && item.gouvernorat !== region) return false;
    if (unescoOnly && !verifiedUnescoExperienceIds.has(item.id)) return false;
    if (kind !== 'all' && classify(item) !== kind) return false;
    const text = [item.nom, localizedName(item), item.ville, item.gouvernorat, item.description, localizedDescription(item), item.a_propos].filter(Boolean).join(' ').toLocaleLowerCase();
    return !query.trim() || text.includes(query.trim().toLocaleLowerCase());
  }), [items, query, region, kind, unescoOnly, lang]);
  useEffect(() => { setPage(1); }, [query, region, kind, unescoOnly]);
  const totalPages = Math.ceil(matches.length / PAGE_SIZE);
  const pageItems = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <section dir={rtl ? 'rtl' : 'ltr'} lang={lang} className="mx-auto max-w-7xl px-4 py-7" aria-label="Découvrir les expériences locales">
    {galleryItems.length > 0 && <p className="mb-3 text-[11px] text-gray-500">{extra.note}</p>}
    {galleryItems.length > 0 && <div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-[#4A1D43]">📸 {tr.gallery}</p><button type="button" onClick={() => setPaused(p => !p)} className="rounded-full border border-[#D4AF37] px-3 py-1 text-xs">{paused ? tr.resume : tr.pause}</button></div>}
    {galleryItems.length > 0 && <div className="mb-5 flex gap-3 overflow-x-auto pb-3 lg:hidden" aria-label="Galerie des expériences">{galleryItems.map((item,i) => <div key={item.id + i} className="w-40 shrink-0">{renderGalleryCard(item,i)}</div>)}</div>}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(120px,1fr)_minmax(0,4fr)_minmax(120px,1fr)]">
      <aside className="hidden flex-col items-stretch gap-0 pt-8 lg:flex" aria-label="Découvertes à gauche">{galleryItems.slice(0,gallerySplit).map((item,i)=>renderGalleryCard(item,i))}</aside>
      <div className="min-w-0">
    <div className="rounded-2xl border border-[#D4AF37]/60 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-[#4A0404]">{tr.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{tr.subtitle}</p>
      <label htmlFor="local-search" className="mt-4 block text-sm font-medium">{tr.searchLabel}</label>
      <input id="local-search" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3" placeholder={tr.placeholder} value={query} onChange={e=>setQuery(e.target.value)} />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">{tr.region}<select value={region} onChange={e=>setRegion(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-3"><option value="">{tr.allTunisia}</option>{regions.map(r=><option key={r} value={r}>{r}</option>)}</select></label>
        <label className="text-sm">{tr.kind}<select value={kind} onChange={e=>setKind(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-3">{categories.map(([key,label])=><option key={key} value={key}>{tr[label]}</option>)}</select></label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={unescoOnly} onChange={e=>setUnescoOnly(e.target.checked)} className="h-4 w-4" />{tr.unescoOnly}</label>
      {unescoOnly && <p className="mt-2 text-xs text-gray-600">{extra.verification}</p>}
      <details className="mt-3 text-sm text-gray-700">
        <summary className="cursor-pointer text-[#4A1D43] underline">{tr.unescoView}</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><strong>{tr.worldHeritage}</strong><p className="mt-1 text-xs">{UNESCO_TUNISIA_WORLD_HERITAGE.map(x => x.name).join(' · ')}</p><a href={UNESCO_SOURCES.world} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs underline">{tr.officialList}</a></div>
          <div><strong>{tr.intangible}</strong><p className="mt-1 text-xs">{UNESCO_TUNISIA_INTANGIBLE.map(x => x.name).join(' · ')}</p><a href={UNESCO_SOURCES.intangible} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs underline">{tr.officialList}</a></div>
        </div>
        <p className="mt-2 text-xs text-gray-600">Une inscription concerne un site ou un savoir-faire, pas automatiquement une entreprise proche ou un artisan pratiquant un métier similaire.</p>
      </details>
    </div>
    <h3 className="mt-7 mb-4 text-xl font-semibold text-[#4A0404]">{tr.experiences} {!loading && !error && '(' + matches.length + ')'}</h3>
    {loading ? <p className="py-8 text-gray-600">{tr.loading}</p> : error ? <p role="alert" className="py-8 text-red-700">{extra.unavailable}</p> : matches.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">{tr.none}</p> :
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{pageItems.map(item=><article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[#e6eae3]">{cardPhoto(item) ? <><img src={cardPhoto(item)!.url} alt={cardPhoto(item)!.label} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" /><span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-6 text-[10px] text-white">{cardPhoto(item)!.official ? tr.businessPhoto : tr.regionPhoto}</span></> : <span className="text-sm font-medium text-[#4A1D43]">{tr.localDiscovery} 🇹🇳</span>}</div>
      <div className="p-4"><p className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={13}/>{[item.ville,item.gouvernorat].filter(Boolean).join(' · ')}</p><h4 className="mt-2 font-semibold">{localizedName(item)}</h4><p className="mt-2 line-clamp-3 text-sm text-gray-700">{localizedDescription(item)}</p><p className="mt-3 text-xs font-medium text-[#7C591E]">{tr.contactAhead}</p><button type="button" onClick={() => setSelected(item)} className="mt-3 inline-block text-sm font-semibold text-[#4A1D43] underline">{tr.discoverExperience}</button></div>
    </article>)}</div>}
    {!loading && !error && totalPages > 1 && <nav aria-label="Pages des expériences" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg border border-[#D4AF37] px-3 py-2 text-sm disabled:opacity-40">{tr.previous}</button>
      <span className="px-2 text-sm text-gray-600">{tr.page} {page} {tr.of} {totalPages}</span>
      <button type="button" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="rounded-lg border border-[#D4AF37] px-3 py-2 text-sm disabled:opacity-40">{tr.next}</button>
    </nav>}

    <div className="mt-8 rounded-2xl border border-[#D4AF37]/40 bg-[#FFF9EF] p-4">
      <h3 className="text-lg font-semibold text-[#4A1D43]">{tr.craftGallery}</h3>
      <p className="mt-1 text-xs text-gray-600">Des photographies authentiques des métiers de Sejnane, Nabeul et Kairouan. Elles illustrent les traditions locales, et non les entreprises référencées.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {openCraftPhotoCatalog.filter(photo => ['Poterie de Sejnane', 'Plat traditionnel de Sejnane', 'Potier au travail à Nabeul', 'Artisane ou artisan peignant une assiette', 'Tisserande de Kairouan', 'Tapis Margoum dans le souk'].includes(photo.title)).map(photo => <a href={photo.source} target="_blank" rel="noopener noreferrer" key={photo.filename} className="group overflow-hidden rounded-xl bg-white shadow-sm">
          <img loading="lazy" src={'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(photo.filename) + '?width=450'} alt={photo.title} className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="p-2"><p className="text-xs font-semibold text-[#4A1D43]">{photo.title}</p><p className="mt-1 text-[10px] text-gray-600">{photo.author} · {photo.license}</p></div>
        </a>)}
      </div>
    </div>
    {galleryItems.length > 0 && <p className="mt-4 text-[11px] text-gray-500">Crédits des photographies régionales : {[...ADDITIONAL_PHOTOS, ...CRAFT_PHOTOS, ...REGION_PHOTOS].map((p,i) => <span key={p.source}>{i > 0 ? " · " : ""}<a className="underline" href={p.source} target="_blank" rel="noopener noreferrer">{p.credit}</a></span>)}</p>}
    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6" role="presentation" onClick={() => setSelected(null)}>
      <section role="dialog" aria-modal="true" aria-label="Détails de l'expérience" className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#966A28]">{tr.modalLabel}</p><h2 className="mt-1 text-2xl font-semibold text-[#4A0404]">{localizedName(selected)}</h2><p className="mt-2 text-sm text-gray-600">{[selected.ville,selected.gouvernorat].filter(Boolean).join(' · ')}</p></div><button type="button" aria-label={tr.close} onClick={() => setSelected(null)} className="rounded-full bg-gray-100 px-3 py-2">✕</button></div>
        {businessPhoto(selected.image_url) && <img src={businessPhoto(selected.image_url) || ''} alt="" className="mt-4 max-h-60 w-full rounded-xl object-cover" />}
        <h3 className="mt-5 text-lg font-semibold">{tr.story}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700">{localizedDescription(selected)}</p>
        {selected.a_propos && selected.a_propos !== selected.description && <><h3 className="mt-5 text-lg font-semibold">{tr.about}</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700">{selected.a_propos}</p></>}
        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">📞 {extra.before}</p>
        <Link to={'/business/'+encodeURIComponent(selected.id)} className="mt-5 inline-flex rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-semibold text-white">Voir la fiche essentielle et les contacts →</Link>
      </section>
    </div>}
      </div>
      <aside className="hidden flex-col items-stretch gap-0 pt-8 lg:flex" aria-label="Découvertes à droite">{galleryItems.slice(gallerySplit,16).map((item,i)=>renderGalleryCard(item,i+gallerySplit))}</aside>
    </div>
  </section>;
}
