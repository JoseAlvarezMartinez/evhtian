/**
 * Preguntas frecuentes: se muestran en el inicio (Faq.astro) y se publican como datos estructurados (FAQPage)
 * para Google y los buscadores con IA.
 */
import { site, formatARS, cashZone, installments, installmentsPhrase, installmentsTotal } from '../config/site';
import { returnsPolicy, tigre } from '../config/shipping';

export const faqs = [
  {
    q: '¿Cómo hago mi pedido?',
    a: 'Elegís modelo, color y talle, lo sumás a tu pedido y tocás «Enviar pedido por WhatsApp». Nos llega con todo el detalle y te respondemos personalmente para confirmar el envío y el pago. Sin registrarte y en menos de un minuto.',
  },
  {
    q: '¿El ambo incluye chaqueta y pantalón?',
    a: `Sí. Cada ambo es el conjunto completo, chaqueta y pantalón, a ${formatARS(site.price)} con ${site.sale.phrase} (precio de lista ${formatARS(site.listPrice)}). Elegís el modelo, el color y el talle que quieras.`,
  },
  {
    q: '¿Hasta cuándo dura la promo?',
    a: `Hasta el ${site.sale.until}. Hasta esa fecha te llevás cada ambo a ${formatARS(site.price)} y ahorrás ${formatARS(site.listPrice - site.price)} por conjunto.`,
  },
  {
    q: '¿Cómo sé qué talle elegir?',
    a: `Escribinos por WhatsApp contándonos el talle que usás habitualmente y te recomendamos el ideal, para que aciertes desde el primer pedido. Y si igual no te queda perfecto, tenés ${returnsPolicy.exchangeDays} días para cambiarlo.`,
  },
  {
    q: '¿Puedo cambiar el talle si no me queda?',
    a: `Sí. Tenés ${returnsPolicy.exchangeDays} días corridos desde que lo recibís para cambiarlo por otro talle, color o modelo, con la prenda sin uso, sin lavar y con su etiqueta. No hacemos reembolsos: como la bengalina elastizada se amolda al cuerpo con el uso, por higiene solo hacemos cambios.`,
  },
  {
    q: '¿Cómo me llega el pedido?',
    a: `En ${tigre.zone} te lo llevamos en mano, coordinando el día y el horario por WhatsApp, y podés pagar en efectivo al recibirlo. Al resto del país lo enviamos por Andreani, a tu domicilio o a la sucursal que elijas, con número de seguimiento: Andreani entrega en 2 a 3 días hábiles, algo más a las provincias más lejanas. El costo del envío te lo cotizamos por WhatsApp antes de que pagues.`,
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: `Transferencia bancaria y Mercado Pago. También podés pagar en ${installmentsPhrase} con tu tarjeta de débito, a través de ${installments.provider} (total en cuotas: ${formatARS(installmentsTotal)} por ambo). Si tu entrega es en la zona de ${cashZone}, además podés pagar en efectivo cuando recibís tu ambo.`,
  },
  {
    q: '¿De qué tela son los ambos?',
    a: 'De bengalina elastizada: rayón, nylon y spandex. El rayón le da suavidad al tacto, el 28% de nylon resistencia y durabilidad, y el 4% de spandex la elasticidad justa para un calce firme que se adapta a tu cuerpo sin perder la forma. Essential y Terra comparten la misma tela.',
  },
];
