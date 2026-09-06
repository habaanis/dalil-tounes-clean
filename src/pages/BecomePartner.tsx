import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { ArrowRight, BadgeCheck, Briefcase, Check, Handshake, MapPin, Megaphone, Presentation, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { partnerPageCopy } from '../i18n/partnerPage';
import { PARTNERSHIP_RATES } from '../config/partnership';

type FormState = { name: string; email: string; phone: string; governorate: string; zone: string; activity: string; partnership: string; experience: string; network: string; link: string; message: string; consent: boolean };
const emptyForm: FormState = { name: '', email: '', phone: '', governorate: '', zone: '', activity: '', partnership: '', experience: '', network: '', link: '', message: '', consent: false };
const required: Array<keyof FormState> = ['name', 'email', 'phone', 'governorate', 'zone', 'activity', 'partnership', 'consent'];

export default function BecomePartner() {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'fr';
  const t = partnerPageCopy[lang];
  const rtl = lang === 'ar';
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = t.seoTitle;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description); }
    description.content = t.seoDescription;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://dalil-tounes.com/devenir-partenaire';
  }, [t]);

  const change = (key: keyof FormState, value: string | boolean) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: undefined })); setSuccess(false); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof FormState, string>> = {};
    required.forEach(key => { if (!form[key]) next[key] = key === 'consent' ? t.consentError : t.required; });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = t.emailError;
    setErrors(next);
    if (Object.keys(next).length) { document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    setSuccess(true);
  };

  return <div className="bg-white text-[#374151]" dir={rtl ? 'rtl' : 'ltr'}>
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8E6] via-white to-[#F4F8F6] px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#9A7419]"><Handshake size={17}/>{t.badge}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[#4A1D43] md:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{t.intro}</p>
          <p className="mt-6 max-w-xl border-s-4 border-[#D4AF37] bg-white p-4 text-lg"><strong>{t.reward}</strong></p>
          <a href="#partenaire-formulaire" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#005B44] px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5">{t.cta}<ArrowRight size={18}/></a>
          <small className="mt-4 block text-gray-500">{t.note}</small>
        </div>
        <div className="relative mx-auto h-[390px] w-full max-w-lg" aria-label={t.solutionTitle}>
          <div className="absolute start-[7%] top-8 h-[340px] w-[210px] -rotate-6 rounded-[30px] border-[7px] border-[#07392E] bg-gradient-to-b from-[#07392E] to-[#005B44] p-5 text-white shadow-2xl"><span className="text-xs font-bold uppercase tracking-widest text-[#F4CE55]">{t.professional}</span><p className="mt-16 text-2xl font-bold leading-tight">{t.professionalText}</p></div>
          <div className="absolute end-[5%] top-0 h-[340px] w-[210px] rotate-6 rounded-[30px] border-[7px] border-[#4A1D43] bg-[#FFF8E6] p-5 shadow-2xl"><span className="text-xs font-bold uppercase tracking-widest text-[#9A7419]">{t.portfolio}</span><div className="mt-7 grid grid-cols-2 gap-2">{[1,2,3,4].map(value => <i key={value} className="h-24 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#4A1D43]"/>)}</div></div>
        </div>
      </div>
    </section>

    <Section eyebrow={t.solutionEyebrow} title={t.solutionTitle} intro={t.solutionIntro} centered>
      <div className="grid gap-5 md:grid-cols-2"><Card icon={<Presentation/>} title={t.professional} text={t.professionalText}/><Card icon={<Briefcase/>} title={t.portfolio} text={t.portfolioText}/></div>
    </Section>
    <Section eyebrow={t.offersEyebrow} title={t.offersTitle}>
      <div className="grid gap-5 md:grid-cols-2">
        <Offer rate={PARTNERSHIP_RATES.qualifiedLead} title={t.lead} text={t.leadText} tasks={t.leadTasks}/>
        <Offer rate={PARTNERSHIP_RATES.completeSale} title={t.sale} text={t.saleText} tasks={t.saleTasks} featured/>
      </div><p className="mt-4 text-xs leading-6 text-gray-500">{t.legal}</p>
    </Section>
    <div className="bg-[#F7F3EA]"><Section eyebrow={t.stepsEyebrow} title={t.stepsTitle}><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.steps.map(([title,text], index) => <li key={title} className="rounded-2xl bg-white p-6"><b className="grid h-10 w-10 place-items-center rounded-full bg-[#F4CE55] text-[#4A1D43]">{index+1}</b><h3 className="mt-4 text-xl font-bold text-[#4A1D43]">{title}</h3><p className="mt-2 leading-7 text-gray-600">{text}</p></li>)}</ol></Section></div>
    <Section eyebrow={t.supportEyebrow} title={t.supportTitle}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.support.map(([title,text], index) => <Card key={title} icon={[<Megaphone/>,<Presentation/>,<Users/>,<BadgeCheck/>][index]} title={title} text={text}/>)}</div></Section>
    <Section eyebrow={t.profilesEyebrow} title={t.profilesTitle} centered><div className="flex flex-wrap justify-center gap-3">{t.profiles.map(profile => <span key={profile} className="rounded-full border border-[#D4AF37] bg-[#FFF8E6] px-4 py-2 font-semibold text-[#4A1D43]">{profile}</span>)}</div><p className="mt-7 flex items-center justify-center gap-2"><MapPin size={19}/>{t.location}</p></Section>

    <section id="partenaire-formulaire" className="scroll-mt-24 bg-[#F7F3EA] px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div><Eyebrow>{t.formEyebrow}</Eyebrow><h2 className="mt-3 text-3xl font-bold text-[#4A1D43] md:text-5xl">{t.formTitle}</h2><p className="mt-5 leading-8 text-gray-600">{t.formIntro}</p></div>
        <form onSubmit={submit} noValidate className="rounded-3xl border border-[#D4AF37]/40 bg-white p-5 shadow-sm md:p-9">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label={t.fields.name} error={errors.name} required><input id="name" value={form.name} onChange={e=>change('name',e.target.value)} aria-invalid={!!errors.name}/></Field>
            <Field id="email" label={t.fields.email} error={errors.email} required><input id="email" type="email" value={form.email} onChange={e=>change('email',e.target.value)} aria-invalid={!!errors.email}/></Field>
            <Field id="phone" label={t.fields.phone} error={errors.phone} required><input id="phone" type="tel" value={form.phone} onChange={e=>change('phone',e.target.value)} aria-invalid={!!errors.phone}/></Field>
            <Field id="governorate" label={t.fields.governorate} error={errors.governorate} required><input id="governorate" value={form.governorate} onChange={e=>change('governorate',e.target.value)} aria-invalid={!!errors.governorate}/></Field>
            <Field id="zone" label={t.fields.zone} error={errors.zone} required><input id="zone" value={form.zone} onChange={e=>change('zone',e.target.value)} aria-invalid={!!errors.zone}/></Field>
            <Field id="activity" label={t.fields.activity} error={errors.activity} required><input id="activity" value={form.activity} onChange={e=>change('activity',e.target.value)} aria-invalid={!!errors.activity}/></Field>
            <Field id="partnership" label={t.fields.partnership} error={errors.partnership} required><select id="partnership" value={form.partnership} onChange={e=>change('partnership',e.target.value)} aria-invalid={!!errors.partnership}><option value="">{t.select}</option>{t.options.map(option=><option key={option}>{option}</option>)}</select></Field>
            <Field id="experience" label={t.fields.experience}><input id="experience" value={form.experience} onChange={e=>change('experience',e.target.value)}/></Field>
            <Field id="network" label={t.fields.network}><input id="network" value={form.network} onChange={e=>change('network',e.target.value)}/></Field>
            <Field id="link" label={t.fields.link}><input id="link" type="url" value={form.link} onChange={e=>change('link',e.target.value)} placeholder="https://"/></Field>
            <Field id="message" label={t.fields.message} wide><textarea id="message" rows={4} value={form.message} onChange={e=>change('message',e.target.value)}/></Field>
          </div>
          <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input className="mt-1" type="checkbox" checked={form.consent} onChange={e=>change('consent',e.target.checked)} aria-invalid={!!errors.consent}/><span>{t.consent} <a className="font-bold text-[#005B44] underline" href="/politique-confidentialite">{t.privacy}</a> *</span></label>
          {errors.consent && <p role="alert" className="mt-1 text-sm font-bold text-red-700">{errors.consent}</p>}
          <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#005B44] px-6 py-3 font-bold text-white">{t.submit}<ArrowRight size={18}/></button>
          {success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-900">{t.success}</p>}
        </form>
      </div>
    </section>
    <Section eyebrow={t.faqEyebrow} title={t.faqTitle}><div className="border-t border-gray-200">{t.faq.map(([q,a])=><details key={q} className="border-b border-gray-200 py-4"><summary className="cursor-pointer font-bold text-[#4A1D43]">{q}</summary><p className="mt-3 max-w-3xl leading-7 text-gray-600">{a}</p></details>)}</div></Section>
    <section className="bg-[#4A1D43] px-4 py-16 text-center text-white"><h2 className="text-3xl font-bold md:text-5xl">{t.finalTitle}</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-white/80">{t.finalText}</p><a href="#partenaire-formulaire" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-[#241020]">{t.cta}<ArrowRight size={18}/></a></section>
  </div>;
}

function Eyebrow({children}:{children:ReactNode}) { return <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#9A7419]">{children}</span>; }
function Section({eyebrow,title,intro,centered,children}:{eyebrow:string;title:string;intro?:string;centered?:boolean;children:ReactNode}) { return <section className={`mx-auto max-w-6xl px-4 py-16 md:py-24 ${centered?'text-center':''}`}><Eyebrow>{eyebrow}</Eyebrow><h2 className="mt-3 text-3xl font-bold text-[#4A1D43] md:text-5xl">{title}</h2>{intro&&<p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-gray-600">{intro}</p>}<div className="mt-9">{children}</div></section>; }
function Card({icon,title,text}:{icon:ReactNode;title:string;text:string}) { return <article className="rounded-3xl border border-[#D4AF37]/40 bg-white p-7 text-start shadow-sm"><span className="text-[#D4AF37]">{icon}</span><h3 className="mt-4 text-xl font-bold text-[#4A1D43]">{title}</h3><p className="mt-2 leading-7 text-gray-600">{text}</p></article>; }
function Offer({rate,title,text,tasks,featured}:{rate:number;title:string;text:string;tasks:readonly string[];featured?:boolean}) { return <article className={`relative rounded-3xl border p-7 text-start ${featured?'border-[#D4AF37] bg-[#07392E] text-white':'border-gray-200 bg-white'}`}><span className="absolute end-5 top-5 rounded-full bg-[#F4CE55] px-3 py-1 font-black text-[#4A1D43]">{rate}%</span><h3 className={`pe-16 text-2xl font-bold ${featured?'text-white':'text-[#4A1D43]'}`}>{title}</h3><p className={`mt-3 leading-7 ${featured?'text-white/80':'text-gray-600'}`}>{text}</p><ul className="mt-5 space-y-3">{tasks.map(task=><li key={task} className="flex items-start gap-2"><Check className="mt-1 shrink-0 text-[#D4AF37]" size={17}/>{task}</li>)}</ul></article>; }
function Field({id,label,error,required,wide,children}:{id:string;label:string;error?:string;required?:boolean;wide?:boolean;children:ReactNode}) { return <label htmlFor={id} className={`flex flex-col gap-2 font-semibold text-[#4A1D43] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-300 [&_input]:p-3 [&_select]:rounded-xl [&_select]:border [&_select]:border-gray-300 [&_select]:p-3 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-300 [&_textarea]:p-3 ${wide?'sm:col-span-2':''}`}><span>{label}{required?' *':''}</span>{children}{error&&<small role="alert" className="text-red-700">{error}</small>}</label>; }
