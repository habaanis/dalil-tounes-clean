import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from './supabaseClient';

export function useVerifiedAdmin() {
  const { user, loading } = useAuth();
  const uid = user?.id;
  const [verified, setVerified] = useState<string|null>(null);
  useEffect(() => {
    let cancelled = false;
    setVerified(null);
    if (!uid || loading) return;
    const verify = async () => {
      try {
        const { data: { user: current }, error } = await supabase.auth.getUser();
        if (error || current?.id !== uid || cancelled) return;
        const { data, error: adminError } = await supabase.from('admins').select('id').eq('id', uid).maybeSingle();
        if (!cancelled && !adminError && data?.id === uid) setVerified(uid);
      } catch { /* Fail closed. */ }
    };
    void verify();
    return () => { cancelled = true; };
  }, [uid, loading]);
  return !loading && !!uid && verified === uid;
}
