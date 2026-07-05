import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

// Import dynamique : le chunk vendor-supabase (~167 kB) n'est plus inclus
// dans le bundle principal. Il est chargé uniquement au premier besoin
// (montage du provider, qui s'exécute après le premier rendu).
let supabasePromise: Promise<SupabaseClient> | null = null;
function loadSupabase(): Promise<SupabaseClient> {
  if (!supabasePromise) {
    supabasePromise = import('../lib/supabaseClient').then((m) => m.supabase);
  }
  return supabasePromise;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userType: 'candidate' | 'company') => Promise<{ user: User | null; error: any }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signOut: () => Promise<void>;
  userType: 'candidate' | 'company' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'candidate' | 'company' | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    loadSupabase()
      .then((supabase) => {
        if (cancelled) return;

        supabase.auth
          .getSession()
          .then(({ data: { session }, error }) => {
            if (error) console.error('[AuthContext] getSession error', error);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              loadUserType(session.user.id).catch((e) =>
                console.error('[AuthContext] loadUserType failed', e)
              );
            }
          })
          .catch((e) => console.error('[AuthContext] getSession threw', e))
          .finally(() => setLoading(false));

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          if (nextSession?.user) {
            (async () => {
              try {
                await loadUserType(nextSession.user.id);
              } catch (e) {
                console.error('[AuthContext] loadUserType (onAuthStateChange) failed', e);
              }
            })();
          } else {
            setUserType(null);
          }
          setLoading(false);
        });

        unsubscribe = () => subscription.unsubscribe();
      })
      .catch((e) => {
        console.error('[AuthContext] loadSupabase failed', e);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadUserType = async (userId: string) => {
    const typeStored = localStorage.getItem(`userType_${userId}`);
    if (typeStored) {
      setUserType(typeStored as 'candidate' | 'company');
      return;
    }

    const supabase = await loadSupabase();
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('created_by', userId)
      .maybeSingle();

    if (candidate) {
      setUserType('candidate');
      localStorage.setItem(`userType_${userId}`, 'candidate');
    } else {
      setUserType('company');
      localStorage.setItem(`userType_${userId}`, 'company');
    }
  };

  const signUp = async (email: string, password: string, userType: 'candidate' | 'company') => {
    try {
      const supabase = await loadSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
          },
        },
      });

      if (error) {
        return { user: null, error };
      }

      if (data.user) {
        localStorage.setItem(`userType_${data.user.id}`, userType);
        setUserType(userType);
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = await loadSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      if (data.user) {
        await loadUserType(data.user.id);
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signOut = async () => {
    const supabase = await loadSupabase();
    await supabase.auth.signOut();
    setUserType(null);
    localStorage.removeItem(`userType_${user?.id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        userType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
