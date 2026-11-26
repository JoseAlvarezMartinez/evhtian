/**
 * Datos del negocio. Todo lo que cambie (precio, promo, contacto) se edita acá.
 * Los campos marcados con TODO son provisorios y deben confirmarse antes de publicar.
 */
export const site = {
  name: 'Evhtian',
  tagline: 'Ambos médicos para mujer',
  description:
    'Ambos médicos para mujer en bengalina elastizada: elegantes, cómodos e impecables toda la guardia. Essential y Terra en cinco colores, talles XS a L.',

  /** Precio de cada ambo (chaqueta + pantalón), en pesos argentinos. */
  price: 60000,
  /** Precio de lista (sin descuento), se muestra tachado junto al precio. */
  listPrice: 130000,
  /** Promo vigente sobre el precio de lista. */
  sale: {
    name: 'Promo de fin de año',
    /** Hasta cuándo dura, tal como se lee en la web. */
    until: '31 de diciembre',
  },

  contact: {
    /**
     * Número de WhatsApp en formato internacional, solo dígitos (ej: 5491123456789).
     * TODO: completar. Vacío = WhatsApp abre con el mensaje listo para elegir el contacto.
     */
    whatsapp: '',
    /** Usuario de Instagram sin @. TODO: confirmar. */
    instagram: 'evhtian',
  },

  payments: [
    { id: 'transferencia', label: 'Transferencia bancaria', short: 'Transferencia', icon: 'bank', detail: 'Te enviamos los datos apenas confirmás tu pedido.' },
    { id: 'mercadopago', label: 'Mercado Pago', short: 'Mercado Pago', icon: 'wallet', detail: 'Te mandamos el link de pago y abonás en segundos.' },
    {
      id: 'efectivo',
      label: 'Efectivo al recibir',
      short: 'Efectivo (solo Tigre)',
      icon: 'cash',
      detail: 'Pagás cuando tenés tu ambo en las manos. Exclusivo para entregas en la zona de Tigre, Buenos Aires.',
    },
  ],
} as const;

/** Descuento de la promo vigente sobre el precio de lista, redondeado hacia abajo para no exagerar (130.000 → 60.000 = 53%). */
export const saleOff = Math.floor((1 - site.price / site.listPrice) * 100);
/** Cuánto se ahorra por ambo con la promo vigente. */
export const saleSaving = site.listPrice - site.price;

export type PaymentId = (typeof site.payments)[number]['id'];

/** Zona donde se acepta efectivo al recibir. */
export const cashZone = 'Tigre, Buenos Aires';

export const formatARS = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

export const whatsappHref = (text: string) => {
  const base = site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
};

export const instagramHref = `https://www.instagram.com/${site.contact.instagram}/`;
