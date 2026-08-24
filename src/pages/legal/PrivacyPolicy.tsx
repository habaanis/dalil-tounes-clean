import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type Item = { lead?: string; text: string };
type Section = { title: string; paragraphs?: string[]; bullets?: Item[] };
type Copy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  updated: string;
  contactPrefix: string;
  contactSuffix: string;
  consentPrefix: string;
  consentSuffix: string;
  sections: Section[];
};

const COPY: Record<PublicLanguage, Copy> = {
  fr: {
    seoTitle: 'Politique de Confidentialité — Dalil Tounes',
    seoDescription: 'Politique de confidentialité et protection des données personnelles du site dalil-tounes.com, conformément au RGPD.',
    eyebrow: 'Informations légales',
    title: 'Politique de Confidentialité',
    updated: 'Dernière mise à jour : 28 avril 2026',
    contactPrefix: "Pour exercer l'un de ces droits, adressez votre demande par e-mail à :",
    contactSuffix: "Nous nous engageons à répondre dans un délai d'un mois à compter de la réception de votre demande.",
    consentPrefix: 'En utilisant le site dalil-tounes.com, vous reconnaissez avoir pris connaissance de la présente Politique de Confidentialité et consentez au traitement de vos données personnelles conformément aux conditions décrites ci-dessus. Ce consentement est révocable à tout moment en adressant une demande à l’adresse :',
    consentSuffix: '',
    sections: [
      { title: '1. Collecte des données', paragraphs: ['Nous collectons des informations lorsque vous utilisez la plateforme dalil-tounes.com, notamment :'], bullets: [
        { lead: "Données d'inscription :", text: 'nom, adresse e-mail, lorsque vous créez un compte ou remplissez un formulaire sur la plateforme.' },
        { lead: 'Données de navigation :', text: "adresse IP, type de navigateur et pages visitées, collectées via des cookies afin d'améliorer votre expérience utilisateur." },
      ] },
      { title: '2. Utilisation des informations', paragraphs: ['Les informations que nous recueillons peuvent être utilisées aux fins suivantes :'], bullets: [
        { text: 'Personnaliser votre expérience sur dalil-tounes.com.' },
        { text: "Vous fournir des informations relatives aux services de santé, d'éducation ou de loisirs disponibles sur la plateforme." },
        { text: 'Améliorer notre site web et la qualité du support client.' },
        { text: 'Vous contacter par e-mail dans le cadre de notre newsletter, uniquement si vous avez donné votre consentement explicite.' },
      ] },
      { title: '3. Protection des données — RGPD', paragraphs: [
        "En tant qu'éditeur basé en France (Anis Taieb HABA), nous nous engageons à respecter le Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679). Vos données personnelles sont traitées de manière sécurisée et ne sont en aucun cas vendues, louées ou cédées à des tiers à des fins commerciales.",
        'Hébergement des données : Vos données sont stockées sur les serveurs de Namecheap, Inc. (4600 East Washington Street, Suite 300, Phoenix, AZ 85034, États-Unis), qui applique des mesures de sécurité techniques et organisationnelles conformes aux standards internationaux en vigueur. Ce transfert de données hors de l’Union européenne est encadré par les garanties appropriées prévues par le RGPD.',
      ] },
      { title: '4. Vos droits', paragraphs: ['Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :'], bullets: [
        { lead: "Droit d'accès :", text: 'obtenir une copie des données vous concernant.' },
        { lead: 'Droit de rectification :', text: 'corriger toute information inexacte ou incomplète.' },
        { lead: "Droit à l'effacement :", text: 'demander la suppression de vos données (« droit à l’oubli »).' },
        { lead: 'Droit à la limitation :', text: 'restreindre le traitement de vos données dans certains cas.' },
        { lead: 'Droit à la portabilité :', text: 'recevoir vos données dans un format structuré et lisible.' },
      ] },
      { title: '5. Cookies', paragraphs: [
        "Nous utilisons des cookies afin d'améliorer l'accès à notre site et d'identifier les visiteurs réguliers. Les cookies sont de petits fichiers texte déposés sur votre appareil qui ne collectent aucune information personnelle identifiable.",
        'Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies ou être averti de leur dépôt. Le refus des cookies peut toutefois limiter certaines fonctionnalités du site.',
      ] },
      { title: '6. Consentement' },
    ],
  },
  ar: {
    seoTitle: 'سياسة الخصوصية — دليل تونس',
    seoDescription: 'سياسة الخصوصية وحماية البيانات الشخصية على dalil-tounes.com وفقاً للائحة العامة لحماية البيانات.',
    eyebrow: 'معلومات قانونية',
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: 28 أبريل 2026',
    contactPrefix: 'لممارسة أي من هذه الحقوق، أرسل طلبك عبر البريد الإلكتروني إلى:',
    contactSuffix: 'نلتزم بالرد خلال شهر واحد من تاريخ استلام طلبك.',
    consentPrefix: 'باستخدام موقع dalil-tounes.com، فإنك تقر بأنك اطلعت على سياسة الخصوصية هذه وتوافق على معالجة بياناتك الشخصية وفق الشروط الموضحة أعلاه. ويمكنك سحب هذه الموافقة في أي وقت بإرسال طلب إلى:',
    consentSuffix: '',
    sections: [
      { title: '1. جمع البيانات', paragraphs: ['نجمع بعض المعلومات عند استخدامك لمنصة dalil-tounes.com، ومنها:'], bullets: [
        { lead: 'بيانات التسجيل:', text: 'الاسم وعنوان البريد الإلكتروني عند إنشاء حساب أو تعبئة نموذج على المنصة.' },
        { lead: 'بيانات التصفح:', text: 'عنوان IP ونوع المتصفح والصفحات التي تمت زيارتها، ويتم جمعها عبر ملفات تعريف الارتباط لتحسين تجربة المستخدم.' },
      ] },
      { title: '2. استخدام المعلومات', paragraphs: ['يمكن استخدام المعلومات التي نجمعها للأغراض التالية:'], bullets: [
        { text: 'تخصيص تجربتك على dalil-tounes.com.' },
        { text: 'تزويدك بمعلومات حول خدمات الصحة والتعليم والترفيه المتاحة على المنصة.' },
        { text: 'تحسين موقعنا وجودة دعم العملاء.' },
        { text: 'التواصل معك عبر البريد الإلكتروني في إطار النشرة البريدية فقط إذا منحت موافقتك الصريحة.' },
      ] },
      { title: '3. حماية البيانات — RGPD', paragraphs: [
        'بصفتنا ناشراً مقره فرنسا (Anis Taieb HABA)، نلتزم باحترام اللائحة العامة لحماية البيانات (RGPD — اللائحة الأوروبية 2016/679). وتتم معالجة بياناتك الشخصية بشكل آمن ولا يتم بيعها أو تأجيرها أو التنازل عنها لأطراف ثالثة لأغراض تجارية.',
        'استضافة البيانات: تُخزَّن بياناتك على خوادم Namecheap, Inc. (4600 East Washington Street, Suite 300, Phoenix, AZ 85034, الولايات المتحدة)، التي تطبق تدابير أمنية تقنية وتنظيمية وفق المعايير الدولية المعمول بها. ويخضع نقل البيانات خارج الاتحاد الأوروبي للضمانات المناسبة المنصوص عليها في RGPD.',
      ] },
      { title: '4. حقوقك', paragraphs: ['وفقاً لـ RGPD، تتمتع بالحقوق التالية فيما يتعلق ببياناتك الشخصية:'], bullets: [
        { lead: 'حق الوصول:', text: 'الحصول على نسخة من البيانات المتعلقة بك.' },
        { lead: 'حق التصحيح:', text: 'تصحيح أي معلومات غير دقيقة أو غير مكتملة.' },
        { lead: 'حق المحو:', text: 'طلب حذف بياناتك («الحق في النسيان»).' },
        { lead: 'حق تقييد المعالجة:', text: 'تقييد معالجة بياناتك في بعض الحالات.' },
        { lead: 'حق نقل البيانات:', text: 'استلام بياناتك بصيغة منظمة وقابلة للقراءة.' },
      ] },
      { title: '5. ملفات تعريف الارتباط', paragraphs: [
        'نستخدم ملفات تعريف الارتباط لتحسين الوصول إلى الموقع والتعرف على الزوار المنتظمين. وهي ملفات نصية صغيرة تُخزَّن على جهازك ولا تجمع بحد ذاتها معلومات شخصية محددة للهوية.',
        'يمكنك في أي وقت إعداد متصفحك لرفض ملفات تعريف الارتباط أو تنبيهك عند إيداعها، إلا أن رفضها قد يحد من بعض وظائف الموقع.',
      ] },
      { title: '6. الموافقة' },
    ],
  },
  en: {
    seoTitle: 'Privacy Policy — Dalil Tounes',
    seoDescription: 'Privacy and personal-data protection policy for dalil-tounes.com in accordance with the GDPR.',
    eyebrow: 'Legal information',
    title: 'Privacy Policy',
    updated: 'Last updated: April 28, 2026',
    contactPrefix: 'To exercise any of these rights, send your request by email to:',
    contactSuffix: 'We undertake to reply within one month of receiving your request.',
    consentPrefix: 'By using dalil-tounes.com, you acknowledge that you have read this Privacy Policy and consent to the processing of your personal data under the conditions described above. You may withdraw this consent at any time by sending a request to:',
    consentSuffix: '',
    sections: [
      { title: '1. Data collection', paragraphs: ['We collect information when you use dalil-tounes.com, including:'], bullets: [
        { lead: 'Registration data:', text: 'name and email address when you create an account or complete a form on the platform.' },
        { lead: 'Browsing data:', text: 'IP address, browser type and pages visited, collected through cookies to improve your user experience.' },
      ] },
      { title: '2. Use of information', paragraphs: ['The information we collect may be used to:'], bullets: [
        { text: 'Personalize your experience on dalil-tounes.com.' },
        { text: 'Provide information about health, education or leisure services available on the platform.' },
        { text: 'Improve our website and the quality of customer support.' },
        { text: 'Contact you by email as part of our newsletter, only where you have given explicit consent.' },
      ] },
      { title: '3. Data protection — GDPR', paragraphs: [
        'As a publisher based in France (Anis Taieb HABA), we undertake to comply with the General Data Protection Regulation (GDPR — EU Regulation 2016/679). Your personal data is processed securely and is never sold, rented or transferred to third parties for commercial purposes.',
        'Data hosting: Your data is stored on servers operated by Namecheap, Inc. (4600 East Washington Street, Suite 300, Phoenix, AZ 85034, United States), which applies technical and organizational security measures in line with applicable international standards. This transfer of data outside the European Union is governed by the appropriate safeguards provided for by the GDPR.',
      ] },
      { title: '4. Your rights', paragraphs: ['Under the GDPR, you have the following rights regarding your personal data:'], bullets: [
        { lead: 'Right of access:', text: 'obtain a copy of the data concerning you.' },
        { lead: 'Right to rectification:', text: 'correct inaccurate or incomplete information.' },
        { lead: 'Right to erasure:', text: 'request deletion of your data (“right to be forgotten”).' },
        { lead: 'Right to restriction:', text: 'restrict the processing of your data in certain circumstances.' },
        { lead: 'Right to data portability:', text: 'receive your data in a structured and readable format.' },
      ] },
      { title: '5. Cookies', paragraphs: [
        'We use cookies to improve access to our site and identify regular visitors. Cookies are small text files stored on your device and do not by themselves collect personally identifiable information.',
        'You can configure your browser at any time to refuse cookies or notify you when they are placed. Refusing cookies may nevertheless limit certain site features.',
      ] },
      { title: '6. Consent' },
    ],
  },
  it: {
    seoTitle: 'Informativa sulla Privacy — Dalil Tounes',
    seoDescription: 'Informativa sulla privacy e protezione dei dati personali di dalil-tounes.com, in conformità al GDPR.',
    eyebrow: 'Informazioni legali',
    title: 'Informativa sulla Privacy',
    updated: 'Ultimo aggiornamento: 28 aprile 2026',
    contactPrefix: 'Per esercitare uno di questi diritti, invia la tua richiesta via e-mail a:',
    contactSuffix: 'Ci impegniamo a rispondere entro un mese dalla ricezione della richiesta.',
    consentPrefix: 'Utilizzando dalil-tounes.com, dichiari di aver letto la presente Informativa sulla Privacy e acconsenti al trattamento dei tuoi dati personali alle condizioni sopra descritte. Puoi revocare questo consenso in qualsiasi momento inviando una richiesta a:',
    consentSuffix: '',
    sections: [
      { title: '1. Raccolta dei dati', paragraphs: ['Raccogliamo informazioni quando utilizzi dalil-tounes.com, in particolare:'], bullets: [
        { lead: 'Dati di registrazione:', text: 'nome e indirizzo e-mail quando crei un account o compili un modulo sulla piattaforma.' },
        { lead: 'Dati di navigazione:', text: 'indirizzo IP, tipo di browser e pagine visitate, raccolti tramite cookie per migliorare la tua esperienza utente.' },
      ] },
      { title: '2. Utilizzo delle informazioni', paragraphs: ['Le informazioni raccolte possono essere utilizzate per:'], bullets: [
        { text: 'Personalizzare la tua esperienza su dalil-tounes.com.' },
        { text: 'Fornirti informazioni sui servizi sanitari, educativi o per il tempo libero disponibili sulla piattaforma.' },
        { text: 'Migliorare il nostro sito e la qualità dell’assistenza clienti.' },
        { text: 'Contattarti via e-mail nell’ambito della newsletter solo se hai prestato il tuo consenso esplicito.' },
      ] },
      { title: '3. Protezione dei dati — GDPR', paragraphs: [
        'In qualità di editore con sede in Francia (Anis Taieb HABA), ci impegniamo a rispettare il Regolamento generale sulla protezione dei dati (GDPR — Regolamento UE 2016/679). I tuoi dati personali sono trattati in modo sicuro e non vengono mai venduti, affittati o ceduti a terzi per finalità commerciali.',
        'Hosting dei dati: I tuoi dati sono archiviati sui server di Namecheap, Inc. (4600 East Washington Street, Suite 300, Phoenix, AZ 85034, Stati Uniti), che applica misure di sicurezza tecniche e organizzative conformi agli standard internazionali vigenti. Il trasferimento di dati fuori dall’Unione europea è disciplinato dalle garanzie appropriate previste dal GDPR.',
      ] },
      { title: '4. I tuoi diritti', paragraphs: ['Ai sensi del GDPR, disponi dei seguenti diritti sui tuoi dati personali:'], bullets: [
        { lead: 'Diritto di accesso:', text: 'ottenere una copia dei dati che ti riguardano.' },
        { lead: 'Diritto di rettifica:', text: 'correggere informazioni inesatte o incomplete.' },
        { lead: 'Diritto alla cancellazione:', text: 'richiedere la cancellazione dei tuoi dati (“diritto all’oblio”).' },
        { lead: 'Diritto alla limitazione:', text: 'limitare il trattamento dei tuoi dati in determinati casi.' },
        { lead: 'Diritto alla portabilità:', text: 'ricevere i tuoi dati in un formato strutturato e leggibile.' },
      ] },
      { title: '5. Cookie', paragraphs: [
        'Utilizziamo cookie per migliorare l’accesso al sito e identificare i visitatori abituali. I cookie sono piccoli file di testo memorizzati sul dispositivo e non raccolgono di per sé informazioni personali identificabili.',
        'Puoi configurare il browser in qualsiasi momento per rifiutare i cookie o essere avvisato quando vengono memorizzati. Il rifiuto dei cookie può tuttavia limitare alcune funzionalità del sito.',
      ] },
      { title: '6. Consenso' },
    ],
  },
  ru: {
    seoTitle: 'Политика конфиденциальности — Dalil Tounes',
    seoDescription: 'Политика конфиденциальности и защиты персональных данных dalil-tounes.com в соответствии с GDPR.',
    eyebrow: 'Юридическая информация',
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: 28 апреля 2026 г.',
    contactPrefix: 'Чтобы воспользоваться любым из этих прав, отправьте запрос по электронной почте на адрес:',
    contactSuffix: 'Мы обязуемся ответить в течение одного месяца с момента получения вашего запроса.',
    consentPrefix: 'Используя dalil-tounes.com, вы подтверждаете, что ознакомились с настоящей Политикой конфиденциальности и соглашаетесь на обработку персональных данных на описанных выше условиях. Вы можете отозвать согласие в любое время, направив запрос на адрес:',
    consentSuffix: '',
    sections: [
      { title: '1. Сбор данных', paragraphs: ['Мы собираем информацию при использовании dalil-tounes.com, в том числе:'], bullets: [
        { lead: 'Регистрационные данные:', text: 'имя и адрес электронной почты при создании аккаунта или заполнении формы на платформе.' },
        { lead: 'Данные о просмотре:', text: 'IP-адрес, тип браузера и посещенные страницы, собираемые с помощью cookie для улучшения пользовательского опыта.' },
      ] },
      { title: '2. Использование информации', paragraphs: ['Собранная информация может использоваться для следующих целей:'], bullets: [
        { text: 'Персонализация вашего опыта на dalil-tounes.com.' },
        { text: 'Предоставление информации о доступных на платформе услугах в области здравоохранения, образования и досуга.' },
        { text: 'Улучшение сайта и качества поддержки клиентов.' },
        { text: 'Связь с вами по электронной почте в рамках рассылки только при наличии вашего явного согласия.' },
      ] },
      { title: '3. Защита данных — GDPR', paragraphs: [
        'Как издатель, зарегистрированный во Франции (Anis Taieb HABA), мы обязуемся соблюдать Общий регламент по защите данных (GDPR — Регламент ЕС 2016/679). Ваши персональные данные обрабатываются безопасно и не продаются, не сдаются в аренду и не передаются третьим лицам в коммерческих целях.',
        'Хостинг данных: Ваши данные хранятся на серверах Namecheap, Inc. (4600 East Washington Street, Suite 300, Phoenix, AZ 85034, США), где применяются технические и организационные меры безопасности, соответствующие действующим международным стандартам. Передача данных за пределы Европейского союза регулируется надлежащими гарантиями, предусмотренными GDPR.',
      ] },
      { title: '4. Ваши права', paragraphs: ['В соответствии с GDPR вы имеете следующие права в отношении своих персональных данных:'], bullets: [
        { lead: 'Право доступа:', text: 'получить копию данных, относящихся к вам.' },
        { lead: 'Право на исправление:', text: 'исправить неточную или неполную информацию.' },
        { lead: 'Право на удаление:', text: 'потребовать удаления ваших данных («право быть забытым»).' },
        { lead: 'Право на ограничение:', text: 'ограничить обработку ваших данных в определенных случаях.' },
        { lead: 'Право на переносимость:', text: 'получить данные в структурированном и читаемом формате.' },
      ] },
      { title: '5. Cookie', paragraphs: [
        'Мы используем cookie для улучшения доступа к сайту и распознавания постоянных посетителей. Cookie — это небольшие текстовые файлы, сохраняемые на устройстве; сами по себе они не собирают персонально идентифицирующую информацию.',
        'Вы можете в любое время настроить браузер на отказ от cookie или получение уведомлений об их размещении. Однако отказ от cookie может ограничить некоторые функции сайта.',
      ] },
      { title: '6. Согласие' },
    ],
  },
};

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={copy.seoTitle} description={copy.seoDescription} />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">{copy.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{copy.title}</h1>
          <p className="mt-4 text-xs text-gray-400">{copy.updated}</p>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">
        {copy.sections.map((section, sectionIndex) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{section.title}</h2>

            {sectionIndex === 5 ? (
              <p>
                {copy.consentPrefix}{' '}
                <a href="mailto:contact@dalil-tounes.com" className="text-[#D4AF37] hover:underline">contact@dalil-tounes.com</a>
                {copy.consentSuffix}
              </p>
            ) : (
              <>
                {section.paragraphs?.[0] && <p>{section.paragraphs[0]}</p>}
                {section.bullets && (
                  <ul className={`mt-3 space-y-2 ${isRTL ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-[#D4AF37]`}>
                    {section.bullets.map((item, index) => (
                      <li key={index}>
                        {item.lead && <span className="font-medium">{item.lead} </span>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
                {section.paragraphs?.slice(1).map((paragraph, index) => <p key={index} className="mt-3">{paragraph}</p>)}
                {sectionIndex === 3 && (
                  <p className="mt-4">
                    {copy.contactPrefix}{' '}
                    <a href="mailto:contact@dalil-tounes.com" className="text-[#D4AF37] hover:underline">contact@dalil-tounes.com</a>.{' '}
                    {copy.contactSuffix}
                  </p>
                )}
              </>
            )}
          </section>
        ))}

        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">{copy.updated}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
