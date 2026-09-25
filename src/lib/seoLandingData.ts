import { generateSlug } from './slugify';
import type { Language } from './i18n';

export type LocalizedLabels = {
  fr: string;
  ar: string;
  en: string;
  it: string;
  ru: string;
};

export interface MetierEntry {
  slug: string;
  label: string;
  value: string;
  secteur?: string;
  labels?: LocalizedLabels;
}

export interface VilleEntry {
  slug: string;
  label: string;
  gouvernorat: string;
  labels?: LocalizedLabels;
}

export interface SousCategorieEntry {
  slug: string;
  label: string;
  labels?: LocalizedLabels;
}

export const SEO_METIERS: MetierEntry[] = [
  // Santé
  { slug: 'medecin-generaliste', label: 'Médecin Généraliste', value: 'Médecin Généraliste', secteur: 'Santé', labels: { fr: 'Médecin Généraliste', ar: 'طبيب عام', en: 'General Practitioner', it: 'Medico di base', ru: 'Врач-терапевт' } },
  { slug: 'medecin-specialiste', label: 'Médecin Spécialiste', value: 'Médecin Spécialiste', secteur: 'Santé', labels: { fr: 'Médecin Spécialiste', ar: 'طبيب اختصاصي', en: 'Specialist Doctor', it: 'Medico specialista', ru: 'Врач-специалист' } },
  { slug: 'cardiologue', label: 'Cardiologue', value: 'Cardiologue', secteur: 'Santé', labels: { fr: 'Cardiologue', ar: 'طبيب قلب', en: 'Cardiologist', it: 'Cardiologo', ru: 'Кардиолог' } },
  { slug: 'dentiste', label: 'Dentiste', value: 'Dentiste', secteur: 'Santé', labels: { fr: 'Dentiste', ar: 'طبيب أسنان', en: 'Dentist', it: 'Dentista', ru: 'Стоматолог' } },
  { slug: 'chirurgien-dentiste', label: 'Chirurgien-dentiste', value: 'Chirurgien-dentiste', secteur: 'Santé', labels: { fr: 'Chirurgien-dentiste', ar: 'جراح أسنان', en: 'Dental Surgeon', it: 'Chirurgo dentista', ru: 'Хирург-стоматолог' } },
  { slug: 'orthodontiste', label: 'Orthodontiste', value: 'Orthodontiste', secteur: 'Santé', labels: { fr: 'Orthodontiste', ar: 'تقويم الأسنان', en: 'Orthodontist', it: 'Ortodontista', ru: 'Ортодонт' } },
  { slug: 'pediatre', label: 'Pédiatre', value: 'Pédiatre', secteur: 'Santé', labels: { fr: 'Pédiatre', ar: 'طبيب أطفال', en: 'Pediatrician', it: 'Pediatra', ru: 'Педиатр' } },
  { slug: 'gynecologue', label: 'Gynécologue', value: 'Gynécologue', secteur: 'Santé', labels: { fr: 'Gynécologue', ar: 'طبيب نساء', en: 'Gynecologist', it: 'Ginecologo', ru: 'Гинеколог' } },
  { slug: 'dermatologue', label: 'Dermatologue', value: 'Dermatologue', secteur: 'Santé', labels: { fr: 'Dermatologue', ar: 'طبيب جلدية', en: 'Dermatologist', it: 'Dermatologo', ru: 'Дерматолог' } },
  { slug: 'ophtalmologue', label: 'Ophtalmologue', value: 'Ophtalmologue', secteur: 'Santé', labels: { fr: 'Ophtalmologue', ar: 'طبيب عيون', en: 'Ophthalmologist', it: 'Oftalmologo', ru: 'Офтальмолог' } },
  { slug: 'orl', label: 'ORL', value: 'ORL', secteur: 'Santé', labels: { fr: 'ORL', ar: 'أنف وأذن وحنجرة', en: 'ENT Specialist', it: 'Otorinolaringoiatra', ru: 'ЛОР-врач' } },
  { slug: 'kinesitherapeute', label: 'Kinésithérapeute', value: 'Kinésithérapeute', secteur: 'Santé', labels: { fr: 'Kinésithérapeute', ar: 'أخصائي علاج طبيعي', en: 'Physiotherapist', it: 'Fisioterapista', ru: 'Физиотерапевт' } },
  { slug: 'osteopathe', label: 'Ostéopathe', value: 'Ostéopathe', secteur: 'Santé', labels: { fr: 'Ostéopathe', ar: 'أخصائي علاج تقويم العظام', en: 'Osteopath', it: 'Osteopata', ru: 'Остеопат' } },
  { slug: 'podologue', label: 'Podologue', value: 'Podologue', secteur: 'Santé', labels: { fr: 'Podologue', ar: 'أخصائي القدم', en: 'Podiatrist', it: 'Podologo', ru: 'Подолог' } },
  { slug: 'psychologue', label: 'Psychologue', value: 'Psychologue', secteur: 'Santé', labels: { fr: 'Psychologue', ar: 'عالم نفس', en: 'Psychologist', it: 'Psicologo', ru: 'Психолог' } },
  { slug: 'psychiatre', label: 'Psychiatre', value: 'Psychiatre', secteur: 'Santé', labels: { fr: 'Psychiatre', ar: 'طبيب نفسي', en: 'Psychiatrist', it: 'Psichiatra', ru: 'Психиатр' } },
  { slug: 'orthophoniste', label: 'Orthophoniste', value: 'Orthophoniste', secteur: 'Santé', labels: { fr: 'Orthophoniste', ar: 'أخصائي النطق', en: 'Speech Therapist', it: 'Logopedista', ru: 'Логопед' } },
  { slug: 'dieticien', label: 'Diététicien', value: 'Diététicien', secteur: 'Santé', labels: { fr: 'Diététicien', ar: 'أخصائي تغذية', en: 'Dietitian', it: 'Dietista', ru: 'Диетолог' } },
  { slug: 'pharmacie', label: 'Pharmacie', value: 'Pharmacie', secteur: 'Santé', labels: { fr: 'Pharmacie', ar: 'صيدلية', en: 'Pharmacy', it: 'Farmacia', ru: 'Аптека' } },
  { slug: 'laboratoire-analyse', label: 'Laboratoire d\'analyses', value: 'Laboratoire d\'analyses', secteur: 'Santé', labels: { fr: 'Laboratoire d\'analyses', ar: 'مختبر تحاليل', en: 'Medical Laboratory', it: 'Laboratorio di analisi', ru: 'Лаборатория анализов' } },
  { slug: 'radiologie', label: 'Radiologie', value: 'Radiologie', secteur: 'Santé', labels: { fr: 'Radiologie', ar: 'الأشعة', en: 'Radiology', it: 'Radiologia', ru: 'Радиология' } },
  { slug: 'infirmier', label: 'Infirmier', value: 'Infirmier', secteur: 'Santé', labels: { fr: 'Infirmier', ar: 'ممرض', en: 'Nurse', it: 'Infermiere', ru: 'Медсестра / Медбрат' } },
  { slug: 'sage-femme', label: 'Sage-femme', value: 'Sage-femme', secteur: 'Santé', labels: { fr: 'Sage-femme', ar: 'قابلة', en: 'Midwife', it: 'Ostetrica', ru: 'Акушерка' } },
  { slug: 'ambulance', label: 'Ambulance', value: 'Ambulance', secteur: 'Santé', labels: { fr: 'Ambulance', ar: 'سيارة إسعاف', en: 'Ambulance', it: 'Ambulanza', ru: 'Скорая помощь' } },
  { slug: 'optique-lunetterie', label: 'Optique - Lunetterie', value: 'Optique - Lunetterie', secteur: 'Santé', labels: { fr: 'Optique - Lunetterie', ar: 'نظارات طبية', en: 'Optics - Eyewear', it: 'Ottica', ru: 'Оптика' } },
  { slug: 'audioprothesiste', label: 'Audioprothésiste', value: 'Audioprothésiste', secteur: 'Santé', labels: { fr: 'Audioprothésiste', ar: 'أخصائي السمعيات', en: 'Hearing Aid Specialist', it: 'Acustico', ru: 'Специалист по слуху' } },

  // Artisanat & Services
  { slug: 'plombier', label: 'Plombier', value: 'Plombier', secteur: 'Services', labels: { fr: 'Plombier', ar: 'سباك', en: 'Plumber', it: 'Idraulico', ru: 'Сантехник' } },
  { slug: 'electricien', label: 'Électricien', value: 'Électricien', secteur: 'Services', labels: { fr: 'Électricien', ar: 'كهربائي', en: 'Electrician', it: 'Elettricista', ru: 'Электрик' } },
  { slug: 'menuisier', label: 'Menuisier', value: 'Menuisier', secteur: 'Artisanat', labels: { fr: 'Menuisier', ar: 'نجار', en: 'Carpenter', it: 'Falegname', ru: 'Плотник' } },
  { slug: 'serrurier', label: 'Serrurier', value: 'Serrurier', secteur: 'Services', labels: { fr: 'Serrurier', ar: 'حداد أقفال', en: 'Locksmith', it: 'Fabbro', ru: 'Слесарь' } },
  { slug: 'peintre', label: 'Peintre', value: 'Peintre', secteur: 'Artisanat', labels: { fr: 'Peintre', ar: 'دهان', en: 'Painter', it: 'Imbianchino', ru: 'Маляр' } },
  { slug: 'carreleur', label: 'Carreleur', value: 'Carreleur', secteur: 'Artisanat', labels: { fr: 'Carreleur', ar: 'بلاط', en: 'Tiler', it: 'Piastrellista', ru: 'Плиточник' } },
  { slug: 'maccon', label: 'Maçon', value: 'Maçon', secteur: 'Artisanat', labels: { fr: 'Maçon', ar: 'بنّاء', en: 'Mason', it: 'Muratore', ru: 'Каменщик' } },
  { slug: 'architecte', label: 'Architecte', value: 'Architecte', secteur: 'Profession libérale', labels: { fr: 'Architecte', ar: 'مهندس معماري', en: 'Architect', it: 'Architetto', ru: 'Архитектор' } },
  { slug: 'ingenieur', label: 'Ingénieur', value: 'Ingénieur', secteur: 'Profession libérale', labels: { fr: 'Ingénieur', ar: 'مهندس', en: 'Engineer', it: 'Ingegnere', ru: 'Инженер' } },
  { slug: 'geometre', label: 'Géomètre', value: 'Géomètre', secteur: 'Profession libérale', labels: { fr: 'Géomètre', ar: 'مسّاح أراضي', en: 'Surveyor', it: 'Geometra', ru: 'Землемер' } },
  { slug: 'notaire', label: 'Notaire', value: 'Notaire', secteur: 'Juridique', labels: { fr: 'Notaire', ar: 'موثّق', en: 'Notary', it: 'Notaio', ru: 'Нотариус' } },
  { slug: 'avocat', label: 'Avocat', value: 'Avocat', secteur: 'Juridique', labels: { fr: 'Avocat', ar: 'محام', en: 'Lawyer', it: 'Avvocato', ru: 'Адвокат' } },
  { slug: 'expert-comptable', label: 'Expert-comptable', value: 'Expert-comptable', secteur: 'Juridique', labels: { fr: 'Expert-comptable', ar: 'محاسب قانوني', en: 'Certified Accountant', it: 'Commercialista', ru: 'Бухгалтер-эксперт' } },
  { slug: 'conseil-juridique', label: 'Conseil juridique', value: 'Conseil juridique', secteur: 'Juridique', labels: { fr: 'Conseil juridique', ar: 'استشارة قانونية', en: 'Legal Counsel', it: 'Consulente legale', ru: 'Юридический консультант' } },
  { slug: 'huissier', label: 'Huissier de justice', value: 'Huissier de justice', secteur: 'Juridique', labels: { fr: 'Huissier de justice', ar: 'محرّك قضائي', en: 'Bailiff', it: 'Ufficiale giudiziario', ru: 'Судебный пристав' } },

  // Coiffure & Beauté
  { slug: 'coiffeur', label: 'Coiffeur', value: 'Coiffeur', secteur: 'Beauté', labels: { fr: 'Coiffeur', ar: 'حلاق', en: 'Hairdresser', it: 'Parrucchiere', ru: 'Парикмахер' } },
  { slug: 'coiffeur-homme', label: 'Coiffeur Homme', value: 'Coiffeur Homme', secteur: 'Beauté', labels: { fr: 'Coiffeur Homme', ar: 'حلاق رجالي', en: "Men's Hairdresser", it: 'Parrucchiere per uomo', ru: 'Мужской парикмахер' } },
  { slug: 'coiffeur-femme', label: 'Coiffeur Femme', value: 'Coiffeur Femme', secteur: 'Beauté', labels: { fr: 'Coiffeur Femme', ar: 'حلاق نسائي', en: "Women's Hairdresser", it: 'Parrucchiere per donna', ru: 'Женский парикмахер' } },
  { slug: 'coiffeur-domicile', label: 'Coiffeur à domicile', value: 'Coiffeur à domicile', secteur: 'Beauté', labels: { fr: 'Coiffeur à domicile', ar: 'حلاق في المنزل', en: 'Home Hairdresser', it: 'Parrucchiere a domicilio', ru: 'Парикмахер на дом' } },
  { slug: 'barbier', label: 'Barbier', value: 'Barbier', secteur: 'Beauté', labels: { fr: 'Barbier', ar: 'حلّاق', en: 'Barber', it: 'Barbiere', ru: 'Барбер' } },
  { slug: 'institut-beaute', label: 'Institut de beauté', value: 'Institut de beauté', secteur: 'Beauté', labels: { fr: 'Institut de beauté', ar: 'معهد تجميل', en: 'Beauty Salon', it: 'Istituto di bellezza', ru: 'Салон красоты' } },
  { slug: 'esthethicienne', label: 'Esthéticienne', value: 'Esthéticienne', secteur: 'Beauté', labels: { fr: 'Esthéticienne', ar: 'خبيرة تجميل', en: 'Beautician', it: 'Estetista', ru: 'Эстетист' } },
  { slug: 'onglerie', label: 'Onglerie', value: 'Onglerie', secteur: 'Beauté', labels: { fr: 'Onglerie', ar: 'تجميل الأظافر', en: 'Nail Salon', it: 'Nail Art', ru: 'Нейл-салон' } },
  { slug: 'maquilleuse', label: 'Maquilleuse', value: 'Maquilleuse', secteur: 'Beauté', labels: { fr: 'Maquilleuse', ar: 'خبيرة مكياج', en: 'Makeup Artist', it: 'Truccatrice', ru: 'Визажист' } },
  { slug: 'spa-hammam', label: 'Spa & Hammam', value: 'Spa & Hammam', secteur: 'Beauté', labels: { fr: 'Spa & Hammam', ar: 'سبا وحمام', en: 'Spa & Hammam', it: 'Spa e Hammam', ru: 'СПА и хаммам' } },
  { slug: 'epilation', label: 'Épilation', value: 'Épilation', secteur: 'Beauté', labels: { fr: 'Épilation', ar: 'إزالة الشعر', en: 'Hair Removal', it: 'Depilazione', ru: 'Эпиляция' } },
  { slug: 'massage', label: 'Massage', value: 'Massage', secteur: 'Beauté', labels: { fr: 'Massage', ar: 'تدليك', en: 'Massage', it: 'Massaggio', ru: 'Массаж' } },

  // Auto & Transport
  { slug: 'auto-ecole', label: 'Auto-école', value: 'Auto-école', secteur: 'Transport', labels: { fr: 'Auto-école', ar: 'مدرسة تعليم السياقة', en: 'Driving School', it: 'Scuola guida', ru: 'Автошкола' } },
  { slug: 'mecanicien', label: 'Mécanicien', value: 'Mécanicien', secteur: 'Auto', labels: { fr: 'Mécanicien', ar: 'ميكانيكي', en: 'Mechanic', it: 'Meccanico', ru: 'Механик' } },
  { slug: 'garage', label: 'Garage', value: 'Garage', secteur: 'Auto', labels: { fr: 'Garage', ar: 'كراج', en: 'Garage', it: 'Officina', ru: 'Автосервис' } },
  { slug: 'carrosserie', label: 'Carrosserie', value: 'Carrosserie', secteur: 'Auto', labels: { fr: 'Carrosserie', ar: 'هياكل السيارات', en: 'Body Shop', it: 'Carrozzeria', ru: 'Кузовной ремонт' } },
  { slug: 'lavage-auto', label: 'Lavage auto', value: 'Lavage auto', secteur: 'Auto', labels: { fr: 'Lavage auto', ar: 'غسيل السيارات', en: 'Car Wash', it: 'Autolavaggio', ru: 'Автомойка' } },
  { slug: 'vente-voiture', label: 'Vente de voitures', value: 'Vente de voitures', secteur: 'Auto', labels: { fr: 'Vente de voitures', ar: 'بيع السيارات', en: 'Car Dealership', it: 'Concessionaria auto', ru: 'Продажа автомобилей' } },
  { slug: 'location-voiture', label: 'Location de voitures', value: 'Location de voitures', secteur: 'Transport', labels: { fr: 'Location de voitures', ar: 'كراء السيارات', en: 'Car Rental', it: 'Autonoleggio', ru: 'Аренда автомобилей' } },
  { slug: 'taxi', label: 'Taxi', value: 'Taxi', secteur: 'Transport', labels: { fr: 'Taxi', ar: 'تاكسي', en: 'Taxi', it: 'Taxi', ru: 'Такси' } },
  { slug: 'transport-marchandises', label: 'Transport de marchandises', value: 'Transport de marchandises', secteur: 'Transport', labels: { fr: 'Transport de marchandises', ar: 'نقل البضائع', en: 'Freight Transport', it: 'Trasporto merci', ru: 'Грузоперевозки' } },
  { slug: 'demenagement', label: 'Déménagement', value: 'Déménagement', secteur: 'Services', labels: { fr: 'Déménagement', ar: 'نقل الأثاث', en: 'Moving Company', it: 'Traslochi', ru: 'Переезд' } },

  // Alimentation & Restauration
  { slug: 'restaurant', label: 'Restaurant', value: 'Restaurant', secteur: 'Restauration', labels: { fr: 'Restaurant', ar: 'مطعم', en: 'Restaurant', it: 'Ristorante', ru: 'Ресторан' } },
  { slug: 'restaurant-tunisien', label: 'Restaurant tunisien', value: 'Restaurant tunisien', secteur: 'Restauration', labels: { fr: 'Restaurant tunisien', ar: 'مطعم تونسي', en: 'Tunisian Restaurant', it: 'Ristorante tunisino', ru: 'Тунисский ресторан' } },
  { slug: 'fast-food', label: 'Fast-food', value: 'Fast-food', secteur: 'Restauration', labels: { fr: 'Fast-food', ar: 'وجبات سريعة', en: 'Fast Food', it: 'Fast Food', ru: 'Фастфуд' } },
  { slug: 'cafe', label: 'Café', value: 'Café', secteur: 'Restauration', labels: { fr: 'Café', ar: 'مقهى', en: 'Café', it: 'Caffè', ru: 'Кафе' } },
  { slug: 'patisserie', label: 'Pâtisserie', value: 'Pâtisserie', secteur: 'Alimentation', labels: { fr: 'Pâtisserie', ar: 'حلويات', en: 'Pastry Shop', it: 'Pasticceria', ru: 'Кондитерская' } },
  { slug: 'boulangerie', label: 'Boulangerie', value: 'Boulangerie', secteur: 'Alimentation', labels: { fr: 'Boulangerie', ar: 'مخبزة', en: 'Bakery', it: 'Panetteria', ru: 'Пекарня' } },
  { slug: 'boucherie', label: 'Boucherie', value: 'Boucherie', secteur: 'Alimentation', labels: { fr: 'Boucherie', ar: 'جزّارة', en: 'Butcher Shop', it: 'Macelleria', ru: 'Мясная лавка' } },
  { slug: 'poissonnerie', label: 'Poissonnerie', value: 'Poissonnerie', secteur: 'Alimentation', labels: { fr: 'Poissonnerie', ar: 'محل أسماك', en: 'Fish Shop', it: 'Pescheria', ru: 'Рыбный магазин' } },
  { slug: 'epicerie', label: 'Épicerie', value: 'Épicerie', secteur: 'Alimentation', labels: { fr: 'Épicerie', ar: 'بقالة', en: 'Grocery Store', it: 'Alimentari', ru: 'Продуктовый магазин' } },
  { slug: 'supermarche', label: 'Supermarché', value: 'Supermarché', secteur: 'Alimentation', labels: { fr: 'Supermarché', ar: 'سوق كبير', en: 'Supermarket', it: 'Supermercato', ru: 'Супермаркет' } },
  { slug: 'traiteur', label: 'Traiteur', value: 'Traiteur', secteur: 'Restauration', labels: { fr: 'Traiteur', ar: 'تموين الطعام', en: 'Caterer', it: 'Ristorazione catering', ru: 'Кейтеринг' } },
  { slug: 'catering', label: 'Catering', value: 'Catering', secteur: 'Restauration', labels: { fr: 'Catering', ar: 'خدمات تموين', en: 'Catering Service', it: 'Servizio catering', ru: 'Обслуживание мероприятий' } },

  // Mode & Shopping
  { slug: 'boutique-vetement', label: 'Boutique vêtements', value: 'Boutique vêtements', secteur: 'Mode', labels: { fr: 'Boutique vêtements', ar: 'ملابس', en: 'Clothing Store', it: 'Negozio di abbigliamento', ru: 'Магазин одежды' } },
  { slug: 'boutique-chaussures', label: 'Boutique chaussures', value: 'Boutique chaussures', secteur: 'Mode', labels: { fr: 'Boutique chaussures', ar: 'أحذية', en: 'Shoe Store', it: 'Negozio di calzature', ru: 'Магазин обуви' } },
  { slug: 'bijouterie', label: 'Bijouterie', value: 'Bijouterie', secteur: 'Mode', labels: { fr: 'Bijouterie', ar: 'مجوهرات', en: 'Jewelry Store', it: 'Gioielleria', ru: 'Ювелирный магазин' } },
  { slug: 'parfumerie', label: 'Parfumerie', value: 'Parfumerie', secteur: 'Mode', labels: { fr: 'Parfumerie', ar: 'عطور', en: 'Perfume Shop', it: 'Profumeria', ru: 'Парфюмерный магазин' } },
  { slug: 'cosmetiques', label: 'Cosmétiques', value: 'Cosmétiques', secteur: 'Beauté', labels: { fr: 'Cosmétiques', ar: 'مستحضرات تجميل', en: 'Cosmetics', it: 'Cosmetici', ru: 'Косметика' } },
  { slug: 'maroquinerie', label: 'Maroquinerie', value: 'Maroquinerie', secteur: 'Mode', labels: { fr: 'Maroquinerie', ar: 'جلديات', en: 'Leather Goods', it: 'Pelletteria', ru: 'Кожгалантерея' } },
  { slug: 'lingerie', label: 'Lingerie', value: 'Lingerie', secteur: 'Mode', labels: { fr: 'Lingerie', ar: 'ملابس داخلية', en: 'Lingerie', it: 'Lingerie', ru: 'Бельё' } },
  { slug: 'optique', label: 'Optique', value: 'Optique', secteur: 'Mode', labels: { fr: 'Optique', ar: 'نظارات', en: 'Optician', it: 'Ottico', ru: 'Оптик' } },

  // Éducation & Formation
  { slug: 'jardin-enfant', label: 'Jardin d\'enfant', value: 'Jardin d\'enfant', secteur: 'Éducation', labels: { fr: 'Jardin d\'enfant', ar: 'روضة أطفال', en: 'Kindergarten', it: 'Scuola materna', ru: 'Детский сад' } },
  { slug: 'ecole-privee', label: 'École privée', value: 'École privée', secteur: 'Éducation', labels: { fr: 'École privée', ar: 'مدرسة خاصة', en: 'Private School', it: 'Scuola privata', ru: 'Частная школа' } },
  { slug: 'centre-formation', label: 'Centre de formation', value: 'Centre de formation', secteur: 'Éducation', labels: { fr: 'Centre de formation', ar: 'مركز تكوين', en: 'Training Center', it: 'Centro di formazione', ru: 'Учебный центр' } },
  { slug: 'cours-particuliers', label: 'Cours particuliers', value: 'Cours particuliers', secteur: 'Éducation', labels: { fr: 'Cours particuliers', ar: 'دروس خصوصية', en: 'Private Tutoring', it: 'Ripetizioni private', ru: 'Репетиторство' } },
  { slug: 'soutien-scolaire', label: 'Soutien scolaire', value: 'Soutien scolaire', secteur: 'Éducation', labels: { fr: 'Soutien scolaire', ar: 'دعم مدرسي', en: 'Homework Support', it: 'Sostegno scolastico', ru: 'Помощь в учёбе' } },
  { slug: 'universite', label: 'Université', value: 'Université', secteur: 'Éducation', labels: { fr: 'Université', ar: 'جامعة', en: 'University', it: 'Università', ru: 'Университет' } },

  // Sports & Bien-être
  { slug: 'salle-sport', label: 'Salle de sport', value: 'Salle de sport', secteur: 'Sport', labels: { fr: 'Salle de sport', ar: 'قاعة رياضية', en: 'Gym', it: 'Palestra', ru: 'Спортзал' } },
  { slug: 'fitness', label: 'Fitness', value: 'Fitness', secteur: 'Sport', labels: { fr: 'Fitness', ar: 'لياقة بدنية', en: 'Fitness', it: 'Fitness', ru: 'Фитнес' } },
  { slug: 'yoga', label: 'Yoga', value: 'Yoga', secteur: 'Bien-être', labels: { fr: 'Yoga', ar: 'يوغا', en: 'Yoga', it: 'Yoga', ru: 'Йога' } },
  { slug: 'piscine', label: 'Piscine', value: 'Piscine', secteur: 'Sport', labels: { fr: 'Piscine', ar: 'مسبح', en: 'Swimming Pool', it: 'Piscina', ru: 'Бассейн' } },
  { slug: 'club-sportif', label: 'Club sportif', value: 'Club sportif', secteur: 'Sport', labels: { fr: 'Club sportif', ar: 'ناد رياضي', en: 'Sports Club', it: 'Club sportivo', ru: 'Спортивный клуб' } },
  { slug: 'coach-sportif', label: 'Coach sportif', value: 'Coach sportif', secteur: 'Sport', labels: { fr: 'Coach sportif', ar: 'مدرب رياضي', en: 'Sports Coach', it: 'Personal trainer', ru: 'Спортивный тренер' } },

  // Multimédia & Tech
  { slug: 'informatique', label: 'Informatique', value: 'Informatique', secteur: 'Tech', labels: { fr: 'Informatique', ar: 'معلوماتية', en: 'IT Services', it: 'Informatica', ru: 'ИТ-услуги' } },
  { slug: 'reparation-informatique', label: 'Réparation informatique', value: 'Réparation informatique', secteur: 'Tech', labels: { fr: 'Réparation informatique', ar: 'إصلاح الحاسوب', en: 'Computer Repair', it: 'Riparazione computer', ru: 'Ремонт компьютеров' } },
  { slug: 'telephonie', label: 'Téléphonie', value: 'Téléphonie', secteur: 'Tech', labels: { fr: 'Téléphonie', ar: 'هواتف', en: 'Mobile Phones', it: 'Telefonia', ru: 'Мобильные телефоны' } },
  { slug: 'internet-cafe', label: 'Internet café', value: 'Internet café', secteur: 'Tech', labels: { fr: 'Internet café', ar: 'مقهى إنترنت', en: 'Internet Café', it: 'Internet point', ru: 'Интернет-кафе' } },
  { slug: 'photographe', label: 'Photographe', value: 'Photographe', secteur: 'Art', labels: { fr: 'Photographe', ar: 'مصور', en: 'Photographer', it: 'Fotografo', ru: 'Фотограф' } },
  { slug: 'videaste', label: 'Vidéaste', value: 'Vidéaste', secteur: 'Art', labels: { fr: 'Vidéaste', ar: 'مصور فيديو', en: 'Videographer', it: 'Videomaker', ru: 'Видеограф' } },
  { slug: 'graphiste', label: 'Graphiste', value: 'Graphiste', secteur: 'Art', labels: { fr: 'Graphiste', ar: 'مصمم جرافيك', en: 'Graphic Designer', it: 'Grafico', ru: 'Графический дизайнер' } },
  { slug: 'webmaster', label: 'Webmaster', value: 'Webmaster', secteur: 'Tech', labels: { fr: 'Webmaster', ar: 'مسؤول موقع', en: 'Webmaster', it: 'Webmaster', ru: 'Вебмастер' } },
  { slug: 'agence-web', label: 'Agence web', value: 'Agence web', secteur: 'Tech', labels: { fr: 'Agence web', ar: 'وكالة ويب', en: 'Web Agency', it: 'Agenzia web', ru: 'Веб-агентство' } },
  { slug: 'impression', label: 'Impression', value: 'Impression', secteur: 'Services', labels: { fr: 'Impression', ar: 'طباعة', en: 'Printing', it: 'Stampa', ru: 'Печать' } },

  // Immobilier & Construction
  { slug: 'agence-immobiliere', label: 'Agence immobilière', value: 'Agence immobilière', secteur: 'Immobilier', labels: { fr: 'Agence immobilière', ar: 'وكالة عقارية', en: 'Real Estate Agency', it: 'Agenzia immobiliare', ru: 'Агентство недвижимости' } },
  { slug: 'promoteur-immobilier', label: 'Promoteur immobilier', value: 'Promoteur immobilier', secteur: 'Immobilier', labels: { fr: 'Promoteur immobilier', ar: 'مطوّر عقاري', en: 'Property Developer', it: 'Promotore immobiliare', ru: 'Девелопер' } },
  { slug: 'syndic', label: 'Syndic', value: 'Syndic', secteur: 'Immobilier', labels: { fr: 'Syndic', ar: 'إدارة الأملاك المشتركة', en: 'Property Management', it: 'Amministratore condominiale', ru: 'Управление недвижимостью' } },
  { slug: 'diagnostiqueur', label: 'Diagnostiqueur', value: 'Diagnostiqueur', secteur: 'Immobilier', labels: { fr: 'Diagnostiqueur', ar: 'خبير تشخيص عقاري', en: 'Property Inspector', it: 'Diagnosta immobiliare', ru: 'Эксперт по диагностике' } },

  // Événementiel & Loisirs
  { slug: 'traiteur-mariage', label: 'Traiteur mariage', value: 'Traiteur mariage', secteur: 'Événementiel', labels: { fr: 'Traiteur mariage', ar: 'تموين أعراس', en: 'Wedding Catering', it: 'Catering per matrimoni', ru: 'Свадебный кейтеринг' } },
  { slug: 'decoration-mariage', label: 'Décoration mariage', value: 'Décoration mariage', secteur: 'Événementiel', labels: { fr: 'Décoration mariage', ar: 'تزيين الأعراس', en: 'Wedding Decoration', it: 'Decorazione nozze', ru: 'Свадебный декор' } },
  { slug: 'location-salle', label: 'Location de salle', value: 'Location de salle', secteur: 'Événementiel', labels: { fr: 'Location de salle', ar: 'كراء قاعات', en: 'Hall Rental', it: 'Affitto sale', ru: 'Аренда зала' } },
  { slug: 'animation', label: 'Animation', value: 'Animation', secteur: 'Événementiel', labels: { fr: 'Animation', ar: 'تنشيط', en: 'Entertainment', it: 'Animazione', ru: 'Анимация' } },
  { slug: 'dj', label: 'DJ', value: 'DJ', secteur: 'Événementiel', labels: { fr: 'DJ', ar: 'دي جي', en: 'DJ', it: 'DJ', ru: 'Диджей' } },
  { slug: 'fleuriste', label: 'Fleuriste', value: 'Fleuriste', secteur: 'Événementiel', labels: { fr: 'Fleuriste', ar: 'بائع الزهور', en: 'Florist', it: 'Fiorista', ru: 'Флорист' } },
  { slug: 'cadeaux', label: 'Cadeaux', value: 'Cadeaux', secteur: 'Shopping', labels: { fr: 'Cadeaux', ar: 'هدايا', en: 'Gift Shop', it: 'Negozio di regali', ru: 'Магазин подарков' } },

  // Animaux
  { slug: 'veterinaire', label: 'Vétérinaire', value: 'Vétérinaire', secteur: 'Animaux', labels: { fr: 'Vétérinaire', ar: 'طبيب بيطري', en: 'Veterinarian', it: 'Veterinario', ru: 'Ветеринар' } },
  { slug: 'toilettage-animaux', label: 'Toilettage animaux', value: 'Toilettage animaux', secteur: 'Animaux', labels: { fr: 'Toilettage animaux', ar: 'تنظيف الحيوانات', en: 'Pet Grooming', it: 'Toelettatura animali', ru: 'Груминг животных' } },
  { slug: 'animalerie', label: 'Animalerie', value: 'Animalerie', secteur: 'Animaux', labels: { fr: 'Animalerie', ar: 'محل حيوانات', en: 'Pet Shop', it: 'Negozio di animali', ru: 'Зоомагазин' } },
  { slug: 'pension-animaux', label: 'Pension animaux', value: 'Pension animaux', secteur: 'Animaux', labels: { fr: 'Pension animaux', ar: 'إقامة الحيوانات', en: 'Pet Boarding', it: 'Pensione per animali', ru: 'Передержка животных' } },

  // Nettoyage & Entretien
  { slug: 'nettoyage', label: 'Nettoyage', value: 'Nettoyage', secteur: 'Services', labels: { fr: 'Nettoyage', ar: 'تنظيف', en: 'Cleaning', it: 'Pulizie', ru: 'Уборка' } },
  { slug: 'femme-menage', label: 'Femme de ménage', value: 'Femme de ménage', secteur: 'Services', labels: { fr: 'Femme de ménage', ar: 'عاملة منزلية', en: 'Housekeeper', it: 'Colf', ru: 'Домработница' } },
  { slug: 'nettoyage-industriel', label: 'Nettoyage industriel', value: 'Nettoyage industriel', secteur: 'Services', labels: { fr: 'Nettoyage industriel', ar: 'تنظيف صناعي', en: 'Industrial Cleaning', it: 'Pulizie industriali', ru: 'Промышленная уборка' } },
  { slug: 'jardinier', label: 'Jardinier', value: 'Jardinier', secteur: 'Services', labels: { fr: 'Jardinier', ar: 'بستاني', en: 'Gardener', it: 'Giardiniere', ru: 'Садовник' } },
  { slug: 'paysagiste', label: 'Paysagiste', value: 'Paysagiste', secteur: 'Services', labels: { fr: 'Paysagiste', ar: 'مهندس حدائق', en: 'Landscaper', it: 'Paesaggista', ru: 'Ландшафтный дизайнер' } },
  { slug: 'pisciniste', label: 'Pisciniste', value: 'Pisciniste', secteur: 'Services', labels: { fr: 'Pisciniste', ar: 'متخصص المسابح', en: 'Pool Specialist', it: 'Piscinista', ru: 'Специалист по бассейнам' } },
];

export const SEO_VILLES: VilleEntry[] = [
  // Grand Tunis
  { slug: 'tunis', label: 'Tunis', gouvernorat: 'Tunis', labels: { fr: 'Tunis', ar: 'تونس', en: 'Tunis', it: 'Tunisi', ru: 'Тунис' } },
  { slug: 'la-marsa', label: 'La Marsa', gouvernorat: 'Tunis', labels: { fr: 'La Marsa', ar: 'المرسى', en: 'La Marsa', it: 'La Marsa', ru: 'Ла-Марса' } },
  { slug: 'carthage', label: 'Carthage', gouvernorat: 'Tunis', labels: { fr: 'Carthage', ar: 'قرطاج', en: 'Carthage', it: 'Cartagine', ru: 'Карфаген' } },
  { slug: 'ariana', label: 'Ariana', gouvernorat: 'Ariana', labels: { fr: 'Ariana', ar: 'أريانة', en: 'Ariana', it: 'Ariana', ru: 'Ариана' } },
  { slug: 'soukra', label: 'Soukra', gouvernorat: 'Ariana', labels: { fr: 'Soukra', ar: 'سكرة', en: 'Soukra', it: 'Soukra', ru: 'Сукра' } },
  { slug: 'ennasr', label: 'Ennasr', gouvernorat: 'Ariana', labels: { fr: 'Ennasr', ar: 'النصر', en: 'Ennasr', it: 'Ennasr', ru: 'Эн-Наср' } },
  { slug: 'el-menzah', label: 'El Menzah', gouvernorat: 'Ariana', labels: { fr: 'El Menzah', ar: 'المنزه', en: 'El Menzah', it: 'El Menzah', ru: 'Эль-Мензах' } },
  { slug: 'ben-arous', label: 'Ben Arous', gouvernorat: 'Ben Arous', labels: { fr: 'Ben Arous', ar: 'بن عروس', en: 'Ben Arous', it: 'Ben Arous', ru: 'Бен-Арусс' } },
  { slug: 'rades', label: 'Radès', gouvernorat: 'Ben Arous', labels: { fr: 'Radès', ar: 'رادس', en: 'Radès', it: 'Radès', ru: 'Радес' } },
  { slug: 'la-manouba', label: 'La Manouba', gouvernorat: 'La Manouba', labels: { fr: 'La Manouba', ar: 'منوبة', en: 'La Manouba', it: 'La Manouba', ru: 'Мануба' } },
  // Nord-Est
  { slug: 'nabeul', label: 'Nabeul', gouvernorat: 'Nabeul', labels: { fr: 'Nabeul', ar: 'نابل', en: 'Nabeul', it: 'Nabeul', ru: 'Набель' } },
  { slug: 'hammamet', label: 'Hammamet', gouvernorat: 'Nabeul', labels: { fr: 'Hammamet', ar: 'حمامات', en: 'Hammamet', it: 'Hammamet', ru: 'Хаммамет' } },
  { slug: 'kelibia', label: 'Kélibia', gouvernorat: 'Nabeul', labels: { fr: 'Kélibia', ar: 'كليبية', en: 'Kélibia', it: 'Kélibia', ru: 'Келибия' } },
  { slug: 'korba', label: 'Korba', gouvernorat: 'Nabeul', labels: { fr: 'Korba', ar: 'قرمبالة', en: 'Korba', it: 'Korba', ru: 'Корба' } },
  { slug: 'dar-chaabane', label: 'Dar Chaabane', gouvernorat: 'Nabeul', labels: { fr: 'Dar Chaabane', ar: 'دار شعبان', en: 'Dar Chaabane', it: 'Dar Chaabane', ru: 'Дар-Шаабан' } },
  { slug: 'bizerte', label: 'Bizerte', gouvernorat: 'Bizerte', labels: { fr: 'Bizerte', ar: 'بنزرت', en: 'Bizerte', it: 'Bizerte', ru: 'Бизерта' } },
  { slug: 'zaghouan', label: 'Zaghouan', gouvernorat: 'Zaghouan', labels: { fr: 'Zaghouan', ar: 'زغوان', en: 'Zaghouan', it: 'Zaghouan', ru: 'Загуан' } },
  // Nord-Ouest
  { slug: 'beja', label: 'Béja', gouvernorat: 'Béja', labels: { fr: 'Béja', ar: 'باجة', en: 'Béja', it: 'Béja', ru: 'Беджа' } },
  { slug: 'jendouba', label: 'Jendouba', gouvernorat: 'Jendouba', labels: { fr: 'Jendouba', ar: 'جندوبة', en: 'Jendouba', it: 'Jendouba', ru: 'Жендуба' } },
  { slug: 'tabarka', label: 'Tabarka', gouvernorat: 'Jendouba', labels: { fr: 'Tabarka', ar: 'طبرقة', en: 'Tabarka', it: 'Tabarka', ru: 'Табарка' } },
  { slug: 'ain-draham', label: 'Aïn Draham', gouvernorat: 'Jendouba', labels: { fr: 'Aïn Draham', ar: 'عين دراهم', en: 'Aïn Draham', it: 'Aïn Draham', ru: 'Эн-Драхам' } },
  { slug: 'le-kef', label: 'Le Kef', gouvernorat: 'Le Kef', labels: { fr: 'Le Kef', ar: 'الكاف', en: 'Le Kef', it: 'Le Kef', ru: 'Эль-Кеф' } },
  { slug: 'siliana', label: 'Siliana', gouvernorat: 'Siliana', labels: { fr: 'Siliana', ar: 'سليانة', en: 'Siliana', it: 'Siliana', ru: 'Силиана' } },
  // Centre-Est
  { slug: 'sousse', label: 'Sousse', gouvernorat: 'Sousse', labels: { fr: 'Sousse', ar: 'سوسة', en: 'Sousse', it: 'Sousse', ru: 'Сус' } },
  { slug: 'msaken', label: 'Msaken', gouvernorat: 'Sousse', labels: { fr: 'Msaken', ar: 'مساكن', en: 'Msaken', it: 'Msaken', ru: 'Мсакен' } },
  { slug: 'kalaa-kebira', label: 'Kalaa Kebira', gouvernorat: 'Sousse', labels: { fr: 'Kalaa Kebira', ar: 'القلعة الكبيرة', en: 'Kalaa Kebira', it: 'Kalaa Kebira', ru: 'Калаа-Кебира' } },
  { slug: 'kalaa-sghira', label: 'Kalaa Sghira', gouvernorat: 'Sousse', labels: { fr: 'Kalaa Sghira', ar: 'القلعة الصغيرة', en: 'Kalaa Sghira', it: 'Kalaa Sghira', ru: 'Калаа-Сгира' } },
  { slug: 'monastir', label: 'Monastir', gouvernorat: 'Monastir', labels: { fr: 'Monastir', ar: 'المنستير', en: 'Monastir', it: 'Monastir', ru: 'Монастир' } },
  { slug: 'moknine', label: 'Moknine', gouvernorat: 'Monastir', labels: { fr: 'Moknine', ar: 'مكنين', en: 'Moknine', it: 'Moknine', ru: 'Мокнин' } },
  { slug: 'jemmal', label: 'Jemmal', gouvernorat: 'Monastir', labels: { fr: 'Jemmal', ar: 'جمّال', en: 'Jemmal', it: 'Jemmal', ru: 'Джеммаль' } },
  { slug: 'port-el-kantaoui', label: 'Port El Kantaoui', gouvernorat: 'Sousse', labels: { fr: 'Port El Kantaoui', ar: 'بور الكنتاوي', en: 'Port El Kantaoui', it: 'Port El Kantaoui', ru: 'Порт-эль-Кантауи' } },
  { slug: 'mahdia', label: 'Mahdia', gouvernorat: 'Mahdia', labels: { fr: 'Mahdia', ar: 'المهدية', en: 'Mahdia', it: 'Mahdia', ru: 'Махдия' } },
  // Centre
  { slug: 'kairouan', label: 'Kairouan', gouvernorat: 'Kairouan', labels: { fr: 'Kairouan', ar: 'القيروان', en: 'Kairouan', it: 'Kairouan', ru: 'Кайруан' } },
  { slug: 'kasserine', label: 'Kasserine', gouvernorat: 'Kasserine', labels: { fr: 'Kasserine', ar: 'القصرين', en: 'Kasserine', it: 'Kasserine', ru: 'Кассерин' } },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', gouvernorat: 'Sidi Bouzid', labels: { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد', en: 'Sidi Bouzid', it: 'Sidi Bouzid', ru: 'Сиди-Бузид' } },
  // Sud-Est
  { slug: 'sfax', label: 'Sfax', gouvernorat: 'Sfax', labels: { fr: 'Sfax', ar: 'صفاقس', en: 'Sfax', it: 'Sfax', ru: 'Сфакс' } },
  { slug: 'gabes', label: 'Gabès', gouvernorat: 'Gabès', labels: { fr: 'Gabès', ar: 'قابس', en: 'Gabès', it: 'Gabès', ru: 'Габес' } },
  { slug: 'medenine', label: 'Médenine', gouvernorat: 'Médenine', labels: { fr: 'Médenine', ar: 'مدنين', en: 'Médenine', it: 'Médenine', ru: 'Меденин' } },
  { slug: 'tataouine', label: 'Tataouine', gouvernorat: 'Tataouine', labels: { fr: 'Tataouine', ar: 'تطاوين', en: 'Tataouine', it: 'Tataouine', ru: 'Татауин' } },
  { slug: 'zarzis', label: 'Zarzis', gouvernorat: 'Médenine', labels: { fr: 'Zarzis', ar: 'جرجيس', en: 'Zarzis', it: 'Zarzis', ru: 'Зарзис' } },
  { slug: 'djerba', label: 'Djerba', gouvernorat: 'Médenine', labels: { fr: 'Djerba', ar: 'جربة', en: 'Djerba', it: 'Djerba', ru: 'Джерба' } },
  { slug: 'houmt-souk', label: 'Houmt Souk', gouvernorat: 'Médenine', labels: { fr: 'Houmt Souk', ar: 'حومة السوق', en: 'Houmt Souk', it: 'Houmt Souk', ru: 'Хумт-Сук' } },
  { slug: 'midoun', label: 'Midoun', gouvernorat: 'Médenine', labels: { fr: 'Midoun', ar: 'ميدون', en: 'Midoun', it: 'Midoun', ru: 'Мидун' } },
  // Sud-Ouest
  { slug: 'gafsa', label: 'Gafsa', gouvernorat: 'Gafsa', labels: { fr: 'Gafsa', ar: 'قفصة', en: 'Gafsa', it: 'Gafsa', ru: 'Гафса' } },
  { slug: 'tozeur', label: 'Tozeur', gouvernorat: 'Tozeur', labels: { fr: 'Tozeur', ar: 'توزر', en: 'Tozeur', it: 'Tozeur', ru: 'Тозёр' } },
  { slug: 'nefta', label: 'Nefta', gouvernorat: 'Tozeur', labels: { fr: 'Nefta', ar: 'نفتة', en: 'Nefta', it: 'Nefta', ru: 'Нефта' } },
  { slug: 'kebili', label: 'Kébili', gouvernorat: 'Kébili', labels: { fr: 'Kébili', ar: 'قبلي', en: 'Kébili', it: 'Kébili', ru: 'Кебили' } },
  { slug: 'douz', label: 'Douz', gouvernorat: 'Kébili', labels: { fr: 'Douz', ar: 'دوز', en: 'Douz', it: 'Douz', ru: 'Дуз' } },
];

export const SEO_SOUS_CATEGORIES: Record<string, SousCategorieEntry[]> = {
  avocat: [
    { slug: 'fiscaliste', label: 'fiscaliste', labels: { fr: 'fiscaliste', ar: 'محامي ضرائب', en: 'Tax Lawyer', it: 'Avvocato tributario', ru: 'Налоговый юрист' } },
    { slug: 'droit-du-travail', label: 'droit du travail', labels: { fr: 'droit du travail', ar: 'قانون العمل', en: 'Labor Law', it: 'Diritto del lavoro', ru: 'Трудовое право' } },
    { slug: 'immobilier', label: 'immobilier', labels: { fr: 'immobilier', ar: 'قانون عقاري', en: 'Real Estate Law', it: 'Diritto immobiliare', ru: 'Недвижимое право' } },
    { slug: 'droit-des-societes', label: 'droit des sociétés', labels: { fr: 'droit des sociétés', ar: 'قانون الشركات', en: 'Corporate Law', it: 'Diritto societario', ru: 'Корпоративное право' } },
    { slug: 'droit-penal', label: 'droit pénal', labels: { fr: 'droit pénal', ar: 'قانون جنائي', en: 'Criminal Law', it: 'Diritto penale', ru: 'Уголовное право' } },
    { slug: 'droit-familial', label: 'droit familial', labels: { fr: 'droit familial', ar: 'قانون الأسرة', en: 'Family Law', it: 'Diritto di famiglia', ru: 'Семейное право' } },
  ],
  'medecin-specialiste': [
    { slug: 'cardiologue', label: 'cardiologue', labels: { fr: 'cardiologue', ar: 'طبيب قلب', en: 'Cardiologist', it: 'Cardiologo', ru: 'Кардиолог' } },
    { slug: 'dermatologue', label: 'dermatologue', labels: { fr: 'dermatologue', ar: 'طبيب جلدية', en: 'Dermatologist', it: 'Dermatologo', ru: 'Дерматолог' } },
    { slug: 'gynecologue', label: 'gynécologue', labels: { fr: 'gynécologue', ar: 'طبيب نساء', en: 'Gynecologist', it: 'Ginecologo', ru: 'Гинеколог' } },
    { slug: 'pediatre', label: 'pédiatre', labels: { fr: 'pédiatre', ar: 'طبيب أطفال', en: 'Pediatrician', it: 'Pediatra', ru: 'Педиатр' } },
    { slug: 'ophtalmologue', label: 'ophtalmologue', labels: { fr: 'ophtalmologue', ar: 'طبيب عيون', en: 'Ophthalmologist', it: 'Oftalmologo', ru: 'Офтальмолог' } },
    { slug: 'orl', label: 'ORL', labels: { fr: 'ORL', ar: 'أنف وأذن وحنجرة', en: 'ENT Specialist', it: 'Otorinolaringoiatra', ru: 'ЛОР-врач' } },
    { slug: 'rhumatologue', label: 'rhumatologue', labels: { fr: 'rhumatologue', ar: 'طبيب روماتيزم', en: 'Rheumatologist', it: 'Reumatologo', ru: 'Ревматолог' } },
    { slug: 'neurologue', label: 'neurologue', labels: { fr: 'neurologue', ar: 'طبيب أعصاب', en: 'Neurologist', it: 'Neurologo', ru: 'Невролог' } },
  ],
  coiffeur: [
    { slug: 'homme', label: 'homme', labels: { fr: 'homme', ar: 'رجالي', en: 'Men', it: 'Uomo', ru: 'Мужской' } },
    { slug: 'femme', label: 'femme', labels: { fr: 'femme', ar: 'نسائي', en: 'Women', it: 'Donna', ru: 'Женский' } },
    { slug: 'enfant', label: 'enfant', labels: { fr: 'enfant', ar: 'أطفال', en: 'Children', it: 'Bambini', ru: 'Детский' } },
    { slug: 'domicile', label: 'domicile', labels: { fr: 'domicile', ar: 'في المنزل', en: 'Home Service', it: 'A domicilio', ru: 'На дом' } },
    { slug: 'mariage', label: 'mariage', labels: { fr: 'mariage', ar: 'أعراس', en: 'Wedding', it: 'Matrimonio', ru: 'Свадебная' } },
    { slug: 'balayage', label: 'balayage', labels: { fr: 'balayage', ar: 'ميش', en: 'Balayage', it: 'Balayage', ru: 'Балаяж' } },
    { slug: 'brushing', label: 'brushing', labels: { fr: 'brushing', ar: 'تجفيف الشعر', en: 'Blowout', it: 'Piega', ru: 'Брашинг' } },
    { slug: 'coloration', label: 'coloration', labels: { fr: 'coloration', ar: 'صبغة الشعر', en: 'Hair Coloring', it: 'Colorazione', ru: 'Окрашивание' } },
  ],
  plombier: [
    { slug: 'chauffage', label: 'chauffage', labels: { fr: 'chauffage', ar: 'تدفئة', en: 'Heating', it: 'Riscaldamento', ru: 'Отопление' } },
    { slug: 'depannage', label: 'dépannage', labels: { fr: 'dépannage', ar: 'إصلاح', en: 'Repair', it: 'Riparazione', ru: 'Ремонт' } },
    { slug: 'installation', label: 'installation', labels: { fr: 'installation', ar: 'تركيب', en: 'Installation', it: 'Installazione', ru: 'Монтаж' } },
    { slug: 'fuite-eau', label: 'fuite d\'eau', labels: { fr: 'fuite d\'eau', ar: 'تسرب الماء', en: 'Water Leak', it: 'Perdita d\'acqua', ru: 'Утечка воды' } },
    { slug: 'climatisation', label: 'climatisation', labels: { fr: 'climatisation', ar: 'تكييف', en: 'Air Conditioning', it: 'Climatizzazione', ru: 'Кондиционирование' } },
    { slug: 'sanitaire', label: 'sanitaire', labels: { fr: 'sanitaire', ar: 'صحي', en: 'Plumbing Fixtures', it: 'Sanitari', ru: 'Сантехника' } },
  ],
  electricien: [
    { slug: 'installation', label: 'installation', labels: { fr: 'installation', ar: 'تركيب', en: 'Installation', it: 'Installazione', ru: 'Монтаж' } },
    { slug: 'depannage', label: 'dépannage', labels: { fr: 'dépannage', ar: 'إصلاح', en: 'Repair', it: 'Riparazione', ru: 'Ремонт' } },
    { slug: 'domotique', label: 'domotique', labels: { fr: 'domotique', ar: 'منزل ذكي', en: 'Home Automation', it: 'Domotica', ru: 'Умный дом' } },
    { slug: 'eclairage', label: 'éclairage', labels: { fr: 'éclairage', ar: 'إنارة', en: 'Lighting', it: 'Illuminazione', ru: 'Освещение' } },
    { slug: 'tableau-electrique', label: 'tableau électrique', labels: { fr: 'tableau électrique', ar: 'لوحة كهربائية', en: 'Electrical Panel', it: 'Quadro elettrico', ru: 'Электрощит' } },
  ],
  dentiste: [
    { slug: 'implantologie', label: 'implantologie', labels: { fr: 'implantologie', ar: 'زراعة الأسنان', en: 'Implantology', it: 'Implantologia', ru: 'Имплантология' } },
    { slug: 'orthodontie', label: 'orthodontie', labels: { fr: 'orthodontie', ar: 'تقويم الأسنان', en: 'Orthodontics', it: 'Ortodonzia', ru: 'Ортодонтия' } },
    { slug: 'parodontologie', label: 'parodontologie', labels: { fr: 'parodontologie', ar: 'أمراض اللثة', en: 'Periodontology', it: 'Parodontologia', ru: 'Пародонтология' } },
    { slug: 'esthetique', label: 'esthétique', labels: { fr: 'esthétique', ar: 'تجميل الأسنان', en: 'Aesthetic Dentistry', it: 'Estetica dentale', ru: 'Эстетическая стоматология' } },
    { slug: 'pedodontie', label: 'pédodontie', labels: { fr: 'pédodontie', ar: 'طب أسنان الأطفال', en: 'Pediatric Dentistry', it: 'Pedodonzia', ru: 'Детская стоматология' } },
    { slug: 'endodontie', label: 'endodontie', labels: { fr: 'endodontie', ar: 'علاج العصب', en: 'Endodontics', it: 'Endodonzia', ru: 'Эндодонтия' } },
  ],
  'institut-beaute': [
    { slug: 'epilation', label: 'épilation', labels: { fr: 'épilation', ar: 'إزالة الشعر', en: 'Hair Removal', it: 'Depilazione', ru: 'Эпиляция' } },
    { slug: 'soins-visage', label: 'soins visage', labels: { fr: 'soins visage', ar: 'عناية بالوجه', en: 'Facial Care', it: 'Cura del viso', ru: 'Уход за лицом' } },
    { slug: 'massage', label: 'massage', labels: { fr: 'massage', ar: 'تدليك', en: 'Massage', it: 'Massaggio', ru: 'Массаж' } },
    { slug: 'onglerie', label: 'onglerie', labels: { fr: 'onglerie', ar: 'تجميل الأظافر', en: 'Nail Care', it: 'Manicure', ru: 'Нейл-арт' } },
    { slug: 'maquillage', label: 'maquillage', labels: { fr: 'maquillage', ar: 'مكياج', en: 'Makeup', it: 'Trucco', ru: 'Макияж' } },
    { slug: 'soins-corps', label: 'soins corps', labels: { fr: 'soins corps', ar: 'عناية بالجسم', en: 'Body Care', it: 'Cura del corpo', ru: 'Уход за телом' } },
  ],
  restaurant: [
    { slug: 'tunisien', label: 'tunisien', labels: { fr: 'tunisien', ar: 'تونسي', en: 'Tunisian', it: 'Tunisino', ru: 'Тунисская кухня' } },
    { slug: 'italien', label: 'italien', labels: { fr: 'italien', ar: 'إيطالي', en: 'Italian', it: 'Italiano', ru: 'Итальянская кухня' } },
    { slug: 'francais', label: 'français', labels: { fr: 'français', ar: 'فرنسي', en: 'French', it: 'Francese', ru: 'Французская кухня' } },
    { slug: 'fast-food', label: 'fast-food', labels: { fr: 'fast-food', ar: 'وجبات سريعة', en: 'Fast Food', it: 'Fast Food', ru: 'Фастфуд' } },
    { slug: 'pizzeria', label: 'pizzeria', labels: { fr: 'pizzeria', ar: 'بيتزا', en: 'Pizzeria', it: 'Pizzeria', ru: 'Пиццерия' } },
    { slug: 'poisson', label: 'poisson', labels: { fr: 'poisson', ar: 'سمك', en: 'Seafood', it: 'Pesce', ru: 'Рыба' } },
    { slug: 'viande', label: 'viande', labels: { fr: 'viande', ar: 'لحوم', en: 'Meat', it: 'Carne', ru: 'Мясо' } },
    { slug: 'vegetarien', label: 'végétarien', labels: { fr: 'végétarien', ar: 'نباتي', en: 'Vegetarian', it: 'Vegetariano', ru: 'Вегетарианская' } },
  ],
  'auto-ecole': [
    { slug: 'permis-b', label: 'permis B', labels: { fr: 'permis B', ar: 'رخصة سيارة', en: 'License B (Car)', it: 'Patente B', ru: 'Права категории B' } },
    { slug: 'permis-a', label: 'permis A', labels: { fr: 'permis A', ar: 'رخصة دراجة', en: 'License A (Motorcycle)', it: 'Patente A', ru: 'Права категории A' } },
    { slug: 'permis-poids-lourd', label: 'poids lourd', labels: { fr: 'poids lourd', ar: 'شاحنات', en: 'Heavy Vehicle License', it: 'Patente C', ru: 'Права на грузовик' } },
    { slug: 'permis-moto', label: 'moto', labels: { fr: 'moto', ar: 'دراجة نارية', en: 'Motorcycle License', it: 'Patente moto', ru: 'Мотоцикл' } },
    { slug: 'remorquage', label: 'remorquage', labels: { fr: 'remorquage', ar: 'سحب سيارة', en: 'Towing', it: 'Rimorchio', ru: 'Буксировка' } },
  ],
  photographe: [
    { slug: 'mariage', label: 'mariage', labels: { fr: 'mariage', ar: 'أعراس', en: 'Wedding', it: 'Matrimonio', ru: 'Свадебная' } },
    { slug: 'grossesse', label: 'grossesse', labels: { fr: 'grossesse', ar: 'حمل', en: 'Maternity', it: 'Gravidanza', ru: 'Беременность' } },
    { slug: 'bebe', label: 'bébé', labels: { fr: 'bébé', ar: 'أطفال', en: 'Baby', it: 'Neonato', ru: 'Малыши' } },
    { slug: 'portrait', label: 'portrait', labels: { fr: 'portrait', ar: 'بورتريه', en: 'Portrait', it: 'Ritratto', ru: 'Портрет' } },
    { slug: 'produit', label: 'produit', labels: { fr: 'produit', ar: 'منتجات', en: 'Product', it: 'Prodotto', ru: 'Продуктовая' } },
    { slug: 'evenementiel', label: 'événementiel', labels: { fr: 'événementiel', ar: 'مناسبات', en: 'Events', it: 'Eventi', ru: 'Репортажная' } },
  ],
};

export interface SecteurEntry {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
  labels?: LocalizedLabels;
}

export const SEO_SECTEURS: SecteurEntry[] = [
  { slug: 'sante', label: 'Santé', description: 'Médecins, cliniques, laboratoires, pharmacies et professionnels de santé en Tunisie.', keywords: ['médecin', 'clinique', 'pharmacie', 'dentiste', 'laboratoire', 'santé tunisie'], labels: { fr: 'Santé', ar: 'الصحة', en: 'Health', it: 'Salute', ru: 'Здравоохранение' } },
  { slug: 'services', label: 'Services', description: 'Plombiers, électriciens, nettoyage, déménagement et services à domicile en Tunisie.', keywords: ['plombier', 'électricien', 'nettoyage', 'services tunisie', 'dépannage'], labels: { fr: 'Services', ar: 'الخدمات', en: 'Services', it: 'Servizi', ru: 'Услуги' } },
  { slug: 'artisanat', label: 'Artisanat', description: 'Menuisiers, peintres, carreleurs, maçons et artisans qualifiés en Tunisie.', keywords: ['menuisier', 'peintre', 'carreleur', 'maçon', 'artisan tunisie'], labels: { fr: 'Artisanat', ar: 'الحرف اليدوية', en: 'Crafts', it: 'Artigianato', ru: 'Ремесло' } },
  { slug: 'juridique', label: 'Juridique', description: 'Avocats, notaires, experts-comptables et conseil juridique en Tunisie.', keywords: ['avocat', 'notaire', 'expert-comptable', 'juridique tunisie', 'conseil'], labels: { fr: 'Juridique', ar: 'القانون', en: 'Legal', it: 'Giuridico', ru: 'Юридические услуги' } },
  { slug: 'beaute', label: 'Beauté', description: 'Coiffeurs, instituts de beauté, spas, hammams et soins esthétiques en Tunisie.', keywords: ['coiffeur', 'institut beauté', 'spa', 'esthéticienne', 'beauté tunisie'], labels: { fr: 'Beauté', ar: 'الجمال', en: 'Beauty', it: 'Bellezza', ru: 'Красота' } },
  { slug: 'restauration', label: 'Restauration', description: 'Restaurants, cafés, fast-food, traiteurs et restauration en Tunisie.', keywords: ['restaurant', 'café', 'fast-food', 'traiteur', 'restauration tunisie'], labels: { fr: 'Restauration', ar: 'المطاعم', en: 'Food & Dining', it: 'Ristorazione', ru: 'Общепит' } },
  { slug: 'alimentation', label: 'Alimentation', description: 'Boulangeries, pâtisseries, boucheries, épiceries et supermarchés en Tunisie.', keywords: ['boulangerie', 'pâtisserie', 'boucherie', 'épicerie', 'alimentation tunisie'], labels: { fr: 'Alimentation', ar: 'الأغذية', en: 'Food & Grocery', it: 'Alimentari', ru: 'Продукты питания' } },
  { slug: 'auto', label: 'Automobile', description: 'Garages, mécaniciens, carrossiers, lavage auto et vente de voitures en Tunisie.', keywords: ['garage', 'mécanicien', 'carrosserie', 'lavage auto', 'automobile tunisie'], labels: { fr: 'Automobile', ar: 'السيارات', en: 'Automotive', it: 'Automotive', ru: 'Автомобили' } },
  { slug: 'transport', label: 'Transport', description: 'Auto-écoles, taxis, location et transport de marchandises en Tunisie.', keywords: ['auto-école', 'taxi', 'location voiture', 'transport tunisie'], labels: { fr: 'Transport', ar: 'النقل', en: 'Transport', it: 'Trasporti', ru: 'Транспорт' } },
  { slug: 'education', label: 'Éducation', description: 'Écoles privées, jardins d\'enfant, centres de formation et cours particuliers en Tunisie.', keywords: ['école privée', 'formation', 'cours particuliers', 'éducation tunisie'], labels: { fr: 'Éducation', ar: 'التعليم', en: 'Education', it: 'Educazione', ru: 'Образование' } },
  { slug: 'immobilier', label: 'Immobilier', description: 'Agences immobilières, promoteurs et syndics en Tunisie.', keywords: ['agence immobilière', 'promoteur', 'immobilier tunisie', 'syndic'], labels: { fr: 'Immobilier', ar: 'العقارات', en: 'Real Estate', it: 'Immobiliare', ru: 'Недвижимость' } },
  { slug: 'tech', label: 'Technologie', description: 'Informatique, réparation, téléphonie, agences web et services numériques en Tunisie.', keywords: ['informatique', 'réparation', 'agence web', 'technologie tunisie'], labels: { fr: 'Technologie', ar: 'التكنولوجيا', en: 'Technology', it: 'Tecnologia', ru: 'Технологии' } },
  { slug: 'sport', label: 'Sport', description: 'Salles de sport, clubs sportifs, piscines et coaching sportif en Tunisie.', keywords: ['salle de sport', 'fitness', 'piscine', 'club sportif', 'sport tunisie'], labels: { fr: 'Sport', ar: 'الرياضة', en: 'Sports', it: 'Sport', ru: 'Спорт' } },
  { slug: 'bien-etre', label: 'Bien-être', description: 'Yoga, méditation, relaxation et bien-être en Tunisie.', keywords: ['yoga', 'bien-être', 'relaxation', 'méditation tunisie'], labels: { fr: 'Bien-être', ar: 'العافية', en: 'Wellness', it: 'Benessere', ru: 'Здоровье' } },
  { slug: 'mode', label: 'Mode', description: 'Boutiques de vêtements, chaussures, bijouteries et parfumeries en Tunisie.', keywords: ['boutique vêtements', 'bijouterie', 'parfumerie', 'mode tunisie'], labels: { fr: 'Mode', ar: 'الموضة', en: 'Fashion', it: 'Moda', ru: 'Мода' } },
  { slug: 'evenementiel', label: 'Événementiel', description: 'Traiteurs mariage, décoration, location de salles et animation en Tunisie.', keywords: ['mariage', 'décoration', 'location salle', 'événementiel tunisie'], labels: { fr: 'Événementiel', ar: 'المناسبات', en: 'Events', it: 'Eventi', ru: 'Мероприятия' } },
  { slug: 'art', label: 'Art', description: 'Photographes, vidéastes et graphistes en Tunisie.', keywords: ['photographe', 'vidéaste', 'graphiste', 'art tunisie'], labels: { fr: 'Art', ar: 'الفن', en: 'Art', it: 'Arte', ru: 'Искусство' } },
  { slug: 'animaux', label: 'Animaux', description: 'Vétérinaires, toiletteurs, animaleries et pensions pour animaux en Tunisie.', keywords: ['vétérinaire', 'toilettage', 'animalerie', 'animaux tunisie'], labels: { fr: 'Animaux', ar: 'الحيوانات', en: 'Pets', it: 'Animali', ru: 'Животные' } },
  { slug: 'profession-liberale', label: 'Profession libérale', description: 'Architectes, ingénieurs, géomètres et professions libérales en Tunisie.', keywords: ['architecte', 'ingénieur', 'géomètre', 'profession libérale tunisie'], labels: { fr: 'Profession libérale', ar: 'المهن الحرة', en: 'Liberal Professions', it: 'Professioni liberali', ru: 'Свободные профессии' } },
  { slug: 'shopping', label: 'Shopping', description: 'Boutiques cadeaux et commerces de détail en Tunisie.', keywords: ['cadeaux', 'shopping', 'commerce tunisie'], labels: { fr: 'Shopping', ar: 'التسوق', en: 'Shopping', it: 'Shopping', ru: 'Шопинг' } },
];

const SECTEUR_LABEL_TO_SLUG: Record<string, string> = {
  'Santé': 'sante',
  'Services': 'services',
  'Artisanat': 'artisanat',
  'Juridique': 'juridique',
  'Beauté': 'beaute',
  'Restauration': 'restauration',
  'Alimentation': 'alimentation',
  'Auto': 'auto',
  'Transport': 'transport',
  'Éducation': 'education',
  'Immobilier': 'immobilier',
  'Tech': 'tech',
  'Sport': 'sport',
  'Bien-être': 'bien-etre',
  'Mode': 'mode',
  'Événementiel': 'evenementiel',
  'Art': 'art',
  'Animaux': 'animaux',
  'Profession libérale': 'profession-liberale',
  'Shopping': 'shopping',
};

export interface GouvernoratEntry {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
  labels?: LocalizedLabels;
}

export const SEO_GOUVERNORATS: GouvernoratEntry[] = [
  { slug: 'tunis', label: 'Tunis', description: 'Entreprises, commerces et professionnels dans le gouvernorat de Tunis, capitale de la Tunisie.', keywords: ['entreprise tunis', 'professionnel tunis', 'commerce tunis', 'services tunis'], labels: { fr: 'Tunis', ar: 'تونس', en: 'Tunis', it: 'Tunisi', ru: 'Тунис' } },
  { slug: 'ariana', label: 'Ariana', description: 'Trouvez des entreprises et services dans le gouvernorat de l\'Ariana, au nord de Tunis.', keywords: ['entreprise ariana', 'services ariana', 'commerce ariana'], labels: { fr: 'Ariana', ar: 'أريانة', en: 'Ariana', it: 'Ariana', ru: 'Ариана' } },
  { slug: 'ben-arous', label: 'Ben Arous', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Ben Arous.', keywords: ['entreprise ben arous', 'services ben arous', 'commerce ben arous'], labels: { fr: 'Ben Arous', ar: 'بن عروس', en: 'Ben Arous', it: 'Ben Arous', ru: 'Бен-Арусс' } },
  { slug: 'la-manouba', label: 'La Manouba', description: 'Entreprises et services dans le gouvernorat de La Manouba.', keywords: ['entreprise manouba', 'services manouba', 'commerce manouba'], labels: { fr: 'La Manouba', ar: 'منوبة', en: 'La Manouba', it: 'La Manouba', ru: 'Мануба' } },
  { slug: 'nabeul', label: 'Nabeul', description: 'Entreprises, artisans et services dans le gouvernorat de Nabeul et le Cap Bon.', keywords: ['entreprise nabeul', 'artisan nabeul', 'cap bon', 'hammamet'], labels: { fr: 'Nabeul', ar: 'نابل', en: 'Nabeul', it: 'Nabeul', ru: 'Набель' } },
  { slug: 'zaghouan', label: 'Zaghouan', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Zaghouan.', keywords: ['entreprise zaghouan', 'services zaghouan'], labels: { fr: 'Zaghouan', ar: 'زغوان', en: 'Zaghouan', it: 'Zaghouan', ru: 'Загуан' } },
  { slug: 'bizerte', label: 'Bizerte', description: 'Entreprises et services dans le gouvernorat de Bizerte, au nord de la Tunisie.', keywords: ['entreprise bizerte', 'services bizerte', 'commerce bizerte'], labels: { fr: 'Bizerte', ar: 'بنزرت', en: 'Bizerte', it: 'Bizerte', ru: 'Бизерта' } },
  { slug: 'beja', label: 'Béja', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Béja.', keywords: ['entreprise béja', 'services béja'], labels: { fr: 'Béja', ar: 'باجة', en: 'Béja', it: 'Béja', ru: 'Беджа' } },
  { slug: 'jendouba', label: 'Jendouba', description: 'Entreprises et services dans le gouvernorat de Jendouba, dont Tabarka et Aïn Draham.', keywords: ['entreprise jendouba', 'tabarka', 'ain draham'], labels: { fr: 'Jendouba', ar: 'جندوبة', en: 'Jendouba', it: 'Jendouba', ru: 'Жендуба' } },
  { slug: 'le-kef', label: 'Le Kef', description: 'Annuaire des entreprises et professionnels dans le gouvernorat du Kef.', keywords: ['entreprise kef', 'services kef'], labels: { fr: 'Le Kef', ar: 'الكاف', en: 'Le Kef', it: 'Le Kef', ru: 'Эль-Кеф' } },
  { slug: 'siliana', label: 'Siliana', description: 'Entreprises et services dans le gouvernorat de Siliana.', keywords: ['entreprise siliana', 'services siliana'], labels: { fr: 'Siliana', ar: 'سليانة', en: 'Siliana', it: 'Siliana', ru: 'Силиана' } },
  { slug: 'sousse', label: 'Sousse', description: 'Entreprises, commerces et professionnels dans le gouvernorat de Sousse, troisième ville de Tunisie.', keywords: ['entreprise sousse', 'commerce sousse', 'services sousse', 'port el kantaoui'], labels: { fr: 'Sousse', ar: 'سوسة', en: 'Sousse', it: 'Sousse', ru: 'Сус' } },
  { slug: 'monastir', label: 'Monastir', description: 'Annuaire des entreprises et services dans le gouvernorat de Monastir.', keywords: ['entreprise monastir', 'services monastir', 'moknine'], labels: { fr: 'Monastir', ar: 'المنستير', en: 'Monastir', it: 'Monastir', ru: 'Монастир' } },
  { slug: 'mahdia', label: 'Mahdia', description: 'Entreprises et professionnels dans le gouvernorat de Mahdia.', keywords: ['entreprise mahdia', 'services mahdia'], labels: { fr: 'Mahdia', ar: 'المهدية', en: 'Mahdia', it: 'Mahdia', ru: 'Махдия' } },
  { slug: 'sfax', label: 'Sfax', description: 'Entreprises, industries et services dans le gouvernorat de Sfax, deuxième ville de Tunisie.', keywords: ['entreprise sfax', 'industrie sfax', 'commerce sfax', 'services sfax'], labels: { fr: 'Sfax', ar: 'صفاقس', en: 'Sfax', it: 'Sfax', ru: 'Сфакс' } },
  { slug: 'kairouan', label: 'Kairouan', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Kairouan.', keywords: ['entreprise kairouan', 'services kairouan', 'artisan kairouan'], labels: { fr: 'Kairouan', ar: 'القيروان', en: 'Kairouan', it: 'Kairouan', ru: 'Кайруан' } },
  { slug: 'kasserine', label: 'Kasserine', description: 'Entreprises et services dans le gouvernorat de Kasserine.', keywords: ['entreprise kasserine', 'services kasserine'], labels: { fr: 'Kasserine', ar: 'القصرين', en: 'Kasserine', it: 'Kasserine', ru: 'Кассерин' } },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Sidi Bouzid.', keywords: ['entreprise sidi bouzid', 'services sidi bouzid'], labels: { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد', en: 'Sidi Bouzid', it: 'Sidi Bouzid', ru: 'Сиди-Бузид' } },
  { slug: 'gabes', label: 'Gabès', description: 'Entreprises et services dans le gouvernorat de Gabès.', keywords: ['entreprise gabès', 'services gabès', 'industrie gabès'], labels: { fr: 'Gabès', ar: 'قابس', en: 'Gabès', it: 'Gabès', ru: 'Габес' } },
  { slug: 'medenine', label: 'Médenine', description: 'Entreprises et services dans le gouvernorat de Médenine, dont Djerba et Zarzis.', keywords: ['entreprise médenine', 'djerba', 'zarzis', 'services médenine'], labels: { fr: 'Médenine', ar: 'مدنين', en: 'Médenine', it: 'Médenine', ru: 'Меденин' } },
  { slug: 'tataouine', label: 'Tataouine', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Tataouine.', keywords: ['entreprise tataouine', 'services tataouine'], labels: { fr: 'Tataouine', ar: 'تطاوين', en: 'Tataouine', it: 'Tataouine', ru: 'Татауин' } },
  { slug: 'gafsa', label: 'Gafsa', description: 'Entreprises et services dans le gouvernorat de Gafsa.', keywords: ['entreprise gafsa', 'services gafsa'], labels: { fr: 'Gafsa', ar: 'قفصة', en: 'Gafsa', it: 'Gafsa', ru: 'Гафса' } },
  { slug: 'tozeur', label: 'Tozeur', description: 'Entreprises et services dans le gouvernorat de Tozeur, porte du Sahara tunisien.', keywords: ['entreprise tozeur', 'services tozeur', 'nefta', 'tourisme tozeur'], labels: { fr: 'Tozeur', ar: 'توزر', en: 'Tozeur', it: 'Tozeur', ru: 'Тозёр' } },
  { slug: 'kebili', label: 'Kébili', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Kébili et Douz.', keywords: ['entreprise kébili', 'douz', 'services kébili'], labels: { fr: 'Kébili', ar: 'قبلي', en: 'Kébili', it: 'Kébili', ru: 'Кебили' } },
];

const GOUVERNORAT_LABEL_TO_SLUG: Record<string, string> = {
  'Tunis': 'tunis',
  'Ariana': 'ariana',
  'Ben Arous': 'ben-arous',
  'La Manouba': 'la-manouba',
  'Nabeul': 'nabeul',
  'Zaghouan': 'zaghouan',
  'Bizerte': 'bizerte',
  'Béja': 'beja',
  'Jendouba': 'jendouba',
  'Le Kef': 'le-kef',
  'Siliana': 'siliana',
  'Sousse': 'sousse',
  'Monastir': 'monastir',
  'Mahdia': 'mahdia',
  'Sfax': 'sfax',
  'Kairouan': 'kairouan',
  'Kasserine': 'kasserine',
  'Sidi Bouzid': 'sidi-bouzid',
  'Gabès': 'gabes',
  'Médenine': 'medenine',
  'Tataouine': 'tataouine',
  'Gafsa': 'gafsa',
  'Tozeur': 'tozeur',
  'Kébili': 'kebili',
};

export function findGouvernoratBySlug(slug: string): GouvernoratEntry | undefined {
  return SEO_GOUVERNORATS.find(g => g.slug === slug);
}

export function getVillesByGouvernorat(gouvernoratSlug: string): VilleEntry[] {
  const gouv = SEO_GOUVERNORATS.find(g => g.slug === gouvernoratSlug);
  if (!gouv) return [];
  return SEO_VILLES.filter(v => v.gouvernorat === gouv.label);
}

export function getGouvernoratSlugFromLabel(label: string): string | undefined {
  return GOUVERNORAT_LABEL_TO_SLUG[label];
}

export function findSecteurBySlug(slug: string): SecteurEntry | undefined {
  return SEO_SECTEURS.find(s => s.slug === slug);
}

export function getMetiersBySecteur(secteurSlug: string): MetierEntry[] {
  const secteur = SEO_SECTEURS.find(s => s.slug === secteurSlug);
  if (!secteur) return [];
  return SEO_METIERS.filter(m => {
    if (!m.secteur) return false;
    return SECTEUR_LABEL_TO_SLUG[m.secteur] === secteurSlug;
  });
}

export function getSecteurSlugFromLabel(label: string): string | undefined {
  return SECTEUR_LABEL_TO_SLUG[label];
}

export function findMetierBySlug(slug: string): MetierEntry | undefined {
  return SEO_METIERS.find(m => m.slug === slug);
}

export function getMetierLabel(metier: MetierEntry, lang: Language): string {
  if (metier.labels && lang in metier.labels) return metier.labels[lang];
  return metier.label;
}

export function getVilleLabel(ville: VilleEntry, lang: Language): string {
  if (ville.labels && lang in ville.labels) return ville.labels[lang];
  return ville.label;
}

export function getSecteurLabel(secteur: SecteurEntry, lang: Language): string {
  if (secteur.labels && lang in secteur.labels) return secteur.labels[lang];
  return secteur.label;
}

export function getGouvernoratLabel(gouvernorat: GouvernoratEntry, lang: Language): string {
  if (gouvernorat.labels && lang in gouvernorat.labels) return gouvernorat.labels[lang];
  return gouvernorat.label;
}

export function getSousCategorieLabel(sousCat: SousCategorieEntry, lang: Language): string {
  if (sousCat.labels && lang in sousCat.labels) return sousCat.labels[lang];
  return sousCat.label;
}

export function findMetierByValue(value: string): MetierEntry | undefined {
  const lower = value.toLowerCase();
  return SEO_METIERS.find(m => m.value.toLowerCase() === lower || m.label.toLowerCase() === lower);
}

export function findVilleBySlug(slug: string): VilleEntry | undefined {
  return SEO_VILLES.find(v => v.slug === slug);
}

export function findVilleByLabel(label: string): VilleEntry | undefined {
  const lower = label.toLowerCase();
  return SEO_VILLES.find(v => v.label.toLowerCase() === lower);
}

export function findSousCategorieBySlug(metierSlug: string, sousCatSlug: string): SousCategorieEntry | undefined {
  return SEO_SOUS_CATEGORIES[metierSlug]?.find(s => s.slug === sousCatSlug);
}

export function metierVilleSlug(metierSlug: string, villeSlug: string): string {
  return `${metierSlug}-${villeSlug}`;
}

export function metierSousCatVilleSlug(metierSlug: string, sousCatSlug: string, villeSlug: string): string {
  return `${metierSlug}-${sousCatSlug}-${villeSlug}`;
}

export type ParsedSeoSlug =
  | { type: 'metier-souscategorie-ville'; metier: MetierEntry; sousCategorie: SousCategorieEntry; ville: VilleEntry }
  | { type: 'metier-ville'; metier: MetierEntry; ville: VilleEntry };

export function parseSeoSlug(combinedSlug: string): ParsedSeoSlug | null {
  for (const ville of SEO_VILLES) {
    if (!combinedSlug.endsWith(`-${ville.slug}`)) continue;

    const withoutVille = combinedSlug.slice(0, combinedSlug.length - ville.slug.length - 1);

    for (const metier of SEO_METIERS) {
      if (!withoutVille.startsWith(`${metier.slug}-`)) continue;

      const sousCatSlug = withoutVille.slice(metier.slug.length + 1);
      const sousCategorie = findSousCategorieBySlug(metier.slug, sousCatSlug);

      if (sousCategorie) {
        return { type: 'metier-souscategorie-ville', metier, sousCategorie, ville };
      }
    }

    const metierSlug = withoutVille;
    const metier = findMetierBySlug(metierSlug);
    if (metier) return { type: 'metier-ville', metier, ville };
  }

  return null;
}

export function parseMetierVilleSlug(combinedSlug: string): { metier: MetierEntry; ville: VilleEntry } | null {
  const parsed = parseSeoSlug(combinedSlug);
  if (!parsed) return null;
  return { metier: parsed.metier, ville: parsed.ville };
}
