/**
 * Medición para Meta Ads: eventos del Pixel con event_id (listo para deduplicar con la API de Conversiones)
 * y atribución de las ventas que se cierran por WhatsApp.
 *
 * Cómo se atribuye una venta:
 * 1. Al entrar, se guarda de dónde vino la clienta (utm_* y fbclid) durante 28 días (último clic).
 * 2. Cada mensaje de WhatsApp lleva un «código de pedido» corto, por ejemplo EVH-T7K2Q.
 *    La letra después de «EVH-» es la etapa del anuncio: T = TOFU, M = MOFU, B = BOFU,
 *    A = otro anuncio de Meta, W = web sin anuncio (orgánico, Google, directo).
 * 3. El evento Lead de ese clic usa el mismo código como event_id, así una venta cargada después
 *    se puede cruzar con el clic que la originó.
 */

const ATTR_KEY = 'evhtian-attrib-v1';
const ATTR_DAYS = 28;

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  fbclid?: string;
  /** Página donde aterrizó. */
  landing: string;
  /** Fecha del clic (ms). */
  at: number;
}

/** Evento estándar del Pixel, con copia por la API de Conversiones. No hace nada si el Pixel no está configurado. */
export function track(event: string, params?: Record<string, unknown>, eventID: string = newEventId()) {
  if (!window.fbq) return eventID;
  window.fbq('track', event, params, { eventID });
  toServer(event, eventID, params);
  return eventID;
}

/** Evento personalizado del Pixel (para segmentar públicos, no para optimizar campañas). */
export function trackCustom(event: string, params?: Record<string, unknown>, eventID: string = newEventId()) {
  if (!window.fbq) return eventID;
  window.fbq('trackCustom', event, params, { eventID });
  toServer(event, eventID, params);
  return eventID;
}

const cookie = (name: string) =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);

/**
 * Copia del evento para la API de Conversiones (src/pages/api/evento.ts), con el mismo event_id para que
 * Meta lo cuente una sola vez. sendBeacon sigue aunque la clienta se vaya a WhatsApp enseguida.
 */
export function toServer(event: string, eventID: string, params?: Record<string, unknown>) {
  try {
    const a = attribution();
    // _fbc lo crea el Pixel al llegar desde un anuncio; si todavía no existe, se arma con el fbclid guardado.
    const fbc = cookie('_fbc') ?? (a?.fbclid ? `fb.1.${a.at}.${a.fbclid}` : undefined);
    const body = JSON.stringify({
      event_name: event,
      event_id: eventID,
      event_source_url: location.href,
      custom_data: params,
      fbp: cookie('_fbp'),
      fbc,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/evento/', blob)) {
      void fetch('/api/evento/', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* la medición nunca rompe la tienda */
  }
}

export function newEventId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Lee la atribución guardada (vacía si venció o no hay). */
export function attribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    if (!a || typeof a.at !== 'number' || Date.now() - a.at > ATTR_DAYS * 864e5) return null;
    return a;
  } catch {
    return null;
  }
}

/** Guarda de dónde vino la visita si la URL trae utm_* o fbclid (último clic gana). */
export function captureAttribution() {
  const p = new URLSearchParams(location.search);
  const pick = (k: string) => p.get(k)?.slice(0, 120) || undefined;
  const a: Attribution = {
    source: pick('utm_source'),
    medium: pick('utm_medium'),
    campaign: pick('utm_campaign'),
    content: pick('utm_content'),
    term: pick('utm_term'),
    fbclid: pick('fbclid'),
    landing: location.pathname,
    at: Date.now(),
  };
  if (!a.source && !a.campaign && !a.fbclid) return;
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(a));
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Letra de la etapa según la campaña: T, M, B, A (otro anuncio de Meta) o W (web sin anuncio). */
function stageLetter(a: Attribution | null) {
  const c = (a?.campaign ?? '').toUpperCase();
  if (c.includes('TOFU')) return 'T';
  if (c.includes('MOFU')) return 'M';
  if (c.includes('BOFU')) return 'B';
  const s = (a?.source ?? '').toLowerCase();
  if (a?.fbclid || ['facebook', 'instagram', 'meta', 'fb', 'ig'].includes(s)) return 'A';
  return 'W';
}

/** Código de pedido corto y fácil de dictar (sin 0/O ni 1/I/L). */
export function newRef() {
  const abc = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const tail = Array.from(bytes, (b) => abc[b % abc.length]).join('');
  return `EVH-${stageLetter(attribution())}${tail}`;
}

/** Parámetros de atribución para sumar a los eventos (aparecen en «Probar eventos» y en los informes). */
export function attributionParams() {
  const a = attribution();
  if (!a) return {};
  const out: Record<string, string> = {};
  if (a.campaign) out.utm_campaign = a.campaign;
  if (a.content) out.utm_content = a.content;
  if (a.source) out.utm_source = a.source;
  return out;
}
