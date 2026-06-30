import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface NotificationModule {
  key: string;
  label: string;
  path: string;
  count: number;
  loading: boolean;
}

const MODULE_DEFINITIONS: Omit<NotificationModule, 'count' | 'loading'>[] = [
  { key: 'business_needs', label: 'Besoins professionnels', path: '/admin/business-needs' },
  { key: 'partner_requests', label: 'Demandes partenaires', path: '/admin/sourcing' },
  { key: 'reservations', label: 'Reservations', path: '/admin/sourcing' },
  { key: 'premium', label: 'Premium', path: '/admin/premium' },
  { key: 'avis', label: 'Avis', path: '/admin/avis' },
  { key: 'suggestions', label: "Suggestions d'entreprises", path: '/admin/sourcing' },
  { key: 'marketplace', label: 'Marketplace', path: '/admin/sourcing' },
  { key: 'evenements', label: 'Evenements', path: '/admin/sourcing' },
];

async function fetchModuleCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  const { count, error } = await supabase
    .from('business_needs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review');

  counts.business_needs = error ? 0 : (count ?? 0);

  // Future modules - return 0 for now
  counts.partner_requests = 0;
  counts.reservations = 0;
  counts.premium = 0;
  counts.avis = 0;
  counts.suggestions = 0;
  counts.marketplace = 0;
  counts.evenements = 0;

  return counts;
}

export function useAdminNotificationCount() {
  const [total, setTotal] = useState(0);
  const [modules, setModules] = useState<NotificationModule[]>(
    MODULE_DEFINITIONS.map(m => ({ ...m, count: 0, loading: true }))
  );

  const refresh = useCallback(async () => {
    const counts = await fetchModuleCounts();
    let sum = 0;
    const updated = MODULE_DEFINITIONS.map(m => {
      const c = counts[m.key] ?? 0;
      sum += c;
      return { ...m, count: c, loading: false };
    });
    setModules(updated);
    setTotal(sum);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { total, modules, refresh };
}

interface AdminNotificationsProps {
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}

export default function AdminNotifications({ onNavigate, variant = 'desktop' }: AdminNotificationsProps) {
  const { total, modules } = useAdminNotificationCount();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'desktop') return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  if (variant === 'mobile') {
    return (
      <div className="space-y-1">
        {modules.map(m => (
          <Link
            key={m.key}
            to={m.path}
            onClick={onNavigate}
            className="flex items-center justify-between px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${m.count > 0 ? 'bg-red-500' : 'bg-emerald-400'}`}
              />
              {m.label}
            </span>
            {m.count > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                {m.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-100 text-gray-700 transition-all"
      >
        <Settings className="w-4 h-4" />
        <span>Admin</span>
        {total > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
            {total}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-xl py-2 min-w-[260px] border border-gray-200">
            <div className="px-4 py-1.5 border-b border-gray-100 mb-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Notifications</span>
            </div>

            {modules.map(m => (
              <Link
                key={m.key}
                to={m.path}
                onClick={() => { setOpen(false); onNavigate?.(); }}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 transition-colors text-sm text-gray-700 hover:text-orange-600"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${m.count > 0 ? 'bg-red-500' : 'bg-emerald-400'}`}
                  />
                  {m.label}
                </span>
                {m.count > 0 && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                    {m.count}
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <Link
                to="/admin/sourcing"
                onClick={() => { setOpen(false); onNavigate?.(); }}
                className="block px-4 py-2.5 hover:bg-orange-50 transition-colors text-sm text-gray-700 hover:text-orange-600"
              >
                Sourcing Rapide
              </Link>
              <Link
                to="/around-me"
                onClick={() => { setOpen(false); onNavigate?.(); }}
                className="block px-4 py-2.5 hover:bg-orange-50 transition-colors text-sm text-gray-700 hover:text-orange-600"
              >
                Autour de moi
              </Link>
              <Link
                to="/admin/commercial"
                onClick={() => { setOpen(false); onNavigate?.(); }}
                className="block px-4 py-2.5 hover:bg-orange-50 transition-colors text-sm text-gray-700 hover:text-orange-600 font-semibold"
              >
                Gestion Terrain
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
