import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  ShoppingCart,
  Landmark,
  PartyPopper,
  Home
} from 'lucide-react';

interface NavButton {
  id: string;
  label: string;
  icon: any;
  link: string;
  color: string;
}

interface StarNavigationProps {
  onNavigate?: (link: string) => void;
}

export default function StarNavigation({ onNavigate }: StarNavigationProps) {
  const { language } = useLanguage();
  const labels: Record<string, Record<string, string>> = {
    fr: { sante: 'Santé', education: 'Éducation', magasin: 'Magasins & marché local', admin: 'Administratif', loisir: 'Loisirs & évènements', citoyens: 'Citoyens', services: 'Services citoyens' },
    en: { sante: 'Health', education: 'Education', magasin: 'Shops & local market', admin: 'Administrative', loisir: 'Leisure & events', citoyens: 'Citizens', services: 'Citizen services' },
    ar: { sante: 'الصحة', education: 'التعليم', magasin: 'المتاجر والسوق المحلي', admin: 'إداري', loisir: 'الترفيه والفعاليات', citoyens: 'المواطنون', services: 'خدمات المواطنين' },
    it: { sante: 'Salute', education: 'Educazione', magasin: 'Negozi e mercato locale', admin: 'Amministrativo', loisir: 'Tempo libero ed eventi', citoyens: 'Cittadini', services: 'Servizi cittadini' },
    ru: { sante: 'Здоровье', education: 'Образование', magasin: 'Магазины и местный рынок', admin: 'Административные', loisir: 'Досуг и события', citoyens: 'Граждане', services: 'Гражданские услуги' },
  };
  const L = labels[language as string] || labels.fr;

  const navButtons: NavButton[] = [
    { id: 'sante', label: L.sante, icon: HeartPulse, link: '#/citizens/sante', color: 'from-red-500 to-red-600' },
    { id: 'education', label: L.education, icon: GraduationCap, link: '#/education', color: 'from-cyan-500 to-cyan-600' },
    { id: 'magasin', label: L.magasin, icon: ShoppingBag, link: '#/citizens/shops', color: 'from-emerald-500 to-emerald-600' },
    { id: 'admin', label: L.admin, icon: Landmark, link: '#/citizens/services', color: 'from-yellow-500 to-yellow-600' },
    { id: 'loisir', label: L.loisir, icon: PartyPopper, link: '#/citizens/leisure', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto py-12 scale-90">
      {/* Desktop: Star Layout */}
      <div className="hidden lg:block relative h-[380px]">
        {/* Central Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <a
            href="#/"
            aria-label={L.services}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-[#D62828] to-[#b91c1c] shadow-2xl flex flex-col items-center justify-center text-white hover:scale-105 transition-transform group cursor-pointer"
          >
            <Users className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold">{L.citoyens}</span>
            <span className="text-[10px] mt-0.5 text-center px-2 opacity-90">
              {L.services}
            </span>
          </a>
        </motion.div>

        {/* Surrounding Buttons - Star Formation */}
        {navButtons.map((button, idx) => {
          const Icon = button.icon;
          const totalButtons = navButtons.length;
          const angle = (idx / totalButtons) * 2 * Math.PI - Math.PI / 2;
          const radius = 140;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={button.id}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: 1,
                x: x,
                y: y
              }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <button
                onClick={() => window.location.hash = button.link}
                aria-label={`${language === 'fr' ? 'Accéder à' : language === 'ar' ? 'الوصول إلى' : language === 'en' ? 'Go to' : language === 'it' ? 'Vai a' : 'Перейти к'} ${button.label}`}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${button.color} shadow-xl flex flex-col items-center justify-center text-white hover:scale-110 transition-all group relative cursor-pointer`}
              >
                {/* Connecting Line */}
                <div
                  className="absolute w-1 bg-gray-300/30 origin-center"
                  style={{
                    height: `${radius - 50}px`,
                    transform: `rotate(${angle + Math.PI / 2}rad) translateY(50%)`
                  }}
                />

                <Icon className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-center px-1 leading-tight">
                  {button.label}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile & Tablet: Grid Layout */}
      <div className="lg:hidden">
        {/* Central Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <a
            href="#/"
            aria-label={L.services}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D62828] to-[#b91c1c] shadow-2xl flex flex-col items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
          >
            <Users className="w-6 h-6 mb-0.5" />
            <span className="text-base font-bold">{L.citoyens}</span>
            <span className="text-[10px] mt-0.5 text-center px-2 opacity-90">
              {L.services}
            </span>
          </a>
        </motion.div>

        {/* Grid of Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {navButtons.map((button, idx) => {
            const Icon = button.icon;
            return (
              <motion.button
                key={button.id}
                onClick={() => window.location.hash = button.link}
                aria-label={`${language === 'fr' ? 'Accéder à' : language === 'ar' ? 'الوصول إلى' : language === 'en' ? 'Go to' : language === 'it' ? 'Vai a' : 'Перейти к'} ${button.label}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`h-24 sm:h-28 rounded-2xl bg-gradient-to-br ${button.color} shadow-lg flex flex-col items-center justify-center text-white hover:scale-105 transition-all cursor-pointer`}
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1.5" />
                <span className="text-xs sm:text-sm font-semibold text-center px-2 leading-tight">
                  {button.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
