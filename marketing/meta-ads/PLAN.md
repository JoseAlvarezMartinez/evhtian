# EVHTIAN · Plan de Meta Ads

Estado: **Fase 3 lista: todo creado como BORRADOR en Meta (nada publicado).** Falta que la dueña revise y publique.
Última actualización: 2026-11-27.

| Fase | Estado |
|---|---|
| 0 · Auditoría y tracking | **Confirmada** 2026-11-27 (Pixel en producción). CAPI publicada pero sin token: todavía no manda eventos del servidor |
| 1 · Estrategia del embudo | Aprobada. BOFU va al sitio (WhatsApp no vinculado, decisión de la dueña) |
| 2 · Creativos (Nano Banana Pro) | **Aprobados** (versión 2, 2026-11-27) |
| 3 · Creación en Meta Ads (en pausa) | **Hecha** (2026-11-27): 6 públicos, 3 campañas, 3 conjuntos, 9 anuncios en borrador |

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

Revisado en producción (2026-11-27): los encabezados de seguridad de `vercel.json` (HSTS, X-Frame-Options,
CSP frame-ancestors, etc.) se siguen aplicando con el adapter. El endpoint `/api/evento/` está publicado
pero responde vacío a todo: **falta cargar `META_CAPI_TOKEN` en Vercel y volver a desplegar**.

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

## Fase 1 · Estrategia del embudo (aprobada, sin crear)

### Calendario de precios (dueña, 2026-11-27)

| Período | Precio | Margen antes de publicidad* | Costo por venta de equilibrio | Objetivo |
|---|---|---|---|---|
| Hasta el 6 de diciembre | $65.000 (promo) | ≈ $19.750 | ≈ $20.000 | $10.000 |
| 7 al 19 de diciembre | $130.000 (lista) | ≈ $81.500 | ≈ $80.000 | $40.000 |
| 20 al 31 de diciembre | $85.000 | ≈ $38.750 | ≈ $38.000 | $19.000 |

\* Precio − costo $42.000 − ~5% de comisiones (supuesto).

Consecuencias para la publicidad:
- **Las imágenes no llevan precio**, así sirven en los tres períodos. El precio va en el texto: cada conjunto
  lleva un anuncio por período con fecha de inicio y fin programadas (ver Fase 3), así el cambio de precio es
  automático y no hay que editar anuncios publicados.
- A $130.000 hay mucho más margen por venta, pero seguramente menos ventas: se mantienen los $25.000 por día
  y se mira el costo por venta real antes de escalar.
- El sitio tiene que cambiar de precio el 7 y el 20 de diciembre; lo hace la dueña.

### Punto de partida

- Pixel nuevo (reemplazado el 2026-11-27): casi sin historial de conversiones. Instagram vinculado.
- Presupuesto: $25.000 por día en total.
- Con poco presupuesto y poco historial, la regla es **pocas campañas, pocos conjuntos y un evento de
  optimización que se repita lo suficiente** (`Lead`). Tres campañas separadas (una por etapa) para que el
  retargeting no se quede sin presupuesto: si todo estuviera en una sola campaña, Meta le daría casi todo a
  la etapa más grande (TOFU).

### Estructura

| | TOFU · captación | MOFU · consideración | BOFU · cierre |
|---|---|---|---|
| Campaña | `EVH_TOFU_Ventas-Lead_BA_2026-12` | `EVH_MOFU_Ventas-Lead_Tibio_2026-12` | `EVH_BOFU_WhatsApp_Caliente_2026-12` |
| Objetivo | Ventas | Ventas | Ventas (o Interacción si Meta no deja Ventas con WhatsApp) |
| Dónde convierte | Sitio web | Sitio web | WhatsApp (anuncio que abre el chat) |
| Optimiza por | `Lead` (pedido enviado por WhatsApp desde el sitio) | `Lead` | Conversaciones iniciadas |
| Presupuesto días 1–7 | $21.000 | $4.000 | — (se activa cuando el público alcanza) |
| Presupuesto desde el día 8 | $15.000 (60%) | $6.000 (24%) | $4.000 (16%) |
| Presupuesto | De campaña (Advantage), 1 conjunto por campaña | ídem | ídem |
| Ubicaciones | Advantage+ sin Audience Network | ídem | Facebook + Instagram (feed, stories, reels) |
| Creativo | 1 imagen: marca y estilo | 1 imagen: producto y beneficios | 1 imagen: producto + escribinos |

**Por qué Ventas optimizando por `Lead` en TOFU (y no Reconocimiento, Tráfico o Interacción):** esas
opciones le piden a Meta impresiones, clics o «me gusta» baratos, y Meta encuentra justo a la gente que hace
eso y no compra. Con Ventas + `Lead`, Meta busca desde el primer día a quienes mandan un pedido. El riesgo es
que al principio haya pocos `Lead`: si a los 7 días hay menos de 10, se cambia el evento de optimización a
`AddToCart` (pasa más seguido) hasta juntar datos, y se vuelve a `Lead` cuando haya ~50 por semana.

### Públicos

**TOFU · mujeres que todavía no conocen la marca**
- Ubicación: **CABA + 40 km** (cubre el GBA, incluido Tigre) **+ La Plata** (Facultad de Medicina de la
  UNLP y muchos hospitales). El resto de la provincia (Mar del Plata, Bahía Blanca) queda para un conjunto
  aparte cuando se escale.
- Mujeres de **22 a 55 años** (residentes desde los 23–24, médicas y enfermeras que siguen activas pasados los 50).
- **Amplio vs. intereses:** con un Pixel sin historial, el público amplio no tiene de dónde aprender y gasta
  en «gente que hace clic». Propuesta: arrancar con **intereses** (medicina, enfermería, odontología,
  kinesiología, instrumentación quirúrgica, residencia médica, uniformes y ambos médicos; los nombres exactos
  se eligen de lo que Meta ofrece hoy, porque sacó muchos intereses de salud) con la **expansión Advantage
  activada**, que deja a Meta salir de esos intereses cuando encuentra mejores resultados. En la semana 3,
  con ~50 `Lead`, se prueba un conjunto amplio (solo mujeres 22–55 + ubicación) contra este.
- Excluir: `Lead` de los últimos 30 días y compradoras (planilla de ventas) de los últimos 180 días.

**MOFU · ya nos vieron, todavía no pidieron** (un solo público combinado, para que alcance el tamaño)
- Visitantes del sitio de los últimos 30 días.
- `ViewContent` o `SizeGuideView` de los últimos 30 días.
- El 25% de visitantes con más tiempo en el sitio (30 días): se suma al mismo público; cuando pase de ~2.000
  personas, va en un conjunto propio.
- Interacción con Instagram y con la página de Facebook en los últimos 60 días.
- Excluir: `Lead` de los últimos 30 días, compradoras de 180 días y el público BOFU (para no pagar dos veces
  por la misma persona).
- Tamaño mínimo: ~1.000 personas. Si al principio no llega, se amplían las ventanas (visitas 90 días,
  Instagram 365 días); si aun así no llega, los $4.000 de MOFU pasan a TOFU esa semana.

**BOFU · mostraron mucha intención** (ventana de 14 días)
- `CustomizeProduct` o `AddToCart` de los últimos 14 días.
- `ViewContent` 2 veces o más en 14 días.
- `Lead` de los últimos 14 días sin compra registrada (se resta la planilla de ventas).
- Excluir: compradoras de los últimos 30 días.
- Se activa cuando el público llega a ~500 personas (estimado: entre el día 7 y el 14).

### BOFU: ¿WhatsApp directo o sitio web? → **sitio web** (decisión de la dueña, 2026-11-27)

El WhatsApp no está vinculado a la página y la dueña no quiere vincularlo: el BOFU va al sitio web
optimizando por `Lead`, igual que TOFU y MOFU. Lo de abajo queda como referencia de la opción descartada.


- Estas personas ya vieron el producto y eligieron color o talle; lo que les falta es sacarse dudas (talle,
  stock, envío, cambios), y eso se resuelve hablando. Un toque y están en el chat, sin volver a pasar por el sitio.
- El anuncio abre WhatsApp con un mensaje ya escrito, que lleva un código fijo para reconocer la venta:
  `¡Hola Evhtian! Vi el anuncio y quiero terminar mi pedido. Código: EVH-BWA`.
- Lo que se pierde: estos clics no generan `Lead` en el sitio; se miden por conversaciones y por el código.
- **Requisito:** el número de WhatsApp de ventas tiene que estar vinculado a la página de Facebook
  (Configuración de la página → WhatsApp). Si no está, el BOFU va al sitio web optimizando por `Lead`.

### Enlaces y UTM

Todos los anuncios que van al sitio llevan en «Parámetros de URL»:

```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}
```

Como el nombre de la campaña incluye `TOFU`/`MOFU`/`BOFU`, el código de pedido de WhatsApp sale con la letra
correcta (`EVH-T…`, `EVH-M…`) sin configurar nada más.

### Atribución y lectura

- Ventana de atribución: 7 días después del clic y 1 día después de la visualización (la estándar).
- La métrica que manda es el **costo por venta real** (inversión ÷ ventas de la planilla con código de esa
  etapa), no el costo por `Lead`.

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

## Fase 2 · Creativos (APROBADOS por la dueña, 2026-11-27, versión 2)

Carpeta: `marketing/meta-ads/creativos/`. Generados con **Nano Banana Pro**, 4K (3712×4608), formato 4:5,
con las fotos reales de los ambos de referencia (`src/assets/products/`). Sin precio en la imagen.

### Cuenta de Meta (auditoría 2026-11-27, solo lectura)

- Cuenta publicitaria: **Evhtian Ecommerce** `1312632337293588` (porfolio Evhtian `2029588714401995`), ARS,
  activa, con medio de pago. Sin campañas ni públicos creados.
- Página: **Evhtian - Ambos Médicos** `1554522161070864`. Instagram: **@evhtian.medicalwear**
  (vinculado a la cuenta publicitaria; Meta no lo muestra emparejado con la página, a revisar en Fase 3).
- Pixel/dataset `1171033125432619`: últimos 7 días 6 `PageView`, 2 `ViewContent`, 1 `AddToCart`,
  1 `InitiateCheckout`, 0 `Lead`. **Eventos del servidor (CAPI): nunca** → falta `META_CAPI_TOKEN` en Vercel.

### Imágenes v2 (aprobadas)

La v1 (fondos de catálogo y tinte rosado) fue rechazada por la dueña el 2026-11-27; quedó en `creativos/borradores/r1/`.
Cambios de la v2: foto estilo documental en lugares reales de un hospital argentino, balance de blancos neutro
y control numérico del color (desvío R−G / B−G de las zonas neutras: v1 hasta +19, v2 dentro de ±2,5).

| Etapa | Archivo | Qué muestra |
|---|---|---|
| TOFU | `EVH_TOFU_marca_4x5.jpg` (+ `_1x1.jpg`, `_4x5_4K.png`) | Dos profesionales caminando y charlando por un pasillo de hospital público (pared verde agua, guardasilla de madera, piso vinílico, silla de ruedas al fondo): Essential bordó y Terra azul marino |
| MOFU | `EVH_MOFU_producto_4x5.jpg` (+ `_1x1.jpg`, `_4x5_4K.png`) | Residente en el vestuario del hospital (lockers grises, azulejos blancos) atándose el pelo: la chaqueta Terra bordó queda en su lugar; se ven el bolsillo del pecho con lapicera, el cordón y los cargo |
| BOFU | `EVH_BOFU_whatsapp_4x5.jpg` (+ `_1x1.jpg`, `_4x5_4K.png`) | Médica apoyada en la pared de un pasillo escribiendo en el celular, Essential negro, con el texto «Escribinos y elegí tu talle» |

- Formatos: 4:5 para el feed; 1:1 recortado a mano (sin cortar cabezas ni el texto); en stories y reels (9:16)
  Meta ubica la imagen 4:5 y el producto queda en la zona segura.
- Revisión de prendas (zoom al 100%): Essential con la chaqueta tapando la cintura, frente liso, **un solo cargo
  en el muslo derecho** con etiqueta «EVHTIAN» horizontal sobre el borde superior; Terra con bolsillo en el pecho
  izquierdo, cordón y cargo con solapa en los dos muslos.
- Correcciones hechas: en TOFU y BOFU se borró el segundo cargo (pierna izquierda) editando un recorte del
  pantalón y se dibujó la etiqueta (la IA la escribe mal); en el MOFU se sacó la solapita de la manga derecha
  (va en la izquierda).
- Costo total de la Fase 2 hasta ahora: ~24 imágenes de Nano Banana Pro (~95 créditos de Higgsfield).

### Copys

Los textos se escriben sin precio fijo; la línea de precio se cambia en cada período (ver abajo).
Cumplen las políticas de Meta: sin afirmaciones absolutas, sin hablarle a la persona por atributos personales.

**TOFU · marca y estilo**
- Texto principal:
  > Ambos médicos pensados para el cuerpo de una mujer y para el ritmo de tu jornada. 🩺
  > Essential y Terra, en bengalina elastizada y con moldería exclusiva: calce femenino, bolsillos donde los
  > necesitás y una tela que acompaña cada movimiento, de la primera a la última hora de la guardia.
  > 5 colores · talles del XS al L según el modelo · envíos a todo el país.
  > {LÍNEA DE PRECIO}
- Título: **Ambos médicos para mujer**
- Descripción: Bengalina elastizada · 5 colores
- Botón: **Ver más**

**MOFU · producto y beneficios**
- Texto principal:
  > Una guardia larga se nota en el ambo. Por eso elegimos una bengalina que se estira con vos y vuelve a su forma.
  > • Suave y firme a la vez: rayón, nylon y spandex
  > • Dos calces: Essential, más entallado; Terra, más relajado
  > • Bolsillos cargo y laterales para tener todo a mano
  > • Guía de talles con medidas en centímetros, para elegir sin dudas
  > {LÍNEA DE PRECIO}
- Título: **La bengalina que se mueve con vos**
- Descripción: Essential y Terra · Guía de talles
- Botón: **Comprar**

**BOFU · cierre por WhatsApp**
- Texto principal:
  > ¿Te quedó alguna duda con el talle o el color? Escribinos por WhatsApp y te ayudamos a elegir. 💬
  > Te confirmamos el stock al momento, coordinamos el envío y, si el talle no te queda, lo podés cambiar
  > dentro de los 7 días.
  > {LÍNEA DE PRECIO}
- Título: **Escribinos y elegí tu talle**
- Descripción: Atención personalizada por WhatsApp
- Botón: **Contactarnos**
- Destino: el sitio (ficha del Essential en negro). El código de pedido lo agrega el sitio al mensaje de WhatsApp.

**Línea de precio por período**
- Hasta el 6 de diciembre: `Black Friday y Cyber Monday: ambo completo (chaqueta + pantalón) a $65.000 hasta el 6 de diciembre. Precio de lista: $130.000.`
- Del 7 al 19 de diciembre: `Ambo completo (chaqueta + pantalón): $130.000.`
- Del 20 al 31 de diciembre: `Promo de fin de año: ambo completo (chaqueta + pantalón) a $85.000 hasta el 31 de diciembre. Precio de lista: $130.000.`
- Cuotas: solo se mencionan con el total a la vista (`3 cuotas de $25.000 con débito, total $75.000`), y el
  monto de las cuotas para $130.000 y $80.000 está a confirmar.

## Fase 3 · Creación en Meta (HECHA 2026-11-27, en borrador)

Cuenta `1312632337293588` (Evhtian Ecommerce) · Página `1554522161070864` · Instagram `@evhtian.medicalwear`
(`17841479603696762`) · Pixel `1171033125432619`.

**Cómo queda «en pausa»:** el conector oficial tiene el *modo borrador* activado. Todo se arma como borrador en
el Administrador de anuncios: no se publica, no entra a revisión y no gasta nada. Para activarlo, la dueña lo
revisa en el Administrador de anuncios y toca **Publicar** (ahí sale activo). Yo no publico nada.

### 1. Públicos personalizados (6)

| Nombre | Regla | Uso |
|---|---|---|
| `EVH_CA_Web_Visitantes_30d` | Todos los visitantes del sitio, 30 días | MOFU |
| `EVH_CA_Web_Modelo-o-Guia_30d` | `ViewContent` o `SizeGuideView`, 30 días | MOFU |
| `EVH_CA_IG_Interaccion_60d` | Interactuó con @evhtian.medicalwear, 60 días | MOFU |
| `EVH_CA_FB_Interaccion_60d` | Interactuó con la página de Facebook, 60 días | MOFU |
| `EVH_CA_Web_IntencionAlta_14d` | `CustomizeProduct`, `AddToCart` o `Lead`, 14 días | BOFU · se excluye de MOFU |
| `EVH_CA_Web_Lead_30d` | `Lead` (pedido enviado por WhatsApp), 30 días | Se excluye de TOFU y MOFU |

El público de compradoras se crea cuando haya ventas cargadas (planilla); por ahora no hay datos.
«Ver un modelo 2 veces» y «25% con más tiempo en el sitio» se suman cuando los públicos superen ~1.000 personas.

### 2. Campañas (3) · objetivo Ventas · presupuesto de campaña · puja de menor costo

| Campaña | Presupuesto por día (días 1–7) | Desde el día 8 |
|---|---|---|
| `EVH_TOFU_Ventas-Lead_BA_2026-12` | $21.000 | $15.000 |
| `EVH_MOFU_Ventas-Lead_Tibio_2026-12` | $4.000 | $6.000 |
| `EVH_BOFU_Ventas-Lead_Caliente_2026-12` | $0 hasta que el público alcance (se publica después) | $4.000 |

El cambio del día 8 se hace a mano (lo hago yo con tu OK o lo hacés vos en el Administrador).

### 3. Conjuntos de anuncios (3) · optimización: conversión `Lead` del Pixel · sitio web · ubicaciones Advantage+

| Conjunto | Público |
|---|---|
| `EVH_TOFU_Mujeres22-55_CABA40km-LaPlata` | Ubicación: CABA + 40 km y La Plata + 15 km (control fijo). **Público Advantage+** con sugerencia de mujeres de 22 a 55 años. Excluye `Lead_30d`. |
| `EVH_MOFU_Tibio_30-60d` | Solo los 4 públicos MOFU (Advantage+ apagado: retargeting). Excluye `IntencionAlta_14d` y `Lead_30d`. Misma ubicación. |
| `EVH_BOFU_IntencionAlta_14d` | Solo `IntencionAlta_14d` (Advantage+ apagado: retargeting). Misma ubicación. |

Cambio respecto de la Fase 1: el conector no permite buscar intereses (no inventa IDs), así que el TOFU usa
**Advantage+ con sugerencias** en lugar de intereses. Es lo que Meta recomienda hoy y con este volumen de datos
rinde parecido. Ojo: en Advantage+ el sexo es una *sugerencia*, no un filtro (Meta puede mostrarlo a algún
hombre si predice que compra, por ejemplo para regalar). Si querés que lo vean **solo mujeres**, se apaga
Advantage+ y el filtro queda fijo.

### 4. Imágenes y anuncios (9 = 3 por conjunto, uno por período de precio)

- Se suben las 3 imágenes aprobadas (4:5) y su versión 1:1 por ubicación.
- Cada conjunto lleva 3 anuncios iguales salvo la línea de precio, con **fechas programadas**:
  `…_P65k` (hasta el 6/12 23:59), `…_P130k` (7/12 al 19/12 23:59) y `…_P85k` (20/12 al 31/12 23:59). Así el precio del
  anuncio cambia solo, sin editar nada.
- Destinos: TOFU → inicio · MOFU → ficha Terra en bordó · BOFU → ficha Essential en negro.
- Parámetros de URL en todos:
  `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}`.
- Identidad: página Evhtian + Instagram @evhtian.medicalwear.
- Botones: TOFU «Más información», MOFU «Comprar», BOFU «Contactarnos».

### Antes de publicar (checklist para la dueña)

1. Cargar `META_CAPI_TOKEN` en Vercel (hoy el Pixel no recibe eventos del servidor).
2. Que el sitio muestre **$130.000 el 7/12** y **$85.000 el 20/12** (si no, el anuncio y la web no coinciden).
3. Revisar en el Administrador de anuncios: borradores, vista previa de cada anuncio (feed, stories, reels).
4. Publicar TOFU y MOFU. Publicar BOFU cuando `IntencionAlta_14d` tenga ~500 personas.

## Fase 3 · IDs creados en Meta (borradores, nada publicado)

Ajuste técnico: Meta no deja optimizar una campaña de **Ventas** por `Lead`. Los conjuntos optimizan por
**`InitiateCheckout`**, que el sitio dispara en el mismo clic que `Lead` (pedido enviado por WhatsApp): es la
misma señal. Cuando haya compras cargadas, se puede pasar a optimizar por `Purchase`.

Las imágenes no se pudieron subir por el conector (la subida directa todavía no está habilitada para la cuenta
y Meta no descarga desde Higgsfield): las sube la dueña con la ventana de carga del conector.
Sin marca de «hecho con IA» (decisión de la dueña: en Argentina no es obligatorio).

**Públicos**

| Nombre | ID |
|---|---|
| EVH_CA_Web_Visitantes_30d | 120254150198660652 |
| EVH_CA_Web_Modelo-o-Guia_30d | 120254150198810652 |
| EVH_CA_Web_IntencionAlta_14d | 120254150199090652 |
| EVH_CA_Web_Lead_30d | 120254150199300652 |
| EVH_CA_IG_Interaccion_60d | 120254150202490652 |
| EVH_CA_FB_Interaccion_60d | 120254150203020652 |

**Campañas y conjuntos**

| Campaña | ID | Presupuesto/día | Conjunto | ID |
|---|---|---|---|---|
| EVH_TOFU_Ventas-Lead_BA_2026-12 | 120254150231920652 | $21.000 | EVH_TOFU_Mujeres22-55_CABA40km-LaPlata | 120254150235200652 |
| EVH_MOFU_Ventas-Lead_Tibio_2026-12 | 120254150232460652 | $4.000 | EVH_MOFU_Tibio_30-60d | 120254150237950652 |
| EVH_BOFU_Ventas-Lead_Caliente_2026-12 | 120254150232620652 | $4.000 | EVH_BOFU_IntencionAlta_14d | 120254150238180652 |

**Imágenes en la cuenta (hash):** TOFU 4:5 `5cfcf6337f348fc8f5ab70584182aedf` · 1:1 `4b52bf778068a238683450e7a3c97261` ·
MOFU 4:5 `9e7c3fd4fdf9e8efa43fdbb45cce4e97` · 1:1 `1b124c20bded6229ae6d75785446df8f` · BOFU 4:5 `92e498c952c4f7a5cafbce87c037eb09` ·
1:1 `68795eedd64d57396c32ca99aaf34f56`. La 1:1 se usa en la columna derecha y Marketplace de Facebook; el resto usa la 4:5.

**Anuncios (9, borrador, fechas en hora de Argentina)**

| Anuncio | ID | Creativo | Se muestra |
|---|---|---|---|
| EVH_TOFU_marca_P65k | 120254150336170652 | 1711861083745380 | desde que se publica hasta el 6/12 23:59 |
| EVH_TOFU_marca_P130k | 120254150336540652 | 1139962988817285 | 7/12 00:00 → 19/12 23:59 |
| EVH_TOFU_marca_P85k | 120254150336850652 | 1846213033239473 | 20/12 00:00 → 31/12 23:59 |
| EVH_MOFU_producto_P65k | 120254150341310652 | 1720888889692413 | hasta el 6/12 23:59 |
| EVH_MOFU_producto_P130k | 120254150341550652 | 4698793193691531 | 7/12 → 19/12 |
| EVH_MOFU_producto_P85k | 120254150342070652 | 2254104208484137 | 20/12 → 31/12 |
| EVH_BOFU_whatsapp_P65k | 120254150342260652 | 1599489511862302 | hasta el 6/12 23:59 |
| EVH_BOFU_whatsapp_P130k | 120254150342960652 | 1664188461856639 | 7/12 → 19/12 |
| EVH_BOFU_whatsapp_P85k | 120254150343410652 | 2118121065568429 | 20/12 → 31/12 |

Todos con parámetros UTM (`utm_campaign={{campaign.name}}`, etc.) y las mejoras automáticas de Meta
(Advantage+ creativo: brillo, texto generado, etc.) **apagadas**, para que el producto se vea tal cual.

### Checklist para publicar (lo hace la dueña en el Administrador de anuncios)

1. [ ] Cargar `META_CAPI_TOKEN` en Vercel y volver a desplegar.
2. [ ] Subir el commit de la promo «hasta el 6 de diciembre».
3. [ ] En el Administrador de anuncios → **Borradores**: revisar las 3 campañas y la vista previa de cada
       anuncio (feed, stories, reels) en celular.
4. [ ] Publicar **TOFU y MOFU**. (Si se publica después del 6/12, el anuncio `_P65k` no se muestra: es correcto.)
5. [ ] Publicar **BOFU** cuando `EVH_CA_Web_IntencionAlta_14d` tenga ~500 personas (Audiencias → tamaño).
6. [ ] Día 8: TOFU de $21.000 a $15.000 por día y MOFU de $4.000 a $6.000.
7. [ ] 7/12 y 20/12: cambiar el precio en el sitio (los anuncios cambian solos).
8. [ ] Cargar cada venta cerrada en la planilla (con el código EVH-) y subirla una vez por semana.

## Optimización 7 / 14 / 30 días

**Qué mirar en cada etapa**

| Etapa | Métrica principal | Señales de alerta |
|---|---|---|
| TOFU | Costo por `InitiateCheckout` (pedido por WhatsApp) y CTR del enlace | CTR < 0,8% después de 3.000 impresiones · CPM que se duplica |
| MOFU | Costo por pedido · tasa de pedido sobre clics | Frecuencia > 4 en 7 días |
| BOFU | Costo por pedido · ventas reales con código `EVH-B` | Frecuencia > 6 en 7 días |
| Todas | **Costo por venta real** = inversión ÷ ventas de la planilla con el código de esa etapa | Por encima del equilibrio del período |

**Días 1 a 7 (aprendizaje):** no tocar presupuestos, públicos ni anuncios (cada cambio reinicia el aprendizaje).
Solo revisar que gaste, que no haya anuncios rechazados y que los pedidos lleguen con su código.
Si a los 7 días hay menos de 10 pedidos en el TOFU, cambiar la optimización a `AddToCart`.

**Días 8 a 14:** aplicar los presupuestos del día 8. Cortar un anuncio que gastó ~$30.000 sin pedidos.
Si el costo por venta real está por debajo del objetivo del período durante 7 días, subir el presupuesto un
20% cada 3–4 días (nunca más del 20% de una vez). Publicar el BOFU si su público llegó a ~500.

**Días 15 a 30:**
- **Creativos nuevos** cuando la frecuencia pase de 3–4 o el CTR baje un 30% respecto de la primera semana:
  sumar 2–3 imágenes nuevas por etapa (otros colores, otras escenas) en el mismo conjunto.
- **Probar público amplio** en el TOFU (sin sugerencias) contra el actual, si hay ~50 pedidos por semana.
- **Pasar a optimizar por compra (`Purchase`)** cuando se carguen ~50 ventas reales por mes (planilla subida
  a Meta o API de Conversiones): ahí Meta aprende de quién compra de verdad y no solo de quién escribe.
- Revisar el costo por venta real de cada etapa y mover presupuesto hacia la que venda más barato.
- Ojo con los cambios de precio (7/12 y 20/12): el rendimiento puede cambiar de golpe; comparar cada período
  con su propio objetivo, no con el anterior.
