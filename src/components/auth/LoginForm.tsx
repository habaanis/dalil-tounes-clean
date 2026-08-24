import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface LoginFormProps {
  onSuccess: (email?: string) => void;
  onSwitchToSignup: () => void;
}

const copy = {
  fr: { title:'Connexion', welcome:'Bienvenue sur Dalil Tounes', email:'Email', password:'Mot de passe', passwordPlaceholder:'Votre mot de passe', hide:'Masquer le mot de passe', show:'Afficher le mot de passe', login:'Se connecter', noAccount:"Vous n'avez pas de compte ?", signup:"S'inscrire", create:'Créer un compte', join:'Rejoignez Dalil Tounes en quelques secondes.', missing:'Merci de renseigner votre email et votre mot de passe.', invalid:'Identifiants invalides : email ou mot de passe incorrect.', unconfirmed:'Compte non confirmé. Merci de vérifier votre boîte mail.', rate:'Trop de tentatives de connexion. Patientez quelques minutes.', notFound:'Aucun compte trouvé pour cet email.', generic:'Erreur lors de la connexion', unexpected:'Une erreur est survenue' },
  ar: { title:'تسجيل الدخول', welcome:'مرحباً بك في دليل تونس', email:'البريد الإلكتروني', password:'كلمة المرور', passwordPlaceholder:'أدخل كلمة المرور', hide:'إخفاء كلمة المرور', show:'إظهار كلمة المرور', login:'تسجيل الدخول', noAccount:'ليس لديك حساب؟', signup:'إنشاء حساب', create:'إنشاء حساب جديد', join:'انضم إلى دليل تونس في بضع ثوانٍ.', missing:'يرجى إدخال البريد الإلكتروني وكلمة المرور.', invalid:'بيانات الدخول غير صحيحة: البريد الإلكتروني أو كلمة المرور غير صحيحة.', unconfirmed:'الحساب غير مؤكد. يرجى التحقق من بريدك الإلكتروني.', rate:'محاولات تسجيل دخول كثيرة. يرجى الانتظار بضع دقائق.', notFound:'لم يتم العثور على حساب بهذا البريد الإلكتروني.', generic:'حدث خطأ أثناء تسجيل الدخول', unexpected:'حدث خطأ غير متوقع' },
  en: { title:'Sign in', welcome:'Welcome to Dalil Tounes', email:'Email', password:'Password', passwordPlaceholder:'Your password', hide:'Hide password', show:'Show password', login:'Sign in', noAccount:"Don't have an account?", signup:'Sign up', create:'Create an account', join:'Join Dalil Tounes in just a few seconds.', missing:'Please enter your email and password.', invalid:'Invalid credentials: incorrect email or password.', unconfirmed:'Account not confirmed. Please check your inbox.', rate:'Too many sign-in attempts. Please wait a few minutes.', notFound:'No account found for this email.', generic:'Error while signing in', unexpected:'An error occurred' },
  it: { title:'Accedi', welcome:'Benvenuto su Dalil Tounes', email:'Email', password:'Password', passwordPlaceholder:'La tua password', hide:'Nascondi password', show:'Mostra password', login:'Accedi', noAccount:'Non hai un account?', signup:'Registrati', create:'Crea un account', join:'Unisciti a Dalil Tounes in pochi secondi.', missing:'Inserisci email e password.', invalid:'Credenziali non valide: email o password errate.', unconfirmed:'Account non confermato. Controlla la tua email.', rate:'Troppi tentativi di accesso. Attendi qualche minuto.', notFound:'Nessun account trovato per questa email.', generic:"Errore durante l'accesso", unexpected:'Si è verificato un errore' },
  ru: { title:'Вход', welcome:'Добро пожаловать в Dalil Tounes', email:'Эл. почта', password:'Пароль', passwordPlaceholder:'Ваш пароль', hide:'Скрыть пароль', show:'Показать пароль', login:'Войти', noAccount:'Нет аккаунта?', signup:'Зарегистрироваться', create:'Создать аккаунт', join:'Присоединитесь к Dalil Tounes за несколько секунд.', missing:'Введите электронную почту и пароль.', invalid:'Неверные данные: электронная почта или пароль указаны неправильно.', unconfirmed:'Аккаунт не подтвержден. Проверьте почту.', rate:'Слишком много попыток входа. Подождите несколько минут.', notFound:'Аккаунт с такой почтой не найден.', generic:'Ошибка при входе', unexpected:'Произошла ошибка' },
} as const;

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const t = copy[language] ?? copy.fr;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    if (!cleanEmail || !cleanPassword) { setError(t.missing); setLoading(false); return; }
    try {
      const { user, error: signInError } = await signIn(cleanEmail, cleanPassword);
      if (signInError) {
        const msg = (signInError.message || '').toLowerCase();
        const status = (signInError as any).status;
        if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) setError(t.invalid);
        else if (msg.includes('email not confirmed') || msg.includes('not confirmed')) setError(t.unconfirmed);
        else if (msg.includes('rate limit') || msg.includes('too many') || status === 429) setError(t.rate);
        else if (msg.includes('user not found')) setError(t.notFound);
        else setError(signInError.message || t.generic);
        setLoading(false); return;
      }
      if (user) onSuccess(cleanEmail);
    } catch (err: any) {
      setError(err?.message || t.unexpected);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8"><h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2><p className="text-gray-600">{t.welcome}</p></div>
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label><div className="relative"><Mail className={`${language === 'ar' ? 'absolute right-3' : 'absolute left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`} placeholder="name@example.com" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label><div className="relative"><Lock className={`${language === 'ar' ? 'absolute right-3' : 'absolute left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={`w-full ${language === 'ar' ? 'pr-10 pl-12' : 'pl-10 pr-12'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`} placeholder={t.passwordPlaceholder} required /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? t.hide : t.show} className={`${language === 'ar' ? 'absolute left-3' : 'absolute right-3'} top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded`}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">{loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}{t.login}</button>
        </form>
        <div className="mt-6 text-center"><p className="text-sm text-gray-600">{t.noAccount}{' '}<button onClick={onSwitchToSignup} className="text-orange-600 hover:text-orange-700 font-semibold">{t.signup}</button></p></div>
        <div className="mt-6 pt-6 border-t border-gray-200"><button type="button" onClick={onSwitchToSignup} className="w-full py-3 bg-white border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">{t.create}</button><p className="mt-2 text-xs text-center text-gray-500">{t.join}</p></div>
      </div>
    </div>
  );
}
