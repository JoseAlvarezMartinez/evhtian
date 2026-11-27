# EVHTIAN · Plan de Meta Ads

Estado: **Fase 0 (tracking + CAPI) implementada en el código, falta el token, el deploy y la verificación en «Probar eventos».**
Última actualización: 2026-11-27.

| Fase | Estado |
|---|---|
| 0 · Auditoría y tracking | Pixel + CAPI listos y probados en local. Falta: token de CAPI, deploy y prueba en «Probar eventos» |
| 1 · Estrategia del embudo | Pendiente (espera la confirmación de la Fase 0) |
| 2 · Creativos (Nano Banana Pro) | Pendiente. Nano Banana Pro está disponible en 4K y 4:5 |
| 3 · Creación en Meta Ads (en pausa) | Pendiente. Meta Ads todavía no está conectado |

---

## Fase 0 · Tracking

### Auditoría del Pixel (antes de los cambios)

- Pixel `1171033125432619`, cargado desde `src/scripts/pixel.ts` sin scripts en línea (la CSP queda estricta).
- El sitio es multipágina (sin View Transitions ni `<ClientRouter>`): cada página carga completa y dispara su
  `PageView`. No hace falta manejar la navegación del lado del cliente.
- Ya existían `ViewContent` (ficha del modelo), `AddToCart`, `InitiateCheckout` (envío del pedido por
  WhatsApp) y `Contact` (otros links de WhatsApp), pero **sin `event_id`**, sin talle ni color en los
  parámetros, sin código de referencia en el mensaje y sin datos de la campaña de origen.
- Faltaban `CustomizeProduct`, la conversión principal (`Lead`) y un evento de la guía de talles.

### Eventos implementados

Código: `src/scripts/tracking.ts` (helpers y atribución) y `src/scripts/main.ts` (disparos).
Todos los eventos llevan `event_id` (`eventID`), listo para deduplicar con la API de Conversiones.

| Evento | Tipo | Cuándo se dispara | Parámetros |
|---|---|---|---|
| `PageView` | estándar | Cada página | — |
| `ViewContent` | estándar | Abrir la ficha de un modelo (`/ambos/essential/`, `/ambos/terra/`) | `content_ids` (SKU `modelo-color`), `content_name`, `model`, `color`, `value: 65000`, `currency: ARS` |
| `CustomizeProduct` | estándar | Elegir un color o un talle en el formulario de compra | ídem + `size`, `changed` (`color`/`size`) |
| `SizeGuideView` | **custom** | Abrir la guía de talles | `model`, `content_name` |
| `AddToCart` | estándar | «Agregar al carrito» | `contents` (con `item_price`), `model`, `color`, `size`, `value` |
| `InitiateCheckout` | estándar | Enviar el pedido por WhatsApp desde el carrito | ver `Lead`; `event_id` = `<código>-ic` |
| **`Lead`** | estándar | Enviar el pedido por WhatsApp desde el carrito. **Conversión principal del sitio** | `contents` (id, cantidad, precio, talle), `model`, `color`, `size`, `num_items`, `order_ref`, `payment`, `value`, `currency`, `utm_*`; `event_id` = código de pedido |
| `Contact` | estándar | Cualquier otro link de WhatsApp (consulta general, talles, envíos, cambios, botón flotante) | `contact_reason`, `order_ref`, `model` (si está en una ficha), `utm_*`; `event_id` = código |

Por qué `Lead` y no `Purchase` en la web: la venta no ocurre en el sitio. `Lead` = «mandó su pedido armado
por WhatsApp», que es lo más cerca de una compra que el sitio puede ver. La compra real se carga aparte
(ver «Ventas cerradas por WhatsApp»).

### Código de pedido en WhatsApp (atribución)

Cada mensaje de WhatsApp que sale del sitio termina con un código, por ejemplo:

```
• 1 × Ambo Essential · Azul marino · Talle M
...
Código de pedido: EVH-B832V
```

- La letra después de `EVH-` dice de dónde vino la clienta (último clic, válido 28 días):
  **T** = campaña TOFU · **M** = MOFU · **B** = BOFU · **A** = otro anuncio de Meta · **W** = web sin anuncio.
- Se calcula a partir de `utm_campaign` (por eso las campañas se van a llamar `EVH_TOFU_…`, `EVH_MOFU_…`,
  `EVH_BOFU_…`) o de `fbclid`.
- El mismo código es el `event_id` del `Lead`/`Contact`, así una venta se puede cruzar con el clic.
- Las consultas sueltas (botón flotante, talles, etc.) llevan `Código: EVH-XXXXX` al final.

**Qué tiene que hacer la persona que atiende WhatsApp:** anotar el código cuando se cierra la venta (ver abajo).

### Cómo probarlo (Probar eventos)

1. Publicar los cambios (push a `main` → Vercel despliega).
2. Administrador de eventos → Pixel `1171033125432619` → pestaña **Probar eventos** → pegar
   `https://evhtian.com.ar/ambos/essential/?utm_campaign=EVH_BOFU_prueba&utm_source=facebook` → «Abrir sitio web».
3. En la ventana que se abre: elegir un color, un talle, abrir «Guía de talles», agregar al carrito,
   «Enviar pedido por WhatsApp» y tocar el botón flotante de WhatsApp.
4. Deberían aparecer, en este orden: `PageView`, `ViewContent`, `CustomizeProduct` ×2, `SizeGuideView`,
   `AddToCart`, `InitiateCheckout`, `Lead`, `Contact`. En `Lead`, el mensaje de WhatsApp tiene que mostrar
   un código que empieza con `EVH-B`.
5. Borrar después el pedido de prueba del chat de WhatsApp.

**Resultado de la prueba en local (2026-11-27):** con una visita simulada desde
`utm_campaign=EVH_BOFU_Test` se registraron los 7 eventos de interacción con los parámetros de arriba;
el pedido salió con `Código de pedido: EVH-B832V` y la consulta suelta con `Código: EVH-BFE4R`.
Las llamadas se capturaron en el navegador sin enviarlas a Meta, para no ensuciar el Pixel con tráfico
de localhost. **Pendiente: la prueba real en «Probar eventos» después del deploy.**

### API de Conversiones (CAPI): implementada (opción A, aprobada el 2026-11-27)

Para qué sirve: los eventos llegan aunque la clienta tenga un bloqueador o iOS limite el Pixel, y Meta
reconoce mejor a quién mostrarle los anuncios (mejor «calidad de coincidencia»).

Cómo funciona:
- Se sumó el adapter oficial `@astrojs/vercel` (11.0.22). **Todas las páginas siguen siendo estáticas**; la
  única parte que corre en un servidor es `src/pages/api/evento.ts` (función de Vercel, Node 24, máx. 10 s).
- Cada evento del Pixel (`PageView`, `ViewContent`, `CustomizeProduct`, `SizeGuideView`, `AddToCart`,
  `InitiateCheckout`, `Lead`, `Contact`) manda además una copia a `/api/evento/` con el **mismo `event_id`**
  (`navigator.sendBeacon`, sigue aunque la clienta se vaya a WhatsApp). Meta junta las dos copias y cuenta una sola.
- El servidor le suma la IP y el navegador de la visita, y las cookies `_fbp`/`_fbc` del Pixel (si `_fbc`
  todavía no existe, se arma con el `fbclid` del anuncio). Se manda con `action_source: website` a la
  Graph API `v24.0`.
- Seguridad: solo acepta pedidos del propio dominio, solo los 8 eventos de la lista, solo parámetros
  conocidos con largo acotado y cuerpos de hasta 8 KB. El token nunca llega al navegador.
- Sin `META_CAPI_TOKEN` el endpoint responde 204 y no manda nada: se puede publicar antes de tener el token.

Probado en local (2026-11-27): con la función compilada y la llamada a Meta simulada, el `Lead` salió con
IP, navegador, `fbp`, `fbc`, valor, SKU, talle y código de pedido; se rechazaron otro origen (403), un
evento fuera de la lista, una URL de otro sitio y JSON roto (400). En el navegador, la ficha de Terra mandó
las copias de `PageView`, `ViewContent` y `CustomizeProduct` sin errores de consola ni de CSP.

**Lo que tenés que hacer vos** (es una credencial: no la puedo cargar yo):
1. Administrador de eventos → Pixel `1171033125432619` → **Configuración** → sección **API de conversiones**
   → «Configurar integración directa» / **Generar token de acceso**. Copiá el token.
2. Vercel → proyecto `evhtian` → **Settings → Environment Variables** → nueva variable
   `META_CAPI_TOKEN` = el token, entorno **Production** (y Preview si querés probar ahí). Guardar.
3. Para la prueba: en «Probar eventos» copiá el código de prueba (tipo `TEST12345`) y creá también
   `META_TEST_EVENT_CODE` con ese valor. **Borrala después de la prueba**, si no, los eventos del servidor
   quedan solo en la pestaña de prueba.
4. Volvé a desplegar (Deployments → ⋯ → Redeploy) para que la función lea las variables.

Cómo comprobarlo: en «Probar eventos» cada evento tiene que aparecer **una sola vez** con dos orígenes,
«Navegador» y «Servidor», y el aviso «Deduplicado». En Vercel → Logs, si algo falla aparece una línea
`CAPI <evento> <código de error>`.

Opciones descartadas: webhook de n8n (otro dominio que abrir en la CSP y depende de que n8n esté arriba) y
gateway administrado (Meta / Stape, ~USD 10–20/mes, no hace falta con este volumen).

Pendiente de revisar después del deploy: que los encabezados de seguridad de `vercel.json` (HSTS,
X-Frame-Options, etc.) se sigan aplicando ahora que el sitio usa el adapter.

### Ventas cerradas por WhatsApp → `Purchase` offline

Para que Meta aprenda de ventas reales (y no solo de clics), cada venta cerrada se carga como `Purchase`.
Propuesta en dos pasos:

1. **Desde hoy, sin infraestructura:** una planilla «Ventas» con estas columnas:

   | fecha | código | teléfono (con 54 9) | valor (ARS) | modelo | color | talle | provincia |
   |---|---|---|---|---|---|---|---|
   | 2026-12-03 14:20 | EVH-B832V | 5491112345678 | 65000 | essential | marino | M | Buenos Aires |

   Una vez por semana se exporta como CSV y se sube en Administrador de eventos → Pixel →
   «Agregar eventos» → **Importar eventos desde un archivo (CSV)**, con evento `Purchase`, moneda ARS y el
   teléfono como dato de coincidencia (Meta lo encripta antes de usarlo).
2. **Automatizado (siguiente paso, ya hay CAPI):** la misma planilla se procesa sola cada hora y manda
   `Purchase` por la API con `action_source: chat`, el teléfono encriptado (SHA-256) y el valor. Para sumar
   además los datos del clic (`fbp`, `fbc`) hay que guardar cada `Lead` con su código, lo que requiere un
   almacenamiento (planilla de Google vía n8n, o Upstash/Blob en Vercel). Se decide aparte.

---

## Fase 1 · Estrategia del embudo
Pendiente (la estructura se propone cuando se confirme la Fase 0).

### Presupuesto aprobado: $25.000 ARS por día (2026-11-27)

≈ $750.000 por mes, repartido entre las etapas en la propuesta de la Fase 1.

| Dato | Valor | Origen |
|---|---|---|
| Precio por ambo | $65.000 | dueña |
| Costo por ambo | $42.000 | dueña |
| Margen bruto | $23.000 (35%) | cálculo |
| Comisiones de cobro | ~5% (≈ $3.250) | **supuesto, a confirmar** |
| Margen antes de publicidad | ≈ $19.750 | cálculo |
| Costo por venta de equilibrio | ≈ $20.000 | cálculo |
| **Costo por venta objetivo** | **$10.000** | propuesta aprobada |
| Pedidos de WhatsApp que se cierran | 1 de cada 3 | **supuesto, se mide con los códigos EVH-** |
| Costo por `Lead` objetivo / máximo | ≈ $3.300 / ≈ $6.600 | cálculo |
| Ventas por mes para no perder / para el objetivo | ≈ 38 / ≈ 75 | cálculo |

Por qué $25.000: Meta necesita ~50 eventos de optimización por semana por conjunto de anuncios para salir del
aprendizaje; a $3.300 por `Lead` son ~$24.000 por día. Por debajo de $15.000 por día conviene optimizar por
`AddToCart` en lugar de `Lead`.

Reglas:
- **Escalar** +20% cada 3–4 días si el costo por venta real se mantiene por debajo de $10.000 durante 7 días.
- **Cortar un anuncio** que gastó ~$30.000 sin pedidos, o un conjunto con costo por venta mayor a $20.000
  después de 2 semanas.
- Recalcular todo si cambia el precio después de la promo (termina el 30 de noviembre).

## Fase 2 · Creativos
Pendiente. Carpeta: `marketing/meta-ads/creativos/`.

## Fase 3 · IDs creados en Meta
Pendiente.

## Optimización 7 / 14 / 30 días
Pendiente (se completa con la Fase 1).
