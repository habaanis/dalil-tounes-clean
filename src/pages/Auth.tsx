import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/SignupForm';
import LoginForm from '../components/auth/LoginForm';

interface AuthProps {
  onNavigate?: (page: 'candidateDashboard' | 'companyDashboard') => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const { user, userType, loading } = useAuth();
  const location = useLocation();
  const isLoginPath = location.pathname === '/login' || location.pathname === '/connexion';
  const [mode, setMode] = useState<'login' | 'signup'>(isLoginPath ? 'login' : 'signup');
  const navigate = useNavigate();

  useEffect(() => {
    setMode(isLoginPath ? 'login' : 'signup');
  }, [isLoginPath]);

  const goTo = (page: 'candidateDashboard' | 'companyDashboard') => {
    if (typeof onNavigate === 'function') {
      onNavigate(page);
      return;
    }
    if (page === 'candidateDashboard') {
      navigate('/candidate/dashboard');
    } else {
      navigate('/company/dashboard');
    }
  };

  // Pas de redirection automatique : l'utilisateur reste sur /login
  // même si une session existe. La navigation ne se fait qu'après
  // une action explicite (submit du formulaire).

  const handleSignupSuccess = (type: 'candidate' | 'company') => {
    goTo(type === 'candidate' ? 'candidateDashboard' : 'companyDashboard');
  };

  const handleLoginSuccess = () => {
    goTo(userType === 'candidate' ? 'candidateDashboard' : 'companyDashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dalil Tounes
          </h1>
          <p className="text-xl text-gray-600">
            Votre guide professionnel en Tunisie
          </p>
        </div>

        {mode === 'signup' ? (
          <SignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        ) : (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setMode('signup')}
          />
        )}
      </div>
    </div>
  );
}
