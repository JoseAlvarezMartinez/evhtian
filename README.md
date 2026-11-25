# Evhtian · Tienda online

Sitio estático de Evhtian, ambos médicos para mujer. Hecho con [Astro](https://astro.build) con salida 100% estática: no hay servidor ni base de datos que atacar, la página envía un solo archivo JavaScript chico y las fuentes se sirven desde el propio sitio.

## Cómo funciona la compra

1. La clienta elige modelo, color y talle y lo agrega al carrito. El carrito queda guardado en su navegador.
2. El carrito calcula solo la promo de equipo (30% off desde 4 ambos). Medios de pago: transferencia, Mercado Pago y efectivo al recibir solo en Tigre (Buenos Aires).
3. Al tocar «Enviar pedido por WhatsApp» se abre WhatsApp con el pedido completo ya escrito: ambos, total, forma de pago, nombre y localidad.

## Páginas

- `/`: presentación de la marca, los dos modelos (tarjetas que llevan a su página), colores, promo de equipo con calculadora, pagos, asesor de talle y preguntas frecuentes.
- `/ambos/essential/` y `/ambos/terra/`: página de cada modelo con galería, selector de color y talle, carrito, detalle de chaqueta y pantalón y la sección de la tela. Aceptan `?color=bordo&talle=S` para abrir con una opción ya elegida.

## La tela

Sección `#tela` (inicio y páginas de modelo): bengalina elastizada contada con cuatro situaciones de la jornada (agacharse, estirarse, la textura y el final de la guardia). Los textos están en `fabric` dentro de `src/data/catalog.ts` y las fotos (generadas con IA) en `src/assets/fabric/`.

> **Al reemplazar una foto**, conviene guardarla con un nombre nuevo y actualizar el nombre en `catalog.ts` (campo `image`). Si se pisa el archivo con el mismo nombre, el servidor de desarrollo y el navegador pueden seguir mostrando la versión vieja guardada en caché. En el sitio publicado no pasa, porque cada compilación genera nombres nuevos.

## Uso local

Requiere Node 22.12 o superior.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

`dev` sirve el sitio en http://localhost:4321 con recarga automática. `build` genera la versión final en `dist/` y `preview` la sirve tal cual se publicará.

## Qué editar antes de publicar

Todo lo que cambia está en dos archivos:

| Archivo | Qué tiene |
|---|---|
| `src/config/site.ts` | Precio, promo (mínimo de ambos y %), **número de WhatsApp**, **usuario de Instagram**, medios de pago y zona de efectivo (`cashZone`) |
| `src/data/catalog.ts` | Modelos Essential y Terra (descripción y características), tela (bengalina), colores, talles y tabla de medidas |

Pendientes marcados con `TODO` en el código:

- [ ] **Número de WhatsApp** (`site.ts` → `contact.whatsapp`, solo dígitos, ej: `5491123456789`). Mientras esté vacío, WhatsApp se abre con el mensaje listo para elegir el contacto.
- [ ] **Usuario de Instagram** (`contact.instagram`; hoy dice `evhtian`).
- [ ] **Promo**: confirmar si arranca en 3 o en 4 ambos (`promo.minItems`; hoy 4).
- [ ] **Tabla de medidas** (opcional): si completás `sizeChart` en `catalog.ts`, aparece sola una sección de talles con la tabla y el link «Guía de talles» en cada modelo. Mientras tanto, la consulta de talle va por WhatsApp.
- [ ] **Fotos de producto**: mientras no haya fotos, el sitio muestra ilustraciones dibujadas a partir de las fotos de referencia. Para pasar a fotos, copiá los archivos en `src/assets/products/` con los nombres que indica `src/assets/products/LEEME.md` (por ejemplo `essential-bordo.jpg`). Cada modelo pasa a fotos solo cuando tiene sus 5 colores. Se optimizan solas al compilar (AVIF/WebP en varios tamaños) y también se usan como miniaturas en el carrito.
- El dominio por defecto es `https://evhtian.com.ar`. Si publicás en otro, definí `SITE_URL`.

## Publicar

Cualquier hosting estático sirve. Recomendado: Vercel, Netlify o Cloudflare Pages.

- Comando de build: `npm run build`
- Carpeta a publicar: `dist`
- Variable de entorno (opcional): `SITE_URL`, por defecto `https://evhtian.com.ar`

Los encabezados de seguridad ya vienen configurados en `vercel.json` (Vercel) y `public/_headers` (Netlify / Cloudflare).

## Seguridad y rendimiento

- **Content-Security-Policy estricta** generada por Astro en cada página: solo se ejecutan los scripts propios (con hash), sin scripts ni estilos externos.
- Encabezados: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, HSTS, `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
- Sin servicios de terceros, cookies ni rastreadores. Los datos del pedido solo viajan dentro del mensaje de WhatsApp que envía la clienta.
- Los textos se insertan con `textContent` (nunca `innerHTML` con datos), así no hay riesgo de inyección.
- Dependencias con versión fija (`.npmrc` → `save-exact`). `npm audit` reporta un aviso de `picomatch` que solo se usa al compilar. No llega al sitio publicado y todavía no tiene versión corregida.
- Tipografía Montserrat autohospedada (woff2 variable, `font-display: swap`); logo como máscaras WebP de 17 KB y 5 KB. Página principal: unos 14 KB comprimida.

## Marca

- `brand/evhtian-logo-original.png`: logo original.
- `node scripts/brand-assets.mjs`: regenera desde el original las máscaras del logo, los íconos, el favicon y la imagen para redes (`public/og.png`).
