/**
 * Envíos y política de cambios. Todo valor comercial se edita acá.
 * El costo del envío se cotiza por WhatsApp (decisión de la dueña, 2026-11-26). Referencia: tarifas del
 * cotizador público de andreani.com con origen en Tigre, relevadas el 26/11/2026 para 1 ambo
 * (30×25×5 cm, 600 g, seguro incluido): Tigre «Llega hoy» $14.742; CABA/GBA $12.706 domicilio y $9.103
 * sucursal; interior de Bs. As. y Centro $14.253 / $11.813; Cuyo, NOA, NEA, Neuquén y Río Negro $15.504 /
 * $12.804; Salta, Jujuy y Patagonia sur $16.328 / $14.099.
 */
import { whatsappHref } from './site';

/** Días hábiles que tardamos en despachar fuera de Tigre desde que se confirma el pago. TODO: confirmar. */
export const dispatchDays = 2;

/** Partido de Tigre: entrega en mano en el día (y efectivo al recibir). */
export const tigre = {
  zone: 'Tigre',
  /** Pedidos confirmados antes de esta hora (días hábiles) llegan el mismo día. */
  sameDayCutoff: 12,
};

/** Política de cambios: solo cambios, sin reembolsos (decisión de la dueña, 2026-11-26). */
export const returnsPolicy = {
  /** Cambio de talle, color o modelo, en días corridos desde que se recibe. */
  exchangeDays: 7,
};

/**
 * Botón de arrepentimiento (Res. 424/2020): la ley lo exige a toda tienda online, por eso queda en el pie
 * de página aunque la política de la tienda sea sin reembolsos. Abre WhatsApp con la solicitud lista.
 */
export const regretHref = whatsappHref(
  '¡Hola Evhtian! Quiero ejercer mi derecho de arrepentimiento y cancelar mi compra.\nNombre: \nFecha en que recibí el pedido: \nAmbos del pedido: ',
);
