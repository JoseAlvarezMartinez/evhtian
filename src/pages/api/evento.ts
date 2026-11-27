/**
 * API de Conversiones de Meta (CAPI).
 *
 * El navegador manda acá una copia de cada evento del Pixel (mismo nombre y mismo event_id) y esta función
 * la reenvía a Meta desde el servidor, con la IP y el navegador de la visita. Meta junta las dos copias por
 * event_id y cuenta el evento una sola vez; si el Pixel estaba bloqueado, llega igual por acá.
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 * - META_CAPI_TOKEN (obligatoria): token de acceso de la API de Conversiones del Pixel. Sin token no se manda nada.
 * - META_TEST_EVENT_CODE (opcional): código de «Probar eventos» (TEST12345) para ver los eventos del servidor
 *   en esa pestaña. Borrarla cuando termine la prueba.
 */
import type { APIRoute } from 'astro';
import { site } from '../../config/site';

export const prerender = false;

/** Versión de la Graph API de Meta. Cada versión dura unos dos años; actualizar cuando Meta avise. */
const GRAPH_VERSION = 'v24.0';

const EVENTS = new Set(['PageView', 'ViewContent', 'CustomizeProduct', 'AddToCart', 'InitiateCheckout', 'Lead', 'Contact', 'SizeGuideView']);
const TEXT_KEYS = ['content_name', 'content_type', 'model', 'color', 'size', 'order_ref', 'changed', 'contact_reason', 'payment', 'utm_campaign', 'utm_content', 'utm_source'];

const str = (v: unknown, max = 120) => (typeof v === 'string' && v.length ? v.slice(0, max) : undefined);
const hostOf = (u: string) => {
  try {
    return new URL(u).host;
  } catch {
    return null;
  }
};
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v < 1e9 ? v : undefined);

/** Solo pasan los parámetros conocidos, con tipos y largos acotados. */
function customData(raw: unknown) {
  const p = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of TEXT_KEYS) {
    const v = str(p[k]);
    if (v) out[k] = v;
  }
  const value = num(p.value);
  if (value !== undefined) out.value = value;
  if (p.currency === 'ARS') out.currency = 'ARS';
  const items = num(p.num_items);
  if (items !== undefined) out.num_items = Math.round(items);
  if (Array.isArray(p.content_ids)) out.content_ids = p.content_ids.map((x) => str(x, 40)).filter(Boolean).slice(0, 20);
  if (Array.isArray(p.contents)) {
    out.contents = p.contents.slice(0, 20).flatMap((c) => {
      const o = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
      const id = str(o.id, 40);
      if (!id) return [];
      return [{ id, quantity: Math.round(num(o.quantity) ?? 1), item_price: num(o.item_price), size: str(o.size, 4) }];
    });
  }
  return out;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = site.meta.pixelId;
  if (!token || !pixel) return new Response(null, { status: 204 });

  // Solo se aceptan eventos que vienen del propio sitio.
  const host = new URL(request.url).host;
  const origin = request.headers.get('origin');
  if (origin && hostOf(origin) !== host) return new Response(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 8000) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  const name = str(body.event_name, 40);
  const id = str(body.event_id, 80);
  const url = str(body.event_source_url, 500);
  if (!name || !EVENTS.has(name) || !id || !url || hostOf(url) !== host) return new Response(null, { status: 400 });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || clientAddress;
  const userData: Record<string, string> = {};
  if (ip) userData.client_ip_address = ip;
  const ua = request.headers.get('user-agent');
  if (ua) userData.client_user_agent = ua.slice(0, 500);
  const fbp = str(body.fbp, 200);
  if (fbp && /^fb\.\d\.\d+\.\d+$/.test(fbp)) userData.fbp = fbp;
  const fbc = str(body.fbc, 500);
  if (fbc && /^fb\.\d\.\d+\.\S+$/.test(fbc)) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: id,
        event_source_url: url,
        action_source: 'website',
        user_data: userData,
        custom_data: customData(body.custom_data),
      },
    ],
  };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) console.error('CAPI', name, res.status, (await res.text()).slice(0, 300));
  } catch (err) {
    console.error('CAPI', name, String(err));
  }
  // La respuesta al navegador es siempre vacía: el resultado se ve en los logs de Vercel y en Meta.
  return new Response(null, { status: 204 });
};
