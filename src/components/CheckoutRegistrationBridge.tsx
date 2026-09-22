import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabaseAnonKey, supabaseUrl } from '../lib/supabaseClient';

type CheckoutPayload = {
  offer?: string;
  email?: string;
  orderRef?: string;
  requestId?: string;
};

type RegistrationResponse = {
  success?: boolean;
  id?: string;
  error?: string;
};

const CHECKOUT_PATH = '/api/create-stripe-checkout';

function readValue(form: HTMLFormElement, name: string): string {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return field.value;
  }
  return '';
}

function readCheckedValue(form: HTMLFormElement, name: string): string {
  const field = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return field?.value || '';
}

function readChecked(form: HTMLFormElement, name: string): boolean {
  const field = form.elements.namedItem(name);
  return field instanceof HTMLInputElement ? field.checked : false;
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function selectedPlanFromOffer(offer: string): 'cv_business' | 'artisan' | 'premium' | '' {
  if (offer === 'cv_essential' || offer === 'cv_complete') return 'cv_business';
  if (offer.startsWith('artisan_')) return 'artisan';
  if (offer.startsWith('premium_')) return 'premium';
  return '';
}

function checkoutRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

export function CheckoutRegistrationBridge() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/subscription' && location.pathname !== '/abonnement') return;

    const previousFetch = window.fetch;
    const originalFetch = previousFetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = checkoutRequestUrl(input);
      const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

      if (!url.includes(CHECKOUT_PATH) || method !== 'POST' || typeof init?.body !== 'string') {
        return originalFetch(input, init);
      }

      let checkoutPayload: CheckoutPayload;
      try {
        checkoutPayload = JSON.parse(init.body) as CheckoutPayload;
      } catch {
        return originalFetch(input, init);
      }

      const offer = String(checkoutPayload.offer || '');
      const selectedPlan = selectedPlanFromOffer(offer);
      const form = document.querySelector<HTMLFormElement>('form');

      if (!selectedPlan || !form) {
        return originalFetch(input, init);
      }

      const requestId = createRequestId();
      const registrationPayload = {
        mode: 'subscription',
        language: document.documentElement.lang || 'fr',
        sourcePage: 'subscription',
        requestId,
        elapsedMs: 2000,
        verificationField: readValue(form, 'verificationField'),
        selectedPlan,
        companyName: readValue(form, 'companyName'),
        managerName: readValue(form, 'managerName'),
        phone: readValue(form, 'phone'),
        email: readValue(form, 'email'),
        governorate: readValue(form, 'governorate'),
        city: readValue(form, 'city'),
        sector: readValue(form, 'sector'),
        website: readValue(form, 'website'),
        facebook: readValue(form, 'facebook'),
        instagram: readValue(form, 'instagram'),
        whatsapp: readValue(form, 'whatsapp'),
        selectedPlatforms: [],
        requestedBillingPeriod: selectedPlan === 'cv_business' ? '' : readCheckedValue(form, 'requestedBillingPeriod'),
        requestedPaymentSchedule: readCheckedValue(form, 'requestedPaymentSchedule'),
        preferredContactMethod: readCheckedValue(form, 'preferredContactMethod'),
        preferredContactTime: readCheckedValue(form, 'preferredContactTime'),
        message: readValue(form, 'message'),
        consent: readChecked(form, 'consent'),
      };

      try {
        const registrationResponse = await originalFetch(`${supabaseUrl}/functions/v1/submit-company-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify(registrationPayload),
        });

        const registration = await registrationResponse.json() as RegistrationResponse;
        if (!registrationResponse.ok || !registration.success || !registration.id) {
          return new Response(JSON.stringify({ error: registration.error || 'Order registration failed' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const nextPayload: CheckoutPayload = {
          ...checkoutPayload,
          orderRef: registration.id,
          requestId,
        };

        return originalFetch(input, {
          ...init,
          body: JSON.stringify(nextPayload),
        });
      } catch {
        return new Response(JSON.stringify({ error: 'Order registration failed' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };

    return () => {
      window.fetch = previousFetch;
    };
  }, [location.pathname]);

  return null;
}

export default CheckoutRegistrationBridge;
