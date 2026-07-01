import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Handshake, Package, Search, TrendingUp } from 'lucide-react';
import { BusinessCard } from './BusinessCard';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';

export interface BusinessActivity {
  id: string;
  type: string;
  title?: string | null;
}

type BusinessCardWithActivityProps = ComponentProps<typeof BusinessCard> & {
  activities?: BusinessActivity[];
};

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  supplier_search: Search,
  service_provider_search: Briefcase,
  equipment_purchase: Package,
  equipment_sale: Package,
  liquidation: Package,
  partnership: Handshake,
  business_opportunity: TrendingUp,
  other: Briefcase,
};

function getActivityIcon(type: string) {
  return ACTIVITY_ICONS[type] || ACTIVITY_ICONS.other;
}

export function BusinessCardWithActivity({ activities = [], ...businessCardProps }: BusinessCardWithActivityProps) {
  const { language } = useLanguage();
  const activityCopy = useTranslation(language).businessNeeds.activity;
  const visibleActivities = activities.filter(activity => activity?.id && activity?.type).slice(0, 3);

  if (visibleActivities.length === 0) {
    return <BusinessCard {...businessCardProps} />;
  }

  const hiddenCount = Math.max(activities.length - visibleActivities.length, 0);
  const moreActivitiesLabel = activityCopy.moreActivities.replace('{count}', String(hiddenCount));

  return (
    <div className="space-y-2">
      <div className="flex min-h-7 items-center gap-2 px-1 text-xs font-semibold text-[#4A1D43]">
        <span>{activityCopy.label}</span>
        <div className="flex items-center gap-1.5">
          {visibleActivities.map(activity => {
            const Icon = getActivityIcon(activity.type);
            const tooltip = activityCopy.tooltips[activity.type] || activityCopy.tooltips.other;

            return (
              <span
                key={activity.id}
                title={tooltip}
                aria-label={tooltip}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-white text-[#D4AF37] shadow-sm"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            );
          })}
          {hiddenCount > 0 && (
            <span
              title={moreActivitiesLabel}
              aria-label={moreActivitiesLabel}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-1.5 text-[11px] font-bold text-[#4A1D43]"
            >
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
      <BusinessCard {...businessCardProps} />
    </div>
  );
}
