/**
 * Datos del negocio. Todo lo que cambie (precio, promo, contacto) se edita acá.
 * Los campos marcados con TODO son provisorios y deben confirmarse antes de publicar.
 */
export const formatARS = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

/**
 * Cuotas con tarjeta de débito a través de GOcuotas: monto fijo por ambo.
 * Ojo: el total en cuotas (3 × $25.000 = $75.000) es mayor al precio de contado, y el sitio siempre lo muestra.
 */
export const installments = { provider: 'GOcuotas', count: 3, amount: 25000 } as const;
/** Total que se paga por ambo en cuotas. */
export const installmentsTotal = installments.count * installments.amount;
/** «3 cuotas de $25.000», para usar en frases. */
export const installmentsPhrase = `${installments.count} cuotas de ${formatARS(installments.amount)}`;

export const site = {
  name: 'Evhtian',
  tagline: 'Ambos médicos para mujer',
  /** Título de la página de inicio en Google y al compartir (ideal: menos de 60 caracteres). */
  homeTitle: 'Ambos médicos para mujer en bengalina elastizada | Evhtian',
  /** Descripción de la página de inicio en Google y al compartir (ideal: menos de 155 caracteres, se completa con el precio). */
  description:
    'Ambos médicos para mujer en bengalina elastizada, con moldería exclusiva. Essential y Terra en 5 colores, talles XS a L, a {precio}. Envíos a todo el país.',

  /** Precio de cada ambo (chaqueta + pantalón), en pesos argentinos. */
  price: 65000,
  /** Precio de lista (sin descuento), se muestra tachado junto al precio. */
  listPrice: 130000,
  /** Promo vigente sobre el precio de lista. */
  sale: {
    name: 'Black Friday y Cyber Monday',
    /** El nombre dentro de una frase: «Ahorrás con {phrase}», «a $65.000 con {phrase}». */
    phrase: 'la promo de Black Friday y Cyber Monday',
    /** Hasta cuándo dura, tal como se lee en la web. */
    until: '30 de noviembre',
    /** La misma fecha en formato AAAA-MM-DD: Google y Meta la leen como vencimiento del precio. Actualizar junto con `until`. */
    endsOn: '2026-11-30',
  },

  /**
   * Meta (Facebook / Instagram Ads).
   * - pixelId: el ID numérico del Pixel (Administrador de eventos → Orígenes de datos). Vacío = el Pixel no se carga.
   * - domainVerification: el código de verificación del dominio (Configuración del negocio → Seguridad de la marca →
   *   Dominios → «Etiqueta meta»), solo el valor de content. Vacío = no se agrega la etiqueta.
   */
  meta: {
    pixelId: '1171033125432619',
    domainVerification: '',
  },

  contact: {
    /**
     * Número de WhatsApp en formato internacional, solo dígitos. Celulares de Argentina llevan el 9 después del 54
     * (+54 11 6043-3866 → 5491160433866), si no wa.me no encuentra el número.
     */
    whatsapp: '5491160433866',
  },

  payments: [
    { id: 'transferencia', label: 'Transferencia bancaria', short: 'Transferencia', icon: 'bank', detail: 'Te pasamos los datos apenas confirmás tu pedido y listo.' },
    { id: 'mercadopago', label: 'Mercado Pago', short: 'Mercado Pago', icon: 'wallet', detail: 'Te mandamos el link y pagás en segundos, con el medio que prefieras.' },
    {
      id: 'efectivo',
      label: 'Efectivo al recibir',
      short: 'Efectivo (solo Tigre)',
      icon: 'cash',
      detail: 'Pagás cuando tenés tu ambo en las manos. Exclusivo para entregas en la zona de Tigre, Buenos Aires.',
    },
    {
      id: 'gocuotas',
      label: `${installments.count} cuotas con débito (${installments.provider})`,
      short: `${installments.count} cuotas con débito`,
      icon: 'card',
      detail: `Pagás en ${installmentsPhrase} con tu tarjeta de débito, a través de ${installments.provider}. Total en cuotas: ${formatARS(installmentsTotal)} por ambo.`,
    },
  ],
} as const;

/** Descuento de la promo vigente sobre el precio de lista, redondeado hacia abajo para no exagerar (130.000 → 65.000 = 50%). */
export const saleOff = Math.floor((1 - site.price / site.listPrice) * 100);
/** Cuánto se ahorra por ambo con la promo vigente. */
export const saleSaving = site.listPrice - site.price;

export type PaymentId = (typeof site.payments)[number]['id'];

/** Zona donde se acepta efectivo al recibir. */
export const cashZone = 'Tigre, Buenos Aires';

/** Descripción del inicio con el precio vigente. */
export const homeDescription = site.description.replace('{precio}', formatARS(site.price));

export const whatsappHref = (text: string) => {
  const base = site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
};
