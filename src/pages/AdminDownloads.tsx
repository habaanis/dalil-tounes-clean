import { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface DailyCount {
  date: string;
  count: number;
}

interface DeviceCount {
  device_type: string;
  count: number;
}

interface ActionCount {
  action_type: string;
  count: number;
}

export default function AdminDownloads() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [deviceCounts, setDeviceCounts] = useState<DeviceCount[]>([]);
  const [actionCounts, setActionCounts] = useState<ActionCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('app_download_events')
        .select('*', { count: 'exact', head: true });
      setTotal(count || 0);

      const { data: allEvents } = await supabase
        .from('app_download_events')
        .select('created_at, device_type, action_type')
        .order('created_at', { ascending: false })
        .limit(5000);

      if (allEvents) {
        const byDay: Record<string, number> = {};
        const byDevice: Record<string, number> = {};
        const byAction: Record<string, number> = {};

        allEvents.forEach((e) => {
          const day = e.created_at.slice(0, 10);
          byDay[day] = (byDay[day] || 0) + 1;
          byDevice[e.device_type] = (byDevice[e.device_type] || 0) + 1;
          byAction[e.action_type] = (byAction[e.action_type] || 0) + 1;
        });

        setDailyCounts(
          Object.entries(byDay)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30)
        );

        setDeviceCounts(
          Object.entries(byDevice)
            .map(([device_type, count]) => ({ device_type, count }))
            .sort((a, b) => b.count - a.count)
        );

        setActionCounts(
          Object.entries(byAction)
            .map(([action_type, count]) => ({ action_type, count }))
            .sort((a, b) => b.count - a.count)
        );
      }
    } catch (err) {
      console.error('Error fetching download stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const actionLabels: Record<string, string> = {
    pwa_install_click: 'Clic installer (Android/Desktop)',
    pwa_install_accepted: 'Installation confirmee',
    pwa_ios_guide_shown: 'Guide iOS affiche',
    download_apk: 'Telechargement APK',
    play_store_click: 'Clic Play Store',
    app_store_click: 'Clic App Store',
  };

  const deviceLabels: Record<string, string> = {
    android: 'Android',
    ios: 'iOS',
    desktop: 'Desktop',
    unknown: 'Autre',
  };

  const deviceIcons: Record<string, typeof Smartphone> = {
    android: Smartphone,
    ios: Smartphone,
    desktop: Monitor,
    unknown: Monitor,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A1D43] flex items-center justify-center">
              <Download className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistiques Installations</h1>
              <p className="text-sm text-gray-500">Suivi des installations de l'application</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/premium')}
            className="text-sm text-gray-500 hover:text-[#4A1D43] transition-colors"
          >
            Retour Admin
          </button>
        </div>

        {/* Total card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A1D43] to-[#6B2D63] flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total clics installation</p>
              <p className="text-4xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* By action type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#4A1D43]" />
              <h2 className="text-lg font-semibold text-gray-900">Par type d'action</h2>
            </div>
            <div className="space-y-3">
              {actionCounts.map((item) => (
                <div key={item.action_type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {actionLabels[item.action_type] || item.action_type}
                  </span>
                  <span className="text-sm font-bold text-[#4A1D43] bg-[#4A1D43]/5 px-2.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))}
              {actionCounts.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucune donnee</p>
              )}
            </div>
          </div>

          {/* By device */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-[#4A1D43]" />
              <h2 className="text-lg font-semibold text-gray-900">Par appareil</h2>
            </div>
            <div className="space-y-3">
              {deviceCounts.map((item) => {
                const Icon = deviceIcons[item.device_type] || Monitor;
                return (
                  <div key={item.device_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {deviceLabels[item.device_type] || item.device_type}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#4A1D43] bg-[#4A1D43]/5 px-2.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  </div>
                );
              })}
              {deviceCounts.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucune donnee</p>
              )}
            </div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#4A1D43]" />
            <h2 className="text-lg font-semibold text-gray-900">Par jour (30 derniers jours)</h2>
          </div>
          {dailyCounts.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucune donnee</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {dailyCounts.map((item) => {
                const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
                const barWidth = (item.count / maxCount) * 100;
                return (
                  <div key={item.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0 font-mono">
                      {item.date}
                    </span>
                    <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4A1D43] to-[#6B2D63] rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
