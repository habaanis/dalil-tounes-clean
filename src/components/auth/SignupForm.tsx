import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SignupFormProps {
  onSuccess: (userType: 'candidate' | 'company') => void;
  onSwitchToLogin: () => void;
}

const copy = {
  fr:{title:'Créer un compte',subtitle:"Rejoignez Dalil Tounes aujourd’hui",candidate:'Candidat',candidateSub:'Je cherche un emploi',company:'Entreprise',companySub:'Je recrute',email:'Email',password:'Mot de passe',confirm:'Confirmer le mot de passe',min:'Minimum 6 caractères',confirmPh:'Confirmez votre mot de passe',hide:'Masquer le mot de passe',show:'Afficher le mot de passe',signup:"S'inscrire",creating:'Création en cours...',redirect:'Redirection...',retry:'Réessayer dans',already:'Vous avez déjà un compte ?',login:'Se connecter',weak:'Le mot de passe doit contenir au moins 6 caractères',mismatch:'Les mots de passe ne correspondent pas',exists:'Cet email est déjà utilisé. Connectez-vous plutôt.',rate:"Trop de tentatives d'inscription. Merci de patienter quelques minutes avant de réessayer.",security:'Pour des raisons de sécurité, merci de patienter',seconds:'secondes avant de réessayer.',generic:"Erreur lors de l'inscription",success:"Compte créé avec succès ! Bienvenue dans l'équipe.",redirectSpace:'Redirection vers votre espace commercial...',unexpected:'Une erreur est survenue'},
  ar:{title:'إنشاء حساب',subtitle:'انضم إلى دليل تونس اليوم',candidate:'باحث عن عمل',candidateSub:'أبحث عن فرصة عمل',company:'مؤسسة',companySub:'أبحث عن موظفين',email:'البريد الإلكتروني',password:'كلمة المرور',confirm:'تأكيد كلمة المرور',min:'6 أحرف على الأقل',confirmPh:'أعد إدخال كلمة المرور',hide:'إخفاء كلمة المرور',show:'إظهار كلمة المرور',signup:'إنشاء الحساب',creating:'جارٍ إنشاء الحساب...',redirect:'جارٍ التحويل...',retry:'أعد المحاولة بعد',already:'لديك حساب بالفعل؟',login:'تسجيل الدخول',weak:'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',mismatch:'كلمتا المرور غير متطابقتين',exists:'هذا البريد الإلكتروني مستخدم بالفعل. سجّل الدخول بدلاً من ذلك.',rate:'محاولات تسجيل كثيرة. يرجى الانتظار بضع دقائق قبل إعادة المحاولة.',security:'لأسباب أمنية، يرجى الانتظار',seconds:'ثانية قبل إعادة المحاولة.',generic:'حدث خطأ أثناء إنشاء الحساب',success:'تم إنشاء الحساب بنجاح! مرحباً بك.',redirectSpace:'جارٍ تحويلك إلى مساحتك...',unexpected:'حدث خطأ غير متوقع'},
  en:{title:'Create an account',subtitle:'Join Dalil Tounes today',candidate:'Candidate',candidateSub:'I am looking for a job',company:'Business',companySub:'I am hiring',email:'Email',password:'Password',confirm:'Confirm password',min:'Minimum 6 characters',confirmPh:'Confirm your password',hide:'Hide password',show:'Show password',signup:'Sign up',creating:'Creating account...',redirect:'Redirecting...',retry:'Try again in',already:'Already have an account?',login:'Sign in',weak:'Password must contain at least 6 characters',mismatch:'Passwords do not match',exists:'This email is already in use. Please sign in instead.',rate:'Too many sign-up attempts. Please wait a few minutes before trying again.',security:'For security reasons, please wait',seconds:'seconds before trying again.',generic:'Error while signing up',success:'Account created successfully! Welcome.',redirectSpace:'Redirecting to your space...',unexpected:'An error occurred'},
  it:{title:'Crea un account',subtitle:'Unisciti a Dalil Tounes oggi',candidate:'Candidato',candidateSub:'Cerco lavoro',company:'Azienda',companySub:'Sto assumendo',email:'Email',password:'Password',confirm:'Conferma password',min:'Minimo 6 caratteri',confirmPh:'Conferma la password',hide:'Nascondi password',show:'Mostra password',signup:'Registrati',creating:'Creazione account...',redirect:'Reindirizzamento...',retry:'Riprova tra',already:'Hai già un account?',login:'Accedi',weak:'La password deve contenere almeno 6 caratteri',mismatch:'Le password non corrispondono',exists:'Questa email è già utilizzata. Accedi invece.',rate:'Troppi tentativi di registrazione. Attendi qualche minuto prima di riprovare.',security:'Per motivi di sicurezza, attendi',seconds:'secondi prima di riprovare.',generic:'Errore durante la registrazione',success:'Account creato con successo! Benvenuto.',redirectSpace:'Reindirizzamento al tuo spazio...',unexpected:'Si è verificato un errore'},
  ru:{title:'Создать аккаунт',subtitle:'Присоединяйтесь к Dalil Tounes сегодня',candidate:'Соискатель',candidateSub:'Я ищу работу',company:'Компания',companySub:'Я нанимаю',email:'Эл. почта',password:'Пароль',confirm:'Подтвердите пароль',min:'Минимум 6 символов',confirmPh:'Повторите пароль',hide:'Скрыть пароль',show:'Показать пароль',signup:'Зарегистрироваться',creating:'Создание аккаунта...',redirect:'Перенаправление...',retry:'Повторить через',already:'Уже есть аккаунт?',login:'Войти',weak:'Пароль должен содержать не менее 6 символов',mismatch:'Пароли не совпадают',exists:'Эта почта уже используется. Войдите в аккаунт.',rate:'Слишком много попыток регистрации. Подождите несколько минут.',security:'В целях безопасности подождите',seconds:'секунд перед повторной попыткой.',generic:'Ошибка при регистрации',success:'Аккаунт успешно создан! Добро пожаловать.',redirectSpace:'Перенаправление в ваш кабинет...',unexpected:'Произошла ошибка'},
} as const;

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const { language } = useLanguage();
  const t = copy[language] ?? copy.fr;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'candidate' | 'company'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => { if (cooldown <= 0) return; const timer = setTimeout(() => setCooldown((s) => s - 1), 1000); return () => clearTimeout(timer); }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (password.length < 6) { setError(t.weak); return; }
    if (password !== confirmPassword) { setError(t.mismatch); return; }
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { user, error: signUpError } = await signUp(cleanEmail, password, userType);
      if (signUpError) {
        const msg = (signUpError.message || '').toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) setError(t.exists);
        else if (msg.includes('rate limit') || msg.includes('too many') || (signUpError as any).status === 429) { setError(t.rate); setCooldown(60); }
        else if (msg.includes('for security purposes')) { const m = signUpError.message.match(/(\d+)\s*seconds?/i); const secs = m ? parseInt(m[1], 10) : 30; setError(`${t.security} ${secs} ${t.seconds}`); setCooldown(secs); }
        else setError(signUpError.message || t.generic);
        setLoading(false); return;
      }
      if (user) { setSuccessMessage(t.success); setLoading(false); setTimeout(() => { onSuccess(userType); navigate('/commercial'); }, 1500); return; }
    } catch (err: any) { setError(err.message || t.unexpected); setLoading(false); }
  };

  const iconSide = language === 'ar' ? 'right-3' : 'left-3';
  const eyeSide = language === 'ar' ? 'left-3' : 'right-3';
  const inputPad = language === 'ar' ? 'pr-10 pl-12' : 'pl-10 pr-12';

  return <div className="w-full max-w-md mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="bg-white rounded-2xl shadow-xl p-8">
    <div className="text-center mb-8"><h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2><p className="text-gray-600">{t.subtitle}</p></div>
    {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
    {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-start gap-3" role="status" aria-live="polite"><CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5"/><div><div className="font-semibold">{successMessage}</div><div className="text-xs text-green-700 mt-1">{t.redirectSpace}</div></div></div>}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-6"><button type="button" onClick={() => setUserType('candidate')} className={`flex-1 p-4 rounded-lg border-2 transition-all ${userType === 'candidate' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}><User className={`w-6 h-6 mx-auto mb-2 ${userType === 'candidate' ? 'text-orange-600' : 'text-gray-400'}`}/><div className="text-sm font-semibold text-gray-900">{t.candidate}</div><div className="text-xs text-gray-500">{t.candidateSub}</div></button><button type="button" onClick={() => setUserType('company')} className={`flex-1 p-4 rounded-lg border-2 transition-all ${userType === 'company' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}><Briefcase className={`w-6 h-6 mx-auto mb-2 ${userType === 'company' ? 'text-orange-600' : 'text-gray-400'}`}/><div className="text-sm font-semibold text-gray-900">{t.company}</div><div className="text-xs text-gray-500">{t.companySub}</div></button></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label><div className="relative"><Mail className={`absolute ${iconSide} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`}/><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`} placeholder="name@example.com" required/></div></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label><div className="relative"><Lock className={`absolute ${iconSide} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`}/><input type={showPassword?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" className={`w-full ${inputPad} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`} placeholder={t.min} required minLength={6}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?t.hide:t.show} className={`absolute ${eyeSide} top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded`}>{showPassword?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.confirm}</label><div className="relative"><Lock className={`absolute ${iconSide} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`}/><input type={showConfirmPassword?'text':'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} autoComplete="new-password" className={`w-full ${inputPad} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`} placeholder={t.confirmPh} required minLength={6}/><button type="button" onClick={()=>setShowConfirmPassword(v=>!v)} aria-label={showConfirmPassword?t.hide:t.show} className={`absolute ${eyeSide} top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded`}>{showConfirmPassword?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div></div>
      <button type="submit" disabled={loading||cooldown>0||!!successMessage} className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">{(loading||!!successMessage)&&<span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"/>}{successMessage?t.redirect:loading?t.creating:cooldown>0?`${t.retry} ${cooldown}s`:t.signup}</button>
    </form>
    <div className="mt-6 text-center"><p className="text-sm text-gray-600">{t.already}{' '}<button onClick={onSwitchToLogin} className="text-orange-600 hover:text-orange-700 font-semibold">{t.login}</button></p></div>
  </div></div>;
}
