import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Valeurs figées — priorité absolue sur .env
const HARDCODED_URL = 'https://kmvjegbtroksjqaqliyv.supabase.co';
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdmplZ2J0cm9rc2pxYXFsaXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDA1NTEsImV4cCI6MjA2NzM3NjU1MX0.MbU7b-HWQBwlYtbJeE7_ABvrGhuhzeAuqvkcVvvoE1o';

const SUPABASE_URL = HARDCODED_URL || (import.meta.env.VITE_SUPABASE_URL as string);
const SUPABASE_ANON_KEY = HARDCODED_KEY || (import.meta.env.VITE_SUPABASE_ANON_KEY as string);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Aucune configuration Supabase trouvée !');
}

const supabaseInstance: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'dalil-tounes'
    }
  }
});

export const supabaseUrl = SUPABASE_URL;
export const supabaseAnonKey = SUPABASE_ANON_KEY;

// --- Debug logging ---

type SearchLog = {
  ts: string;
  page: string;
  component?: string;
  scope?: string;
  type: 'rpc' | 'select';
  endpoint: string;
  payload: any;
  durationMs: number;
  rowCount?: number;
  error?: string;
};

const listeners = new Set<(items: SearchLog[]) => void>();
const logs: SearchLog[] = [];

function pushLog(e: SearchLog) {
  logs.unshift(e);
  logs.splice(200);
  listeners.forEach((fn) => fn(logs));
}

export const DebugSearch = {
  enabled: import.meta.env.VITE_DEBUG_SEARCH === '1',
  get: () => logs,
  on: (fn: (items: SearchLog[]) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export async function rpcLog<T = any>(
  name: string,
  params: Record<string, any>,
  meta?: { page?: string; component?: string; scope?: string }
) {
  const t0 = performance.now();
  const { data, error } = await supabaseInstance.rpc(name, params);

  pushLog({
    ts: new Date().toISOString(),
    page: meta?.page ?? (typeof window !== 'undefined' ? location.pathname : ''),
    component: meta?.component,
    scope: meta?.scope,
    type: 'rpc',
    endpoint: `/rest/v1/rpc/${name}`,
    payload: params,
    durationMs: Math.round(performance.now() - t0),
    rowCount: Array.isArray(data) ? data.length : undefined,
    error: error?.message,
  });

  return { data, error };
}

export async function selectLikeLog<T = any>(
  table: string,
  column: string,
  like: string,
  limit = 8,
  meta?: { page?: string; component?: string; scope?: string }
) {
  const t0 = performance.now();
  const { data, error } = await supabaseInstance
    .from(table)
    .select('*')
    .ilike(column, like)
    .limit(limit);

  pushLog({
    ts: new Date().toISOString(),
    page: meta?.page ?? (typeof window !== 'undefined' ? location.pathname : ''),
    component: meta?.component,
    scope: meta?.scope,
    type: 'select',
    endpoint: `/rest/v1/${table}`,
    payload: { select: '*', ilike: { [column]: like }, limit },
    durationMs: Math.round(performance.now() - t0),
    rowCount: Array.isArray(data) ? data.length : undefined,
    error: error?.message,
  });

  return { data: (data ?? []) as T[], error };
}

export const supabase: SupabaseClient = supabaseInstance;
export default supabase;
