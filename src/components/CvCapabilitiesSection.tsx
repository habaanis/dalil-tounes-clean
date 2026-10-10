import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BusinessCardPreviewLanguage } from './BusinessCardPreview';

const details = {
  "fr": {
    "label": "Un CV professionnel, bien plus qu'une fiche",
    "title": "Tout ce que votre CV Dalil Tounes peut faire pour vous",
    "intro": "Votre activité, vos réalisations, vos contacts et votre QR Business réunis dans une mini-application simple à montrer et à partager.",
    "groups": [
      {
        "title": "Présenter votre activité",
        "items": [
          "Nom, métier, logo, photo de couverture et présentation professionnelle.",
          "Votre savoir-faire, vos services, prestations et domaines d’expertise.",
          "Informations pratiques, horaires et zone d’intervention.",
          "Présentation adaptée aux besoins de votre métier et au modèle choisi."
        ]
      },
      {
        "title": "Montrer votre travail",
        "items": [
          "Photos de produits, chantiers, projets ou réalisations, avec agrandissement.",
          "Galerie de travaux et de références pour rassurer vos futurs clients.",
          "CV Business pour une présentation structurée ; CV Portfolio pour un rendu plus visuel.",
          "Vidéo de présentation lorsque la formule choisie le permet."
        ]
      },
      {
        "title": "Être contacté facilement",
        "items": [
          "Boutons Appeler, WhatsApp et e-mail lorsque les coordonnées sont fournies.",
          "Adresse, horaires, ville et itinéraire vers votre établissement.",
          "Demande d’information, de devis ou réservation selon les options configurées.",
          "Ajout de vos coordonnées aux contacts du téléphone."
        ]
      },
      {
        "title": "Partager et inspirer confiance",
        "items": [
          "Lien personnel à partager sur WhatsApp, Facebook, Instagram ou par message.",
          "QR Business à afficher ou imprimer sur vos cartes, devis, flyers ou vitrine.",
          "Liens vers vos réseaux sociaux et accès aux avis clients lorsqu’ils sont disponibles.",
          "Accès facilité à votre activité via la plateforme Dalil Tounes, en complément de votre CV.",
          "Mini-application adaptée au mobile, avec plusieurs langues selon les contenus fournis."
        ]
      }
    ],
    "note": "Les possibilités dépendent de la formule choisie, des informations transmises et des options activées. Le CV Business et le CV Portfolio présentent les mêmes fonctions essentielles sous deux formats différents.",
    "cta": "Découvrir le CV Business",
    "contact": "Demander des informations"
  },
  "en": {
    "label": "More than a business listing",
    "title": "Everything your Dalil Tounes CV can do for you",
    "intro": "Your business, work, contacts and Business QR code together in a professional mini-app, easy to show and share.",
    "groups": [
      {
        "title": "Present your business",
        "items": [
          "Business name, trade, logo, cover photo and professional introduction.",
          "Your expertise, services, specialisms and what you offer.",
          "Practical details, opening hours and service area.",
          "A presentation suited to your trade and chosen layout."
        ]
      },
      {
        "title": "Show your work",
        "items": [
          "Photos of products, worksites, projects or completed work, with image zoom.",
          "Project galleries and references to reassure potential customers.",
          "Business CV for structured information; Portfolio CV for a more visual design.",
          "Presentation video where your plan supports it."
        ]
      },
      {
        "title": "Make it easy to reach you",
        "items": [
          "Call, WhatsApp and email buttons when those details are provided.",
          "Address, opening hours, town and directions to your business.",
          "Enquiries, quote requests or bookings when the relevant options are configured.",
          "Save your contact details to the customer's phone."
        ]
      },
      {
        "title": "Share and build trust",
        "items": [
          "Personal link shareable via WhatsApp, Facebook, Instagram or messages.",
          "Business QR code to show or print on cards, quotations, flyers or shop windows.",
          "Social network links and customer reviews where available.",
          "Additional exposure through the Dalil Tounes platform alongside your CV.",
          "Mobile-friendly mini-app, with languages according to provided content."
        ]
      }
    ],
    "note": "Available features depend on your plan, supplied information and enabled options. Business and Portfolio offer essential functions in different layouts.",
    "cta": "Discover Business CV",
    "contact": "Request information"
  },
  "ar": {
    "label": "أكثر من مجرد بطاقة تعريف",
    "title": "كل ما يمكن أن يقدمه ملفك المهني على دليل تونس",
    "intro": "نشاطك وأعمالك ووسائل الاتصال ورمز QR Business في تطبيق مهني مصغر يسهل عرضه ومشاركته.",
    "groups": [
      {
        "title": "التعريف بنشاطك",
        "items": [
          "اسم المؤسسة والمهنة والشعار وصورة الغلاف وتقديم مهني.",
          "الخبرات والخدمات والاختصاصات وما تقدمه للحرفاء.",
          "المعلومات العملية وأوقات العمل ومناطق التدخل.",
          "عرض مناسب لنشاطك وللنموذج الذي تختاره."
        ]
      },
      {
        "title": "إبراز أعمالك",
        "items": [
          "صور المنتجات والمشاريع والأشغال المنجزة مع إمكانية تكبيرها.",
          "معرض أعمال ومراجع يساعد الحرفاء على اكتشاف خبرتك.",
          "CV Business لعرض منظم، وCV Portfolio لعرض بصري أكثر.",
          "فيديو تعريفي عندما تسمح الصيغة المختارة بذلك."
        ]
      },
      {
        "title": "تسهيل التواصل معك",
        "items": [
          "أزرار الهاتف وواتساب والبريد الإلكتروني عند توفير البيانات.",
          "العنوان والمدينة وأوقات العمل والاتجاهات إلى مؤسستك.",
          "طلب معلومات أو عرض سعر أو حجز عند تفعيل الخيارات المناسبة.",
          "إضافة بياناتك مباشرة إلى جهات الاتصال على الهاتف."
        ]
      },
      {
        "title": "المشاركة وتعزيز الثقة",
        "items": [
          "رابط شخصي للمشاركة عبر واتساب وفيسبوك وإنستغرام والرسائل.",
          "رمز QR Business لعرضه أو طباعته على البطاقات وعروض الأسعار والمنشورات.",
          "روابط شبكات التواصل وآراء الحرفاء عند توفرها.",
          "فرصة إضافية للظهور عبر منصة دليل تونس إلى جانب ملفك المهني.",
          "تطبيق مصغر مناسب للهاتف وبلغات متعددة بحسب المحتوى المتوفر."
        ]
      }
    ],
    "note": "تعتمد الإمكانيات على الصيغة المختارة والمعلومات المقدمة والإعدادات المفعلة. يقدّم النموذجان Business وPortfolio الوظائف الأساسية بتصميمين مختلفين.",
    "cta": "اكتشف CV Business",
    "contact": "طلب معلومات"
  },
  "it": {
    "label": "Molto più di una scheda",
    "title": "Tutto ciò che il tuo CV Dalil Tounes può offrirti",
    "intro": "Attività, lavori, contatti e QR Business riuniti in una mini-app professionale facile da condividere.",
    "groups": [
      {
        "title": "Presentare la tua attività",
        "items": [
          "Nome, professione, logo, immagine di copertina e presentazione.",
          "Competenze, servizi e specializzazioni.",
          "Informazioni pratiche, orari e zona d'intervento.",
          "Presentazione adatta al mestiere e al modello scelto."
        ]
      },
      {
        "title": "Mostrare il tuo lavoro",
        "items": [
          "Foto di prodotti, cantieri, progetti e lavori con zoom.",
          "Gallerie e referenze per rassicurare i clienti.",
          "CV Business più strutturato o CV Portfolio più visivo.",
          "Video di presentazione se previsto dal piano."
        ]
      },
      {
        "title": "Essere contattato facilmente",
        "items": [
          "Pulsanti Chiama, WhatsApp ed e-mail con dati disponibili.",
          "Indirizzo, orari, città e indicazioni stradali.",
          "Richieste di preventivo o prenotazione se configurate.",
          "Salvataggio dei tuoi contatti sul telefono."
        ]
      },
      {
        "title": "Condividere e creare fiducia",
        "items": [
          "Link personale tramite WhatsApp, Facebook, Instagram e messaggi.",
          "QR Business su biglietti, preventivi, volantini e vetrine.",
          "Social network e recensioni quando disponibili.",
          "Ulteriore visibilità attraverso la piattaforma Dalil Tounes.",
          "Mini-app per dispositivi mobili e lingue disponibili secondo i contenuti."
        ]
      }
    ],
    "note": "Le funzioni dipendono dal piano, dai dati forniti e dalle opzioni configurate. Business e Portfolio propongono i servizi essenziali con presentazioni diverse.",
    "cta": "Scopri CV Business",
    "contact": "Richiedi informazioni"
  },
  "ru": {
    "label": "Больше, чем обычная карточка",
    "title": "Все возможности профессионального CV Dalil Tounes",
    "intro": "Ваш бизнес, работы, контакты и QR Business в одном удобном мобильном мини-приложении.",
    "groups": [
      {
        "title": "Представить вашу деятельность",
        "items": [
          "Название, профессия, логотип, обложка и описание бизнеса.",
          "Опыт, услуги, специализация и важные сведения.",
          "Часы работы, информация и зона обслуживания.",
          "Оформление под сферу деятельности и выбранную модель."
        ]
      },
      {
        "title": "Показать ваши работы",
        "items": [
          "Фотографии товаров, объектов и проектов с увеличением.",
          "Галерея работ и примеров для будущих клиентов.",
          "Business CV — структурированно, Portfolio CV — более наглядно.",
          "Презентационное видео при наличии такой опции в тарифе."
        ]
      },
      {
        "title": "Упростить связь с вами",
        "items": [
          "Звонок, WhatsApp и e-mail, если контактные данные указаны.",
          "Адрес, город, график работы и маршрут.",
          "Запросы предложений и бронирование при настройке функций.",
          "Сохранение ваших контактов в телефон клиента."
        ]
      },
      {
        "title": "Делиться и вызывать доверие",
        "items": [
          "Личная ссылка для WhatsApp, Facebook, Instagram и сообщений.",
          "QR Business на визитках, сметах, листовках и витринах.",
          "Соцсети и отзывы клиентов, когда доступны.",
          "Дополнительная видимость на платформе Dalil Tounes.",
          "Мобильная мини-программа с языками по доступному контенту."
        ]
      }
    ],
    "note": "Функции зависят от тарифа, предоставленных данных и настроек. Business и Portfolio предлагают основные возможности в разном оформлении.",
    "cta": "Узнать о CV Business",
    "contact": "Запросить информацию"
  }
} as const;

/** Public-facing benefits section; no diagnostic form and no lead collection. */
export default function CvCapabilitiesSection({ language }: {language: BusinessCardPreviewLanguage}) {
  const content = details[language] ?? details.fr;
  return <section className="bg-[#FFF9F1] px-4 py-12 sm:py-16" aria-labelledby="dt-home-cv-capabilities">
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#A47B2F]">{content.label}</p>
        <h2 id="dt-home-cv-capabilities" className="mt-3 font-serif text-2xl font-extrabold leading-tight text-[#8F182A] sm:text-4xl">{content.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#60514C]">{content.intro}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {content.groups.map(group=><article key={group.title} className="rounded-2xl border border-[#E9D6BA] bg-[#FFFDF9] p-5 shadow-[0_10px_30px_rgba(102,30,41,0.06)] sm:p-7">
          <h3 className="font-serif text-xl font-bold leading-snug text-[#971A30] sm:text-2xl">{group.title}</h3>
          <ul className="mt-4 grid gap-3">{group.items.map(item=><li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#3D302E] sm:text-base sm:leading-7"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[#B48A36]" aria-hidden="true"/><span>{item}</span></li>)}</ul>
        </article>)}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[#71635A]">{content.note}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link to="/cv-business" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#A51A30] px-6 py-3 text-sm font-bold text-white hover:bg-[#851528]">{content.cta}<ArrowRight className="h-4 w-4" aria-hidden="true"/></Link>
        <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#B48A36] bg-white px-6 py-3 text-sm font-bold text-[#6E2732] hover:bg-[#FFF3DB]">{content.contact}</Link>
      </div>
    </div>
  </section>;
}
