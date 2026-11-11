import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export type EducationAppPanel = 'recommended' | 'events' | 'procedures' | 'careers';

type Copy = {
  title: string;
  prompt: string;
  sections: Record<EducationAppPanel, string>;
  guide: string;
  note: string;
};

const COPY: Record<string, Copy> = {
  fr: {
    title: 'Éducation & formation',
    prompt: 'Que souhaitez-vous consulter ?',
    sections: { recommended: 'Établissements recommandés', events: 'Événements scolaires', procedures: 'Inscriptions & démarches', careers: 'Emploi dans l’éducation' },
    guide: 'Guide : bien choisir son école', note: 'Choisissez une rubrique pour afficher son contenu.',
  },
  ar: {
    title: 'التعليم والتكوين',
    prompt: 'شنوة تحب تلقى؟',
    sections: { recommended: 'مؤسسات موصى بها', events: 'فعاليات مدرسية', procedures: 'الترسيم والإجراءات', careers: 'العمل في التعليم' },
    guide: 'دليل اختيار المدرسة المناسبة', note: 'اختار قسم باش تشوف التفاصيل.',
  },
  en: {
    title: 'Education & training',
    prompt: 'What would you like to explore?',
    sections: { recommended: 'Recommended schools', events: 'School events', procedures: 'Enrolment & procedures', careers: 'Education jobs' },
    guide: 'Guide: choosing a school', note: 'Select one section to view the details.',
  },
  it: {
    title: 'Istruzione e formazione',
    prompt: 'Cosa vuoi consultare?',
    sections: { recommended: 'Istituti consigliati', events: 'Eventi scolastici', procedures: 'Iscrizioni e pratiche', careers: 'Lavoro nell’istruzione' },
    guide: 'Guida: scegliere una scuola', note: 'Scegli una sezione per vedere i dettagli.',
  },
  ru: {
    title: 'Образование и обучение',
    prompt: 'Что вы ищете?',
    sections: { recommended: 'Рекомендуемые школы', events: 'Школьные события', procedures: 'Запись и документы', careers: 'Работа в образовании' },
    guide: 'Руководство по выбору школы', note: 'Выберите раздел, чтобы увидеть подробности.',
  },
};

const MENU: Array<{ key: EducationAppPanel; icon: string }> = [
  { key: 'recommended', icon: '⭐' },
  { key: 'events', icon: '📅' },
  { key: 'procedures', icon: '📝' },
  { key: 'careers', icon: '💼' },
];

export default function EducationAppMenu({ activePanel, onToggle }: {
  activePanel: EducationAppPanel | null;
  onToggle: (panel: EducationAppPanel) => void;
}) {
  const { language } = useLanguage();
  const copy = COPY[language] ?? COPY.fr;
  return <section data-education-app-menu className="space-y-3 px-3 pb-3 pt-2" aria-label={copy.title}>
    <p className="text-sm font-semibold text-[#4A1D43]">{copy.prompt}</p>
    <div className="grid grid-cols-2 gap-2">
      {MENU.map(({ key, icon }) => (
        <button key={key} type="button" onClick={() => onToggle(key)}
          aria-expanded={activePanel === key}
          className={`flex min-h-[82px] flex-col items-start justify-between gap-1 rounded-xl border p-3 text-start shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36] ${activePanel === key ? 'border-[#A17D36] bg-[#F5E9D1]' : 'border-[#E2D2B2] bg-white'}`}>
          <span className="text-xl" aria-hidden="true">{icon}</span>
          <span className="text-xs font-semibold leading-5 text-[#4A1D43]">{copy.sections[key]}</span>
        </button>
      ))}
    </div>
    <Link to="/blog/bien-choisir-son-ecole"
      className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[#E2D2B2] bg-[#FFFAF0] px-3 py-2 text-sm font-medium text-[#4A1D43]">
      <span>📖 {copy.guide}</span><span aria-hidden="true" className="text-[#A17D36]">›</span>
    </Link>
    {!activePanel && <p className="px-1 text-xs leading-5 text-[#786B72]">{copy.note}</p>}
  </section>;
}
