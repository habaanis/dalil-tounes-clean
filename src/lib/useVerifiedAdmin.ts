import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from './supabaseClient';

type AdminAccess = 'checking' | 'allowed' | 'denied' | 'error';

export function useAdminAccess(): AdminAccess {
  const { user, loading } = useAuth();
  const uid = user?.id;
  const [result, setResult] = useState<{ uid: string; status: AdminAccess } | null>(null);
  useEffect(() => {
    let cancelled = false;
    setResult(null);
    if (!uid || loading) return;
    const finish = (status: AdminAccess) => {
      if (!cancelled) setResult({ uid, status });
    };
    const verify = async () => {
      try {
        const { data: { user: current }, error } = await supabase.auth.getUser();
        if (error || !current) { finish('error'); return; }
        if (current.id !== uid) { finish('denied'); return; }
        const { data, error: adminError } = await supabase.rpc('dalil_registration_is_admin');
        finish(adminError ? 'error' : data === true ? 'allowed' : 'denied');
      } catch { finish('error'); }
    };
    void verify();
    return () => { cancelled = true; };
  }, [uid, loading]);
  if (loading) return 'checking';
  if (!uid) return 'denied';
  return result?.uid === uid ? result.status : 'checking';
}

export function useVerifiedAdmin() {
  return useAdminAccess() === 'allowed';
}
