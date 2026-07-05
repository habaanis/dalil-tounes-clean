import { useCallback, useEffect, useRef, useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, Briefcase, CalendarDays, Handshake, MapPin, Package, Search, TrendingUp, Wallet, X } from 'lucide-react';
import { BusinessCard } from './BusinessCard';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';

export interface BusinessActivity {
  id: string;
  type: string;
  title?: string | null;
  companyId?: string | null;
  description?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  urgency?: string | null;
  city?: string | null;
  governorate?: string | null;
  companySlug?: string | null;
  companyCity?: string | null;
  publishedAt?: string | null;
}

type BusinessCardWithActivityProps = ComponentProps<typeof BusinessCard> & {
  activities?: BusinessActivity[];
};

type ActivityFamilyId = 'material' | 'search' | 'opportunity' | 'other';

interface ActivityFamily {
  id: ActivityFamilyId;
  activities: BusinessActivity[];
}

const ACTIVITY_FAMILY_BY_TYPE: Record<string, ActivityFamilyId> = {
  equipment_purchase: 'material',
  equipment_sale: 'material',
  liquidation: 'material',
  supplier_search: 'search',
  service_provider_search: 'search',
  partnership: 'opportunity',
  business_opportunity: 'opportunity',
  other: 'other',
};

const ACTIVITY_FAMILY_ICONS: Record<ActivityFamilyId, LucideIcon> = {
  material: Package,
  search: Search,
  opportunity: Handshake,
  other: Briefcase,
};

function getActivityFamilyId(type: string): ActivityFamilyId {
  return ACTIVITY_FAMILY_BY_TYPE[type] || 'other';
}

function getActivityFamilyIcon(familyId: ActivityFamilyId) {
  return ACTIVITY_FAMILY_ICONS[familyId] || ACTIVITY_FAMILY_ICONS.other;
}

function groupActivitiesByFamily(activities: BusinessActivity[]): ActivityFamily[] {
  const grouped = new Map<ActivityFamilyId, BusinessActivity[]>();

  activities.forEach(activity => {
    if (!activity?.id || !activity?.type) return;

    const familyId = getActivityFamilyId(activity.type);
    grouped.set(familyId, [...(grouped.get(familyId) || []), activity]);
  });

  return Array.from(grouped.entries()).map(([id, familyActivities]) => ({
    id,
    activities: familyActivities,
  }));
}

function getIsTouchDevice() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function formatActivityDate(value: string | null | undefined, locale: string) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getActivityFallbackTitle(typeLabel: string) {
  return typeLabel || 'Activité publiée';
}

function formatActivityMoney(value: number, currency: string | null | undefined, locale: string) {
  const safeCurrency = currency || 'TND';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString(locale)} ${safeCurrency}`;
  }
}

function formatActivityBudget(activity: BusinessActivity, locale: string) {
  if (activity.budgetMin != null && activity.budgetMax != null) {
    return `${formatActivityMoney(activity.budgetMin, activity.currency, locale)} - ${formatActivityMoney(activity.budgetMax, activity.currency, locale)}`;
  }

  if (activity.budgetMin != null) {
    return `${formatActivityMoney(activity.budgetMin, activity.currency, locale)}+`;
  }

  if (activity.budgetMax != null) {
    return formatActivityMoney(activity.budgetMax, activity.currency, locale);
  }

  return '';
}

function getUrgencyLabel(copy: ReturnType<typeof getPreviewCopy>, urgency: string | null | undefined) {
  if (!urgency) return '';
  return copy.urgencyLabels[urgency as keyof typeof copy.urgencyLabels] || urgency;
}

function getPreviewCopy(language: string) {
  const labels = {
    fr: {
      fallbackTitle: 'Activité publiée',
      close: "Fermer l'aperçu de l'activité",
      preview: 'Aperçu activité',
      budget: 'Budget',
      urgency: 'Urgence',
      publishedAt: 'Publié le',
      location: 'Lieu',
      urgencyLabels: {
        low: 'Faible',
        normal: 'Normal',
        urgent: 'Urgent',
        critical: 'Critique',
        medium: 'Normal',
        high: 'Urgent',
      },
      familyLabels: {
        material: 'Matériel professionnel',
        search: 'Recherche professionnelle',
        opportunity: 'Opportunités',
        other: 'Autres',
      },
    },
    en: {
      fallbackTitle: 'Published activity',
      close: 'Close activity preview',
      preview: 'Activity preview',
      budget: 'Budget',
      urgency: 'Urgency',
      publishedAt: 'Published on',
      location: 'Location',
      urgencyLabels: {
        low: 'Low',
        normal: 'Normal',
        urgent: 'Urgent',
        critical: 'Critical',
        medium: 'Normal',
        high: 'Urgent',
      },
      familyLabels: {
        material: 'Professional equipment',
        search: 'Professional search',
        opportunity: 'Opportunities',
        other: 'Other',
      },
    },
    it: {
      fallbackTitle: 'Attività pubblicata',
      close: "Chiudere l'anteprima dell'attività",
      preview: 'Anteprima attività',
      budget: 'Budget',
      urgency: 'Urgenza',
      publishedAt: 'Pubblicato il',
      location: 'Luogo',
      urgencyLabels: {
        low: 'Bassa',
        normal: 'Normale',
        urgent: 'Urgente',
        critical: 'Critica',
        medium: 'Normale',
        high: 'Urgente',
      },
      familyLabels: {
        material: 'Materiale professionale',
        search: 'Ricerca professionale',
        opportunity: 'Opportunità',
        other: 'Altro',
      },
    },
    ru: {
      fallbackTitle: 'Опубликованная активность',
      close: 'Закрыть предпросмотр активности',
      preview: 'Предпросмотр активности',
      budget: 'Бюджет',
      urgency: 'Срочность',
      publishedAt: 'Опубликовано',
      location: 'Место',
      urgencyLabels: {
        low: 'Низкая',
        normal: 'Обычная',
        urgent: 'Срочно',
        critical: 'Критично',
        medium: 'Обычная',
        high: 'Срочно',
      },
      familyLabels: {
        material: 'Профессиональное оборудование',
        search: 'Профессиональный поиск',
        opportunity: 'Возможности',
        other: 'Другое',
      },
    },
    ar: {
      fallbackTitle: 'نشاط منشور',
      close: 'إغلاق معاينة النشاط',
      preview: 'معاينة النشاط',
      budget: 'الميزانية',
      urgency: 'الأولوية',
      publishedAt: 'تاريخ النشر',
      location: 'الموقع',
      urgencyLabels: {
        low: 'منخفضة',
        normal: 'عادية',
        urgent: 'عاجلة',
        critical: 'حرجة',
        medium: 'عادية',
        high: 'عاجل',
      },
      familyLabels: {
        material: 'معدات مهنية',
        search: 'بحث مهني',
        opportunity: 'فرص',
        other: 'أخرى',
      },
    },
  };

  return labels[language as keyof typeof labels] || labels.fr;
}

export function BusinessCardWithActivity({ activities = [], ...businessCardProps }: BusinessCardWithActivityProps) {
  const { language } = useLanguage();
  const activityCopy = useTranslation(language).businessNeeds.activity;
  const previewCopy = getPreviewCopy(language);
  const activityFamilies = groupActivitiesByFamily(activities);
  const visibleFamilies = activityFamilies.slice(0, 3);
  const [hoveredFamily, setHoveredFamily] = useState<ActivityFamily | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<ActivityFamily | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 320,
    arrowLeft: 160,
    placement: 'top' as 'top' | 'bottom',
  });
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeFamily = selectedFamily || hoveredFamily;
  const activeFamilyId = activeFamily?.id || null;
  const activeFamilyLabel = activeFamily ? previewCopy.familyLabels[activeFamily.id] : '';
  const activeIcon = activeFamily ? getActivityFamilyIcon(activeFamily.id) : Briefcase;
  const locale = language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-US' : language === 'it' ? 'it-IT' : language === 'ru' ? 'ru-RU' : 'fr-TN';

  const clearHoverCloseTimer = useCallback(() => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }, []);

  const scheduleHoverClose = useCallback(() => {
    if (selectedFamily) return;

    clearHoverCloseTimer();
    hoverCloseTimerRef.current = setTimeout(() => {
      setHoveredFamily(null);
      hoverCloseTimerRef.current = null;
    }, 160);
  }, [clearHoverCloseTimer, selectedFamily]);

  const closePopover = useCallback(() => {
    clearHoverCloseTimer();
    setHoveredFamily(null);
    setSelectedFamily(null);
  }, [clearHoverCloseTimer]);

  const updatePopoverPosition = useCallback(() => {
    if (!activeFamilyId || typeof window === 'undefined') return;

    const button = buttonRefs.current[activeFamilyId];
    const panel = popoverRef.current;
    if (!button || !panel) return;

    const buttonRect = button.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 10;
    const width = Math.min(320, Math.max(240, window.innerWidth - viewportPadding * 2));
    const left = Math.min(
      Math.max(buttonRect.left + buttonRect.width / 2 - width / 2, viewportPadding),
      window.innerWidth - width - viewportPadding
    );
    const canPlaceAbove = buttonRect.top >= panelRect.height + gap + viewportPadding;
    const placement = canPlaceAbove ? 'top' : 'bottom';
    const desiredTop = canPlaceAbove ? buttonRect.top - panelRect.height - gap : buttonRect.bottom + gap;
    const top = Math.min(
      Math.max(desiredTop, viewportPadding),
      Math.max(viewportPadding, window.innerHeight - panelRect.height - viewportPadding)
    );
    const arrowLeft = Math.min(
      Math.max(buttonRect.left + buttonRect.width / 2 - left, 18),
      width - 18
    );

    setPopoverPosition({ top, left, width, arrowLeft, placement });
  }, [activeFamilyId]);

  useEffect(() => {
    setIsTouchDevice(getIsTouchDevice());
  }, []);

  useEffect(() => {
    return clearHoverCloseTimer;
  }, [clearHoverCloseTimer]);

  useEffect(() => {
    if (!activeFamily) return;

    const frame = window.requestAnimationFrame(updatePopoverPosition);
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [activeFamily, updatePopoverPosition]);

  useEffect(() => {
    if (!activeFamily) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePopover();
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      const activeButton = activeFamilyId ? buttonRefs.current[activeFamilyId] : null;

      if (
        target &&
        (popoverRef.current?.contains(target) || activeButton?.contains(target))
      ) {
        return;
      }

      closePopover();
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [activeFamily, activeFamilyId, closePopover]);

  useEffect(() => {
    if (!activeFamily || selectedFamily?.id !== activeFamily.id) return;

    closeButtonRef.current?.focus({ preventScroll: true });
  }, [activeFamily, selectedFamily]);

  if (visibleFamilies.length === 0) {
    return <BusinessCard {...businessCardProps} />;
  }

  const hiddenCount = Math.max(activityFamilies.length - visibleFamilies.length, 0);
  const moreActivitiesLabel = activityCopy.moreActivities.replace('{count}', String(hiddenCount));

  return (
    <div className="space-y-1">
      <div className="flex min-h-7 items-center gap-2 px-1 text-xs font-semibold text-[#4A1D43]">
        <span>{activityCopy.label}</span>
        <div className="flex items-center gap-1.5">
          {visibleFamilies.map(family => {
            const Icon = getActivityFamilyIcon(family.id);
            const label = previewCopy.familyLabels[family.id];
            const isPopoverVisible = activeFamily?.id === family.id;

            return (
              <button
                key={family.id}
                ref={(node) => {
                  buttonRefs.current[family.id] = node;
                }}
                type="button"
                title={label}
                aria-label={`${label} - ${previewCopy.preview}`}
                aria-expanded={isPopoverVisible}
                aria-controls={isPopoverVisible ? `activity-preview-${family.id}` : undefined}
                onClick={() => {
                  clearHoverCloseTimer();
                  setHoveredFamily(null);
                  setSelectedFamily(current => current?.id === family.id ? null : family);
                }}
                onMouseEnter={() => {
                  if (!isTouchDevice && !selectedFamily) {
                    clearHoverCloseTimer();
                    setHoveredFamily(family);
                  }
                }}
                onMouseLeave={() => {
                  if (!isTouchDevice) scheduleHoverClose();
                }}
                className={`group relative inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/45 ${
                  isPopoverVisible
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#4A1D43]'
                    : 'border-[#D4AF37]/50 bg-white text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#4A1D43]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            );
          })}
          {hiddenCount > 0 && (
            <span
              title={moreActivitiesLabel}
              aria-label={moreActivitiesLabel}
              className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-1.5 text-[11px] font-bold text-[#4A1D43]"
            >
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
      <BusinessCard {...businessCardProps} />
      {activeFamily && createPortal(
        <div
          ref={popoverRef}
          id={`activity-preview-${activeFamily.id}`}
          role="dialog"
          aria-label={`${previewCopy.preview} - ${activeFamilyLabel}`}
          className="fixed z-[100000] overflow-y-auto rounded-lg border border-[#D4AF37]/25 bg-white p-3 text-left shadow-xl ring-1 ring-black/5"
          onMouseEnter={() => {
            if (!isTouchDevice) clearHoverCloseTimer();
          }}
          onMouseLeave={() => {
            if (!isTouchDevice) scheduleHoverClose();
          }}
          style={{
            top: popoverPosition.top,
            left: popoverPosition.left,
            width: popoverPosition.width,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 'calc(100vh - 24px)',
          }}
        >
          <span
            aria-hidden="true"
            className={`absolute h-3 w-3 rotate-45 border-[#D4AF37]/25 bg-white ${
              popoverPosition.placement === 'top'
                ? '-bottom-1.5 border-b border-r'
                : '-top-1.5 border-l border-t'
            }`}
            style={{ left: popoverPosition.arrowLeft - 6 }}
          />
          <div className="relative z-10">
            <div className="mb-2 flex items-start gap-2.5 pr-7">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                {(() => {
                  const Icon = activeIcon;
                  return <Icon className="h-4 w-4" aria-hidden="true" />;
                })()}
              </span>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#4A1D43]">
                  {activeFamilyLabel || previewCopy.fallbackTitle || getActivityFallbackTitle(activeFamilyLabel)}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#800020]">
                  {activeFamily.activities.length > 1 ? `${activeFamily.activities.length} activites` : '1 activite'}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePopover}
                aria-label={previewCopy.close}
                className="absolute right-0 top-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#4A1D43] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2">
              {activeFamily.activities.map(activity => {
                const typeLabel = activityCopy.tooltips[activity.type] || activityCopy.tooltips.other;
                const activityBudget = formatActivityBudget(activity, locale);
                const activityUrgency = getUrgencyLabel(previewCopy, activity.urgency);
                const activityDate = formatActivityDate(activity.publishedAt, locale);
                const activityLocation = [activity.city, activity.governorate].filter(Boolean).join(', ');

                return (
                  <article
                    key={activity.id}
                    className="rounded-md border border-gray-100 bg-gray-50/70 p-2.5"
                  >
                    <div className="mb-1.5">
                      <h4 className="line-clamp-2 text-xs font-semibold leading-snug text-[#4A1D43]">
                        {activity.title || typeLabel || previewCopy.fallbackTitle}
                      </h4>
                      <p className="mt-0.5 text-[11px] font-medium text-[#800020]">
                        {typeLabel}
                      </p>
                    </div>

                    {activity.description && (
                      <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                        {activity.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-[11px] text-gray-600">
                      {activityBudget && (
                        <div className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                          <span className="font-semibold text-gray-700">{previewCopy.budget}:</span>
                          <span className="min-w-0 truncate">{activityBudget}</span>
                        </div>
                      )}
                      {activityUrgency && (
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#800020]" aria-hidden="true" />
                          <span className="font-semibold text-gray-700">{previewCopy.urgency}:</span>
                          <span className="min-w-0 truncate">{activityUrgency}</span>
                        </div>
                      )}
                      {activityDate && (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                          <span className="font-semibold text-gray-700">{previewCopy.publishedAt}:</span>
                          <span className="min-w-0 truncate">{activityDate}</span>
                        </div>
                      )}
                      {activityLocation && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                          <span className="font-semibold text-gray-700">{previewCopy.location}:</span>
                          <span className="min-w-0 truncate">{activityLocation}</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
