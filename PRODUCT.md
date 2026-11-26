# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro con salida 100% estática (sin servidor ni runtime de backend). El usuario pidió "la tecnología más acorde y más segura en términos de vulnerabilidad y velocidad". Estático = sin superficie de ataque en servidor; Astro envía cero JS por defecto (solo pequeñas islas en TypeScript vanilla para carrito/selector), optimiza imágenes (AVIF/WebP responsivas) y autohospeda fuentes. Deploy sugerido: cualquier CDN estático (Vercel, Netlify, Cloudflare Pages) con headers de seguridad (CSP estricta).

## Users

Mujeres profesionales de la salud en Argentina (médicas, residentes, enfermeras, especialistas) que usan ambo a diario y quieren que su uniforme sea elegante, no genérico. Compran desde el celular (Instagram → web), muchas veces en grupo con compañeras del mismo servicio o residencia.

## Product Purpose

Tienda online de Evhtian: vender ambos médicos de mujer y llevar a la visitante a iniciar el pedido. Éxito = pedido enviado por WhatsApp (o contacto por Instagram) con modelo, color, talle y cantidad ya definidos.

## Positioning

Ambo médico pensado como prenda de diseño, exclusivamente para mujer, con identidad de marca de lujo (caduceo dorado). No compite por catálogo amplio: dos modelos, cinco colores, curados.

## Operating Context

- Catálogo: 2 modelos de ambo (conjunto chaqueta + pantalón), cada uno en 5 colores: bordó, rosa, negro, azul marino, verde militar. Talles: XS, S, M, L (el Terra viene en S, M y L).
- **Essential** (confirmado): chaqueta cuello V y bolsillos frontales amplios, uno de ellos doble (un bolsillo más chico sobre el grande, confirmado 2026-11-26); pantalón de cintura elastizada (negra en la foto de referencia), corte recto, bolsillos laterales tradicionales y bolsillo tipo cargo. Talles XS a L, con tabla de medidas.
- **Terra** (confirmado 2026-11-26): chaqueta cuello V con bolsillo frontal en el pecho izquierdo y bolsillos laterales; pantalón de cintura elastizada con cordón, doble bolsillo cargo y bolsillos laterales. Tabla de medidas en S, M y L (sin XS en la tabla del usuario; el sitio ofrece Terra en S a L).
- Calce (confirmado 2026-11-26): el Essential es más entallado; el Terra, más dinámico. Las tablas publicadas amplían cada talle (mínimo −5 cm, máximo +10 cm) por la elasticidad de la bengalina, y la guía aclara que es un estimado y remite a la política de cambios.
- Tela (ambos modelos, confirmada): bengalina elastizada (lisa) de rayón, nylon 28% y spandex 4%. Tacto suave, calce firme, se adapta al cuerpo sin perder la forma, resistente; estructura + confort. El sitio la nombra «bengalina» (término conocido y buscado en Argentina); no se menciona al proveedor.
- Dominio: evhtian.com.ar (visto en el material del usuario).
- Precio: $65.000 ARS cada ambo (actualizado por el usuario el 2026-11-26; antes $60.000). Precio de lista $130.000.
- Medios de pago (actualizado 2026-11-26): transferencia bancaria y Mercado Pago. Efectivo al recibir solo para entregas en la zona de Tigre, Buenos Aires. Cuotas: 3 cuotas de $25.000 por ambo con tarjeta de débito a través de GOcuotas (total en cuotas $75.000, más que el contado: el sitio siempre muestra el total). **No** hay cuotas sin interés.
- Promo grupal: 30% off comprando junto con compañeras/os. **Asumido (sin confirmar):** se activa desde 4 ambos, lectura literal de "más de 3 prendas". Debe ser un único valor configurable.
- Contacto: WhatsApp e Instagram. Número y usuario: **pendientes** (placeholders configurables).
- Pedido: sin backend; el carrito arma el mensaje de pedido y lo abre en WhatsApp (decisión de implementación delegada).

## Capabilities and Constraints

- Sin checkout con pasarela ni base de datos: el cierre de venta ocurre por WhatsApp.
- El probador virtual con foto se probó y el usuario lo descartó (2026-11-18): no volver a proponerlo sin que lo pida. Los recortes generados quedaron en `brand/generadas/probador/`.
- No se pide la altura ni datos corporales en un formulario (el usuario lo quitó). La consulta de talle va por WhatsApp; la tabla de medidas aparece sola si se cargan medidas.
- Zona de envío: **no definida**; no afirmar cobertura nacional hasta confirmarlo.

## Brand Commitments

- Nombre: Evhtian. Logo: caduceo alado dorado con wordmark "EVHTIAN" en serif espaciado, sobre negro (archivo original del usuario).
- Paleta acorde al logo: dorados (del champagne claro al bronce) sobre negro profundo. Vinculante por pedido del usuario.
- Voz: español rioplatense (voseo), elegante, profesional, muy persuasiva, orientada a la compra.
- Mensajes clave del copy (2026-11-18): «Elegancia que dura toda la guardia», diseño exclusivo para mujer (moldería, no unisex), bengalina que se mueve con vos, ahorro del 30% en equipo. Tono seguro y cálido, pocas exclamaciones, sin urgencia falsa ni promesas no confirmadas. CTAs en primera persona («Elegir mi ambo», «Conocer el modelo»).
- Preferencia del usuario: el estándar de la categoría (tienda premium de ambos convencional) ejecutado impecable, no un mundo visual experimental. Vara de calidad: FIGS y Jaanuu.
- Fondo claro (blanco/marfil) con negro y dorado, elegido por el usuario por sobre el fondo negro del logo.
- Tipografía: sans geométrica tipo Montserrat/Poppins (el usuario rechazó la serif de alto contraste por fina y confusa, en especial en números). Números siempre nítidos y de un solo color.

## Evidence on Hand

- Logo: `brand/evhtian-logo-original.png` (raster 1334×1188, fondo #111).
- Fotos de referencia de los modelos (con textos sobreimpresos, no aptas tal cual para la web): `brand/referencias/essential.jpg`, `brand/referencias/terra.webp` (captura de Instagram, color terracota).
- Fotos de producto generadas con IA (Higgsfield, GPT Image 2.6) a partir de las referencias, por pedido del usuario (2026-11-18): 5 colores por modelo, 2 detalles por modelo y una foto grupal, en `src/assets/products/` (originales en `brand/generadas/`, prompts en `brand/referencias/prompts-fotos.md`). Representan el diseño; conviene validarlas contra las prendas reales.
- No hay testimonios, reseñas, prensa ni cifras de ventas. No fabricarlos.

## Product Principles

1. El ambo se presenta como prenda de diseño, nunca como insumo hospitalario.
2. Cada paso empuja a decidir: modelo → color → talle → pedido, con el menor roce posible.
3. La compra grupal es una palanca central, no una nota al pie.
4. Cero promesas que la marca no confirmó (telas, envíos, reseñas).
5. Rápido y liviano en celular: la mayoría llega desde Instagram con datos móviles.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste suficiente del dorado sobre negro en texto chico, foco visible, navegación por teclado, `prefers-reduced-motion` respetado en todas las animaciones.
