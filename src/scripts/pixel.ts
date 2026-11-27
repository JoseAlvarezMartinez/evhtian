/**
 * Carga el Pixel de Meta (fbevents.js) y registra la visita. Los eventos de compra (ViewContent, AddToCart,
 * InitiateCheckout, Contact) los manda main.ts con `track()`, que no hace nada si el Pixel no está.
 */
import { captureAttribution, newEventId, toServer } from './tracking';

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[][]; loaded: boolean; version: string; push: Fbq };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const id = document.querySelector<HTMLMetaElement>('meta[name="evhtian:pixel"]')?.content.trim();

if (id && /^\d+$/.test(id) && !window.fbq) {
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.append(s);

  fbq('init', id);
  // PageView con event_id y su copia por la API de Conversiones. Se manda un instante después para que el
  // Pixel alcance a crear las cookies _fbp/_fbc, que mejoran la coincidencia del evento del servidor.
  captureAttribution();
  const eventID = newEventId();
  fbq('track', 'PageView', {}, { eventID });
  window.setTimeout(() => toServer('PageView', eventID), 1500);
}

export {};
