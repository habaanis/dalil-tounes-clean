type MetaStandardEvent = 'CompleteRegistration' | 'Lead';

type MetaEventParameters = Record<string, string | number | boolean>;

type DalilTrackingWindow = Window & {
  __DALIL_TRACKING_ALLOWED__?: boolean;
  fbq?: (command: 'track', eventName: MetaStandardEvent, parameters?: MetaEventParameters) => void;
};

/**
 * Envoie un événement standard Meta uniquement lorsque le suivi production
 * a déjà été autorisé et initialisé par index.html.
 */
export function trackMetaEvent(
  eventName: MetaStandardEvent,
  parameters?: MetaEventParameters,
): boolean {
  if (typeof window === 'undefined') return false;

  const trackingWindow = window as DalilTrackingWindow;
  if (!trackingWindow.__DALIL_TRACKING_ALLOWED__ || typeof trackingWindow.fbq !== 'function') {
    return false;
  }

  trackingWindow.fbq('track', eventName, parameters);
  return true;
}
